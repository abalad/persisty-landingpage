---
name: remote-phone-app-plan
description: "Planned (not released) Persisty Remote phone app and the site work it will need: phones table in /account/devices, /r/pair page, .well-known files; phone app in internal beta since 2026-11-06; account deletion live at /account/delete since 2026-11-23; new site migrations after 20261104090000"
metadata:
  node_type: memory
  type: project
  originSessionId: 776ca16d-ed66-4fd4-9667-ce19883b7b5e
  modified: 2026-11-23T18:12:03.349Z
---

As of 2026-11-02, only planned. Persisty Remote becomes an iPhone and Android app in the stores under MW Tecnologia, as a Pro feature. The app is free and unlocks with a Pro account. It offers no purchase and no purchase link (Apple rule). People sign in by a QR code from the computer or by an e-mail code.

**Database (2026-11-03, from persist-application-9a):** the migration `20261103150000_remote.sql` was APPLIED in production on 2026-11-03 with the user's OK, and the end-to-end test passed. Then `20261104090000_remote_from_pro.sql` (applied 2026-11-04, app main 0d80662). **Any new migration from the site must use a timestamp after `20261104090000`** (ours, `20261103120000_retention_events.sql`, comes before both). Also published: the functions `remote-pair-start` and `remote-pair-claim`, and an updated `issue-license` that refuses phone sessions and tokens without `session_id` (site and app sign-ins are unchanged). Realtime is private channels only.

The migration adds:
- `public.phones`: user_id, id, name, platform ios|android, app_version, push_provider, push_token, live_activity_token, public_key, auth_session_id, created_at, last_seen_at, revoked_at.
  - RLS lets the owner select, insert and update. There is no delete.
  - Revoking means setting `revoked_at`. The DB stamps now(), ends that phone's login session and revokes its links. A revocation can't be undone.
  - The limit is 3 active phones per account (error `phone_limit`). Phones don't count toward the license's computer limit (5, in `devices`).
- `public.phone_links` (user_id, phone_id, device_id, created_at, revoked_at): which phone controls which computer.
- `public.remote_pairings`: only service-key functions touch it.
- `devices.remote_public_key`. Revoking a computer also revokes its phone links, and a phone session can't reactivate a revoked computer.
- Feature `remote` in `plan_features`: since 2026-11-04 (the user's correction) on pro, team and enterprise, i.e. "from Pro". It stays Planned until the phone app is in the stores; the desktop app keeps it behind a preview switch. On the site it is `planned("remote")` under Pro in `src/lib/plans.ts`, which Team inherits ("Tudo do Pro, mais:"); that already matches (checked 2026-11-04). Enterprise stays hidden on the site.
- Realtime private channel `remote:<user_id>:<device_id>`.

**Phone app status (2026-11-06, from persist-application-c3):** internal beta. It is a development build, installed by cable only on the owner's iPhone. It is not in the stores and not on TestFlight. The site keeps Remote "Planned", with no date and no download button.

Verified on the real device; use these as facts for the docs once the launch is decided, not before:
- The phone pairs via the QR on Persisty's **Conta › Celular** screen. The QR is also the sign-in; no e-mail is needed.
- Permission requests and multiple-choice questions are answered from the phone (Permitir, Negar, pick an option).
- A card answered on the computer leaves the phone within a few seconds.
- The session's conversation shows live, with the agent's Markdown formatted, and messages can be sent from the phone.
- "Desconectar" on the computer takes the phone off the account. The phone notices on its own within about 2 minutes idle, or on its next action.

**Beta update (2026-11-09, from persist-application-5a), still internal beta, nothing in the stores:**
- Claude Code's tabbed and multiple-choice questions are answered from the phone in a step-by-step wizard (Voltar, Avançar, Revisar). If answered on the computer, the phone shows "Respondida ou encerrada no computador".
- When Claude ends its turn with a question in text, the phone shows a "Responder" card. No question in the message, no card.
- Permission requests carrying a sensitive-file warning can also be approved from the phone.
- Android in internal beta by APK (tested on a Galaxy S24 Ultra); iPhone by development build.
- Internal fix, NOT site copy: restarting or updating Persisty on the computer no longer drops the phone's questions.
- Site follow-up: on 2026-11-09 the roadmap `features.remote.line` (pt-BR/en/es) changed "aprovar ou negar" to "aprovar, negar ou responder" on branch `docs/remote-answer-questions` (5243b1d). Still Planned; no changelog or docs entry.

**Account deletion (Apple requirement) is LIVE since 2026-11-23** (site main 429e6b9, app main 7dc55a07): /account has the entry and `persisty.app/account/delete` does the whole flow (code by e-mail, Stripe refund within 7 days of the first charge once per e-mail, Team owner's deletion sweeps members only in that Team, two Resend e-mails). The phone app should open `persisty.app/account/delete` for its "Excluir conta" link. See [[persisty-cloud-production]].

Site work, each piece only when Remote launches or the app session asks:
- `/account/devices` lists phones (`phones` without the revoked ones) next to computers. Its "Remover" button runs `update phones set revoked_at = now()` and never deletes. That takes the phone off the whole account (ends its session and revokes its links to every computer), and the button's copy must say so.
- A `/r/pair` page. The QR is the universal link `https://persisty.app/r/pair#<pairing_id>.<secret>.<computer key>`, and the part after `#` never reaches the server. If the app isn't installed, the page says where to download it.
- `/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json`. The app session will ask for these once the phone app exists.

**Why:** planned ≠ available. The app session relayed the plan and said the site must not act before it's approved and released.

**How to apply:** until the app is in the stores, the site shows Remote only on the roadmap with the "Planned" badge. When Remote launches, update the Remote wording, which today reads "no celular e na web". Before writing any migration in this repo, check the timestamp rule above.
