"use client";

import { FolderGit2, ListPlus, ShieldCheck, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { ProWindow, type ProPanelId } from "./ProPanels";
import styles from "./ProTabs.module.css";

const TABS: { id: ProPanelId; icon: ReactNode }[] = [
  { id: "queue", icon: <ListPlus /> },
  { id: "restore", icon: <Undo2 /> },
  { id: "verify", icon: <ShieldCheck /> },
  { id: "worktree", icon: <FolderGit2 /> },
];

/** The home page's Pro section: one tab per feature, each the app's own screen for it. */
export function ProTabs() {
  const t = useTranslations("mock.pro");
  const [tab, setTab] = useState<ProPanelId>("queue");

  return (
    <div className={styles.root}>
      <div className={styles.tabs} role="tablist" aria-label={t("label")}>
        {TABS.map((tb) => (
          <button
            key={tb.id}
            type="button"
            role="tab"
            id={`pro-tab-${tb.id}`}
            aria-selected={tab === tb.id}
            aria-controls="pro-panel"
            className={styles.tab}
            onClick={() => setTab(tb.id)}
          >
            <span aria-hidden="true">{tb.icon}</span>
            {t(`tabs.${tb.id}`)}
          </button>
        ))}
      </div>
      <div id="pro-panel" role="tabpanel" aria-labelledby={`pro-tab-${tab}`}>
        <ProWindow panel={tab} />
      </div>
    </div>
  );
}
