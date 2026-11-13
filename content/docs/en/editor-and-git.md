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
- Git marks in the gutter and a diff against HEAD.
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

The **Changes** tab (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd>) lists the changed files with git's status letters. Stage or unstage per file or all at once, write the message and commit with <kbd>⌘</kbd> <kbd>↵</kbd>, or use **Commit and push**. The history shows what has not been pushed yet and the files in each commit.

Discarding changes and resolving conflicts stay in the terminal beside it. If git asks for a password to push, Persisty shows the refusal as git wrote it.

## Notes

Each project has Markdown notes, saved on their own in Persisty's local database. Notes keep their old keys, with no keymap.
