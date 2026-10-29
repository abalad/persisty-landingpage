import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { listChangelog } from "@/lib/content";
import { localizedPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET(_req: Request, { params }: RouteContext<"/[locale]/changelog/rss">) {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "changelog" });
  const entries = await listChangelog(locale);
  const page = `${SITE_URL}${localizedPath(locale, "/changelog")}`;
  const items = entries
    .map(
      (e) => `    <item>
      <title>${escape(`${e.version} · ${e.title}`)}</title>
      <link>${page}#${e.id}</link>
      <guid isPermaLink="false">${e.version}</guid>
      <pubDate>${new Date(`${e.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(e.html)}</description>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(t("feedTitle"))}</title>
    <link>${page}</link>
    <description>${escape(t("meta.description"))}</description>
    <language>${locale}</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
