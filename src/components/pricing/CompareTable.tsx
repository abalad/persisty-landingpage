import { Check, CircleDashed, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { Badge } from "@/components/site/Badge";
import { SHOWN_PLANS, type ShownPlanId } from "@/lib/plans";
import styles from "./CompareTable.module.css";

/**
 * Every feature, grouped by the plan that introduces it; later plans include
 * earlier ones. On a plan's own page, `highlight` marks that plan's column.
 */
export function CompareTable({ highlight }: { highlight?: ShownPlanId }) {
  const t = useTranslations("pricing");
  const on = (id: string) => (id === highlight ? styles.on : undefined);
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{t("compare.title")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("compare.feature")}</th>
            {SHOWN_PLANS.map((p) => (
              <th key={p.id} scope="col" className={on(p.id)}>
                {t(`plans.${p.id}.name`)}
                {p.id === highlight ? <span className="visually-hidden"> · {t("compare.current")}</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SHOWN_PLANS.map((plan, planIndex) => (
            <Fragment key={plan.id}>
              <tr className={styles.group}>
                <th scope="rowgroup" colSpan={SHOWN_PLANS.length + 1}>
                  {t(`plans.${plan.id}.name`)}
                </th>
              </tr>
              {plan.features.map((f) => (
                <tr key={f.id}>
                  <th scope="row">
                    <span className={styles.rowLabel}>
                      {t(`features.${f.id}`)}
                      {f.status === "available" ? null : <Badge status={f.status} />}
                    </span>
                  </th>
                  {SHOWN_PLANS.map((col, colIndex) => (
                    <td key={col.id} className={on(col.id)}>
                      {colIndex >= planIndex && f.status !== "available" ? (
                        <span className={styles.later}>
                          <CircleDashed aria-hidden="true" />
                          <span className="visually-hidden">{t("compare.later")}</span>
                        </span>
                      ) : colIndex >= planIndex ? (
                        <span className={styles.yes}>
                          <Check aria-hidden="true" />
                          <span className="visually-hidden">{t("compare.yes")}</span>
                        </span>
                      ) : (
                        <span className={styles.no}>
                          <Minus aria-hidden="true" />
                          <span className="visually-hidden">{t("compare.no")}</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
