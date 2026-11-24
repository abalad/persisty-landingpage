---
name: footer-account-switch-pending
description: "Pending app feature (not released as of 2026-11-02): switching a session's Claude account from its footer; keep it off the site as available until a version ships it"
metadata:
  node_type: memory
  type: project
  originSessionId: 776ca16d-ed66-4fd4-9667-ce19883b7b5e
  modified: 2026-11-03T02:57:54.699Z
---

**Released in 0.10.0 (2026-11-10).** The app shipped it, and the site's changelog for 0.10.0 is live (main aa01bac). It is no longer "not released". The site's own pages and docs for it still wait for the user's OK; see [[release-0-10-0]].

On 2026-11-02 the persist-application session announced a feature on the app's local main (f60d75c), not yet released or pushed: clicking the account e-mail in a session's footer opens a menu of the connected Claude accounts (each with a bar for its fuller quota window, 5 h or 7 days, details on hover). Picking another switches only that session: at once when the agent is idle (Claude reopens in the same tab and conversation), or marked "switches when the reply ends" while it answers, never cutting a reply. In a plain terminal the next `claude` opens on the chosen account. Plan: Pro, part of "several AI accounts" (multi_account); with one account the menu shows it and a shortcut to connect another.

**Why:** the app session's rule is planned ≠ available; the site may only call it available once it ships in a version.

**How to apply:** when the app session announces the release, add it to the accounts section of /pro (and the features menu and My account glimpses if they list account rotation), and update PRODUCT.md's capabilities. It still does not move a session in the middle of a turn, so the "not true today" line stays.
