---
title: Workspace commands
description: The commands Persisty finds in the workspace folder and your own, to run with one key and see each one's output in a tab below the terminal.
group: code
order: 8
---

Each workspace has its own commands, such as `pnpm dev` or `cargo test`, in a picker beside the session tabs. A command runs in its own terminal, in the workspace folder, and its output goes to a tab below the session's terminal.

## Choose the command

The picker shows the chosen command's name, or **No commands**. A click opens the list of what Persisty finds at the root of the folder: the `package.json` scripts (with pnpm, yarn, bun or npm, as the lockfile implies), Cargo, Makefile targets, Gradle, Maven, Go, Python (Django's `manage.py` or `pytest`) and Docker Compose. It only reads the files; nothing runs to find them.

Commands that are not listed come in through **Add command…**: write the **Command** and, if you like, a **Name**; left empty, the name is the command itself. They go under **My commands**, and the bin beside each one removes it.

## Run

The play button beside the picker, or <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd>, runs the chosen command and opens its output. While it runs, the same button and the same key stop it.

Beside the picker, the state is written out: **Running**, **Done**, **Failed · code N**, **Stopped** or **Ended**. A click on it opens or collapses the output.

## The command output

The **Command output** sits below the session's terminal, with one tab per command run and a dot with each one's state. <kbd>⌘</kbd> <kbd>E</kbd>, or the arrow in the corner, opens and collapses the output; collapsed, it still shows the tabs.

While the command runs, its tab shows the command's terminal, live. Once it ends, the tab shows its last 400 lines, with **Run again**. Running the same command again replaces the old tab with the new one, and the **×** of a finished tab closes it.

## Stop

**Stop** sends Ctrl-C to the command, as in the terminal, and keeps the output. If it has not stopped after 5 seconds, it is ended, and what it printed until then is kept. A command you stopped shows as **Stopped**, never as **Failed**.

## Plan and limits

Workspace commands are on the free plan. **Check on finish with…**, in the same picker, is Pro; see [Check on finish](/docs/verify).

Persisty only looks for commands at the root of the workspace folder, not in subfolders. On Windows and Linux, which are in preview, use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>.
