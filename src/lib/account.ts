import type { BillingState } from "./billing";
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
