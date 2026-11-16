// Proves that the cookie notice gates Google Analytics, on a production build served locally:
//   VERCEL_ENV=production node_modules/.bin/next build && node_modules/.bin/next start -p 3100
//   node scripts/e2e/analytics.mjs http://localhost:3100 <shots-dir>
// Every request to Google is intercepted. gtag.js is fetched for real; each other request
// (the /g/collect hits) is answered 204 and recorded, never aborted (aborting makes gtag
// resend), so nothing reaches the property.
import { openBrowser, sleep } from "./lib.mjs";

const [base, out] = process.argv.slice(2);
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "ok" : "not ok"} - ${name}${extra ? ` (${extra})` : ""}`);
  if (!ok) failed = 1;
};

const b = await openBrowser();
const google = [];
b.on("Fetch.requestPaused", async ({ requestId, request }) => {
  google.push({ url: request.url, body: request.postData ?? "" });
  if (/googletagmanager\.com\/gtag\/js/.test(request.url)) await b.send("Fetch.continueRequest", { requestId });
  else await b.send("Fetch.fulfillRequest", { requestId, responseCode: 204, responseHeaders: [], body: "" });
});
await b.send("Fetch.enable", { patterns: ["*google*", "*doubleclick*"].map((urlPattern) => ({ urlPattern })) });

/** Every GA4 event sent so far; a batched hit carries one event per body line. */
const events = () =>
  google
    .filter((r) => /\/g\/collect/.test(r.url))
    .flatMap((r) => {
      const shared = Object.fromEntries(new URL(r.url).searchParams);
      const lines = r.body.split("\n").filter(Boolean);
      return (lines.length ? lines : [""]).map((line) => ({ ...shared, ...Object.fromEntries(new URLSearchParams(line)) }));
    });
const pageViews = () => events().filter((e) => e.en === "page_view");
/** gtag batches its hits and sends them a few seconds later: wait for the one expected. */
const until = async (found, ms = 12000) => {
  for (let waited = 0; waited < ms && !found(); waited += 250) await sleep(250);
  return found();
};

const settle = async (ms = 3000) => {
  await sleep(300);
  for (let i = 0; i < 100 && (await b.evaluate("document.readyState")) !== "complete"; i++) await sleep(100);
  await sleep(ms);
};
const goto = async (path) => {
  await b.send("Page.navigate", { url: base + path });
  await settle();
};
const NOTICE = "document.querySelector('svg.lucide-cookie')?.closest('section')";
const noticeShown = () => b.evaluate(`!!(${NOTICE})`);
/** 0 = Decline, 1 = Accept. */
const answer = (i) => b.evaluate(`(() => { const s = ${NOTICE}; if (!s) return false; s.querySelectorAll('button')[${i}].click(); return true; })()`);
// Focused first, as a keyboard user reaches it.
const reopen = () => b.evaluate("(() => { const el = document.querySelector('footer ul button'); if (!el) return false; el.focus(); el.click(); return true; })()");
const focusInNotice = () => b.evaluate(`(() => { const s = ${NOTICE}; return Boolean(s && s.contains(document.activeElement)); })()`);
const focusOnCookies = () => b.evaluate("document.activeElement === document.querySelector('footer ul button')");
const savedByServer = () => b.evaluate("performance.getEntriesByType('resource').some((e) => e.name.endsWith('/api/consent'))");
/** Client-side navigation through a page link (not the footer's), as a visitor would. */
const follow = (suffix) =>
  b.evaluate(`(() => { const a = [...document.querySelectorAll('a[href$="${suffix}"]')].find((x) => !x.closest('footer')) ?? document.querySelector('a[href$="${suffix}"]'); if (!a) return false; a.click(); return true; })()`);

try {
  // 1. No answer yet: the notice shows and nothing reaches Google.
  await goto("/en");
  check("first visit shows the cookie notice", await noticeShown());
  check("first visit sends nothing to Google", google.length === 0, `${google.length} requests`);
  if (out) await b.shot(`${out}/notice-desktop.png`);

  // 2. Decline: still nothing, on this page and the next.
  check("Decline is clickable", await answer(0));
  await sleep(500);
  check("the notice goes away after Decline", !(await noticeShown()));
  check("Decline is saved", /persisty_consent=denied/.test(await b.evaluate("document.cookie")));
  check("the answer is also saved by the server (Safari keeps script cookies 7 days)", await savedByServer());
  await goto("/en/pricing");
  check("after Decline, nothing reaches Google", google.length === 0, `${google.length} requests`);
  check("after Decline, the notice stays away", !(await noticeShown()));

  // 3. Footer › Cookies › Accept: gtag loads and the page view carries a clean address.
  check("Cookies in the footer reopens the notice", (await reopen()) && (await sleep(300), await noticeShown()));
  check("reopening moves the focus into the notice", await focusInNotice());
  check("Accept is clickable", await answer(1));
  await sleep(300);
  check("after answering, the focus goes back to Cookies", await focusOnCookies());
  await settle(4000);
  check("after Accept, gtag.js is downloaded", google.some((r) => /gtag\/js\?id=G-/.test(r.url)));
  check("after Accept, a page view is sent", await until(() => pageViews().some((e) => /\/en\/pricing$/.test(e.dl))), JSON.stringify(pageViews().map((e) => e.dl)));
  await goto("/en/pricing?utm_source=t&next=%2Fsecret");
  check("the page view keeps utm_source", await until(() => pageViews().some((e) => /utm_source=t/.test(e.dl))), JSON.stringify(pageViews().map((e) => e.dl)));
  check("the page view drops next=", !pageViews().some((e) => /next|secret/.test(e.dl)), JSON.stringify(pageViews().map((e) => e.dl)));

  // 4. App Router navigation: one page view per page, and a download event.
  const before = pageViews().length;
  check("a page link is followed", await follow("/download"));
  await settle(2500);
  await until(() => pageViews().slice(before).some((e) => /\/en\/download$/.test(e.dl)));
  await sleep(3000);
  const downloads = pageViews().slice(before).filter((e) => /\/en\/download$/.test(e.dl));
  check("one page view for the page reached by a link", downloads.length === 1, `${downloads.length} for /download`);
  await b.evaluate(`window.addEventListener('click', (e) => { if (e.target.closest?.('a[href*="/releases/download/"]')) e.preventDefault(); }, true)`);
  const clicked = await b.evaluate(`(() => { const a = document.querySelector('a[href*="/releases/download/"]'); if (!a) return false; a.click(); return a.href; })()`);
  await until(() => events().some((e) => e.en === "download"));
  const download = events().find((e) => e.en === "download");
  check("an installer link sends a download event", Boolean(clicked && download?.["ep.platform"] && download?.["ep.kind"] && download?.["ep.version"]), `${clicked} → ${JSON.stringify(download ?? null)}`);

  // 5. Footer › Cookies › Decline after Accept: no more hits and Google's cookies are gone.
  check("Cookies reopens the notice after Accept", (await reopen()) && (await sleep(300), await noticeShown()));
  check("Decline after Accept is clickable", await answer(0));
  await sleep(500);
  const hits = google.length;
  check("a page link is followed after Decline", await follow("/pricing"));
  await settle(3000);
  check("after changing to Decline, nothing more reaches Google", google.length === hits, `${google.length - hits} new requests`);
  const cookies = await b.evaluate("document.cookie");
  check("Google's cookies are deleted", !/(^|;\s*)_ga/.test(cookies), cookies);
  check("no hit ever carried the raw address", !google.some((r) => /secret/.test(decodeURIComponent(r.url + r.body))));
  check("exactly one page view per page load or link", pageViews().length === 3, JSON.stringify(pageViews().map((e) => e.dl)));

  // The notice on a phone, for the review.
  if (out) {
    await b.evaluate("document.cookie = 'persisty_consent=; path=/; max-age=0'");
    await b.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await goto("/pt-BR");
    await b.shot(`${out}/notice-phone.png`);
  }
} finally {
  if (process.env.DEBUG) for (const e of events()) console.log("#", e.en, e.dl, `_s=${e._s}`);
  b.close();
}
process.exit(failed);
