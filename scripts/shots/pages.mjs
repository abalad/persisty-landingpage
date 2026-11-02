// Full-page screenshots of some of the site's pages, at desktop and phone widths.
// usage: node scripts/shots/pages.mjs <base-url> <out-dir> <path>...
// Writes <out-dir>/<slug>-desktop.png (1280 wide) and <slug>-mobile.png (390 wide).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { openBrowser, sleep } from "../e2e/lib.mjs";

export const WIDTHS = { desktop: { width: 1280, height: 900, mobile: false, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, mobile: true, deviceScaleFactor: 2 } };

/** `/pro?tried=queue#queue` becomes `pro-tried-queue-queue`; `/` becomes `home`. */
export const slug = (path) => path.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";

/** Scrolls to the end and back so anything that appears on scroll is drawn, then captures the whole page (up to 16,000 px). */
export async function capture(b, file) {
  await b.evaluate(`(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); })()`);
  await sleep(600);
  const { result } = await b.send("Page.getLayoutMetrics");
  const size = result.cssContentSize ?? result.contentSize;
  const height = Math.min(Math.ceil(size.height), 16000);
  const shot = await b.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: Math.ceil(size.width), height, scale: 1 } });
  writeFileSync(file, Buffer.from(shot.result.data, "base64"));
}

/** Captures the current viewport only, as a person sees it (after a jump to an anchor, say). */
export async function captureViewport(b, file) {
  const shot = await b.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(file, Buffer.from(shot.result.data, "base64"));
}

export async function open(b, url, wait = 2500) {
  await b.send("Page.navigate", { url });
  await sleep(wait);
}

export async function setWidth(b, name) {
  await b.send("Emulation.setDeviceMetricsOverride", WIDTHS[name]);
}

async function main() {
  const [base, out, ...paths] = process.argv.slice(2);
  if (!base || !out || paths.length === 0) throw new Error("usage: node scripts/shots/pages.mjs <base-url> <out-dir> <path>...");
  mkdirSync(out, { recursive: true });
  const b = await openBrowser();
  try {
    for (const name of Object.keys(WIDTHS)) {
      await setWidth(b, name);
      for (const path of paths) {
        await open(b, base + path);
        const file = join(out, `${slug(path)}-${name}.png`);
        // A page opened at an anchor is shown where it lands; the rest, whole.
        if (path.includes("#")) await captureViewport(b, file);
        else await capture(b, file);
        console.log(file);
      }
    }
  } finally {
    b.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
