---
name: editor-terminal-features-pending
description: "Unreleased app features on app main: resizable Files list, Show in Finder, images/SVG preview, terminal links (7e21180); editor keymaps WebStorm/VS Code (e8bda18) and code intelligence phase 1 via language servers (6ff68a8); ready, not released, no plan assigned"
metadata:
  node_type: memory
  type: project
  originSessionId: 776ca16d-ed66-4fd4-9667-ce19883b7b5e
  modified: 2026-11-10T12:00:00.000Z
---

**Released in 0.10.0 (2026-11-10).** The app shipped it, and the site's changelog for 0.10.0 is live (main aa01bac). It is no longer "not released". The site's own pages and docs for it still wait for the user's OK; see [[release-0-10-0]].

Announced by persist-application-87 on 2026-11-05. These are on the app's main (merge 7e21180) but NOT released, so they wait for the next version's changelog:
1. **Resizable Files list.** Drag the divider between the list and the code, or focus it and use the arrows. The width is remembered, and a double click restores the default.
2. **"Mostrar no Finder"** from the right-click menu on a file or folder in the Files list. On Windows it opens File Explorer and on Linux the file manager. A folder opens; a file shows selected in its folder.
3. **Images open in the editor:** PNG, JPG, GIF (animated stays animated), WebP, BMP and ICO. They are centred and fitted, with dimensions and file size; a click toggles actual size. SVG opens as code with a preview like Markdown's: the eye button, or ⌘⇧V on Mac and Ctrl+Shift+V on Windows and Linux. The preview is drawn as an image and runs no script.
4. **Terminal links:**
   - Disk paths become links: `/Users/…`, `~/…`, `C:\…`, and an error's `main.ts:12:5`. ⌘-click (Ctrl-click on Windows and Linux) opens the folder in the file manager with the file selected.
   - `www.` addresses without `http://` become links too and open as https.

**Added 2026-11-10 by persist-application-61, also on main and NOT released ("pronto, não lançado"). No plan decision (Free/Pro/Team): don't attribute a plan.**
5. **Editor keymap** (phase 1, main e8bda18), chosen in Configurações › Editor › Mapa de teclas:
   - Options: WebStorm (default, WebStorm keys on Mac: ⌘Y deletes the line, ⌘D duplicates, ⌘⇧U toggles case), WebStorm (macOS), VS Code.
   - Inside the code the keymap rules; outside it Persisty's keys, plus the keymap's tab and "buscar ação" keys.
   - VS Code two-key chords (⌘K then ⌘C) with a hint in the status bar.
   - Reopen closed tab; tab switcher by recent use (Control + Tab).
   - ⌘W no longer closes the window: in code it belongs to the keymap; in the Código panel it closes the tab.
   - Configurações › Atalhos lists every key spelled out, with search, what a key does inside and outside the code, and a warning when macOS takes a key (e.g. Control + Space for input source), saying where to turn it off and the alternative key.
   - The command palette lists editor actions with the keymap's keys. "Buscar ação" (⌘⇧A WebStorm, ⌘⇧P VS Code) opens the palette on them.
   - On Mac, app shortcuts respond only to Command.
   - Planned, NOT ready: phase 2 (bottom panel with Usages and Problems), phase 3 (Sublime, Zed, Vim keymaps).
6. **Code intelligence** (phase 1, main 6ff68a8), from language servers (TypeScript, Rust and others): go to definition (⌘-click or ⌘B), across files; parameters (⌘P); documentation (Control + J); errors in the code, F2 / Shift + F2 to next/previous. In Rust, std-library definitions need `rust-src` in the person's toolchain; the app never changes the toolchain.

Other IDE features (autocomplete from the project, references/usages…) remain planned. Stay off the site until a version ships them.

**Why:** planned ≠ available. The app session asked for a before/after and the user's OK before publishing.

**How to apply:** when a version ships these, update in pt-BR, en and es:
- `content/docs/*/editor-and-git.md`: the Files list paragraph (line ~12), and line ~19 "Arquivos binários e acima de 5 MB não abrem", since images now open.
- `content/docs/*/shortcuts.md`: the SVG preview shortcut.
- Somewhere the terminal links are described.

- When 5 and 6 ship: editor-and-git.md:19 and troubleshooting.md:29 say there is no "ir para definição" — drop that part (autocomplete stays listed as missing unless shipped). editor-and-git.md:14 says ⌘P opens a file by name, but in the WebStorm keymap ⌘P is parameters inside the code: recheck with the app session. shortcuts.md needs the keymap choice and the new keys. Changelog entries only when the version is released.

Until then the existing "no go to definition" lines stay. Copy rules: no tmux or supervisor, no promise that agents keep working with the app closed. Related: [[session-toolbar-pending]], [[footer-account-switch-pending]].
