// Types for announce-lib.mjs, which runs in plain Node and is tested from TypeScript.

export type Locale = "pt-BR" | "en" | "es";

export interface Recipient {
  email: string;
  locale: Locale;
}

export const LOCALES: Locale[];
export const SITE: string;
export const BATCH: number;

export function recipients(users: Array<{ email?: string; user_metadata?: Record<string, unknown> }>): Recipient[];
export function mask(email: string): string;
export function sendPlan(list: Recipient[], options?: { skip?: number; limit?: number }): { batches: Recipient[][]; left: number };
export function message(locale: Locale, version: string): { subject: string; text: string; html: string };
