import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const viteCli = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const vinextCli = fileURLToPath(new URL("../node_modules/vinext/dist/cli.js", import.meta.url));
const premiumOutputDirectory = fileURLToPath(new URL("../public/", import.meta.url));

function run(cli, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { stdio: "inherit", env });
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

const buildCode = await run(viteCli, ["build", "--config", "premium-private/vite.config.ts"], {
  ...process.env,
  PSYNC_PREMIUM_OUT_DIR: premiumOutputDirectory,
  PSYNC_TEST_MODE: "1",
  PSYNC_LICENSE_API_URL: process.env.PSYNC_LICENSE_API_URL ?? "https://psync-license.ekai-operations.workers.dev",
  PSYNC_CHECKOUT_URL: process.env.PSYNC_CHECKOUT_URL ?? "https://psync.lemonsqueezy.com/checkout/buy/57c63d56-9479-4a53-bf7b-086528137ab9",
});
if (buildCode !== 0) process.exit(buildCode);

console.log("Private Journal preview: http://localhost:3000/journal");
const devCode = await run(vinextCli, ["dev"], {
  ...process.env,
  PSYNC_PRIVATE_PREVIEW: "1",
  PSYNC_EXERCISE_MODE: "private",
  PSYNC_PRIVATE_BUILD_ID: String(Date.now()),
  PSYNC_BASE_PATH: "",
});
process.exitCode = devCode;
