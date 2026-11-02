import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadMessages } from "../src/i18n/messages";

interface Answer {
  data: unknown;
  error: { code?: string } | null;
}

const db = vi.hoisted(() => ({
  session: null as unknown,
  invoke: [] as { name: string; body: Record<string, unknown> }[],
  functions: {} as Record<string, () => unknown>,
  rpc: [] as string[],
  rpcs: {} as Record<string, Answer>,
  tables: {} as Record<string, Answer>,
}));

/** A stand-in for the browser client: every query is a chain that ends in the table's canned answer. */
vi.mock("../src/lib/supabase", () => ({
  supabase: () => ({
    auth: { getSession: async () => ({ data: { session: db.session }, error: null }) },
    functions: {
      invoke: async (name: string, { body }: { body: Record<string, unknown> }) => {
        db.invoke.push({ name, body });
        return db.functions[name]();
      },
    },
    rpc: async (name: string) => {
      db.rpc.push(name);
      return db.rpcs[name] ?? { data: null, error: null };
    },
    from: (table: string) => {
      const chain: Record<string, unknown> = {};
      for (const m of ["select", "eq", "in", "is", "order", "delete"]) chain[m] = () => chain;
      chain.then = (ok: (a: Answer) => unknown) => ok(db.tables[table] ?? { data: [], error: null });
      return chain;
    },
  }),
}));

const billing = await import("../src/lib/billing");

const ok = (url: string) => () => ({ data: { url }, error: null });
/** What supabase-js gives back for a non-2xx answer: the response sits in `context`. */
const fails = (status: number, error: string) => () => ({
  data: null,
  error: { name: "FunctionsHttpError", context: new Response(JSON.stringify({ error }), { status }) },
});

function nav() {
  return { locale: "pt-BR" as const, go: vi.fn(), leave: vi.fn() };
}

beforeEach(() => {
  db.session = { access_token: "t" };
  db.invoke = [];
  db.functions = {};
  db.rpc = [];
  db.rpcs = {};
  db.tables = {};
});

describe("subscribe", () => {
  it("without a session, goes to sign-in and comes back to pricing with the plan chosen", async () => {
    db.session = null;
    const n = nav();
    expect(await billing.subscribe("pro", n)).toBe("signIn");
    expect(n.go).toHaveBeenCalledWith("/sign-in?next=%2Fpricing%3Fplan%3Dpro");
    expect(db.invoke).toEqual([]);
  });

  it("builds the same return for Team", () => {
    expect(billing.signInHref("team")).toBe("/sign-in?next=%2Fpricing%3Fplan%3Dteam");
  });

  it("with a session, opens Stripe's checkout for the plan in the page's language", async () => {
    db.functions["create-checkout"] = ok("https://checkout.stripe.com/c/pay/cs_test_1");
    const n = { ...nav(), locale: "en" as const };
    expect(await billing.subscribe("pro", n)).toBe("checkout");
    expect(db.invoke).toEqual([{ name: "create-checkout", body: { plan: "pro", locale: "en" } }]);
    expect(n.leave).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test_1");
  });

  it("asks for the team's name and seats before Team's checkout", async () => {
    expect(await billing.subscribe("team", nav())).toBe("teamForm");
    expect(db.invoke).toEqual([]);
  });

  it("sends the team's name and seats", async () => {
    db.functions["create-checkout"] = ok("https://checkout.stripe.com/c/pay/cs_test_2");
    const n = { ...nav(), locale: "es" as const };
    expect(await billing.subscribe("team", n, { name: "  Produto ", seats: 3 })).toBe("checkout");
    expect(db.invoke[0].body).toEqual({ plan: "team", locale: "es", team_name: "Produto", seats: 3 });
  });

  it("an account that already has the plan goes to the portal instead", async () => {
    db.functions["create-checkout"] = fails(409, "already_subscribed");
    db.functions["billing-portal"] = ok("https://billing.stripe.com/p/session/test_1");
    const n = nav();
    expect(await billing.subscribe("pro", n)).toBe("portal");
    expect(db.invoke.map((c) => c.name)).toEqual(["create-checkout", "billing-portal"]);
    expect(db.invoke[1].body).toEqual({ locale: "pt-BR" });
    expect(n.leave).toHaveBeenCalledWith("https://billing.stripe.com/p/session/test_1");
  });

  it("an expired session goes back to sign-in", async () => {
    db.functions["create-checkout"] = fails(401, "unauthorized");
    const n = nav();
    expect(await billing.subscribe("pro", n)).toBe("signIn");
    expect(n.go).toHaveBeenCalledWith(billing.signInHref("pro"));
  });

  it("reports a failure instead of leaving", async () => {
    db.functions["create-checkout"] = fails(500, "internal");
    const n = nav();
    expect(await billing.subscribe("pro", n)).toEqual({ error: "unknown" });
    expect(n.leave).not.toHaveBeenCalled();
  });

  it("reports a network failure", async () => {
    db.functions["create-checkout"] = () => ({ data: null, error: { name: "FunctionsFetchError", context: new TypeError("offline") } });
    expect(await billing.subscribe("pro", nav())).toEqual({ error: "network" });
  });
});

describe("openPortal", () => {
  it("opens a team's portal by its organisation", async () => {
    db.functions["billing-portal"] = ok("https://billing.stripe.com/p/session/test_2");
    const n = nav();
    expect(await billing.openPortal(n, "0b6f2a43-30a4-4ba3-9a1f-1d1c7f1f0e11")).toBeNull();
    expect(db.invoke[0].body).toEqual({ locale: "pt-BR", org_id: "0b6f2a43-30a4-4ba3-9a1f-1d1c7f1f0e11" });
  });

  it("says when nothing was bought yet", async () => {
    db.functions["billing-portal"] = fails(404, "no_customer");
    expect(await billing.openPortal(nav())).toBe("noCustomer");
  });
});

describe("teamProblem", () => {
  it("takes a name and 1 to 100 seats", () => {
    expect(billing.teamProblem({ name: "Produto", seats: 2 })).toBeNull();
    expect(billing.teamProblem({ name: "Produto", seats: 1 })).toBeNull();
    expect(billing.teamProblem({ name: "Produto", seats: 100 })).toBeNull();
  });

  it("asks for a name", () => {
    expect(billing.teamProblem({ name: "   ", seats: 2 })).toBe("name");
    expect(billing.teamProblem({ name: "x".repeat(81), seats: 2 })).toBe("nameLong");
  });

  it("refuses seats out of range or broken", () => {
    for (const seats of [0, 101, 2.5, Number.NaN, -1]) expect(billing.teamProblem({ name: "Produto", seats }), String(seats)).toBe("seats");
  });

  it("starts at two seats", () => expect(billing.DEFAULT_SEATS).toBe(2));
});

describe("inviteLink", () => {
  it("is the sign-in page that comes back to the account, in the page's language", () => {
    expect(billing.inviteLink("pt-BR")).toBe(`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://persisty.app"}/sign-in?next=/account`);
    expect(billing.inviteLink("en")).toMatch(/\/en\/sign-in\?next=\/account$/);
  });
});

describe("inviteErrorKey", () => {
  it("tells a full team, a repeated e-mail, a bad e-mail and a missing permission apart", () => {
    expect(billing.inviteErrorKey("PT402")).toBe("full");
    expect(billing.inviteErrorKey("23505")).toBe("taken");
    expect(billing.inviteErrorKey("22023")).toBe("invalidEmail");
    expect(billing.inviteErrorKey("42501")).toBe("forbidden");
    expect(billing.inviteErrorKey(undefined)).toBe("unknown");
  });
});

const ME = "11111111-1111-4111-8111-111111111111";
const TEAM = "22222222-2222-4222-8222-222222222222";
const PERSONAL = "33333333-3333-4333-8333-333333333333";
const future = "2026-12-02T12:00:00Z";

function teamAccount(role: "owner" | "member") {
  db.rpcs.accept_my_invites = { data: 1, error: null };
  db.rpcs.my_entitlement = { data: [{ plan: "team", org_id: TEAM, org_name: "Produto", features: ["team_board"], period_end: future }], error: null };
  db.rpcs.team_seats = { data: [{ seats: 3, members: 2, pending: 1 }], error: null };
  db.tables.org_members = {
    data: [
      { org_id: PERSONAL, role: "owner", user_id: ME, created_at: "2026-10-01T00:00:00Z" },
      { org_id: TEAM, role, user_id: ME, created_at: "2026-10-02T00:00:00Z" },
    ],
    error: null,
  };
  db.tables.orgs = {
    data: [
      { id: PERSONAL, kind: "personal", name: "ana@example.com" },
      { id: TEAM, kind: "team", name: "Produto" },
    ],
    error: null,
  };
  db.tables.subscriptions = {
    data: [{ org_id: TEAM, plan: "team", status: "active", seats: 3, current_period_end: future, cancel_at_period_end: true }],
    error: null,
  };
  db.tables.org_invites = { data: [{ id: "i1", email: "bia@example.com", created_at: "2026-11-01T00:00:00Z" }], error: null };
  db.rpcs.team_members = {
    data: [
      { user_id: ME, role: "owner", joined_at: "2026-10-02T00:00:00Z", display_name: "Ana", email: "ana@example.com" },
      { user_id: "m2", role: "member", joined_at: "2026-10-03T00:00:00Z", display_name: null, email: "bruno@example.com" },
    ],
    error: null,
  };
}

describe("loadBilling", () => {
  it("accepts the invites for this e-mail before reading the plan", async () => {
    teamAccount("member");
    await billing.loadBilling(ME);
    expect(db.rpc[0]).toBe("accept_my_invites");
    expect(db.rpc.indexOf("my_entitlement")).toBeGreaterThan(0);
  });

  it("is free with no plan", async () => {
    db.rpcs.my_entitlement = { data: [], error: null };
    const state = await billing.loadBilling(ME);
    expect(state.entitlement.plan).toBe("free");
    expect(state.subscription).toBeNull();
    expect(state.manages).toBe(false);
    expect(state.teams).toEqual([]);
  });

  it("gives an owner the team's seats, members and invites, and the portal", async () => {
    teamAccount("owner");
    const state = await billing.loadBilling(ME);
    expect(state.subscription?.cancel_at_period_end).toBe(true);
    expect(state.manages).toBe(true);
    expect(state.teams).toHaveLength(1);
    expect(state.teams[0].seats).toEqual({ seats: 3, members: 2, pending: 1 });
    expect(state.teams[0].invites.map((i) => i.email)).toEqual(["bia@example.com"]);
    expect(state.teams[0].members.map((m) => m.display_name ?? m.email)).toEqual(["Ana", "bruno@example.com"]);
    expect(db.rpc).toContain("team_seats");
    expect(db.rpc).toContain("team_members");
  });

  it("gives a plain member the team's name and plan only", async () => {
    teamAccount("member");
    const state = await billing.loadBilling(ME);
    expect(state.manages).toBe(false);
    expect(state.teams[0]).toMatchObject({ name: "Produto", role: "member", seats: null, members: [], invites: [] });
    expect(db.rpc).not.toContain("team_seats");
    expect(db.rpc).not.toContain("team_members");
  });

  it("leaves out a team whose checkout was never finished", async () => {
    teamAccount("owner");
    db.tables.subscriptions = { data: [], error: null };
    db.rpcs.my_entitlement = { data: [], error: null };
    expect((await billing.loadBilling(ME)).teams).toEqual([]);
  });
});

describe("freeSeats", () => {
  it("counts pending invites as taken", () => {
    expect(billing.freeSeats({ seats: 3, members: 2, pending: 1 })).toBe(0);
    expect(billing.freeSeats({ seats: 5, members: 2, pending: 1 })).toBe(2);
    expect(billing.freeSeats({ seats: 2, members: 3, pending: 0 })).toBe(0);
  });
});

describe("TeamMembers", async () => {
  const { TeamMembers } = await import("../src/components/account/TeamMembers");
  const messages = await loadMessages("pt-BR");
  type ProviderProps = ComponentProps<typeof NextIntlClientProvider>;

  function render(seats: { seats: number; members: number; pending: number }) {
    const team = {
      id: TEAM,
      name: "Produto",
      role: "owner" as const,
      subscription: { org_id: TEAM, plan: "team" as const, status: "active", seats: seats.seats, current_period_end: future, cancel_at_period_end: false },
      seats,
      members: [
        { user_id: ME, role: "owner" as const, joined_at: "2026-10-02T00:00:00Z", display_name: "Ana", email: "ana@example.com" },
        { user_id: "m2", role: "member" as const, joined_at: "2026-10-03T00:00:00Z", display_name: null, email: "bruno@example.com" },
      ],
      invites: [{ id: "i1", email: "bia@example.com", created_at: "2026-11-01T00:00:00Z" }],
    };
    const props = { team, userId: ME, onChanged: async () => {}, onStatus: () => {}, relative: () => "ontem" };
    return renderToStaticMarkup(
      createElement(NextIntlClientProvider, { locale: "pt-BR", messages, timeZone: "America/Sao_Paulo" } as ProviderProps, createElement(TeamMembers, props)),
    );
  }

  const inviteButton = (html: string) => html.match(/<button type="submit"[^>]*>/)?.[0] ?? "";

  it("turns the invite off when members and invites fill the seats, and points to the portal", () => {
    const html = render({ seats: 3, members: 2, pending: 1 });
    expect(inviteButton(html)).toContain("disabled");
    expect(html).toContain("3 de 3 assentos");
    expect(html).toContain("Comprar assentos");
  });

  it("keeps the invite on while a seat is free", () => {
    const html = render({ seats: 4, members: 2, pending: 1 });
    expect(inviteButton(html)).not.toContain("disabled");
    expect(html).toContain("3 de 4 assentos");
    expect(html).not.toContain("Comprar assentos");
  });

  it("lets the owner remove members but never the owner, and cancel invites", () => {
    const html = render({ seats: 4, members: 2, pending: 1 });
    expect(html.match(/>Remover</g)).toHaveLength(1);
    expect(html).toContain("Ana (você)");
    expect(html).toContain("bruno@example.com");
    expect(html).not.toContain("Sem nome");
    expect(html).toContain("bia@example.com");
    expect(html).toContain("Cancelar convite");
    expect(html).toContain("/sign-in?next=/account");
  });
});
