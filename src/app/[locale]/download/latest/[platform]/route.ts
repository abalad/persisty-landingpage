import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { latestFor, PLATFORM_ORDER, primaryFile, type DesktopPlatform } from "@/lib/releases";
import { localizedPath } from "@/lib/seo";

const isPlatform = (p: string): p is DesktopPlatform => (PLATFORM_ORDER as string[]).includes(p);

/**
 * A link that always means "the newest build for this system", for READMEs,
 * e-mails and anyone sharing it. A system with no build yet, or one the site
 * does not know, gets the download page in the reader's language instead.
 */
export async function GET(_req: Request, { params }: RouteContext<"/[locale]/download/latest/[platform]">) {
  const { locale, platform } = await params;
  const files = isPlatform(platform) ? (latestFor(platform)?.files ?? []) : [];
  const file = primaryFile(files) ?? files[0];
  const to = file?.url ?? localizedPath(hasLocale(routing.locales, locale) ? locale : routing.defaultLocale, "/download");
  return new Response(null, { status: 307, headers: { Location: to } });
}
