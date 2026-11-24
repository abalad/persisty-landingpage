---
name: release-0-10-0
description: "Persisty 0.10.0 released 2026-11-10; site changelog and releases.json live (main aa01bac); what shipped and the site work still waiting for the user's OK"
metadata:
  type: project
---

0.10.0 was published on 2026-11-10 (GitHub v0.10.0; the app's latest.json announces it). The user gave a direct OK, and the site went live as main aa01bac: the changelog in pt-BR, en and es, with the clips `public/changelog/0.10.0/quadro.mp4` and `mascote.mp4`, plus `releases.json`. Vercel deploy gls5fjut0. The release e-mail had 0 subscribers, so nothing was sent.

Shipped in 0.10.0 (now "available", no longer "pending"):
- the Board (Quadro);
- the mascot outside the app, with its new body (macOS only on the site);
- editor keymaps (WebStorm, WebStorm (macOS), VS Code) and code intelligence (TS/JS/Rust language servers);
- MCP servers;
- account switch from a session's footer (Pro), pinned and reserved accounts (Pro), and the queue holding at the quota limit plus resume on renewal (app open);
- the new chat-like queue and the session tool bar;
- Files list width, Show in Finder, images and SVG preview, terminal path and www links;
- the ⌘W, ⌘←/→ and Ctrl-on-Mac shortcut changes.

The Remote and the phone app are still NOT released.

Site work for 0.10.0, all published on the user's OK (2026-11-10/11):
1. The Board and mascot pages (main 1fddcd9).
2. The docs (shortcuts, editor, AI accounts, Pro, troubleshooting), the Pro page's accounts and queue copy, and the tool bar on every session window, with the new queue drawn in the Pro window (main 2f5363b).
3. The changelog corrections: ⌘⇧T is VS Code's; the quota hold and resume are Pro.
4. PRODUCT.md is updated.

The source branches are kept in worktrees under `.superpowers/worktrees/` (board-mascot, release-0.10.0), which can be removed.

Related: [[board-and-mascot-pending]], [[publishing-the-site]].
