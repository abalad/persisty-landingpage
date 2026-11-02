import { describe, expect, it } from "vitest";
import { PLANS, planById } from "../src/lib/plans";
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

  it("lists the plans from smallest to largest", () => {
    expect(PLANS.map((p) => p.id)).toEqual(["free", "pro", "team", "enterprise"]);
  });

  it("sells Team's per-person billing now; the other Team and Enterprise extras are still ahead", () => {
    expect(planById("team").features.find((f) => f.id === "teamBilling")?.status).toBe("available");
    for (const id of ["team", "enterprise"] as const) {
      expect(planById(id).features.filter((f) => f.id !== "teamBilling").every((f) => f.status !== "available")).toBe(true);
    }
  });
});
