import { Rss } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/site/PageHeader";
import type { Locale } from "@/i18n/routing";
import { listChangelog } from "@/lib/content";
import { alternatesFor, localizedPath } from "@/lib/seo";
import styles from "./changelog.module.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/changelog">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "changelog.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { ...alternatesFor(locale as Locale, "/changelog"), types: { "application/rss+xml": localizedPath(locale as Locale, "/changelog/rss") } },
  };
}

export default async function ChangelogPage({ params }: PageProps<"/[locale]/changelog">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("changelog");
  const entries = await listChangelog(locale as Locale);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" });

  return (
    <>
      <PageHeader title={t("title")} body={t("body")} />
      <div className={`container ${styles.feed}`}>
        <a className={styles.rss} href={localizedPath(locale as Locale, "/changelog/rss")}>
          <Rss aria-hidden="true" />
          {t("rss")}
        </a>
      </div>
      <ol className={`container ${styles.list}`}>
        {entries.map((e) => (
          <li key={e.id} id={e.id} className={styles.entry}>
            <div className={styles.meta}>
              <a className={styles.version} href={`#${e.id}`}>
                {e.version}
              </a>
              <time className={styles.date} dateTime={e.date}>
                {date.format(new Date(`${e.date}T00:00:00Z`))}
              </time>
            </div>
            <article>
              <h2 className={styles.title}>
                <a href={`#${e.id}`}>{e.title}</a>
              </h2>
              <div className="prose" dangerouslySetInnerHTML={{ __html: e.html }} />
            </article>
          </li>
        ))}
      </ol>
    </>
  );
}
