// The launch e-mail to those who turned on the new-version notice: who gets
// it, in which language, and what it says. No network here; announce.mjs
// reads the list and sends.

export const LOCALES = ["pt-BR", "en", "es"];
export const SITE = "https://persisty.app";
/** Resend takes up to 100 e-mails per batch call; its free plan sends 100 a day. */
export const BATCH = 100;

const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

/**
 * People with `notify_release === true` and an e-mail, each once, in the
 * language the site recorded when they turned the notice on (Portuguese when
 * it recorded none). Sorted by address, so a run that stops can resume.
 */
export function recipients(users) {
  const seen = new Set();
  const out = [];
  for (const u of users) {
    const meta = u.user_metadata ?? {};
    const email = typeof u.email === "string" ? u.email.trim() : "";
    if (meta.notify_release !== true || !email || seen.has(email.toLowerCase())) continue;
    seen.add(email.toLowerCase());
    out.push({ email, locale: LOCALES.includes(meta.locale) ? meta.locale : "pt-BR" });
  }
  return out.sort((a, b) => a.email.localeCompare(b.email));
}

/** `m***@gmail.com`: enough to recognise a list, never the whole address. */
export function mask(email) {
  const at = email.lastIndexOf("@");
  return `${email.slice(0, 1)}***${email.slice(at)}`;
}

/** This run's batches: `skip` already sent, at most `limit` now, 100 per call; `left` for another day. */
export function sendPlan(list, { skip = 0, limit = BATCH } = {}) {
  const now = list.slice(skip, skip + limit);
  const batches = [];
  for (let i = 0; i < now.length; i += BATCH) batches.push(now.slice(i, i + BATCH));
  return { batches, left: Math.max(0, list.length - skip - now.length) };
}

const COPY = {
  "pt-BR": {
    subject: (v) => `Persisty ${v} saiu`,
    lead: (v) => `O Persisty ${v} saiu, e você pediu para saber.`,
    builds: "No Mac, o app é assinado e notarizado pela Apple. No Windows e no Linux, sai como prévia: sem assinatura e ainda não testado em máquinas reais.",
    after: "Depois de instalado, o próprio app avisa quando sai uma versão nova.",
    download: "Baixar",
    notes: "Novidades",
    off: "Para não receber mais estes e-mails, desligue o aviso em Minha conta",
  },
  en: {
    subject: (v) => `Persisty ${v} is out`,
    lead: (v) => `Persisty ${v} is out, and you asked to hear about it.`,
    builds: "On the Mac, the app is signed and notarised by Apple. On Windows and Linux it ships as a preview: unsigned and not yet tested on real machines.",
    after: "Once it is installed, the app itself tells you when a new version is out.",
    download: "Download",
    notes: "What's new",
    off: "To stop these e-mails, turn the notice off in My account",
  },
  es: {
    subject: (v) => `Salió Persisty ${v}`,
    lead: (v) => `Salió Persisty ${v}, y pediste saberlo.`,
    builds: "En Mac, la app está firmada y notarizada por Apple. En Windows y Linux sale como versión preliminar: sin firma y todavía no probada en máquinas reales.",
    after: "Una vez instalada, la propia app avisa cuando sale una versión nueva.",
    download: "Descargar",
    notes: "Novedades",
    off: "Para no recibir más estos e-mails, apaga el aviso en Mi cuenta",
  },
};

const page = (locale, path) => `${SITE}${locale === "pt-BR" ? "" : `/${locale}`}${path}`;

/** Subject, plain text and HTML of the launch e-mail for one language. */
export function message(locale, version) {
  if (!VERSION.test(version)) throw new Error(`not a version: ${version}`);
  const c = COPY[locale];
  const links = { download: page(locale, "/download"), notes: page(locale, `/changelog#${version}`), account: page(locale, "/account") };
  const text = [
    c.lead(version),
    `${c.download}: ${links.download}\n${c.notes}: ${links.notes}`,
    `${c.builds} ${c.after}`,
    `${c.off}: ${links.account}`,
    "Persisty",
  ].join("\n\n");
  const a = (href, label) => `<a href="${href}" style="color:#3d5c00">${label}</a>`;
  const p = (body) => `<p style="margin:0 0 16px">${body}</p>`;
  const html = [
    `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;color:#1b1f28;max-width:560px">`,
    p(c.lead(version)),
    p(`${a(links.download, c.download)} · ${a(links.notes, c.notes)}`),
    p(`${c.builds} ${c.after}`),
    p(`<span style="color:#5c6475;font-size:13px">${c.off}: ${a(links.account, links.account.replace("https://", ""))}</span>`),
    p("Persisty"),
    "</div>",
  ].join("\n");
  return { subject: c.subject(version), text, html };
}
