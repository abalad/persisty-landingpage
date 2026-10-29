import { routing, type Locale } from "@/i18n/routing";
import type { DesktopPlatform } from "./releases";

export const CODE_MIN = 6;
export const CODE_MAX = 10;

/** Digits only: codes get pasted with spaces, hyphens or a trailing newline. */
export function normalizeCode(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isValidCode(code: string): boolean {
  return new RegExp(`^\\d{${CODE_MIN},${CODE_MAX}}$`).test(code);
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

/**
 * Only paths on this site; anything that could leave it goes to the account.
 * A language prefix is dropped because the locale-aware router adds it again.
 */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return "/account";
  return next.replace(LOCALE_PREFIX, "") || "/";
}

export type AuthErrorKey = "rateLimited" | "expired" | "invalidEmail" | "network" | "unknown";

interface AuthErrorLike {
  code?: string;
  status?: number;
  name?: string;
}

export function authErrorKey(err: AuthErrorLike): AuthErrorKey {
  if (err.status === 429 || err.code === "over_email_send_rate_limit" || err.code === "over_request_rate_limit") return "rateLimited";
  if (err.code === "otp_expired") return "expired";
  if (err.code === "email_address_invalid" || err.code === "validation_failed") return "invalidEmail";
  if (err.name === "AuthRetryableFetchError" || err.status === 0) return "network";
  return "unknown";
}

export interface Intent {
  notify?: DesktopPlatform | "any";
  interest?: "enterprise";
}

const NOTIFY = new Set(["mac", "windows", "linux", "any"]);

/** What the visitor came to do, carried through sign-in in the query string. */
export function intentFromQuery(query: URLSearchParams): Intent {
  const intent: Intent = {};
  const notify = query.get("notify");
  if (notify && NOTIFY.has(notify)) intent.notify = notify as Intent["notify"];
  if (query.get("interest") === "enterprise") intent.interest = "enterprise";
  return intent;
}

type Metadata = Record<string, unknown>;

const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

/**
 * The user's metadata with the intent applied, or `null` when it already
 * holds it. Turning the notice on also records the site's language, which
 * the release e-mail is written in.
 */
export function mergeIntent(meta: Metadata, intent: Intent, locale?: Locale): Metadata | null {
  const next: Metadata = { ...meta };
  if (intent.notify) {
    next.notify_release = true;
    const platforms = list(meta.notify_platforms);
    next.notify_platforms = intent.notify === "any" || platforms.includes(intent.notify) ? platforms : [...platforms, intent.notify];
    if (locale) next.locale = locale;
  }
  if (intent.interest) {
    const interests = list(meta.interests);
    next.interests = interests.includes(intent.interest) ? interests : [...interests, intent.interest];
  }
  return JSON.stringify(next) === JSON.stringify(meta) ? null : next;
}
