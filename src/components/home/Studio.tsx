import { useTranslations } from "next-intl";
import { SectionHead } from "@/components/site/SectionHead";
import { StudioCards } from "./StudioCards";
import styles from "./Studio.module.css";

/** Four things the app does, each shown by its mascot at work: alive in 3D, with a piece of the app, when you point at it. */
export function Studio() {
  const t = useTranslations("home.studio");
  const items = t.raw("items") as { title: string; body: string }[];
  return (
    <section className={styles.section} aria-labelledby="studio">
      <div className="container">
        <SectionHead id="studio" title={t("title")} body={t("body")} />
        <StudioCards items={items} />
      </div>
    </section>
  );
}
