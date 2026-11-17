---
title: Settings, screen by screen
description: Every Settings tab, in the app's order, with its options, the default of each one and the page that explains the feature.
group: reference
order: 2
---

**Settings** opens with <kbd>⌘</kbd> <kbd>,</kbd>. The tabs sit in five groups: **Interface** (Appearance, Workspace, Notifications), **Code** (Editor, Terminal, Files), **Agents** (Agents, AI accounts, Voice), **Connections** (Integrations, MCP servers, AI usage, Privacy & network) and **Persisty** (Shortcuts, Account, About). This page follows that order; an option's name links to the page that explains the feature, when there is one.

## Appearance

Theme, language and the mascot.

| Option | Default |
| --- | --- |
| **Theme** | **Dark**. Also **Light** or **System**, which follows your computer's light or dark mode |
| **Language** | **Português (Brasil)**. Also **English**. Changes the interface text |
| [**Mascot in the terminal**](/docs/mascot#in-the-terminal) | on. With the mascot outside the app, the terminal's one goes away |
| [**Mascot outside the app**](/docs/mascot#outside-the-app) | off. macOS only |
| [**The mascot walks on your windows**](/docs/mascot#outside-the-app) | on. Applies with the mascot outside the app |

## Workspace

Saving, the IDE, the panel split and where your own folders go.

| Option | Default |
| --- | --- |
| [**Save automatically**](/docs/editor#save-automatically) | off. On, it saves 1 s after the last edit, never over a change made outside the editor |
| [**Default IDE**](/docs/files#open-in) | **None**. The list holds the IDEs Persisty finds on the computer |
| [**Panel size**](/docs/sessions#side-panel) | **Reset** puts the editor and terminal back to the default split in every session |
| [**Worktrees folder**](/docs/worktrees#where-they-live) | `~/.persist/worktrees`. **Choose…** changes it, and **Use the default** goes back; applies to new worktrees |

## Notifications

The **When an agent needs you** group.

| Option | Default |
| --- | --- |
| [**Mute while Persisty is focused**](/docs/notifications#set-them-up) | on. With the window focused, no system notification is sent |
| [**In-app alerts**](/docs/notifications#set-them-up) | on |
| [**Play a sound**](/docs/notifications#set-them-up) | on |
| [**Send a test**](/docs/notifications#send-a-test) | fires the alert, the sound and the system notification at once |

## Editor

The groups, in order: **Font**, **Behavior**, **Shortcuts**, **Markdown**, **Minimap**, **Line author (git blame)** and **Tabs**. Changes apply right away in open editors.

| Option | Default |
| --- | --- |
| **Font family** | empty, which uses the default stack: SF Mono, Menlo, Monaco and others |
| **Size** | 13, from 8 to 32 |
| **Weight** | normal |
| **Line height** | 1.55, from 1 to 2.5 |
| **Ligatures** | off. Only with fonts that have them, like Fira Code and JetBrains Mono |
| **Tab width** | 2, from 1 to 8 |
| **Insert spaces** | on. Off, the Tab key inserts a tab character |
| **Wrap lines** | off |
| **Line numbers** | on |
| [**Sticky scroll**](/docs/editor#sticky-scroll-and-minimap) | off |
| **Multi-cursor modifier** | **⌘ (Ctrl)**. Also **⌥ (Alt)** |
| [**Keymap**](/docs/editor#keymap) | **WebStorm**. Also **WebStorm (macOS)** and **VS Code** |
| [**Open .md files in**](/docs/editor#markdown-and-images) | **Code**. Also **Preview** |
| [**Show the minimap**](/docs/editor#sticky-scroll-and-minimap) | off |
| **Drawing** | **Characters**. Also **Blocks** |
| **Scale** | 1. Also 2 and 3 |
| **Visible area** | **On hover**. Also **Always** |
| **Hide until hovered** | off |
| [**Show the author at the end of the line**](/docs/git-in-the-editor#line-author) | on |
| **Author**, **Date** and **Message** | on |
| **Delay** | 600 ms. Also 300, 1000 and 2000 ms |
| [**Tab limit**](/docs/tabs-and-groups#tab-options) | 20. Also 10, 30, 50 and **No limit** |
| **On close, go to** | **The tab used before**. Also **The neighbour tab** |
| **Open new tab** | **At the end**. Also **Right after the current one** |
| **Show the folder for repeated names** | on |
| **Mark unsaved tabs** | **Dot**. Also **Name in italics** |
| **Preview tab** | off |

**Weight** goes from 100 to 900, plus normal and bold. The minimap's options show with it on, and the line author's with **Show the author at the end of the line** on.

**Multi-cursor modifier** is the key that adds another cursor when you click. With **⌘ (Ctrl)**, clicking a name goes to its definition when the file has a language server; off a name, or in a file with no server, the click adds the cursor. For a block selection, drag holding <kbd>⌥</kbd> with **⌘ (Ctrl)**, or <kbd>⌥</kbd> <kbd>⌘</kbd> with **⌥ (Alt)**.

## Terminal

The groups, in order: **Font**, **Cursor**, **Display** and **Keyboard**. Changes apply right away, without restarting the sessions.

| Option | Default |
| --- | --- |
| **Font family** | empty, which uses the same default stack as the editor |
| **Size** | 13, from 8 to 32 |
| **Weight** | normal |
| **Bold weight** | bold |
| **Line height** | 1.2, from 1 to 2 |
| **Style** | **Block**. Also **Underline** and **Bar**. Programs can change the shape |
| **Blink** | on |
| **Inner spacing (px)** | 8, from 0 to 40 |
| **Renderer** | **WebGL**. Also **DOM (compatibility)**, slower but works everywhere |
| **History lines** | 5,000, from 1,000 to 50,000 |
| **Option as Meta** | on. Turn it off to type symbols with <kbd>⌥</kbd> |

## Files

**Hide files** lists patterns such as `**/node_modules`, and whatever matches one of them is left out of the tree, the search and **Open file**. The factory pattern is `**/.DS_Store`. Each pattern has a switch and a button to remove it; **New pattern** and **Add** put in another. `.git` is always hidden, and a repeated or invalid pattern is refused with the reason. See [Hide files](/docs/files#hide-files).

## Agents

| Option | Default |
| --- | --- |
| **Terminals and agents** | shows **ready** when terminals can open on this computer |
| [**Default agent**](/docs/agents#default-agent) | **Claude Code**. Also **Codex CLI** and **Terminal**; a missing agent shows "(not installed)" |
| [**Persisty tools in agents**](/docs/agent-access#turn-it-on) | off |
| [**Check installation**](/docs/agent-access#check-installation) | tests the server of those tools, step by step |
| [**Codex CLI**](/docs/agent-access#codex-cli) | the command to run once in a terminal, with **Copy** and the **Not verified** tag |
| [**Detected agents**](/docs/agents#detected-agents) | the version and path of Claude Code and Codex CLI and what each one supports, such as **Resume** and **Status via hooks**, with what is **Not verified** or **Not supported** |

The three rows for Persisty's tools sit in the **Agent access (MCP)** group. If **Terminals and agents** shows **unavailable**, reopen Persisty; if it keeps happening, reinstall the app.

## AI accounts

The list shows the Claude Code accounts, with this computer's marked **This computer** and the quota windows of each one.

| Option | Default |
| --- | --- |
| [**Another account › Connect account**](/docs/ai-accounts#connect-an-account) | only this computer's account. Pro |
| [**Rotate between accounts**](/docs/ai-accounts#rotation) | off. Pro |
| [**Switch accounts at**](/docs/ai-accounts#rotation) | 90%. Also 80%, 95% and **100% · only at the limit**. Shows with rotation on |
| [**Go on with the task the limit cut**](/docs/ai-accounts#carry-on-after-the-limit) | on. Pro |
| [**Use only for the projects pinned to it**](/docs/ai-accounts#one-account-for-a-project) | off, on each connected account. Pro |

Each connected account has a button to disconnect it, which asks you to confirm with **Disconnect**. With rotation on, the account that will get the next session shows **Next in rotation**.

## Voice

With **Voice dictation** off, the screen shows only that switch; the other options appear when you turn it on.

| Option | Default |
| --- | --- |
| [**Voice dictation**](/docs/voice#turn-dictation-on) | off |
| [**Shortcut**](/docs/voice#shortcut) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd>. **Change** sets another, and **Default** goes back |
| [**Dictation language**](/docs/voice#language-and-replacements) | **Same as the app**. Also **Português (Brasil)** and **English** |
| [**Voice model**](/docs/voice#voice-model) | **Not downloaded**. **Download** fetches about 640 MB |
| [**Microphone**](/docs/voice#microphone) | the system's default **Input** and, on the Mac, the **Permission** |
| [**Replacements**](/docs/voice#language-and-replacements) | empty. **Try it** shows what a sentence becomes |

## Integrations

The screen shows the **Connected** services first and then the **Available** ones, each with **Connect** or, once connected, the account or the number of accounts; click a service to open its page. GitHub, GitLab and Bitbucket connect accounts to list and clone your repositories; see [GitHub, GitLab and Bitbucket](/docs/forges). Linear, Jira and ClickUp bring issues to start sessions from; see [Issues](/docs/issues#connect-the-service). At the bottom, **Cloning › Default folder for clones** starts as `~/Documents/GitHub`; see [Clone folder](/docs/forges#clone-folder).

## MCP servers

**Installed** lists the servers you installed, and **Available** holds a selection of 16 official servers, with a filter by category. The search also looks in the official MCP registry, and **Add manually** installs a server that is not on the list. Each project picks the servers its sessions get, in the project's settings. See [MCP servers](/docs/mcp-servers).

## AI usage

The **Spend alerts** and **Data sources** groups.

| Option | Default |
| --- | --- |
| [**Daily alert (USD)**](/docs/usage-and-quota#spend-alerts) | empty, which turns the alert off |
| [**Monthly alert (USD)**](/docs/usage-and-quota#spend-alerts) | empty, which turns the alert off |
| [**Data sources**](/docs/usage-and-quota#data-sources) | each source, such as **Claude Code local records**, with "Last sync" and when, **Never synced** or **Not connected** |
| [**Open detailed usage**](/docs/usage-and-quota#estimated-spend) | opens the **AI usage** page |

## Privacy & network

At the top, **Privacy** says that **Telemetry** is off, that **Session data** stays on this machine and that **External integrations** are optional; none of these is a setting. Below, **Network calls since the app opened** lists every outside call, and **Refresh** reads the list again. See [Privacy and network](/docs/privacy-and-network).

## Shortcuts

Every key of the editor keymap and of Persisty, in words and searchable. Nothing changes here: the keymap is in **Editor › Keymap**, and the dictation key in **Voice › Shortcut**. See [The full list](/docs/shortcuts#the-full-list).

## Account

This tab shows only with the Persisty Cloud account signed in. It shows the **E-mail**, the **Plan**, the **License**, which says **valid** or **attention** and until when it works offline, and the **Plan features**; on the free plan, the **Subscription** row has **See plans**. Below are **Refresh license** and **Sign out**. While you are signed in, the Settings footer shows the e-mail, the plan and **Manage account**, which opens this tab; without an account, it has **Sign in** and **Create free account**. See [Account and licence](/docs/account-and-license#plan-and-features).

## About

The groups, in order: **This app**, **Updates** and **Learn more**.

| Option | Default |
| --- | --- |
| **Version** and **System** | the app's version and the system, such as "macOS · Apple Silicon" |
| **Data folder** | where the local database, the hooks and the session records live, with **Show in Finder** |
| [**Check for updates**](/docs/updates#update-in-the-app) | checks right away and says "You're on the newest version" or the new version |
| [**Check for updates automatically**](/docs/updates#turn-off-the-automatic-check) | on: when the app opens and every 6 hours |
| **Learn more** | **What's new**, **Documentation**, **Privacy** and **Terms of use**, each with **Open** |

## Plan and limits

Almost everything in Settings is on the free plan. In **AI accounts**, connecting another account, **Rotate between accounts**, **Go on with the task the limit cut** and **Use only for the projects pinned to it** are Pro. Without Pro, **Connect account** is disabled, rotation and the reservation show the **Pro** tag, and **Go on with the task the limit cut** does not show. The **Worktrees folder** is on every plan, but the [own folder](/docs/worktrees) that goes in it is Pro.

On Windows and Linux, which are in preview, the keys on this page use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>. **The mascot walks on your windows** shows only on macOS.
