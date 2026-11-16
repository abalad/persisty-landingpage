---
title: Agents and states
description: How Persisty recognises Claude Code and Codex and shows who is working, who is waiting for you and who is asking for permission.
group: start
order: 4
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

The word shows in the session header, on the session's row in the workspace card, in the **Agents** list of the expanded project bar and in the **Details** panel. The tab shows the agent's icon and a coloured dot; the word is in its tooltip, when you hover over it. Collapsed, the project bar shows one dot per project, explained under [Project bar](/docs/projects-and-workspaces#project-bar). The Board sorts the sessions into columns.

In a plain terminal, the session shows **Running**, with the command's name, while something runs, and **Idle** back at the prompt. A session with no process shows the process state, such as **Interrupted**, **Exited** or **Failed**.

## Notifications

When an agent finishes its turn or asks for permission, Persisty tells you, unless you are already looking at that session. With the Persisty window in focus, an alert shows in the corner, with a **View** button; with another window in front, the system notification comes instead. Both come with a short sound. Alerts and sound start on. To change them, use **Settings › Notifications**, where **Send a test** shows how they look.

## The Board

With several sessions running, the Board answers who is waiting for you, for how long and what they want. It shows the agent sessions of every project in four columns: **Needs you**, **Working**, **Answered** and **Error**. Open it with the button beside the tabs or with <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>.

Each card says in one line what the session wants: the command waiting for permission, the question the agent asked, the end of its answer or the error, such as "Usage limit reached". An answer that ends in a question goes to **Needs you**, and a permission you approved in the terminal itself leaves the column on its own within a few seconds. Answers and errors you have not opened yet show in bold, with a dot.

The session that has waited longest gets the amber frame, and the <kbd>A</kbd> key opens it. Clicking a card opens the session, and <kbd>Esc</kbd> goes back to the terminal. At the top you can switch **All projects** to **This project**.

On Windows and Linux the shortcut is Ctrl+Shift+O. With the **WebStorm (macOS)** keymap, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> with the cursor in the code opens a file by name; there, use the button.

## The mascot outside the app

On macOS, the mascot can leave the terminal's corner and stand on your windows, on top of any app. That way it tells you things while you are in your editor or browser, without you having to look at Persisty. It starts off: turn it on in **Settings › Appearance › Mascot outside the app**.

When a session asks for you, it rises, shows how many are waiting and says which one, such as "checkout asks for permission". Clicking what it says opens the session. A click on the mascot opens a balloon with who is waiting, for how long and what they asked for, with shortcuts to the session and to the Board. Clicking or dragging the mascot does not take the focus away from the app you are in.

It stands on top of the front window, rides along when the window moves and falls when it goes away; when nothing is happening, it sits down and dozes. Drag it anywhere, on any display, and it remembers where. To keep it only where you put it, turn off **The mascot walks on your windows** on the same screen. In the balloon, **Do not disturb** stops it rising and speaking, but the count goes on.

With the mascot outside the app, the one in the terminal goes away. Quitting Persisty closes the mascot.

## Where the state comes from

In Claude Code, the state comes from Claude's own **hooks**: events it fires when it starts, when it receives a request, when it stops and when it asks for permission. Persisty injects these hooks into each session with `--settings`, in a file of its own. Your `~/.claude/settings.json` is never changed.

If Claude Code shows the folder trust prompt ("Yes, I trust this folder"), the prompt comes before any hook. Persisty does not skip it: the state stays unknown until you answer in the terminal. Meanwhile the session shows as **Idle**, and the Board says **No word from the agent**.

## Codex CLI

Codex CLI opens and persists like any session: it gets a tab and a row in the workspace card, and Persisty reattaches the terminal when you reopen the app with it still running.

Two things do not work yet. The first is the state: Persisty does not change Codex's configuration and does not receive its events, so the session shows as **Idle** while it runs and sends no notifications. The second is resuming the conversation: after the computer restarts, the session comes back as a plain terminal in its folder, without Codex, and the restore report says **Relaunched**. In **Settings › Agents**, Codex CLI shows its resume and status as **Not verified**.

## Model per session

In Claude Code, the session footer has a model picker. Your choice is saved and passed with `--model` on every launch and resume. In a session that is already open, Persisty types `/model` for you. In Codex CLI, the footer only shows the agent's name, with no picker.

## Default agent

<kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> opens a session with the default agent straight away in the current workspace, and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> comes with it already chosen. The default is Claude Code; change it in **Settings › Agents › Default agent**. If the chosen one is not installed, the first installed agent is used.

## Tools for the agents

**Persisty tools in agents**, in **Settings › Agents**, gives Claude Code sessions tools that read the project, its sessions and the output of the workspace commands. None of them types into another terminal. It starts off and applies to sessions that start or restart after you turn it on; **Check installation** tests that it works. For Codex CLI, the same screen shows a command for you to run once in a terminal, because Persisty does not change Codex's configuration; that route is marked **Not verified**.

Other MCP servers, such as GitHub, Sentry or Supabase, are installed in **Settings › MCP servers** and switched on per project in **Project settings › MCP servers**. They only apply to Claude Code sessions that start or restart afterwards.
