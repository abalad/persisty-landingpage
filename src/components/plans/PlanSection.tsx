import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Feature } from "@/components/home/Feature";
import { Badge } from "@/components/site/Badge";
import type { ShownPlanId } from "@/lib/plans";
import styles from "./plans.module.css";

interface PlanSectionProps {
  id: string;
  plan: ShownPlanId;
  title: string;
  body: string;
  /** What the plan below gets, and what this plan gets, in one line each. */
  diff?: { below: string; here: string };
  link?: { href: string; label: string };
  narrow?: boolean;
  children?: ReactNode;
}

/** One feature of a plan: the home page's section, the plan's badge, and the line that says what changes. */
export function PlanSection({ id, plan, title, body, diff, link, narrow, children }: PlanSectionProps) {
  const c = useTranslations("plans.common");
  const p = useTranslations("pricing.plans");
  const below = plan === "team" ? "pro" : "free";
  return (
    <Feature id={id} title={title} body={body} link={link} narrow={narrow} meta={plan === "free" ? undefined : <Badge status="pro" />}>
      {children}
      {diff ? (
        <div className={styles.diff}>
          <div>
            <span className={styles.diffLabel}>{c("inPlan", { plan: p(`${below}.name`) })}</span>
            <p>{diff.below}</p>
          </div>
          <div>
            <span className={styles.diffLabel}>{c("inPlan", { plan: p(`${plan}.name`) })}</span>
            <p className={styles.diffOn}>{diff.here}</p>
          </div>
        </div>
      ) : null}
    </Feature>
  );
}
