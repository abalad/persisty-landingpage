/**
 * The visitor's answer to the cookie notice. Google Analytics runs only after
 * "granted"; with no answer or "denied", nothing from Google loads.
 */
export const CONSENT_COOKIE = "persisty_consent";

/** Dispatched on `window` by the footer's "Cookies" link to show the notice again. */
export const OPEN_NOTICE_EVENT = "persisty:cookies";

export type Consent = "granted" | "denied";

const ONE_YEAR = 31536000;

/** The saved answer, or null when there is none or it is not one we wrote. */
export function readConsent(cookies: string): Consent | null {
  const match = new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`).exec(cookies);
  const value = match?.[1];
  return value === "granted" || value === "denied" ? value : null;
}

/** The `document.cookie` string that saves the answer for a year. */
export function consentCookie(value: Consent, https: boolean): string {
  return `${CONSENT_COOKIE}=${value}; path=/; max-age=${ONE_YEAR}; SameSite=Lax${https ? "; Secure" : ""}`;
}

/** Google's cookies for this property: `_ga` and `_ga_<id without "G-">`. */
export function analyticsCookieNames(cookies: string, measurementId: string): string[] {
  const own = new Set(["_ga", `_ga_${measurementId.replace(/^G-/, "")}`]);
  return cookies
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => own.has(name));
}

/**
 * Strings that expire each cookie. gtag writes them on the parent domain
 * (`.persisty.app`), so both the host-only and the parent-domain copies go.
 * `localhost` and IP addresses take no domain attribute.
 */
export function expiredCookies(names: string[], host: string): string[] {
  const labels = host.split(".");
  const parent = labels.length > 1 && !/^[\d.]+$/.test(host) ? `.${labels.slice(-2).join(".")}` : null;
  return names.flatMap((name) => {
    const base = `${name}=; path=/; max-age=0`;
    return parent ? [base, `${base}; domain=${parent}`] : [base];
  });
}
