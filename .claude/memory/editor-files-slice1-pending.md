---
name: editor-files-slice1-pending
description: "Editor slice 1 (epic #390), RELEASED in 0.11.0 on 2026-11-12: file tree multi-select, New from templates, Open in…, copy path/reference, reload from disk, editor tab close menu; changelog live; docs published 2026-11-13 (site main 1a0bcee)"
metadata:
  node_type: memory
  type: project
  originSessionId: 4af6f56e-8ec9-47a5-a056-c06e4f570174
  modified: 2026-11-12T10:58:09.490Z
---

**Released in 0.11.0 (2026-11-12).** The site's changelog and releases.json are live (main 61dc0a5). The two fixes shipped too: the queue no longer types "continue" before the next renewal, and closing an edited tab with autosave on saves without asking. The docs (editor-and-git Files section, shortcuts Files table) were published on 2026-11-13 (site main 1a0bcee); see [[release-0-12-0]].

Announced by persist-application-40 on 2026-11-12. It is on the app's main (a5f91242, epic #390, editor slice 1) and NOT in any released version; the last release is 0.10.0.

In the file tree:
- multi-select, and the context menu from the keyboard (Shift + F10);
- **New**, with templates per language;
- **Open in**: Finder, a terminal in the folder, the default app, the browser, the IDE at the current line, and the page on GitHub, GitLab or Bitbucket;
- **Copy path** and **Copy reference** (Command + Shift + C);
- **Reload from disk** and Option + Command + Y.

In the editor tab, a menu with every way to close. In Settings › Shortcuts, a new **Files** group.

**Why:** planned ≠ available. Nothing goes on the site as available until a version ships it.

**How to apply:** when a version ships it, update in pt-BR, en and es:
- `content/docs/*/editor-and-git.md`, the Code section. It says "Show in Finder" on right-click; that becomes "Open in…", and it adds New, copy path/reference and reload.
- `content/docs/*/shortcuts.md`: ⌘⇧C, ⌥⌘Y, Shift + F10.
- `content/docs/*/troubleshooting.md`: the line "No editor: renomear ou apagar arquivos" stays unless the release also adds rename and delete; ask the app session.

Copy rules: no tmux or supervisor, and no promise of work with the app closed. Related: [[editor-terminal-features-pending]], [[release-0-10-0]].
