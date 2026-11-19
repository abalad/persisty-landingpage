import type { Locale } from "@/i18n/routing";
import { authErrorKey, normalizeCode, type AuthErrorKey } from "./auth";
import type { BillingState } from "./billing";
import type { Currency } from "./pricing";
import { supabase } from "./supabase";

/** A code sign-in counts as recent for this long; the function checks the same window. */
export const FRESH_MS = 10 * 60_000;
/** sessionStorage: what the page after the deletion shows, `{ email: string; sent: boolean }`. */
export const DELETED_KEY = "persisty.deleted";

export type DeletionAction = "preview" | "delete";
/** `changed`: the session is now another account's than the one reviewed (another tab signed in as someone else). */
export type DeletionErrorKey = "network" | "stale" | "forbidden" | "changed" | "unknown";

export interface DeletionPreview {
  email: string;
  computers: number;
  fresh: boolean;
  subscriptions: { plan: "pro" | "team"; team: string | null; refund: { amount: number; currency: Currency } | null }[];
  ownedTeams: string[];
  memberTeams: string[];
}

export type GoneLine =
  | { kind: "account"; email: string; computers: number }
  | { kind: "subscription"; plan: "pro" | "team"; refund: { amount: number; currency: Currency } | null }
  | { kind: "teams"; names: string[] }
  | { kind: "membership"; name: string };

export type RecapItem = { kind: "account" } | { kind: "plan"; plan: "pro" | "team" } | { kind: "team"; name: string };

/** The sign-in calls the dialog makes, apart so tests can stand in for them. */
export interface DeletionAuth {
  accessToken: () => Promise<string | null>;
  sendCode: (email: string) => Promise<AuthErrorKey | null>;
  verifyCode: (email: string, code: string) => Promise<AuthErrorKey | null>;
  signOut: () => Promise<void>;
}

const currency = (c: unknown): Currency => (String(c).toUpperCase() === "BRL" ? "BRL" : "USD");
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

/** The function's preview, in the site's words. */
export function readPreview(data: Record<string, unknown>): DeletionPreview {
  const subs = Array.isArray(data.subscriptions) ? (data.subscriptions as Record<string, unknown>[]) : [];
  return {
    email: typeof data.email === "string" ? data.email : "",
    computers: typeof data.computers === "number" ? data.computers : 0,
    fresh: data.fresh === true,
    subscriptions: subs.map((s) => {
      const refund = s.refund as { amount?: number; currency?: string } | null | undefined;
      return {
        plan: s.plan === "team" ? "team" : "pro",
        team: typeof s.team === "string" ? s.team : null,
        refund: refund && typeof refund.amount === "number" ? { amount: refund.amount, currency: currency(refund.currency) } : null,
      };
    }),
    ownedTeams: strings(data.owned_teams),
    memberTeams: strings(data.member_teams),
  };
}

export function deletionErrorKey(status: number, code: string): DeletionErrorKey {
  if (status === 0) return "network";
  if (code === "stale_sign_in") return "stale";
  if (code === "forbidden") return "forbidden";
  if (code === "account_changed") return "changed";
  return "unknown";
}

export type DeletionResult = { ok: true; data: Record<string, unknown> } | { ok: false; error: DeletionErrorKey };

/**
 * One call to the delete-account function with the person's session. `email`, for `delete`: the
 * account the person reviewed; the function refuses when the session is now another one's.
 */
export async function deletion(action: DeletionAction, locale: Locale, email?: string): Promise<DeletionResult> {
  const { data, error } = await supabase().functions.invoke("delete-account", { body: { action, locale, ...(email ? { email } : {}) } });
  if (!error) return { ok: true, data: (data ?? {}) as Record<string, unknown> };
  const res = (error as { context?: unknown }).context;
  if (!(res instanceof Response)) return { ok: false, error: "network" };
  let code = "";
  try {
    code = String(((await res.clone().json()) as { error?: unknown }).error ?? "");
  } catch {
    // Not JSON: the status says enough.
  }
  return { ok: false, error: deletionErrorKey(res.status, code) };
}

/**
 * When the person last signed in, in seconds: the newest `amr` timestamp, which a
 * renewed session keeps (the token's `iat` moves on every renewal). 0 when unreadable.
 */
export function signedInAt(accessToken: string): number {
  try {
    const part = accessToken.split(".")[1];
    if (!part) return 0;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, "="))) as { amr?: { timestamp?: unknown }[] };
    if (!Array.isArray(claims.amr)) return 0;
    return claims.amr.reduce((max, a) => (typeof a?.timestamp === "number" && a.timestamp > max ? a.timestamp : max), 0);
  } catch {
    return 0;
  }
}

export function isFresh(accessToken: string, nowMs: number): boolean {
  const at = signedInAt(accessToken);
  return at > 0 && nowMs - at * 1000 <= FRESH_MS;
}

/** What goes with the account: the account, each plan, the owned teams in one line, each team only joined. */
export function goneLines(p: DeletionPreview): GoneLine[] {
  const lines: GoneLine[] = [{ kind: "account", email: p.email, computers: p.computers }];
  for (const s of p.subscriptions) lines.push({ kind: "subscription", plan: s.plan, refund: s.refund });
  if (p.ownedTeams.length) lines.push({ kind: "teams", names: p.ownedTeams });
  for (const name of p.memberTeams) lines.push({ kind: "membership", name });
  return lines;
}

/** The last look before confirming: the account, the plans and the owned teams, never people. */
export function recapItems(p: DeletionPreview): RecapItem[] {
  return [
    { kind: "account" },
    ...p.subscriptions.map((s): RecapItem => ({ kind: "plan", plan: s.plan })),
    ...p.ownedTeams.map((name): RecapItem => ({ kind: "team", name })),
  ];
}

/**
 * Whether deleting the account ends a plan Stripe bills: the personal one, or one of a Team the
 * account owns. A Team the account only administers stays, and its plan with it.
 */
export function paysSomething(billing: BillingState): boolean {
  return Boolean(billing.personal?.stripe_subscription_id) || billing.teams.some((t) => t.role === "owner" && Boolean(t.subscription.stripe_subscription_id));
}

/**
 * Where "cancel the subscription first" goes: the plan in effect when the deletion ends it (the
 * personal one, or a Team's the account owns), else the personal one; never one already ending.
 */
export function cancelTarget(billing: BillingState): { orgId?: string; plan: "pro" | "team"; duplicate: boolean } | null {
  const { entitlement, subscription } = billing;
  const endsWithAccount =
    entitlement.org_id !== null && (billing.personal?.org_id === entitlement.org_id || billing.teams.some((t) => t.id === entitlement.org_id && t.role === "owner"));
  if (endsWithAccount && subscription?.stripe_subscription_id && !subscription.cancel_at_period_end) {
    return { orgId: entitlement.org_id ?? undefined, plan: entitlement.plan === "team" ? "team" : "pro", duplicate: false };
  }
  const personal = billing.personal && billing.personal.org_id !== entitlement.org_id ? billing.personal : null;
  if (personal && !personal.cancel_at_period_end) {
    return { orgId: personal.org_id, plan: personal.plan === "team" ? "team" : "pro", duplicate: true };
  }
  return null;
}

export const supabaseAuth: DeletionAuth = {
  accessToken: async () => (await supabase().auth.getSession()).data.session?.access_token ?? null,
  sendCode: async (email) => {
    const { error } = await supabase().auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    return error ? authErrorKey(error) : null;
  },
  verifyCode: async (email, code) => {
    const { error } = await supabase().auth.verifyOtp({ email, token: normalizeCode(code), type: "email" });
    return error ? authErrorKey(error) : null;
  },
  // This browser only: the account is gone, so the server has no session left to end.
  signOut: async () => {
    await supabase().auth.signOut({ scope: "local" });
  },
};

/**
 * Whether the account is still there, asked when the deletion answers with an error (it may have
 * gone all the same). `token` is the one the deletion used: the session itself may need renewing,
 * and a renewal refused for a deleted account must not read as "still here". Only the server
 * saying the user no longer exists counts as gone; anything else (no network, say) leaves it.
 */
export async function accountStillThere(token: string | null): Promise<boolean> {
  try {
    const { data, error } = await supabase().auth.getUser(token ?? undefined);
    return Boolean(data.user) || error?.code !== "user_not_found";
  } catch {
    return true;
  }
}
