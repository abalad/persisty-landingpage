---
name: editor-slice6-pending
description: "Editor slice 6 (epic #390): released in 0.15.0 (app 2026-11-24, site live 2026-11-26, main a25c595); changelog and docs published"
metadata:
  node_type: memory
  type: project
  originSessionId: 776ca16d-ed66-4fd4-9667-ce19883b7b5e
  modified: 2026-11-26T20:12:50.961Z
---

Relayed 2026-11-24 by the app session (mascote-animado-f5). Ready on persist-application main and checked by the user in the installed app, but **not released**. Save for the changelog and docs of the next version after 0.14.0; publish nothing as available before launch.

Source of truth: `[Unreleased]` in persist-application's CHANGELOG.md (first five "Adicionado" lines) and `docs/LIMITATIONS.md`. Shortcuts below are the WebStorm Classic map on Mac; on Windows/Linux Option becomes Alt.

1. **Rename and move update the imports (#443).** Shift+F6 in the tree and on the tab, F6 in the tree, drag in the tree, cut and paste. Before touching the disk the app asks the language server; a preview lists the files that change, each with a checkbox; Enter confirms, Escape cancels, unchecking all only renames. The final notice says how many imports were updated and what was left out. If the server doesn't answer in 3 s, names collide at the destination, or the move stops halfway, the file still moves and the notice says why the imports stayed. Copy doesn't touch imports. TypeScript and JavaScript only; renaming a Rust module doesn't update `mod` yet (#447).
2. **Find usages of a file (#399).** Option+F7 in the tree and on the tab, or from the menus; the Usages panel lists the files that import it. TypeScript and Rust use the language server; when it doesn't answer, a text search runs and the panel title says so. Inside code the same key still finds a symbol's usages.
3. **Deleting a file others import warns where (#427).** The confirmation lists up to 10 places (`path:line`) and "e mais N", and the button becomes "Excluir mesmo assim". Only if the server answers within 3 s total (startup included); otherwise the usual confirmation. Files also going to the Trash are left out, and a folder's contents aren't searched.
4. **"Mover para um arquivo novo" and code actions that create, rename or delete files (#444).** In Option+Enter and "Refatorar…". The code goes to a new file that opens in a tab. Deleting goes to the Trash, overwritten content stays in local history, tabs follow renamed or deleted files. "Mover para um arquivo…" (pick a destination) doesn't exist yet.
5. **Inspect code (#400).** In the menu of a file, folder or tree selection, the tab menu and the command palette; no shortcut. Language servers analyse files, open or not, up to 2,000 per project. Problems show in an "Inspeção" section of the Problems panel, apart from the live list, grouped by file with errors first. Shows progress ("20 de 45 arquivos"), Cancelar and Fechar, click goes to the line. Files the server didn't reach are left out and the section says how many; never shown as clean. About 200 files in ~20 s with the server warm.

**Released:** all five went out in 0.15.0 (app release 2026-11-24; site changelog and docs live 2026-11-26, main a25c595; see [[release-0-15-0]]). Two details changed from the list above: Rust renames do update imports (rust-analyzer declares willRename); only Shift+F6 on a `mod` in the code doesn't rename the file yet (#447). The action shows the TypeScript server's English name, "Move to a new file".

**Why:** planned ≠ available; the app session asked to hold it until the release.

**How to apply:** the docs for these features are published; when a later version changes them, update the pages named in [[release-0-15-0]].
