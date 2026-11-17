---
title: Board
description: The agent sessions of every project in four columns, to see who is waiting for you, for how long and what they want.
group: agents
order: 2
---

With several sessions running, the Board answers who is waiting for you, for how long and what they want. It shows the agent sessions of every project in four columns, and a click on a card opens the session.

![The Board with the sessions of every project in four columns: the A key opens the one that has waited longest, and ⌘⇧O goes back to the Board.](/changelog/0.10.0/quadro.mp4)

## Open the Board

Open it with the button beside the tabs, with <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> or with **Session board** in the command palette (<kbd>⌘</kbd> <kbd>K</kbd>). The Board takes the terminal's place. To go back, use **Back to the terminal**, <kbd>Esc</kbd> or the same key.

At the top, switch **All projects** to **This project** to see only the current project's sessions. Beside it are three counts: how many sessions need you, with the longest wait; how many are working; and how many new cards you have not opened yet, such as **2 unread**. Clicking the first one opens the session that has waited longest.

## The columns

**Needs you** gathers permission requests, the agent's questions and answers that end in a question, from the oldest wait to the newest. A permission you approved in the terminal itself leaves the column on its own within a few seconds.

**Working** says what each agent is doing now, such as "Editing" or "Running", followed by the file or the command. **Answered** shows the end of the last answer; sessions that are only waiting for their next request, with nothing new to read, fold away at the bottom, in a group such as **3 idle sessions**. **Error** shows turns that failed, such as "Usage limit reached", and processes that stopped with an error.

## The cards

Each card says in one line what the session wants: the command waiting for permission, the question the agent asked, the end of its answer or the error. Beside the name is how long ago. Below are the project, or the workspace under **This project**, and the branch, when it is not the main one.

Answers and errors you have not opened yet show in bold, with a dot. The session that has waited longest gets the amber frame and the hint <kbd>A</kbd> **opens this one**. A session Persisty has no news of yet, such as a Claude Code stuck on the folder trust prompt, says **No word from the agent**.

## Keys

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> opens and closes the Board. With it open, <kbd>A</kbd> opens the session that has waited longest and <kbd>Esc</kbd> goes back to the terminal. Those two do nothing while you type in a field or with a dialog open on top.

On Windows and Linux, which are in preview, the shortcut is <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd>. With the **WebStorm (macOS)** keymap, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> with the cursor in the code opens a file by name; there, use the button.

## Plan and limits

The Board is on the free plan. It only opens sessions: it never answers a permission or a question for you, and the answer is still given in the session's terminal.

Interrupted sessions, such as the ones left that way after the computer restarts, and ended conversations stay off the Board; see [Coming back after a crash](/docs/sessions-and-recovery).
