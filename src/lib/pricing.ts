import type { Locale } from "@/i18n/routing";

/** Spanish readers here are mostly in Latin America, so es follows Argentina's US$ 4,90. */
const NUMBER_LOCALE: Record<Locale, string> = { "pt-BR": "pt-BR", en: "en-US", es: "es-AR" };

export type Currency = "BRL" | "USD";
export type PaidPlan = "pro" | "team";

export interface Price {
  currency: Currency;
  /** Per month; Team's is per seat. */
  cents: number;
}

/** The same Stripe prices: one per plan, in dollars, with reais as its second currency. */
const PRICES: Record<Currency, Record<PaidPlan, number>> = {
  BRL: { pro: 990, team: 1990 },
  USD: { pro: 490, team: 990 },
};

/** The same table, for the cancelling simulation in My account (no Stripe call there). */
export const PRICES_FOR_SIMULATION = PRICES;

/** Reais in Portuguese (Brazil), dollars everywhere else. */
export function currencyFor(locale: Locale): Currency {
  return locale === "pt-BR" ? "BRL" : "USD";
}

export function priceFor(locale: Locale, plan: PaidPlan): Price {
  const currency = currencyFor(locale);
  return { currency, cents: PRICES[currency][plan] };
}

/**
 * Money the locale's way. Plan prices in English say US$, not a bare $,
 * because the same page shows R$ in Portuguese.
 */
export function formatPrice(locale: Locale, cents: number, currency: Currency = "USD", { explicit = false } = {}): string {
  const text = new Intl.NumberFormat(NUMBER_LOCALE[locale], { style: "currency", currency }).format(cents / 100);
  return explicit && currency === "USD" ? text.replace(/^\$/, "US$") : text;
}

/** A plan's monthly price (Team's, per seat, times `seats`), ready to show. */
export function formatPlanPrice(locale: Locale, plan: PaidPlan, seats = 1): string {
  const { currency, cents } = priceFor(locale, plan);
  return formatPrice(locale, cents * seats, currency, { explicit: true });
}
