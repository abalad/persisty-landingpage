---
name: release-0-12-0
description: "Persisty 0.12.0 released 2026-11-12 (site main a8870c0, live 2026-11-13): file operations in the editor tree (rename, move/copy, drag, cut/copy/paste with the system, Trash with Undo); docs for 0.11.0 and 0.12.0 published 2026-11-13 (site main 1a0bcee)"
metadata:
  type: project
---

0.12.0 was published on GitHub (v0.12.0) by the mascote-animado session. The user OKed the site push here: main a8870c0, changelog commit 104ab46, releases.json commit 513a724, Vercel nsmnn1z9e. The release e-mail had 0 subscribers, so nothing was sent.

What shipped, in the editor's file tree:
- rename (Shift + F6);
- move and copy to a folder (F6 and F5);
- drag to move (Option or Alt copies);
- cut, copy and paste, also with Finder, File Explorer and the Linux file manager;
- delete to the Trash with Undo (10 s);
- one question when a name is taken;
- progress and cancel for big copies;
- change a file's type (also from the palette);
- a move or copy that stops midway keeps what already went.

On Windows and Linux, pasting with the system and Undo after delete are still being checked in real use, and the changelog says so.

**Docs published 2026-11-13 (site main 1a0bcee, user's OK):** editor-and-git has a Files section in pt-BR, en and es; shortcuts has a Files table; the troubleshooting line about renaming or deleting files is gone; PRODUCT.md has a 0.11.0/0.12.0 line. Fact checked in the app's v0.12.0 code: the file keys (Shift+F6, F6, F5, Backspace/Delete, ⌘⇧C, ⌥⌘⇧C, ⌥⌘Y, New) exist only in the WebStorm keymaps; the VS Code keymap has only the fixed ⌘X/C/V and ⌘Z in the tree, plus Shift+F10, and uses the menu for the rest. See [[editor-files-slice1-pending]].

Site release flow: the app session's `prepare.mjs` and `publish.mjs` use `PERSISTY_SITE=<worktree>`, because the site's main checkout may sit on another branch. See [[publishing-the-site]].
