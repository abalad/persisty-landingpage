import { FolderGit2, GitBranch, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AgentGlyph, Chip, Meter, cx } from "@/components/mockups/parts";
import styles from "./Glimpse.module.css";

/** Features that have a glimpse: a small, real piece of the app's (or the account's) interface. */
const GLIMPSES = ["accountRotation", "requestQueue", "restorePoints", "verifyOnFinish", "worktrees", "recovery", "teamBilling"] as const;
export type GlimpseId = (typeof GLIMPSES)[number];

export function hasGlimpse(id: string): id is GlimpseId {
  return (GLIMPSES as readonly string[]).includes(id);
}

interface Row {
  name: string;
  note: string;
  tone?: "ok" | "warn";
}

/**
 * A cut from the interface at the app's own scale (13px text, its chips and
 * meters), for the features menu and the account. Decorative to screen
 * readers: the feature's name and line sit next to it as text.
 */
export function Glimpse({ id }: { id: GlimpseId }) {
  const g = useTranslations("mock.glimpse");
  const pro = useTranslations("mock.pro");

  return (
    <div className={styles.glimpse} aria-hidden="true">
      {id === "accountRotation" ? (
        <>
          <div className={styles.row}>
            <AgentGlyph kind="claude" />
            <span className={styles.name}>ana@rota.dev</span>
            <Meter label="5 h" value={34} />
          </div>
          <div className={styles.row}>
            <AgentGlyph kind="claude" />
            <span className={styles.name}>ana@empresa.co</span>
            <Meter label="5 h" value={92} />
          </div>
          <div className={styles.foot}>
            <Chip tone="ok" icon="done" label={g("auto")} />
          </div>
        </>
      ) : null}

      {id === "requestQueue" ? (
        <>
          <span className={styles.label}>{pro("queue.waiting")}</span>
          <QueueRow title={pro("queue.item1")} when={pro("queue.item1When")} />
          <QueueRow title={pro("queue.item2")} when={pro("queue.item2When")} />
        </>
      ) : null}

      {id === "restorePoints" ? (
        <>
          <div className={cx(styles.item, styles.itemOn)}>
            <span className={styles.name}>{pro("restore.point1")}</span>
            <span className={styles.meta}>{pro("restore.point1Time")}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.name}>{pro("restore.point2")}</span>
            <span className={styles.meta}>{pro("restore.point2Time")}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.name}>{pro("restore.point3")}</span>
            <span className={styles.meta}>{pro("restore.point3Time")}</span>
          </div>
        </>
      ) : null}

      {id === "verifyOnFinish" ? (
        <>
          <div className={styles.row}>
            <Chip tone="ok" icon="done" label={`${pro("verify.chip")} · ${pro("verify.passed")}`} />
          </div>
          <code className={styles.code}>$ pnpm test</code>
          <code className={cx(styles.code, styles.codeMuted)}>Tests  26 passed (26)</code>
          <span className={styles.meta}>{pro("verify.menuHint")}</span>
        </>
      ) : null}

      {id === "worktrees" ? (
        <>
          <div className={styles.row}>
            <GitBranch className={styles.icon} />
            <code className={styles.code}>{pro("worktree.branchValue")}</code>
            <Chip tone="neutral" label={pro("worktree.badge")} plain />
          </div>
          <div className={styles.row}>
            <FolderGit2 className={styles.icon} />
            <code className={cx(styles.code, styles.codeMuted)}>{g("worktreeFolder")}</code>
          </div>
          <span className={styles.meta}>{pro("worktree.stays")}</span>
        </>
      ) : null}

      {id === "recovery" ? (
        <>
          <span className={styles.label}>{g("recoveryTitle")}</span>
          {(g.raw("recoveryRows") as Row[]).map((r) => (
            <div key={r.name} className={styles.row}>
              <span className={styles.name}>{r.name}</span>
              <Chip tone={r.tone ?? "ok"} icon={r.tone === "warn" ? "permission" : "done"} label={r.note} />
            </div>
          ))}
        </>
      ) : null}

      {id === "teamBilling" ? (
        <>
          <div className={styles.row}>
            <span className={styles.name}>{g("teamName")}</span>
            <span className={styles.meta}>{g("teamSeats")}</span>
          </div>
          {(g.raw("teamPeople") as Row[]).map((r) => (
            <div key={r.name} className={styles.row}>
              <span className={styles.name}>{r.name}</span>
              <span className={styles.meta}>{r.note}</span>
            </div>
          ))}
          <span className={styles.meta}>{g("teamInvite")}</span>
        </>
      ) : null}
    </div>
  );
}

function QueueRow({ title, when }: { title: string; when: string }) {
  return (
    <div className={styles.item}>
      <span className={styles.name}>
        {title}
        <X className={styles.icon} />
      </span>
      <span className={styles.meta}>{when}</span>
    </div>
  );
}
