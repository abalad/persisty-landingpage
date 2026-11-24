---
name: release-0-13-0
description: "Persisty 0.13.0 (2026-11-16): editor Git per file (slice 3), split editor/tabs (slice 4), background-work fix #435; site live 2026-11-16 (main 3b84236); docs published the same day (main 629c6c4)"
metadata:
  node_type: memory
  type: project
  originSessionId: 4af6f56e-8ec9-47a5-a056-c06e4f570174
  modified: 2026-11-16T21:25:13.017Z
---

The app session (mascote-animado-9f, which restarted as mascote-animado-74) built 0.13.0 on 2026-11-16 and asked for the site worktree, as with 0.12.0.

**Live on 2026-11-16.** The user OKed the push here (AskUserQuestion). Site main 3b84236 merges 7cacaa5 (changelog) and abd7d6b (releases.json). Vercel dpl_FZx9deEsY1SWSnbT6EnTNJ3sDFWx is Ready. Checked live: download, versions, the Mac redirect to Persisty_0.13.0_universal.dmg, and the changelog in three languages. 0 e-mail subscribers, nothing sent. The worktree and branch are removed. The app session had ended before the result could reach it. The app's CHANGELOG is aligned with my three edits (app 544b5f5, tag v0.13.0).

State before the push:
- Worktree `.superpowers/worktrees/release-0.13.0`, branch `release/0.13.0`, from site main 1a0bcee. Commit 7cacaa5 has the changelog in pt-BR, en and es, plus 0.13.0 in the `tests/content.test.ts` version list.
- The app session runs `publish.mjs` with `PERSISTY_SITE=<that worktree>`, which writes `src/data/releases.json` there.
- Nothing is pushed. The push happens only on the user's direct OK (AskUserQuestion), never on a peer's relay. See [[publishing-the-site]].

What 0.13.0 ships (all free):
- **Editor slice 3, Git per file** (app ac9f562): commit author, date and message at the end of the cursor's line, with a commit card; git blame in the gutter; a Git submenu in the tree and on the tab; diffs and history in read-only tabs. Discard takes a restore point first. That point is recorded on Free too, and the Restore points panel lists it; only recording a point per request is Pro. See [[editor-git-slice3-pending]].
- **Editor slice 4, tabs and groups** (app bcbff0d):
  - pin a tab; Settings › Editor › Tabs;
  - split into up to 4 groups, side by side or stacked; the same file on both sides keeps its own undo, but only one view gets completion and diagnostics;
  - Option+Tab goes to the next group; Option+Shift+arrows move a tab;
  - Maximize the editor (Command+Shift+F12) hides the terminal;
  - Shift+Enter in the tree opens to the right; drag tabs between groups.
- **Fix #435** (app e3b30da): a session with background work keeps showing "Working" until the work ends. The queue, the done notice and the check wait for the real end.
- Fixes: focus when switching sessions, closing several tabs with a conflict, a Replace that fails, Copy path.

My edits to the peer's draft, which I sent to the peer so it can align the app's CHANGELOG:
- The panel is named "Pontos de restauração" / "Restore points" / "Puntos de restauración", not "Restaurar".
- The background-work fix no longer names a state. The en app labels it "Idle", not "Stopped".
- "Monitores" became "comandos ainda rodando".
- The Windows check now says "em máquinas reais".

Machine-load gotcha: with load around 39, `tests/clips.test.ts` and `tests/releases.test.ts` time out at 5 s even without the new files. `vitest run --testTimeout=60000` passes all 243.

**Docs published 2026-11-16 (main 629c6c4, user's OK):** editor (tabs and groups, Git in the file, the Changes panel), shortcuts, plus the full audit; see [[release-updates-docs]].

**How to apply after it ships (done):**
1. Push on the user's OK and verify live (download, the Mac redirect, changelog in three languages). Count announce subscribers; `--send` only on the user's OK.
2. Then offer the docs: editor-and-git needs Git per file, split groups, tabs settings and pinning; shortcuts.md needs ⌘⇧F12, Option+Tab, Option+Shift+arrows and Shift+Enter, checked against the app's keymap presets per keymap (the file keys turned out to be WebStorm-only). Don't name GitToolBox.
