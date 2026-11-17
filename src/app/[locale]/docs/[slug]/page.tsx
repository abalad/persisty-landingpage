import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DocsNav } from "@/components/docs/DocsNav";
import styles from "@/components/docs/docs.module.css";
import { ClipPlayer } from "@/components/site/ClipPlayer";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getDoc, listDocs } from "@/lib/content";
import { alternatesFor } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return listDocs(params.locale as Locale).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/docs/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = await getDoc(locale as Locale, slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description, alternates: alternatesFor(locale as Locale, `/docs/${slug}`) };
}

export default async function DocPage({ params }: PageProps<"/[locale]/docs/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const doc = await getDoc(locale as Locale, slug);
  if (!doc) notFound();
  const t = await getTranslations("docs");
  const docs = listDocs(locale as Locale);
  const i = docs.findIndex((d) => d.slug === slug);
  const prev = docs[i - 1];
  const next = docs[i + 1];

  return (
    <div className={`container ${styles.layout}`}>
      <DocsNav docs={docs} current={slug} />
      <article className={styles.article}>
        <h1 className={styles.title}>{doc.title}</h1>
        <p className={styles.lede}>{doc.description}</p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
        <ClipPlayer key={slug} />
        <nav className={styles.pager} aria-label={t("nav")}>
          {prev ? (
            <Link href={`/docs/${prev.slug}`}>
              <span>{t("previous")}</span>
              <strong>{prev.title}</strong>
            </Link>
          ) : null}
          {next ? (
            <Link href={`/docs/${next.slug}`} className={styles.next}>
              <span>{t("next")}</span>
              <strong>{next.title}</strong>
            </Link>
          ) : null}
        </nav>
      </article>
      {doc.headings.length > 1 ? (
        <aside className={styles.toc} aria-label={t("onThisPage")}>
          <p>{t("onThisPage")}</p>
          <ul>
            {doc.headings.map((h) => (
              <li key={h.id} className={h.depth === 3 ? styles.sub : undefined}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
