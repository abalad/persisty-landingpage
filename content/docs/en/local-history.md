---
title: Local history
description: The versions the editor keeps of each file, only on this computer, to see what changed, go back a version or a chunk and recover a deleted file.
group: code
order: 6
---

The editor keeps the versions of each text file in the session's folder, only on this computer. With them you can see who changed a file and when, compare it with the text as it is now, go back a whole version or just a chunk, and recover a deleted file, including one that never made it into a commit.

## What is kept

A new version goes in when you save, when an open file changes outside the editor, as with an agent's edit, and before Persisty renames, moves, replaces, deletes or discards a file. One also goes in before **Rename Symbol**, a code action or [**Replace in Files**](/docs/search#replace-in-files) write a closed file. **Discard**, when closing a tab, and **Reload** first keep the text that was not saved.

Left out are files over 1 MB, files that are not text, and anything in `.git`, `node_modules`, `target`, `dist`, `build` and `.next`. The history never leaves this computer. Deleting a project deletes the history of its folders.

## See a file's versions

**Local History › Show History**, on the [tree](/docs/files#bookmarks-and-local-history) or [tab](/docs/tabs-and-groups#the-tab-menu) menu, opens a tab with the file's versions, newest first. Each row says when the version went in and where it came from: **You, in the editor**, **Outside Persisty**, **When opened**, or what Persisty was about to do, such as **Before renaming** or **Unsaved text (Close)**. The list also has the file's **Last commit** and the [restore points](/docs/restore-points) of the sessions that changed it. The arrows move through the list, and the diff shows the chosen version against the text as it is now.

A change made by an agent comes with the session's name when Persisty receives that agent's events, as with Claude Code. Without those events, as with Codex CLI by default, it shows as **Outside Persisty**.

## Go back a version or a chunk

**Go back to this version** replaces the file with the chosen version. The current text is kept first, and a file that changed on disk in the meantime is not overwritten: the notice says nothing was overwritten. On a tab with unsaved changes, the editor asks first and keeps those changes in the history.

Each changed chunk of the diff has **Revert this chunk**, which takes back only that chunk and keeps the rest of the current text. **Next chunk** and **Previous chunk** move from one chunk to another.

## Selection and labels

With lines selected in the code, **Show History for Selection**, in the tab's submenu or the palette, lists only the versions where those lines changed, reading up to the 200 newest versions.

**Put Label…** marks a moment with the name you give, and the label shows between the versions. It works on a file, on a folder or, from the menu of the tree's empty space, on the whole project.

## Recover a deleted file

On a folder, **Show History** lists what changed inside it within the kept period, with each file marked **Created**, **Changed** or **Deleted**. A click on a file opens its history, and **Recover** brings back a deleted file and opens it. If another file already has the name, nothing is replaced.

## Period and space

In [**Settings › Editor › Local history**](/docs/settings#editor), **Keep for (days)** is 5 by default, from 1 to 30, and **Limit per folder (MB)** is 200, from 50 to 2,000. Past the limit, the folder's oldest versions are deleted. **Clear local history** deletes, after you confirm, the saved versions of every folder; the files themselves do not change, and this cannot be undone.

## Plan and limits

Local history is on the free plan.

It keeps only text files of up to 1 MB, inside the session's folder; on a tab from outside the folder, the submenu says "this file is outside the session folder". The actions have no key in any keymap: they are on the menus, in the palette and in the **Local History** group of [**Settings › Shortcuts**](/docs/shortcuts#the-full-list).
