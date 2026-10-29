// The launch e-mail, sent only when asked.
// usage: SECRET=<Supabase secret key> RESEND_API_KEY=<key> node scripts/release/announce.mjs <version> [--test | --send] [--skip <n>] [--limit <n>]
//   (no flag)  reads the list and shows how many would get it, masked; sends nothing
//   --test     one e-mail per language to delivered@resend.dev; needs only RESEND_API_KEY
//   --send     the list, in batches of 100, up to --limit (100: Resend's free plan a day,
//              shared with the sign-in codes); --skip resumes after a run that stopped
// Keys come from the environment only and are never printed.
import { LOCALES, mask, message, recipients, sendPlan } from "./announce-lib.mjs";

const API = "https://ytmpopebhdtnucdznfsz.supabase.co";
const FROM = "Persisty <oi@persisty.app>";
const TEST_TO = "delivered@resend.dev";

const args = process.argv.slice(2);
const version = args[0]?.startsWith("--") ? undefined : args[0];
const flag = (name) => args.includes(name);
const number = (name, fallback) => {
  const i = args.indexOf(name);
  return i < 0 ? fallback : Number(args[i + 1]);
};
const skip = number("--skip", 0);
const limit = number("--limit", 100);

function fail(text) {
  console.error(text);
  process.exit(1);
}

if (!version) fail("usage: node scripts/release/announce.mjs <version> [--test | --send] [--skip <n>] [--limit <n>]");
if (flag("--test") && flag("--send")) fail("--test or --send, not both");
if (!Number.isInteger(skip) || skip < 0 || !Number.isInteger(limit) || limit < 1) fail("--skip and --limit take whole numbers");
try {
  message("pt-BR", version);
} catch (err) {
  fail(err.message);
}

/** Every user, from the admin API, a page at a time. */
async function users() {
  const secret = process.env.SECRET;
  if (!secret) fail("SECRET (the Supabase secret key) is missing from the environment");
  const all = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${API}/auth/v1/admin/users?page=${page}&per_page=1000`, { headers: { apikey: secret } });
    if (!res.ok) fail(`Supabase answered ${res.status} for the user list`);
    const { users: batch = [] } = await res.json();
    all.push(...batch);
    if (batch.length < 1000) return all;
  }
}

async function send(emails, key) {
  const res = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify(emails),
  });
  if (!res.ok) fail(`Resend answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()).data?.length ?? 0;
}

const email = (to, locale) => ({ from: FROM, to: [to], ...message(locale, version) });

if (flag("--test")) {
  if (!process.env.RESEND_API_KEY) fail("RESEND_API_KEY is missing from the environment");
  const sent = await send(LOCALES.map((l) => email(TEST_TO, l)), `persisty-${version}-test-${Date.now()}`);
  console.log(`Sent ${sent} test e-mails (${LOCALES.join(", ")}) to ${TEST_TO}. Check them in Resend's dashboard.`);
  process.exit(0);
}

const list = recipients(await users());
const byLocale = Object.fromEntries(LOCALES.map((l) => [l, list.filter((r) => r.locale === l).length]));
console.log(`Persisty ${version}: ${list.length} would get the e-mail (${LOCALES.map((l) => `${l} ${byLocale[l]}`).join(", ")}).`);

if (!flag("--send")) {
  for (const r of list) console.log(`  ${mask(r.email)}  ${r.locale}`);
  console.log("Nothing was sent. --test sends one per language to Resend's test inbox; --send sends to the list.");
  process.exit(0);
}

if (!process.env.RESEND_API_KEY) fail("RESEND_API_KEY is missing from the environment");
const plan = sendPlan(list, { skip, limit });
let sent = 0;
for (const [i, batch] of plan.batches.entries()) {
  sent += await send(
    batch.map((r) => email(r.email, r.locale)),
    `persisty-${version}-${skip + i * 100}`,
  );
  console.log(`  sent ${sent} of ${list.length - skip}`);
}
console.log(`Sent ${sent}.${plan.left ? ` ${plan.left} left: the day's limit stopped here. Tomorrow, run again with --send --skip ${skip + sent}.` : ""}`);
