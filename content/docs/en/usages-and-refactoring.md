---
title: Usages, rename and refactor
description: Find the usages of a name or a file, go to the implementation and the type, highlight usages, rename across files, quick fixes, extract, inline and move to a new file, reformat, optimise imports and inspect code, through the language server.
group: code
order: 3
---

These actions ask the language server about the name at the cursor and change the code with its answer. Today the server exists for TypeScript, JavaScript and Rust, and each action needs a running server that offers it; without one, the key goes on to the app. Nothing is asked of the server while you only move the cursor, only when you press the key or pick the action in the palette. The keys in the text are the WebStorm keymap's on a Mac, and each keymap's are in [Keys](#keys).

## Find usages

**Find Usages** (<kbd>⌥</kbd> <kbd>F7</kbd>) lists where the name at the cursor is used, together with its declaration, in the **Usages** tab of the [bottom panel](/docs/editor#bottom-panel). The usages come by file, starting with the file you are in, each with its line, its column and the text of the line; a click or <kbd>↵</kbd> opens the place. With a single usage, the editor goes straight to it. If the server does not answer within 3 seconds, a notice says so.

With the list on screen, **Next Usage** and **Previous Usage** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> and <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd>) open one usage after another, and from the last go back to the first. Without the list, the same keys add a caret below or above.

## Usages of a file

**Find Usages**, on a file's menu in the [tree](/docs/files#usages-and-inspection) and on the [tab menu](/docs/tabs-and-groups#the-tab-menu), lists in the **Usages** tab the files that import that file, each with the import's line. In the WebStorm keymaps the key is the same, <kbd>⌥</kbd> <kbd>F7</kbd>, with the focus on the tree or the tab; inside the code it still finds the usages of the name at the cursor.

In TypeScript, JavaScript and Rust the list comes from the language server. When it doesn't answer, or doesn't know the file yet, the editor searches the text for what looks like an import of the file's path, and the title says "Usages of name (text search)". That search is approximate: it can miss an import written another way, such as through an alias, or bring one that doesn't point to the file.

## Implementation and type

**Go to Implementation** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd>) takes you from an interface or an abstract member to where it is implemented. **Go to Type Declaration** (<kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd>) takes you to the declaration of the type of the value at the cursor. With one target, the editor goes straight there; with several, they show in the **Usages** tab, under **Implementations of "name"** or **Types of "name"**.

## Highlight usages in the file

**Highlight Usages in File** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd>) marks every occurrence of the name at the cursor in the file. The places that give the name a value are a little stronger than the reads, and the status bar says how many there are, such as "3 usages in this file". The marks go with <kbd>Esc</kbd>, when you edit the text or when you press the key again.

## Rename across files

**Rename Symbol** (<kbd>⇧</kbd> <kbd>F6</kbd>) opens a small field over the name: type the new one and press <kbd>↵</kbd>. The change applies in every file of the session. Open tabs get the new text with undo, and closed files are written if they did not change while the server answered; before that, the editor keeps each one's previous version in the [local history](/docs/local-history). A notice says how many files the name changed in and which were left out, with the reason, such as "changed during the request".

A rename that would also create, rename or delete files is not made, and the notice says so. In the tree and on a tab, <kbd>⇧</kbd> <kbd>F6</kbd> still renames the file; see [Rename, move and copy](/docs/files#rename-move-and-copy).

## Quick fixes

**Show Quick Fixes and Actions** (<kbd>⌥</kbd> <kbd>↵</kbd>) opens, beside the cursor, a list of what the server offers there, such as fixing an error, refactoring or organising, with the preferred ones at the top. The arrows move through the list, <kbd>↵</kbd> applies, and <kbd>Esc</kbd> closes it and gives the focus back to the code. Editing, scrolling or clicking elsewhere also close it, and a typed character closes the list and goes into the code.

The change goes into the tab's undo as a single step. The list only opens when you ask, never on every cursor move, and with no actions the notice says "No actions here".

## Extract, inline and refactor

**Extract Variable** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>), **Extract Constant** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>C</kbd>), **Extract Function** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>M</kbd>) and **Inline** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd>) ask the server for the refactorings of that kind at the cursor. If only one fits, it runs straight away; if there are several, a list opens with the requested ones at the top. **Refactor This…** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd>) lists every refactoring the server offers there.

Each refactoring is one undo step, including what the server sends afterwards, as when you extract a function in TypeScript. With none, the notice says "No refactorings here"; when the only ones there do not apply, it shows why.

In the code, with a server that has code actions, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> inlines instead of opening a session with the default agent; without one, the key goes on to the app.

## Move to a new file

In TypeScript and JavaScript, **Show Quick Fixes and Actions** and **Refactor This…** offer **Move to a new file**, as the server names it, on a top-level declaration of the file or a selection of them. The code leaves the tab and goes to a new file, which opens in a tab. **Move to a file…**, which asks you to pick the destination, doesn't exist yet.

The server's other actions that create, rename or delete files are applied too, always inside the project folder. A deleted file goes to the Trash, an overwritten file leaves the version from before in the [local history](/docs/local-history), and tabs follow the renamed or deleted file.

## Reformat and optimise imports

**Reformat Code** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd>) formats the file, or only the selection when there is one, with the tab's tab size and indentation, as one undo step. A server that only formats the whole file does not change a selection, and the notice explains; with nothing to change, it says "Nothing to format".

**Optimize Imports** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd>) asks the server for the action that organises the file's imports and applies the first one, with no list, as one undo step. With nothing to do, the notice says "Nothing to organize".

## Inspect code

**Inspect Code** asks the language servers for the problems of many files at once, open or not. It is on the menu of a file, a folder or several selected items in the [tree](/docs/files#usages-and-inspection), on the [tab menu](/docs/tabs-and-groups#the-tab-menu) and in the palette, and it has no key. In a folder, its files in a language with a server go in, up to 2,000 per project, counted as in the **Open file** list, without hidden files and what `.gitignore` ignores.

The problems show up in the **Problems** tab of the [bottom panel](/docs/editor#bottom-panel), in an **Inspection** section apart from the live list, by file and with errors first; a click takes you to the line. While it runs, the section shows the progress, such as "20 of 45 files", and has **Cancel**, which keeps what was found so far, and **Close**. The result is a snapshot: it doesn't change while you type and goes away when you close it.

A file the server didn't get to analyze is left out, and the section says how many and why: the server wasn't ready in time, stopped halfway or couldn't open the file. Those files never show up as having no problems. As a reference, 200 files take about 20 seconds with the server already loaded.

## Keys

The keys on a Mac. Where the table shows —, the keymap has no key for the action, and it is in the palette.

| Action | WebStorm | WebStorm (macOS) | VS Code |
| --- | --- | --- | --- |
| Find Usages | <kbd>⌥</kbd> <kbd>F7</kbd> | <kbd>⌥</kbd> <kbd>F7</kbd> | <kbd>⇧</kbd> <kbd>F12</kbd> |
| Find Usages of a file, in the tree and on the tab | <kbd>⌥</kbd> <kbd>F7</kbd> | <kbd>⌥</kbd> <kbd>F7</kbd> | — |
| Next Usage / Previous Usage | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd> | — |
| Go to Implementation | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>F12</kbd> |
| Go to Type Declaration | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>B</kbd> or <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> | — |
| Highlight Usages in File | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> | — |
| Rename Symbol | <kbd>⇧</kbd> <kbd>F6</kbd> | <kbd>⇧</kbd> <kbd>F6</kbd> | <kbd>F2</kbd> |
| Show Quick Fixes and Actions | <kbd>⌥</kbd> <kbd>↵</kbd> | <kbd>⌥</kbd> <kbd>↵</kbd> | <kbd>⌘</kbd> <kbd>.</kbd> |
| Extract Variable, Constant, Function | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> | — |
| Inline | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> | — |
| Refactor This… | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> | <kbd>⌃</kbd> <kbd>T</kbd> | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Reformat Code | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> | <kbd>⇧</kbd> <kbd>⌥</kbd> <kbd>F</kbd> or <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>F</kbd> |
| Optimize Imports | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⌃</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⇧</kbd> <kbd>⌥</kbd> <kbd>O</kbd> |

**Inspect Code** has no key in any keymap. The bottom panel's keys are in [Bottom panel](/docs/editor#bottom-panel).

On Windows and Linux, which are in preview, <kbd>Ctrl</kbd> and <kbd>Alt</kbd> stand in for <kbd>⌘</kbd> and <kbd>⌥</kbd>, and both WebStorm keymaps use the keys of the WebStorm column: **Refactor This…** is <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>T</kbd>, and **Optimize Imports** is <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>O</kbd>. In the VS Code keymap, **Reformat Code** is <kbd>Shift</kbd> <kbd>Alt</kbd> <kbd>F</kbd> on Windows and <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> on Linux, plus <kbd>Ctrl</kbd> <kbd>K</kbd> <kbd>Ctrl</kbd> <kbd>F</kbd> on both, and **Refactor This…** is <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd>. With the server, these keys come before the app's in the code; without it, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> opens **Details**, and <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd>, **Restore all**.

## Plan and limits

Everything on this page is on the free plan.

The actions exist only in TypeScript, JavaScript and Rust, with the language server running, and what each one offers depends on the server. The file changes an action asks for only apply inside the project folder.

In **Move to a new file**, if the new file changes while the server answers, it is left out and the notice says "changed during the request"; the code still leaves the source tab, and <kbd>⌘</kbd> <kbd>Z</kbd> in that tab brings it back. In Rust, <kbd>⇧</kbd> <kbd>F6</kbd> on a `mod` name in the code doesn't rename the module's file yet; rename the file in the [tree](/docs/files#imports-when-renaming-and-moving).

**Inspect Code** goes up to 2,000 files per project, only in languages with a server, and takes longer while the server is still loading the project.
