import type { Locale } from "./routing";

/** Every namespace a locale has; one JSON file each under messages/<locale>/. */
export const NAMESPACES = ["meta", "nav", "footer", "badge", "mock", "home", "pricing", "features", "plans", "download", "auth", "docs", "changelog", "legal", "notFound", "brand"] as const;

export async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => [ns, (await import(`../../messages/${locale}/${ns}.json`)).default] as const),
  );
  return Object.fromEntries(entries);
}
