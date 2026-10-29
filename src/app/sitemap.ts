import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { listDocs } from "@/lib/content";
import { localizedPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const PAGES = ["/", "/pricing", "/download", "/download/versions", "/docs", "/changelog", "/brand", "/security", "/privacy", "/terms"];

/** Every public page in each language, each entry listing its translations. */
export default function sitemap(): MetadataRoute.Sitemap {
  const docs = listDocs(routing.defaultLocale).map((d) => `/docs/${d.slug}`);
  return [...PAGES, ...docs].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}${localizedPath(l, path)}`])) },
    })),
  );
}
