import type { Currency } from "./pricing";
import { supabase } from "./supabase";

/** Why someone cancels: the same six the retention function accepts. */
export const REASONS = ["too_expensive", "not_using", "missing_feature", "problems", "other_tool", "other"] as const;
export type Reason = (typeof REASONS)[number];

export type Offer = "discount" | "free_month";
export type RetentionAction = "status" | "keep" | "discount" | "free_month" | "cancel" | "refund" | "undo";
export type RetentionErrorKey = "network" | "offer_used" | "not_refundable" | "unknown";
export type CancelStep = "reason" | "discount" | "free_month" | "confirm";

export interface RetentionStatus {
  /** The offers this payer can still take (each once, for good). */
  offers: { discount: boolean; free_month: boolean };
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** Inside the 7 days of a first purchase: what cancelling would send back. */
  refund: { amount: number; currency: Currency } | null;
  /** When the discount now on the plan ends. */
  discountUntil: string | null;
  /** What the plan charges now, per seat, in the currency it is paid in. */
  price: { amount: number; currency: Currency } | null;
  /** The offer from cancelling now running on the plan (no other is offered meanwhile). */
  pendingDiscount: Offer | null;
}

/** 25% off the way Stripe rounds a percentage: the discount to the nearest cent, taken off. */
export function discountedCents(cents: number): number {
  return cents - Math.round(cents * 0.25);
}

/**
 * The steps of cancelling: the offers left, none for a personal subscription
 * that a team's plan already covers; `refundOnly` (a plan already set to end,
 * inside the 7 days) goes straight to the refund.
 */
export function steps(status: RetentionStatus, duplicate: boolean, refundOnly = false): CancelStep[] {
  if (refundOnly) return ["confirm"];
  const offers: CancelStep[] = duplicate ? [] : (["discount", "free_month"] as const).filter((o) => status.offers[o]);
  return ["reason", ...offers, "confirm"];
}

export function retentionErrorKey(status: number, code: string): RetentionErrorKey {
  if (status === 0) return "network";
  if (code === "offer_used") return "offer_used";
  if (code === "not_refundable") return "not_refundable";
  return "unknown";
}

export interface RetentionBody {
  orgId?: string;
  reason?: Reason | null;
  details?: string;
  offers?: Offer[];
}

export type RetentionResult = { ok: true; data: Record<string, unknown> } | { ok: false; error: RetentionErrorKey };

/** One call to the retention function with the person's session. */
export async function retention(action: RetentionAction, body: RetentionBody = {}): Promise<RetentionResult> {
  const payload: Record<string, unknown> = { action };
  if (body.orgId) payload.org_id = body.orgId;
  if (body.reason) payload.reason = body.reason;
  if (body.details?.trim()) payload.details = body.details.trim();
  if (body.offers?.length) payload.offers = body.offers;
  const { data, error } = await supabase().functions.invoke("retention", { body: payload });
  if (!error) return { ok: true, data: (data ?? {}) as Record<string, unknown> };
  const res = (error as { context?: unknown }).context;
  if (!(res instanceof Response)) return { ok: false, error: "network" };
  let code = "";
  try {
    code = String(((await res.clone().json()) as { error?: unknown }).error ?? "");
  } catch {
    // Not JSON: the status says enough.
  }
  return { ok: false, error: retentionErrorKey(res.status, code) };
}

/** The function's status, in the site's words. */
export function readStatus(data: Record<string, unknown>): RetentionStatus {
  const offers = (data.offers ?? {}) as { discount?: boolean; free_month?: boolean };
  const refund = data.refund as { amount?: number; currency?: string } | null | undefined;
  const price = data.price as { amount?: number; currency?: string } | null | undefined;
  const currency = (c: unknown): Currency => (String(c).toUpperCase() === "BRL" ? "BRL" : "USD");
  return {
    offers: { discount: Boolean(offers.discount), free_month: Boolean(offers.free_month) },
    periodEnd: typeof data.period_end === "string" ? data.period_end : null,
    cancelAtPeriodEnd: data.cancel_at_period_end === true,
    refund: refund && typeof refund.amount === "number" ? { amount: refund.amount, currency: currency(refund.currency) } : null,
    discountUntil: typeof data.discount_until === "string" ? data.discount_until : null,
    price: price && typeof price.amount === "number" ? { amount: price.amount, currency: currency(price.currency) } : null,
    pendingDiscount: data.pending_discount === "discount" || data.pending_discount === "free_month" ? data.pending_discount : null,
  };
}
