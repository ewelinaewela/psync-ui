import { rename, rm, writeFile } from "node:fs/promises";

const outputMarker = new URL("../dist/client/.nojekyll", import.meta.url);
const buildMetadata = new URL("../dist/client/.vite/", import.meta.url);
const basePath = (process.env.PSYNC_BASE_PATH ?? "").replace(/^\/+|\/+$/g, "");

if (basePath) {
  const scopedOutput = new URL(`../dist/client/${basePath}/`, import.meta.url);
  const scopedStaticAssets = new URL("_next/", scopedOutput);
  const rootStaticAssets = new URL("../dist/client/_next/", import.meta.url);

  try {
    await rm(rootStaticAssets, { force: true, recursive: true });
    await rename(scopedStaticAssets, rootStaticAssets);
    await rm(scopedOutput, { force: true, recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

await rm(buildMetadata, { force: true, recursive: true });
if (process.env.PSYNC_PRIVATE_PREVIEW !== "1") {
  await rm(new URL("../dist/client/premium-journal.js", import.meta.url), { force: true });
  await rm(new URL("../dist/client/premium-journal.css", import.meta.url), { force: true });
}
await writeFile(outputMarker, "", "utf8");
