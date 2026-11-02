import { Check, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { Badge } from "@/components/site/Badge";
import { SHOWN_PLANS } from "@/lib/plans";
import styles from "./CompareTable.module.css";

/** Every feature, grouped by the plan that introduces it; later plans include earlier ones. */
export function CompareTable() {
  const t = useTranslations("pricing");
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{t("compare.title")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("compare.feature")}</th>
            {SHOWN_PLANS.map((p) => (
              <th key={p.id} scope="col">
                {t(`plans.${p.id}.name`)}
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
                    <td key={col.id}>
                      {colIndex >= planIndex ? (
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
