---
name: publishing-the-site
description: "How the user wants persisty.app changes published: merge to main and push directly, abalad token inline, check the deploy with vercel inspect"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 776ca16d-ed66-4fd4-9667-ce19883b7b5e
  modified: 2026-11-24T11:39:41.222Z
---

A push to `main` of abalad/persisty-landingpage deploys persisty.app (Vercel project persist-landingpage, team mw-tecnologia-projects). The user asks for "juntar na main e enviar" (merge locally, push directly, no PR) once they approve; visual changes to the home or feature pages go to them first with a before/after comparison and the texts.

**Why:** the user said so (2026-11-02, relayed by the app session and confirmed by "juntar tudo na main e enviar manualmente").

**How to apply:**
- Push only on their explicit OK at that moment.
- Push with the abalad token inside the command, without switching the active gh account: `git -c http.https://github.com/.extraheader="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$(/opt/homebrew/bin/gh auth token --user abalad)" | base64)" push origin main`.
- Check the deploy with `vercel inspect <deployment-url> --wait`, never by polling persisty.app with curl (Vercel checkpoint).
- `origin/main` may have moved (other sessions push changelog work): fetch and fast-forward before merging.
- When the main checkout itself is on `main`, a worktree cannot check `main` out. Merge on a detached `origin/main` in the worktree instead: `git checkout --detach origin/main && git merge --no-ff <branch>`, run the tests, then `push origin HEAD:main` with the token header. Leave the main checkout alone; it may still be behind origin. (Used for 0fd3367 and 1df30d9 on 2026-11-24.)
- Check the live site with a fresh headless Chrome per page, never curl: a locale cookie can redirect pt pages to en, and curl hits the Vercel checkpoint. `/download/latest/mac` shows up as a download whose file name is the DMG.
- Billing lives in the app repo (abalad/persisty, private: fetch and push both need the abalad token header). Work there in a git worktree; another session uses the main checkout. Deploy order, each with the user's ok: copy `supabase/.temp` into the worktree, run `SUPABASE_DB_PASSWORD=$(security find-generic-password -a persist-cloud -s "Persist Cloud DB" -w) supabase db push --dry-run`, then `scripts/cloud/test-db.sh <new migration>` (needs `/opt/homebrew/opt/libpq/bin` for psql), then `db push --yes`, then `supabase functions deploy <fn> --project-ref ytmpopebhdtnucdznfsz --use-api` (no Docker here). After pushing the app main, tell the persist-application sessions to pull with rebase.
- Run `node scripts/cloud/stripe-setup.mjs` only with `--live`: without it, it writes the TEST key into the production Supabase secrets. Stripe is live with real customers (since 2026-11-02); end-to-end tests use the Keychain test key ("Persisty Stripe secret key") with throwaway objects.

Related: [[local-toolchain]]
