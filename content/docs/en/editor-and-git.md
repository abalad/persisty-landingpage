---
title: Editor, changes and notes
description: The editor beside the terminal, with the file tree, suggestions and errors from the project, the git changes tab, project search and notes.
group: work
order: 3
---

The session's tools sit in a thin bar on its right edge: **Code**, **Search** and **Notes** at the top, then **Changes**, **Restore points** and **Queue**, and **Details** last. A click opens that tool's panel beside the bar, and the same click closes it; <kbd>⌘</kbd> <kbd>&#92;</kbd> opens and closes it too. With the panel closed, Changes shows how many files changed and the Queue how many requests are waiting. The divider between the terminal and the panel can be dragged.

## Code

The editor opens the session's folder as a tree. Files git ignores are dimmed. The Files list changes width: drag the divider, or use the arrows with it in focus; a double click restores the default. The tree creates, renames, moves, copies and deletes files; see [Files](#files).

- <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> searches every file, <kbd>⌘</kbd> <kbd>F</kbd> finds and replaces in the open file and <kbd>⌘</kbd> <kbd>S</kbd> saves. To open a file by name, use <kbd>⌘</kbd> <kbd>P</kbd> outside the code, or your keymap's key inside it (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> in WebStorm).
- Syntax highlighting, loaded on demand, in the terminal's theme.
- Git marks in the gutter and a diff against HEAD. Who changed each line and the file's history are under [Git in the file](#git-in-the-file).
- If the file changes on disk (the agent edited it), Persisty tells you: reload or keep your version. Tabs with no changes reload on their own.
- Images open in the editor (PNG, JPG, GIF, WebP, BMP and ICO), fitted to the panel, with their dimensions and size; a click shows the actual size. An SVG opens as code and gets a preview, like Markdown (the eye button, or <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd>), drawn as an image and running no script.

Other binary files and files over 5 MB do not open.

## Files

Right-clicking a file or folder opens the file menu; with the tree in focus, <kbd>⇧</kbd> <kbd>F10</kbd> opens it too. <kbd>⌘</kbd> + click and <kbd>⇧</kbd> + click select several items, the arrows move through the tree and <kbd>↵</kbd> opens the file.

**New** creates a file or a folder. TypeScript, JavaScript, HTML, CSS, JSON, Markdown, Dockerfile and EditorConfig files start with a minimal template. **Rename** edits the name in the row itself, and open tabs follow the file with their unsaved text and undo. **Move to…** and **Copy to…** pick the folder from a list with search. Dragging an item onto a folder moves it too, and with <kbd>⌥</kbd> it copies. With the tree in focus, <kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd> and <kbd>⌘</kbd> <kbd>V</kbd> cut, copy and paste files, to and from the Finder as well.

**Delete** always asks first and sends to the Trash. For 10 seconds, **Undo** in the notice or <kbd>⌘</kbd> <kbd>Z</kbd> brings the file back. When the name already exists at the destination, Persisty asks once: rename, replace (the old one goes to the Trash) or skip, and it can do the same for the rest. A file with unsaved changes is never replaced without your say-so. Large copies show their progress and can be cancelled without leaving anything half done. If a move or copy stops partway, what already went stays, and the notice says which item failed.

**Open in** takes the file to the Finder, a terminal in its folder, the default app, the browser, your IDE at the current line or its page on GitHub, GitLab or Bitbucket. The IDE is the one you choose in **Settings › General**. **Copy Path** gives the absolute path, the path from the project or from the repository root, the name, the `file:line` reference and the file's link on the forge. **Reload from Disk** reads again what changed outside the editor. **Change File Type** reads a file as another language, such as a `.env` as Shell, and the choice follows the file when it moves.

Right-clicking an editor tab has every way to close: the tab, the others, all, the unmodified ones, and those to the left or right. Only tabs with unsaved changes ask first, in a single question. The same menu renames the file, changes its type, copies its path, opens it elsewhere and reloads it from disk.

In the WebStorm keymaps, the keys are the IDE's: <kbd>⇧</kbd> <kbd>F6</kbd> renames, <kbd>F6</kbd> moves, <kbd>F5</kbd> copies to another folder, <kbd>⌫</kbd> deletes, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> copies the path, <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> copies the reference and <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> syncs the tree with the folder. In the VS Code keymap, these actions are in the menu. **Settings › Shortcuts** has a **Files** group, with where each key works: in the tree, on the tab or in the editor.

On Windows and Linux, <kbd>Ctrl</kbd> and <kbd>Alt</kbd> stand in for <kbd>⌘</kbd> and <kbd>⌥</kbd>, and <kbd>Delete</kbd> deletes. Pasting files to and from the system and undoing a delete are still being checked in use on those platforms.

## Tabs and groups

The editor splits into up to four groups, side by side or stacked, each with its own tabs. **Split Right** and **Split Down** are on the tab's right-click menu and in the palette (<kbd>⌘</kbd> <kbd>K</kbd>). Dragging a tab reorders it, takes it to another group or, dropped on a group's edge, creates a new one. The same file can be open in two groups: the text keeps in step and each side has its own undo, but only one of them shows the language server's suggestions and errors. **Maximize the editor** hides the terminal to make room, and the same command brings back the previous size.

**Pin Tab**, on the tab's right-click menu, moves the tab to the left, with a pin. A pinned tab does not close with **Close Other Tabs**, **Close All Tabs** or the tab limit. With the tab in focus, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> and <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> move it along the strip, and **Move Tab to Next Group** is in the palette.

In **Settings › Editor › Tabs**, choose the tab limit (20 by default; opening one more closes the least used, and pinned and unsaved tabs stay), where to go on close (the tab used before or the neighbouring one), where a new tab opens (at the end or right after the current one), whether the folder shows for repeated names and how unsaved tabs are marked (a dot or an italic name). The **Preview tab**, off by default, makes a click in the tree open a tab that the next click replaces; editing, or double-clicking the tab, keeps it. **Configure Tabs**, on the tab's right-click menu, goes straight there.

In the WebStorm keymaps, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> maximizes the editor, <kbd>⌥</kbd> <kbd>Tab</kbd> and <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> go to the next and previous group, and <kbd>⇧</kbd> <kbd>↵</kbd> in the tree opens the file on the right. In the VS Code keymap, these actions are in the palette and the tab menu. On Windows and Linux, moving a tab is <kbd>Alt</kbd> <kbd>⇧</kbd> with the arrows, maximizing is <kbd>Ctrl</kbd> <kbd>⇧</kbd> <kbd>F12</kbd>, and switching groups is in the palette.

## Git in the file

At the end of the cursor's line, after a moment's pause, the editor shows who changed the line, when and with what message. Hovering opens the commit card, with **Copy hash**, **Show the commit** and **Open on the forge**; from the keyboard, use **Show the line's commit card** in the palette. In **Settings › Editor**, **Line author (git blame)** turns it off, picks what shows (author, date, message) and how long to wait.

**Annotate with Git Blame** puts each line's author and date in the gutter, coloured by the commit's age. The annotation's menu shows the commit's diff, annotates the previous revision or closes the annotation. Files over 20,000 lines are not annotated.

The **Git** submenu, on the right-click menu of the tree and the tab, has **Show Diff**, **Show History**, **Show History for Selection** (with the lines selected in the code), **Compare with Branch…**, **Compare with Commit…**, **Stage**, **Unstage**, **Discard Changes** and **Annotate with Git Blame**. Diffs and history open in read-only tabs. All of these are in the palette too.

**Discard Changes** asks first and takes a restore point, "Before discarding changes". To bring the file back, use the **Restore points** panel; this works on the free plan too.

## Suggestions, documentation and errors

In TypeScript, JavaScript and Rust, the editor talks to the language server. Suggestions come from the project, with each one's type and documentation, and picking a function from another file writes the `import` for you. Resting the pointer on a name shows its documentation, opening the `(` of a call shows its parameters, and errors are underlined. In Rust, `cargo check`'s errors refresh every time you save.

When the language server is not on the computer, the app downloads it. The status bar shows its state (downloading, indexing, ready or stopped) and how many errors and warnings the file has; clicking there restarts the server or shows its log.

Go to definition works into other files too. A definition in the standard library or in a dependency outside the project opens read-only, with a lock on the tab and "Outside the project · read-only" in the status bar: you can browse and read, but nothing is edited. In Rust, the standard library needs its source in your toolchain (`rustup component add rust-src`); the app never changes the toolchain on its own.

## Keymap

In **Settings › Editor › Keymap**, pick **WebStorm** (default), **WebStorm (macOS)** or **VS Code**. The keymap applies inside the code; its tab and find-action keys work across the app. Each key does the real action, and where the action does not apply, the key goes on to the app. **Settings › Shortcuts** lists every key of the chosen keymap and of Persisty, searchable.

In WebStorm (default):

| Action | Key |
| --- | --- |
| Go to definition | <kbd>⌘</kbd> <kbd>B</kbd> or <kbd>⌘</kbd> + click |
| Call parameters | <kbd>⌘</kbd> <kbd>P</kbd> |
| Documentation | <kbd>⌃</kbd> <kbd>J</kbd> |
| Back and forward through the places you visited | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> and <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> |
| Next and previous error | <kbd>F2</kbd> and <kbd>⇧</kbd> <kbd>F2</kbd> |
| Open file by name | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> |
| Duplicate the line | <kbd>⌘</kbd> <kbd>D</kbd> |
| Delete the line | <kbd>⌘</kbd> <kbd>Y</kbd> |
| Go to a line | <kbd>⌘</kbd> <kbd>G</kbd> |
| Start and end of the block | <kbd>⌘</kbd> <kbd>[</kbd> and <kbd>⌘</kbd> <kbd>]</kbd> |
| Move the statement, with the comments above it | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> |
| Find action | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> |

The VS Code keymap keeps its own keys, such as <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> to find an action and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>T</kbd> to reopen the last closed tab. In every keymap, <kbd>⌃</kbd> <kbd>Tab</kbd> opens the tab switcher, in the order you used them, and <kbd>⌘</kbd> <kbd>K</kbd> also lists the editor's actions. On Windows and Linux the same actions use <kbd>Ctrl</kbd>.

## Changes

The **Changes** tab (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd>) lists the changed files with git's status letters, and a click shows the diff; **Open in editor** goes to the file. Stage or unstage per file or all at once, write the message and commit with <kbd>⌘</kbd> <kbd>↵</kbd>, or use **Commit and push**. With nothing staged, **Commit all** stages every change and commits. Under **More commit actions**, **Amend last commit** adds what is staged to the last commit, and **Undo last commit** takes the commit back, with its changes staged and its message in the box. If that commit was already pushed, Persisty warns that the next push will have to be forced.

Right-clicking a file discards its changes, with a restore point first, as in the editor. The same menu ignores the file, the folder or everything with the same name (Persisty writes the `.gitignore`), copies the path and shows it in Finder.

The panel shows whether the branch is up to date with the remote and offers to pull or push what is missing, **Publish branch** when the branch is not there yet, and **Fetch from the remote**. **More sync actions** holds **Pull with rebase**, **Pull with merge** and **Force push**, which only replaces the remote if nobody pushed anything since the last fetch. When both sides have new commits, Persisty asks how to join them: merge or rebase.

During a merge, rebase, cherry-pick or revert, the panel shows the operation and the conflicting files. For each one, pick **Accept the current version** or **Accept the incoming version**, or edit it and use **Mark as resolved**. Then **Continue** finishes, and **Abort** puts everything back as it was before it started.

The history shows what has not been pushed yet and the files in each commit. If git asks for a password to push, Persisty shows the refusal as git wrote it.

## Notes

Each project has Markdown notes, saved on their own in Persisty's local database. Notes keep their old keys, with no keymap.
