import { useTranslations } from "next-intl";
import feature from "@/components/home/Feature.module.css";
import { CompareTable } from "@/components/pricing/CompareTable";
import { PlanAction } from "@/components/pricing/PlanCards";
import { Badge } from "@/components/site/Badge";
import { ButtonLink } from "@/components/site/Button";
import { planById, type ShownPlanId } from "@/lib/plans";
import { AlsoList } from "./AlsoList";
import styles from "./plans.module.css";

/** What is still planned for a plan, each with its badge, under `#roadmap`. */
export function Roadmap({ plan }: { plan: ShownPlanId }) {
  const c = useTranslations("plans.common");
  const p = useTranslations("pricing");
  const f = useTranslations("features");
  const planned = planById(plan).features.filter((x) => x.status === "planned");
  return (
    <AlsoList
      id="roadmap"
      title={c("roadmapTitle", { plan: p(`plans.${plan}.name`) })}
      body={c("roadmapBody")}
      items={planned.map((x) => ({ id: x.id, name: p(`features.${x.id}`), line: f(`${x.id}.line`), badge: <Badge status="planned" /> }))}
    />
  );
}

/** The comparison with this plan's column marked, under `#compare`. */
export function PlanCompare({ plan }: { plan: ShownPlanId }) {
  const c = useTranslations("plans.common");
  return (
    <section className={feature.section} aria-labelledby="compare">
      <div className="container">
        <h2 id="compare" className={styles.compareTitle}>
          {c("compareTitle")}
        </h2>
        <CompareTable highlight={plan} />
      </div>
    </section>
  );
}

/** The page's last word: the plan's action again, and the way down or across. */
export function PlanClosing({ plan }: { plan: ShownPlanId }) {
  const t = useTranslations(`plans.${plan}.closing`);
  const p = useTranslations("pricing.plans");
  const c = useTranslations("plans.common");
  return (
    <section className={`container ${styles.closing}`} aria-labelledby="closing-title">
      <h2 id="closing-title" className={styles.closingTitle}>
        {t("title")}
      </h2>
      <p className={styles.closingBody}>{t("body")}</p>
      <div className={styles.actions} style={{ justifyContent: "center", marginTop: 8 }}>
        <PlanAction plan={planById(plan)} label={p(`${plan}.cta`)} size="lg" />
        {plan === "free" ? (
          <ButtonLink href="/pro" variant="secondary" size="lg">
            {c("seePro")}
          </ButtonLink>
        ) : (
          <ButtonLink href="/download" variant="secondary" size="lg">
            {c("downloadFree")}
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
