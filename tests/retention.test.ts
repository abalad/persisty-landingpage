import { describe, expect, it } from "vitest";
import { discountedCents, REASONS, retentionErrorKey, steps, type RetentionStatus } from "../src/lib/retention";

const status = (over: Partial<RetentionStatus> = {}): RetentionStatus => ({ offers: { discount: true, free_month: true }, periodEnd: "2026-12-03T12:00:00.000Z", cancelAtPeriodEnd: false, refund: null, discountUntil: null, ...over });

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
});
