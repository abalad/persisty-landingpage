---
name: session-toolbar-pending
description: "Pending app feature (on the app's main, not released as of 2026-11-03, due in 0.10.0): a fixed tool bar on the right edge of every session replaces the panel button; docs and mockups to update only on release"
metadata:
  node_type: memory
  type: project
  originSessionId: 776ca16d-ed66-4fd4-9667-ce19883b7b5e
  modified: 2026-11-03T13:49:06.989Z
---

**Released in 0.10.0 (2026-11-10).** The app shipped it, and the site's changelog for 0.10.0 is live (main aa01bac). It is no longer "not released". The site's own pages and docs for it still wait for the user's OK; see [[release-0-10-0]].

Announced by the persist-application session on 2026-11-03: the session's tools stop hiding behind the panel button and sit in a thin bar on the right edge of every session, top to bottom: Code, Search, Notes; Changes, Restore points, Request queue; Details. A click opens that tool's panel beside the bar and the same click closes it. With the panel closed, Changes shows how many files changed and the Queue how many requests wait. The panel button left the session header; ⌘\ still opens and closes it. User's choice: "fixed bar on the edge", code tools on top. Due in the next version with the rest of the app's main (0.10.0, date not set).

**Why:** planned ≠ available; nothing goes on the site as available until a version ships it.

**How to apply:** on release, rewrite in pt-BR, en and es: `content/docs/*/editor-and-git.md` (the "line of icons" sentence), `content/docs/*/pro.md` (the Pro tools live in the side panel), `content/docs/*/shortcuts.md` (⌘\ row wording), and check the session mockups in `src/components/mockups/parts.tsx` for a panel toggle in the header. Show the texts and a before/after to the user before publishing. Related: [[footer-account-switch-pending]].
