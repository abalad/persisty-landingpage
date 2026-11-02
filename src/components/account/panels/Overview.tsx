"use client";

import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { createElement } from "react";
import { FEATURE_ICONS } from "@/components/plans/featureIcons";
import { Glimpse, hasGlimpse } from "@/components/plans/Glimpse";
import { Badge } from "@/components/site/Badge";
import { buttonClass, ButtonLink } from "@/components/site/Button";
import { SubscribeButton } from "@/components/site/SubscribeButton";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { unlockedFor, upsellFor } from "@/lib/account";
import { FREE } from "@/lib/billing";
import { featureHref, planById, type PlanFeature, type ShownPlanId } from "@/lib/plans";
import { formatPlanPrice } from "@/lib/pricing";
import { useAccount } from "../AccountProvider";
import styles from "../account.module.css";
import o from "./overview.module.css";

/**
 * The first thing in My account: the plan, what it unlocks shown as the app
 * shows it, what is coming, and the one plan up. Free sees Pro as what it
 * would get; Pro sees Team; Team sees what it has.
 */
export function Overview() {
  const t = useTranslations("auth.account");
  const v = useTranslations("auth.account.overview");
  const names = useTranslations("pricing.plans");
  const locale = useLocale() as Locale;
  const { billing, manage, opening } = useAccount();

  const entitlement = billing?.entitlement ?? FREE;
  const plan = entitlement.plan;
  const shown: ShownPlanId = plan === "enterprise" ? "team" : plan;
  const subscription = billing?.subscription ?? null;
  const periodEnd = subscription?.current_period_end ?? entitlement.period_end;
  const ends = subscription?.cancel_at_period_end === true;
  const pastDue = subscription?.status === "past_due";
  const date = periodEnd ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(periodEnd)) : null;
  const viaTeam = entitlement.org_name && billing?.teams.some((team) => team.id === entitlement.org_id) ? entitlement.org_name : null;
  const groups = unlockedFor(plan);
  const up = upsellFor(plan);
  const planned = planById(shown).features.filter((f) => f.status === "planned");

  return (
    <div className={styles.panel} style={{ gap: 48 }}>
      <section aria-labelledby="o-plan" className={o.plan}>
        <div className={o.planMain}>
          <h2 id="o-plan" className={o.planName}>
            {t(`plan.${plan}`)}
          </h2>
          <p className={o.planState}>
            {plan === "free" ? (
              t("plan.none")
            ) : (
              <>
                <span className={`${o.dot} ${pastDue ? o.dotDanger : ends ? o.dotWarn : o.dotOk}`} aria-hidden="true" />
                {pastDue ? t("plan.pastDue") : ends && date ? t("plan.ends", { date }) : v("active")}
                {!pastDue && !ends && date ? ` · ${t("plan.renews", { date })}` : null}
              </>
            )}
          </p>
          {plan === "pro" || plan === "team" ? (
            <p className={o.planPrice}>
              {plan === "team" ? v("pricePerson", { price: formatPlanPrice(locale, "team") }) : v("priceMonth", { price: formatPlanPrice(locale, "pro") })}
              {viaTeam ? ` · ${t("plan.org", { name: viaTeam })}` : null}
            </p>
          ) : null}
        </div>
        {plan === "free" ? (
          <ButtonLink href="/pricing" variant="secondary" trailingIcon={<ArrowRight />}>
            {t("plan.seePlans")}
          </ButtonLink>
        ) : billing?.manages ? (
          <button type="button" className={buttonClass("secondary", "md")} onClick={() => void manage("plan")} disabled={opening !== null} aria-busy={opening === "plan"}>
            {opening === "plan" ? t("plan.opening") : t("plan.manage")}
          </button>
        ) : null}
      </section>

      {groups.length > 0 ? (
        <section aria-labelledby="o-unlocks" className={styles.panel}>
          <h2 id="o-unlocks" className={styles.panelTitle}>
            {v("unlocks", { plan: t(`plan.${plan}`) })}
          </h2>
          {groups.map((g) => (
            <div key={g.plan} className={o.group}>
              {groups.length > 1 ? <h3 className={o.groupTitle}>{v("from", { plan: names(`${g.plan}.name`) })}</h3> : null}
              <FeatureRows plan={g.plan} features={g.features} />
            </div>
          ))}
        </section>
      ) : null}

      {up === "pro" ? (
        <section aria-labelledby="o-gain" className={styles.panel}>
          <div className={o.upHead}>
            <h2 id="o-gain" className={styles.panelTitle}>
              {v("gainTitle")}
            </h2>
            <p className={o.upBody}>{v("gainBody")}</p>
          </div>
          <FeatureRows plan="pro" features={planById("pro").features.filter((f) => f.status === "available")} />
          <div className={o.upActions}>
            <SubscribeButton plan="pro">{t("subscribe.pro", { price: formatPlanPrice(locale, "pro") })}</SubscribeButton>
            <ButtonLink href="/pro" variant="ghost" trailingIcon={<ArrowRight />}>
              {v("seePro")}
            </ButtonLink>
          </div>
        </section>
      ) : null}

      {planned.length > 0 && plan !== "free" ? (
        <section aria-labelledby="o-soon" className={styles.panel}>
          <h2 id="o-soon" className={styles.panelTitle}>
            {v("soon", { plan: names(`${shown}.name`) })}
          </h2>
          <ul className={o.soon}>
            {planned.map((f) => (
              <PlannedRow key={f.id} feature={f} />
            ))}
          </ul>
        </section>
      ) : null}

      {up === "team" ? (
        <section aria-labelledby="o-team" className={o.team}>
          <div className={o.teamMain}>
            <h2 id="o-team" className={o.teamTitle}>
              {v("teamTitle")}
            </h2>
            <p className={o.upBody}>{v("teamBody", { price: formatPlanPrice(locale, "team") })}</p>
          </div>
          <ButtonLink href="/team" variant="secondary" trailingIcon={<ArrowRight />}>
            {v("seeTeam")}
          </ButtonLink>
        </section>
      ) : null}
    </div>
  );
}

/** Features in one panel split by hairlines: the app's own glimpse of each, its line, where it lives and how to use it. */
function FeatureRows({ plan, features }: { plan: ShownPlanId; features: PlanFeature[] }) {
  const v = useTranslations("auth.account.overview");
  const names = useTranslations("pricing.features");
  const lines = useTranslations("features");
  return (
    <ul className={o.rows}>
      {features.map((f) => (
        <li key={f.id} className={o.row}>
          <div className={o.visual}>{hasGlimpse(f.id) ? <Glimpse id={f.id} /> : <span className={o.icon}>{FEATURE_ICONS[f.id] ? createElement(FEATURE_ICONS[f.id], { "aria-hidden": true }) : null}</span>}</div>
          <div className={o.text}>
            <h3 className={o.name}>{names(f.id)}</h3>
            <p className={o.line}>{lines(`${f.id}.line`)}</p>
            <p className={o.where}>{v("where", { where: lines(`${f.id}.where`) })}</p>
            <Link href={featureHref(plan, f)} className={o.how}>
              {v("howTo")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PlannedRow({ feature }: { feature: PlanFeature }) {
  const names = useTranslations("pricing.features");
  const lines = useTranslations("features");
  return (
    <li className={o.soonRow}>
      <span className={o.soonName}>
        {names(feature.id)}
        <Badge status="planned" />
      </span>
      <span className={o.line}>{lines(`${feature.id}.line`)}</span>
    </li>
  );
}
