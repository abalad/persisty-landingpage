---
name: editor-git-slice3-pending
description: "Editor slice 3 (file Git: inline blame, annotate, Git submenu, read-only diffs), app main ac9f562; ships in 0.13.0 (built 2026-11-16, site changelog in worktree release-0.13.0, not pushed yet)"
metadata:
  node_type: memory
  type: project
  originSessionId: 4af6f56e-8ec9-47a5-a056-c06e4f570174
  modified: 2026-11-13T14:18:09.187Z
---

**Ships in 0.13.0** (built 2026-11-16); see [[release-0-13-0]]. Until the site push, it is still not on the site.

Announced by the mascote-animado-7c session on 2026-11-13. It is on the app's main (`ac9f562`), checked by the user, and NOT in any released version. The last release is 0.12.0 ([[release-0-12-0]]). The peer will say when it ships.

What it adds (it goes into the app's CHANGELOG.md `[Unreleased]`):
- At the end of the cursor's line: the commit's author, date and message (GitToolBox-style), with a card offering Copy hash, Show the commit and Open on the forge. Its options are in Settings › Editor.
- Annotate: git blame in the gutter.
- A Git submenu in the file tree and the editor tab: diff, history of the file and of the selection, compare with a branch or commit, stage, unstage, discard, annotate. The diffs open in read-only tabs.
- Discard saves a restore point first.
- Gutter marks follow a commit.
- Undo is no longer lost when an image, a file or a diff opens.

**Why:** planned ≠ available. Nothing goes on the site as available until a version ships it.

**How to apply:** when the editor docs for 0.11.0/0.12.0 are updated (see [[editor-files-slice1-pending]]), leave all of this out. When the version that ships it is announced, add it to the changelog in pt-BR, en and es and to `content/docs/*/editor-and-git.md`. Don't name GitToolBox on the site. Copy rules: no tmux or supervisor, and no promise of work with the app closed.
