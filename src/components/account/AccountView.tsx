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
import { planById, type PlanId } from "@/lib/plans";
import { formatPrice } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";
import styles from "./account.module.css";

interface Entitlement {
  plan: PlanId;
  org_name: string | null;
  features: string[];
  period_end: string | null;
}

interface Device {
  id: string;
  name: string;
  platform: "macos" | "windows" | "linux";
  app_version: string;
  last_seen_at: string;
}

type Meta = Record<string, unknown>;
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
  const locale = useLocale() as Locale;
  const router = useRouter();
  const query = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
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

      const [ent, dev] = await Promise.all([
        supabase().rpc("my_entitlement"),
        supabase().from("devices").select("id,name,platform,app_version,last_seen_at").is("revoked_at", null).order("last_seen_at", { ascending: false }),
      ]);
      if (!alive) return;
      if (ent.error || dev.error) setLoadFailed(true);
      setEntitlement((ent.data as Entitlement[] | null)?.[0] ?? { plan: "free", org_name: null, features: [], period_end: null });
      setDevices((dev.data as Device[] | null) ?? []);
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

  const plan = entitlement?.plan ?? "free";
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
                    entitlement?.org_name && plan !== "free" ? t("plan.org", { name: entitlement.org_name }) : null,
                    entitlement?.period_end ? t("plan.renews", { date: new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(entitlement.period_end)) }) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || (plan === "free" ? t("plan.none") : "")}
                </span>
              </div>
            </div>
            {entitlement && entitlement.features.length > 0 ? (
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
                    <SubscribeButton plan="pro">{t("subscribe.pro", { price: formatPrice(locale, planById("pro").priceCents ?? 0) })}</SubscribeButton>
                  ) : null}
                  <SubscribeButton plan="team" variant="secondary">
                    {t("subscribe.team", { price: formatPrice(locale, planById("team").priceCents ?? 0) })}
                  </SubscribeButton>
                </div>
              </div>
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
