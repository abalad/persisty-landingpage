import {
  Bot,
  Check,
  ChevronDown,
  GitBranch,
  Hand,
  History,
  Loader2,
  PanelLeft,
  PanelRight,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldQuestion,
  Sparkles,
  Square,
  TerminalSquare,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import s from "./app.module.css";

export type Tone = "info" | "ok" | "warn" | "neutral" | "danger";
export type AgentKind = "claude" | "codex" | "shell";
export type StateIcon = "working" | "waiting" | "permission" | "idle" | "running" | "recovering" | "done";

const AGENT_ICON: Record<AgentKind, LucideIcon> = { claude: Sparkles, codex: Bot, shell: TerminalSquare };
const STATE_ICON: Record<StateIcon, LucideIcon> = {
  working: Loader2,
  waiting: Hand,
  permission: ShieldQuestion,
  idle: Pause,
  running: Play,
  recovering: RotateCcw,
  done: Check,
};
const SPINS: StateIcon[] = ["working", "recovering"];

export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

/** Agent glyph, coloured like the app does: Claude in accent, Codex neutral. */
export function AgentGlyph({ kind, tone }: { kind: AgentKind; tone?: Tone }) {
  const Icon = AGENT_ICON[kind];
  const color = tone ? `var(--color-${tone})` : kind === "claude" ? "var(--color-accent)" : "var(--color-fg-muted)";
  return <Icon aria-hidden="true" style={{ color }} />;
}

export function Chip({ tone, label, icon, plain }: { tone: Tone; label: string; icon?: StateIcon; plain?: boolean }) {
  const Icon = icon ? STATE_ICON[icon] : null;
  return (
    <span className={cx(s.chip, s[tone], plain && s.plain)}>
      {Icon ? <Icon aria-hidden="true" className={icon && SPINS.includes(icon) ? s.spin : undefined} /> : null}
      {label}
    </span>
  );
}

export function Dot({ tone }: { tone: Tone }) {
  return <span className={cx(s.dot, s[`dot${tone}`])} aria-hidden="true" />;
}

interface WindowProps {
  label: string;
  designWidth?: number;
  className?: string;
  children: ReactNode;
}

/** The app window. `label` describes the picture for screen readers. */
export function Window({ label, designWidth = 1120, className, children }: WindowProps) {
  return (
    <div className={cx(s.frame, className)}>
      <div className={s.window} role="img" aria-label={label} style={{ "--design-width": designWidth } as CSSProperties}>
        <div aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

export function Lights() {
  return (
    <span className={s.lights}>
      <span />
      <span />
      <span />
    </span>
  );
}

export interface TabSpec {
  name: string;
  kind: AgentKind;
  tone: Tone;
  active?: boolean;
}

export function TopBar({ project, tabs, right }: { project: string; tabs: TabSpec[]; right?: ReactNode }) {
  return (
    <div className={s.topbar}>
      <Lights />
      <span className={cx(s.iconBtn, s.hideNarrow)}>
        <PanelLeft />
      </span>
      <span className={cx(s.iconBtn, s.hideNarrow)}>
        <Search />
      </span>
      <span className={cx(s.projectName, s.hideNarrow)}>{project}</span>
      <span className={cx(s.sep, s.hideNarrow)} />
      <span className={s.tabs}>
        {tabs.map((t, i) => (
          <span key={t.name} className={cx(s.tab, t.active && s.tabActive, i > 1 && s.hideNarrow)}>
            <AgentGlyph kind={t.kind} />
            {t.name}
            <Dot tone={t.tone} />
          </span>
        ))}
        <span className={cx(s.tab, s.tabAdd, s.hideNarrow)}>
          <Plus />
        </span>
      </span>
      {right ? <span className={cx(s.topRight, s.hideNarrow)}>{right}</span> : null}
    </div>
  );
}

export function CommandButtons({ command }: { command: string }) {
  return (
    <>
      <span className={s.pillBtn}>
        <TerminalSquare />
        {command}
        <ChevronDown />
      </span>
      <span className={s.pillBtn} style={{ color: "var(--color-ok)" }}>
        <Play />
      </span>
    </>
  );
}

export interface RailProject {
  letter: string;
  active?: boolean;
  dot?: Tone;
}

export function Rail({ projects }: { projects: RailProject[] }) {
  return (
    <div className={s.rail}>
      {projects.map((p) => (
        <span key={p.letter} className={cx(s.railItem, p.active && s.railActive)}>
          {p.letter}
          {p.dot ? <span className={cx(s.railDot, s[`dot${p.dot}`])} /> : null}
        </span>
      ))}
      <span className={cx(s.railItem, s.railAdd)}>
        <Plus />
      </span>
      <span className={s.railSpacer} />
      <span className={s.iconBtn}>
        <Settings />
      </span>
    </div>
  );
}

export function SessionHeader({ name, kind, status, branch }: { name: string; kind: AgentKind; status: ReactNode; branch: string }) {
  return (
    <div className={s.sessionHeader}>
      <span className={s.sessionName}>
        <AgentGlyph kind={kind} />
        {name}
      </span>
      {status}
      <span className={cx(s.branch, s.mono, s.hideNarrow)}>
        <GitBranch />
        {branch}
        <ChevronDown />
      </span>
      <span className={cx(s.headerTools, s.hideNarrow)}>
        <Square />
        <Pencil />
        <History />
        <Trash2 />
        <PanelRight />
      </span>
    </div>
  );
}

export type LineKind = "prompt" | "tool" | "result" | "answer" | "muted" | "warn" | "choice" | "choiceActive" | "plain" | "blank";

export interface TermLine {
  kind: LineKind;
  text?: string;
  /** For results: a "+38 −4" style diff gets coloured. */
  diff?: { add: string; del: string };
}

export function TerminalLine({ line, animate }: { line: TermLine; animate?: boolean }) {
  const cls = cx(s.line, animate && s.lineIn);
  switch (line.kind) {
    case "prompt": {
      // Animated, it is typed out one character at a time, the way you would.
      const text = "> " + line.text;
      return (
        <span className={s.prompt}>
          {animate ? (
            <span className={s.typed} style={{ "--chars": text.length } as CSSProperties}>
              {text}
            </span>
          ) : (
            text
          )}
        </span>
      );
    }
    case "tool":
      return (
        <span className={cls}>
          <span className={s.bullet}>● </span>
          {line.text}
        </span>
      );
    case "result":
      return (
        <span className={cx(cls, s.result)}>
          {"  └ "}
          {line.diff ? (
            <>
              <span className={s.add}>{line.diff.add}</span> <span className={s.del}>{line.diff.del}</span>
            </>
          ) : (
            line.text
          )}
        </span>
      );
    case "answer":
      return <span className={cx(cls, s.answer)}>{line.text}</span>;
    case "warn":
      return <span className={cx(cls, s.warnText)}>{line.text}</span>;
    case "choice":
      return <span className={cx(cls, s.choice, s.muted)}>{line.text}</span>;
    case "choiceActive":
      return <span className={cx(cls, s.choice, s.choiceActive)}>{line.text}</span>;
    case "muted":
      return <span className={cx(cls, s.muted)}>{line.text}</span>;
    case "blank":
      return <span className={cls} />;
    default:
      return <span className={cls}>{line.text}</span>;
  }
}

export function Terminal({ lines, rows, caret, animateFrom = Infinity }: { lines: TermLine[]; rows?: number; caret?: boolean; animateFrom?: number }) {
  return (
    <div className={cx(s.terminal, s.mono)} style={rows ? ({ "--terminal-rows": rows } as CSSProperties) : undefined}>
      {lines.map((l, i) => (
        <TerminalLine key={i} line={l} animate={i >= animateFrom} />
      ))}
      {caret ? <span className={s.caret} /> : null}
    </div>
  );
}

export interface WorkspaceCard {
  name: string;
  branch?: string;
  changes?: string;
  tone: Tone;
  active?: boolean;
  rows: { name: string; kind: AgentKind; state: string; tone: Tone }[];
  footer: [string, string];
  empty?: string;
}

export function WorkspaceStrip({ title, count, cards, addLabel }: { title: string; count: number; cards: WorkspaceCard[]; addLabel: string }) {
  return (
    <div className={s.strip}>
      <div className={s.stripHead}>
        {title} <span>{count}</span>
      </div>
      <div className={s.cards}>
        {cards.map((c) => (
          <div key={c.name} className={cx(s.card, c.active && s.cardActive)}>
            <div className={s.cardHead}>
              {c.name}
              {c.branch ? <span className={cx(s.cardBranch, s.mono)}>{c.branch}</span> : null}
              {c.changes ? <span className={cx(s.cardChanges, s.mono)}>{c.changes}</span> : null}
              <Dot tone={c.tone} />
            </div>
            <div className={s.cardRows}>
              {c.rows.length === 0 && c.empty ? <span className={s.muted}>{c.empty}</span> : null}
              {c.rows.map((r) => (
                <div key={r.name} className={s.cardRow}>
                  <span>
                    <AgentGlyph kind={r.kind} />
                    {r.name}
                  </span>
                  <span style={{ color: `var(--color-${r.tone === "neutral" ? "fg-subtle" : r.tone})` }}>{r.state}</span>
                </div>
              ))}
            </div>
            <div className={s.cardFoot}>
              <span>{c.footer[0]}</span>
              <span>{c.footer[1]}</span>
            </div>
          </div>
        ))}
        <div className={cx(s.card, s.cardAddWs)}>
          <Plus />
          {addLabel}
        </div>
      </div>
    </div>
  );
}

export interface StatusSpec {
  model: string;
  spendLabel: string;
  spend: string;
  ctxLabel: string;
  ctx: string;
  five: number;
  seven: number;
  right: string;
}

export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <span className={s.meter}>
      <span className={s.statusLabel}>{label}</span>
      <span className={cx(s.bar, value >= 90 && s.barWarn)}>
        <span style={{ transform: `scaleX(${Math.min(100, value) / 100})` }} />
      </span>
      <span className={s.statusValue}>{Math.round(value)}%</span>
    </span>
  );
}

export function StatusBar({ spec }: { spec: StatusSpec }) {
  return (
    <div className={cx(s.statusbar, s.mono)}>
      <span className={s.statusValue}>
        {spec.model} <ChevronDown style={{ verticalAlign: "middle" }} />
      </span>
      <span className={s.hideNarrow}>
        <span className={s.statusLabel}>{spec.spendLabel}</span> <span className={s.statusValue}>{spec.spend}</span>
      </span>
      <span className={s.hideNarrow}>
        <span className={s.statusLabel}>{spec.ctxLabel}</span> <span className={s.statusValue}>{spec.ctx}</span>
      </span>
      <Meter label="5 h" value={spec.five} />
      <Meter label="7 d" value={spec.seven} />
      <span className={cx(s.statusRight, s.hideNarrow)}>{spec.right}</span>
    </div>
  );
}
