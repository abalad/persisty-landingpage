---
name: release-updates-docs
description: "Every release updates the docs in the same release, not only the changelog and releases.json"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 4af6f56e-8ec9-47a5-a056-c06e4f570174
  modified: 2026-11-16T22:22:45.714Z
---

Every version's site work updates the docs too, not only the changelog and `releases.json`. The user said (2026-11-16): "Precisamos atualizar sempre a documentação". Until then, I had shipped only the changelog on release day and left the docs for later. 0.11.0 and 0.12.0 waited a day; 0.13.0 shipped without docs.

**Why:** the docs are what users read to learn a feature. A changelog without docs leaves the site describing an older app. Old limitations then stay listed as if still true, such as "the editor cannot rename or delete files" after 0.12.0.

**How to apply:**
1. When the app session asks for the release worktree, update the docs in that same worktree, next to the changelog, in pt-BR, en and es. That covers every page each user-visible change touches:
   - `content/docs/*`, including the shortcuts page and the troubleshooting page's list of what Persisty doesn't do yet;
   - PRODUCT.md;
   - the /free or /pro pages if a feature belongs there.
2. Check each key and label in the app's tagged code, per keymap and per platform, not in the changelog draft.
3. Show the before/after and ask the user's OK for the docs and the push in the same question, so everything ships in one push.
4. If the app session is in a hurry and the docs aren't ready, say so to the user and ship the docs right after, the same day.

**Audit on 2026-11-16:** three read-only agents checked every docs page against the app's v0.13.0 code and found older errors beyond 0.13.0:
- the Changes panel's discard, conflicts and sync, there since before 0.10.0;
- state labels;
- Codex hooks, which Persisty never writes;
- connecting accounts is Pro;
- rotation by the fuller window;
- privacy's "only" list missing connections;
- WebStorm (macOS) keys;
- my own "Configurações › Geral" (the right path is Workspace › IDE padrão).
All fixed and published on 2026-11-16 (main 629c6c4, with the user's OK), together with:
- the home FAQ (Codex: no state or resume yet; the full outbound list);
- the privacy policy's app connection list, merged with the Google Analytics work already on main. The site now has GA, only after Accept on the cookie notice, so never write that the site has no analytics.

The privacy policy is a legal page, so it changes only on the user's decision (given for this list).

Gotcha: point audit agents at the release worktree or at `git show origin/main:`, never at the main checkout. The main checkout sits on another session's old branch, and two of the three agents audited stale text.

Since 2026-11-17 the docs are one page per feature with `docs/docs-coverage.md`: a release adds its changelog items to the inventory (the test fails otherwise) and updates the pages they point to. See [[docs-per-feature]].

Since 2026-11-24 the docs carry videos of the current interface. A release that changes a screen shown in a video re-records that scene from `scripts/docs-media/<page>.mjs` (see its README) in the same push. A feature whose movement explains it gets a new scene and a row in `## Mídia`.

Related: [[publishing-the-site]], [[release-0-13-0]].
