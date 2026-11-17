---
title: Keyboard shortcuts
description: Persisty's keys on the Mac, the editor keymap's keys inside the code, and where to see the full list in the app.
group: reference
order: 1
---

The app's keys work all over Persisty; inside the code, the editor keymap's keys come first. The full list, with the keys of the keymap you chose, is in **Settings › Shortcuts**, searchable.

## App keys

On the Mac, the app's shortcuts always include <kbd>⌘</kbd>; <kbd>⌃</kbd> is left to the terminal and the editor keymap.

| Action | Shortcut |
| --- | --- |
| Search | <kbd>⌘</kbd> <kbd>K</kbd> |
| Project bar | <kbd>⌘</kbd> <kbd>B</kbd> |
| Session board | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Show or hide the side panel | <kbd>⌘</kbd> <kbd>&#92;</kbd> |
| Open file by name (outside the code) | <kbd>⌘</kbd> <kbd>P</kbd> |
| Search all files | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| Git changes | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> |
| Save file | <kbd>⌘</kbd> <kbd>S</kbd> |
| Preview Markdown (in the editor) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> |
| New terminal in the current workspace | <kbd>⌘</kbd> <kbd>N</kbd> |
| Choose what to open | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> |
| New session with the default agent | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> |
| Dictate (with dictation on) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> |
| Restore all | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Details | <kbd>⌘</kbd> <kbd>I</kbd> |
| Collapse workspaces | <kbd>⌘</kbd> <kbd>J</kbd> |
| Run / stop command | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> |
| Command output | <kbd>⌘</kbd> <kbd>E</kbd> |
| Previous / next session (outside the code) | <kbd>⌘</kbd> <kbd>←</kbd> <kbd>⌘</kbd> <kbd>→</kbd> |
| Close the editor tab (in the Code panel, outside the text) | <kbd>⌘</kbd> <kbd>W</kbd> |
| Switcher | <kbd>⌃</kbd> <kbd>Tab</kbd> |
| Project 1–9 | <kbd>⌘</kbd> <kbd>1</kbd> … <kbd>⌘</kbd> <kbd>9</kbd> |
| Settings | <kbd>⌘</kbd> <kbd>,</kbd> |

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> is the default key for **Dictate**. You can change it in **Settings › Voice**, and it shows in **Settings › Shortcuts** only with **Voice dictation** on; see [Dictation shortcut](/docs/voice#shortcut).

## Inside the code

The chosen keymap's keys come first; where the keymap's action does not apply, the key goes on to the app. In WebStorm, <kbd>⌘</kbd> <kbd>B</kbd> on a name goes to its declaration and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> opens a file by name. In WebStorm (macOS), <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> opens a file by name instead of the session board. In both WebStorm keymaps, <kbd>⌘</kbd> <kbd>D</kbd> duplicates the line, and <kbd>⌃</kbd> <kbd>G</kbd> adds the next occurrence to the selection.

In WebStorm (macOS) and VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> is **Find Previous** after a search in the file; with no search, the key opens **Git changes**. In every keymap, <kbd>⌘</kbd> <kbd>←</kbd> and <kbd>⌘</kbd> <kbd>→</kbd> move the caret to the start and end of the line; outside the code, they switch sessions.

The table of each keymap's keys is in [Keymap](/docs/editor#keymap).

## Command palette

<kbd>⌘</kbd> <kbd>K</kbd> opens the palette, which searches sessions, projects and actions. With a file open in the editor, it also lists the editor actions that work there, with the chosen keymap's keys. **Find Action** opens the palette with those actions only: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> in the WebStorm keymaps, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> or <kbd>F1</kbd> in VS Code. With no file open, it opens the whole palette.

## Files

These keys answer with the file tree in focus. Opening the menu, cut, copy, paste and undo work in every keymap; the others belong to the WebStorm keymaps, and in the VS Code keymap these actions are in the right-click menu. See [Files](/docs/files#keys).

| Action | Shortcut |
| --- | --- |
| Open the file menu | <kbd>⇧</kbd> <kbd>F10</kbd> |
| Rename | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Move to another folder | <kbd>F6</kbd> |
| Copy to another folder | <kbd>F5</kbd> |
| Cut, copy and paste files | <kbd>⌘</kbd> <kbd>X</kbd> <kbd>⌘</kbd> <kbd>C</kbd> <kbd>⌘</kbd> <kbd>V</kbd> |
| Delete to the Trash | <kbd>⌫</kbd> |
| Undo the delete (while the notice shows) | <kbd>⌘</kbd> <kbd>Z</kbd> |
| Copy path (also on the tab and in the code) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Copy reference (also on the tab and in the code) | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Sync the tree with the folder | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> |

## Tabs and groups

<kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> and <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> work in every keymap, with the tab in focus. The other keys belong to the WebStorm keymaps; in the VS Code keymap, these actions are in the palette and the tab menu. See [Tabs and groups](/docs/tabs-and-groups#keys).

| Action | Shortcut |
| --- | --- |
| Move the tab left or right | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> |
| Maximize the editor | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> |
| Next and previous group | <kbd>⌥</kbd> <kbd>Tab</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> |
| Open the file on the right (in the tree) | <kbd>⇧</kbd> <kbd>↵</kbd> |

## The full list

**Settings › Shortcuts** shows every key of the chosen keymap and of Persisty, in words, in groups such as **Navigation**, **Tabs**, **Files** and **Git**; the app's keys are in the **Persisty** group. The search finds an action by its name or by its keys in words, such as `command shift o`, ignoring accents.

Each row says where the key works, such as "in the tree, in the tab, and in the editor". When an app key does something else in the code, the row says both, as in WebStorm: "In the code: Go to Declaration · Outside the code: Project bar". Actions with no key of their own, such as the Git submenu's and the groups', are listed with where to find them: the tree's menu, the tab's or the palette.

At the top, a warning shows for each keymap or app key that macOS uses, such as <kbd>⌃</kbd> <kbd>Space</kbd> to switch the keyboard, with the path in System Settings › Keyboard › Keyboard Shortcuts to turn it off and, when there is one, the action's other key.

## When a key does not work there

In the file tree and on a tab, a keymap key whose action cannot run there shows the reason in a notice, instead of doing nothing: "this key does not work here", "only in the text of a file", "the file has no code analysis" or "the file is read-only".

## Windows and Linux

On Windows and Linux, which are in preview, the app's shortcuts use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>, and dictation is <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. In the editor keymaps, <kbd>Ctrl</kbd> and <kbd>Alt</kbd> stand in for <kbd>⌘</kbd> and <kbd>⌥</kbd>; see [Keymap](/docs/editor#keymap).
