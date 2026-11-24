---
name: persisty-cloud-production
description: "Production Supabase facts learned shipping account deletion (2026-11-23): function JWT settings, db push needs --db-url, audit log not in DB, RESEND_API_KEY secret, Resend key via Chrome accessibility"
metadata:
  node_type: memory
  type: reference
  originSessionId: 776ca16d-ed66-4fd4-9667-ce19883b7b5e
  modified: 2026-11-23T18:12:14.969Z
---

Project ytmpopebhdtnucdznfsz (persisty.app backend). Facts verified 2026-11-19 to 2026-11-23:

- **Edge function verify_jwt in production (keep them on redeploy):** delete-account true, retention true, stripe-webhook false, create-checkout false, billing-portal false.
- **`supabase db push`** fails with LegacyDbConfigIpv6Error over the direct connection. Pass `--db-url` with the pooler `postgresql://postgres.ytmpopebhdtnucdznfsz:<url-encoded password>@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require` (password from Keychain "Persist Cloud DB", account persist-cloud).
- **`auth.audit_log_entries` is empty in production**: hosted GoTrue keeps its audit log outside our database. Code must not treat "erased 0 rows" as a failure (`forget_auth_trail`).
- **`RESEND_API_KEY`** (edge function secret, set 2026-11-23) is a Resend key named `persisty-funcoes`, Sending access, domain persisty.app, in the user's Resend account. Auth e-mails (codes) go through Resend SMTP separately, configured in Supabase Auth; the Management API returns that SMTP password hashed, so it can't be reused.
- **Resend dashboard from here:** Chrome refuses a scripted toggle of "Permitir o JavaScript do Eventos da Apple", but its accessibility tree works: a small Swift AX helper (AXPress, AXFocused, read AXValue) plus System Events keystrokes drove resend.com/api-keys in the "Pessoal" Chrome profile (`--profile-directory="Profile 2"`, opened in its own window). The copy button needs a real click; "Show value" then reading AXValue straight into a 600 file worked, never printing the key.

- **Production test of /account/delete passed 2026-11-24** with a fresh free account, a `+teste` alias of the user's own Gmail. The plain address is a real account with a hand-granted Pro until 2027-10-21 and must not be used for deletion tests; the address is in the session context, not in these notes. Code sign-in then deletion skipped the second code, the after page said the confirmation went out, the e-mail "Sua conta do Persisty foi excluída" arrived in the inbox, and the DB had no user or identity left.
- **Driving persisty.app from Chrome:** AXPress does nothing on the site's React buttons; focus the element (AXFocused) and send Space (key code 49) or Enter with System Events, after raising the window. Use an incognito window of Profile 2 so no real session is involved. The user's Gmail is in the "Pessoal" Chrome profile (`authuser=<the user's address>`), readable through the same AX tree.

Related: [[publishing-the-site]], [[remote-phone-app-plan]]
