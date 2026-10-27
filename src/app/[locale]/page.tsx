import { useLocale, useTranslations } from "next-intl";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { AgentsStrip } from "@/components/home/AgentsStrip";
import { Closing } from "@/components/home/Closing";
import { Companies } from "@/components/home/Companies";
import { FaqSection } from "@/components/home/FaqSection";
import { Feature } from "@/components/home/Feature";
import { Hero } from "@/components/home/Hero";
import { Studio } from "@/components/home/Studio";
import { AccountsMock } from "@/components/mockups/AccountsMock";
import { CrashDemo } from "@/components/mockups/CrashDemo";
import { NetworkMock } from "@/components/mockups/NetworkMock";
import { ProTabs } from "@/components/mockups/ProTabs";
import { EditorWindow, ProjectsWindow, StatesWindow } from "@/components/mockups/tours";
import { Window } from "@/components/mockups/parts";
import { PlanCards } from "@/components/pricing/PlanCards";
import { Badge } from "@/components/site/Badge";
import { ButtonLink } from "@/components/site/Button";
import type { FaqItem } from "@/components/site/Faq";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/pricing";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor(locale as Locale, "/") };
}

export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");
  const m = useTranslations("mock");
  const locale = useLocale() as Locale;
  const pro = <Badge status="pro" />;

  return (
    <>
      <Hero />
      <AgentsStrip />
      <Studio />
      <div id="product" />
      <Feature id="recovery" title={t("recovery.title")} body={t("recovery.body")} link={{ href: "/docs/sessions-and-recovery", label: t("recovery.link") }}>
        <CrashDemo />
      </Feature>
      <Feature id="projects" title={t("projects.title")} body={t("projects.body")} link={{ href: "/docs/projects-and-workspaces", label: t("projects.link") }}>
        <ProjectsWindow />
      </Feature>
      <Feature id="accounts" title={t("accounts.title")} body={t("accounts.body")} meta={pro} link={{ href: "/docs/ai-accounts", label: t("accounts.link") }} narrow>
        <Window label={m("accounts.label")} designWidth={860}>
          <AccountsMock />
        </Window>
      </Feature>
      <Feature id="states" title={t("states.title")} body={t("states.body")} link={{ href: "/docs/agents", label: t("states.link") }}>
        <StatesWindow />
      </Feature>
      <Feature id="pro" title={t("pro.title")} body={t("pro.body")} meta={pro} link={{ href: "/docs/pro", label: t("pro.link") }}>
        <ProTabs />
      </Feature>
      <Feature id="editor" title={t("editor.title")} body={t("editor.body")} link={{ href: "/docs/editor-and-git", label: t("editor.link") }}>
        <EditorWindow />
      </Feature>
      <Feature id="privacy" title={t("privacy.title")} body={t("privacy.body")} link={{ href: "/security", label: t("privacy.link") }} narrow>
        <Window label={m("network.label")} designWidth={860}>
          <NetworkMock />
        </Window>
      </Feature>
      <Companies />
      <Feature id="pricing" title={t("pricing.title")} body={t("pricing.body", { price: formatPrice(locale, 990) })}>
        <PlanCards />
        <div style={{ marginTop: 28 }}>
          <ButtonLink href="/pricing" variant="secondary">
            {t("pricing.cta")}
          </ButtonLink>
        </div>
      </Feature>
      <FaqSection title={t("faq.title")} items={t.raw("faq.items") as FaqItem[]} />
      <Closing />
    </>
  );
}
