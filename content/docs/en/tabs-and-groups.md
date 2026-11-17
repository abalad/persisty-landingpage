---
title: Tabs and groups
description: The editor's tabs, how to switch, close, pin and reorder them, and the editor split into up to four groups side by side or stacked.
group: code
order: 3
---

Each file open in the [editor](/docs/editor) gets a tab. The editor can split into up to four groups, side by side or stacked, each with its own tabs, and the same file can be open in more than one group.

## The tab menu

Right-clicking a tab, or <kbd>⇧</kbd> <kbd>F10</kbd> with the tab in focus, opens its menu. It holds every way to close, **Copy path**, the editor splits, **Pin Tab**, **Configure Tabs**, **Maximize the editor**, **Change File Type…**, **Open in**, the **Git** submenu, **Rename File…** and **Reload from Disk**. An item that does not apply to that tab is greyed out and says why, such as "it is the only tab". Git diff and history tabs have only the ways to close.

## Switch tabs

<kbd>⌃</kbd> <kbd>Tab</kbd>, the **Switcher**, opens the list of open tabs, most recently used first. It works in every keymap, also with the focus in the terminal. Holding <kbd>⌃</kbd>, <kbd>Tab</kbd> and <kbd>⇧</kbd> <kbd>Tab</kbd> move through the list; releasing <kbd>⌃</kbd> opens the tab, and <kbd>Esc</kbd> cancels.

To go to the next or previous tab, use <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>]</kbd> and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>[</kbd> on the Mac, or the keymap's keys: <kbd>⌃</kbd> <kbd>→</kbd> and <kbd>⌃</kbd> <kbd>←</kbd> in the WebStorm keymaps (by default macOS uses these two to switch spaces), <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>→</kbd> and <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>←</kbd> in VS Code. **Reopen Closed Tab** brings back the last tab you closed: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>T</kbd> in the VS Code keymap, and from the palette (<kbd>⌘</kbd> <kbd>K</kbd>) in the others.

## Close tabs

A tab's **×** closes it. In the **Code** panel, outside the text, <kbd>⌘</kbd> <kbd>W</kbd> closes the editor tab in every keymap, and never the window. Inside the text, <kbd>⌘</kbd> <kbd>W</kbd> closes the tab in the WebStorm (macOS) and VS Code keymaps; in WebStorm, there, it extends the selection, and closing the tab is <kbd>⌘</kbd> <kbd>F4</kbd>.

The tab menu has **Close**, **Close Other Tabs**, **Close All Tabs**, **Close Unmodified Tabs**, **Close Tabs to the Left** and **Close Tabs to the Right**. Only tabs with unsaved changes ask first, in a single question: **Save all** or **Discard all**. With [Save automatically](/docs/editor#save-automatically) on, they are saved without a question.

If, while saving, a tab runs into a file that changed on disk, only that tab stays open, with the conflict warning, and the others close. A notice says which tabs stayed.

## Pin a tab

**Pin Tab**, on the tab menu, moves the tab to the left, with a pin. A pinned tab does not close with **Close Other Tabs**, **Close All Tabs** or the tab limit. The same item, ticked, unpins it.

## Reorder

Drag a tab to reorder it or to take it to another group. Dropping it on the right or bottom edge of a group creates a new group with the tab. <kbd>Esc</kbd> cancels the drag.

From the keyboard, with the tab in focus, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> and <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> move the tab along the strip, in every keymap; pinned tabs always stay before the others. **Move Tab to Next Group** is in the palette.

## Split the editor

**Split Right** and **Split Down**, on the tab menu and in the palette, open the same file in a new group. **Split and Move Right** and **Split and Move Down** take the tab to the new group. There are up to four groups; with no room left in the panel, the item tells you to maximize the editor. The divider between two groups can be dragged, or moved with the arrows while it has focus.

In the tree, **Open on the Right** opens the file in a group on the right. **Close Group** and the actions that focus the group to the left, right, above or below are in the palette.

The same file in two groups keeps its text in step, and each side has its own undo. Only one of them talks to the language server: the other gets no suggestions or errors, and the status bar says "in the other group".

## Maximize

**Maximize the editor**, on the tab bar's button, on the tab menu and in the palette, hides the terminal to make room for code. The same button, or the same command, brings back the split you had.

## Tab options

In **Settings › Editor › Tabs**, the **Tab limit** is 20 by default, and can be 10, 30, 50 or **No limit**. Opening one more tab closes the least used one; pinned and unsaved tabs stay, and lowering the limit closes nothing right away. **On close, go to** chooses between **The tab used before**, the default, and **The neighbour tab**. **Open new tab** puts the tab **At the end**, the default, or **Right after the current one**. **Show the folder for repeated names** is on by default, and **Mark unsaved tabs** uses a **Dot** or the **Name in italics**.

The **Preview tab** is off by default. On, a click in the tree opens a tab that the next click replaces; editing it, or double-clicking the tab, keeps it. **Configure Tabs**, on the tab menu, goes straight to that screen.

## Keys

<kbd>⌃</kbd> <kbd>Tab</kbd>, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> and <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> work in every keymap. These belong to the two WebStorm keymaps:

| Action | Key |
| --- | --- |
| Maximize the Editor | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> |
| Next Group and Previous Group | <kbd>⌥</kbd> <kbd>Tab</kbd> and <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> |
| Open the file on the right (in the tree) | <kbd>⇧</kbd> <kbd>↵</kbd> |

In the VS Code keymap, these actions are in the palette and on the tab menu. On Windows and Linux, which are in preview, moving a tab is <kbd>Alt</kbd> <kbd>⇧</kbd> with the arrows, maximizing is <kbd>Ctrl</kbd> <kbd>⇧</kbd> <kbd>F12</kbd>, and switching groups is in the palette.

## Plan and limits

Tabs and groups are on the free plan.

There are four groups at most. Git diff and history tabs cannot be pinned.
