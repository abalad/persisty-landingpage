---
name: release-0-15-0
description: Release 0.15.0 (editor slice 6 + three fixes) live on the site 2026-11-26 (main a25c595); app release v0.15.0 published 2026-11-24
metadata:
  type: project
---

0.15.0 holds editor slice 6 (see [[editor-slice6-pending]]) and three fixes (app #450, #451, #452). The app session (mascote-animado-f5) built it from app release/0.15.0 at d5fa44b; the GitHub release v0.15.0 on abalad/persisty-releases was published 2026-11-24 13:03 UTC (dmg, exe, AppImage, deb, updater files).

Site, live 2026-11-26: merge a25c595 on main ("Merge release/0.15.0: renaming and moving files without breaking the imports"), Vercel deployment dpl_G1RUiFx8XwWYnBKwaMdHbDcoGVEJ, aliased to persisty.app, GitHub status "Vercel: success" on a25c595.

- 46977bd: the changelog in three languages, 0.15.0 in tests/content.test.ts, and the `## 0.15.0` inventory section. Two corrections to the app session's draft: the imports preview opens only when there are imports to change, and the list shows the TypeScript server's English name "Move to a new file" (the app passes no locale to typescript-language-server).
- fd562af: docs in files (#imports-ao-renomear-e-mover, #excluir, #usos-e-inspeção), usages-and-refactoring (#usos-de-um-arquivo, #mover-para-um-arquivo-novo, #inspecionar-código), the tab menu, the bottom panel, shortcuts, troubleshooting and PRODUCT.md. The editor features got no video: the demo's fake language server has no usages or rename.
- 9d085a2: the "Corrigido/Fixed/Corregido" section with the three fixes, plus inventory rows.
- f613bde: usage-and-quota says the palette and Settings open all projects; the `uso` video was re-recorded from a `git archive` copy of app d5fa44b (the palette now opens all projects directly). That one video shows the 0.15.0 interface; the other docs videos still show 0.14.0.
- cbb8056: src/data/releases.json from publish.mjs.
- Checks before the push: 306 vitest tests (`--testTimeout=30000`; at the default 5 s, docs-media can time out under load) and `tsc --noEmit` after `next typegen`.
- Rust: rust-analyzer declares willRename, so the docs say import updates work in TypeScript, JavaScript and Rust; the app session confirmed it. Shift+F6 on a `mod` in the code doesn't rename the file yet (issue #447).
- The user OKed the push on 2026-11-24, with the review page https://claude.ai/artifact/RRzyogn9ksX8UtFGXXdxEe. The release worktree and branch are removed.
- Cross-session messages to the app session get held when the permission modes differ; the first one (2026-11-24) expired undelivered.

Related: [[release-updates-docs]], [[publishing-the-site]]
