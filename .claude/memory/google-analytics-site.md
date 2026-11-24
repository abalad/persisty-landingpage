---
name: google-analytics-site
description: persisty.app measures with Google Analytics only after Accept on a cookie notice (live 2026-11-16, main 17258f1); GA IDs; app and PostHog deliberately left out; GA4 page_view gotcha
metadata:
  node_type: memory
  type: project
  originSessionId: cbd2473d-1003-4900-bb76-f9533a34dba9
  modified: 2026-11-16T23:35:19.949Z
---

Live on persisty.app since 2026-11-16 (main 17258f1, merged and pushed on the user's OK; branch and worktree removed). Checked in production: notice before any Google request, Accept → GA Realtime shows the visit, footer Cookies → Decline deletes _ga. The answer is also saved by POST /api/consent (Safari caps script cookies at 7 days).

- GA (Google account authuser=1): account "Persisty" 416570252, property "Persisty Site" 564653760, web stream "Persisty Web" 16355246488, ID `G-KE0RFHH7ZZ` (in `src/lib/site.ts`). Retention 14 months, signals off, history-based page changes off, key events download / sign_up / begin_checkout / checkout_done (created with "Criar com código", no value).
- User's choices: only the SITE and only GA "por hora" — no PostHog, nothing in the desktop app (the app still promises "sem telemetria"). Cookie notice for EVERYONE (option 2), nothing from Google before Accept; Decline as easy as Accept; footer "Cookies" reopens it.
- GA4 gotcha, measured: `send_page_view: false` in the config alone still lets the Google tag send its own page_view with the raw URL; `gtag('set','send_page_view',false)` before the config stops it.
- Deferred minors from the final review (user to decide): clear _ga on any Decline, other tabs keep measuring until reload, *.vercel.app production URLs also measure, buttons follow text width.
- Proof: `scripts/e2e/analytics.mjs` against `VERCEL_ENV=production next build && next start -p 3100`.

**Why:** the privacy policy used to say the site had no analytics; it now describes GA in three languages, so any new tracking must update `content/legal/*/privacy.md` and `tests/copy.test.ts`.

**How to apply:** if the user later asks for PostHog or app analytics, it is a new design (the app's no-telemetry promise and Settings › Privacy). Publishing follows [[publishing-the-site]].
