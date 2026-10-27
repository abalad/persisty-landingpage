"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/pricing";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTimeline } from "@/hooks/useTimeline";
import { Buddy } from "./Buddy";
import { focusShot, READ_ZOOM } from "./tour";
import { TOUR_QUERY, WindowTour, type TourChapter, type TourCopy } from "./WindowTour";
import { Chip, CommandButtons, Rail, SessionHeader, StatusBar, Terminal, TopBar, Window, WorkspaceStrip, type TermLine } from "./parts";
import s from "./app.module.css";

/** ms per step: the prompt, each tool call and result, then the answer held for a while. */
const STEPS = [1400, 800, 650, 950, 650, 1200, 750, 5600];
const LAST = STEPS.length - 1;

/** On a phone: the whole window, the agent at work, then where it waits for you, the workspaces and the quota. */
const TOUR: TourChapter[] = [
  { key: "overview", ms: 2600 },
  {
    key: "working",
    ms: 8200,
    frame: (view, stage, part) => {
      const header = part(s.sessionHeader);
      const terminal = part(s.terminal);
      if (!header || !terminal) return null;
      return focusShot(view, stage, { x: 0, y: header.y, w: terminal.w, h: terminal.y + terminal.h - header.y }, READ_ZOOM, "start", 0);
    },
  },
  {
    key: "waiting",
    ms: 2600,
    // Up close, at the app's own size: the tab's dot, the project's badge and the chip all say it.
    frame: (view, stage, part) => {
      const header = part(s.sessionHeader);
      return header ? focusShot(view, stage, { x: 0, y: 0, w: view.w, h: header.y + header.h }, 1, "start", 0) : null;
    },
  },
  {
    key: "workspaces",
    ms: 3000,
    // The card that wants something from you, with its neighbours at the edges.
    frame: (view, stage, part) => {
      const card = part(s.cardActive);
      return card ? focusShot(view, stage, card, READ_ZOOM) : null;
    },
  },
  {
    key: "usage",
    ms: 2600,
    // Wide enough for the model, the spend and both quota bars.
    frame: (view, stage, part) => {
      const status = part(s.statusbar);
      return status ? focusShot(view, stage, status, 0.68, "start", 8) : null;
    },
  },
];

export function HeroApp() {
  const t = useTranslations("mock");
  const toured = useMediaQuery(TOUR_QUERY);
  if (!toured) return <HeroDesktop />;
  return (
    <WindowTour
      copy={t.raw("tours.hero") as TourCopy}
      chapters={TOUR}
      steps={{ chapter: "working", durations: STEPS }}
      render={(step, animate) => <HeroWindow step={step} animate={animate} />}
    />
  );
}

function HeroDesktop() {
  const reduced = useReducedMotion();
  const [ref, visible] = useInView<HTMLDivElement>();
  const live = useTimeline(STEPS, visible && !reduced, LAST);
  return (
    <div ref={ref}>
      <HeroWindow step={reduced ? LAST : live} animate={!reduced} />
    </div>
  );
}

/** The Rota window at one step of its story. */
function HeroWindow({ step, animate }: { step: number; animate: boolean }) {
  const t = useTranslations("mock");
  const locale = useLocale() as Locale;
  const lines = t.raw("hero.lines") as TermLine[];
  const done = step === LAST;
  const shown = lines.slice(0, step + 1);
  const five = 18 + step * 0.9;

  return (
    <Window label={t("hero.label")}>
      <TopBar
        project="Rota"
        tabs={[
          { name: "api", kind: "claude", tone: done ? "warn" : "info", active: true },
          { name: "checkout", kind: "claude", tone: "warn" },
          { name: "dev", kind: "shell", tone: "ok" },
        ]}
        right={<CommandButtons command="dev" />}
      />
      <div className={s.body}>
        <Rail projects={[{ letter: "R", active: true, dot: "warn" }, { letter: "Q", dot: "info" }, { letter: "B" }]} />
        <div className={s.main}>
          <SessionHeader
            name="api"
            kind="claude"
            branch="main"
            status={done ? <Chip tone="warn" icon="waiting" label={t("states.waiting")} /> : <Chip tone="info" icon="working" label={t("states.working")} />}
          />
          <Terminal lines={shown} rows={12} caret={done} animateFrom={animate ? step : Infinity}>
            <Buddy mood={done ? "done" : "working"} />
          </Terminal>
          <WorkspaceStrip
            title={t("workspaces.title")}
            count={3}
            addLabel={t("workspaces.add")}
            cards={[
              {
                name: "rota-api",
                branch: "main",
                changes: "±3",
                tone: done ? "warn" : "info",
                rows: [
                  { name: "api", kind: "claude", state: done ? t("states.waiting") : t("states.working"), tone: done ? "warn" : "info" },
                  { name: t("sessions.review"), kind: "codex", state: t("states.idle"), tone: "neutral" },
                ],
                footer: [t("workspaces.active", { count: 2 }), t("workspaces.now")],
              },
              {
                name: "rota-app",
                branch: "feat/checkout",
                tone: "warn",
                active: true,
                rows: [
                  { name: "checkout", kind: "claude", state: t("states.permission"), tone: "warn" },
                  { name: "dev", kind: "shell", state: t("states.running"), tone: "ok" },
                ],
                footer: [t("workspaces.active", { count: 2 }), t("workspaces.minutes", { count: 2 })],
              },
              {
                name: "rota-site",
                branch: "main",
                tone: "neutral",
                rows: [],
                empty: t("workspaces.none"),
                footer: ["", ""],
              },
            ]}
          />
          <StatusBar
            spec={{
              model: "Opus 5.5",
              spendLabel: t("status.spend"),
              spend: formatPrice(locale, Math.round(31 + step * 1.7)),
              ctxLabel: t("status.ctx"),
              ctx: `${38 + step}%`,
              five,
              seven: 53,
              right: "ana@example.com · Max · ~/projetos/rota/api",
            }}
          />
        </div>
      </div>
    </Window>
  );
}
