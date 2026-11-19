import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BillingState, Subscription, Team } from "../src/lib/billing";

const sb = vi.hoisted(() => ({
  invoked: [] as { name: string; body: Record<string, unknown> }[],
  answer: { data: {}, error: null } as { data: unknown; error: unknown },
  getUser: [] as (string | undefined)[],
  user: { data: { user: null }, error: null } as { data: { user: unknown }; error: { code?: string } | null },
  signOut: [] as unknown[],
}));

/** A stand-in for the browser client: what the deletion calls on it. */
vi.mock("../src/lib/supabase", () => ({
  supabase: () => ({
    functions: {
      invoke: async (name: string, { body }: { body: Record<string, unknown> }) => {
        sb.invoked.push({ name, body });
        return sb.answer;
      },
    },
    auth: {
      getUser: async (jwt?: string) => {
        sb.getUser.push(jwt);
        return sb.user;
      },
      signOut: async (options?: unknown) => {
        sb.signOut.push(options);
        return { error: null };
      },
    },
  }),
}));

const { accountStillThere, cancelTarget, deletion, deletionErrorKey, goneLines, isFresh, paysSomething, readPreview, recapItems, signedInAt, supabaseAuth } = await import("../src/lib/deletion");
type DeletionPreview = import("../src/lib/deletion").DeletionPreview;

beforeEach(() => {
  sb.invoked = [];
  sb.answer = { data: {}, error: null };
  sb.getUser = [];
  sb.user = { data: { user: null }, error: null };
  sb.signOut = [];
});

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
    // The session is now another account's: the dialog shows that account's preview again.
    expect(deletionErrorKey(409, "account_changed")).toBe("changed");
  });
});

describe("the calls the deletion makes", () => {
  it("deleting names the account that was reviewed; the preview names none", async () => {
    await deletion("delete", "en", "a@example.test");
    await deletion("preview", "pt-BR");
    expect(sb.invoked).toEqual([
      { name: "delete-account", body: { action: "delete", locale: "en", email: "a@example.test" } },
      { name: "delete-account", body: { action: "preview", locale: "pt-BR" } },
    ]);
  });

  it("a 409 account_changed comes back as changed", async () => {
    sb.answer = { data: null, error: { name: "FunctionsHttpError", context: new Response(JSON.stringify({ error: "account_changed" }), { status: 409 }) } };
    expect(await deletion("delete", "pt-BR", "a@example.test")).toEqual({ ok: false, error: "changed" });
  });

  it("asks whether the account is still there with the token the deletion used, not a session that may need renewing", async () => {
    sb.user = { data: { user: null }, error: { code: "user_not_found" } };
    expect(await accountStillThere("tok")).toBe(false);
    expect(sb.getUser).toEqual(["tok"]);
    // Anything else leaves the account where it was.
    sb.user = { data: { user: null }, error: { code: "refresh_token_not_found" } };
    expect(await accountStillThere("tok")).toBe(true);
    sb.user = { data: { user: { id: "u1" } }, error: null };
    expect(await accountStillThere("tok")).toBe(true);
    // No token captured: the session's own user.
    sb.user = { data: { user: null }, error: { code: "user_not_found" } };
    expect(await accountStillThere(null)).toBe(false);
    expect(sb.getUser.at(-1)).toBeUndefined();
  });

  it("signing out after the deletion only clears this browser: the server has no session left to end", async () => {
    await supabaseAuth.signOut();
    expect(sb.signOut).toEqual([{ scope: "local" }]);
  });
});

const team = (over: Partial<Team> = {}): Team => ({ id: "team-1", name: "Acme", role: "owner", subscription: sub({ org_id: "team-1", plan: "team" }), portal: true, seats: null, members: [], invites: [], ...over });
/** The plan in effect is a paid Team's, managed by this account in the role given. */
const viaTeam = (role: Team["role"], over: Partial<BillingState> = {}) =>
  billing({
    entitlement: { plan: "team", org_id: "team-1", org_name: "Acme", features: [], period_end: null },
    subscription: sub({ org_id: "team-1", plan: "team" }),
    manages: role !== "member",
    teams: [team({ role })],
    ...over,
  });

describe("what the deletion ends, for the section and the cancel shortcut", () => {
  it("a Team's owner: the Team's plan ends with the account", () => {
    expect(paysSomething(viaTeam("owner"))).toBe(true);
    expect(cancelTarget(viaTeam("owner"))).toEqual({ orgId: "team-1", plan: "team", duplicate: false });
  });

  it("an admin of a paid Team pays nothing the deletion ends, and gets no shortcut to cancel the Team's plan", () => {
    expect(paysSomething(viaTeam("admin"))).toBe(false);
    expect(cancelTarget(viaTeam("admin"))).toBeNull();
  });

  it("an admin who also pays a personal plan: that plan ends, and the shortcut goes to it", () => {
    const both = viaTeam("admin", { personal: sub({ org_id: "org-p" }) });
    expect(paysSomething(both)).toBe(true);
    expect(cancelTarget(both)).toEqual({ orgId: "org-p", plan: "pro", duplicate: true });
  });

  it("the owner of another paid Team than the plan in effect: that plan ends too", () => {
    const other = viaTeam("member", { teams: [team({ role: "member" }), team({ id: "team-2", name: "Beta", role: "owner", subscription: sub({ org_id: "team-2", plan: "team" }) })] });
    expect(paysSomething(other)).toBe(true);
  });

  it("a Team granted by hand bills nothing in Stripe", () => {
    const granted = viaTeam("owner", { subscription: sub({ org_id: "team-1", plan: "team", stripe_subscription_id: null }), teams: [team({ subscription: sub({ org_id: "team-1", plan: "team", stripe_subscription_id: null }) })] });
    expect(paysSomething(granted)).toBe(false);
    expect(cancelTarget(granted)).toBeNull();
  });
});

describe("cancelling first", () => {
  it("pays something: a personal Stripe plan, or a Stripe plan of a Team the account owns", () => {
    // The personal Pro in effect: `personal` is that same subscription.
    expect(paysSomething(billing({ personal: sub() }))).toBe(true);
    expect(paysSomething(billing({ manages: false, subscription: sub(), personal: sub({ org_id: "org-p" }) }))).toBe(true);
    expect(paysSomething(billing({ subscription: sub({ stripe_subscription_id: null }) }))).toBe(false);
    expect(paysSomething(billing({ entitlement: { plan: "free", org_id: null, org_name: null, features: [], period_end: null }, subscription: null, manages: false }))).toBe(false);
  });

  it("the cancel shortcut goes to the plan in effect, then to the personal subscription, never to one already ending", () => {
    expect(cancelTarget(billing({ personal: sub() }))).toEqual({ orgId: "org-1", plan: "pro", duplicate: false });
    const ending = sub({ cancel_at_period_end: true });
    const personal = sub({ org_id: "org-p" });
    expect(cancelTarget(viaTeam("owner", { subscription: sub({ org_id: "team-1", plan: "team", cancel_at_period_end: true }), personal }))).toEqual({ orgId: "org-p", plan: "pro", duplicate: true });
    expect(cancelTarget(billing({ subscription: ending, personal: sub({ org_id: "org-1", cancel_at_period_end: true }) }))).toBeNull();
    expect(cancelTarget(billing({ subscription: ending, personal: sub({ org_id: "org-p", cancel_at_period_end: true }) }))).toBeNull();
  });
});
