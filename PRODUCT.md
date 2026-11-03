# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) on Vercel, chosen by the user over Astro (2026-10-21) because a logged-in web area will grow here later (account, subscriptions with Stripe). Static rendering for marketing, docs and changelog; the account area runs in the browser against Persisty Cloud (Supabase). Three locales: pt-BR (default, no prefix), en, es.

## Users

From solo developers to companies. The core user keeps several software products at once and works with more than one AI coding agent in terminals (Claude Code first, Codex second), often across several Claude accounts (a personal Max plan and a company Team plan on the same machine). Companies are the buyer for Team (Enterprise is hidden for now): they pay for the AI accounts and want to know what the agents cost, what they did, and that the code never leaves the developer's machine.

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
- Since 0.8.0 and 0.9.0, also free: GitHub, GitLab and Bitbucket in Settings › Integrations (several accounts, add a workspace from a remote repository, a full Git panel); notifications in the app and from the system; voice dictation on the computer (Settings › Voice, ⌘⇧D); tasks and issues from Linear, Jira, ClickUp and GitHub (start a session from an issue, finish on it); agents that read Persisty (Settings › Agents, Claude Code); Markdown preview, sticky context and a minimap in the editor.
- Pro (gated by license): own folder per session (git worktree), restore points per request, check on finish, request queue (waits for the agent, the 5-hour window renewal, or a time), several Claude Code accounts side by side with rotation for new sessions and a switch limit you choose (an account at that point sits out; with rotation on, a session moves when its turn ends at the limit and picks up the same conversation).
- Growth is a preview tab in the app with nothing connected; the site does not list it as a feature.

Not true today, must not be claimed: moving a running session to another account in the middle of a turn (since 0.8.0, with rotation on, a session moves when its turn ends at the limit); signed Windows builds; Windows or Linux tested on real machines; Team features beyond billing (live team board, budgets, management observability, team memory, policies with audit); Enterprise features (SSO, SCIM, model gateway, self-host); Growth integrations; mobile app; remote runner; the chat-style request queue, which is in the app's main branch but not released.

Roadmap by plan, decided with the user on 2026-11-02 (`persist-application/docs/superpowers/specs/2026-11-02-plans-roadmap.md`): Free gets issue-to-session, best of N and cross-review on finish; Pro (and Team) gets Persisty Remote (an iPhone and Android app in both stores, published by MW Tecnologia, free to download and unlocked by the Pro account, with no purchase or purchase link on the phone; sign-in by the computer's QR code or an e-mail code; end-to-end encrypted between computer and phone; it needs Persisty open on the computer; the web version comes later with its own design; approved 2026-11-02, app commit 545a369), autopilot with rules, night shift and session X-ray; Team gets the live team board, budgets and model rules, management observability, team memory and policies with audit. The site shows these with the "Planned" badge on the plan pages, in the menu and in the comparison (user, 2026-11-02). The Persisty Runner stays off the site: it promises sessions running without the person at the computer, which the copy rule forbids. The site keeps the promise "no individual productivity metric": management observability is described per project and per PR, never per person (user, 2026-11-02).

Prices (`src/lib/pricing.ts`, the same Stripe prices): Free; Pro R$ 9,90 or US$ 4.90 per month; Team R$ 19,90 or US$ 9.90 per seat per month; reais in Portuguese, dollars elsewhere. No annual price. Billing is live through Stripe: Checkout, a portal per subscription in My account, Team seats and invites by e-mail (no invite e-mail is sent: the owner copies the link), seven days to change one's mind on a first purchase.

Enterprise is hidden from the site by the user's decision (2026-11-02, "vamos em outro momento nele"): it stays defined in `src/lib/plans.ts` but is left out of `SHOWN_PLAN_IDS`; bringing it back is adding it there. The 0.7.0 changelog entry that mentions it stays as history. No contact e-mail exists yet: it lives in an environment variable.

Site structure for the plans (user, 2026-11-02): the nav's "Features" opens a menu split by plan (Free, Pro, Team), each plan has its page (`/free`, `/pro`, `/team`) with one section per feature, and the comparison table shows on the home page, on Pricing and on each plan page with that plan's column marked. When the app blocks a Pro feature it links to `/pro?tried=<accounts|queue|restore-points|verify|worktree>#<the same>`; those anchors are a contract with the app and stay put. My account is a panel with a menu beside it (overview, plan and billing, team, devices, release e-mails), each part at its own address under `/account`; usage reports will be another part when they exist.

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
