import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/site/PageHeader";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatSize, versionList } from "@/lib/releases";
import { alternatesFor } from "@/lib/seo";
import styles from "./versions.module.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/download/versions">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "download.versions.meta" });
  return { title: t("title"), description: t("description"), alternates: alternatesFor(locale as Locale, "/download/versions") };
}

export default async function VersionsPage({ params }: PageProps<"/[locale]/download/versions">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("download");
  const versions = versionList();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" });

  return (
    <>
      <PageHeader title={t("versions.title")} body={t("versions.body")} />
      {versions.length ? (
        <>
          <p className={`container ${styles.verify}`}>{t.rich("versions.verify", { code: (chunks) => <code>{chunks}</code> })}</p>
          <ol className={`container ${styles.list}`}>
            {versions.map((r) => (
              <li key={r.version} id={r.version} className={styles.entry}>
                <div className={styles.meta}>
                  <h2 className={styles.version}>
                    <Link href={`/changelog#${r.version}`}>{r.version}</Link>
                  </h2>
                  <time className={styles.date} dateTime={r.date}>
                    {date.format(new Date(`${r.date}T00:00:00Z`))}
                  </time>
                </div>
                <ul className={styles.files}>
                  {r.files.map((f) => (
                    <li key={f.name} className={styles.file}>
                      <div className={styles.fileMain}>
                        <span className={styles.kind}>
                          {t(`platforms.${f.platform}.name`)} · {t(`kinds.${f.kind}`)}
                        </span>
                        <a className={styles.name} href={f.url}>
                          {f.name}
                        </a>
                      </div>
                      <span className={styles.size}>{formatSize(f.size, locale)}</span>
                      <span className={styles.sha}>
                        <span className={styles.shaLabel}>{t("versions.sha")}</span>
                        <code title={f.sha256}>{f.sha256}</code>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className={`container ${styles.empty}`}>
          <p>{t("versions.empty")}</p>
          <Link className={styles.back} href="/download">
            {t("versions.emptyLink")}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}
