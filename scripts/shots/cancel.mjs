// Walks the cancelling dialog on a page that shows it with a stand-in for the
// retention function, checks the keyboard (Tab stays inside, Escape closes,
// focus goes back) and captures each step on desktop and phone.
// usage: node scripts/shots/cancel.mjs <base-url> <out-dir> [preview-path]
// The preview page (default /cancel-preview) is a fixture kept outside the repo.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { openBrowser, sleep } from "../e2e/lib.mjs";
import { captureViewport, open, setWidth } from "./pages.mjs";

const [base, out, preview = "/cancel-preview"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await openBrowser();
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "ok" : "not ok"} - ${name}${extra ? ` (${extra})` : ""}`);
  if (!ok) failed = 1;
};
const key = async (k) => {
  const codes = { Tab: 9, Escape: 27, Enter: 13 };
  await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code: k, windowsVirtualKeyCode: codes[k] ?? 0 });
  await b.send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: k, windowsVirtualKeyCode: codes[k] ?? 0 });
  await sleep(120);
};
const clickText = (text) => b.evaluate(`(() => { const el = [...document.querySelectorAll("dialog button, dialog label")].find((x) => x.textContent.trim().startsWith(${JSON.stringify(text)})); if (!el) return false; el.click(); return true; })()`);
const title = () => b.evaluate(`document.getElementById("cancel-title")?.textContent ?? ""`);

try {
  for (const width of ["desktop", "mobile"]) {
    await setWidth(b, width);
    await open(b, `${base}${preview}?open=1`, 3500);
    check(`${width}: the dialog opens`, (await b.evaluate(`document.querySelector("dialog")?.open === true`)) === true);
    await sleep(1200);
    await clickText("Está caro");
    await captureViewport(b, join(out, `1-reason-${width}.png`));
    check(`${width}: no sideways scroll`, (await b.evaluate("document.documentElement.scrollWidth <= window.innerWidth")) === true);
    await clickText("Continuar");
    await sleep(900);
    check(`${width}: the discount comes second`, /pagar menos/.test(await title()), await title());
    await captureViewport(b, join(out, `2-discount-${width}.png`));
    await clickText("Não, continuar cancelando");
    await sleep(900);
    check(`${width}: then the free month`, /30 dias/.test(await title()), await title());
    await captureViewport(b, join(out, `3-free-${width}.png`));
    await clickText("Não, cancelar");
    await sleep(900);
    check(`${width}: then the confirmation`, /Cancelar o Pro/.test(await title()), await title());
    await captureViewport(b, join(out, `4-confirm-${width}.png`));
    await clickText("Confirmar cancelamento");
    await sleep(1400);
    await captureViewport(b, join(out, `5-done-${width}.png`));
  }

  await setWidth(b, "desktop");
  await open(b, `${base}${preview}`, 3000);
  await b.evaluate(`document.getElementById("opener").focus(); document.getElementById("opener").click()`);
  await sleep(1500);
  for (let i = 0; i < 14; i++) await key("Tab");
  check("Tab stays inside the dialog", (await b.evaluate(`document.querySelector("dialog").contains(document.activeElement)`)) === true);
  await key("Escape");
  await sleep(400);
  check("Escape closes it", (await b.evaluate(`!document.querySelector("dialog")`)) === true);
  check("focus goes back to what opened it", (await b.evaluate(`document.activeElement?.id`)) === "opener", await b.evaluate(`document.activeElement?.tagName + "#" + document.activeElement?.id`));

  for (const [name, query] of [["refund", "refund=1"], ["duplicate", "dup=1"], ["team", "plan=team"]]) {
    await open(b, `${base}${preview}?open=1&${query}`, 3500);
    await sleep(800);
    await clickText("Continuar");
    await sleep(600);
    if (name === "team") await captureViewport(b, join(out, `team-discount-desktop.png`));
    if (name !== "duplicate") {
      await clickText("Não, continuar cancelando");
      await sleep(600);
      await clickText("Não, cancelar");
      await sleep(600);
    }
    await captureViewport(b, join(out, `${name}-confirm-desktop.png`));
  }

  // The still picture for browsers without WebGL: the mascot, sad, at twice the size.
  await b.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 2, mobile: false });
  await open(b, `${base}${preview}?open=1`, 4000);
  const r = JSON.parse(await b.evaluate(`JSON.stringify(document.querySelector("dialog canvas")?.getBoundingClientRect() ?? null)`));
  if (r) {
    const shot = await b.send("Page.captureScreenshot", { format: "png", clip: { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 } });
    (await import("node:fs")).writeFileSync(join(out, "mascot-cancel.png"), Buffer.from(shot.result.data, "base64"));
    check("still picture captured", true);
  } else check("still picture captured", false, "no canvas");
} finally {
  b.close();
}
process.exit(failed);
