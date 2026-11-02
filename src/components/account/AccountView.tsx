"use client";

import type { User } from "@supabase/supabase-js";
import { ArrowRight, Bell, BellOff, Building2, Loader2, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { buttonClass, ButtonIcon, ButtonLink } from "@/components/site/Button";
import { SubscribeButton } from "@/components/site/SubscribeButton";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { intentFromQuery, mergeIntent } from "@/lib/auth";
import { intentQuery } from "@/lib/intentQuery";
import { onPageRestored } from "@/lib/bfcache";
import { FREE, loadBilling, openPortal, renewOrder, type BillingState } from "@/lib/billing";
import { formatPlanPrice } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";
import styles from "./account.module.css";
import { TeamMembers } from "./TeamMembers";

interface Device {
  id: string;
  name: string;
  platform: "macos" | "windows" | "linux";
  app_version: string;
  last_seen_at: string;
}

type Meta = Record<string, unknown>;
type CheckoutNotice = "waiting" | "done" | "late";

/** After Stripe's checkout the webhook can take a few seconds: the plan is read again for about 15 s. */
const CHECKOUT_POLLS = 5;
const CHECKOUT_POLL_MS = 3000;
const PLATFORM_NAME = { macos: "macOS", windows: "Windows", linux: "Linux", mac: "macOS" } as Record<string, string>;

function relative(locale: string, iso: string): string {
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

export function AccountView() {
  const t = useTranslations("auth.account");
  const f = useTranslations("auth.features");
  const billingError = useTranslations("pricing.checkout.errors");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const query = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [notice, setNotice] = useState<CheckoutNotice | null>(null);
  /** The portal being opened: the entitlement's (`"plan"`) or the personal one (`"personal"`). */
  const [opening, setOpening] = useState<"plan" | "personal" | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const meta: Meta = user?.user_metadata ?? {};

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
        router.replace(`/sign-in?next=${encodeURIComponent("/account")}${intentQuery(intent).replace("?", "&")}`);
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
      if (intent.notify || intent.interest) router.replace("/account");

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
    // Runs once per visit: the intent in the query is applied, then cleared.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Revoking signs the computer out at its next license check; signing in on it again brings it back. The server keeps its own time. */
  async function remove(id: string) {
    const { error } = await supabase().from("devices").update({ revoked_at: new Date().toISOString() }).eq("id", id);
    setConfirming(null);
    if (error) return setStatus({ ok: false, text: t("saveError") });
    setDevices((list) => list.filter((d) => d.id !== id));
    setStatus({ ok: true, text: t("saved") });
  }

  async function reloadBilling() {
    if (!user) return;
    const next = await loadBilling(user.id);
    setBilling(next);
    if (next.failed) setLoadFailed(true);
  }

  // Back from Stripe's portal can bring the page back with its button still busy.
  useEffect(() => onPageRestored(() => setOpening(null)), []);

  /** The portal of the plan in effect, or of the personal subscription (no `org_id`). */
  async function manage(which: "plan" | "personal") {
    if (opening || !billing) return;
    setOpening(which);
    const orgId = billing.entitlement.org_id ?? undefined;
    const team = which === "plan" && billing.teams.some((x) => x.id === orgId);
    const error = await openPortal({ locale, go: () => {} }, team ? orgId : undefined);
    if (error) {
      setStatus({ ok: false, text: billingError(error) });
      setOpening(null);
    }
  }

  async function signOut() {
    await supabase().auth.signOut();
    router.replace("/");
  }

  if (!user) {
    return (
      <p className={styles.loading} role="status">
        <Loader2 aria-hidden="true" />
        {t("loading")}
      </p>
    );
  }

  const entitlement = billing?.entitlement ?? FREE;
  const plan = entitlement.plan;
  const subscription = billing?.subscription ?? null;
  const ends = subscription?.cancel_at_period_end === true;
  const periodEnd = subscription?.current_period_end ?? entitlement.period_end;
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  // A personal Pro still billing while a team's plan is the one in effect.
  const personal = billing?.personal && billing.personal.org_id !== entitlement.org_id ? billing.personal : null;
  const lapsedTeams = billing?.lapsedTeams ?? [];
  const notifying = meta.notify_release === true;
  const platforms = (Array.isArray(meta.notify_platforms) ? (meta.notify_platforms as string[]) : []).map((p) => PLATFORM_NAME[p] ?? p);
  const interests = Array.isArray(meta.interests) ? (meta.interests as string[]) : [];
  const enterprise = interests.includes("enterprise");
  const listFormat = new Intl.ListFormat(locale, { type: "conjunction" });

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.who}>{t("signedInAs", { email: user.email ?? "" })}</p>
        </div>
        <button type="button" className={buttonClass("secondary", "md")} onClick={signOut}>
          <ButtonIcon>
            <LogOut />
          </ButtonIcon>
          {t("signOut")}
        </button>
      </div>

      {loadFailed ? (
        <p className={`${styles.status} ${styles.statusError}`} role="alert">
          {t("loadError")}
        </p>
      ) : null}

      {notice ? (
        <p className={`${styles.status} ${styles.notice}`} role="status" style={{ marginTop: 24, maxWidth: 880 }}>
          {t(`checkout.${notice}`)}
        </p>
      ) : null}

      <div className={styles.groups}>
        <section aria-labelledby="g-plan">
          <h2 id="g-plan" className={styles.groupTitle}>
            {t("plan.title")}
          </h2>
          <div className={styles.box}>
            <div className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.planName}>{t(`plan.${plan}`)}</span>
                <span className={styles.rowText}>
                  {[
                    entitlement.org_name && billing?.teams.some((team) => team.id === entitlement.org_id) ? t("plan.org", { name: entitlement.org_name }) : null,
                    periodEnd && plan !== "free" ? t(ends ? "plan.ends" : "plan.renews", { date: dateFormat.format(new Date(periodEnd)) }) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || (plan === "free" ? t("plan.none") : "")}
                </span>
                {subscription?.status === "past_due" ? <span className={`${styles.rowText} ${styles.statusError}`}>{t("plan.pastDue")}</span> : null}
              </div>
              {plan === "free" ? (
                <ButtonLink href="/pricing" variant="secondary" trailingIcon={<ArrowRight />}>
                  {t("plan.seePlans")}
                </ButtonLink>
              ) : billing?.manages ? (
                <button type="button" className={buttonClass("secondary", "md")} onClick={() => manage("plan")} disabled={opening !== null} aria-busy={opening === "plan"}>
                  {opening === "plan" ? t("plan.opening") : t("plan.manage")}
                </button>
              ) : null}
            </div>
            {personal ? (
              <div className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{t("plan.personal", { plan: t(`plan.${personal.plan}`) })}</span>
                  {personal.current_period_end ? (
                    <span className={styles.rowText}>
                      {t(personal.cancel_at_period_end ? "plan.ends" : "plan.renews", { date: dateFormat.format(new Date(personal.current_period_end)) })}
                    </span>
                  ) : null}
                  {personal.status === "past_due" ? <span className={`${styles.rowText} ${styles.statusError}`}>{t("plan.pastDue")}</span> : null}
                </div>
                <button
                  type="button"
                  className={buttonClass("secondary", "md")}
                  onClick={() => manage("personal")}
                  disabled={opening !== null}
                  aria-busy={opening === "personal"}
                >
                  {opening === "personal" ? t("plan.opening") : t("plan.manage")}
                </button>
              </div>
            ) : null}
            {entitlement.features.length > 0 ? (
              <div className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{t("plan.features")}</span>
                  <ul className={styles.chips}>
                    {entitlement.features.map((id) => (
                      <li key={id}>{f.has(id) ? f(id) : id}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {plan === "free" || plan === "pro" ? (
          <section aria-labelledby="g-subscribe">
            <h2 id="g-subscribe" className={styles.groupTitle}>
              {t("subscribe.title")}
            </h2>
            <div className={styles.box}>
              <div className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowText}>{t("subscribe.body")}</span>
                </div>
                <div className={styles.actions}>
                  {plan === "free" ? (
                    <SubscribeButton plan="pro">{t("subscribe.pro", { price: formatPlanPrice(locale, "pro") })}</SubscribeButton>
                  ) : null}
                  <SubscribeButton plan="team" variant="secondary">
                    {t("subscribe.team", { price: formatPlanPrice(locale, "team") })}
                  </SubscribeButton>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {billing && (billing.teams.length > 0 || lapsedTeams.length > 0) ? (
          <section aria-labelledby="g-teams">
            <h2 id="g-teams" className={styles.groupTitle}>
              {t("teams.title")}
            </h2>
            <div className={styles.teams}>
              {billing.teams.map((team) =>
                team.seats ? (
                  <TeamMembers
                    key={team.id}
                    team={team}
                    userId={user.id}
                    onChanged={reloadBilling}
                    onStatus={setStatus}
                    relative={(iso) => relative(locale, iso)}
                  />
                ) : (
                  <div key={team.id} className={styles.box}>
                    <div className={styles.row}>
                      <span className={styles.rowText}>{t("teams.member", { name: team.name, plan: t(`plan.${team.subscription.plan}`) })}</span>
                    </div>
                  </div>
                ),
              )}
              {lapsedTeams.map((team) => (
                <div key={team.id} className={styles.box}>
                  <div className={styles.row}>
                    <div className={styles.rowMain}>
                      <span className={styles.rowTitle}>{team.name}</span>
                      <span className={styles.rowText}>{t("teams.lapsed")}</span>
                    </div>
                    <SubscribeButton plan="team" variant="secondary" prefill={renewOrder(team)}>
                      {t("teams.subscribeAgain")}
                    </SubscribeButton>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="g-notify">
          <h2 id="g-notify" className={styles.groupTitle}>
            {t("notify.title")}
          </h2>
          <div className={styles.box}>
            <div className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.rowText}>
                  {notifying ? (platforms.length ? t("notify.onPlatforms", { platforms: listFormat.format(platforms) }) : t("notify.on")) : t("notify.off")}
                </span>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={buttonClass(notifying ? "secondary" : "primary", "md")}
                  onClick={() => save({ ...meta, notify_release: !notifying, locale })}
                >
                  <ButtonIcon>{notifying ? <BellOff /> : <Bell />}</ButtonIcon>
                  {notifying ? t("notify.turnOff") : t("notify.turnOn")}
                </button>
                <ButtonLink href="/download" variant="ghost" trailingIcon={<ArrowRight />}>
                  {t("notify.download")}
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="g-enterprise">
          <h2 id="g-enterprise" className={styles.groupTitle}>
            {t("enterprise.title")}
          </h2>
          <div className={styles.box}>
            <div className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.rowText}>{enterprise ? t("enterprise.on") : t("enterprise.off")}</span>
              </div>
              <button
                type="button"
                className={buttonClass(enterprise ? "ghost" : "secondary", "md")}
                onClick={() => save({ ...meta, interests: enterprise ? interests.filter((i) => i !== "enterprise") : [...interests, "enterprise"] })}
              >
                {enterprise ? null : (
                  <ButtonIcon>
                    <Building2 />
                  </ButtonIcon>
                )}
                {enterprise ? t("enterprise.undo") : t("enterprise.button")}
              </button>
            </div>
          </div>
        </section>

        <section aria-labelledby="g-devices">
          <h2 id="g-devices" className={styles.groupTitle}>
            {t("devices.title")} · {t("devices.count", { count: devices.length })}
          </h2>
          <div className={styles.box}>
            <div className={styles.row}>
              <span className={styles.rowText}>{devices.length ? t("devices.hint") : t("devices.empty")}</span>
            </div>
            {devices.map((d) => (
              <div key={d.id} className={styles.row}>
                <div className={styles.device}>
                  <div>
                    <div className={styles.deviceName}>{d.name}</div>
                    <div className={styles.deviceMeta}>
                      {PLATFORM_NAME[d.platform] ?? d.platform} · {d.app_version} · {t("devices.lastSeen", { when: relative(locale, d.last_seen_at) })}
                    </div>
                  </div>
                  {confirming === d.id ? (
                    <div className={styles.actions}>
                      <button type="button" className={buttonClass("ghost", "md")} onClick={() => setConfirming(null)}>
                        {t("devices.cancel")}
                      </button>
                      <button type="button" className={buttonClass("secondary", "md")} onClick={() => remove(d.id)}>
                        {t("devices.confirm")}
                      </button>
                    </div>
                  ) : (
                    <button type="button" className={buttonClass("ghost", "md")} onClick={() => setConfirming(d.id)}>
                      {t("devices.revoke")}
                    </button>
                  )}
                  {confirming === d.id ? (
                    <p className={styles.rowText} style={{ gridColumn: "1 / -1" }}>
                      {t("devices.confirmHint", { name: d.name })}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className={`${styles.status} ${status && !status.ok ? styles.statusError : ""}`} role="status" aria-live="polite">
          {status?.text ?? ""}
        </p>
      </div>
    </>
  );
}
