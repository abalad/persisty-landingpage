"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buttonClass, ButtonLink } from "@/components/site/Button";
import { SubscribeButton } from "@/components/site/SubscribeButton";
import type { Locale } from "@/i18n/routing";
import { planSummary, subscribeOptions } from "@/lib/account";
import { formatPlanPrice } from "@/lib/pricing";
import { useAccount } from "../AccountProvider";
import styles from "../account.module.css";

/** The plan in effect and who pays for it, the personal subscription beside a team's, and what can still be subscribed. */
export function BillingPanel() {
  const t = useTranslations("auth.account");
  const locale = useLocale() as Locale;
  const { billing, notice, manage, opening } = useAccount();
  const summary = planSummary(billing, notice === "waiting");

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
    </section>
  );
}
