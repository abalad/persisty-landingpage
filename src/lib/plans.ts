import type { Availability } from "@/components/site/Badge";

export type PlanId = "free" | "pro" | "team" | "enterprise";

export interface PlanFeature {
  /** Key under `pricing.features` (name) and `features` (line, where in the app) in the messages. */
  id: string;
  status: Availability;
  /** The section id on the plan's page; only available features have one (the planned sit under `#roadmap`). */
  anchor?: string;
}

export interface Plan {
  id: PlanId;
  /** The price lives in `priceFor`, by currency; Free is zero and Enterprise is agreed by contact. */
  billing: "free" | "month" | "user-month" | "contact";
  /** Features this plan adds on top of the previous one. */
  features: PlanFeature[];
}

const available = (id: string, anchor: string): PlanFeature => ({ id, status: "available", anchor });
const planned = (id: string): PlanFeature => ({ id, status: "planned" });

export const PLANS: Plan[] = [
  {
    id: "free",
    billing: "free",
    features: [
      available("persistentSessions", "recovery"),
      available("recovery", "recovery"),
      available("projects", "projects"),
      available("agentStates", "states"),
      available("board", "states"),
      available("editorGit", "editor"),
      available("gitHosting", "git"),
      available("usage", "usage"),
      available("notifications", "notifications"),
      available("mascot", "mascot"),
      available("voice", "voice"),
      available("trackers", "issues"),
      available("agentTools", "agents"),
      available("networkLog", "privacy"),
      available("noAccount", "offline"),
      planned("issueToSession"),
      planned("bestOfN"),
      planned("crossReview"),
    ],
  },
  {
    id: "pro",
    billing: "month",
    features: [
      available("accountRotation", "accounts"),
      available("requestQueue", "queue"),
      available("restorePoints", "restore-points"),
      available("verifyOnFinish", "verify"),
      available("worktrees", "worktree"),
      available("offlineLicense", "license"),
      planned("remote"),
      planned("autopilot"),
      planned("nightShift"),
      planned("sessionXray"),
    ],
  },
  {
    id: "team",
    billing: "user-month",
    features: [available("teamBilling", "billing"), planned("teamBoard"), planned("budgets"), planned("observability"), planned("teamMemory"), planned("policies")],
  },
  {
    id: "enterprise",
    billing: "contact",
    features: [planned("sso"), planned("modelGateway"), planned("selfHost"), planned("sourceReview")],
  },
];

export type ShownPlanId = Exclude<PlanId, "enterprise">;

/** The plans the site shows. Enterprise is out by the user's decision (2026-11-02); to bring it back, add it here. */
export const SHOWN_PLAN_IDS: readonly ShownPlanId[] = ["free", "pro", "team"];

export const SHOWN_PLANS: Plan[] = PLANS.filter((p) => (SHOWN_PLAN_IDS as readonly PlanId[]).includes(p.id));

/** What the features menu lists for each plan: at most six, available first. */
export const MENU_FEATURES: Record<ShownPlanId, string[]> = {
  free: ["recovery", "projects", "agentStates", "editorGit", "voice", "trackers"],
  pro: ["accountRotation", "requestQueue", "restorePoints", "verifyOnFinish", "worktrees", "remote"],
  team: ["teamBilling", "teamBoard", "budgets", "observability", "teamMemory", "policies"],
};

export function planPath(plan: ShownPlanId): "/free" | "/pro" | "/team" {
  return `/${plan}`;
}

/** Where a feature is shown: its section on the plan's page, or the plan's roadmap when it is still planned. */
export function featureHref(plan: ShownPlanId, feature: PlanFeature): string {
  return `${planPath(plan)}#${feature.anchor ?? "roadmap"}`;
}

/** The shown plan that introduces a feature. */
export function findFeature(id: string): { plan: ShownPlanId; feature: PlanFeature } | undefined {
  for (const plan of SHOWN_PLANS) {
    const feature = plan.features.find((f) => f.id === id);
    if (feature) return { plan: plan.id as ShownPlanId, feature };
  }
  return undefined;
}

export function planById(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`unknown plan ${id}`);
  return plan;
}
