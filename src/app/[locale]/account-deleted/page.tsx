import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Deleted } from "@/components/account/delete/Deleted";

export async function generateMetadata({ params }: PageProps<"/[locale]/account-deleted">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.meta" });
  return { title: t("deleted"), robots: { index: false } };
}

export default function Page({ params }: PageProps<"/[locale]/account-deleted">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return (
    <div className="container">
      <Deleted />
    </div>
  );
}
