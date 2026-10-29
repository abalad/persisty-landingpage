---
title: Security
description: How Persisty protects your terminals, your credentials and your account, and what is still to come.
updated: 2026-10-29
---

Persisty runs commands with your permissions and opens agents that use tools on your machine. That is why every security decision is made so as not to create a new path to your code.

## On your machine

- **Sessions only you can reach.** Terminals live in a directory of your own that only your user can access. No network port is open.
- **No shell assembled from text.** Commands and paths are passed as arguments, never as a shell line, and the folder is checked before launch.
- **Your settings untouched.** Claude Code's hooks come in through a file of Persisty's own, passed with `--settings`. Your `~/.claude/settings.json` is never read or changed, and Persisty does not edit Codex's hooks.
- **Agent permissions respected.** Persisty never passes options that skip the agents' permission requests.
- **Credentials stay where they were.** Signing in to AI accounts is done by Claude Code itself; the credential stays with it. The token used to read the quota is not saved and does not appear in any log, and it only goes to `api.anthropic.com`.
- **Events run nothing.** What the agents write in events only changes the state shown on screen.
- **Signed app and updates.** On the Mac, the app is signed and notarised by Apple. A new version is only installed if its signature matches the Persisty key that ships inside the app.

## In the cloud

- **Metadata, never code.** Persisty Cloud receives no code, terminal output or prompts.
- **Row-level access.** Every table has per-user access rules (RLS), with tests that prove what a member, an administrator and a stranger can read and write.
- **Signed licence.** The licence is signed with Ed25519 and checked by the app without a network. The private key never leaves the server.
- **Network log.** Every call the app makes shows up in **Settings › Privacy & network**, without headers or contents.

## In development and planned

| Item | Status |
| --- | --- |
| Signed installer on Windows | Planned |
| Dependency and vulnerability audit in CI | Planned |
| External security audit before the first large customer | Planned |
| Source code available for audit on Enterprise, under confidentiality | Planned |

## Found a problem?

{{contact}}
