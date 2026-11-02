import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { jetbrains, mona } from "@/app/fonts";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

type Messages = Record<string, Record<string, unknown>>;

/** Only what interactive components read goes to the browser. */
function clientMessages(all: Messages): Messages {
  const { nav, badge, mock, download, auth, home, pricing, features, plans } = all;
  return {
    nav,
    badge,
    mock,
    download,
    auth,
    features,
    home: { hero: (home as Messages).hero },
    pricing: { checkout: (pricing as Messages).checkout, features: (pricing as Messages).features, plans: (pricing as Messages).plans },
    plans: { common: { tried: ((plans as Messages).common as Messages).tried } },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: "%s · Persisty" },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = clientMessages(await getMessages());

  return (
    <html lang={locale} className={`${mona.variable} ${jetbrains.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
