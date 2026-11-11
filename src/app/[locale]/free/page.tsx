import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use, type ReactNode } from "react";
import { FaqSection } from "@/components/home/FaqSection";
import { CrashDemo } from "@/components/mockups/CrashDemo";
import { NetworkMock } from "@/components/mockups/NetworkMock";
import { Window } from "@/components/mockups/parts";
import { BoardWindow } from "@/components/mockups/BoardMock";
import { EditorWindow, ProjectsWindow } from "@/components/mockups/tours";
import { MascotStage } from "@/components/mascot/MascotStage";
import { AlsoList } from "@/components/plans/AlsoList";
import { PlanHero } from "@/components/plans/PlanHero";
import { PlanClosing, PlanCompare, Roadmap } from "@/components/plans/PlanParts";
import { PlanSection } from "@/components/plans/PlanSection";
import type { FaqItem } from "@/components/site/Faq";
import type { Locale } from "@/i18n/routing";
import { planById } from "@/lib/plans";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/free">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plans.free.meta" });
  return { title: t("title"), description: t("description"), alternates: alternatesFor(locale as Locale, "/free") };
}

/** The free features that have a window on the home page get one here too; the rest are listed. */
const SECTIONS = [
  { anchor: "recovery", icon: "recovery", docs: "/docs/sessions-and-recovery" },
  { anchor: "states", icon: "board", docs: "/docs/agents" },
  { anchor: "projects", icon: "projects", docs: "/docs/projects-and-workspaces" },
  { anchor: "mascot", icon: "mascot", docs: "/docs/agents" },
  { anchor: "editor", icon: "editorGit", docs: "/docs/editor-and-git" },
  { anchor: "privacy", icon: "networkLog", docs: "/security" },
] as const;

const LISTED = new Set(["usage", "git", "notifications", "voice", "issues", "agents", "offline"]);

export default function FreePage({ params }: PageProps<"/[locale]/free">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("plans.free");
  const h = useTranslations("home");
  const p = useTranslations("pricing.features");
  const f = useTranslations("features");
  const m = useTranslations("mock");

  const windows: Record<(typeof SECTIONS)[number]["anchor"], ReactNode> = {
    recovery: <CrashDemo />,
    projects: <ProjectsWindow />,
    states: <BoardWindow />,
    mascot: <MascotStage boardHref="#states" />,
    editor: <EditorWindow />,
    privacy: (
      <Window label={m("network.label")} designWidth={860}>
        <NetworkMock />
      </Window>
    ),
  };
  const listed = planById("free").features.filter((x) => x.status === "available" && x.anchor && LISTED.has(x.anchor));

  return (
    <>
      <PlanHero plan="free" index={[...SECTIONS]} />
      {SECTIONS.map((s) => (
        <PlanSection key={s.anchor} id={s.anchor} plan="free" title={h(`${s.anchor}.title`)} body={h(`${s.anchor}.body`)} link={{ href: s.anchor === "mascot" ? `${s.docs}#${h("mascot.anchor")}` : s.docs, label: h(`${s.anchor}.link`) }} narrow={s.anchor === "privacy"}>
          {windows[s.anchor]}
        </PlanSection>
      ))}
      <AlsoList
        id="also"
        title={t("alsoTitle")}
        body={t("alsoBody")}
        items={listed.map((x) => ({ id: x.id, anchor: x.anchor, name: p(x.id), line: f(`${x.id}.line`) }))}
      />
      <Roadmap plan="free" />
      <PlanCompare plan="free" />
      <FaqSection title={t("faq.title")} items={t.raw("faq.items") as FaqItem[]} />
      <PlanClosing plan="free" />
    </>
  );
}
