// Signs in through the site's own form with a throwaway account. Sending the
// e-mail is the only step stubbed (the code comes from the admin API instead).
// usage: SECRET=<Supabase secret key> node scripts/e2e/account.mjs <base-url> <shots-dir>
// The secret is read from the environment only; get it with
// `supabase projects api-keys --project-ref ytmpopebhdtnucdznfsz --reveal`.
import { click, openBrowser, sleep, typeInto } from "./lib.mjs";

const [base, out] = process.argv.slice(2);
const API = "https://ytmpopebhdtnucdznfsz.supabase.co";
const SECRET = process.env.SECRET;
const rest = (path, init = {}) => fetch(`${API}/rest/v1/${path}`, { ...init, headers: { apikey: SECRET, "Content-Type": "application/json", Prefer: "return=representation", ...(init.headers || {}) } });
const admin = (path, init = {}) => fetch(`${API}/auth/v1/admin/${path}`, { ...init, headers: { apikey: SECRET, "Content-Type": "application/json", ...(init.headers || {}) } });

const email = `site-e2e-${Date.now()}@persist.invalid`;
const created = await (await admin("users", { method: "POST", body: JSON.stringify({ email, email_confirm: true }) })).json();
const userId = created.id;
let failed = 0;
const check = (name, ok, extra = "") => {
  if (!ok && process.env.DEBUG) extra += " | page: " + String(globalThis.__last ?? "").replace(/\s+/g, " ").slice(0, 400); console.log(`${ok ? "ok" : "not ok"} - ${name}${extra ? ` (${extra})` : ""}`); if (!ok) failed = 1; };
const b = await openBrowser();
const rawEval = b.evaluate;
b.evaluate = async (e) => { const v = await rawEval(e); if (e === "document.body.innerText") globalThis.__last = v; return v; };
try {
  check("throwaway account created", Boolean(userId));
  const link = await (await admin("generate_link", { method: "POST", body: JSON.stringify({ type: "magiclink", email }) })).json();
  const code = link.email_otp ?? link.properties?.email_otp;
  check("code generated without sending e-mail", /^\d{6,10}$/.test(code ?? ""));

  const deviceId = crypto.randomUUID();
  const added = await rest("devices", { method: "POST", body: JSON.stringify({ id: deviceId, user_id: userId, name: "MacBook de teste", platform: "macos", app_version: "0.1.0" }) });
  check("device created for the account", added.ok, String(added.status));

  await b.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => { const real = window.fetch; window.fetch = (input, init) => { const url = typeof input === "string" ? input : input.url; if (url.includes("/auth/v1/otp")) return Promise.resolve(new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })); return real(input, init); }; })();`,
  });
  await b.send("Page.navigate", { url: `${base}/en/sign-in?next=%2Faccount&notify=mac` });
  await sleep(3500);
  check("intent shown on sign-in", (await b.evaluate("document.body.innerText")).includes("public build ships"));

  await b.evaluate(typeInto('input[name="email"]', "not-an-email"));
  await b.evaluate(click('button[type="submit"]'));
  await sleep(400);
  check("bad e-mail refused in place", (await b.evaluate("document.body.innerText")).includes("looks incomplete"));

  await b.evaluate(typeInto('input[name="email"]', email));
  await b.evaluate(click('button[type="submit"]'));
  await sleep(1200);
  check("moved to the code step", Boolean(await b.evaluate('!!document.querySelector(\'input[name="code"]\')')));

  await b.evaluate(typeInto('input[name="code"]', "1111 1111"));
  await b.evaluate(click('button[type="submit"]'));
  await sleep(2500);
  const wrong = await b.evaluate("document.body.innerText");
  check("wrong code explained", wrong.includes("wrong or has expired"), wrong.slice(0, 0));
  await b.shot(`${out}/signin-error.png`);

  await b.evaluate(typeInto('input[name="code"]', `${code.slice(0, 4)} ${code.slice(4)}`));
  await b.evaluate(click('button[type="submit"]'));
  await sleep(6000);
  const url = await b.evaluate("location.pathname + location.search");
  check("landed on the account", url === "/en/account", url);
  const text = await b.evaluate("document.body.innerText");
  check("account shows the e-mail", text.includes(email));
  check("account shows the free plan", text.includes("Free"));
  check("launch notice is on for macOS", text.includes("ships for macOS"));
  await b.shot(`${out}/account.png`);

  const user = await (await admin(`users/${userId}`)).json();
  check("notice stored in user metadata", user.user_metadata?.notify_release === true && JSON.stringify(user.user_metadata?.notify_platforms) === '["mac"]', JSON.stringify(user.user_metadata));

  check("device listed", text.includes("MacBook de teste"));
  await b.evaluate(`[...document.querySelectorAll("button")].find((x) => x.textContent.trim() === "Remove").click()`);
  await sleep(400);
  const confirmText = await b.evaluate("document.body.innerText");
  check("removal asks with consequences", confirmText.includes("leaves this account"), confirmText.slice(0, 0));
  await b.evaluate(`[...document.querySelectorAll("button")].find((x) => x.textContent.includes("Remove from account")).click()`);
  await sleep(2000);
  const left = await (await rest(`devices?id=eq.${deviceId}&select=revoked_at`, { method: "GET" })).json();
  check("device revoked, so the computer is signed out until someone signs in on it", Array.isArray(left) && left.length === 1 && Boolean(left[0].revoked_at), JSON.stringify(left));
  check("device gone from the page", !(await b.evaluate("document.body.innerText")).includes("MacBook de teste"));

  await b.evaluate(`[...document.querySelectorAll("button")].find((x) => x.textContent.includes("Record my interest")).click()`);
  await sleep(2000);
  const after = await (await admin(`users/${userId}`)).json();
  check("Enterprise interest stored", JSON.stringify(after.user_metadata?.interests) === '["enterprise"]', JSON.stringify(after.user_metadata));

  await b.evaluate(`[...document.querySelectorAll("button")].find((x) => x.textContent.includes("Sign out")).click()`);
  await sleep(2500);
  check("sign out goes home", (await b.evaluate("location.pathname")) === "/en");
} finally {
  b.close();
  if (userId) {
    const del = await admin(`users/${userId}`, { method: "DELETE" });
    check("throwaway account deleted", del.ok);
  }
}
process.exit(failed);
