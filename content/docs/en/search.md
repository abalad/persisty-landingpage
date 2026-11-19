---
title: Search
description: Search and replace text in every file of the session's folder, open a file by name, and find and replace in the open file.
group: code
order: 9
---

**Search** looks for text in every file of the session's folder, takes you to the line where it is and replaces the text in several files at once. This page also shows how to open a file by name and how to search only the open file. To find a file, a symbol or an action in one list, see [Search Everywhere](/docs/code-navigation#search-everywhere).

## Search the files

Open **Search** from its icon, in the tool bar on the session's right edge, or with <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, which puts the cursor in the **Search all files** field. The search starts at 2 characters, as soon as you stop typing.

Beside the field are **Match case**, **Whole word** and **Regular expression**. Results come grouped by file, with the folder, how many times the text appears and each line with the match highlighted; the summary says, for example, "12 results in 3 files". A click on a line opens the file in the [**Code**](/docs/editor) panel, at that line.

## What is left out

The search skips what git ignores and what an `.ignore` file lists, the `.git` folder, the **Hide files** patterns ([Hide files](/docs/files#hide-files)), files over 2 MB and binary files. Files and folders whose names start with a dot are searched, as long as git does not ignore them.

It stops at 2,000 results, and the summary says "partial list". In each line, the search only looks at the first 300 characters. An invalid regular expression shows the error in place of the summary.

## Replace in files

The button to the left of the field, **Show the replace row**, opens the **Replace with** field. The **Replace in Files** key opens it too: <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> in WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> in WebStorm (macOS) and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>H</kbd> in VS Code. From the key, with a one-line selection in the code, the selected text goes into the search. In WebStorm (macOS), <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> only replaces with the cursor in the code; outside it, it is still [**Restore all**](/docs/sessions-and-recovery#restore-all).

Each row of the list shows the old text struck through and the new one beside it; in a regular expression search, `$1` and `${name}` already show replaced. On each file, **Replace in this file** replaces only there, and **Remove from the list** leaves the file out. **Replace all** asks first, with how many occurrences and files will change, and is off when the list was cut short: "Too many results; narrow the search". While a new search runs, the previous list stays on screen, and the buttons wait for the new one.

An open tab gets the replacement in its own text, with undo. A closed file is written after it goes into the [local history](/docs/local-history). A file that changed after the search is left out, and the notice names it.

## Open a file by name

**Open file** finds a file in the session's folder by name and opens it in the editor. Outside the code, use <kbd>⌘</kbd> <kbd>P</kbd> in every keymap. With the cursor in the code, use your keymap's key: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> in WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> in WebStorm (macOS) and <kbd>⌘</kbd> <kbd>P</kbd> in VS Code; in the WebStorm keymaps, <kbd>⌘</kbd> <kbd>P</kbd> there shows the parameters.

Just type the name's letters in order, without them needing to be together; a match on the file's name ranks above a match on its folder only. The arrows choose, <kbd>↵</kbd> opens, and <kbd>Esc</kbd> closes. The list shows up to 50 files and leaves out what git ignores, `.git` and the **Hide files** patterns. In a folder with more than 20,000 files, it says the list is partial.

## Search the open file

With the cursor in the code, <kbd>⌘</kbd> <kbd>F</kbd> opens **Find** at the top of the editor, in every keymap. **Replace** is <kbd>⌘</kbd> <kbd>R</kbd> in the WebStorm keymaps and <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> in VS Code. With the cursor in the field, <kbd>F3</kbd> and <kbd>⌘</kbd> <kbd>G</kbd> go to the next match, and with <kbd>⇧</kbd> to the previous one, in every keymap; <kbd>Esc</kbd> closes it.

Back in the text, **Find Next** follows the keymap: <kbd>F3</kbd> or <kbd>⌃</kbd> <kbd>L</kbd> in WebStorm, <kbd>⌘</kbd> <kbd>G</kbd> in WebStorm (macOS) and <kbd>⌘</kbd> <kbd>G</kbd> or <kbd>F3</kbd> in VS Code, and with <kbd>⇧</kbd> the previous one. In WebStorm (macOS), <kbd>F3</kbd> toggles a [bookmark](/docs/code-navigation#bookmarks), as in WebStorm. With no search made, the key opens **Find**.

## Keys

| Action | Key |
| --- | --- |
| Search all files | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, anywhere; in WebStorm, outside the terminal, also <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| Open a file by name | <kbd>⌘</kbd> <kbd>P</kbd> outside the code, or the keymap's key in the code |
| Find in the file | <kbd>⌘</kbd> <kbd>F</kbd> |
| Replace in files | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> (WebStorm), <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> in the code (WebStorm (macOS)) or <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>H</kbd> (VS Code) |
| Replace in the file | <kbd>⌘</kbd> <kbd>R</kbd> (WebStorm) or <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> (VS Code) |

On Windows and Linux, which are in preview, use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>; in the VS Code keymap, **Replace** is <kbd>Ctrl</kbd> <kbd>H</kbd>. **Replace in Files** is <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> in the WebStorm keymaps, only with the cursor in the code (outside it, the key is **Restore all**), and <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>H</kbd> in VS Code. In the WebStorm keymaps, **Find Next** is <kbd>F3</kbd> or <kbd>Ctrl</kbd> <kbd>L</kbd>.

## Plan and limits

Search, replacing in files, **Open file** and searching the open file are on the free plan.

Search looks only inside the session's folder, never in other sessions or workspaces. It reads plain text: a file that is not UTF-8 is left out.
