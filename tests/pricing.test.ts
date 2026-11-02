import { describe, expect, it } from "vitest";
import { loadMessages } from "../src/i18n/messages";
import { routing } from "../src/i18n/routing";
import { MENU_FEATURES, PLANS, SHOWN_PLAN_IDS, SHOWN_PLANS, featureHref, findFeature, planById, type ShownPlanId } from "../src/lib/plans";
import { formatPlanPrice, formatPrice, priceFor } from "../src/lib/pricing";

const nbsp = " ";

describe("formatPrice", () => {
  it("writes dollars the Brazilian way in pt-BR", () => {
    expect(formatPrice("pt-BR", 990)).toBe(`US$${nbsp}9,90`);
  });

  it("writes dollars the American way in en", () => {
    expect(formatPrice("en", 990)).toBe("$9.90");
  });

  it("writes dollars the Latin American way in es", () => {
    expect(formatPrice("es", 1990)).toBe(`US$${nbsp}19,90`);
  });

  it("keeps whole prices with cents", () => {
    expect(formatPrice("en", 0)).toBe("$0.00");
  });
});

describe("priceFor", () => {
  it("charges reais in Portuguese", () => {
    expect(priceFor("pt-BR", "pro")).toEqual({ currency: "BRL", cents: 990 });
    expect(priceFor("pt-BR", "team")).toEqual({ currency: "BRL", cents: 1990 });
  });

  it("charges dollars in English", () => {
    expect(priceFor("en", "pro")).toEqual({ currency: "USD", cents: 490 });
    expect(priceFor("en", "team")).toEqual({ currency: "USD", cents: 990 });
  });

  it("charges dollars in Spanish", () => {
    expect(priceFor("es", "pro")).toEqual({ currency: "USD", cents: 490 });
    expect(priceFor("es", "team")).toEqual({ currency: "USD", cents: 990 });
  });
});

describe("formatPlanPrice", () => {
  it("shows R$ 9,90 and R$ 19,90 in Portuguese", () => {
    expect(formatPlanPrice("pt-BR", "pro")).toBe(`R$${nbsp}9,90`);
    expect(formatPlanPrice("pt-BR", "team")).toBe(`R$${nbsp}19,90`);
  });

  it("shows US$4.90 and US$9.90 in English, never a bare $", () => {
    expect(formatPlanPrice("en", "pro")).toBe("US$4.90");
    expect(formatPlanPrice("en", "team")).toBe("US$9.90");
  });

  it("shows US$ 4,90 and US$ 9,90 in Spanish", () => {
    expect(formatPlanPrice("es", "pro")).toBe(`US$${nbsp}4,90`);
    expect(formatPlanPrice("es", "team")).toBe(`US$${nbsp}9,90`);
  });

  it("multiplies Team by the seats", () => {
    expect(formatPlanPrice("pt-BR", "team", 3)).toBe(`R$${nbsp}59,70`);
    expect(formatPlanPrice("en", "team", 2)).toBe("US$19.80");
  });
});

describe("plans", () => {
  it("bills Pro by the month and Team per user", () => {
    expect(planById("pro").billing).toBe("month");
    expect(planById("team").billing).toBe("user-month");
  });

  it("keeps Free free and Enterprise by contact", () => {
    expect(planById("free").billing).toBe("free");
    expect(planById("enterprise").billing).toBe("contact");
  });
});

describe("plan catalog", () => {
  it("shows Free, Pro and Team; Enterprise stays defined but hidden", () => {
    expect(SHOWN_PLANS.map((p) => p.id)).toEqual(["free", "pro", "team"]);
    expect(PLANS.map((p) => p.id)).toEqual(["free", "pro", "team", "enterprise"]);
    expect(planById("enterprise").billing).toBe("contact");
  });

  it("keeps the anchors the app links to", () => {
    const anchors = (id: ShownPlanId) => planById(id).features.filter((f) => f.status === "available").map((f) => f.anchor);
    expect(anchors("pro")).toEqual(["accounts", "queue", "restore-points", "verify", "worktree", "license"]);
    expect(anchors("team")).toEqual(["billing"]);
    expect(new Set(anchors("free"))).toEqual(new Set(["recovery", "projects", "states", "editor", "git", "usage", "notifications", "voice", "issues", "agents", "privacy", "offline"]));
  });

  it("gives every available feature an anchor and no planned one", () => {
    for (const plan of SHOWN_PLANS) {
      for (const f of plan.features) expect(Boolean(f.anchor), `${plan.id}.${f.id}`).toBe(f.status === "available");
    }
  });

  it("links features to their plan page", () => {
    const queue = planById("pro").features.find((f) => f.id === "requestQueue")!;
    expect(featureHref("pro", queue)).toBe("/pro#queue");
    const remote = planById("pro").features.find((f) => f.id === "remote")!;
    expect(featureHref("pro", remote)).toBe("/pro#roadmap");
    expect(findFeature("teamBilling")?.plan).toBe("team");
  });

  it("sells only what exists: Growth and the Runner are not listed, Team's extras are planned", () => {
    const ids = SHOWN_PLANS.flatMap((p) => p.features.map((f) => f.id));
    expect(ids).not.toContain("growth");
    expect(ids.some((id) => /runner/i.test(id))).toBe(false);
    expect(planById("team").features.filter((f) => f.id !== "teamBilling").every((f) => f.status === "planned")).toBe(true);
    expect(planById("pro").features.filter((f) => f.status === "planned").map((f) => f.id)).toEqual(["remote", "autopilot", "nightShift", "sessionXray"]);
    expect(planById("free").features.filter((f) => f.status === "planned").map((f) => f.id)).toEqual(["issueToSession", "bestOfN", "crossReview"]);
  });

  it("puts at most six of a plan's own features in the menu, available first", () => {
    for (const id of SHOWN_PLAN_IDS) {
      const items = MENU_FEATURES[id].map((f) => planById(id).features.find((x) => x.id === f));
      expect(items.length).toBeLessThanOrEqual(6);
      expect(items.every(Boolean), id).toBe(true);
      const firstPlanned = items.findIndex((f) => f!.status === "planned");
      if (firstPlanned >= 0) expect(items.slice(firstPlanned).every((f) => f!.status === "planned")).toBe(true);
    }
  });

  it("names every shown feature in every language", async () => {
    for (const locale of routing.locales) {
      const m = (await loadMessages(locale)) as { pricing: { features: Record<string, string> }; features: Record<string, { line?: string; where?: string }> };
      for (const plan of SHOWN_PLANS) {
        for (const f of plan.features) {
          expect(m.pricing.features[f.id], `${locale} pricing.features.${f.id}`).toBeTruthy();
          expect(m.features?.[f.id]?.line, `${locale} features.${f.id}.line`).toBeTruthy();
          if (f.status === "available") expect(m.features?.[f.id]?.where, `${locale} features.${f.id}.where`).toBeTruthy();
        }
      }
    }
  });
});
