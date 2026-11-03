import { PRICES_FOR_SIMULATION } from "./pricing";
import type { Currency } from "./pricing";
import type { RetentionAction, RetentionResult } from "./retention";

interface Simulation {
  plan: "pro" | "team";
  currency: Currency;
  periodEnd: string | null;
  /** Show the 7-day refund instead of cancelling at the period's end. */
  refund: boolean;
  delayMs?: number;
}

/**
 * A stand-in for the retention function, for trying the cancelling dialog
 * from My account (`?simular=cancelamento`) without a Stripe subscription:
 * it answers like the function, offers both, and sends nothing anywhere.
 */
export function simulatedRetention(s: Simulation) {
  const cents = PRICES_FOR_SIMULATION[s.currency][s.plan];
  return async (action: RetentionAction): Promise<RetentionResult> => {
    await new Promise((r) => setTimeout(r, s.delayMs ?? 450));
    if (action !== "status") return { ok: true, data: { ok: true, period_end: s.periodEnd } };
    return {
      ok: true,
      data: {
        offers: { discount: true, free_month: true },
        period_end: s.periodEnd,
        cancel_at_period_end: false,
        refund: s.refund ? { amount: cents, currency: s.currency.toLowerCase() } : null,
        discount_until: null,
        pending_discount: null,
        price: { amount: cents, currency: s.currency.toLowerCase() },
      },
    };
  };
}
