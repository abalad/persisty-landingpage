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

- **Claude Code** sessions come back with `claude --resume` in the same conversation. When Claude Code itself confirms the resume, the report says **Agent resumed**.
- **Codex** sessions are relaunched, but the resume is not confirmed yet; the report says so.
- **Terminals** with a startup command (for example `pnpm dev`) are relaunched with the same command.

## When to relaunch

Each session has a rule, chosen when you create it:

| Rule | What happens after a restart |
| --- | --- |
| Relaunch if it went down | Relaunches when you open Persisty. This is the default. |
| Only reattach if alive | Does not relaunch on its own; waits for you to ask. |
| Always relaunch | Relaunches whenever the session can come back, including after it exits with an error. |

To relaunch what was left behind right away, use **Restore all** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd>). Running it twice does not duplicate sessions.

## The restore report

Every restore ends in a report with one line per session: reattached, relaunched, agent resumed, skipped or failed, with the reason when there is one. The summary says how many came back, how many failed and how many were skipped. The report opens on its own when Persisty relaunches your sessions as it starts, and after **Restore all**. The command palette opens the last one again.

Persisty never says a session came back when it did not. "Agent resumed" without confirmation only means the resume command was run.

## Terminal history

When a terminal is reattached, the last 5,000 lines above the screen show in it before the live content. Each session keeps up to 20,000 lines.
