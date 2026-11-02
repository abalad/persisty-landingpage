import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { BillingPanel } from "@/components/account/panels/BillingPanel";

export async function generateMetadata({ params }: PageProps<"/[locale]/account">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.meta" });
  return { title: t("account"), robots: { index: false } };
}

export default function Page({ params }: PageProps<"/[locale]/account">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <BillingPanel />;
}
