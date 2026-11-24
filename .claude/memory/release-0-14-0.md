---
name: release-0-14-0
description: "Persisty 0.14.0 (2026-11-17): LSP phase 2 (usages, rename, fixes, refactor, format), WebStorm navigations, local history, session header without Stop/Start/Rename/Remove; site live 2026-11-19 (main f723303) with changelog, downloads and docs"
metadata:
  type: project
---

**Live 2026-11-19:** the user OKed here. Site main f723303 merges c4de8ad (changelog), 8f2c4e6 and 4889f51 (docs: 3 new pages code-navigation, usages-and-refactoring, local-history, plus updated pages; reviewed against app db7e927 with no false claims), and 14c4e10 (releases.json). Vercel dpl_6nsnscFphtQbNPk5KccbFREi11rs is Ready. Checked live: download, versions, the Mac redirect to Persisty_0.14.0_universal.dmg, changelog in three languages, the new docs pages. 0 e-mail subscribers, nothing sent. Worktree and branch removed.

On 2026-11-17 the app session (mascote-animado-70) built 0.14.0 and asked for the site changelog.
- Installers: built from app commit 2b0b3a6 (branch release/0.14.0), which is db7e927f plus the version bump and the rolled changelog. The tag v0.14.0 will point at 2b0b3a6; `publish.mjs` creates it on the user's OK.
- Site worktree: `.superpowers/worktrees/release-0.14.0` (branch release/0.14.0, from site main 2f18371).
  - Commit c4de8ad holds the changelog in three languages, unchanged from the draft, plus 0.14.0 in tests/content.test.ts and a `## 0.14.0` inventory section.
  - The docs for the 0.14.0 features are being written in the same worktree, checked against db7e927f, per [[release-updates-docs]].
- The peer suggested putting the docs "in a separate step after the release". I declined: the user's rule puts the docs in the same push, and the inventory test enforces it.
- The push of the site waits for:
  - the docs commit;
  - the app session's `publish.mjs --confirm`, which writes src/data/releases.json in the worktree; I commit that file;
  - the user's direct OK, asked in this session.

Delivery 2 of [[docs-per-feature]] (re-recording 22 clips) is paused for this release. The plan was not written yet; recon showed the app's `scripts/media/clips/<version>.mjs` modules can be re-run against the latest tag with `--out` to a new folder, so changelog clips are not overwritten.
