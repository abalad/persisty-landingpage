import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge, type Availability } from "@/components/site/Badge";
import { ButtonLink } from "@/components/site/Button";
import { Feature } from "./Feature";
import styles from "./Companies.module.css";

export function Companies() {
  const t = useTranslations("home.companies");
  const items = t.raw("items") as { title: string; body: string; status: Availability }[];
  return (
    <Feature id="companies" title={t("title")} body={t("body")}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <h3>{item.title}</h3>
            <Badge status={item.status} />
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      <div className={styles.cta}>
        <ButtonLink href="/team" variant="secondary" trailingIcon={<ArrowRight />}>
          {t("cta")}
        </ButtonLink>
      </div>
    </Feature>
  );
}
