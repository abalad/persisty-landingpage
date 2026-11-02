import type { BillingState, LapsedTeam, Subscription } from "./billing";
import { planById, type PlanFeature, type PlanId, type ShownPlanId } from "./plans";
import type { PaidPlan } from "./pricing";

/** The parts of My account, each at its own address. */
export type AccountSection = "overview" | "billing" | "team" | "devices" | "notifications";

export const SECTION_PATH: Record<AccountSection, string> = {
  overview: "/account",
  billing: "/account/billing",
  team: "/account/team",
  devices: "/account/devices",
  notifications: "/account/notifications",
};

/** The menu of My account: Time only for someone in a team, or whose team's subscription ended. */
export function accountSections(billing: BillingState | null): AccountSection[] {
  const team = (billing?.teams.length ?? 0) > 0 || (billing?.lapsedTeams.length ?? 0) > 0;
  return team ? ["overview", "billing", "team", "devices", "notifications"] : ["overview", "billing", "devices", "notifications"];
}

/** What a person can still subscribe to: never the plan they are on. */
export function subscribeOptions(plan: PlanId): PaidPlan[] {
  if (plan === "free") return ["pro", "team"];
  if (plan === "pro") return ["team"];
  return [];
}

/**
 * Where a signed-out visitor goes: sign-in, then back to the part of the
 * account they opened. `pathname` has no locale prefix; `intent` is the query
 * that carries what they came to do (`?notify=mac`, or empty).
 */
export function signInPath(pathname: string, intent: string): string {
  const extra = intent.replace(/^\?/, "");
  return `/sign-in?next=${encodeURIComponent(pathname)}${extra ? `&${extra}` : ""}`;
}

/** What a plan unlocks beyond the free core, plan by plan: Pro's features, and Team's on top for a team. Only what is available. */
export function unlockedFor(plan: PlanId): { plan: ShownPlanId; features: PlanFeature[] }[] {
  const group = (id: ShownPlanId) => ({ plan: id, features: planById(id).features.filter((f) => f.status === "available") });
  if (plan === "pro") return [group("pro")];
  if (plan === "team" || plan === "enterprise") return [group("pro"), group("team")];
  return [];
}

/** The one plan up worth showing: Pro to the free plan, Team to Pro; nothing above Team while Enterprise is hidden. */
export function upsellFor(plan: PlanId): "pro" | "team" | null {
  if (plan === "free") return "pro";
  if (plan === "pro") return "team";
  return null;
}

/** What the account says about its plan, decided once for the overview and Plan and billing. */
export interface PlanSummary {
  plan: PlanId;
  /** The team whose plan is in effect, when it comes from a team this account is in. */
  viaTeam: string | null;
  periodEnd: string | null;
  ends: boolean;
  pastDue: boolean;
  /** Whether this account opens the portal of the plan in effect. */
  manages: boolean;
  /** The list price is shown only to whoever pays it through Stripe: not to members, nor for a plan granted by hand. */
  showPrice: boolean;
  /** A personal subscription still billing next to a team's plan. */
  personal: Subscription | null;
  /** Teams whose subscription ended; their owner can subscribe again. */
  lapsed: LapsedTeam[];
  upsell: "pro" | "team" | null;
}

/**
 * Null until billing has loaded, so nobody who pays is shown the free plan
 * and an offer to subscribe in the meantime. `waiting`: back from checkout,
 * the new plan is still arriving, so nothing is offered.
 */
export function planSummary(billing: BillingState | null, waiting = false): PlanSummary | null {
  if (!billing) return null;
  const { entitlement, subscription } = billing;
  const plan = entitlement.plan;
  const lapsed = billing.lapsedTeams;
  const personal = billing.personal && billing.personal.org_id !== entitlement.org_id ? billing.personal : null;
  return {
    plan,
    viaTeam: entitlement.org_name && billing.teams.some((t) => t.id === entitlement.org_id) ? entitlement.org_name : null,
    periodEnd: subscription?.current_period_end ?? entitlement.period_end,
    ends: subscription?.cancel_at_period_end === true,
    pastDue: subscription?.status === "past_due",
    manages: billing.manages,
    showPrice: billing.manages && Boolean(subscription?.stripe_subscription_id) && (plan === "pro" || plan === "team"),
    personal,
    lapsed,
    upsell: waiting || (plan === "free" && lapsed.length > 0) ? null : upsellFor(plan),
  };
}
