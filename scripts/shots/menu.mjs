// Checks the features menu by keyboard and on a phone, and captures it.
// usage: node scripts/shots/menu.mjs <base-url> <out-dir>
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { openBrowser, sleep } from "../e2e/lib.mjs";
import { captureViewport, open, setWidth } from "./pages.mjs";

const [base, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await openBrowser();
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "ok" : "not ok"} - ${name}${extra ? ` (${extra})` : ""}`);
  if (!ok) failed = 1;
};
const key = async (k, code = k) => {
  await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, windowsVirtualKeyCode: { ArrowDown: 40, Escape: 27, Enter: 13, Tab: 9 }[k] ?? 0 });
  await b.send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code });
  await sleep(150);
};

try {
  await setWidth(b, "desktop");
  await open(b, base + "/");
  await b.evaluate(`document.querySelector('nav [aria-controls][aria-expanded]').click()`);
  await sleep(400);
  check("opens on click", (await b.evaluate(`document.querySelector('nav [aria-controls][aria-expanded]').getAttribute('aria-expanded')`)) === "true");
  await captureViewport(b, join(out, "menu-free-desktop.png"));
  await b.evaluate(`document.querySelector('[role=tab][aria-selected=true]').focus()`);
  await key("ArrowDown");
  check("ArrowDown selects Pro", /Pro/.test(await b.evaluate(`document.querySelector('[role=tab][aria-selected=true]').innerText`)));
  await captureViewport(b, join(out, "menu-pro-desktop.png"));
  await key("ArrowDown");
  await captureViewport(b, join(out, "menu-team-desktop.png"));
  await key("Escape");
  const state = JSON.parse(await b.evaluate(`JSON.stringify({ expanded: document.querySelector('nav [aria-controls][aria-expanded]').getAttribute('aria-expanded'), focusIsButton: document.activeElement === document.querySelector('nav [aria-controls][aria-expanded]') })`));
  check("Escape closes", state.expanded === "false");
  check("Escape returns focus to the button", state.focusIsButton);

  await setWidth(b, "mobile");
  await open(b, base + "/");
  await b.evaluate(`document.querySelector('[aria-controls=mobile-menu]').click()`);
  await sleep(300);
  await b.evaluate(`(() => { const g = document.querySelector('#mobile-menu details'); g.open = true; g.querySelectorAll('details')[1].open = true; })()`);
  await sleep(300);
  check("phone menu lists the Pro features", /Fila de pedidos|Request queue|Cola de pedidos/.test(await b.evaluate(`document.getElementById('mobile-menu').innerText`)));
  await captureViewport(b, join(out, "menu-mobile.png"));
} finally {
  b.close();
}
process.exit(failed);
