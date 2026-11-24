---
name: docs-per-feature
description: "Docs are 37 pages, one per feature (pt/en/es); delivery 1 (text) live 2026-11-17, delivery 2 (27 videos of the 0.14.0 interface, public/docs-media) live 2026-11-24 (site main 0fd3367)"
metadata:
  node_type: memory
  type: project
  originSessionId: 4af6f56e-8ec9-47a5-a056-c06e4f570174
  modified: 2026-11-24T11:10:41.758Z
---

**Delivery 1 is live (2026-11-17, site main 2f18371).** The user asked for "a documentação completa de todas as versões… com imagens/gifs".
- 37 pages now, in six groups (start, agents, code, integrations, account, reference), in pt-BR, en and es.
- `docs/docs-coverage.md` maps every changelog item and the 16 Settings tabs to pages.
- Tests: `tests/docs-coverage.test.ts`, `tests/docs-links.test.ts`, and section parity in `tests/content.test.ts`.
- `/docs/editor-and-git` redirects (308) to `/docs/editor`.
- User decisions: one page per feature; two deliveries; clips follow the changelog pattern (one pt-BR recording, alt text in each language); paid features are the same on Pro and Team.

**Delivery 2 is live (2026-11-24, site main 0fd3367, Vercel dpl_BRKdxsropU2yTPgWbbi5z2isYKqC), with the user's OK.**
- 27 videos recorded on v0.14.0: 22 re-recordings of the 0.9-era changelog scenes, and 5 new scenes (files, split editor, blame, recent files, sign in).
- 23 of 37 pages have a video; board and mascot keep `/changelog/0.10.0/` clips. The other 14 give a reason in `## Páginas sem vídeo`.
- Where things live:
  - videos: `public/docs-media/<page>/<name>.mp4` + `.jpg`;
  - scenes: `scripts/docs-media/<page>.mjs`, with a README that has the recording steps and the gotchas;
  - inventory: `## Mídia` in `docs/docs-coverage.md`;
  - tests: `tests/docs-media.test.ts`, which checks disk ↔ inventory, the poster, alt text per language, the same section in en and es, and 3 MB at most.
- `public/changelog/` stays as is: the changelog shows each version's interface.
- How to record: the app's `scripts/media/record.mjs`, run from a `git archive` copy of the app at the tag (node_modules cloned from the app checkout when the lockfile matches), with Vite on port 1431 (1420 belongs to the app session). Nothing goes into the app repo.
- Gotchas:
  - TypeScript scenes need `lsp=fake`, or the status bar says "sem servidor".
  - Keep the cursor on the line numbers, or the fake server's hover catches the scroll wheel.
  - Right-click actions go through the palette, with the full action name.
  - The network log must show only POST calls: the demo gives git and GET calls sent bytes, and the app logs 0 for them.
  - Under load the demo sometimes opens on Nimbus; check the first frame.

**App bugs found** (told to the user, to fix in the app):
- `ui.locale` is saved but never read at startup.
- `editor.openIn.noIde` points to "Configurações › Geral"; the right path is Workspace › IDE padrão.
- The palette action "Uso de IA — todos os projetos" opens the current project's page (`openPage("usage")` takes projectId in AppShell). The docs `uso` video shows this.

Related: [[release-updates-docs]].
