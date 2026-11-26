---
title: Troubleshooting and limitations
description: Known situations, what to do in each one, what changes on Windows and Linux, and what Persisty does not do yet.
group: reference
order: 3
---

Known situations and what to do in each one. At the end, what changes on Windows and Linux, which are in preview, and what Persisty does not do yet.

## The agent's state shows as unknown

Claude Code shows the folder trust prompt before any hook. Answer it in the terminal and the state appears; see [Claude Code](/docs/agents#claude-code).

By default, Persisty does not receive Codex's state: it does not write `~/.codex/hooks.json` or show what to put in it. So a Codex session stays **Idle**, the [queue](/docs/queue) header says **Agent state unknown** and the queue sends it no requests; see [Codex CLI](/docs/agents#codex-cli).

## I typed `claude` in a terminal and the session did not become an agent

Persisty's terminals put the app's own `claude` first on the `PATH`, and it opens your Claude Code with Persisty's hooks. The app refreshes that `claude` every time it opens, in terminals that stayed open too. The session becomes an agent at the first hook, which only comes after the folder trust prompt: answer that first.

If nothing changes after that, the `claude` you typed did not go through Persisty's. That happens with an alias or a function of that name in your shell's configuration, with the program's full path, or with a shell other than zsh or bash that reorders the `PATH` when it starts. `type claude` shows which one applies. Only Claude Code is adopted this way; by default, a `codex` typed by hand leaves the session a terminal.

## The quota shows as unavailable

Persisty reads the [quota](/docs/usage-and-quota) with the credential Claude Code stores. If that credential has expired, the bars use the session's own numbers until Claude Code renews it. On a Mac, accounts connected through Persisty need the item Claude Code creates in the Keychain when you finish signing in; see [Connected accounts](/docs/ai-accounts#connected-accounts).

## The queue did not send the request

The queue only sends while Persisty is open and the agent is waiting for its next request. Requests never go during work or over a permission request.

If the session header says "Out of quota", the queue is waiting for the account to renew. If it says "The last turn failed", the queue waits until a turn ends well. Either way, **Let the queue go now**, at the top of the queue, lets the requests through; see [When the quota runs out](/docs/ai-accounts#when-the-quota-runs-out).

Requests go in order, and the ones below show "waiting for no. 1". If no. 1 is set to **From a chosen time** or **When the 5-hour window renews**, the whole queue waits for that time. The queue also waits while you edit a request ("Editing no. 2: the queue waits"; after 15 minutes untouched, it moves again) and while an account switch is pending (the footer says **switches when the answer ends**). In a session of a project pinned to an account, nothing goes while the session runs on another account, and **Let the queue go now** does not change that. Also check that the queue is not paused. More in [When each request goes](/docs/queue#when-each-request-goes).

## Windows and Linux

Windows and Linux are in preview: the app ships unsigned and has not been tested on real machines yet. For the keys, see [Keyboard shortcuts](/docs/shortcuts#windows-and-linux), and for updating, [Updates](/docs/updates#windows-and-linux).

On Windows, agents do not need a POSIX shell: Claude Code's hooks call a native Persisty executable.

On Windows and Linux, the top bar starts at the window's edge, without the space macOS keeps for the window buttons, and the project bar and search buttons sit in the corner. If yours shows an empty space on the left, update Persisty: the fix came in 0.9.2.

On Windows, with the display scaled to 125% or 150%, a session's terminal could end up with more columns than the session knew about: lines started on the right and bits of old screens stayed put. Since 0.9.4, the terminal and the session always have the same size; if the text gets garbled, update Persisty.

[**Add workspace**](/docs/projects-and-workspaces#add-a-workspace) accepts the folder you pick on Windows, such as `C:\...`, and a [**New session**](/docs/sessions#new-session) in a Windows workspace opens normally since 0.9.1.

Still being checked in real use: on Windows and Linux, pasting files to and from the system and **Undo** after a [delete](/docs/files#delete); on Windows, **Undo** from the Recycle Bin and the file-in-use notices. The [mascot outside the app](/docs/mascot#outside-the-app) exists only on macOS.

## What Persisty does not do yet

- Switch a session's account in the middle of a turn. A switch, by rotation or by hand from the footer, waits for the answer to end and for what it left running in the background, such as subagents and commands; see [Switch a session's account](/docs/ai-accounts#switch-a-sessions-account).
- Integrations with analytics tools.
- Split the terminal into side-by-side panes.
- In the editor, move code to a file you pick, and rename a Rust module's file from the `mod` name in the code; see [Usages, rename and refactor](/docs/usages-and-refactoring#plan-and-limits).
- A signed Windows installer, and Windows and Linux tested on real machines.
