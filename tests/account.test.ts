import { describe, expect, it } from "vitest";
import { accountSections, planSummary, signInPath, subscribeOptions, unlockedFor, upsellFor } from "../src/lib/account";
import { FREE, type BillingState, type Team } from "../src/lib/billing";

const state = (over: Partial<BillingState> = {}): BillingState => ({ entitlement: FREE, subscription: null, manages: false, personal: null, teams: [], lapsedTeams: [], failed: false, ...over });
const team = {
  id: "t1",
  name: "Produto",
  role: "member",
  portal: false,
  seats: null,
  members: [],
  invites: [],
  subscription: { org_id: "t1", plan: "team", status: "active", seats: 3, current_period_end: null, cancel_at_period_end: false, stripe_subscription_id: "sub_1" },
} as Team;

describe("account panel", () => {
  it("shows Time only to people with a team, current or lapsed", () => {
    expect(accountSections(state())).toEqual(["overview", "billing", "devices", "notifications"]);
    expect(accountSections(state({ teams: [team] }))).toContain("team");
    expect(accountSections(state({ lapsedTeams: [{ id: "t2", name: "Antigo", members: 2 }] }))).toContain("team");
    expect(accountSections(null)).toEqual(["overview", "billing", "devices", "notifications"]);
  });

  it("never offers the plan you already have", () => {
    expect(subscribeOptions("free")).toEqual(["pro", "team"]);
    expect(subscribeOptions("pro")).toEqual(["team"]);
    expect(subscribeOptions("team")).toEqual([]);
  });

  it("comes back to the part of the account you asked for", () => {
    expect(signInPath("/account/devices", "")).toBe("/sign-in?next=%2Faccount%2Fdevices");
    expect(signInPath("/account", "?notify=mac")).toBe("/sign-in?next=%2Faccount&notify=mac");
  });

  it("unlocks what the plan pays for, never Growth", () => {
    expect(unlockedFor("free")).toEqual([]);
    expect(unlockedFor("pro").map((g) => g.plan)).toEqual(["pro"]);
    expect(unlockedFor("pro")[0].features.map((f) => f.id)).toEqual(["accountRotation", "requestQueue", "restorePoints", "verifyOnFinish", "worktrees", "offlineLicense"]);
    expect(unlockedFor("team").map((g) => g.plan)).toEqual(["pro", "team"]);
    expect(unlockedFor("team").flatMap((g) => g.features).some((f) => f.status !== "available" || f.id === "growth")).toBe(false);
  });

  it("invites one step up", () => {
    expect(upsellFor("free")).toBe("pro");
    expect(upsellFor("pro")).toBe("team");
    expect(upsellFor("team")).toBeNull();
  });
});

describe("plan summary", () => {
  const paid = (plan: "pro" | "team", over: Partial<Team["subscription"]> = {}) => ({ org_id: plan === "team" ? "t1" : "me", plan, status: "active", seats: 1, current_period_end: "2027-10-28T12:00:00Z", cancel_at_period_end: false, stripe_subscription_id: "sub_1", ...over });

  it("is not known until billing has loaded, so nothing is sold to a paying customer meanwhile", () => {
    expect(planSummary(null)).toBeNull();
  });

  it("shows a team member who does not manage the team's plan, without a price or a portal", () => {
    const s = planSummary(state({ entitlement: { plan: "team", org_id: "t1", org_name: "Produto", features: [], period_end: null }, subscription: paid("team"), manages: false, teams: [team] }))!;
    expect(s.plan).toBe("team");
    expect(s.viaTeam).toBe("Produto");
    expect(s.manages).toBe(false);
    expect(s.showPrice).toBe(false);
    expect(s.upsell).toBeNull();
  });

  it("points out a personal Pro still billing next to a team's plan", () => {
    const s = planSummary(state({ entitlement: { plan: "team", org_id: "t1", org_name: "Produto", features: [], period_end: null }, subscription: paid("team"), teams: [team], personal: paid("pro") }))!;
    expect(s.personal?.plan).toBe("pro");
  });

  it("tells the owner of a lapsed team, and does not sell them Pro", () => {
    const s = planSummary(state({ lapsedTeams: [{ id: "t2", name: "Antigo", members: 2 }] }))!;
    expect(s.plan).toBe("free");
    expect(s.lapsed.map((t) => t.name)).toEqual(["Antigo"]);
    expect(s.upsell).toBeNull();
  });

  it("shows the price only to whoever pays it through Stripe", () => {
    const own = planSummary(state({ entitlement: { plan: "pro", org_id: "me", org_name: null, features: [], period_end: null }, subscription: paid("pro"), manages: true }))!;
    expect(own.showPrice).toBe(true);
    const byHand = planSummary(state({ entitlement: { plan: "pro", org_id: "me", org_name: null, features: [], period_end: null }, subscription: paid("pro", { stripe_subscription_id: null }), manages: true }))!;
    expect(byHand.showPrice).toBe(false);
  });

  it("sells nothing while the plan from a checkout is still arriving", () => {
    expect(planSummary(state(), true)!.upsell).toBeNull();
    expect(planSummary(state())!.upsell).toBe("pro");
  });
});
