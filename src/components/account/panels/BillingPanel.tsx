"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonClass, ButtonLink } from "@/components/site/Button";
import { SubscribeButton } from "@/components/site/SubscribeButton";
import type { Locale } from "@/i18n/routing";
import { planSummary, subscribeOptions } from "@/lib/account";
import { formatPlanPrice } from "@/lib/pricing";
import { readStatus, retention } from "@/lib/retention";
import { useAccount } from "../AccountProvider";
import { CancelFlow } from "../cancel/CancelFlow";
import styles from "../account.module.css";

/** The plan in effect and who pays for it, the personal subscription beside a team's, and what can still be subscribed. */
export function BillingPanel() {
  const t = useTranslations("auth.account");
  const locale = useLocale() as Locale;
  const { billing, notice, manage, opening, reloadBilling, setStatus } = useAccount();
  const summary = planSummary(billing, notice === "waiting");
  const [flow, setFlow] = useState<{ orgId?: string; plan: "pro" | "team"; duplicate: boolean } | null>(null);
  const [undoing, setUndoing] = useState<string | null>(null);
  const [discountUntil, setDiscountUntil] = useState<string | null>(null);
  const mainOrg = billing?.entitlement.org_id ?? undefined;
  const stripeBacked = Boolean(billing?.manages && billing.subscription?.stripe_subscription_id);

  // Whether an offer from cancelling is running on the plan, to say until when.
  useEffect(() => {
    if (!stripeBacked) return;
    let alive = true;
    void retention("status", { orgId: mainOrg }).then((res) => {
      if (alive && res.ok) setDiscountUntil(readStatus(res.data).discountUntil);
    });
    return () => {
      alive = false;
    };
  }, [stripeBacked, mainOrg, billing]);

  if (!summary) {
    return (
      <p className={styles.loading} role="status" style={{ marginTop: 0 }}>
        <Loader2 aria-hidden="true" />
        {t("loading")}
      </p>
    );
  }

  const { plan, viaTeam, periodEnd, ends, pastDue, manages, personal } = summary;
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const paidPlan = plan === "team" ? "team" : "pro";

  async function undo(key: string, orgId?: string) {
    if (undoing) return;
    setUndoing(key);
    const res = await retention("undo", { orgId });
    setUndoing(null);
    if (!res.ok) return setStatus({ ok: false, text: t(`cancel.errors.${res.error}`) });
    setStatus({ ok: true, text: t("cancel.done.undone", { plan: t(`plan.${plan}`) }) });
    await reloadBilling();
  }

  /** "Cancel subscription", or "Undo cancelling" once it is set to end. */
  const cancelControl = (key: string, ending: boolean, open: () => void, orgId?: string) =>
    ending ? (
      <button type="button" className={styles.textAction} onClick={() => void undo(key, orgId)} disabled={undoing !== null} aria-busy={undoing === key}>
        {undoing === key ? t("cancel.undoing") : t("cancel.undo")}
      </button>
    ) : (
      <button type="button" className={styles.textAction} onClick={open}>
        {t("cancel.open")}
      </button>
    );
  // Back from checkout, nothing is offered until the new plan arrives.
  const options = notice === "waiting" ? [] : subscribeOptions(plan);

  return (
    <section aria-labelledby="p-billing" className={styles.panel}>
      <h2 id="p-billing" className={styles.panelTitle}>
        {t("nav.billing")}
      </h2>
      <div className={styles.box}>
        <div className={styles.row}>
          <div className={styles.rowMain}>
            <span className={styles.planName}>{t(`plan.${plan}`)}</span>
            <span className={styles.rowText}>
              {[
                viaTeam ? t("plan.org", { name: viaTeam }) : null,
                periodEnd && plan !== "free" ? t(ends ? "plan.ends" : "plan.renews", { date: dateFormat.format(new Date(periodEnd)) }) : null,
              ]
                .filter(Boolean)
                .join(" · ") || (plan === "free" ? t("plan.none") : "")}
            </span>
            {pastDue ? <span className={`${styles.rowText} ${styles.statusError}`}>{t("plan.pastDue")}</span> : null}
            {discountUntil && !ends ? <span className={styles.rowText}>{t("cancel.offerActive", { date: dateFormat.format(new Date(discountUntil)) })}</span> : null}
            {stripeBacked && manages ? cancelControl("plan", ends, () => setFlow({ orgId: mainOrg, plan: paidPlan, duplicate: false }), mainOrg) : null}
          </div>
          {plan === "free" ? (
            <ButtonLink href="/pricing" variant="secondary" trailingIcon={<ArrowRight />}>
              {t("plan.seePlans")}
            </ButtonLink>
          ) : manages ? (
            <button type="button" className={buttonClass("secondary", "md")} onClick={() => void manage("plan")} disabled={opening !== null} aria-busy={opening === "plan"}>
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
              {cancelControl("personal", personal.cancel_at_period_end, () => setFlow({ orgId: personal.org_id, plan: personal.plan === "team" ? "team" : "pro", duplicate: true }), personal.org_id)}
            </div>
            <button type="button" className={buttonClass("secondary", "md")} onClick={() => void manage("personal")} disabled={opening !== null} aria-busy={opening === "personal"}>
              {opening === "personal" ? t("plan.opening") : t("plan.manage")}
            </button>
          </div>
        ) : null}
      </div>

      {options.length > 0 ? (
        <>
          <h3 className={styles.subTitle}>{t(plan === "free" ? "subscribe.title" : "subscribe.teamTitle")}</h3>
          <div className={styles.box}>
            <div className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.rowText}>{t(plan === "free" ? "subscribe.body" : "subscribe.teamBody")}</span>
              </div>
              <div className={styles.actions}>
                {options.map((o) => (
                  <SubscribeButton key={o} plan={o} variant={o === "pro" ? "primary" : "secondary"}>
                    {t(`subscribe.${o}`, { price: formatPlanPrice(locale, o) })}
                  </SubscribeButton>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
      {flow ? (
        <CancelFlow
          orgId={flow.orgId}
          plan={flow.plan}
          duplicate={flow.duplicate}
          teamName={viaTeam}
          onClose={(changed) => {
            setFlow(null);
            if (changed) void reloadBilling();
          }}
        />
      ) : null}
    </section>
  );
}
