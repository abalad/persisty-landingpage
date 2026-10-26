"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/pricing";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTimeline } from "@/hooks/useTimeline";
import { HeroTour } from "./HeroTour";
import { Chip, CommandButtons, Rail, SessionHeader, StatusBar, Terminal, TopBar, Window, WorkspaceStrip, type TermLine } from "./parts";
import s from "./app.module.css";

/** ms per step: the prompt, each tool call and result, then the answer held for a while. */
const STEPS = [1400, 800, 650, 950, 650, 1200, 750, 5600];
const LAST = STEPS.length - 1;

/** Below this width the window is toured instead: drawn at desktop size, a camera moving over it. */
const TOUR_QUERY = "(max-width: 680px)";

export function HeroApp() {
  return useMediaQuery(TOUR_QUERY) ? <HeroTour steps={STEPS} render={(step, animate) => <HeroWindow step={step} animate={animate} />} /> : <HeroDesktop />;
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
          <Terminal lines={shown} rows={12} caret={done} animateFrom={animate ? step : Infinity} />
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
