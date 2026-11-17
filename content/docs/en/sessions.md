---
title: Sessions and terminals
description: Opening, naming, closing and switching sessions, the side panel with each session's tools, and links in the terminal.
group: start
order: 3
---

A session is a Persisty terminal: a plain shell or an agent, such as Claude Code or Codex CLI. It opens in a workspace, or standalone in the project, in any folder. Switching tab, workspace or project does not interrupt it.

## New session

There are three ways to open a session in the selected workspace. <kbd>⌘</kbd> <kbd>N</kbd>, or the **+** beside the tabs, opens a terminal straight away. <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> opens the [default agent](/docs/agents#default-agent) directly. <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> opens the **New session** window with the default agent already chosen, and the **+** with <kbd>⌥</kbd> or <kbd>⇧</kbd> opens the same window with **Terminal**. With no workspace selected, or with its folder missing, <kbd>⌘</kbd> <kbd>N</kbd> and <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> open the window too. On Windows and Linux, which are in preview, use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd> for every key on this page.

In the window, **Where** is one of the project's workspaces or **Standalone session**, which asks for the **Folder** the terminal opens in. **What** is **Terminal**, **Claude Code** or **Codex CLI**; an agent that is not on your computer shows as **not found** and cannot be chosen. The **Name** comes with the agent and the workspace, such as `Claude Code · api`, and is what the tab shows. **Create and open**, or <kbd>↵</kbd>, opens the session, and <kbd>Esc</kbd> closes the window.

**More options** holds the **Model**, for Claude Code only (**Default** uses Claude's); the **Startup command**, typed when the terminal opens, such as `pnpm dev`; and **When Persisty reopens**, the rule explained in [When to relaunch](/docs/sessions-and-recovery#when-to-relaunch). Depending on the case, the window also shows the **Claude account** ([AI accounts and rotation](/docs/ai-accounts)), [**Start from an issue**](/docs/issues#start-from-an-issue) and [**Own folder (worktree)**](/docs/worktrees), which is a [Pro](/docs/pro) feature.

In a workspace with no sessions, the screen shows the folder's path and a short list: `terminal`, `claude`, `codex` and `options`. The keys <kbd>1</kbd>, <kbd>2</kbd> and <kbd>3</kbd> open the first three, and `options` opens the **New session** window. Below come the sessions in the project's other workspaces, to go straight to one of them.

## Sessions and tabs

The tabs at the top are the sessions of the selected workspace. Each tab has the agent's icon, the name and a dot with the state; hovering shows the state in words (see [The states](/docs/agents#the-states)). In a Claude Code session, the tab shows the conversation's name for as long as the session keeps the name Persisty gave it. A name you chose stays.

To rename, double-click the tab or use **Rename** on its right-click menu. The same menu has **Move left** and **Move right**, when the tab can go that way, **Open in** with your default IDE's name, such as **Open in Cursor**, when there is one, **Close** and **Close all**. The **×** shows over the dot when you hover. Closing asks for confirmation, ends the process and removes the session; for a session with its own folder, Persisty first asks what to do with the folder.

Beside the tabs are also the [workspace commands](/docs/commands) picker, the **Session board** button, which opens the [Board](/docs/board) (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>), and, when the project has sessions with no process, **Restore N** ([Restore all](/docs/sessions-and-recovery#restore-all)).

<kbd>⌘</kbd> <kbd>←</kbd> and <kbd>⌘</kbd> <kbd>→</kbd> move to the workspace's previous or next session, outside the code; in the editor, those keys move along the line. <kbd>⌘</kbd> <kbd>K</kbd> finds any session in the projects in the bar by its name. When you switch sessions, what you type goes to the terminal as soon as it shows, even before it has finished connecting, and never to the file open in the [**Code**](/docs/editor) panel.

Each session keeps its terminal history, which comes back when Persisty reattaches; see [Terminal history](/docs/sessions-and-recovery#terminal-history).

## Session header

Above the terminal, the header shows the name, the state in words and the folder's branch. The branch follows switches made in the terminal, and clicking it opens a picker with search to switch or create branches. Depending on the session, it also shows the **Out of quota** notice, the `worktree` mark of a session with its own folder, the result of the [check on finish](/docs/verify) and the issue it started from.

The actions sit on the right, as icon buttons; hovering shows the name. **Stop** ends the process and keeps the session, which then shows **Session has no process.** and **Try again**; a session that has not started yet shows **Start**. **Rename** changes the name, **History** shows the session's 12 most recent events, newest first, such as state changes and account switches, and **Remove** ends the process and removes the session.

The bar at the bottom of the window shows, for the focused session, the model, the estimated spend, the context, the 5 h and 7 d windows, the folder and the process; see [Usage, cost and quota](/docs/usage-and-quota).

## Session tools

Down the right edge of every session runs a thin bar with its tools, in three groups: [**Code**](/docs/editor), [**Search**](/docs/search) and [**Notes**](/docs/notes); [**Changes**](/docs/changes), [**Restore points**](/docs/restore-points) and [**Request queue**](/docs/queue); and **Details**. One click opens the tool in the side panel, and the same click closes it. The **Changes** icon shows how many files changed and, in agent sessions, the **Request queue** icon shows how many requests are waiting, even with the panel closed. Hovering shows the name, the count and the shortcut.

**Details** sums up the session, the workspace and the project: the agent, the model, the estimated cost, the context used, the 5 h and 7 d windows, the process and the **On reopen** rule; the folder, the branch and the changes, with **Remove from project**; and this month's AI spend and the active sessions, with **Usage details** and **Project settings**.

Sessions, the panel and links are on the free plan. In the **Request queue**, writing requests is a Pro feature; in **Restore points**, so is recording a point on every request.

## Side panel

<kbd>⌘</kbd> <kbd>&#92;</kbd> shows or hides the panel, on the last tool you used, and **Collapse panel**, in its corner, closes it too. Some tools have a key of their own: <kbd>⌘</kbd> <kbd>P</kbd> opens **Code** with the search for a file by name, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> opens **Search**, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> opens and closes **Changes**, and <kbd>⌘</kbd> <kbd>I</kbd> opens and closes **Details**. Inside the code, the editor keymap's keys come first; see [Keyboard shortcuts](/docs/shortcuts).

The divider between the terminal and the panel can be dragged. With it in focus, <kbd>←</kbd> and <kbd>→</kbd> change the width 5% at a time, and <kbd>←</kbd> widens the panel. The panel starts at 45% of the width and goes from 20% to 80%. Each session remembers whether its panel was open, on which tool and how wide, even after you reopen the app. **Reset**, in [**Settings › Workspace › Panel size**](/docs/settings#workspace), puts every session back to the default split.

## Links in the terminal

Addresses that start with `http://`, `https://` or `www.` become links. With <kbd>⌘</kbd> held, a click opens the address in your browser; without the key, a click still selects text or reaches the program running there. Hovering over a link tells you which key to use.

Full paths that exist on disk become links too: those that start with `/`, with `~/` or, on Windows, with the drive letter, such as `C:\`. <kbd>⌘</kbd>-click shows the path in Finder: a folder opens, and a file shows selected in its folder. A `:12` or `:12:5` at the end, as in an error message, stays out of the link. Relative paths, such as `src/main.ts`, do not become links.

On Windows and Linux, the key is <kbd>Ctrl</kbd>, and the path opens in File Explorer or in the file manager.
