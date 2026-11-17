---
title: Search
description: Search for text in every file of the session's folder, open a file by name, and find and replace in the open file.
group: code
order: 6
---

**Search** looks for text in every file of the session's folder and takes you to the line where it is. This page also shows how to open a file by name and how to search only the open file.

## Search the files

Open **Search** from its icon, in the tool bar on the session's right edge, or with <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, which puts the cursor in the **Search all files** field. The search starts at 2 characters, as soon as you stop typing.

Beside the field are **Match case**, **Whole word** and **Regular expression**. Results come grouped by file, with the folder, how many times the text appears and each line with the match highlighted; the summary says, for example, "12 results in 3 files". A click on a line opens the file in the **Code** panel, at that line.

## What is left out

The search skips what git ignores, the `.git` folder, the **Hide files** patterns ([Hide files](/docs/files#hide-files)), files over 2 MB and binary files. Files and folders whose names start with a dot are searched, as long as git does not ignore them.

It stops at 2,000 results, and the summary says "partial list". An invalid regular expression shows the error in place of the summary.

## Open a file by name

**Open file** finds a file in the session's folder by name and opens it in the editor. Outside the code, use <kbd>⌘</kbd> <kbd>P</kbd> in every keymap. With the cursor in the code, use your keymap's key: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> in WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> in WebStorm (macOS) and <kbd>⌘</kbd> <kbd>P</kbd> in VS Code; in the WebStorm keymaps, <kbd>⌘</kbd> <kbd>P</kbd> there shows the parameters.

Just type the name's letters in order, without them needing to be together; a match on the file's name ranks above a match on its folder only. The arrows choose, <kbd>↵</kbd> opens, and <kbd>Esc</kbd> closes. The list shows up to 50 files and leaves out what git ignores, `.git` and the **Hide files** patterns. In a folder with more than 20,000 files, it says the list is partial.

## Search the open file

With the cursor in the code, <kbd>⌘</kbd> <kbd>F</kbd> opens **Find** at the top of the editor, in every keymap. **Replace** is <kbd>⌘</kbd> <kbd>R</kbd> in the WebStorm keymaps and <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> in VS Code. With the field open, <kbd>F3</kbd> and <kbd>⌘</kbd> <kbd>G</kbd> go to the next match, and with <kbd>⇧</kbd> to the previous one; <kbd>Esc</kbd> closes it.

## Keys

| Action | Key |
| --- | --- |
| Search all files | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, anywhere; in WebStorm, outside the terminal, also <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| Open a file by name | <kbd>⌘</kbd> <kbd>P</kbd> outside the code, or the keymap's key in the code |
| Find in the file | <kbd>⌘</kbd> <kbd>F</kbd> |
| Replace in the file | <kbd>⌘</kbd> <kbd>R</kbd> (WebStorm) or <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> (VS Code) |

On Windows and Linux, which are in preview, use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>; in the VS Code keymap, **Replace** is <kbd>Ctrl</kbd> <kbd>H</kbd>.

## Plan and limits

Search, **Open file** and searching the open file are on the free plan.

Search looks only inside the session's folder, never in other sessions or workspaces. It reads plain text: a file that is not UTF-8 is left out.
