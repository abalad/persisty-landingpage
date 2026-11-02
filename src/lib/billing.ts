import type { Locale } from "@/i18n/routing";
import type { PlanId } from "./plans";
import type { PaidPlan } from "./pricing";
import { SITE_URL } from "./site";
import { supabase } from "./supabase";

export const MAX_SEATS = 100;
export const TEAM_NAME_MAX = 80;
export const DEFAULT_SEATS = 2;

export type BillingErrorKey = "network" | "invalid" | "forbidden" | "noCustomer" | "unknown";

export interface TeamOrder {
  name: string;
  seats: number;
}

export type TeamProblem = "name" | "nameLong" | "seats";

/** What is wrong with a team order, if anything; the function checks the same rules. */
export function teamProblem(order: TeamOrder): TeamProblem | null {
  const name = order.name.trim();
  if (!name) return "name";
  if (name.length > TEAM_NAME_MAX) return "nameLong";
  if (!Number.isInteger(order.seats) || order.seats < 1 || order.seats > MAX_SEATS) return "seats";
  return null;
}

/** Sign-in first, then back to the pricing page with the plan still chosen. */
export function signInHref(plan: PaidPlan): string {
  return `/sign-in?next=${encodeURIComponent(`/pricing?plan=${plan}`)}`;
}

/** The link an owner sends to a person invited by e-mail: signing in with that e-mail accepts the invite. */
export function inviteLink(locale: Locale): string {
  return `${SITE_URL}${locale === "pt-BR" ? "" : `/${locale}`}/sign-in?next=/account`;
}

class CallError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

function errorKey(err: unknown): BillingErrorKey {
  if (!(err instanceof CallError)) return "unknown";
  if (err.status === 0) return "network";
  if (err.code === "bad_request") return "invalid";
  if (err.code === "forbidden") return "forbidden";
  if (err.code === "no_customer") return "noCustomer";
  return "unknown";
}

/** One of the billing functions; its answer is always `{ url }`. */
async function call(name: "create-checkout" | "billing-portal", body: Record<string, unknown>): Promise<string> {
  const { data, error } = await supabase().functions.invoke(name, { body });
  if (!error) {
    const url = (data as { url?: unknown } | null)?.url;
    if (typeof url === "string" && url.startsWith("https://")) return url;
    throw new CallError(200, "no_url");
  }
  const res = (error as { context?: unknown }).context;
  if (res instanceof Response) {
    let code = "";
    try {
      code = String(((await res.clone().json()) as { error?: unknown }).error ?? "");
    } catch {
      // Not JSON: the status says enough.
    }
    throw new CallError(res.status, code);
  }
  throw new CallError(0, "network");
}

export interface Navigation {
  locale: Locale;
  /** A page of this site, through the locale-aware router. */
  go: (path: string) => void;
  /** Stripe's own pages. */
  leave?: (url: string) => void;
}

const leaveDefault = (url: string) => window.location.assign(url);

export type SubscribeResult = "signIn" | "teamForm" | "checkout" | "portal" | { error: BillingErrorKey };

export async function hasSession(): Promise<boolean> {
  const { data } = await supabase().auth.getSession();
  return Boolean(data.session);
}

/**
 * Buys a plan. Without a session it goes to sign-in and comes back to the
 * pricing page with the plan chosen; Team without an order asks for the
 * team's name and seats first. An account that already has a plan goes to
 * the portal, where it is managed.
 */
export async function subscribe(plan: PaidPlan, nav: Navigation, team?: TeamOrder): Promise<SubscribeResult> {
  if (!(await hasSession())) {
    nav.go(signInHref(plan));
    return "signIn";
  }
  if (plan === "team" && !team) return "teamForm";
  const leave = nav.leave ?? leaveDefault;
  try {
    const body: Record<string, unknown> = { plan, locale: nav.locale };
    if (plan === "team" && team) Object.assign(body, { team_name: team.name.trim(), seats: team.seats });
    leave(await call("create-checkout", body));
    return "checkout";
  } catch (err) {
    if (err instanceof CallError && err.status === 401) {
      nav.go(signInHref(plan));
      return "signIn";
    }
    if (err instanceof CallError && err.code === "already_subscribed") {
      const portal = await openPortal(nav);
      return portal === null ? "portal" : { error: portal };
    }
    return { error: errorKey(err) };
  }
}

/** Stripe's portal for the personal plan, or for a team (`orgId`). `null` once it is on its way. */
export async function openPortal(nav: Navigation, orgId?: string): Promise<BillingErrorKey | null> {
  try {
    const body: Record<string, unknown> = { locale: nav.locale };
    if (orgId) body.org_id = orgId;
    (nav.leave ?? leaveDefault)(await call("billing-portal", body));
    return null;
  } catch (err) {
    return errorKey(err);
  }
}

// ---- The account page's billing data ----------------------------------------

export type OrgRole = "owner" | "admin" | "member";

export interface Entitlement {
  plan: PlanId;
  org_id: string | null;
  org_name: string | null;
  features: string[];
  period_end: string | null;
}

export interface Subscription {
  org_id: string;
  plan: PlanId;
  status: string;
  seats: number;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface Seats {
  seats: number;
  members: number;
  pending: number;
}

/** A row of `team_members`, which only owners and admins may call. */
export interface TeamMember {
  user_id: string;
  role: OrgRole;
  joined_at: string;
  display_name: string | null;
  email: string | null;
}

export interface TeamInvite {
  id: string;
  email: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  role: OrgRole;
  subscription: Subscription;
  /** Only for owners and admins, who manage the team. */
  seats: Seats | null;
  members: TeamMember[];
  invites: TeamInvite[];
}

export interface BillingState {
  entitlement: Entitlement;
  /** The subscription behind the entitlement, when the plan is paid. */
  subscription: Subscription | null;
  /** Whether this account opens the portal for the entitlement's organisation. */
  manages: boolean;
  teams: Team[];
  failed: boolean;
}

export const FREE: Entitlement = { plan: "free", org_id: null, org_name: null, features: [], period_end: null };
const LIVE = new Set(["trialing", "active", "past_due"]);
const MANAGERS = new Set<OrgRole>(["owner", "admin"]);

export function canManage(role: OrgRole): boolean {
  return MANAGERS.has(role);
}

/** Members and pending invites never pass the paid seats. */
export function freeSeats(seats: Seats): number {
  return Math.max(0, seats.seats - seats.members - seats.pending);
}

export type InviteErrorKey = "full" | "taken" | "invalidEmail" | "forbidden" | "unknown";

export function inviteErrorKey(code: string | undefined): InviteErrorKey {
  if (code === "PT402") return "full";
  if (code === "23505") return "taken";
  if (code === "22023") return "invalidEmail";
  if (code === "42501") return "forbidden";
  return "unknown";
}

async function teamDetails(orgId: string): Promise<Pick<Team, "seats" | "members" | "invites"> & { failed: boolean }> {
  const db = supabase();
  const [seats, members, invites] = await Promise.all([
    db.rpc("team_seats", { p_org: orgId }),
    db.rpc("team_members", { p_org: orgId }),
    db.from("org_invites").select("id,email,created_at").eq("org_id", orgId).is("accepted_at", null).is("revoked_at", null).order("created_at"),
  ]);
  return {
    seats: (seats.data as Seats[] | null)?.[0] ?? null,
    // Already owner first, then by when each one joined.
    members: (members.data as TeamMember[] | null) ?? [],
    invites: (invites.data as TeamInvite[] | null) ?? [],
    failed: Boolean(seats.error || members.error || invites.error),
  };
}

/**
 * Everything the account page shows about the plan. Invites waiting for
 * this e-mail are accepted first, so a new member sees the team at once.
 */
export async function loadBilling(userId: string): Promise<BillingState> {
  const db = supabase();
  const accepted = await db.rpc("accept_my_invites");
  const [ent, mine] = await Promise.all([db.rpc("my_entitlement"), db.from("org_members").select("org_id,role").eq("user_id", userId)]);
  const memberships = (mine.data as { org_id: string; role: OrgRole }[] | null) ?? [];
  const ids = memberships.map((m) => m.org_id);
  const [orgs, subs] = ids.length
    ? await Promise.all([
        db.from("orgs").select("id,kind,name").in("id", ids),
        db.from("subscriptions").select("org_id,plan,status,seats,current_period_end,cancel_at_period_end").in("org_id", ids),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
      ];
  let failed = Boolean(accepted.error || ent.error || mine.error || orgs.error || subs.error);

  const entitlement = (ent.data as Entitlement[] | null)?.[0] ?? FREE;
  const subscriptions = ((subs.data as Subscription[] | null) ?? []).filter((s) => LIVE.has(s.status));
  const roleOf = new Map(memberships.map((m) => [m.org_id, m.role]));
  const orgList = (orgs.data as { id: string; kind: "personal" | "team"; name: string }[] | null) ?? [];
  const subscription = entitlement.plan === "free" ? null : (subscriptions.find((s) => s.org_id === entitlement.org_id) ?? null);
  const entitledOrg = orgList.find((o) => o.id === entitlement.org_id);

  // A team appears once it has a plan: a checkout left halfway leaves an empty one behind.
  const teams: Team[] = [];
  for (const org of orgList) {
    const sub = org.kind === "team" ? subscriptions.find((s) => s.org_id === org.id) : undefined;
    const role = roleOf.get(org.id);
    if (!sub || !role) continue;
    const team: Team = { id: org.id, name: org.name, role, subscription: sub, seats: null, members: [], invites: [] };
    if (canManage(role)) {
      const details = await teamDetails(org.id);
      failed ||= details.failed;
      Object.assign(team, { seats: details.seats, members: details.members, invites: details.invites });
    }
    teams.push(team);
  }

  const role = entitlement.org_id ? roleOf.get(entitlement.org_id) : undefined;
  const manages = subscription !== null && (entitledOrg?.kind === "personal" || (role !== undefined && canManage(role)));
  return { entitlement, subscription, manages, teams, failed };
}

export type MutationResult = { ok: true } | { ok: false; code?: string };

export async function inviteMember(orgId: string, email: string): Promise<MutationResult> {
  const { error } = await supabase().rpc("invite_member", { p_org: orgId, p_email: email.trim() });
  return error ? { ok: false, code: error.code } : { ok: true };
}

export async function revokeInvite(inviteId: string): Promise<MutationResult> {
  const { error } = await supabase().rpc("revoke_invite", { p_invite: inviteId });
  return error ? { ok: false, code: error.code } : { ok: true };
}

export async function removeMember(orgId: string, userId: string): Promise<MutationResult> {
  // Row-level security drops a delete it does not allow without an error, so the row coming back is the proof.
  const { data, error } = await supabase().from("org_members").delete().eq("org_id", orgId).eq("user_id", userId).select("user_id");
  if (error) return { ok: false, code: error.code };
  return data && data.length > 0 ? { ok: true } : { ok: false, code: "42501" };
}
