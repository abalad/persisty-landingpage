---
title: Agents and states
description: How Persisty recognises Claude Code and Codex and shows who is working, who is waiting for you and who is asking for permission.
group: start
order: 4
---

Persisty recognises agents in two ways: when you open the session as Claude Code or Codex, and when you type `claude` in a plain terminal opened by Persisty. Either way, the session gets the agent's icon, state and cost.

## The states

| State | Meaning |
| --- | --- |
| Working | The agent received a request and has not finished yet. |
| Waiting for you | It finished its turn and is waiting for the next request. |
| Permission pending | It wants to run something and is waiting for your "yes" in the terminal. |
| Idle | Open, with no request in progress. |
| Ended | The conversation is over. |

States show on the tab, on the workspace card, in the project bar, in the agent list and on the Board. They always come with an icon and a word, never with colour alone.

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

If Claude Code shows the folder trust prompt ("Yes, I trust this folder"), the prompt comes before any hook. Persisty does not skip it: the state stays unknown until you answer in the terminal.

## Codex

Codex opens and persists like any session. You have to approve its hooks inside Codex itself (`/hooks`). Without that approval, the state stays unknown. Resume after a restart has not been confirmed yet, and Persisty marks this.

## Model per session

The session footer has a model picker. Your choice is saved and passed with `--model` on every launch and resume. In a session that is already open, Persisty types `/model` for you.
