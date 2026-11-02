"use client";

import { Check, Code2, FileCode2, GitCommitHorizontal, Info, ListPlus, NotebookPen, Plus, Search, ShieldCheck, Undo2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Chip, SessionHeader, Terminal, Window, cx, type TermLine } from "./parts";
import x from "./extra.module.css";

/** The Pro features as the 0.9.0 app shows them: two side-panel tabs, the workspace's commands menu and the close prompt of a session in its own folder. */
export type ProPanelId = "queue" | "restore" | "verify" | "worktree";

/** The side panel's tabs, in the app's order (0.9.0). */
const PANEL_TABS: { id: string; icon: ReactNode }[] = [
  { id: "changes", icon: <GitCommitHorizontal /> },
  { id: "restore", icon: <Undo2 /> },
  { id: "queue", icon: <ListPlus /> },
  { id: "code", icon: <Code2 /> },
  { id: "search", icon: <Search /> },
  { id: "notes", icon: <NotebookPen /> },
  { id: "details", icon: <Info /> },
];

interface FileChange {
  name: string;
  dir: string;
  kind: "M" | "A" | "D";
}

/** What the side area of the window shows for one Pro feature. */
export function ProPanelBody({ panel }: { panel: ProPanelId }) {
  const t = useTranslations("mock.pro");

  if (panel === "queue") {
    return (
      <>
        <span className={x.panelHeading}>{t("tabs.queue")}</span>
        <span className={x.label}>{t("queue.text")}</span>
        <span className={cx(x.field, x.fieldTall)}>{t("queue.draft")}</span>
        <span className={x.label}>{t("queue.when")}</span>
        <span className={x.radio}>{t("queue.idle")}</span>
        <span className={cx(x.radio, x.radioOn)}>{t("queue.window")}</span>
        <span className={x.radio}>{t("queue.at")}</span>
        <span className={x.btnRow}>
          <span className={x.btn}>{t("queue.add")}</span>
        </span>
        <span className={x.label}>{t("queue.waiting")}</span>
        <QueueItem title={t("queue.item1")} meta={t("queue.item1When")} />
        <QueueItem title={t("queue.item2")} meta={t("queue.item2When")} />
      </>
    );
  }

  if (panel === "restore") {
    const files = t.raw("restore.files") as FileChange[];
    return (
      <>
        <span className={x.panelHeading}>{t("tabs.restore")}</span>
        <span className={cx(x.listItem, x.listItemOn)}>
          <span className={x.listTitle}>{t("restore.point1")}</span>
          <span className={x.listSub}>{t("restore.point1Time")}</span>
          <span className={x.note}>{t("restore.point1Summary")}</span>
          {files.map((f) => (
            <span key={f.name} className={x.changeRow}>
              <FileCode2 aria-hidden="true" style={{ width: "calc(13 * var(--u))", height: "calc(13 * var(--u))", flex: "none" }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                {f.name} <span className={x.note}>{f.dir}</span>
              </span>
              <b style={{ color: f.kind === "A" ? "var(--color-ok)" : f.kind === "D" ? "var(--color-danger)" : "var(--color-warn)" }}>{f.kind}</b>
            </span>
          ))}
          <span className={x.btnRow}>
            <span className={cx(x.btn, x.btnGhost)}>{t("restore.action")}</span>
          </span>
        </span>
        <span className={x.listItem}>
          <span className={x.listTitle}>{t("restore.point2")}</span>
          <span className={x.listSub}>{t("restore.point2Time")}</span>
        </span>
        <span className={x.listItem}>
          <span className={x.listTitle}>{t("restore.point3")}</span>
          <span className={x.listSub}>{t("restore.point3Time")}</span>
        </span>
      </>
    );
  }

  if (panel === "verify") {
    const commands = t.raw("verify.commands") as string[];
    return (
      <>
        <span className={x.panelHeading}>{t("verify.menuTitle")}</span>
        <span className={x.label}>{t("verify.group")}</span>
        {commands.map((c, i) => (
          <span key={c} className={cx(x.radio, i === 0 && x.radioOn)} style={{ fontFamily: "var(--font-code)" }}>
            {c}
          </span>
        ))}
        <span className={x.divider} />
        <span className={cx(x.listItem, x.listItemOn)}>
          <span className={x.listTitle} style={{ display: "flex", alignItems: "center", gap: "calc(6 * var(--u))" }}>
            <Check aria-hidden="true" style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))", color: "var(--color-accent)" }} />
            {t("verify.menu", { name: commands[0] })}
          </span>
          <span className={x.listSub}>{t("verify.menuHint")}</span>
        </span>
        <span className={x.radio} style={{ opacity: 0.7 }}>
          <Plus aria-hidden="true" style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))" }} />
          {t("verify.addCommand")}
        </span>
      </>
    );
  }

  return (
    <>
      <span className={x.panelHeading}>{t("worktree.title")}</span>
      <span className={x.note}>{t("worktree.process")}</span>
      <span className={x.note}>{t("worktree.dirty")}</span>
      <span className={x.note}>{t("worktree.ahead")}</span>
      <span className={x.btnRow} style={{ flexWrap: "wrap", gap: "calc(6 * var(--u))" }}>
        <span className={cx(x.btn, x.btnGhost)}>{t("worktree.discard")}</span>
        <span className={cx(x.btn, x.btnGhost)}>{t("worktree.remove")}</span>
        <span className={x.btn}>{t("worktree.keep")}</span>
      </span>
      <span className={x.note}>{t("worktree.stays")}</span>
    </>
  );
}

function QueueItem({ title, meta }: { title: string; meta: string }) {
  return (
    <span className={x.listItem}>
      <span className={x.listTitle} style={{ display: "flex", justifyContent: "space-between", gap: "calc(8 * var(--u))" }}>
        {title}
        <X aria-hidden="true" style={{ width: "calc(12 * var(--u))", height: "calc(12 * var(--u))", flex: "none", color: "var(--color-fg-subtle)" }} />
      </span>
      <span className={x.listSub}>{meta}</span>
    </span>
  );
}

/** The whole window for one Pro feature: the session, its terminal and the side area showing the feature. */
export function ProWindow({ panel }: { panel: ProPanelId }) {
  const t = useTranslations("mock.pro");
  const m = useTranslations("mock");
  const lines = panel === "verify" ? (t.raw("verify.lines") as TermLine[]) : (m.raw("hero.lines") as TermLine[]);
  const inPanel = panel === "queue" || panel === "restore";

  return (
    <Window label={`${t("label")} ${t(`tabs.${panel}`)}`} designWidth={1060}>
      <SessionHeader
        name="api"
        kind="claude"
        branch={panel === "worktree" ? t("worktree.branchValue") : "main"}
        status={
          panel === "verify" ? (
            <>
              <Chip tone="ok" icon="waiting" label={m("states.waiting")} />
              <Chip tone="ok" icon="done" label={`${t("verify.chip")} · ${t("verify.passed")}`} />
            </>
          ) : panel === "worktree" ? (
            <>
              <Chip tone="neutral" label={t("worktree.badge")} plain />
              <Chip tone="ok" icon="idle" label={m("states.idle")} />
            </>
          ) : (
            <Chip tone="info" icon="working" label={m("states.working")} />
          )
        }
      />
      <div className={cx(x.split, x.splitFixed)} style={{ ["--side" as string]: 440, ["--h" as string]: 440 }}>
        <div className={x.splitMain}>
          <Terminal lines={lines} rows={12} />
        </div>
        <div className={x.sideFill}>
          {inPanel ? (
            <div className={x.panelTabs}>
              {PANEL_TABS.map((tb) => (
                <span key={tb.id} className={cx(x.panelTab, tb.id === panel && x.panelTabOn)}>
                  {tb.icon}
                </span>
              ))}
            </div>
          ) : (
            <div className={x.panelTabs}>
              <span className={cx(x.panelTab, x.panelTabOn)}>{panel === "verify" ? <ShieldCheck /> : <X />}</span>
            </div>
          )}
          <div className={x.panelBody} key={panel}>
            <ProPanelBody panel={panel} />
          </div>
        </div>
      </div>
    </Window>
  );
}
