"use client";

import type { User } from "@supabase/supabase-js";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { signInPath } from "@/lib/account";
import { intentFromQuery, mergeIntent } from "@/lib/auth";
import { onPageRestored } from "@/lib/bfcache";
import { loadBilling, openPortal, type BillingState } from "@/lib/billing";
import { intentQuery } from "@/lib/intentQuery";
import { supabase } from "@/lib/supabase";

export interface Device {
  id: string;
  name: string;
  platform: "macos" | "windows" | "linux";
  app_version: string;
  last_seen_at: string;
}

export type Meta = Record<string, unknown>;
export type CheckoutNotice = "waiting" | "done" | "late";
export type Status = { ok: boolean; text: string } | null;

export interface AccountContext {
  user: User;
  meta: Meta;
  billing: BillingState | null;
  devices: Device[];
  notice: CheckoutNotice | null;
  loadFailed: boolean;
  status: Status;
  setStatus: (status: Status) => void;
  save: (next: Meta) => Promise<void>;
  reloadBilling: () => Promise<void>;
  /** Opens the portal of the plan in effect, or of the personal subscription (no `org_id`). */
  manage: (which: "plan" | "personal") => Promise<void>;
  opening: "plan" | "personal" | null;
  removeDevice: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** "In 3 days", "2 hours ago": the account's way of saying when. */
  relative: (iso: string) => string;
}

/** After Stripe's checkout the webhook can take a few seconds: the plan is read again for about 15 s. */
const CHECKOUT_POLLS = 5;
const CHECKOUT_POLL_MS = 3000;

const Context = createContext<AccountContext | null>(null);

/** Hands a ready account to the panels, for fixtures that show them without signing in. */
export const AccountContextProvider = Context.Provider;

export function useAccount(): AccountContext {
  const value = useContext(Context);
  if (!value) throw new Error("useAccount outside AccountProvider");
  return value;
}

function relativeTime(locale: string, iso: string): string {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of steps) if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  return rtf.format(0, "minute");
}

/**
 * Loads the account once for every part of My account: the user (or sign-in
 * when there is none), the intent they came with, billing and computers; and
 * after Stripe's checkout, waits for the plan to arrive.
 */
export function AccountProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const t = useTranslations("auth.account");
  const billingError = useTranslations("pricing.checkout.errors");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [notice, setNotice] = useState<CheckoutNotice | null>(null);
  const [opening, setOpening] = useState<"plan" | "personal" | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const save = useCallback(
    async (next: Meta) => {
      const { data, error } = await supabase().auth.updateUser({ data: next });
      if (error) return setStatus({ ok: false, text: t("saveError") });
      setUser(data.user);
      setStatus({ ok: true, text: t("saved") });
    },
    [t],
  );

  useEffect(() => {
    let alive = true;
    const intent = intentFromQuery(query);
    (async () => {
      const { data } = await supabase().auth.getUser();
      if (!alive) return;
      if (!data.user) {
        router.replace(signInPath(pathname, intentQuery(intent)));
        return;
      }
      let current = data.user;
      const merged = mergeIntent(current.user_metadata ?? {}, intent, locale);
      if (merged) {
        const res = await supabase().auth.updateUser({ data: merged });
        if (res.data.user) current = res.data.user;
      }
      if (!alive) return;
      setUser(current);
      if (intent.notify || intent.interest) router.replace(pathname);

      const [bill, dev] = await Promise.all([
        loadBilling(current.id),
        supabase().from("devices").select("id,name,platform,app_version,last_seen_at").is("revoked_at", null).order("last_seen_at", { ascending: false }),
      ]);
      if (!alive) return;
      if (bill.failed || dev.error) setLoadFailed(true);
      setBilling(bill);
      setDevices((dev.data as Device[] | null) ?? []);

      if (query.get("checkout") !== "done") return;
      window.history.replaceState(null, "", window.location.pathname);
      const first = bill.entitlement.plan;
      let latest = bill;
      setNotice("waiting");
      for (let i = 0; i < CHECKOUT_POLLS; i++) {
        await new Promise((r) => window.setTimeout(r, CHECKOUT_POLL_MS));
        if (!alive) return;
        latest = await loadBilling(current.id);
        if (!alive) return;
        setBilling(latest);
        if (latest.entitlement.plan !== first) break;
      }
      if (alive) setNotice(latest.entitlement.plan !== "free" ? "done" : "late");
    })();
    return () => {
      alive = false;
    };
    // Runs once per visit to My account (the layout stays while its parts change): the intent in the query is applied, then cleared.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back from Stripe's portal can bring the page back with its button still busy.
  useEffect(() => onPageRestored(() => setOpening(null)), []);

  if (!user) return <>{fallback}</>;

  const value: AccountContext = {
    user,
    meta: user.user_metadata ?? {},
    billing,
    devices,
    notice,
    loadFailed,
    status,
    setStatus,
    save,
    opening,
    relative: (iso) => relativeTime(locale, iso),
    async reloadBilling() {
      const next = await loadBilling(user.id);
      setBilling(next);
      if (next.failed) setLoadFailed(true);
    },
    async manage(which) {
      if (opening || !billing) return;
      setOpening(which);
      const orgId = billing.entitlement.org_id ?? undefined;
      const team = which === "plan" && billing.teams.some((x) => x.id === orgId);
      const error = await openPortal({ locale, go: () => {} }, team ? orgId : undefined);
      if (error) {
        setStatus({ ok: false, text: billingError(error) });
        setOpening(null);
      }
    },
    /** Revoking signs the computer out at its next license check; signing in on it again brings it back. The server keeps its own time. */
    async removeDevice(id) {
      const { error } = await supabase().from("devices").update({ revoked_at: new Date().toISOString() }).eq("id", id);
      if (error) return setStatus({ ok: false, text: t("saveError") });
      setDevices((list) => list.filter((d) => d.id !== id));
      setStatus({ ok: true, text: t("saved") });
    },
    async signOut() {
      await supabase().auth.signOut();
      router.replace("/");
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
