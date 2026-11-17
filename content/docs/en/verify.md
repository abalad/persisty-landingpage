---
title: Check on finish
description: A workspace command, such as the tests, runs on its own when the agent stops after changing files, and the session header shows whether it passed.
group: agents
order: 10
---

Check on finish runs a workspace command, such as `pnpm test`, when the agent ends a turn in which it changed files. The result shows in the session header.

## Choose the command

In the workspace command picker, beside the tabs, choose the command, for example `pnpm test`. Open the picker again: below the list is **Check on finish with** followed by its name. One click turns it on, with a tick, and another turns it off. The command applies to the whole workspace: all its agent sessions use the same one. If another command is already chosen, the menu shows **Now:** with it.

## When it runs

Persisty notes the state of the files when the agent receives a request. When the agent ends its turn, if any file changed, the command runs on its own in the session's folder. A turn that changed nothing does not trigger the check. If the answer left a subagent or a command in the background, the check waits for that work to end.

## The result

The session header shows **Check** with the result: **running**, **passed**, **failed** with the exit code, or **stopped**. Clicking it opens the check's output in **Command output**. The result is not sent to the agent: it is for you to read.

## Plan and limits

Check on finish is Pro; without it, the menu item shows the **Pro** tag. It applies to Claude Code sessions inside a workspace, in git folders, because it relies on the hooks that report the request and the end of the turn. Codex CLI does not trigger the check.
