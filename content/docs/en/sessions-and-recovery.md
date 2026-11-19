---
title: Coming back after a crash
description: How Persisty brings sessions back when it opens, after a crash or a computer restart, and how it tells you what did not come back.
group: start
order: 4
---

Persisty saves what it needs to bring each session back: the folder, the command, the agent and the conversation id. When it opens, it checks that record session by session and decides what to do with each one. Everything on this page is on the free plan.

## When Persisty opens

If the session's process still exists, Persisty **reattaches** the terminal to it, with the last lines of its history. Nothing is relaunched in this case.

Sessions that went down come back on their own when their rule says so: **Relaunch if it went down**, the default, and **Always relaunch**. Those set to **Only reattach if alive** wait for you to ask. If there was any session to relaunch, the restore report opens by itself at the end.

## Restarting or crashing the computer

After a restart, **no process survives**, in any app. What Persisty does is relaunch each session from what it saved about it.

- **Claude Code** sessions come back with `claude --resume` in the same conversation, in the same permission mode and, if Claude Code was working in a worktree of its own that still exists, in that worktree. When Claude Code itself confirms the resume, the report says **Agent resumed**.
- **Codex CLI** sessions come back as a plain terminal in their folder, without Codex: by default, Persisty does not learn which conversation to resume. The report says **Relaunched**, as for any agent session with no recorded conversation.
- **Terminals** come back as a shell in the same folder. The startup command (for example `pnpm dev`) is only typed when the session is created; on a relaunch it does not run again.

When Persisty relaunches an agent without leaving the session, as when it switches the session's account, the old process still reports that it ended, sometimes later. That report does not leave the new session marked as ended.

## When to relaunch

Each session has a rule, chosen when you create it in **New session › More options › When Persisty reopens**. Terminals and agents opened directly, without that window, get the default. The **Details** panel shows the session's rule, without letting you change it.

| Rule | What happens |
| --- | --- |
| Relaunch if it went down | Relaunches when you open Persisty. This is the default. |
| Only reattach if alive | Does not relaunch on its own; waits for you to ask. |
| Always relaunch | When you open Persisty, also relaunches a session that ended, with an error or not, such as after you exit the agent in the terminal. |

## Restore all

To relaunch what was left behind right away, use the **Restore N** button beside the tabs, or <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> outside the code (**Restore all** in the palette; <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> on Windows and Linux, which are in preview). In the code, in the WebStorm (macOS) keymap and, on Windows and Linux, in both WebStorm keymaps, that key is [**Replace in Files**](/docs/search#replace-in-files). It relaunches the sessions that went down, in every project, including those set to **Only reattach if alive**, and the ones that ended and are set to **Always relaunch**. Running it twice does not duplicate sessions: one that is already back stays as it is. The number on the button counts the current project's sessions with no process, including those that ended, which only come back with **Always relaunch** or with **Try again**.

A session with no process shows **Session has no process.**, with the reason, and a **Try again** button that relaunches just that session, whatever its rule. That is how a session that ended comes back, such as after you exit the agent in the terminal.

## The restore report

Every restore ends in a report. At the top, a line says what Persisty found when it opened: how many sessions it reattached, how many had already ended and how many were interrupted, with no process. Then comes the summary, with how many came back, how many failed and how many were skipped, and one line per session: **Reattached**, **Relaunched**, **Agent resumed**, **Skipped** or **Failed**, with the reason when there is one, such as **working folder missing** when the session's folder no longer exists.

The report opens on its own when Persisty relaunches your sessions as it starts, and after **Restore all**. **Restore report**, in the palette (<kbd>⌘</kbd> <kbd>K</kbd>), opens the last one again.

Persisty never says a session came back when it did not. **Agent resumed (resume not confirmed)** only means the resume command was run. In a project pinned to a Claude account ([Pro](/docs/pro)), a session whose account is not connected stays stopped, and the report says which account is missing.

## Terminal history

When a terminal is reattached, the last 5,000 lines above the screen show in it before the live content. Each session keeps up to 20,000 lines. While the session is open, the terminal keeps as many lines to scroll back as **History lines** says, in [Settings › Terminal](/docs/settings#terminal): 5,000 to start with, from 1,000 to 50,000.
