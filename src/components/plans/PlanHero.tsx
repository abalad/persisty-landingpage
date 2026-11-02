import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/site/Button";
import { PlanAction } from "@/components/pricing/PlanCards";
import type { Locale } from "@/i18n/routing";
import { planById, type ShownPlanId } from "@/lib/plans";
import { currencyFor, formatPlanPrice, formatPrice } from "@/lib/pricing";
import { FEATURE_ICONS } from "./featureIcons";
import styles from "./plans.module.css";

/**
 * A plan's page opens with what changes in the day, the action, and the price
 * on the featured plan's raised panel; under it, links to the page's sections
 * (`index`: section ids, each with an icon in `FEATURE_ICONS` under `icons`).
 */
export function PlanHero({ plan, index }: { plan: ShownPlanId; index: { anchor: string; icon: string }[] }) {
  const t = useTranslations(`plans.${plan}.hero`);
  const p = useTranslations("pricing");
  const c = useTranslations("plans.common");
  const locale = useLocale() as Locale;
  const info = planById(plan);
  const price = plan === "free" ? formatPrice(locale, 0, currencyFor(locale), { explicit: true }) : formatPlanPrice(locale, plan);

  return (
    <header className="container">
      <div className={styles.hero}>
        <div>
          <h1 className={styles.heroTitle}>{t("title")}</h1>
          <p className={styles.heroBody}>{t("body", { price })}</p>
          <div className={styles.actions}>
            <PlanAction plan={info} label={p(`plans.${plan}.cta`)} size="lg" />
            <ButtonLink href="#compare" variant="secondary" size="lg">
              {c("comparePlans")}
            </ButtonLink>
          </div>
        </div>
        <div className={styles.price}>
          <span className={styles.priceName}>{p(`plans.${plan}.name`)}</span>
          <span className={styles.amount}>{price}</span>
          <span className={styles.per}>{p(`plans.${plan}.per`)}</span>
          <p className={styles.fine}>{plan === "free" ? c("freeFine") : `${p("currency")} ${p("opening")}`}</p>
        </div>
      </div>
      <nav className={styles.index} aria-label={c("onThisPage")}>
        {index.map(({ anchor, icon }) => {
          const Icon = FEATURE_ICONS[icon];
          return (
            <a key={anchor} href={`#${anchor}`} className={styles.indexLink}>
              {Icon ? <Icon aria-hidden="true" /> : null}
              {c(`index.${plan}.${anchor}`)}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
