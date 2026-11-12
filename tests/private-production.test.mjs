import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { verifyPrivateProduction } from "../scripts/verify-private-production.mjs";
import { requireOperator } from "../app/lib/operator.mjs";

const urls = { licenseApi: "https://license.example.com", checkout: "https://shop.lemonsqueezy.com/checkout/buy/example" };

test("production output validation catches test controls and private source leaks", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "psync-output-check-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const bundle = `${urls.licenseApi} ${urls.checkout}`;
  await Promise.all([
    writeFile(join(directory, "premium-journal.js"), bundle),
    writeFile(join(directory, "premium-journal.css"), "body{}"),
    writeFile(join(directory, "index.html"), '<script src="/premium-journal.js"></script>'),
    writeFile(join(directory, "journal.html"), "Journal"),
    writeFile(join(directory, "imagery.html"), '<main data-exercise-source="private"></main>'),
    ...["privacy", "terms", "subscription", "contact"].map((page) => writeFile(join(directory, `${page}.html`), page)),
  ]);
  await verifyPrivateProduction(directory, urls);
  await assert.rejects(verifyPrivateProduction(directory, { licenseApi: "", checkout: "" }), /URLs are required/);
  await writeFile(join(directory, "imagery.html"), '<main data-exercise-source="demo"></main>');
  await assert.rejects(verifyPrivateProduction(directory, urls), /private exercises/);
  await writeFile(join(directory, "imagery.html"), '<main data-exercise-source="private"></main>');
  await writeFile(join(directory, "premium-journal.js"), `${bundle} Activate 30-day local test access`);
  await assert.rejects(verifyPrivateProduction(directory, urls), /test activation/);
  await writeFile(join(directory, "premium-journal.js"), bundle);
  await mkdir(join(directory, "premium-private"));
  await assert.rejects(verifyPrivateProduction(directory, urls), /Private file or directory/);
  await rm(join(directory, "premium-private"), { recursive: true });
  await writeFile(join(directory, "premium-journal.js.map"), "{}");
  await assert.rejects(verifyPrivateProduction(directory, urls), /Source or configuration/);
});

test("paid build requires complete public operator details and a usable support email", () => {
  assert.equal(requireOperator({}).name, "EKAI LTD");
  assert.throws(() => requireOperator({ PSYNC_OPERATOR_NAME: "" }), /operator details are required/);
  assert.throws(() => requireOperator({ PSYNC_SUPPORT_EMAIL: "not-an-email" }), /valid public support email/);
});
