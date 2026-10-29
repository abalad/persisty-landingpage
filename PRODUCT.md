# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) on Vercel, chosen by the user over Astro (2026-10-21) because a logged-in web area will grow here later (account, subscriptions with Stripe). Static rendering for marketing, docs and changelog; the account area runs in the browser against Persisty Cloud (Supabase). Three locales: pt-BR (default, no prefix), en, es.

## Users

From solo developers to companies. The core user keeps several software products at once and works with more than one AI coding agent in terminals (Claude Code first, Codex second), often across several Claude accounts (a personal Max plan and a company Team plan on the same machine). Companies are the buyer for Team and Enterprise: they pay for the AI accounts and want to know what the agents cost, what they did, and that the code never leaves the developer's machine.

## Product Purpose

Persisty is a local-first desktop workspace (macOS first; Windows and Linux builds ship as previews, not verified on real machines) that keeps AI coding sessions alive and organised. The site must explain what it does, sell the paid plans, collect accounts, offer the download, and keep visitors coming back through Docs and Changelog.

The three pains that made the founder build it, in his words (2026-10-21):

1. When the computer freezes or crashes, the sessions come back.
2. One app to separate work by project and workspace and run the AI sessions in a clean, easy interface.
3. Add N accounts and have them rotated without having to sit in front of the computer to switch.

## Positioning

After a computer freeze or restart, Persisty relaunches each session it can, resumes the Claude Code conversation and says plainly what it could not bring back. On top of that it is organised by business project, not by folder, shows what every agent is doing and which one needs you, and knows each Claude account's live 5-hour and 7-day windows, so new sessions go to the account with the most room. The account-aware, project-first combination is what Persisty can claim.

Copy rule (the founder, 2026-10-22, for the app and this site): never promise that agents or sessions keep working while Persisty is closed, and never name the mechanism underneath (tmux, the supervisor, a background server). Sell what is visible with the app open. `tests/copy.test.ts` guards the wording in all three languages.

## Operating Context

Developers run Claude Code and Codex in terminals for hours, switch between windows, and find agents blocked on a permission prompt or a session lost to a crash. They juggle `/login` between accounts when the 5-hour window fills up. Companies evaluate tools by privacy (where does the code go), cost control and auditability.

## Capabilities and Constraints

Available today (in the app; public download since 0.8.0):

- Public download at `/download`, newest build per system from `src/data/releases.json` (written by the app's publish step), every version with sizes and SHA-256 at `/download/versions`, and `/download/latest/<mac|windows|linux>` for links. The Mac build is universal, signed and notarised by Apple; Windows (NSIS installer) and Linux (AppImage and .deb) ship as previews: unsigned, not tested on real machines. Files are hosted as GitHub Releases of the public repository `abalad/persisty-releases`.
- Updates from inside the app: it checks GitHub on open, every 6 h and on demand (Settings › About, where the automatic check can be turned off), shows a notice and installs and restarts in one click; on Windows and Linux it warns first when sessions are open. Every check appears in the network log.
- Business projects with several workspaces (folders, with or without git); sessions as tabs; workspaces as cards.
- Persistent sessions; reconciliation on open; "Restore all" (idempotent, journaled); clear report of what could not be recovered after a reboot.
- Agent detection and states for Claude Code (hooks: working, waiting for you, permission pending, idle) and Codex (resume not verified). Any CLI runs in a persistent terminal.
- Built-in editor (CodeMirror 6), git changes and commit, branch picker, project notes, search, command drawer.
- Usage: spend per session, context, model per session, live 5h/7d windows from the same endpoint `/usage` uses.
- Persisty Cloud account by e-mail code; license signed with Ed25519, works 14 days offline, 5 devices; network log listing every outbound call.
- Pro (gated by license): own folder per session (git worktree), restore points per request, check on finish, request queue (waits for the agent, the 5-hour window renewal, or a time), several Claude Code accounts side by side with rotation for new sessions (accounts at 90% or more sit out).

Not true today, must not be claimed: moving a running session to another account in the middle of a turn (since 0.8.0, with rotation on, a session moves when its turn ends at the limit); signed Windows builds; Windows or Linux tested on real machines; Team features (team board, FinOps, policies, audit log); Enterprise features (SSO, SCIM, model gateway, self-host); Growth integrations; mobile app; remote runner.

Prices decided by the user (2026-10-21): Free; Pro US$ 9.90 per month; Team US$ 19.90 per user per month; Enterprise by contact. No annual price decided. Stripe is not wired: "Subscribe" buttons exist and do nothing yet (user's instruction). No contact e-mail exists yet: it lives in an environment variable; while empty, "Talk to us" leads to account creation with Enterprise interest recorded in the user's metadata.

Persisty Cloud: Supabase project `ytmpopebhdtnucdznfsz` (São Paulo). Sign-in by e-mail code (`signInWithOtp` with user creation, `verifyOtp` type `email`). E-mail goes through Resend from "Persisty <oi@persisty.app>" (custom SMTP since 2026-10-22; Resend free plan: 100 a day; Supabase: 25 an hour).

## Brand Commitments

- Name "Persisty" (decided 2026-10-22; "Persist" had no domain). Domain `persisty.app`, registered by the user. A formal trademark search (INPI, USPTO) is still pending; the site makes no trademark claims.
- Visual system shared with the desktop app: `packages/design-tokens/tokens.css` in the app repo (graphite neutrals, lime accent `#C6F24E` since the Persisty identity of 2026-10-22, status colours always paired with icon and text). Brand files and rules: `/brand` page, `brand/` folder, `docs/superpowers/specs/2026-10-22-persisty-brand-design.md`. Icons: Lucide.
- Reference the user pinned: verne.build (dark, large light headline, product mockups built in HTML, two-column section heads), with every trace of an AI-made site removed.
- Voice: plain, specific, honest. The app's own copy says "Parado", never "Falhou", for a stopped command; it says what it could not do.

## Evidence on Hand

- The app itself: real UI captured from the dev build with mock data; real feature list in the app's CHANGELOG.md and LIMITATIONS.md.
- App icon: `apps/desktop/src-tauri/icons/source-1024.png` in the app repo.
- No customers, testimonials, logos, benchmarks, download counts or press. None may be invented.

## Product Principles

1. Say what works today, what is in development and what is planned, and label each.
2. Code, terminal output and prompts never leave the machine; the site repeats only what the app enforces.
3. Every paid feature must help the developer and give the company something it can count.
4. The free core works without an account and without internet.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, keyboard focus, reduced motion respected for every animated mockup, real text (not images of text) so every locale is readable and translatable.
