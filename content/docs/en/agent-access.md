---
title: Agents that read Persisty
description: Tools that let Claude Code know which session it is in, see the project and the other sessions, and read the output of the workspace commands.
group: integrations
order: 4
---

With **Persisty tools in agents** on, Claude Code sessions get tools that read Persisty itself: the session the agent is in, the project, the other sessions and the output of the workspace commands. None of them types into another terminal or changes anything.

## Turn it on

In [**Settings › Agents**](/docs/settings#agents), the **Agent access (MCP)** group has **Persisty tools in agents**, off by default. The change applies to Claude Code sessions that start or restart after it; the ones already open stay as they were. Each session gets a credential of its own, and the tools only answer about that session's project.

## What the agent reads

There are four tools, and the agent calls each one when it needs it. `current_session` gives the session's name, the project, the workspace with its folder and default branch, the current branch and, in an [own folder](/docs/worktrees), that folder's branch and base. `list_sessions` lists the sessions of the same project, command runs included, with each one's agent, [state](/docs/agents#the-states) (working, waiting for you, asking permission, stopped), folder and branch, so the agent does not work on the same branch as another. `get_project` shows the project's name and description, the workspaces with each one's remote and default branch, and the [workspace commands](/docs/commands), those you saved and those Persisty found, with each one's command. `read_task_output` reads the last lines one of those commands printed, running or finished, with its exit code: 100 by default, up to 500. It takes the id `list_sessions` gives the run, and it does not read terminals or agents.

The tools ask the app. With Persisty closed, they tell the agent so.

## Check installation

**Check installation** starts the server the way Claude Code would, runs the MCP handshake, lists the tools and reaches the app. Each step shows **ok** or **failed**, with the reason when it fails. It worked when the summary starts with "Working", followed by the MCP version and the number of tools.

## Codex CLI

Persisty does not change Codex's configuration. So, on the same screen, the **Codex CLI** row shows a command for you to run once in a terminal, such as `codex mcp add persisty -- '/Applications/Persisty.app/Contents/MacOS/persist-desktop' mcp-server`, with **Copy** beside it. With the switch on, the Codex sessions Persisty opens get their credential. This route is marked **Not verified**.

## Plan and limits

Persisty's tools are on the free plan. They only read, only answer about the session's project and only talk to the app on this computer, which must be open. What they return, such as branch names, remotes and command output, goes into the agent's conversation and on to wherever that already goes, the agent's provider. They apply to sessions opened as Claude Code; in Codex CLI, they depend on the command above, not yet verified.

MCP servers from other services, such as GitHub or Sentry, are in [MCP servers](/docs/mcp-servers).
