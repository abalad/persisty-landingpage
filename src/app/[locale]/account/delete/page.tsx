import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Overview } from "@/components/account/panels/Overview";

export async function generateMetadata({ params }: PageProps<"/[locale]/account/delete">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.meta" });
  return { title: t("account"), robots: { index: false } };
}

/** Where the phone app sends whoever wants to delete the account: My account with the dialog already open. */
export default function Page({ params }: PageProps<"/[locale]/account/delete">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <Overview openDelete />;
}
