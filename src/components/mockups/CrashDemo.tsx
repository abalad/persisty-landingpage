"use client";

import { Power, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { buttonClass, ButtonIcon } from "@/components/site/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AgentGlyph, Chip, Rail, Terminal, TopBar, Window, cx, type AgentKind, type TermLine, type Tone } from "./parts";
import s from "./app.module.css";
import c from "./crash.module.css";

type Phase = "running" | "off" | "black" | "boot" | "report";

interface Row {
  name: string;
  detail: string;
  kind: AgentKind;
  outcome: "respawned" | "resumed";
  unverified?: boolean;
  reason: string;
}

/** How long each phase lasts before the next one. */
const SCRIPT: [Phase, number][] = [
  ["off", 620],
  ["black", 1500],
  ["boot", 1100],
  ["report", 0],
];

const ROW_STAGGER = 520;

export function CrashDemo() {
  const t = useTranslations("mock");
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>("running");
  const [settled, setSettled] = useState(0);
  const timers = useRef<number[]>([]);

  const review = t("sessions.review");
  const rows: Row[] = [
    { name: "api", detail: "Claude Code", kind: "claude", outcome: "resumed", reason: "claude --resume 8f2c41e0" },
    { name: "checkout", detail: "Claude Code", kind: "claude", outcome: "resumed", reason: "claude --resume 1b7d93aa" },
    { name: "dev", detail: "pnpm dev", kind: "shell", outcome: "respawned", reason: "pnpm dev" },
    { name: review, detail: "Codex", kind: "codex", outcome: "resumed", unverified: true, reason: "codex resume" },
  ];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStarted(true);
    setSettled(0);
    if (reduced) {
      setPhase("report");
      setSettled(rows.length);
      return;
    }
    let at = 0;
    for (const [p, ms] of SCRIPT) {
      timers.current.push(window.setTimeout(() => setPhase(p), at));
      at += ms;
    }
    for (let i = 1; i <= rows.length; i++) {
      timers.current.push(window.setTimeout(() => setSettled(i), at + 350 + i * ROW_STAGGER));
    }
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setStarted(false);
    setPhase("running");
    setSettled(0);
  }

  const done = phase === "report" && settled === rows.length;
  const lines = (t.raw("hero.lines") as TermLine[]).slice(0, 7);
  const showApp = phase === "running" || phase === "off" || phase === "report";

  const tabTone = (i: number): Tone => {
    if (phase !== "report") return i === 2 ? "ok" : "info";
    return i < settled ? (rows[i].unverified ? "warn" : "ok") : "neutral";
  };

  const summary = t("crash.summary", { recovered: rows.length, failed: 0, skipped: 0 });

  return (
    <div className={c.demo}>
      <div className={c.controls}>
        {started ? (
          <button type="button" className={buttonClass("secondary", "md")} onClick={reset} disabled={!done}>
            <ButtonIcon>
              <RotateCcw />
            </ButtonIcon>
            {t("crash.again")}
          </button>
        ) : (
          <button type="button" className={buttonClass("primary", "md")} onClick={run}>
            <ButtonIcon>
              <Power />
            </ButtonIcon>
            {t("crash.crashComputer")}
          </button>
        )}
        <span className={c.hint}>{t("crash.hint")}</span>
      </div>

      <Window label={t("crash.label")} designWidth={940}>
        <TopBar
          project="Rota"
          tabs={rows.map((r, i) => ({ name: r.name, kind: r.kind, tone: tabTone(i), active: i === 0 }))}
        />
        <div className={s.body}>
          <Rail projects={[{ project: "rota", active: true }, { project: "quintal" }, { project: "bussola" }, { project: "mare" }, { project: "pulso" }, { project: "vela" }]} />
          <div className={c.stage}>
            {showApp ? (
              <div
                key={phase === "report" ? "after" : "before"}
                className={cx(c.content, phase === "off" && c.off, phase === "report" && c.back)}
              >
                {phase === "report" ? (
                  <div className={c.report}>
                    <div className={c.reportHead}>
                      <span className={c.reportTitle}>{t("crash.report")}</span>
                    </div>
                    <p className={c.summary}>{done ? summary : ""}</p>
                    <table className={c.table}>
                      <tbody>
                        {rows.map((r, i) => (
                          <tr key={r.name}>
                            <td>
                              <span className={c.who}>
                                <AgentGlyph kind={r.kind} />
                                {r.name}
                                <small>{r.detail}</small>
                              </span>
                            </td>
                            <td>
                              {i < settled ? (
                                <span className={c.rowIn}>
                                  {outcomeChip(r)}
                                </span>
                              ) : (
                                <Chip tone="info" icon="recovering" label={t("states.recovering")} />
                              )}
                            </td>
                            <td className={cx(c.reason, s.mono)}>{i < settled ? r.reason : ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>
                    <div className={s.sessionHeader}>
                      <span className={s.sessionName}>
                        <AgentGlyph kind="claude" />
                        api
                      </span>
                      <Chip tone="info" icon="working" label={t("states.working")} />
                    </div>
                    <Terminal lines={lines} rows={11} />
                  </>
                )}
              </div>
            ) : null}

            {phase === "black" ? <div className={c.black}>{t("crash.black")}</div> : null}
            {phase === "boot" ? (
              <div className={c.black}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={c.bootIcon} src="/app-icon.png" alt="" />
                {t("crash.opening")}
              </div>
            ) : null}
          </div>
        </div>
      </Window>
      <p className="visually-hidden" aria-live="polite">
        {done ? summary : ""}
      </p>
    </div>
  );

  function outcomeChip(row: Row) {
    const label = t(`crash.outcome.${row.outcome}`) + (row.unverified ? ` (${t("crash.outcome.unverified")})` : "");
    return <Chip tone={row.unverified ? "warn" : "ok"} icon="done" label={label} />;
  }
}
