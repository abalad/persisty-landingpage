import { ArrowDownToLine, Check, CircleDashed } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/site/Badge";
import { ButtonLink } from "@/components/site/Button";
import { SubscribeButton } from "@/components/site/SubscribeButton";
import type { Locale } from "@/i18n/routing";
import { SHOWN_PLANS, type Plan } from "@/lib/plans";
import { currencyFor, formatPlanPrice, formatPrice } from "@/lib/pricing";
import { contactHref } from "@/lib/site";
import styles from "./PlanCards.module.css";

/** The shown plans side by side. `withFeatures` adds each plan's list (the pricing page). */
export function PlanCards({ withFeatures = false }: { withFeatures?: boolean }) {
  const t = useTranslations("pricing");
  const locale = useLocale() as Locale;

  return (
    <>
      <div className={styles.grid}>
        {SHOWN_PLANS.map((plan, i) => (
          <article key={plan.id} className={`${styles.plan} ${plan.id === "pro" ? styles.featured : ""}`} aria-labelledby={`plan-${plan.id}`}>
            <div className={styles.top}>
              <h3 id={`plan-${plan.id}`} className={styles.name}>
                {t(`plans.${plan.id}.name`)}
              </h3>
              <p className={styles.tagline}>{t(`plans.${plan.id}.tagline`)}</p>
            </div>
            <div className={styles.price}>
              {plan.id === "enterprise" ? (
                <span className={`${styles.amount} ${styles.amountText}`}>{t("plans.enterprise.price")}</span>
              ) : (
                <span className={styles.amount}>
                  {plan.id === "free" ? formatPrice(locale, 0, currencyFor(locale), { explicit: true }) : formatPlanPrice(locale, plan.id)}
                </span>
              )}
              <span className={styles.per}>{t(`plans.${plan.id}.per`)}</span>
            </div>
            <div className={styles.action}>
              <PlanAction plan={plan} label={t(`plans.${plan.id}.cta`)} />
            </div>
            {withFeatures ? (
              <ul className={styles.features}>
                {i > 0 ? <li className={styles.includes}>{t("includes", { plan: t(`plans.${SHOWN_PLANS[i - 1].id}.name`) })}</li> : null}
                {plan.features.map((f) => (
                  <li key={f.id} className={styles.feature}>
                    {f.status === "available" ? <Check aria-hidden="true" /> : <CircleDashed aria-hidden="true" style={{ color: "var(--site-muted)" }} />}
                    <span className={f.status === "available" ? undefined : styles.later}>
                      {t(`features.${f.id}`)}
                      {f.status === "available" ? null : (
                        <span className={styles.featureBadge}>
                          <Badge status={f.status} />
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
      <p className={styles.notes}>
        <span>{t("currency")}</span>
        <span>{t("opening")}</span>
      </p>
    </>
  );
}

/** A plan's main action: download Free, subscribe to Pro or Team. */
export function PlanAction({ plan, label }: { plan: Plan; label: string }) {
  if (plan.id === "free") {
    return (
      <ButtonLink href="/download" variant="secondary" icon={<ArrowDownToLine />}>
        {label}
      </ButtonLink>
    );
  }
  if (plan.id === "enterprise") {
    return (
      <ButtonLink href={contactHref("enterprise") ?? "/sign-in"} variant="secondary">
        {label}
      </ButtonLink>
    );
  }
  return (
    <SubscribeButton plan={plan.id} variant={plan.id === "pro" ? "primary" : "secondary"}>
      {label}
    </SubscribeButton>
  );
}
