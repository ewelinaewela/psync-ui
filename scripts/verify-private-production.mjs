import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Inspect generated static files only; never print license credentials or tokens.
export async function verifyPrivateProduction(directory, { licenseApi, checkout }) {
  assert(licenseApi && checkout, "Both production URLs are required for output verification.");
  const root = resolve(directory);
  async function inspect(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      assert(!entry.isSymbolicLink(), "Production output must not contain symbolic links.");
      assert(!/^(?:\.git|\.env.*|node_modules|premium-private|worker)$/i.test(entry.name), `Private file or directory in production output: ${entry.name}`);
      assert(!/\.(?:map|tsx?|pem|toml|docx?|pptx?|pdf)$/i.test(entry.name), `Source or configuration file in production output: ${entry.name}`);
      if (entry.isDirectory()) await inspect(join(folder, entry.name));
    }
  }
  await inspect(root);
  const [bundle, home] = await Promise.all([
    readFile(join(root, "premium-journal.js"), "utf8"),
    readFile(join(root, "index.html"), "utf8"),
    readFile(join(root, "premium-journal.css"), "utf8"),
    readFile(join(root, "journal.html"), "utf8"),
    readFile(join(root, "privacy.html"), "utf8"),
    readFile(join(root, "terms.html"), "utf8"),
    readFile(join(root, "subscription.html"), "utf8"),
    readFile(join(root, "contact.html"), "utf8"),
  ]);
  assert(bundle.includes(licenseApi), "License API URL missing from production bundle.");
  assert(bundle.includes(checkout), "Checkout URL missing from production bundle.");
  assert(!bundle.includes("Activate 30-day local test access"), "Local test activation is present in production output.");
  assert(!bundle.includes("Test access expiry"), "Local test expiry control is present in production output.");
  assert(!bundle.includes("57c63d56-9479-4a53-bf7b-086528137ab9"), "Known test checkout present in production output.");
  assert(home.includes("premium-journal.js"), "Production homepage does not load the journal bundle.");
  const exercise = await readFile(join(root, "imagery.html"), "utf8");
  assert(exercise.includes('data-exercise-source="private"'), "Production build must include the private exercises, not the contributor demo.");
  assert(!home.includes("Contributor demo"), "Contributor demo banner must not appear in the production app.");
  console.log("Production output verified: journal included, configured URLs present, no local test controls or private source files.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await verifyPrivateProduction(process.argv[2] ?? "dist/client", {
    licenseApi: process.env.PSYNC_LICENSE_API_URL ?? "",
    checkout: process.env.PSYNC_CHECKOUT_URL ?? "",
  });
}
