import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { verifyPrivateProduction } from "./verify-private-production.mjs";
import { requireOperator } from "../app/lib/operator.mjs";

const project = fileURLToPath(new URL("../", import.meta.url));
const viteCli = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const vinextCli = fileURLToPath(new URL("../node_modules/vinext/dist/cli.js", import.meta.url));
const prepareOutput = fileURLToPath(new URL("./prepare-static-output.mjs", import.meta.url));
const premiumConfig = fileURLToPath(new URL("../premium-private/vite.config.ts", import.meta.url));
const premiumOutput = fileURLToPath(new URL("../public/", import.meta.url));
const outputJournal = fileURLToPath(new URL("../dist/client/premium-journal.js", import.meta.url));
const outputIndex = fileURLToPath(new URL("../dist/client/index.html", import.meta.url));
const knownTestCheckout = "57c63d56-9479-4a53-bf7b-086528137ab9";

function productionUrl(name, value, expectedHost) {
  if (!value) throw new Error(`${name} is required for a paid production build.`);
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`${name} must use HTTPS.`);
  if (expectedHost && url.hostname !== expectedHost && !url.hostname.endsWith(`.${expectedHost}`)) throw new Error(`${name} must use ${expectedHost}.`);
  return url;
}

function run(cli, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd: project, env, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${args.join(" ")} exited with code ${code ?? 1}.`)));
  });
}

if (process.env.PSYNC_TEST_MODE === "1") throw new Error("Production builds cannot enable PSYNC_TEST_MODE.");
requireOperator();
const licenseApi = productionUrl("PSYNC_LICENSE_API_URL", process.env.PSYNC_LICENSE_API_URL);
const checkout = productionUrl("PSYNC_CHECKOUT_URL", process.env.PSYNC_CHECKOUT_URL, "lemonsqueezy.com");
if (checkout.pathname.includes(knownTestCheckout)) throw new Error("PSYNC_CHECKOUT_URL still points to the known test-mode checkout. Copy the Live mode checkout URL first.");

await access(premiumConfig).catch(() => { throw new Error("The private premium source is missing. Run this command from the complete local workspace."); });

const productionEnvironment = {
  ...process.env,
  PSYNC_LICENSE_API_URL: licenseApi.toString().replace(/\/$/, ""),
  PSYNC_CHECKOUT_URL: checkout.toString(),
  PSYNC_PREMIUM_OUT_DIR: premiumOutput,
  PSYNC_PRIVATE_PREVIEW: "1",
  PSYNC_EXERCISE_MODE: "private",
  PSYNC_PRIVATE_BUILD_ID: String(Date.now()),
  PSYNC_BASE_PATH: process.env.PSYNC_BASE_PATH ?? "",
};
delete productionEnvironment.PSYNC_TEST_MODE;

console.log("Building the production Private Journal bundle (test access disabled)…");
await run(viteCli, ["build", "--config", premiumConfig], productionEnvironment);
console.log("Building the production Psync application…");
await run(vinextCli, ["build"], productionEnvironment);
await run(prepareOutput, [], productionEnvironment);
await Promise.all([access(outputJournal), access(outputIndex)]);
await verifyPrivateProduction(fileURLToPath(new URL("../dist/client/", import.meta.url)), {
  licenseApi: productionEnvironment.PSYNC_LICENSE_API_URL,
  checkout: productionEnvironment.PSYNC_CHECKOUT_URL,
});
console.log("Production build ready in dist/client. No files were deployed.");
