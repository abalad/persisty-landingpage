import { describe, expect, it } from "vitest";
import { discountedCents, readStatus, REASONS, retentionErrorKey, steps, type RetentionStatus } from "../src/lib/retention";

const status = (over: Partial<RetentionStatus> = {}): RetentionStatus => ({ offers: { discount: true, free_month: true }, periodEnd: "2026-12-03T12:00:00.000Z", cancelAtPeriodEnd: false, refund: null, discountUntil: null, price: null, pendingDiscount: null, ...over });

describe("cancelling", () => {
  it("offers the six reasons the function knows", () => {
    expect(REASONS).toEqual(["too_expensive", "not_using", "missing_feature", "problems", "other_tool", "other"]);
  });

  it("prices the discount the way Stripe rounds it", () => {
    expect(discountedCents(990)).toBe(742);
    expect(discountedCents(490)).toBe(367);
    expect(discountedCents(1990)).toBe(1492);
  });

  it("walks through both offers, skips one already taken, and skips both for a duplicate subscription", () => {
    expect(steps(status(), false)).toEqual(["reason", "discount", "free_month", "confirm"]);
    expect(steps(status({ offers: { discount: false, free_month: true } }), false)).toEqual(["reason", "free_month", "confirm"]);
    expect(steps(status({ offers: { discount: false, free_month: false } }), false)).toEqual(["reason", "confirm"]);
    expect(steps(status(), true)).toEqual(["reason", "confirm"]);
  });

  it("says what went wrong in words the modal knows", () => {
    expect(retentionErrorKey(0, "")).toBe("network");
    expect(retentionErrorKey(409, "offer_used")).toBe("offer_used");
    expect(retentionErrorKey(403, "not_refundable")).toBe("not_refundable");
    expect(retentionErrorKey(500, "internal")).toBe("unknown");
    expect(retentionErrorKey(409, "already_cancelling")).toBe("unknown");
  });

  it("goes straight to the refund for a plan already set to end inside the 7 days", () => {
    expect(steps(status({ refund: { amount: 990, currency: "BRL" } }), false, true)).toEqual(["confirm"]);
  });

  it("reads which offer is running, so the account can say the next charge is free", () => {
    expect(readStatus({ pending_discount: "free_month" }).pendingDiscount).toBe("free_month");
    expect(readStatus({ pending_discount: "discount" }).pendingDiscount).toBe("discount");
    expect(readStatus({ pending_discount: "gift" }).pendingDiscount).toBeNull();
    expect(readStatus({}).pendingDiscount).toBeNull();
  });
});

describe("simulating cancelling", () => {
  it("answers like the function, with both offers, the plan's price and nothing sent anywhere", async () => {
    const { simulatedRetention } = await import("../src/lib/retentionSimulation");
    const api = simulatedRetention({ plan: "pro", currency: "BRL", periodEnd: "2027-10-28T12:00:00.000Z", refund: false, delayMs: 0 });
    const status = await api("status");
    expect(status.ok).toBe(true);
    const read = readStatus(status.ok ? status.data : {});
    expect(read.offers).toEqual({ discount: true, free_month: true });
    expect(read.price).toEqual({ amount: 990, currency: "BRL" });
    expect(read.refund).toBeNull();
    expect((await api("cancel")).ok).toBe(true);
    const withRefund = simulatedRetention({ plan: "team", currency: "USD", periodEnd: null, refund: true, delayMs: 0 });
    expect(readStatus(((await withRefund("status")) as { data: Record<string, unknown> }).data).refund).toEqual({ amount: 990, currency: "USD" });
  });
});
