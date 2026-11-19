import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = routing.locales.flatMap((l) => [localizedPath(l, "/account"), localizedPath(l, "/sign-in"), localizedPath(l, "/account-deleted")]);
  return {
    rules: { userAgent: "*", allow: "/", disallow: privatePaths },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
