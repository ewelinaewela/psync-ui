import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import test from "node:test";

const root = new URL("../", import.meta.url);
const output = new URL("dist/client/", root);
async function files(folder) {
  const found = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), folder);
    if (entry.isDirectory()) found.push(...await files(url));
    else found.push(url);
  }
  return found;
}

test("public exercise pages contain sample content and no private implementation marker", async () => {
  for (const path of ["imagery", "inner-voice", "anxiety/balance", "anxiety/pressure"]) {
    const html = await readFile(new URL(`${path}.html`, output), "utf8");
    assert(html.includes('data-exercise-source="demo"'));
    assert(html.includes("Explore the contributor demo"));
  }
  for (const url of await files(output)) {
    assert(!/\.(docx?|pptx?|pdf|map)$/i.test(url.pathname), "Source document or source map in public output");
    if (/\.(js|html|rsc)$/.test(url.pathname)) {
      const text = await readFile(url, "utf8");
      assert(!text.includes('data-exercise-source="private"'));
      assert(!text.includes('exercise-source":"private'));
      assert(!text.includes("premium-private/exercises"));
    }
  }
});

test("source documents and private source paths are not tracked in the public repository", () => {
  const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean);
  assert(!tracked.some((path) => /^(Psync_content|premium-private|\.tmp_protocol_review)\//.test(path)));
  assert(!tracked.some((path) => /\.(docx?|pptx?)$/i.test(path)));
});

test("pull-request checks cannot deploy and Pages publishing is manual", async () => {
  const pages = await readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8");
  assert(pages.includes("workflow_dispatch:"));
  assert.doesNotMatch(pages, /^\s+(push|pull_request|pull_request_target):/m);
  const checks = await readFile(new URL(".github/workflows/contributor-checks.yml", root), "utf8");
  assert(checks.includes("pull_request:"));
  assert.doesNotMatch(checks, /pull_request_target|secrets\.|pages: write|id-token: write|deploy-pages@/);
});
