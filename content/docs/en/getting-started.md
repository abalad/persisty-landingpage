---
title: Getting started
description: What Persisty is, how to install it and how to open your first project with an agent session.
group: start
order: 1
---

Persisty is a desktop app for people who maintain several software products and work with AI agents in the terminal, such as Claude Code and Codex. It organises your terminals by project, shows each agent's state and quota and brings the sessions back after a crash or a restart.

The free plan needs no account: a Persisty account only exists for the paid plans. Everything on this page is on the free plan.

## Install

1. Download the version for your system from the [download page](/download).
2. Install it:
   - **Mac**: open the DMG and drag Persisty into the Applications folder. The app is signed and notarised by Apple.
   - **Windows** (preview, unsigned): run the installer. If SmartScreen warns you, click **More info › Run anyway**.
   - **Linux** (preview, unsigned): use the AppImage or the `.deb` package. The AppImage needs to be made executable: `chmod +x Persisty_*.AppImage`.
3. Open Persisty. What it uses to keep your sessions ships inside the app, with nothing to install separately.
4. To use agents, have [Claude Code](https://docs.claude.com/en/docs/claude-code) installed and signed in. Plain terminals work without it. The git features, such as the branch, the changes and cloning a repository, use the git on your computer.

On the first screen, **On this machine** shows what Persisty found: **Persistent sessions**, marked **ready** when sessions can be kept, and Claude Code and Codex CLI, with each one's version or **not found**. An agent installed later only shows up once you reopen Persisty.

### New versions

The app looks for new versions when it opens and every 6 hours. When one is out, a notice shows its number, **What's new** and **Install and restart**; **Skip this version** hides that version only. On a Mac, the app downloads, installs and restarts without asking anything, and the open sessions come back with it. On Windows and Linux, if sessions are open, it warns you first that they may be ended. From the Linux `.deb`, the notice takes you to the download page. In **Settings › About** you can check right away or turn off **Check for updates automatically**.

## Create your first project

A **project** is one of your products or clients, not a folder. Inside it are the **workspaces**: that product's folders and repositories.

1. Click **Create first project**, on the screen that shows the first time you open Persisty, or the **+** in the project bar, on the left. In **New project**, give it a name and click **Create project**.
2. The project opens empty. Drag a folder from Finder onto **Add workspace**, or click and choose one. It becomes the first workspace; if it is a git repository, Persisty shows the branch and the changes. For a repository that is not on your computer yet, use **Clone a repository**: it downloads from GitHub, GitLab, Bitbucket or any git link and adds it as a workspace.
3. The product's other repositories (API, app, website) come in through the **Add workspace** card at the end of the bottom strip, which can clone too. The drop area only shows while the project is empty.

On the first screen, **How it works** opens a one-minute guide to how Persisty organises your work. After that, the guide lives in **First steps**, at the bottom of the project bar.

## Open a session

With the workspace selected, press <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>. In **New session**, choose what to open and click **Create and open**:

- **Claude Code** or **Codex CLI**, for an agent session;
- **Terminal**, for a plain shell (dev server, tests, whatever you like).

The default agent comes already chosen. To skip the dialog, <kbd>⌘</kbd> <kbd>N</kbd> opens a terminal and <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> opens the default agent, both in the current workspace. In a workspace with no sessions, the screen lists `terminal`, `claude` and `codex`, and the keys <kbd>1</kbd>, <kbd>2</kbd> and <kbd>3</kbd> open each one. On Windows and Linux, use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>.

The session shows as a tab at the top and as a row in the workspace card at the bottom. The tab shows the agent's state as a coloured dot, with the word in its tooltip when you hover over it: **Working**, **Done**, **Permission pending**, **Idle** or **Ended**. The session header and the workspace card show the word directly.

## Next steps

- [Projects and workspaces](/docs/projects-and-workspaces): how Persisty organises your work.
- [Sessions and terminals](/docs/sessions): opening, naming and closing sessions, and each session's side panel.
- [Coming back after a crash](/docs/sessions-and-recovery): what happens after a crash or a restart.
- [Agents and states](/docs/agents): how to tell which agent needs you.
- [What Persisty does not do yet](/docs/troubleshooting#what-persisty-does-not-do-yet): today's limits, so you do not look for what is not there yet.
