// Renders the app to static HTML and injects it into dist/index.html so
// crawlers (and first paint) get real content before JavaScript runs.
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const ssrDir = path.join(root, "dist-ssr");
const indexPath = path.join(root, "dist", "index.html");
const PLACEHOLDER = "<!--app-html-->";

const { render } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const template = await readFile(indexPath, "utf8");
if (!template.includes(PLACEHOLDER)) {
  throw new Error(`${PLACEHOLDER} not found in dist/index.html`);
}

await writeFile(indexPath, template.replace(PLACEHOLDER, () => render()));
await rm(ssrDir, { recursive: true, force: true });

console.log("Prerendered dist/index.html");
