---
title: Move through the code
description: Recent files and locations, the last edit, the file structure, go to symbol and class, quick definition, bookmarks and Search Everywhere, with the keys of each keymap.
group: code
order: 2
---

These actions take you to another point in the code without hunting through the tree. Nearly all of them work with the cursor in the [editor](/docs/editor)'s code, and all of them are also in the palette (<kbd>⌘</kbd> <kbd>K</kbd>) and in [**Settings › Shortcuts**](/docs/shortcuts#the-full-list). The file structure, go to symbol and class, next method and quick definition depend on the language server, which today exists for TypeScript, JavaScript and Rust; without it, the key goes on to the app. The keys in the text are the WebStorm keymap's on a Mac, and each keymap's are in [Keys](#keys).

## Recent files and locations

**Recent Files** (<kbd>⌘</kbd> <kbd>E</kbd>) lists the last 50 files opened in the session, newest first, including those whose tabs are already closed. The file on screen is left out, and the ones with an open tab are marked **open**. The list survives closing the app and follows files that are renamed, moved and deleted. With it open, the same key shows only the **Files edited in this session**.

**Recent Locations** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd>) lists where the cursor has been and what was edited, marked **visited** or **edited**, each place with its file, its line and 3 lines of code. Pressing the key again leaves only the **Edited locations**.

**Go to Last Edit Location** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd>) takes the cursor to the last edit, and each time you press it again, to the edit before. The place you left goes into **Back**, as after **Go to Declaration**. The visited and edited places last only while the app is open.

## File structure and methods

**File Structure** (<kbd>⌘</kbd> <kbd>F12</kbd>) opens the file's symbols as an indented list, already on the symbol the cursor is in. Typing filters the list and keeps the parents of each symbol that matches. <kbd>↵</kbd> goes to the symbol, and the place you started from goes into **Back**.

**Next Method** and **Previous Method** take the cursor to the next or previous function, method, constructor or class; at the first and the last, nothing happens. In the WebStorm keymap the keys are <kbd>⌃</kbd> <kbd>↓</kbd> and <kbd>⌃</kbd> <kbd>↑</kbd>, which macOS uses for Mission Control by default, so <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> and <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> work too. **Settings › Shortcuts** warns when macOS uses a key of the keymap.

## Go to symbol and class

**Go to Symbol** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd>) and **Go to Class** (<kbd>⌘</kbd> <kbd>N</kbd>) search the whole project as you type, from the first character. The list shows up to 200 results, each with its kind, such as **Class** or **Function**, where it is declared and its path. With a one-line selection in the code, the search starts with that text.

While the server is indexing, the list says "The server is still indexing". A symbol from outside the folder, such as a library's, opens in a read-only tab. Without the server, <kbd>⌘</kbd> <kbd>N</kbd> opens a new terminal, as it does outside the code. The VS Code keymap has no **Go to Class**.

## Quick definition

**Quick Definition** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd>) shows the declaration of the name at the cursor in a popup beside it, with the language's highlighting, read-only and up to 30 lines long. With several targets, the top says "1 of N", and <kbd>←</kbd> and <kbd>→</kbd> switch between them. <kbd>↵</kbd> opens the place and leaves the one you started from in **Back**; <kbd>Esc</kbd>, editing, scrolling or clicking elsewhere close the popup. A definition from outside the folder shows too.

In the WebStorm (macOS) keymap, the key that works is <kbd>⌘</kbd> <kbd>Y</kbd>: the keymap's other one, <kbd>⌥</kbd> <kbd>Space</kbd>, types a space on a Mac. Without the server, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> opens **Details**, as it does outside the code.

## Show in tree

**Show in Tree** (<kbd>⌥</kbd> <kbd>F1</kbd>) takes you to the tab's file in the [tree](/docs/files): it opens the **Code** panel and the folders down to the file, selects its row and scrolls to it. The same item is on the [tab menu](/docs/tabs-and-groups#the-tab-menu). A file from outside the session's folder is not in the tree and has no such item.

## Bookmarks

Bookmarks mark lines, files and folders, and they are kept per folder: two sessions on the same folder see the same ones.

**Toggle Bookmark** (<kbd>F11</kbd>) marks the cursor's line, or unmarks it. A mark shows in the line-number margin and follows the line as the text changes. **Show Bookmarks** (<kbd>⇧</kbd> <kbd>F11</kbd>) opens the list, split into **Lines**, **Files** and **Folders**: <kbd>↵</kbd> goes to the place, or shows the folder in the tree, and <kbd>⌦</kbd> (<kbd>fn</kbd> <kbd>⌫</kbd> on a Mac keyboard) removes the bookmark.

Files and folders go in through the **Bookmarks** submenu of the tree and the tab: **Add to Bookmarks**, or **Remove from Bookmarks** when the items are already there. Bookmarks follow the file or folder when it is renamed or moved, and go with it when it is deleted. A file from outside the session's folder has no bookmarks.

In the WebStorm (macOS) keymap, toggling is <kbd>F3</kbd> and the list is <kbd>⌘</kbd> <kbd>F3</kbd>, as in WebStorm, so **Find Next** moves to <kbd>⌘</kbd> <kbd>G</kbd> (see [Search the open file](/docs/search#search-the-open-file)). In the WebStorm keymap, macOS uses <kbd>F11</kbd> to show the desktop, and **Settings › Shortcuts** says where to turn that off.

## Search Everywhere

Press <kbd>⇧</kbd> twice to open **Search Everywhere**: files, symbols and actions in one list, with the tabs **All**, **Files**, **Symbols** and **Actions**. <kbd>Tab</kbd> and <kbd>⇧</kbd> <kbd>Tab</kbd> switch tabs. **All** shows up to 8 results of each kind. Choosing one opens the file, goes to the symbol or runs the action.

Files and actions work without a language server. The **Symbols** tab only shows while a server that lists the project's symbols is running in the session; in **All**, the symbols join the list when it answers.

The gesture works in the session, outside the code too, but not in the terminal or in a text field. Typing capitals, holding <kbd>⇧</kbd>, a click or the mouse wheel between the two presses do not open the list, and it does not open on the Settings and usage pages or with a dialog open. The VS Code keymap has no such gesture.

## Keys

The keys on a Mac. Where the table shows —, the keymap has no key for the action, and it is in the palette.

| Action | WebStorm | WebStorm (macOS) | VS Code |
| --- | --- | --- | --- |
| Recent Files | <kbd>⌘</kbd> <kbd>E</kbd> | <kbd>⌘</kbd> <kbd>E</kbd> | — |
| Recent Locations | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | — |
| Go to Last Edit Location | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> | <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>Q</kbd> |
| File Structure | <kbd>⌘</kbd> <kbd>F12</kbd> | <kbd>⌘</kbd> <kbd>F12</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Next Method / Previous Method | <kbd>⌃</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>↑</kbd>, or <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> | — |
| Go to Symbol | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⌘</kbd> <kbd>T</kbd> |
| Go to Class | <kbd>⌘</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>O</kbd> | — |
| Quick Definition | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> | <kbd>⌘</kbd> <kbd>Y</kbd> | <kbd>⌥</kbd> <kbd>F12</kbd> |
| Show in Tree | <kbd>⌥</kbd> <kbd>F1</kbd> | <kbd>⌥</kbd> <kbd>F1</kbd> | — |
| Toggle Bookmark | <kbd>F11</kbd> | <kbd>F3</kbd> | — |
| Show Bookmarks | <kbd>⇧</kbd> <kbd>F11</kbd> | <kbd>⌘</kbd> <kbd>F3</kbd> | — |
| Search Everywhere | <kbd>⇧</kbd> twice | <kbd>⇧</kbd> twice | — |

In VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> opens the structure only with a server that lists symbols; without one, the key opens the [Board](/docs/board), as it does outside the code.

On Windows and Linux, which are in preview, <kbd>Ctrl</kbd> and <kbd>Alt</kbd> stand in for <kbd>⌘</kbd> and <kbd>⌥</kbd>, and both WebStorm keymaps use the keys of the WebStorm column, with one difference: **Next Method** and **Previous Method** are <kbd>Alt</kbd> <kbd>↓</kbd> and <kbd>Alt</kbd> <kbd>↑</kbd>. In the VS Code keymap, **Quick Definition** is <kbd>Alt</kbd> <kbd>F12</kbd> on Windows and <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>F10</kbd> on Linux.

## Plan and limits

Everything on this page is on the free plan.

The file structure, go to symbol and class, next method, quick definition and the **Symbols** tab of **Search Everywhere** exist only in TypeScript, JavaScript and Rust, with the language server running. Recent locations and the last edit last while the app is open.
