---
name: board-and-mascot-pending
description: "Unreleased app features: the Board (Quadro) replacing the Studio, and the mascot outside the app (macOS only), which since app main 97a18d5 (2026-11-10) has a 3D body that walks on windows; site work ready on branch release/board-and-mascot, publish only when the version ships and the user OKs"
metadata:
  node_type: memory
  type: project
  originSessionId: 4af6f56e-8ec9-47a5-a056-c06e4f570174
  modified: 2026-11-11T00:25:14.126Z
---

**Released in 0.10.0 (2026-11-10).** The app shipped it, and the site's changelog for 0.10.0 is live (main aa01bac). It is no longer "not released". The site's own pages and docs for it still wait for the user's OK; see [[release-0-10-0]].

Announced by persist-application-11 on 2026-11-09. Both are free and on the app's local main (746c478), not released; the last published version is 0.9.4.

- **Board (Quadro)** replaces the Studio (Estúdio). It opens with ⌘⇧O (Ctrl+Shift+O on Windows and Linux), the kanban button beside the tabs, or ⌘K › "Quadro de sessões". It has four columns: Precisa de você / Trabalhando / Respondeu / Erro. In English these are Needs you / Working / Answered / Error.
  - On a Mac, with the cursor in the code, ⌘⇧O opens a file by name (WebStorm keymap, also unreleased). The docs say so; the app's changelog entry does not.
- **Mascot outside the app:** off by default (Settings › Appearance › Mascot outside the app). Advertise it as macOS only, because Windows and Linux are unverified. Quitting Persisty closes it.
- **Mascot's new body (app main 97a18d5, 2026-11-10, from mascote-animado-72, NOT released):** a new articulated 3D body. It stands on top of windows and rides along when they move (balances; too fast, it panics and slips), falls when they disappear (cartoon pause in the air), reacts to being dragged (startle, hanging, sideways flight), hits the screen edge and gets dizzy, and has idle life (walks, sits on a window top and naps, quirks every few minutes, waves when the cursor comes back).
  - New switch: Settings › Appearance › "O mascote anda sobre as janelas", on by default where windows can be read. The mascot outside the app itself stays OFF by default.
  - macOS only (window reading is macOS); on Windows and Linux it stays as before.
  - App changelog line ([Unreleased] › Adicionado): "O mascote fora do app ganhou um corpo novo: fica em pé no topo das janelas, vai junto quando elas se mexem, cai quando elas somem e tem vida própria quando nada acontece. Dá para desligar em Configurações › Aparência › O mascote anda sobre as janelas."
  - Clips approved by the user (MP4 + GIF) for the release: `persist-application/.claude/worktrees/mascote-animado/.superpowers/clips/mascote/` (a-janela-some, desespero, tombo, pego, batida, passeio-janela, sentado, cursor-chega, alguem-pede, comemora, laboratorio-30s, grade). The windows in them are a dev lab, not real screens: don't caption them as real app screens.
  - On release, update the branch's "O mascote fora do app" docs section and changelog draft with this, and consider the clips for the feature. Copy: never say it works with the app closed; no performance/CPU claims; no tmux/supervisor; never cite AgentDeck or Tina.
- The Studio was never named on the site. The hero's 3D welcome scene (`src/components/studio/`) is unchanged and stays.
- The idea came from AgentDeck (Celero) and Tina. Never cite either; the code and art are ours.

**State on 2026-11-10 (evening): 0.10.0 is being released now** (the mascot session asked; the user decided; fixes ship as 0.10.x). The site's main checkout is used by another session (it was on `feat/account-deletion`). Work in worktrees under `.superpowers/worktrees/` (gitignored); clone node_modules with `cp -cR` (a symlinked node_modules breaks Turbopack).
- `release/0.10.0` (worktree `release-0.10.0`, commit 3c047a8, local only): the full 0.10.0 changelog in three languages from the app's [Unreleased] (e67a656, 36 items), dated 2026-11-11, plus the clips `public/changelog/0.10.0/quadro.mp4` (recorded from the app demo) and `mascote.mp4` (the approved passeio-janela), plus the test. The hash went to the mascote-animado session. Its `prepare.mjs` needs `PERSISTY_SITE=<that worktree>` while the main checkout is elsewhere. The push goes with `releases.json`, on the user's OK.
- `release/board-and-mascot` (worktree `board-mascot`, commit 8aa11cb, on top of release/0.10.0): the redesign.
  - Board: `src/components/mockups/BoardMock.tsx` is now the window of home/free `#states` (which moved up on /free).
  - Mascot: the `#mascot` section on /free is `src/components/mascot/MascotStage.tsx`, the app's new 3D character copied into `src/components/mascot/` with shims.
  - The still is `public/art/mascot-asking.webp`.
  - Docs are rewritten as prose.
  - It waits for the user's OK on the before/after.
- Keymap fact: the default WebStorm keymap opens a file by name with ⌘⇧N; only "WebStorm (macOS)" uses ⌘⇧O in the code.
- Still to do for 0.10.0 docs: the other pending items' docs (keymaps and shortcuts.md, editor, accounts, queue, tool bar). See [[session-toolbar-pending]], [[editor-terminal-features-pending]], [[footer-account-switch-pending]], [[queue-hold-pinned-account-pending]].

**Redesign decided 2026-11-10 (user rejected the branch as "IA slop"; nothing rebuilt yet):** the two features were buried as text rows in "Também no grátis", with a meaningless icon (PictureInPicture2) and descriptive names. The docs were 7 bold-label bullets with an edge-case shortcut in the lead, the changelog had no clip, and the copy predates app 752cad3 (calmer board cards) and 97a18d5 (new mascot body). The user's answers:
- **Board:** its own section high on /free plus the window of the home "Você sabe qual agente precisa de você" section (replacing the agents-list mockup). Draw it in HTML inside the Persisty window with the site parts (`src/components/mockups/parts.tsx`, `--u` units): four columns, header chips ("3 precisam de você · há 6 d", "2 trabalhando", "7 não lidas"), the oldest-waiting card framed amber with "A abre esta", and one card moving Working→Answered live (instant under reduced motion). Tour it on phones (WindowTour). Use the site's invented projects (Rota, Quintal…), never the app's demo names.
- **Mascot:** live on the site with the NEW 3D body: port the app's rig (`apps/desktop/src/features/mascot/character/…`, `features/buddy/rig.ts`) next to `src/components/studio/buddy.ts`. Show it standing on a window top, rising with the count badge and a speech line when a session asks; a click opens the balloon. Reduced motion and no WebGL get a still.
- **Docs and changelog:** rewrite as short prose. Add a Board clip recorded from the app demo (`?board=1`, `scripts/media`) and the approved mascot clips.
- Visual truth: `vite --port 1488` in `persist-application/apps/desktop`, then open `/?board=1`. A capture is at the session scratchpad (`app-truth/board-1440.png`). Follow Impeccable "extend an existing surface": inherit DESIGN.md, run `impeccable detect` after the build, then the finish reviewer.

**Why:** planned ≠ available; the user asked (via the app session) for docs, feature pages and a changelog draft, with a before/after and their OK before publishing.

**How to apply:** when the version ships:
1. Rebase the branch on main.
2. Set the real version and date.
3. Merge the app's other unreleased items into the same changelog entry: [[session-toolbar-pending]], [[editor-terminal-features-pending]], [[footer-account-switch-pending]], the IDE code intelligence, MCP servers and the new request queue.
4. Add the Board and the mascot to PRODUCT.md's capabilities.
5. Optionally record a Board clip with the app's `scripts/media` (demo `?board=1`). The mascot can only be filmed on a real Mac.

Publish per [[publishing-the-site]].
