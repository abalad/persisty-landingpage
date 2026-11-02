import type { ReactNode } from "react";
import { SectionHead } from "@/components/site/SectionHead";
import { Link } from "@/i18n/navigation";
import feature from "@/components/home/Feature.module.css";
import { FEATURE_ICONS } from "./featureIcons";
import styles from "./plans.module.css";

export interface AlsoItem {
  /** Catalog id, for the icon. */
  id: string;
  /** Becomes the item's id, so the app and the menu can link to it. */
  anchor?: string;
  name: string;
  line: string;
  href?: string;
  badge?: ReactNode;
}

/** A section of a plan's page that lists features in hairline-divided rows, two columns wide. */
export function AlsoList({ id, title, body, items }: { id: string; title: string; body?: string; items: AlsoItem[] }) {
  return (
    <section className={feature.section} aria-labelledby={id}>
      <div className="container">
        <SectionHead id={id} title={title} body={body ?? ""} />
        <ul className={styles.list}>
          {items.map((item) => {
            const Icon = FEATURE_ICONS[item.id];
            return (
              <li key={item.id} id={item.anchor} className={styles.item}>
                {Icon ? <Icon aria-hidden="true" /> : <span />}
                <h3 className={styles.itemHead}>
                  {item.href ? <Link href={item.href}>{item.name}</Link> : item.name}
                  {item.badge}
                </h3>
                <p className={styles.itemLine}>{item.line}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
