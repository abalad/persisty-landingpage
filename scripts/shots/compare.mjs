// Before and after, side by side: captures pages on two running copies of the
// site and writes <out-dir>/index.html to compare them.
// usage: node scripts/shots/compare.mjs <before-url> <after-url> <out-dir> <path>... [-- <after-only path>...]
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { openBrowser } from "../e2e/lib.mjs";
import { WIDTHS, capture, captureViewport, open, setWidth, slug } from "./pages.mjs";

const [beforeUrl, afterUrl, out, ...rest] = process.argv.slice(2);
const split = rest.indexOf("--");
const both = split < 0 ? rest : rest.slice(0, split);
const afterOnly = split < 0 ? [] : rest.slice(split + 1);
mkdirSync(join(out, "before"), { recursive: true });
mkdirSync(join(out, "after"), { recursive: true });

const b = await openBrowser();
const rows = [];
try {
  for (const width of Object.keys(WIDTHS)) {
    await setWidth(b, width);
    for (const path of [...both, ...afterOnly]) {
      const file = `${slug(path)}-${width}.png`;
      const shoot = async (base, dir) => {
        await open(b, base + path);
        if (path.includes("#")) await captureViewport(b, join(out, dir, file));
        else await capture(b, join(out, dir, file));
      };
      const hasBefore = both.includes(path);
      if (hasBefore) await shoot(beforeUrl, "before");
      await shoot(afterUrl, "after");
      rows.push({ path, width, file, hasBefore });
      console.log(`${width} ${path}`);
    }
  }
} finally {
  b.close();
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Persisty: antes e depois</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; padding: 24px; background: #0a0c10; color: #d8dde6; font: 14px/1.5 system-ui, sans-serif; }
  h1 { font-weight: 400; margin: 0 0 8px; }
  section { margin: 40px 0; }
  h2 { font-weight: 500; font-size: 15px; margin: 0 0 12px; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  .pair.mobile { grid-template-columns: repeat(2, minmax(0, 390px)); }
  figure { margin: 0; }
  figcaption { color: #98a1b3; margin-bottom: 6px; }
  img { width: 100%; border: 1px solid #262b37; border-radius: 6px; }
  .none { display: grid; place-items: center; min-height: 160px; border: 1px dashed #262b37; border-radius: 6px; color: #98a1b3; }
</style>
<h1>Antes (main) e depois (feat/plan-pages)</h1>
<p>Cada linha mostra a mesma página nas duas versões. Páginas novas aparecem só do lado de depois.</p>
${rows
  .map(
    (r) => `<section><h2>${esc(r.path)} · ${r.width === "desktop" ? "desktop, 1280 px" : "celular, 390 px"}</h2><div class="pair ${r.width}">
  <figure><figcaption>Antes</figcaption>${r.hasBefore ? `<img loading="lazy" src="before/${r.file}" alt="">` : `<div class="none">Página nova</div>`}</figure>
  <figure><figcaption>Depois</figcaption><img loading="lazy" src="after/${r.file}" alt=""></figure>
</div></section>`,
  )
  .join("\n")}
`;
writeFileSync(join(out, "index.html"), html);
console.log(join(out, "index.html"));
