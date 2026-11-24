---
title: Keyboard shortcuts
description: Persisty's keys on the Mac, the editor keymap's keys inside the code, and where to see the full list in the app.
group: reference
order: 1
---

The app's keys work all over Persisty; inside the code, the editor keymap's keys come first. The full list, with the keys of the keymap you chose, is in [**Settings › Shortcuts**](/docs/settings#shortcuts), searchable.

## App keys

On the Mac, the app's shortcuts always include <kbd>⌘</kbd>; <kbd>⌃</kbd> is left to the terminal and the editor keymap.

| Action | Shortcut |
| --- | --- |
| Search | <kbd>⌘</kbd> <kbd>K</kbd> |
| Project bar | <kbd>⌘</kbd> <kbd>B</kbd> |
| [Session board](/docs/board) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Show or hide the side panel | <kbd>⌘</kbd> <kbd>&#92;</kbd> |
| Open file by name (outside the code) | <kbd>⌘</kbd> <kbd>P</kbd> |
| [Search all files](/docs/search) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| [Git changes](/docs/changes) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> |
| Save file | <kbd>⌘</kbd> <kbd>S</kbd> |
| Preview Markdown (in the editor) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> |
| New terminal in the current workspace | <kbd>⌘</kbd> <kbd>N</kbd> |
| Choose what to open | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> |
| New session with the default agent | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> |
| Dictate (with dictation on) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> |
| [Restore all](/docs/sessions-and-recovery#restore-all) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Details | <kbd>⌘</kbd> <kbd>I</kbd> |
| Collapse workspaces | <kbd>⌘</kbd> <kbd>J</kbd> |
| [Run / stop command](/docs/commands) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> |
| Command output | <kbd>⌘</kbd> <kbd>E</kbd> |
| Previous / next session (outside the code) | <kbd>⌘</kbd> <kbd>←</kbd> <kbd>⌘</kbd> <kbd>→</kbd> |
| Close the editor tab (in the Code panel, outside the text) | <kbd>⌘</kbd> <kbd>W</kbd> |
| Switcher | <kbd>⌃</kbd> <kbd>Tab</kbd>; <kbd>⇧</kbd> <kbd>Tab</kbd> goes back |
| Project 1–9 | <kbd>⌘</kbd> <kbd>1</kbd> … <kbd>⌘</kbd> <kbd>9</kbd> |
| Settings | <kbd>⌘</kbd> <kbd>,</kbd> |

Some of these keys do something else with the cursor in the code; see [Inside the code](#inside-the-code).

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> is the default key for **Dictate**. You can change it in **Settings › Voice**, and it shows in **Settings › Shortcuts** only with **Voice dictation** on; see [Dictation shortcut](/docs/voice#shortcut).

## Inside the code

The chosen keymap's keys come first; where the keymap's action does not apply, the key goes on to the app. In WebStorm, <kbd>⌘</kbd> <kbd>B</kbd> on a name goes to its declaration and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> opens a file by name. In WebStorm (macOS), <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> opens a file by name instead of the session board. In both WebStorm keymaps, <kbd>⌘</kbd> <kbd>D</kbd> duplicates the line, and <kbd>⌃</kbd> <kbd>G</kbd> adds the next occurrence to the selection.

In WebStorm (macOS) and VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> is **Find Previous** after a search in the file; with no search, the key opens **Git changes**. On the Mac, in every keymap, <kbd>⌘</kbd> <kbd>←</kbd> and <kbd>⌘</kbd> <kbd>→</kbd> move the caret to the start and end of the line; outside the code, they switch sessions.

These app keys change meaning only with the cursor in the code, as in WebStorm. Some always change; the ones marked "with the server" change only when the language server offers the action, and without it they do what they do in the app.

| Key | In the code | Outside the code |
| --- | --- | --- |
| <kbd>⌘</kbd> <kbd>E</kbd> | **Recent Files**, in the WebStorm keymaps | Command output |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | **Recent Locations**, in the WebStorm keymaps | Run / stop command |
| <kbd>⌘</kbd> <kbd>3</kbd> and <kbd>⌘</kbd> <kbd>6</kbd> | **Usages** and **Problems** in the bottom panel, in the WebStorm keymaps | Project 3 and project 6 |
| <kbd>⌘</kbd> <kbd>N</kbd> | **Go to Class**, in WebStorm, with the server | New terminal in the current workspace |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> | **Quick Definition**, in WebStorm, with the server | Details |
| <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> | **Inline**, in the WebStorm keymaps, with the server | New session with the default agent |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> | **Replace in Files**, in WebStorm (macOS) | Restore all |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> | **Go to File**, in WebStorm (macOS); **File Structure**, in VS Code, with the server | Session board |
| <kbd>⌘</kbd> <kbd>B</kbd> | **Go to Declaration**, in the WebStorm keymaps, with the server | Project bar |

[**Settings › Shortcuts**](#the-full-list) shows both meanings on each one's row. The table of each keymap's keys is in [Keymap](/docs/editor#keymap).

## Command palette

<kbd>⌘</kbd> <kbd>K</kbd> opens the palette, which searches sessions, projects and actions. With a file open in the editor, it also lists the editor actions that work there, with the chosen keymap's keys. **Find Action** opens the palette with those actions only: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> in the WebStorm keymaps, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> or <kbd>F1</kbd> in VS Code. With no file open, it opens the whole palette.

In the VS Code keymap, with the cursor in the code, <kbd>⌘</kbd> <kbd>K</kbd> starts its two-part keys, such as <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>C</kbd>, which comments the line; there, the editor's actions are on <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd>.

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
| Find Usages of the file (also on the tab) | <kbd>⌥</kbd> <kbd>F7</kbd> |
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

## Navigate, usages and refactoring

The code's keys for moving through it and changing it through the language server, in the WebStorm keymap on a Mac. The other keymaps' keys, and those on Windows and Linux, are in [Move through the code](/docs/code-navigation#keys), [Usages, rename and refactor](/docs/usages-and-refactoring#keys) and [Editor](/docs/editor#bottom-panel).

| Action | Shortcut |
| --- | --- |
| Recent Files / Recent Locations | <kbd>⌘</kbd> <kbd>E</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> |
| Go to Last Edit Location | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> |
| File Structure | <kbd>⌘</kbd> <kbd>F12</kbd> |
| Go to Symbol / Go to Class | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd> / <kbd>⌘</kbd> <kbd>N</kbd> |
| Next Method / Previous Method | <kbd>⌃</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>↑</kbd>, or <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> |
| Quick Definition | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> |
| Show in Tree | <kbd>⌥</kbd> <kbd>F1</kbd> |
| Toggle Bookmark / Show Bookmarks | <kbd>F11</kbd> / <kbd>⇧</kbd> <kbd>F11</kbd> |
| Search Everywhere | <kbd>⇧</kbd> twice |
| Find Usages / Next Usage | <kbd>⌥</kbd> <kbd>F7</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> |
| Go to Implementation / Go to Type Declaration | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> |
| Highlight Usages in File | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> |
| Rename Symbol | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Show Quick Fixes and Actions | <kbd>⌥</kbd> <kbd>↵</kbd> |
| Extract Variable, Constant, Function / Inline | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> |
| Refactor This… | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> |
| Reformat Code / Optimize Imports | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> |
| Usages / Problems, in the bottom panel | <kbd>⌘</kbd> <kbd>3</kbd> / <kbd>⌘</kbd> <kbd>6</kbd> |
| Replace in Files | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Column Selection Mode | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>8</kbd> |
| Clone Caret Above / Below | <kbd>⌥</kbd> twice and hold, with <kbd>↑</kbd> / <kbd>↓</kbd> |

In WebStorm (macOS), these change: **Go to Symbol** is <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd>, **Go to Class** is <kbd>⌘</kbd> <kbd>O</kbd>, **Quick Definition** is <kbd>⌘</kbd> <kbd>Y</kbd>, bookmarks are <kbd>F3</kbd> and <kbd>⌘</kbd> <kbd>F3</kbd>, next and previous method are <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> and <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd>, **Refactor This…** is <kbd>⌃</kbd> <kbd>T</kbd>, **Optimize Imports** is <kbd>⌃</kbd> <kbd>⌥</kbd> <kbd>O</kbd>, **Go to Type Declaration** is also <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>B</kbd>, and **Replace in Files** is <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd>, only in the code. Since <kbd>F3</kbd> toggles a bookmark in that keymap, **Find Next** moves to <kbd>⌘</kbd> <kbd>G</kbd>.

## The full list

**Settings › Shortcuts** shows every key of the chosen keymap and of Persisty, in words, in groups such as **Navigation**, **Tabs**, **Files** and **Git**; the app's keys are in the **Persisty** group. The search finds an action by its name or by its keys in words, such as `command shift o`, ignoring accents.

Gestures are spelled out: **Search Everywhere** as "Shift twice", and **Clone Caret Above** as "Option twice and hold + up arrow". Each row says where the key works, such as "in the tree, in the tab, and in the editor". When an app key does something else in the code, the row says both, as in WebStorm: "In the code: Go to Declaration · Outside the code: Project bar". Actions with no key of their own, such as the Git submenu's and the groups', are listed with where to find them: the tree's menu, the tab's or the palette.

At the top, a warning shows for each keymap or app key that macOS uses, such as <kbd>⌃</kbd> <kbd>Space</kbd> to switch the keyboard, with the path in System Settings › Keyboard › Keyboard Shortcuts to turn it off and, when there is one, the action's other key.

## When a key does not work there

In the file tree and on a tab, a keymap key whose action cannot run there shows the reason in a notice, instead of doing nothing: "this key does not work here", "only in the text of a file", "the file has no code analysis" or "the file is read-only".

## Windows and Linux

On Windows and Linux, which are in preview, the app's shortcuts use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>, and dictation is <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. In the code, in every keymap, <kbd>Ctrl</kbd> <kbd>←</kbd> and <kbd>Ctrl</kbd> <kbd>→</kbd> move word by word, and <kbd>Home</kbd> and <kbd>End</kbd> go to the start and end of the line. In the terminal, <kbd>Ctrl</kbd> <kbd>←</kbd> and <kbd>Ctrl</kbd> <kbd>→</kbd> go to the shell. In the editor keymaps, <kbd>Ctrl</kbd> and <kbd>Alt</kbd> stand in for <kbd>⌘</kbd> and <kbd>⌥</kbd>; see [Keymap](/docs/editor#keymap). In the tree, in the WebStorm keymaps, delete is <kbd>Delete</kbd> or <kbd>Alt</kbd> <kbd>Delete</kbd>, and moving between groups has no key.

In the code, in the WebStorm keymaps, <kbd>Ctrl</kbd> <kbd>E</kbd>, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>E</kbd>, <kbd>Ctrl</kbd> <kbd>N</kbd> and <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> change meaning as on the Mac. <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd> inlines, with the server, and <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> is **Replace in Files**, instead of a new session with the default agent and **Restore all**. The bottom panel uses <kbd>Alt</kbd> <kbd>3</kbd> and <kbd>Alt</kbd> <kbd>6</kbd>, which leave <kbd>Ctrl</kbd> <kbd>3</kbd> and <kbd>Ctrl</kbd> <kbd>6</kbd> to the projects. In the VS Code keymap, with the server, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd> opens the file structure, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> opens **Refactor This…** and, on Linux, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> reformats. **Search Everywhere** is <kbd>Shift</kbd> twice, and cloning a caret with the gesture uses <kbd>Ctrl</kbd> twice.
