import { ListFilter, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { AgentGlyph, Lights, SessionHeader, Chip, Terminal, WorkspaceStrip, cx, type TermLine } from "./parts";
import { ProjectLogo, projectName } from "./logos";
import s from "./app.module.css";
import x from "./extra.module.css";

export function ProjectsSidebar({ showAgents = true, keepOnNarrow = false }: { showAgents?: boolean; keepOnNarrow?: boolean }) {
  const t = useTranslations("mock");
  // "Nothing running", Bússola's line, for every project at rest.
  const quiet = t("projects.bussola");
  const projects = [
    { key: "rota", sub: t("projects.rota"), tone: "warn", active: true },
    { key: "quintal", sub: t("projects.quintal"), tone: "info" },
    { key: "bussola", sub: quiet, tone: null },
    { key: "mare", sub: quiet, tone: null },
    { key: "pulso", sub: quiet, tone: null },
  ] as const;
  // Over the agents' list, the three with something to say.
  const shown = showAgents ? projects.slice(0, 3) : projects;
  const agents = [
    { name: "checkout", kind: "claude", state: t("states.permission"), tone: "warn", ws: "rota-app" },
    { name: "api", kind: "claude", state: t("states.waiting"), tone: "warn", ws: "rota-api" },
    { name: t("sessions.catalog"), kind: "claude", state: t("states.working"), tone: "info", ws: "quintal-web" },
  ] as const;

  return (
    <div className={cx(x.sidebar, keepOnNarrow && x.sidebarKeep)}>
      <div className={s.topbar} style={{ borderBottom: 0, background: "transparent" }}>
        <Lights />
      </div>
      <div className={x.sideHead}>
        {t("projects.projectsTitle")}
        <Plus />
      </div>
      {shown.map((p) => (
        <div key={p.key} className={cx(x.project, "active" in p && x.projectActive)}>
          <span className={cx(x.tile, "active" in p && x.tileActive)}>
            <ProjectLogo project={p.key} />
            {p.tone ? <i style={{ background: `var(--color-${p.tone})` }} /> : null}
          </span>
          <span className={x.projectText}>
            <span className={x.projectName}>{projectName(p.key)}</span>
            <span className={x.projectSub} style={{ color: p.tone ? `var(--color-${p.tone})` : "var(--color-fg-subtle)" }}>
              {p.sub}
            </span>
          </span>
        </div>
      ))}
      {showAgents ? (
        <>
          <div className={x.divider} />
          <div className={x.sideHead}>
            {t("projects.agentsTitle")}
            <span className={x.filter}>
              <ListFilter />
              {t("projects.filter")}
            </span>
          </div>
          {agents.map((a) => (
            <div key={a.name} className={x.agent}>
              <AgentGlyph kind={a.kind} />
              <span className={x.agentName}>{a.name}</span>
              <span className={x.agentWs}>{a.ws}</span>
              <span className={x.agentState} style={{ color: `var(--color-${a.tone})` }}>
                {a.state}
              </span>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}

/** Rota open: its sessions as tabs, the focused one, and its workspaces as cards. */
export function ProjectsMock() {
  const t = useTranslations("mock");
  return (
    <div className={x.frameTall} style={{ display: "flex" }}>
      <ProjectsSidebar showAgents={false} keepOnNarrow />
      <div className={x.splitMain} style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div className={s.topbar}>
          <span className={s.projectName} style={{ paddingLeft: "calc(14 * var(--u))" }}>
            Rota
          </span>
          <span className={s.sep} />
          <span className={s.tabs}>
            <span className={s.tab}>
              <AgentGlyph kind="claude" />
              api
              <span className={s.dot} style={{ background: "var(--color-warn)" }} />
            </span>
            <span className={cx(s.tab, s.tabActive)}>
              <AgentGlyph kind="claude" />
              checkout
              <span className={s.dot} style={{ background: "var(--color-warn)" }} />
            </span>
            <span className={s.tab}>
              <AgentGlyph kind="shell" />
              dev
              <span className={s.dot} style={{ background: "var(--color-ok)" }} />
            </span>
          </span>
        </div>
        <SessionHeader name="checkout" kind="claude" branch="feat/checkout" status={<Chip tone="warn" icon="permission" label={t("states.permission")} />} />
        <Terminal lines={(t.raw("projects.permissionLines") as TermLine[]).slice(2)} rows={6} />
        <WorkspaceStrip
          title={t("workspaces.title")}
          count={3}
          addLabel={t("workspaces.add")}
          cards={[
            {
              name: "rota-api",
              branch: "main",
              changes: "±3",
              tone: "warn",
              rows: [
                { name: "api", kind: "claude", state: t("states.waiting"), tone: "warn" },
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
            { name: "rota-site", branch: "main", tone: "neutral", rows: [], empty: t("workspaces.none"), footer: ["", ""] },
          ]}
        />
      </div>
    </div>
  );
}

/** The agent list beside a session that is asking for permission. */
export function StatesMock() {
  const t = useTranslations("mock");
  return (
    <div className={x.frameFit} style={{ display: "flex" }}>
      <ProjectsSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <SessionHeader name="checkout" kind="claude" branch="feat/checkout" status={<Chip tone="warn" icon="permission" label={t("states.permission")} />} />
        <Terminal lines={[...(t.raw("projects.checkoutLines") as TermLine[]), ...(t.raw("projects.permissionLines") as TermLine[])]} rows={10} />
      </div>
    </div>
  );
}
