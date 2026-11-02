import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { FaqSection } from "@/components/home/FaqSection";
import { Window } from "@/components/mockups/parts";
import { TeamBillingMock } from "@/components/mockups/TeamBillingMock";
import { AlsoList } from "@/components/plans/AlsoList";
import { PlanHero } from "@/components/plans/PlanHero";
import { PlanClosing, PlanCompare, Roadmap } from "@/components/plans/PlanParts";
import { PlanSection } from "@/components/plans/PlanSection";
import { Badge } from "@/components/site/Badge";
import type { FaqItem } from "@/components/site/Faq";
import type { Locale } from "@/i18n/routing";
import { featureHref, planById } from "@/lib/plans";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/team">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plans.team.meta" });
  return { title: t("title"), description: t("description"), alternates: alternatesFor(locale as Locale, "/team") };
}

const INDEX = [
  { anchor: "pro", icon: "accountRotation" },
  { anchor: "billing", icon: "teamBilling" },
  { anchor: "privacy", icon: "networkLog" },
];

export default function TeamPage({ params }: PageProps<"/[locale]/team">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("plans.team");
  const p = useTranslations("pricing.features");
  const f = useTranslations("features");
  const m = useTranslations("mock.teamBilling");
  const pro = planById("pro").features.filter((x) => x.status === "available");

  return (
    <>
      <PlanHero plan="team" index={INDEX} />
      <AlsoList
        id="pro"
        title={t("pro.title")}
        body={t("pro.body")}
        items={pro.map((x) => ({ id: x.id, name: p(x.id), line: f(`${x.id}.line`), href: featureHref("pro", x), badge: <Badge status="pro" /> }))}
      />
      <PlanSection
        id="billing"
        plan="team"
        title={t("billing.title")}
        body={t("billing.body")}
        diff={{ below: t("billing.below"), here: t("billing.here") }}
        link={{ href: "/docs/account-and-license", label: t("billing.link") }}
        narrow
      >
        <Window label={m("label")} designWidth={860}>
          <TeamBillingMock />
        </Window>
      </PlanSection>
      <PlanSection id="privacy" plan="team" title={t("privacy.title")} body={t("privacy.body")} link={{ href: "/security", label: t("privacy.link") }} />
      <Roadmap plan="team" />
      <PlanCompare plan="team" />
      <FaqSection title={t("faq.title")} items={t.raw("faq.items") as FaqItem[]} />
      <PlanClosing plan="team" />
    </>
  );
}
