---
title: Projects and workspaces
description: How Persisty organises products and folders, and how to create, set up, reorder, archive and delete projects and workspaces.
group: start
order: 2
---

Persisty organises work in three levels, from largest to smallest.

| Level | What it is | Where it shows |
| --- | --- | --- |
| Project | One of your products, clients or businesses | Project bar, on the left |
| Workspace | A folder of that project, with or without git | Cards in the bottom strip |
| Session | A terminal: an agent or a shell | Tabs at the top |

Sessions have a page of their own, [Sessions and terminals](/docs/sessions). Projects and workspaces are on the free plan.

## Project bar

Each project is a block with the first two letters of its name. A dot in the corner of the block tells you how the project stands: yellow when an agent has finished and is waiting for you or is asking for permission, blue when an agent is working, green when sessions are running, and a hollow ring when there are sessions to restore. The dot shows the most urgent one, and hovering says the same in words, such as "2 waiting for you".

Press <kbd>⌘</kbd> <kbd>B</kbd> to expand the bar. Expanded, it shows each project's name and state and the **Agents** list, with each agent's state and workspace; the filter switches between **Project** and **All**. Switch projects with <kbd>⌘</kbd> <kbd>1</kbd> to <kbd>⌘</kbd> <kbd>9</kbd>. On Windows and Linux, which are in preview, use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>.

To create a project, use the **+** in the bar. In **New project**, give it a **Name** and, if you like, a **Description**, and click **Create project**. The **Identifier** is made from the name and never changes.

## Project settings

Right-clicking a project opens **Project settings** or **Project data**, two parts of the same window.

**General** holds the name, the description and the icon, which can be other initials (up to two characters), a symbol from the list or a PNG, JPG, WebP or SVG image of up to 5 MB; these changes apply when you click **Save**. It also has the project's **Claude account**, a [Pro](/docs/pro) feature (see [AI accounts and rotation](/docs/ai-accounts)), and **Archive project**.

**Overview** shows the project's numbers, such as workspaces, active sessions and sessions to restore, and this month's [estimated AI spend](/docs/usage-and-quota), with **Open detailed usage**. **Workspaces** and **Sessions** list the project's folders and terminals. **Tasks** chooses where the [issues](/docs/issues#link-it-to-the-project) to start sessions from come from, and **MCP servers**, which [MCP servers](/docs/mcp-servers#switch-it-on-in-a-project) the project's agent sessions get.

## Archive and delete projects

**Archive project**, in **Project settings**, takes the project out of the sidebar; its sessions and workspaces stay recorded. If sessions are open, you choose between **Archive and keep open** and **End and archive**.

Archived projects are in **Archived projects**, which opens from the counter below the project list, with the bar expanded, or from the palette (<kbd>⌘</kbd> <kbd>K</kbd>), when there is one. There, **Restore** puts the project back in the bar, with its workspaces and sessions. In the palette, choosing an archived project also restores and opens it.

Only an archived project can be deleted: **Delete**, on its row in **Archived projects**, removes the project from Persisty for good, with its sessions, workspaces and commands, and ends any sessions still running. Deleting asks what to do with the folders: **Delete from Persisty only** leaves everything on your computer, and **Delete and remove the folders** shows which ones go to the Trash before you confirm. A folder another project uses, your home folder, the disk's root and Persisty's data stay where they are.

## Workspaces

Each card in the bottom strip is a folder of the project. When the folder is a git repository, the card shows the branch and how many files changed. Inside the card are up to three of that workspace's sessions, each with its state in words, and clicking one opens it. The card's footer says how many sessions are active and how long ago there was activity.

A workspace with no sessions shows the folder's path and the shortcuts to open one; see [New session](/docs/sessions#new-session). Each workspace also has its own [commands](/docs/commands), in the picker beside the tabs.

The **Standalone** card holds sessions that do not belong to any workspace, opened in any folder, and shows when there is one of them or when the project has no workspaces yet. <kbd>⌘</kbd> <kbd>J</kbd> collapses the strip into icons when you want more room for the terminal.

To take a workspace out of the project, use **Remove from project** in the **Details** panel, or **Remove workspace** on the screen of a workspace with no sessions. The folder's files do not change.

## Add a workspace

The **Add workspace** card, at the end of the strip, opens the window of the same name with two sources: **Folder on this computer** and **Remote repository**. In a project that is still empty, the project screen also takes a folder dragged from Finder; there, <kbd>1</kbd> chooses a folder, <kbd>4</kbd> goes straight to the remote repository, and <kbd>2</kbd> and <kbd>3</kbd> open **New session** for a standalone terminal or agent.

With **Folder on this computer**, type the full path or click **Choose folder…**. On Windows, the path starts with the drive letter, such as `C:\`. Persisty reads the folder and shows what it found: **Git repository** or **Plain folder**, the branch and the remote. The **Name** is what the cards and tabs show, and **Add workspace** finishes.

## Clone a repository

With **Remote repository**, paste the repository's link; any git address works. With no account connected, the field is called **Link**, and **Your repositories** offers to connect GitHub or GitLab right there; Bitbucket and a company's GitLab are in [**Settings › Integrations**](/docs/settings#integrations); see [GitHub, GitLab and Bitbucket](/docs/forges). With an account connected, the field becomes **Link or search** and lists your repositories, with a filter by service, and private ones can be cloned too.

Persisty shows the repository, the default branch and the account that will clone it. The suggested destination is next to the project's last workspace. In a project with no workspaces, it is the **Default folder for clones**, which starts as `~/Documents/GitHub` and changes in **Settings › Integrations**. If the destination folder already has that repository, it is just added; if it has something else, change the name or the place.

**Clone and add** downloads the repository and shows the progress, phase by phase. **Cancel**, or closing the window, stops the clone. At the end, the folder becomes a workspace of the project. Cloning uses the git on your computer; without it, Persisty asks you to install git.

## Change the order

Projects, workspaces and session tabs stay in the order you leave them. Drag to change it, or use the keyboard with the item in focus: <kbd>⌥</kbd> <kbd>↑</kbd> and <kbd>⌥</kbd> <kbd>↓</kbd> in the project bar, <kbd>⌥</kbd> <kbd>←</kbd> and <kbd>⌥</kbd> <kbd>→</kbd> on workspace cards and tabs. Right-clicking a tab also offers **Move left** and **Move right**. While dragging, <kbd>Esc</kbd> puts the item back. The **Standalone** card always stays last.
