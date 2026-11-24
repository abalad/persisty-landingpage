---
name: queue-hold-pinned-account-pending
description: "Unreleased app batch merged to app main 4280ece on 2026-11-10 (next version, 0.10.0): queue holds at quota limit, resume on window renewal, project pinned to a Claude account, reserved account; site only as 'next version' until released"
metadata:
  type: project
---

**Released in 0.10.0 (2026-11-10).** The app shipped it, and the site's changelog for 0.10.0 is live (main aa01bac). It is no longer "not released". The site's own pages and docs for it still wait for the user's OK; see [[release-0-10-0]].

Announced by queue-hold-pinned-account-c6 on 2026-11-10. On the app's main and GitHub (merge 4280ece) but NOT in any released version. This was the batch the app's plan required before 0.10.0; the other gate (manual update test from 0.9.4 with the user's real accounts) is the app session's.

Pro unless noted:
1. **Queue holds at the limit:** when the Claude account hits its limit and there is no other account to go to, the session shows "Sem quota · volta às 19:14 na conta …" and the queue waits instead of sending to an exhausted account. A turn that fails with a server error also holds the queue until the person releases it. The notice shows on every plan; holding and resuming are Pro.
2. **Resume on renewal:** with the app OPEN, a conversation cut by the limit continues on its own when the account's window renews (one "continue" per renewal, never early), with a notification.
3. **Project pinned to an account** (by e-mail and organization, e.g. the company account), optional in the project's settings. Its sessions only open on that account, never switch, and at the limit wait for that account's window.
4. **Reserved account:** an account kept only for the projects pinned to it; rotation and other projects skip it.
5. Fixes (changelog only): a queued request no longer sits as a draft in Claude Code; "quando a janela de 5 h renovar" uses the session's account.

Positioning vs Orca (global account per machine only): "cada sessão com a sua conta, e um projeto pode ficar preso à conta da empresa".

**Why:** planned ≠ available; the app session said nothing goes on the site as available until 0.10.0 ships.

**How to apply:** on release, in pt-BR/en/es with before/after and the user's OK:
- `content/docs/*/pro.md` (fila de pedidos section, ~line 15-20): holding at the limit, server-error hold, resume on renewal (app open only).
- `content/docs/*/ai-accounts.md`: line ~28 says an open session doesn't switch when quota ends and points to the queue; add pinning and reserved accounts near the rotation text (~26).
- `content/docs/*/troubleshooting.md` ~20-26 (queue didn't send; switching mid-turn).
- Plan feature lists in `src/lib/plans.ts` / pricing if these become listed Pro features.
- Changelog for the release.
Copy rules: resume only with the app open; never "agents keep working with the app closed"; no tmux/supervisor. Related: [[editor-terminal-features-pending]], [[session-toolbar-pending]].
