---
title: Projects and workspaces
description: How Persisty organises products, folders, sessions and agents in a single window.
group: start
order: 2
---

Persisty organises work in three levels, from largest to smallest.

| Level | What it is | Where it shows |
| --- | --- | --- |
| Project | One of your products, clients or businesses | Project bar, on the left |
| Workspace | A folder of that project, with or without git | Cards in the bottom strip |
| Session | A terminal: an agent or a shell | Tabs at the top |

## Project bar

Each project is a block with the first two letters of its name. In **Project settings** you can swap them for other initials, a symbol or an image.

A dot in the corner of the block tells you how the project stands: yellow when an agent has finished and is waiting for you or is asking for permission, blue when an agent is working, green when sessions are running, and a hollow ring when there are sessions to restore. The dot shows the most urgent one, and hovering says the same in words, such as "2 waiting for you".

Press <kbd>⌘</kbd> <kbd>B</kbd> to expand the bar. Expanded, it shows each project's name and state and the **Agents** list, with each agent's state and workspace. The filter switches between the agents of the current project and the agents of all projects.

Switch projects with <kbd>⌘</kbd> <kbd>1</kbd> to <kbd>⌘</kbd> <kbd>9</kbd>. To change the order, drag a project, or use <kbd>⌥</kbd> <kbd>↑</kbd> and <kbd>⌥</kbd> <kbd>↓</kbd> with it in focus.

Right-click a project to open **Project settings**, with its name, description and icon, or **Project data**, with the project's numbers and this month's estimated AI spend.

## Archive and delete projects

**Archive project**, in **Project settings**, takes the project out of the sidebar; its sessions and workspaces stay recorded. If sessions are open, you choose between **Archive and keep open** and **End and archive**.

Archived projects are in **Archived projects**, which opens from the counter below the project list, with the bar expanded, or from the palette (<kbd>⌘</kbd> <kbd>K</kbd>). There, **Restore** puts the project back in the bar, with its workspaces and sessions, and **Delete** removes the project from Persisty for good, ending any sessions still running. Deleting asks what to do with the folders: **Delete from Persisty only** leaves everything on your computer, and **Delete and remove the folders** shows which ones go to the Trash before you confirm. A folder another project uses, your home folder and the disk's root stay where they are.

## Workspaces

Each card in the bottom strip is a folder of the project. When the folder is a git repository, the card shows the branch and how many files changed. Inside the card are that workspace's sessions, each with its state in words.

To add another, use the **Add workspace** card at the end of the strip: it takes a folder on your computer or clones a remote repository. Drag the cards to change their order, or use <kbd>⌥</kbd> <kbd>←</kbd> and <kbd>⌥</kbd> <kbd>→</kbd> with a card in focus. To take a workspace out of the project, use **Remove from project** in the **Details** panel, or **Remove workspace** on the screen of a workspace with no sessions. The folder's files do not change.

The **Standalone** card holds sessions that do not belong to any workspace. <kbd>⌘</kbd> <kbd>J</kbd> collapses the strip into icons when you want more room for the terminal.

## Sessions

The tabs at the top are the sessions of the selected workspace. The **+** opens a new terminal right there; <kbd>⌘</kbd> <kbd>←</kbd> and <kbd>⌘</kbd> <kbd>→</kbd> move to the previous or next session. Drag a tab to change the order, or use <kbd>⌥</kbd> <kbd>←</kbd> and <kbd>⌥</kbd> <kbd>→</kbd> with it in focus.

The session header shows the name, the state and the folder's branch. The branch follows switches made in the terminal, and clicking it opens a picker with search to switch or create branches.

## Workspace commands

The command picker, beside the tabs, lists what Persisty finds in the folder: the `package.json` scripts (with the package manager the lockfile implies), Cargo, Makefile targets, Gradle, Maven, Go, Python and Docker Compose. It only reads the files; nothing runs to find them. Commands you run all the time that are not listed there come in through **Add command…** and go under **My commands**.

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> runs the chosen command, or stops the one running, and <kbd>⌘</kbd> <kbd>E</kbd> opens and collapses the **Command output**. Each run becomes a tab there, with its state written out: **Running**, **Done**, **Failed · code N**, **Stopped** or **Ended**. Stopping a command sends Ctrl-C, as in the terminal, and keeps the output; if it has not stopped after 5 seconds, it is ended.
