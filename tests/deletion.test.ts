import { describe, expect, it } from "vitest";
import type { BillingState, Subscription } from "../src/lib/billing";
import { cancelTarget, deletionErrorKey, goneLines, isFresh, paysSomething, readPreview, recapItems, signedInAt, type DeletionPreview } from "../src/lib/deletion";

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
const token = (claims: unknown) => `${b64({ alg: "HS256" })}.${b64(claims)}.sig`;
const now = 1_800_000_000;

const preview = (over: Partial<DeletionPreview> = {}): DeletionPreview => ({
  email: "a@example.test",
  computers: 2,
  fresh: true,
  subscriptions: [
    { plan: "pro", team: null, refund: null },
    { plan: "team", team: "Acme", refund: { amount: 990, currency: "BRL" } },
  ],
  ownedTeams: ["Acme", "Beta"],
  memberTeams: ["Gama"],
  ...over,
});

const sub = (over: Partial<Subscription> = {}): Subscription => ({ org_id: "org-1", plan: "pro", status: "active", seats: 1, current_period_end: null, cancel_at_period_end: false, stripe_subscription_id: "sub_1", ...over });
const billing = (over: Partial<BillingState> = {}): BillingState => ({
  entitlement: { plan: "pro", org_id: "org-1", org_name: null, features: [], period_end: null },
  subscription: sub(),
  manages: true,
  personal: null,
  teams: [],
  lapsedTeams: [],
  failed: false,
  ...over,
});

describe("signing in again before deleting", () => {
  it("reads the sign-in time from amr, not from when the token was renewed", () => {
    const t = token({ iat: now, amr: [{ method: "otp", timestamp: now - 3 * 3600 }] });
    expect(signedInAt(t)).toBe(now - 3 * 3600);
    expect(isFresh(t, now * 1000)).toBe(false);
  });

  it("counts a code sign-in from 9 minutes ago as recent and 11 as not", () => {
    expect(isFresh(token({ amr: [{ method: "otp", timestamp: now - 9 * 60 }] }), now * 1000)).toBe(true);
    expect(isFresh(token({ amr: [{ method: "otp", timestamp: now - 11 * 60 }] }), now * 1000)).toBe(false);
  });

  it("an unreadable token is never recent", () => {
    expect(signedInAt("x.y.z")).toBe(0);
    expect(isFresh("x.y.z", now * 1000)).toBe(false);
  });
});

describe("what deleting takes", () => {
  it("lists what goes: the account, each plan, the owned teams in one line, then each membership", () => {
    expect(goneLines(preview())).toEqual([
      { kind: "account", email: "a@example.test", computers: 2 },
      { kind: "subscription", plan: "pro", refund: null },
      { kind: "subscription", plan: "team", refund: { amount: 990, currency: "BRL" } },
      { kind: "teams", names: ["Acme", "Beta"] },
      { kind: "membership", name: "Gama" },
    ]);
  });

  it("a free account with no team only loses the account", () => {
    expect(goneLines(preview({ subscriptions: [], ownedTeams: [], memberTeams: [] }))).toEqual([{ kind: "account", email: "a@example.test", computers: 2 }]);
  });

  it("the recap names the account, the plans and the owned teams, never people", () => {
    expect(recapItems(preview())).toEqual([{ kind: "account" }, { kind: "plan", plan: "pro" }, { kind: "plan", plan: "team" }, { kind: "team", name: "Acme" }, { kind: "team", name: "Beta" }]);
  });

  it("reads the preview the function sends", () => {
    expect(
      readPreview({
        email: "a@example.test",
        computers: 2,
        fresh: true,
        subscriptions: [{ plan: "team", team: "Acme", refund: { amount: 990, currency: "brl" } }],
        owned_teams: ["Acme"],
        member_teams: ["Gama"],
      }),
    ).toEqual({ email: "a@example.test", computers: 2, fresh: true, subscriptions: [{ plan: "team", team: "Acme", refund: { amount: 990, currency: "BRL" } }], ownedTeams: ["Acme"], memberTeams: ["Gama"] });
  });

  it("maps the function's errors", () => {
    expect(deletionErrorKey(0, "")).toBe("network");
    expect(deletionErrorKey(403, "stale_sign_in")).toBe("stale");
    expect(deletionErrorKey(403, "forbidden")).toBe("forbidden");
    expect(deletionErrorKey(500, "internal")).toBe("unknown");
  });
});

describe("cancelling first", () => {
  it("pays something: a managed Stripe plan or a personal Stripe subscription", () => {
    expect(paysSomething(billing())).toBe(true);
    expect(paysSomething(billing({ manages: false, subscription: sub(), personal: sub({ org_id: "org-p" }) }))).toBe(true);
    expect(paysSomething(billing({ subscription: sub({ stripe_subscription_id: null }) }))).toBe(false);
    expect(paysSomething(billing({ entitlement: { plan: "free", org_id: null, org_name: null, features: [], period_end: null }, subscription: null, manages: false }))).toBe(false);
  });

  it("the cancel shortcut goes to the plan in effect, then to the personal subscription, never to one already ending", () => {
    expect(cancelTarget(billing())).toEqual({ orgId: "org-1", plan: "pro", duplicate: false });
    const ending = sub({ cancel_at_period_end: true });
    const personal = sub({ org_id: "org-p" });
    expect(cancelTarget(billing({ subscription: ending, personal }))).toEqual({ orgId: "org-p", plan: "pro", duplicate: true });
    expect(cancelTarget(billing({ subscription: ending, personal: sub({ org_id: "org-p", cancel_at_period_end: true }) }))).toBeNull();
  });
});
