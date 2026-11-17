---
title: Getting started
description: What Persisty is, how to install it and how to open your first project with an agent session.
group: start
order: 1
---

Persisty is a desktop app for people who maintain several software products and work with AI agents in the terminal, such as Claude Code and Codex. It organises your terminals by project, shows each agent's state and [quota](/docs/usage-and-quota) and [brings the sessions back](/docs/sessions-and-recovery) after a crash or a restart.

The free plan needs no account: a [Persisty account](/docs/account-and-license) only exists for the [paid plans](/docs/pro). Everything on this page is on the free plan.

## Install

1. Download the version for your system from the [download page](/download).
2. Install it:
   - On a Mac, open the DMG and drag Persisty into the Applications folder. The app is signed and notarised by Apple.
   - On Windows, which is in preview and unsigned, run the installer. If SmartScreen warns you, click **More info › Run anyway**.
   - On Linux, also in preview and unsigned, use the AppImage or the `.deb` package. The AppImage needs to be made executable: `chmod +x Persisty_*.AppImage`.
3. Open Persisty. What it uses to keep your sessions ships inside the app, with nothing to install separately.
4. To use agents, have [Claude Code](https://docs.claude.com/en/docs/claude-code) installed and signed in. Plain terminals work without it. The git features, such as the branch, the changes and cloning a repository, use the git on your computer.

On the first screen, **On this machine** shows what Persisty found: **Persistent sessions**, marked **ready** when sessions can be kept, and Claude Code and Codex CLI, with each one's version or **not found**. Persisty looks for agents when it opens: an agent installed later only appears in **New session** once you reopen the app.

### New versions

The app looks for new versions when it opens and every 6 hours. When one is out, a notice shows its number, **What's new** and **Install and restart**; the notice's **×**, **Skip this version**, hides that version only. On a Mac, the app downloads, installs and restarts without asking anything, and reattaches the open sessions when it comes back. On Windows and Linux, if sessions are open, it warns you first that they may be ended. From the Linux `.deb`, the notice takes you to the download page. In [**Settings › About**](/docs/settings#about) you can check right away or turn off **Check for updates automatically**; the rest is in [Updates](/docs/updates).

## Create your first project

A **project** is one of your products or clients, not a folder. Inside it are the **workspaces**: that product's folders and repositories.

1. Click **Create first project**, on the screen that shows the first time you open Persisty, or the **+** in the project bar, on the left. In **New project**, give it a name and click **Create project**.
2. The project opens empty. Drag a folder from Finder onto **Add workspace**, or click and choose one. It becomes the first workspace; if it is a git repository, Persisty shows the branch and the changes. For a repository that is not on your computer yet, use [**Clone a repository**](/docs/projects-and-workspaces#clone-a-repository): it downloads from GitHub, GitLab, Bitbucket or any git link and adds it as a workspace. On the same screen, **Standalone terminal** (<kbd>2</kbd>) and a standalone agent, such as **Standalone Claude Code** (<kbd>3</kbd>), open **New session** for a session in any folder, outside a workspace.
3. The product's other repositories (API, app, website) come in through the **Add workspace** card at the end of the bottom strip, which can clone too. The drop area only shows while the project is empty.

On the first screen, **How it works**, or the <kbd>?</kbd> key, opens a one-minute guide to how Persisty organises your work. After that, the guide lives in **First steps**, at the bottom of the project bar, and in **First steps guide**, in the palette (<kbd>⌘</kbd> <kbd>K</kbd>).

## Open a session

With the workspace selected, press <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>. In **New session**, choose **Claude Code** or **Codex CLI** for an agent session, or **Terminal** for a plain shell (dev server, tests, whatever you like), and click **Create and open**.

In that window, the [default agent](/docs/agents#default-agent) comes already chosen. To skip the dialog, <kbd>⌘</kbd> <kbd>N</kbd> opens a terminal and <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> opens the default agent, both in the current workspace. In a workspace with no sessions, the screen lists `terminal`, `claude` and `codex`, and the keys <kbd>1</kbd>, <kbd>2</kbd> and <kbd>3</kbd> open each one. On Windows and Linux, use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>.

The session shows as a tab at the top and as a row in the workspace card at the bottom. The tab shows the agent's state as a coloured dot, with the word in its tooltip when you hover over it: **Working**, **Done**, **Permission pending**, **Idle** or **Ended**. The session header and the workspace card show the word directly. In a plain terminal, it says what is running, such as **Running · pnpm dev**, and a session with no process shows the process state, such as **Exited**; see [The states](/docs/agents#the-states).

## Next steps

- [Projects and workspaces](/docs/projects-and-workspaces): how Persisty organises your work.
- [Sessions and terminals](/docs/sessions): opening, naming and closing sessions, and each session's side panel.
- [Coming back after a crash](/docs/sessions-and-recovery): what happens after a crash or a restart.
- [Agents and states](/docs/agents): how to tell which agent needs you.
- [Settings, screen by screen](/docs/settings): every option in the app and its default.
- [What Persisty does not do yet](/docs/troubleshooting#what-persisty-does-not-do-yet): today's limits, so you do not look for what is not there yet.
