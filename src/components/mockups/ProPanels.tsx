"use client";

import { ArrowUpToLine, Check, ChevronRight, Clock, FileCode2, GripVertical, Loader2, Paperclip, Pause, Pencil, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Chip, SessionHeader, Terminal, ToolBar, Window, cx, type TermLine } from "./parts";
import s from "./app.module.css";
import x from "./extra.module.css";

/** The Pro features as the 0.10.0 app shows them: two tools of the session's bar, the workspace's commands menu and the close prompt of a session in its own folder. */
export type ProPanelId = "queue" | "restore" | "verify" | "worktree";

interface FileChange {
  name: string;
  dir: string;
  kind: "M" | "A" | "D";
}

/** What the side area of the window shows for one Pro feature. */
export function ProPanelBody({ panel }: { panel: ProPanelId }) {
  const t = useTranslations("mock.pro");
  const m = useTranslations("mock");

  if (panel === "queue") {
    return (
      <div className={x.queue}>
        <span className={x.queueHead}>
          <span className={x.queueState}>
            <Loader2 aria-hidden="true" className={s.spin} />
            {m("states.working")}
          </span>
          <span className={x.ghostBtn}>
            <Pause aria-hidden="true" />
            {t("queue.pause")}
          </span>
        </span>
        <span className={x.label}>{t("queue.next", { count: 3 })}</span>
        <QueueCard n={1} next text={t("queue.item1")} when={t("queue.goesAt", { time: "22:53" })} badge={t("queue.nextBadge")} images />
        <QueueCard n={2} text={t("queue.item2")} when={t("queue.goesIdle")} waits={t("queue.waitsForAt", { time: "22:53" })} />
        <QueueCard n={3} text={t("queue.item3")} when={t("queue.goesWindow", { time: "23:53" })} waits={t("queue.waitsForAt", { time: "22:53" })} />
        <span className={x.queueSent}>
          <ChevronRight aria-hidden="true" />
          {t("queue.sent", { count: 3 })}
        </span>
        <span className={x.queueComposer}>{t("queue.placeholder")}</span>
        <span className={x.queueFoot}>
          <Paperclip aria-hidden="true" />
          <span className={x.queueWhen}>
            <Clock aria-hidden="true" />
            {t("queue.goesIdle")}
          </span>
          <span className={x.label}>{t("queue.pasteHint")}</span>
          <span className={x.btn} style={{ marginLeft: "auto" }}>
            {t("queue.add")} ⌘↵
          </span>
        </span>
      </div>
    );
  }

  if (panel === "restore") {
    const files = t.raw("restore.files") as FileChange[];
    return (
      <>
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

/** One request waiting its turn, as the 0.10.0 queue shows it: its number, the text, when it goes and why it waits. */
function QueueCard({ n, next, text, when, waits, badge, images }: { n: number; next?: boolean; text: string; when: string; waits?: string; badge?: string; images?: boolean }) {
  return (
    <span className={x.queueCard}>
      <GripVertical aria-hidden="true" className={x.queueGrip} />
      <span className={cx(x.queueNum, next && x.queueNumNext)}>{n}</span>
      <span className={x.queueText}>
        <span className={x.queueTitle}>{text}</span>
        {images ? (
          <span className={x.queueThumbs}>
            <span />
            <span />
          </span>
        ) : null}
        <span className={x.queueMeta}>
          {badge ? <span className={x.queueBadge}>{badge}</span> : null}
          <Clock aria-hidden="true" />
          {when}
          {waits ? <span>{waits}</span> : null}
        </span>
      </span>
      <span className={x.queueActions}>
        <Pencil aria-hidden="true" />
        <ArrowUpToLine aria-hidden="true" />
        <X aria-hidden="true" />
      </span>
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
      {/* The queue is a chat: taller, so the box to write fits under the three waiting requests. */}
      <div className={cx(x.split, x.splitBar, x.splitFixed)} style={{ ["--side" as string]: 440, ["--h" as string]: panel === "queue" ? 540 : 440 }}>
        <div className={x.splitMain}>
          <Terminal lines={lines} rows={12} />
        </div>
        <div className={x.sideFill}>
          <div className={x.panelTitle}>{inPanel ? t(`tabs.${panel}`) : panel === "verify" ? t("verify.menuTitle") : t("worktree.title")}</div>
          <div className={cx(x.panelBody, panel === "queue" && x.panelBodyFull)} key={panel}>
            <ProPanelBody panel={panel} />
          </div>
        </div>
        <ToolBar active={panel === "queue" ? "queue" : panel === "restore" ? "restore" : undefined} changes={3} queue={3} />
      </div>
    </Window>
  );
}
