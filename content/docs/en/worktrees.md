---
title: Own folder
description: A session on a branch and in a folder of its own, a git worktree, so two agents never edit the same files.
group: agents
order: 9
---

In git folders, a new session can get a `persist/<name>` branch in a folder of its own, a git worktree. That way two agents work in the same repository without ever editing the same files.

## Create the folder

In [**New session**](/docs/sessions#new-session), with a git folder, turn on **Own folder (worktree)**. The hint shows the new branch and where it starts from, such as "New branch persist/pagamento-pix from main, in a folder for this session only." The name comes from the session's name, in lower case and without accents, and gets a number if it is already taken; change it under **New branch**. The branch starts from whatever is checked out in the folder now.

The session opens in the new folder, in the same subfolder you picked, and the header shows the `worktree` tag; hovering over it shows the folder and the branch. It works for any session, agent or terminal. The new folder only has what is in the starting commit: uncommitted changes and what git ignores, such as `node_modules`, `.env` and builds, stay in the original folder.

## Where they live

The folders live in `~/.persist/worktrees`, grouped in one folder per repository. To use another, click **Choose…** under [**Settings › Workspace › Worktrees folder**](/docs/settings#workspace); **Use the default** goes back to the usual one. The change applies to new worktrees, and the existing ones stay where they are.

## Close the session

When you close a session with an own folder, Persisty says how many uncommitted files the folder has and how many commits the branch has that its base lacks. Choose **Keep the folder**, which leaves the folder on disk for you to open later as a workspace, or **Remove the folder**. With uncommitted files, removing becomes **Discard and remove**. If git refuses to remove the folder, the session stays stopped and Persisty shows the reason.

The branch stays in the repository in every case: Persisty never deletes the branch.

## Plan and limits

The own folder is [Pro](/docs/pro); without it, the option shows disabled, with the **Pro** tag. It only exists in git folders.
