// Walks the account deletion dialog on a page that shows it with stand-ins for the
// delete-account function and the sign-in: each step and state on desktop and phone,
// that nothing closes it while it deletes, the keyboard, and the guards against a
// double click. Captures every step and state.
// usage: node scripts/shots/delete.mjs <base-url> <out-dir> [preview-path]
// The preview page (default /delete-preview) is a fixture kept outside the repo; its
// query string picks the case (refund, fresh, fail, gone, member, solo, stale, ...).
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { openBrowser, sleep, typeInto } from "../e2e/lib.mjs";
import { captureViewport, open, setWidth } from "./pages.mjs";

const [base, out, preview = "/delete-preview", only] = process.argv.slice(2);
const only8 = only === "only8"; // just the section and the page after (Task 8)
mkdirSync(out, { recursive: true });
const b = await openBrowser();
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "ok" : "not ok"} - ${name}${extra ? ` (${extra})` : ""}`);
  if (!ok) failed = 1;
};
const key = async (k) => {
  const codes = { Tab: 9, Escape: 27, Enter: 13 };
  // Enter carries its character, or the field's form is never submitted.
  await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code: k, windowsVirtualKeyCode: codes[k] ?? 0, ...(k === "Enter" ? { text: "\r" } : {}) });
  await b.send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: k, windowsVirtualKeyCode: codes[k] ?? 0 });
  await sleep(120);
};
const mouse = async (x, y) => {
  for (const type of ["mousePressed", "mouseReleased"]) await b.send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
};
const js = (expr) => b.evaluate(expr);
const button = (text) => `[...document.querySelectorAll("dialog button")].find((x) => x.textContent.trim().startsWith(${JSON.stringify(text)}))`;
/** A real click, as a person makes it, in the middle of the dialog's button that starts with `text`. */
const press = async (text) => {
  const r = JSON.parse((await js(`JSON.stringify(${button(text)}?.getBoundingClientRect() ?? null)`)) ?? "null");
  if (!r) return false;
  await mouse(r.x + r.width / 2, r.y + r.height / 2);
  return true;
};
const title = () => js(`document.getElementById("delete-title")?.textContent ?? ""`);
const alertText = () => js(`document.querySelector("dialog [role=alert]")?.textContent ?? ""`);
const isOpen = () => js(`document.querySelector("dialog")?.open === true`);
const typeCode = (value) => js(typeInto("dialog input[name=code]", value));
const hasClose = () => js(`!!document.querySelector('dialog button[aria-label="Fechar"]')`);
/**
 * The step fits its column on a desktop: nothing to scroll inside the dialog. The room
 * left is measured with the step's body at its own height (it grows to fill the column).
 */
const fits = async (width, name) => {
  if (width !== "desktop") return;
  const [scroll, client, natural] = JSON.parse(
    await js(`JSON.stringify((() => {
      const c = document.getElementById("delete-title").closest("[class*=content]");
      const body = document.getElementById("delete-title").closest("[class*=body]");
      const before = [c.scrollHeight, c.clientHeight];
      body.style.flexGrow = "0";
      const natural = c.lastElementChild.getBoundingClientRect().bottom - c.getBoundingClientRect().top + c.scrollTop + parseFloat(getComputedStyle(c).paddingBottom);
      body.style.flexGrow = "";
      return [...before, Math.round(natural)];
    })())`),
  );
  check(`desktop: ${name} fits without scrolling`, scroll <= client + 1, `${scroll} of ${client}, ${client - natural} px to spare`);
};
const noSideways = async (width, name) => check(`${width}: ${name}, no sideways scroll`, (await js("document.documentElement.scrollWidth <= window.innerWidth")) === true);
const shot = (name) => captureViewport(b, join(out, `${name}.png`));
const FAILED = "Não deu para terminar agora. Sua conta continua aqui. Tente de novo em instantes.";
const NETWORK = "Não conseguimos falar com o servidor. Confira a internet e tente de novo.";
const CHANGED = "Agora você está em outra conta. Confira o que é excluído.";
const lis = async () => JSON.parse(await js(`JSON.stringify([...document.querySelectorAll("dialog li")].map((li) => li.textContent))`));
/** The site's calls to the functions answered here, before any script of the page runs: nothing reaches a real project. */
const PREVIEW = { email: "ana@acme.com", computers: 2, fresh: false, subscriptions: [{ plan: "team", team: "Acme", refund: null }], owned_teams: ["Acme"], member_teams: [] };
const STAND_IN = `(() => { const real = window.fetch; window.fetch = (url, init) => { const u = String(url); if (u.includes("/functions/v1/delete-account")) return Promise.resolve(new Response(${JSON.stringify(JSON.stringify(PREVIEW))}, { headers: { "content-type": "application/json" } })); if (u.includes("/functions/v1/")) return Promise.resolve(new Response('{"error":"not_configured"}', { status: 503, headers: { "content-type": "application/json" } })); return real(url, init); }; })()`;
const notBusy = async () => (await js(`!document.querySelector("dialog button[aria-busy=true]")`)) === true && (await hasClose()) === true;
/** On a phone, the room between the step's last line and the footer's hairline, with the sheet scrolled to its end. */
const room = async (width, name) => {
  if (width !== "mobile") return;
  const gap = await js(`(() => {
    const c = document.getElementById("delete-title").closest("[class*=content]");
    c.scrollTop = c.scrollHeight;
    const foot = c.lastElementChild;
    return Math.round(foot.getBoundingClientRect().top - foot.previousElementSibling.getBoundingClientRect().bottom);
  })()`);
  check(`mobile: ${name}, room above the footer`, gap >= 16, `${gap} px`);
  await js(`document.getElementById("delete-title").closest("[class*=content]").scrollTop = 0`);
};
const visit = async (query, wait = 3500) => {
  await open(b, `${base}${preview}?open=1${query ? `&${query}` : ""}`, wait);
  await sleep(1000);
};

try {
  if (!only8) {
  for (const width of ["desktop", "mobile"]) {
    await setWidth(b, width);

    // Step 1: the owner of a team, two computers, the team's plan without a refund.
    await visit("");
    check(`${width}: the dialog opens`, await isOpen());
    check(`${width}: step 1 is what changes`, (await title()) === "Excluir sua conta", await title());
    const lines = JSON.parse(await js(`JSON.stringify([...document.querySelectorAll("dialog li")].map((li) => li.textContent))`));
    check(`${width}: the lines of step 1`, lines.length === 4 && /2 computadores/.test(lines[0]) && /sem reembolso/.test(lines[1]) && /Time Acme/.test(lines[2]), lines.join(" | "));
    check(`${width}: the title takes the focus`, (await js(`document.activeElement?.id`)) === "delete-title");
    check(`${width}: both groups are lists to a screen reader`, (await js(`document.querySelectorAll("dialog ul[role=list]").length`)) === 2);
    await shot(`1-what-${width}`);
    await fits(width, "step 1");
    await room(width, "step 1");
    await noSideways(width, "step 1");

    // Step 2 with a code.
    await press("Continuar");
    await sleep(900);
    check(`${width}: Continue asks for the code`, (await title()) === "Confirme que é você", await title());
    check(`${width}: the code field takes the focus`, (await js(`document.activeElement?.name`)) === "code");
    check(`${width}: Delete waits for six digits`, (await js(`${button("Excluir conta")}.disabled`)) === true);
    check(`${width}: the countdown to another code`, /^Mandar outro em \d+ s$/.test(await js(`document.querySelector("dialog form p:last-child")?.textContent ?? ""`)));
    await typeCode("4810");
    await shot(`2-code-${width}`);
    await fits(width, "step 2 with a code");
    await room(width, "step 2 with a code");
    await noSideways(width, "step 2");

    // A wrong code.
    await typeCode("000000");
    await sleep(150);
    check(`${width}: six digits turn Delete on`, (await js(`${button("Excluir conta")}.disabled`)) === false);
    await press("Excluir conta");
    await sleep(900);
    check(`${width}: a wrong code says so`, (await alertText()) === "Esse código não confere. Use o último que chegou.", await alertText());
    check(`${width}: the field turns red`, (await js(`document.querySelector("dialog input[name=code]").getAttribute("aria-invalid")`)) === "true");
    check(`${width}: the field is described by the error and the lead`, (await js(`document.querySelector("dialog input[name=code]").getAttribute("aria-describedby")`)) === "delete-error delete-lead");
    await shot(`3-wrong-${width}`);
    await fits(width, "the wrong code");
    await room(width, "the wrong code");

    // Deleting: no X, Escape and a click outside do nothing.
    await typeCode("123456");
    await sleep(150);
    await press("Excluir conta");
    await sleep(500);
    check(`${width}: the button says it is deleting`, (await js(`document.querySelector("dialog button[aria-busy=true]")?.textContent.trim() ?? ""`)) === "Excluindo…");
    check(`${width}: the X is gone while it deletes`, (await hasClose()) === false);
    check(`${width}: the bubble asks for a moment`, (await js(`document.querySelector("dialog [aria-hidden=true] p")?.textContent ?? ""`)) === "Só um instante.");
    await shot(`4-busy-${width}`);
    await key("Escape");
    await key("Escape");
    check(`${width}: Escape, twice, does not close it while it deletes`, await isOpen());
    await mouse(4, 4);
    await sleep(150);
    check(`${width}: a click outside does not close it while it deletes`, await isOpen());
    await sleep(2200);
    check(`${width}: once deleted, the page after`, /\/account-deleted$/.test(await js("location.pathname")), await js("location.pathname"));
    // The page after reads the e-mail and removes the key: it says where the confirmation went.
    await sleep(1500);
    const after = await js(`document.querySelector("h1")?.parentElement?.textContent ?? ""`);
    check(`${width}: the page after gets the e-mail and that the confirmation went out`, /Sua conta foi excluída/.test(after) && /A confirmação foi para ana@acme.com\./.test(after), after);
    await js(`sessionStorage.clear()`);

    // The deletion fails: the account is still there, the button works again.
    await visit("fail=1");
    await press("Continuar");
    await sleep(900);
    await typeCode("123456");
    await sleep(150);
    await press("Excluir conta");
    await sleep(2400);
    check(`${width}: a failure says the account is still here`, (await alertText()) === FAILED, await alertText());
    check(`${width}: and Delete works again`, (await js(`${button("Excluir conta")}.disabled`)) === false && (await hasClose()) === true);
    check(`${width}: the used code is not asked again: the form without a code`, (await title()) === "Confirme a exclusão" && (await js(`!document.querySelector("dialog input")`)) === true, await title());
    await shot(`5-failed-${width}`);
    await fits(width, "the failure");
    await room(width, "the failure");
    await press("Excluir conta");
    await sleep(2400);
    check(`${width}: a retry deletes again, with no wrong code`, (await js(`window.__deletes ?? 0`)) === 2 && (await alertText()) === FAILED && /verified$/.test(await js(`document.getElementById("calls").textContent`)), `${await js(`window.__deletes ?? 0`)} deletes, ${await alertText()}, calls ${await js(`document.getElementById("calls").textContent`)}`);

    // Signed in with a code a moment ago: step 2 without a code.
    await visit("fresh=1");
    await press("Continuar");
    await sleep(900);
    check(`${width}: a recent sign-in skips the code`, (await title()) === "Confirme a exclusão", await title());
    check(`${width}: no code field then`, (await js(`!document.querySelector("dialog input")`)) === true);
    check(`${width}: and Delete is on at once`, (await js(`${button("Excluir conta")}.disabled`)) === false);
    check(`${width}: the last look lists names and plans`, /Ao confirmar, a conta, a assinatura Team e o Time Acme são excluídos na hora\./.test(await js(`document.querySelector("dialog [class*=last]")?.textContent ?? ""`)));
    await shot(`6-confirm-${width}`);
    await fits(width, "step 2 without a code");
    await room(width, "step 2 without a code");

    // The longest step 1: a refund and a team only joined, four lines.
    await visit("refund=1&member=1");
    check(`${width}: the refund line`, /com os R\$\s9,90 pagos de volta no cartão/.test(await js(`document.querySelector("dialog li:nth-child(2)")?.textContent ?? ""`)), await js(`document.querySelector("dialog li:nth-child(2)")?.textContent ?? ""`));
    await shot(`7-what-refund-member-${width}`);
    await fits(width, "step 1 with four lines and a refund");
    await room(width, "step 1 with four lines");
    await noSideways(width, "step 1 with four lines");

    // The session turned into another account's (another tab) before the deletion: nothing goes, step 1 again with that account.
    await visit("fresh=1&changed=1");
    await press("Continuar");
    await sleep(900);
    await press("Excluir conta");
    await sleep(2600);
    check(`${width}: the deletion carries the account reviewed`, (await js(`JSON.stringify(window.__deleteEmails ?? [])`)) === '["ana@acme.com"]', await js(`JSON.stringify(window.__deleteEmails ?? [])`));
    const switched = await lis();
    check(`${width}: another account in the session: step 1 again, with that account and the reason`, (await title()) === "Excluir sua conta" && /bia@acme\.com/.test(switched[0] ?? "") && (await alertText()) === CHANGED && (await notBusy()), `${await title()} / ${switched[0]} / ${await alertText()}`);
    await shot(`31-changed-${width}`);
    await fits(width, "step 1 after the account changed");
    await room(width, "step 1 after the account changed");
    await press("Continuar");
    await sleep(900);
    await press("Excluir conta");
    await sleep(2600);
    check(`${width}: and the next deletion carries the account now shown`, (await js(`JSON.stringify(window.__deleteEmails ?? [])`)) === '["ana@acme.com","bia@acme.com"]' && /\/account-deleted$/.test(await js("location.pathname")), `${await js(`JSON.stringify(window.__deleteEmails ?? [])`)} ${await js("location.pathname")}`);
    await js(`sessionStorage.clear()`);
  }

  await setWidth(b, "desktop");

  // A free account on one computer, with nothing to cancel.
  await visit("solo=1&nocancel=1");
  check("a free account: one line for the account", (await js(`document.querySelector("dialog li")?.textContent ?? ""`)) === "A conta ana@acme.com e o acesso no computador");
  check("nothing to cancel: no link to cancelling", (await js(`!${button("Só quer parar")}`)) === true);
  const [above, below] = JSON.parse(
    await js(`JSON.stringify((() => {
      const body = document.getElementById("delete-title").closest("[class*=body]");
      const box = body.getBoundingClientRect();
      const first = body.firstElementChild.getBoundingClientRect();
      const last = body.lastElementChild.getBoundingClientRect();
      return [Math.round(first.top - box.top - parseFloat(getComputedStyle(body).paddingTop)), Math.round(box.bottom - last.bottom)];
    })())`),
  );
  check("a short step 1 sits in the middle of the column, no empty band over the footer", Math.abs(above - below) <= 2 && above > 20, `${above} px above, ${below} px below`);
  await shot("8-what-free-desktop");
  await fits("desktop", "a free account's step 1");
  await press("Continuar");
  await sleep(900);
  check("one thing goes: the singular", (await js(`document.querySelector("dialog [class*=last]")?.textContent ?? ""`)) === "Ao confirmar, a conta é excluída na hora.");
  await shot("8-code-free-desktop");

  // The recent sign-in runs out with the dialog open: the code form, with a code sent.
  await visit("fresh=1&stale=1");
  await press("Continuar");
  await sleep(900);
  await press("Excluir conta");
  await sleep(2400);
  check("an old sign-in turns to the code form", (await title()) === "Confirme que é você", await title());
  check("and sends a code", /sendCode/.test(await js(`document.getElementById("calls").textContent`)));
  await shot("9-stale-desktop");

  // The deletion answers with an error but the account is gone: the page after, without the confirmation.
  await visit("fail=1&gone=1");
  await press("Continuar");
  await sleep(900);
  await typeCode("123456");
  await sleep(150);
  await press("Excluir conta");
  await sleep(5000);
  check("an error with the account gone still ends on the page after", /\/account-deleted$/.test(await js("location.pathname")), await js("location.pathname"));
  check("and the account was looked for with the token the deletion used", /^[\w-]+\.[\w-]+\.[\w-]+$/.test((await js(`String(window.__stillToken)`)) ?? ""), await js(`String(window.__stillToken).slice(0, 12)`));
  check("and does not say the confirmation went out", !/confirmação foi para/.test(await js(`document.querySelector("h1")?.parentElement?.textContent ?? ""`)));
  await js(`sessionStorage.clear()`);

  // A double click on Continue does not confirm the step after it.
  await visit("fresh=1&fail=1");
  await js(`(() => { const go = ${button("Continuar")}; go.click(); setTimeout(() => ${button("Excluir conta")}?.click(), 60); })()`);
  await sleep(1200);
  check("a double click on Continue does not delete", (await title()) === "Confirme a exclusão" && (await js(`window.__deletes ?? 0`)) === 0, `${await title()}, ${await js(`window.__deletes ?? 0`)} deletes`);

  // A double click on Delete sends one deletion.
  await js(`(() => { const go = ${button("Excluir conta")}; go.click(); setTimeout(() => go.click(), 40); })()`);
  await sleep(2400);
  check("a double click on Delete sends one deletion", (await js(`window.__deletes ?? 0`)) === 1, `${await js(`window.__deletes ?? 0`)} deletes`);

  // Enter in the field confirms.
  await visit("fail=1");
  await press("Continuar");
  await sleep(900);
  await typeCode("123456");
  await key("Enter");
  await sleep(400);
  check("Enter in the field deletes", (await js(`document.querySelector("dialog button[aria-busy=true]")?.textContent.trim() ?? ""`)) === "Excluindo…");
  await sleep(2200);

  // Back goes to step 1, and Continue again sends no second code while the first still works.
  await visit("");
  await press("Continuar");
  await sleep(900);
  await press("Voltar");
  await sleep(500);
  check("Back goes to step 1", (await title()) === "Excluir sua conta", await title());
  await press("Continuar");
  await sleep(900);
  check("Continue again sends no second code", (await js(`document.getElementById("calls").textContent`)) === "sendCode", await js(`document.getElementById("calls").textContent`));

  // Asked for codes too often: the code form all the same, with the reason and the countdown.
  await visit("ratelimit=1");
  await press("Continuar");
  await sleep(900);
  check("asked too often: the code form with the reason", (await title()) === "Confirme que é você" && /Muitos pedidos/.test(await alertText()), `${await title()} / ${await alertText()}`);
  check("and the countdown starts all the same", /^Mandar outro em \d+ s$/.test(await js(`document.querySelector("dialog form p:last-child")?.textContent ?? ""`)));
  await shot("10-rate-limited-desktop");
  await fits("desktop", "the code form, asked too often");

  // A long e-mail address: the lead takes two lines; a wrong code still fits.
  await visit("long=1");
  await shot("13-what-long-email-desktop");
  await fits("desktop", "step 1 with a long e-mail");
  await press("Continuar");
  await sleep(900);
  await typeCode("000000");
  await sleep(150);
  await press("Excluir conta");
  await sleep(900);
  await shot("13-wrong-long-email-desktop");
  await fits("desktop", "a wrong code with a long e-mail");

  // A call that throws instead of answering never leaves the dialog stuck.
  await visit("throw=delete");
  await press("Continuar");
  await sleep(900);
  await typeCode("123456");
  await sleep(150);
  await press("Excluir conta");
  await sleep(2400);
  check("a deletion that throws: not stuck, it says it failed", (await notBusy()) && (await alertText()) === FAILED, await alertText());
  await key("Escape");
  await sleep(400);
  check("and Escape closes it again", (await js(`!document.querySelector("dialog")`)) === true);
  await visit("throw=verify");
  await press("Continuar");
  await sleep(900);
  await typeCode("123456");
  await sleep(150);
  await press("Excluir conta");
  await sleep(900);
  check("a code check that throws: not stuck, no network", (await notBusy()) && (await alertText()) === NETWORK && (await title()) === "Confirme que é você", await alertText());
  await visit("throw=send");
  await press("Continuar");
  await sleep(900);
  check("a code that throws on its way: not stuck, step 1 with the reason", (await notBusy()) && (await alertText()) === NETWORK && (await title()) === "Excluir sua conta", `${await title()} / ${await alertText()}`);

  // The code does not go out: step 1 stays, with the reason.
  await visit("sendfail=1");
  await press("Continuar");
  await sleep(900);
  check("a code that does not go out keeps step 1", (await title()) === "Excluir sua conta" && /servidor/.test(await alertText()), `${await title()} / ${await alertText()}`);
  await shot("10-send-failed-desktop");
  await fits("desktop", "step 1 with the code not sent");

  // The preview does not load: the reason and the X.
  await visit("loadfail=1");
  check("a preview that fails says so", (await alertText()) === "Não deu para carregar agora. Tente de novo em instantes.", await alertText());
  check("with the X to close", await hasClose());
  await shot("11-load-failed-desktop");

  // The link to cancelling closes this dialog and hands over.
  await visit("");
  await press("Só quer parar de pagar");
  await sleep(400);
  check("the cancelling link hands over", (await js(`!document.querySelector("dialog") && document.getElementById("cancelled").textContent === "cancel instead"`)) === true);

  // At rest: Tab stays inside, Escape closes, the focus goes back; a click outside closes too.
  await open(b, `${base}${preview}`, 3000);
  await js(`document.getElementById("opener").focus(); document.getElementById("opener").click()`);
  await sleep(1500);
  for (let i = 0; i < 12; i++) await key("Tab");
  check("Tab stays inside the dialog", (await js(`document.querySelector("dialog").contains(document.activeElement)`)) === true);
  await key("Escape");
  await sleep(400);
  check("Escape closes it", (await js(`!document.querySelector("dialog")`)) === true);
  check("the focus goes back to what opened it", (await js(`document.activeElement?.id`)) === "opener", await js(`document.activeElement?.tagName + "#" + document.activeElement?.id`));
  await js(`document.getElementById("opener").click()`);
  await sleep(1200);
  await mouse(4, 4);
  await sleep(400);
  check("a click outside closes it", (await js(`!document.querySelector("dialog")`)) === true);

  // The other two languages, both steps.
  for (const [locale, cont] of [["en", "Continue"], ["es", "Continuar"]]) {
    await open(b, `${base}/${locale}${preview}?open=1&refund=1`, 3500);
    await sleep(1000);
    await shot(`12-what-${locale}-desktop`);
    await fits("desktop", `${locale}: step 1`);
    await press(cont);
    await sleep(900);
    await typeCode("4810");
    await shot(`12-code-${locale}-desktop`);
    await fits("desktop", `${locale}: step 2`);
  }
  await setWidth(b, "mobile");
  await open(b, `${base}/en${preview}?open=1&refund=1`, 3500);
  await sleep(1000);
  await shot("12-what-en-mobile");
  await noSideways("mobile", "en step 1");

  // Step 1 at its longest, four lines with a refund, in the other two languages, on desktop and phone.
  for (const width of ["desktop", "mobile"]) {
    await setWidth(b, width);
    for (const locale of ["en", "es"]) {
      await open(b, `${base}/${locale}${preview}?open=1&refund=1&member=1`, 3500);
      await sleep(1000);
      const four = await lis();
      check(`${width}: ${locale}: step 1 has the four lines and the refund`, four.length === 5 && /(9,90|9\.90)/.test(four[1]) && /Beta/.test(four[3]), four.join(" | "));
      await shot(`30-what-four-${locale}-${width}`);
      await fits(width, `${locale}: step 1 with four lines and a refund`);
      await room(width, `${locale}: step 1 with four lines`);
      await noSideways(width, `${locale}: step 1 with four lines`);
    }
  }
  }

  // The earlier steps leave the English cookie behind: the rest runs in Portuguese again.
  await b.send("Network.enable");
  await b.send("Network.clearBrowserCookies");

  // The section at the end of My account, and the page after the deletion, on desktop and phone.
  for (const width of ["desktop", "mobile"]) {
    await setWidth(b, width);
    for (const [name, query] of [["paid", "view=account"], ["free", "view=account&plan=free"]]) {
      await open(b, `${base}${preview}?${query}`, 3500);
      const text = await js(`document.getElementById("o-delete")?.closest("section")?.textContent ?? ""`);
      check(`${width}: ${name}: the section is the last of My account`, (await js(`document.getElementById("o-delete")?.closest("section") === [...document.querySelectorAll("section")].pop()`)) === true);
      check(`${width}: ${name}: the sentence for the plan`, name === "paid" ? /encerra a assinatura/.test(text) : /^Excluir contaApaga a conta\. O Persisty/.test(text), text);
      // Twice: what loads in on the way (pictures, the menu) moves the section.
      for (let i = 0; i < 2; i++) {
        await js(`document.getElementById("o-delete").scrollIntoView({ block: "center", behavior: "instant" })`);
        await sleep(900);
      }
      await shot(`20-section-${name}-${width}`);
      await noSideways(width, `${name} section`);
    }
    // An admin of the paid Team: the Team and its plan stay, so the sentence names no subscription and the dialog has no shortcut to cancel it.
    await open(b, `${base}${preview}?view=account&role=admin`, 3500);
    const adminText = await js(`document.getElementById("o-delete")?.closest("section")?.textContent ?? ""`);
    check(`${width}: a Team's admin: the sentence without the subscription`, /^Excluir contaApaga a conta\. O Persisty/.test(adminText), adminText);
    const { identifier: adminStandIn } = (await b.send("Page.addScriptToEvaluateOnNewDocument", { source: STAND_IN })).result;
    await open(b, `${base}${preview}?view=account&role=admin&open=1`, 3500);
    await sleep(800);
    check(`${width}: a Team's admin: no shortcut to cancel the Team's plan`, (await title()) === "Excluir sua conta" && (await js(`!${button("Só quer parar")}`)) === true, await title());
    await b.send("Page.removeScriptToEvaluateOnNewDocument", { identifier: adminStandIn });

    // The button opens the dialog; the cancelling link hands over to the cancelling dialog.
    await open(b, `${base}${preview}?view=account`, 3500);
    // The section calls the real function: the page's fetch answers the preview in its place.
    await js(`(() => { const real = window.fetch; window.fetch = (url, init) => String(url).includes("delete-account") ? Promise.resolve(new Response(JSON.stringify({ email: "ana@acme.com", computers: 2, fresh: false, subscriptions: [{ plan: "team", team: "Acme", refund: null }], owned_teams: ["Acme"], member_teams: [] }), { headers: { "content-type": "application/json" } })) : real(url, init); })()`);
    await js(`document.getElementById("o-delete").closest("section").querySelector("button").click()`);
    await sleep(1500);
    check(`${width}: the button opens the dialog`, await isOpen());
    await press("Só quer parar de pagar");
    await sleep(1200);
    check(`${width}: the link to cancelling opens the cancelling dialog`, (await js(`document.querySelector("dialog")?.open === true && !document.getElementById("delete-title")`)) === true);
    // From /account/delete the dialog is already open. The stand-in answers before the page's first call.
    const { identifier } = (await b.send("Page.addScriptToEvaluateOnNewDocument", { source: STAND_IN })).result;
    await open(b, `${base}${preview}?view=account&open=1`, 3500);
    await sleep(800);
    check(`${width}: with open the dialog starts open`, await isOpen() && (await title()) === "Excluir sua conta", await title());
    // Handing over to cancelling, then closing that: back to My account, so a reload does not open the deletion again.
    await press("Só quer parar de pagar");
    await sleep(1200);
    check(`${width}: from /account/delete the link opens the cancelling dialog`, (await js(`document.querySelector("dialog")?.open === true && !document.getElementById("delete-title")`)) === true);
    await key("Escape");
    await sleep(1500);
    const where = await js("location.pathname + location.search");
    check(`${width}: closing the cancelling dialog there goes back to My account`, /^\/account$/.test(await js("location.pathname")) || /^\/sign-in\?next=%2Faccount$|^\/sign-in\?next=\/account$/.test(where), where);
    await b.send("Page.removeScriptToEvaluateOnNewDocument", { identifier });

    // The page after.
    for (const [name, value] of [["sent", JSON.stringify({ email: "ana@acme.com", sent: true })], ["empty", null], ["unsent", JSON.stringify({ email: "ana@acme.com", sent: false })]]) {
      await open(b, `${base}/account-deleted`, 1500);
      await js(value ? `sessionStorage.setItem("persisty.deleted", ${JSON.stringify(value)})` : `sessionStorage.removeItem("persisty.deleted")`);
      await open(b, `${base}/account-deleted`, 3500);
      const body = await js(`document.querySelector("h1")?.parentElement?.textContent ?? ""`);
      check(`${width}: after: ${name}`, /Sua conta foi excluída/.test(body) && /confirmação foi para ana@acme.com/.test(body) === (name === "sent") && /plano grátis/.test(body), body);
      check(`${width}: after: ${name}: the key is gone`, (await js(`sessionStorage.getItem("persisty.deleted")`)) === null);
      check(`${width}: after: ${name}: noindex`, (await js(`document.querySelector('meta[name=robots]')?.content ?? ""`)).includes("noindex"));
      check(`${width}: after: ${name}: the way home`, (await js(`document.querySelector("h1").parentElement.querySelector("a")?.getAttribute("href")`)) === "/");
      await shot(`20-deleted-${name}-${width}`);
      await noSideways(width, `after ${name}`);
    }
  }
  await open(b, `${base}/en/account-deleted`, 3000);
  await shot("20-deleted-en-desktop");
} finally {
  b.close();
}
process.exit(failed);
