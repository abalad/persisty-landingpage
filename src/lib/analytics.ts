import type { DesktopPlatform, FileKind } from "./releases";

/**
 * Google Analytics on the site, after the visitor clicks Accept (see
 * `consent.ts`). Everything that reaches Google goes through here: an address
 * cut down to its origin, path and campaign parameters, and four events with
 * their own small params. Never an e-mail, a name, a user id or typed text.
 */

/** The only query parameters that reach Google: where the visit came from. */
export const ALLOWED_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "gclid", "gbraid", "wbraid", "fbclid", "ref"] as const;

/** No automatic page view (it would carry the raw address), no Google signals, cookies for 13 months. */
const CONFIG = { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 34128000 } as const;

const NEW_ACCOUNT_MS = 10 * 60 * 1000;

export type AnalyticsEvent =
  | { name: "download"; params: { platform: DesktopPlatform; kind: FileKind; version: string } }
  | { name: "sign_up" | "login"; params: { method: "email" } }
  | { name: "begin_checkout"; params: { plan: string } }
  | { name: "checkout_done"; params: { plan?: string } };

/** The parts of `window` gtag uses; tests pass a plain object. */
export interface GtagWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  location: { href: string };
  document: { referrer: string };
  [flag: string]: unknown;
}

const configured = new WeakMap<GtagWindow, string>();
const lastSent = new WeakMap<GtagWindow, string>();
/** The allowed parameters of the address the visit landed on, kept in memory only. */
const landings = new WeakMap<GtagWindow, string>();
const campaignSent = new WeakSet<GtagWindow>();

const browserWindow = (): GtagWindow | undefined => (typeof window === "undefined" ? undefined : (window as unknown as GtagWindow));

/** Origin and path plus the allowed parameters, in the order they came; no hash. */
export function cleanLocation(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "";
  }
  const kept = new URLSearchParams();
  for (const [key, value] of url.searchParams) {
    if ((ALLOWED_PARAMS as readonly string[]).includes(key)) kept.append(key, value);
  }
  const query = kept.toString();
  return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
}

/**
 * Only the site the visitor came from, never the page or its search. Coming
 * back from Stripe (checkout or billing portal) is not a new origin: crediting
 * it would hand every subscription to `checkout.stripe.com / referral`.
 */
export function cleanReferrer(referrer: string): string {
  try {
    const url = new URL(referrer);
    if (url.origin === "null" || /(^|\.)stripe\.com$/.test(url.hostname)) return "";
    return url.origin;
  } catch {
    return "";
  }
}

const INSTALLERS: [RegExp, DesktopPlatform, FileKind][] = [
  [/\.dmg$/, "mac", "dmg"],
  [/-setup\.exe$/, "windows", "nsis"],
  [/\.AppImage$/, "linux", "appimage"],
  [/\.deb$/, "linux", "deb"],
];

/** The installer a link downloads, read from its GitHub release URL (`…/releases/download/v<version>/<file>`). */
export function downloadOf(href: string): { platform: DesktopPlatform; kind: FileKind; version: string } | null {
  let path: string;
  try {
    path = new URL(href).pathname;
  } catch {
    return null;
  }
  const match = /\/releases\/download\/v([^/]+)\/([^/]+)$/.exec(path);
  if (!match) return null;
  const [, version, file] = match;
  const installer = INSTALLERS.find(([pattern]) => pattern.test(file));
  return installer ? { platform: installer[1], kind: installer[2], version } : null;
}

/** `checkout_done` on arrival back from Stripe; the plan only when it is already paid. */
export function checkoutDone(plan: string): AnalyticsEvent {
  return { name: "checkout_done", params: plan !== "free" ? { plan } : {} };
}

/** An account created in the last ten minutes counts as a sign-up, not a sign-in. */
export function isNewAccount(createdAt: string | undefined, now: number = Date.now()): boolean {
  if (!createdAt) return false;
  const created = Date.parse(createdAt);
  return Number.isFinite(created) && now - created <= NEW_ACCOUNT_MS;
}

/**
 * Remembers the campaign of the address the visit landed on (nothing is sent).
 * The notice never blocks the page, so people often accept a page or two
 * later, when `utm_*` and `gclid` are no longer in the address.
 */
export function rememberLanding(win: GtagWindow | undefined = browserWindow()): void {
  if (!win || landings.has(win)) return;
  landings.set(win, new URL(cleanLocation(win.location.href) || "http://x/").search.slice(1));
}

/** Sets up `dataLayer` and `gtag` once per window, and turns measuring back on after a stop. */
export function startAnalytics(id: string, win: GtagWindow | undefined = browserWindow()): void {
  if (!win) return;
  win[`ga-disable-${id}`] = false;
  if (configured.get(win) === id) return;
  const layer = (win.dataLayer ??= []);
  // gtag.js reads the `arguments` object itself, not an array.
  win.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    layer.push(arguments);
  };
  // `send_page_view: false` in the config alone does not stop the Google tag's own page
  // view on load, which carries the raw address (measured on 2026-11-16). Set globally
  // first, it does; our `pageView` sends the clean one.
  win.gtag("set", "send_page_view", false);
  win.gtag("js", new Date());
  win.gtag("config", id, { ...CONFIG });
  configured.set(win, id);
}

/** Turns measuring off at once (Google's own switch) after the visitor changes their answer to Decline. */
export function stopAnalytics(id: string, win: GtagWindow | undefined = browserWindow()): void {
  if (!win) return;
  win[`ga-disable-${id}`] = true;
  lastSent.delete(win);
}

/**
 * One `page_view` per clean address. A change only to the hash or to a
 * parameter Google never sees (`?checkout=done` cleared by My account) is the
 * same page. The clean address is also `set`, so scrolls, outbound clicks and
 * the events below carry it instead of the raw one.
 */
export function pageView(win: GtagWindow | undefined = browserWindow()): void {
  if (!win?.gtag) return;
  const address = cleanLocation(win.location.href);
  if (!address || lastSent.get(win) === address) return;
  lastSent.set(win, address);
  // The first page view carries the landing campaign when this address has none of its own.
  const landing = campaignSent.has(win) ? "" : (landings.get(win) ?? "");
  campaignSent.add(win);
  const page_location = landing && !address.includes("?") ? `${address}?${landing}` : address;
  const page = { page_location, page_referrer: cleanReferrer(win.document.referrer) };
  win.gtag("set", page);
  win.gtag("event", "page_view", page);
}

/** Sends one event; before Accept there is no `gtag` and it is dropped. */
export function track(event: AnalyticsEvent, win: GtagWindow | undefined = browserWindow()): void {
  if (!win?.gtag) return;
  win.gtag("event", event.name, { ...event.params, page_location: cleanLocation(win.location.href) });
}

// The landing address, as early as this module loads (the layout's first render).
rememberLanding();
