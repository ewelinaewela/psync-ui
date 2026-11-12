// Public contributor demo only. No real exercises, licenses or payment calls.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const { chromium } = await import(process.env.PSYNC_PLAYWRIGHT_MODULE ?? "playwright");
const env = { ...process.env, PSYNC_EXERCISE_MODE: "demo", PSYNC_PRIVATE_PREVIEW: "", PSYNC_BASE_PATH: "" };
function run(script) {
  return new Promise((done, fail) => {
    const child = spawn(process.execPath, [script, ...(script.includes("vinext") ? ["build"] : [])], { cwd: root, env, stdio: "inherit" });
    child.on("error", fail);
    child.on("exit", (code) => code === 0 ? done() : fail(new Error(`Demo build failed (${code})`)));
  });
}
await run("node_modules/vinext/dist/cli.js");
await run("scripts/prepare-static-output.mjs");
const dist = join(root, "dist", "client");
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let file = resolve(dist, `.${path}`);
    if (file !== dist && !file.startsWith(dist + sep)) throw new Error("Invalid path");
    if (path === "/") file = join(dist, "index.html");
    else if (!extname(file)) file += ".html";
    const body = await readFile(file);
    const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml" };
    response.writeHead(200, { "Content-Type": mime[extname(file)] ?? "application/octet-stream" });
    response.end(body);
  } catch { response.writeHead(404); response.end("Not found"); }
});
let browser;
const results = [];
try {
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.env.PSYNC_CHROME_PATH ? { executablePath: process.env.PSYNC_CHROME_PATH } : {}) });
  for (const route of ["/imagery", "/inner-voice", "/anxiety/balance", "/anxiety/pressure"]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await context.route("**/*", (request) => request.request().url().startsWith(origin + "/") ? request.continue() : request.abort());
    page.setDefaultTimeout(6000);
    try {
      await page.goto(origin + route);
      await page.locator('[data-exercise-source="demo"]').waitFor();
      assert.equal(await page.locator('[data-exercise-source="private"]').count(), 0);
      await page.getByRole("button", { name: "Begin demo" }).click();
      async function next() {
        const button = page.getByRole("button", { name: /^(Continue|Complete demo)/ });
        await button.focus(); await button.press("Enter");
      }
      await next();
      await page.getByRole("alert").waitFor();
      await page.getByRole("textbox", { name: "Sample title", exact: true }).fill("Interface test");
      await page.getByRole("textbox", { name: "Sample notes", exact: true }).fill("Fictional sample <script>window.unwanted=true</script>");
      await page.getByRole("radio", { name: "Option two" }).check();
      await next();
      await page.clock.install();
      await page.getByRole("button", { name: "Start 30 seconds" }).click();
      await page.clock.runFor(3000);
      assert.equal(await page.locator(".timer-value").innerText(), "27");
      await page.getByRole("button", { name: "Pause", exact: true }).click();
      await page.clock.runFor(2000);
      assert.equal(await page.locator(".timer-value").innerText(), "27");
      await next(); await next();
      await page.getByRole("heading", { name: "Interface test" }).waitFor();
      assert.equal(await page.evaluate(() => Boolean(window.unwanted)), false);
      assert.equal(await page.evaluate(() => localStorage.length), 0);
      await page.getByRole("button", { name: "Practise again" }).click();
      assert.equal(await page.locator(".timer-value").innerText(), "30");
      await next(); await next();
      await page.getByRole("button", { name: "Edit answers" }).click();
      assert.equal(await page.getByRole("textbox", { name: "Sample title", exact: true }).inputValue(), "Interface test");
      const size = await page.evaluate(() => ({ actual: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert(size.actual <= size.viewport + 1, "Mobile page overflows horizontally");
      await page.reload();
      await page.getByRole("button", { name: "Begin demo" }).click();
      assert.equal(await page.getByRole("textbox", { name: "Sample notes", exact: true }).inputValue(), "");
      assert.deepEqual(errors, []);
      results.push({ route, status: "passed" });
      console.log(`PASS contributor demo ${route}`);
    } catch (error) {
      results.push({ route, status: "failed", error: error.message });
      console.log(`FAIL contributor demo ${route}: ${error.message}`);
    } finally { await context.close(); }
  }
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
  const folder = join(root, "artifacts", "qa-2026-11-12-contributor-split");
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, "demo-browser-results.json"), JSON.stringify({ mockContent: true, results }, null, 2));
}
if (results.length !== 4 || results.some((result) => result.status !== "passed")) process.exitCode = 1;
