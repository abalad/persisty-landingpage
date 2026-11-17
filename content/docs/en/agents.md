---
title: Agents and states
description: How Persisty recognises Claude Code and Codex and shows who is working, who is waiting for you and who is asking for permission.
group: agents
order: 1
---

Persisty recognises agents in two ways: when you open the session as Claude Code or Codex CLI, and when you type `claude` in a plain terminal opened by Persisty. Either way, the session gets the agent's icon. The state and the cost come from Claude Code; what works and what does not work yet in Codex is under [Codex CLI](#codex-cli).

## The states

| State | Meaning |
| --- | --- |
| Working | The agent received a request and has not finished yet, including what it left running in the background, such as subagents. |
| Done | It finished its turn and is waiting for the next request. |
| Permission pending | It wants to run something and is waiting for your "yes" in the terminal. |
| Idle | Open, with no request in progress, or with its state not known yet. |
| Ended | The conversation is over. |

The word shows in the session header, on the session's row in the workspace card, in the **Agents** list of the expanded project bar and in the **Details** panel. The tab shows the agent's icon and a coloured dot; the word is in its tooltip, when you hover over it. Collapsed, the project bar shows one dot per project, explained under [Project bar](/docs/projects-and-workspaces#project-bar). The [Board](/docs/board) gathers the agent sessions of every project into columns, and [notifications](/docs/notifications) tell you when one finishes or asks for permission.

In a plain terminal, the session shows **Running**, with the command's name, while something runs, and **Idle** back at the prompt. A session with no process shows the process state, such as **Interrupted**, **Exited** or **Failed**.

## Background work

When Claude Code finishes its answer but leaves a subagent or a command in the background, the session stays **Working** until that work is over. The request queue, the done notice and check on finish wait for the same end.

A subagent counts as work while it shows signs of life, for up to 2 hours without news from it. A background command, such as a dev server, sends no news: it counts for 10 minutes after the answer ends. After that, the session shows the state Claude Code stopped in.

## Claude Code

Each Claude Code session opens with a conversation id that Persisty chooses (`--session-id`). Persisty uses it to resume the same conversation, with `--resume`, when the session comes back after a restart; see [Coming back after a crash](/docs/sessions-and-recovery).

The state comes from Claude's own **hooks**: events it fires when it starts, when it receives a request, when it stops and when it asks for permission. Persisty injects these hooks into each session with `--settings`, in a file of its own. Your `~/.claude/settings.json` is never changed. A `claude` typed in a plain terminal gets the same hooks; if you pass a `--settings` of your own, yours is used and that session's state stays unknown.

If Claude Code shows the folder trust prompt ("Yes, I trust this folder"), the prompt comes before any hook. Persisty does not skip it: the state stays unknown until you answer in the terminal. Meanwhile the session shows as **Idle**, and the Board says **No word from the agent**.

## Codex CLI

Codex CLI opens and persists like any session: it gets a tab and a row in the workspace card, and Persisty reattaches the terminal when you reopen the app with it still running.

Two things do not work yet. The first is the state: Persisty does not change Codex's configuration and does not receive its events, so the session shows as **Idle** while it runs and sends no notifications. The second is resuming the conversation: after the computer restarts, the session comes back as a plain terminal in its folder, without Codex, and the restore report says **Relaunched**.

## Model per session

In Claude Code, the session footer has a model picker. Your choice is saved and passed with `--model` on every launch and resume. In a session that is already open, Persisty types `/model` for you. In Codex CLI, the footer only shows the agent's name, with no picker.

## Default agent

<kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> opens a session with the default agent straight away in the current workspace, and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> comes with it already chosen. In **Settings › Agents › Default agent**, choose between **Claude Code**, the default, **Codex CLI** and **Terminal**. An agent that is not on the computer shows "(not installed)" after its name. If that is the one chosen, Claude Code is used or, without it, Codex CLI; with neither, a terminal opens.

## Detected agents

On the same screen, **Detected agents** shows Claude Code and Codex CLI as Persisty found them on this computer: the version, or **not installed**, and where the program is, under **Installed at …** or **Not found on PATH**. Below, a line says what Persisty can do with each. For Claude Code that is session identity, resume and status via hooks, with usage/tokens marked **Not verified**. For Codex CLI, all four show as **Not verified**.

## Tools for the agents

**Persisty tools in agents**, in **Settings › Agents**, gives Claude Code sessions tools that read the project, its sessions and the output of the workspace commands. None of them types into another terminal. It starts off and applies to sessions that start or restart after you turn it on; **Check installation** tests that it works. For Codex CLI, the same screen shows a command for you to run once in a terminal, because Persisty does not change Codex's configuration; that route is marked **Not verified**.

Other MCP servers, such as GitHub, Sentry or Supabase, are installed in **Settings › MCP servers** and switched on per project in **Project settings › MCP servers**. They only apply to Claude Code sessions that start or restart afterwards.
