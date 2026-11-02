import { describe, expect, it } from "vitest";
import { accountSections, signInPath, subscribeOptions } from "../src/lib/account";
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
});
