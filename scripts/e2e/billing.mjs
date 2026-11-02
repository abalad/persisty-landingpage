// Buys Pro through the site and Stripe Checkout in test mode, with a
// throwaway account and Stripe's test card, then checks the plan on the
// account page. Deletes the account and its Stripe customer at the end.
// usage: SECRET=<Supabase secret key> STRIPE=<Stripe test key> node scripts/e2e/billing.mjs <base-url> <shots-dir>
// Keys are read from the environment only. Stripe sends the buyer back to
// persisty.app; the account page is then opened on <base-url> again.
import { click, openBrowser, sleep, typeInto } from "./lib.mjs";

const [base, out] = process.argv.slice(2);
const API = "https://ytmpopebhdtnucdznfsz.supabase.co";
const { SECRET, STRIPE } = process.env;
if (!STRIPE?.startsWith("sk_test_")) throw new Error("STRIPE must be a test key");
const admin = (path, init = {}) => fetch(`${API}/auth/v1/admin/${path}`, { ...init, headers: { apikey: SECRET, "Content-Type": "application/json", ...(init.headers || {}) } });
const rpc = (name, body) => fetch(`${API}/rest/v1/rpc/${name}`, { method: "POST", headers: { apikey: SECRET, "Content-Type": "application/json" }, body: JSON.stringify(body) });

const email = `site-billing-${Date.now()}@persist.invalid`;
const created = await (await admin("users", { method: "POST", body: JSON.stringify({ email, email_confirm: true }) })).json();
const userId = created.id;
let failed = 0;
const check = (name, ok, extra = "") => { console.log(`${ok ? "ok" : "not ok"} - ${name}${extra ? ` (${extra})` : ""}`); if (!ok) failed = 1; };
const b = await openBrowser();
const text = () => b.evaluate("document.body.innerText");
async function waitFor(test, ms = 30000) {
  for (let t = 0; t < ms; t += 500) {
    if (await b.evaluate(test).catch(() => false)) return true;
    await sleep(500);
  }
  return false;
}
/** Stripe's fields are React inputs: focus one and type into it as a keyboard would. */
async function typeField(selector, value) {
  await b.evaluate(`document.querySelector(${JSON.stringify(selector)})?.focus()`);
  await b.send("Input.insertText", { text: value });
}

try {
  const link = await (await admin("generate_link", { method: "POST", body: JSON.stringify({ type: "magiclink", email }) })).json();
  const code = link.email_otp ?? link.properties?.email_otp;
  await b.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => { const real = window.fetch; window.fetch = (input, init) => { const url = typeof input === "string" ? input : input.url; if (url.includes("/auth/v1/otp")) return Promise.resolve(new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })); return real(input, init); }; })();`,
  });

  // Subscribing signed out goes to sign-in, and comes back to the checkout.
  await b.send("Page.navigate", { url: `${base}/en/pricing` });
  await sleep(3000);
  await b.evaluate(`[...document.querySelectorAll("button")].find((x) => x.textContent.includes("Pro"))?.click()`);
  check("subscribing signed out asks to sign in", await waitFor(`location.pathname.endsWith("/sign-in")`));
  await b.evaluate(typeInto('input[name="email"]', email));
  await b.evaluate(click('button[type="submit"]'));
  await waitFor(`!!document.querySelector('input[name="code"]')`);
  await b.evaluate(typeInto('input[name="code"]', `${code.slice(0, 4)} ${code.slice(4)}`));
  await b.evaluate(click('button[type="submit"]'));
  check("after signing in it goes on to Stripe Checkout", await waitFor(`location.host === "checkout.stripe.com"`, 45000));
  await waitFor(`!!document.querySelector("#cardNumber")`, 30000);
  await sleep(1500);
  const page = await text();
  check("Checkout shows the Pro plan", /Persisty Pro/.test(page));
  check("Checkout charges in reais from Brazil (or dollars elsewhere)", /R\$\s?9[,.]90|\$4\.90|US\$\s?4[,.]90/.test(page), (page.match(/(R\$|US\$|\$)\s?[\d.,]+/) ?? [""])[0]);
  await b.shot(`${out}/checkout.png`);

  await typeField("#cardNumber", "4242424242424242");
  await typeField("#cardExpiry", "1234");
  await typeField("#cardCvc", "123");
  await typeField("#billingName", "Site Billing Test");
  if (await b.evaluate(`!!document.querySelector("#billingPostalCode")`)) await typeField("#billingPostalCode", "01001000");
  await b.evaluate(`document.querySelector('button[type="submit"], .SubmitButton')?.click()`);
  check("paying returns to the account page", await waitFor(`location.pathname.endsWith("/account") && location.search.includes("checkout=done")`, 60000), await b.evaluate("location.href"));

  let plan = null;
  for (let i = 0; i < 30 && plan !== "pro"; i++) {
    const mine = await (await fetch(`${API}/rest/v1/orgs?personal_owner=eq.${userId}&select=id`, { headers: { apikey: SECRET } })).json();
    const subs = await (await fetch(`${API}/rest/v1/subscriptions?org_id=eq.${mine[0]?.id}&select=plan,status`, { headers: { apikey: SECRET } })).json();
    plan = subs.find((s) => s.status === "active")?.plan ?? null;
    if (plan !== "pro") await sleep(1000);
  }
  check("the webhook recorded an active Pro", plan === "pro", String(plan));

  await b.send("Page.navigate", { url: `${base}/en/account` });
  check("the account page shows Pro", await waitFor(`document.body.innerText.includes("Pro") && document.body.innerText.includes("Manage subscription")`, 20000));
  await b.shot(`${out}/account-pro.png`);
} finally {
  const orgs = await (await fetch(`${API}/rest/v1/orgs?personal_owner=eq.${userId}&select=id`, { headers: { apikey: SECRET } })).json().catch(() => []);
  for (const o of orgs) {
    const customer = await (await rpc("stripe_customer_of", { p_org: o.id })).json().catch(() => null);
    if (customer) await fetch(`https://api.stripe.com/v1/customers/${customer}`, { method: "DELETE", headers: { authorization: `Bearer ${STRIPE}` } });
  }
  await admin(`users/${userId}`, { method: "DELETE" });
  await b.close?.();
}
process.exit(failed);
