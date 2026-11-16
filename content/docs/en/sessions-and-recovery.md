---
title: Sessions and recovery
description: How Persisty brings sessions back after a crash or a restart, and how it tells you what did not come back.
group: start
order: 3
---

Persisty saves what it needs to bring each session back: folder, command, agent and conversation id. When it opens, it checks that record session by session and decides what to do with each one.

## When Persisty opens

If the session is still running, Persisty **reattaches** the terminal, with the last lines of its history. Nothing is relaunched in this case.

## Restarting or crashing the computer

After a restart, **no process survives**, in any app. What Persisty does is relaunch each session from what it saved about it: folder, command, agent and conversation id.

- **Claude Code** sessions come back with `claude --resume` in the same conversation, in the same permission mode and, if Claude Code was working in a worktree of its own that still exists, in that worktree. When Claude Code itself confirms the resume, the report says **Agent resumed**.
- **Codex CLI** sessions come back as a plain terminal in their folder, without Codex: Persisty does not know which conversation to resume. The report says **Relaunched**.
- **Terminals** come back as a shell in the same folder. The startup command (for example `pnpm dev`) is only typed when the session is created; on a relaunch it does not run again.

## When to relaunch

Each session has a rule, chosen when you create it in **New session › More options › When Persisty reopens**. Terminals and agents opened directly, without that dialog, get the default. The **Details** panel shows the session's rule, without letting you change it.

| Rule | What happens |
| --- | --- |
| Relaunch if it went down | Relaunches when you open Persisty. This is the default. |
| Only reattach if alive | Does not relaunch on its own; waits for you to ask. |
| Always relaunch | When you open Persisty, also relaunches a session that ended, with an error or not, including one you stopped with **Stop**. |

To relaunch what was left behind right away, use the **Restore N** button beside the tabs, or <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> (**Restore all** in the palette). It relaunches the sessions that went down, in every project, including those set to **Only reattach if alive**, and the ones that ended and are set to **Always relaunch**. Running it twice does not duplicate sessions.

A session with no process shows **Session has no process.**, with the reason, and a **Try again** button that relaunches just that session, whatever its rule. That is how a session that ended, or that you stopped, comes back.

## The restore report

Every restore ends in a report. At the top, a line says what Persisty found when it opened: how many sessions it reattached, how many exited while the app was closed and how many were interrupted, with no process. Then comes the summary, with how many came back, how many failed and how many were skipped, and one line per session: **Reattached**, **Relaunched**, **Agent resumed**, **Skipped** or **Failed**, with the reason when there is one. The report opens on its own when Persisty relaunches your sessions as it starts, and after **Restore all**. **Restore report**, in the palette (<kbd>⌘</kbd> <kbd>K</kbd>), opens the last one again.

Persisty never says a session came back when it did not. **Agent resumed (resume not confirmed)** only means the resume command was run.

## Terminal history

When a terminal is reattached, the last 5,000 lines above the screen show in it before the live content. Each session keeps up to 20,000 lines.
