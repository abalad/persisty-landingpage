import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { FaqSection } from "@/components/home/FaqSection";
import { AccountsMock } from "@/components/mockups/AccountsMock";
import { Window } from "@/components/mockups/parts";
import { ProWindow, type ProPanelId } from "@/components/mockups/ProPanels";
import { AlsoList } from "@/components/plans/AlsoList";
import { PlanHero } from "@/components/plans/PlanHero";
import { PlanClosing, PlanCompare, Roadmap } from "@/components/plans/PlanParts";
import { PlanSection } from "@/components/plans/PlanSection";
import { TriedBar } from "@/components/plans/TriedBar";
import type { FaqItem } from "@/components/site/Faq";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/pro">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plans.pro.meta" });
  return { title: t("title"), description: t("description"), alternates: alternatesFor(locale as Locale, "/pro") };
}

/** Section id → the window that shows it (the accounts screen has its own). */
const SECTIONS: { anchor: string; icon: string; panel?: ProPanelId; docs: string }[] = [
  { anchor: "accounts", icon: "accountRotation", docs: "/docs/ai-accounts" },
  { anchor: "queue", icon: "requestQueue", panel: "queue", docs: "/docs/pro" },
  { anchor: "restore-points", icon: "restorePoints", panel: "restore", docs: "/docs/pro" },
  { anchor: "verify", icon: "verifyOnFinish", panel: "verify", docs: "/docs/pro" },
  { anchor: "worktree", icon: "worktrees", panel: "worktree", docs: "/docs/pro" },
];

export default function ProPage({ params }: PageProps<"/[locale]/pro">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("plans.pro");
  const c = useTranslations("plans.common");
  const p = useTranslations("pricing.features");
  const f = useTranslations("features");
  const m = useTranslations("mock");

  return (
    <>
      <TriedBar />
      <PlanHero plan="pro" index={SECTIONS} />
      {SECTIONS.map((s) => (
        <PlanSection
          key={s.anchor}
          id={s.anchor}
          plan="pro"
          title={t(`sections.${s.anchor}.title`)}
          body={t(`sections.${s.anchor}.body`)}
          diff={{ below: t(`sections.${s.anchor}.below`), here: t(`sections.${s.anchor}.here`) }}
          link={{ href: s.docs, label: c("docs") }}
          narrow={!s.panel}
        >
          {s.panel ? (
            <ProWindow panel={s.panel} />
          ) : (
            <Window label={m("accounts.label")} designWidth={860}>
              <AccountsMock />
            </Window>
          )}
        </PlanSection>
      ))}
      <AlsoList
        id="also"
        title={t("alsoTitle")}
        body={t("alsoBody")}
        items={[
          { id: "offlineLicense", anchor: "license", name: p("offlineLicense"), line: f("offlineLicense.line") },
          { id: "persistentSessions", name: t("allFree.name"), line: t("allFree.line"), href: "/free" },
        ]}
      />
      <Roadmap plan="pro" />
      <PlanCompare plan="pro" />
      <FaqSection title={t("faq.title")} items={t.raw("faq.items") as FaqItem[]} />
      <PlanClosing plan="pro" />
    </>
  );
}
