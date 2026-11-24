---
title: Files
description: The session folder's tree in the Code panel, to create, rename, move, copy and delete files, open them in another app and copy their paths.
group: code
order: 4
---

The **Files** list, to the left of the [editor](/docs/editor), shows the session's folder as a tree. It creates, renames, moves, copies and deletes files and folders without leaving Persisty. Right-clicking an item opens the file menu; on an empty spot of the list, the menu has **New**, **Paste** and **Local History** for the session folder.

## The tree

Files git ignores are dimmed, and `.git` never shows. At the top of the list, **New file**, **New folder** and **Refresh** act on the session folder. The list changes width: drag the divider, or use <kbd>←</kbd> and <kbd>→</kbd> with it in focus; a double click brings back the default width.

<kbd>⌘</kbd> + click and <kbd>⇧</kbd> + click select several items, and <kbd>⌘</kbd> <kbd>A</kbd> selects every visible one. With the tree in focus, the arrows move through the items, <kbd>→</kbd> and <kbd>←</kbd> open and close a folder, <kbd>↵</kbd> opens the file, and typing the start of a name jumps to it. <kbd>⇧</kbd> <kbd>F10</kbd>, or the menu key, opens the menu of the item in focus.

## Create files and folders

![New file, at the top of the tree, opens the name field in the tree itself; with the name checkout.ts and Enter, the file joins the list and opens in a tab.](/docs-media/files/arquivos.mp4)

**New**, on the menu, creates a **File** or a **Folder** inside the item's folder. The same submenu creates TypeScript, JavaScript, HTML, CSS, JSON, Markdown, Dockerfile and EditorConfig files with a minimal template. You type the name in the tree itself, and a name that already exists is refused, with the reason.

## Rename, move and copy

**Rename…** edits the name in the row itself, and open tabs follow the file with their unsaved text and undo. On an [editor tab](/docs/tabs-and-groups#the-tab-menu), the same is under **Rename File…**.

**Refactor › Move…** and **Refactor › Copy…** pick the destination folder from a list with search. Dragging items onto a folder moves them too, and holding <kbd>⌥</kbd> copies them. While you drag, the item's name follows the pointer, the destination folder is highlighted, and a closed folder opens if the pointer rests on it. Where an item cannot be dropped, the tree says why, such as "already here". <kbd>Esc</kbd> cancels the drag.

With the tree in focus, <kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd> and <kbd>⌘</kbd> <kbd>V</kbd> cut, copy and paste files, to and from the Finder as well; **Cut**, **Copy** and **Paste** are on the menu. Paste puts the items in the folder you clicked, or in the folder of the file you clicked.

## Delete

**Delete…** always asks first and sends the items to the Trash. For 10 seconds, **Undo** on the notice, or <kbd>⌘</kbd> <kbd>Z</kbd> with the tree in focus, brings everything back. If an open file has unsaved changes, Persisty first asks whether to save or discard them; with **Save automatically** on, it saves them without asking.

## When the name already exists

When moving, copying or pasting, if the name already exists at the destination, Persisty asks once: **Rename**, **Replace** or **Skip**. **Do the same for the next ones** applies to the other repeated names in the same operation. Replace sends the old item to the Trash, and the unsaved changes of an open file are never lost without you answering.

## Large copies and failures

Large copies and moves show their progress under the tree and can be stopped with **Cancel**, leaving nothing half done. If an operation stops partway, what already went stays, and the notice says which item failed. When a **Replace** fails, the notice says which item was not placed and that the old version went to the Trash; tabs closed for the operation come back in the same group and the same position.

## Open in

**Open in**, on the tree and on the tab, takes the item elsewhere: **Reveal in Finder**, **Terminal in folder**, which opens a new terminal session in the item's folder, **Open with the default app**, **Open in the browser** (HTML, HTM and SVG only), your IDE at the cursor's line, and the [file's page](/docs/forges#open-on-the-forge) on GitHub, GitLab or Bitbucket. On a branch that was never pushed, the forge page is the current commit's.

The IDE is the one you choose in [**Settings › Workspace › Default IDE**](/docs/settings#workspace), among those Persisty finds on the computer; the default is **None**. The same IDE opens the session folder from the session tab's menu, the palette and the project.

## Copy path

**Copy path** gives the **Absolute path**, the **Path from the project**, the **Path from the repository root**, the **File name**, the **Reference** and the **Link on GitHub** (or GitLab, or Bitbucket), at the current commit. The reference is `file:line`, or `file:start-end` with lines selected on the tab. With several items selected, each goes on its own line.

## Bookmarks and local history

The **Bookmarks** submenu has **Add to Bookmarks**, for the selected items, or **Remove from Bookmarks**, when they are all there already. Bookmarks follow the file or folder when it is renamed or moved, and their list opens from a key; see [Bookmarks](/docs/code-navigation#bookmarks).

The **Local History** submenu has **Show History**, which on a file lists the kept versions and on a folder shows what changed in it, deletions included, and **Put Label…**. On the empty space of the list, the same submenu works on the session's whole folder. See [Local history](/docs/local-history).

## Reload from Disk

**Reload from Disk** reads again what changed outside the editor. On an open file with unsaved changes, it asks first, because those changes are lost. On a folder, it lists the folder again. To list the whole tree again, use **Refresh**, at the top of the list. **Synchronize the Tree**, <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> in the WebStorm keymaps, does the same and also checks right away whether the open files changed on disk.

## Change the file type

**Change File Type…**, on the tree, on the tab or in the palette (<kbd>⌘</kbd> <kbd>K</kbd>), reads a file as another language, such as a `.env` as Shell. The choice applies to that file in this folder and follows it when it moves. **Back to automatic** returns to the language from the extension.

## Hide files

In **Settings › Files**, **Hide files** lists patterns such as `**/node_modules`. What matches a pattern disappears from the tree, from [search](/docs/search) and from **Open file**. The built-in pattern is `**/.DS_Store`. Each pattern has a switch to turn it on and off and a button to remove it; a new one comes in through **New pattern** and **Add**. `.git` is always hidden.

## Keys

<kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd>, <kbd>⌘</kbd> <kbd>V</kbd>, <kbd>⌘</kbd> <kbd>Z</kbd> and <kbd>⇧</kbd> <kbd>F10</kbd> work in the tree in every keymap. The others belong to the two WebStorm keymaps:

| Action | Key |
| --- | --- |
| New | <kbd>⌃</kbd> <kbd>N</kbd> or <kbd>⌃</kbd> <kbd>↵</kbd>; in WebStorm (macOS), <kbd>⌘</kbd> <kbd>N</kbd> or <kbd>⌃</kbd> <kbd>↵</kbd> |
| Rename | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Move to another folder | <kbd>F6</kbd> |
| Copy to another folder | <kbd>F5</kbd> |
| Delete | <kbd>⌫</kbd> or <kbd>⌘</kbd> <kbd>⌫</kbd> |
| Copy Path (also on the tab and in the code) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Copy Reference (also on the tab and in the code) | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Synchronize the Tree | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> |

In the VS Code keymap, these actions are on the menu. In WebStorm (macOS), <kbd>⌘</kbd> <kbd>N</kbd> opens **New** only with the focus in the tree; elsewhere, it opens a new terminal. [**Settings › Shortcuts**](/docs/shortcuts#files) has a **Files** group, with where each key works: in the tree, on the tab or in the editor.

On Windows and Linux, which are in preview, <kbd>Ctrl</kbd> and <kbd>Alt</kbd> stand in for <kbd>⌘</kbd> and <kbd>⌥</kbd>, <kbd>Delete</kbd> deletes, and **New** is <kbd>Alt</kbd> <kbd>Insert</kbd>. The Finder gives way to File Explorer or the file manager.

## Plan and limits

The tree and every file operation are on the free plan.

The tree only shows and changes what is inside the session folder. On Windows and Linux, pasting files to and from the system and undoing a delete are still being checked in use.
