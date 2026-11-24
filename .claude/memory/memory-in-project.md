---
name: memory-in-project
description: "All memory lives in the site repo at .claude/memory/ and is committed with it (public repo: no e-mails or keys in notes); the automatic memory folder is a link to it"
metadata:
  type: feedback
---

On 2026-11-24 the user asked to save everything learned inside the project ("apenas salve tudo sempre aqui local"), then to commit the notes with the repo ("Pode commitar junto as memórias"). All memory now lives in `persist-landingpage/.claude/memory/`. The automatic memory folder `~/.claude/projects/-Users-maiconwagnerdossantos-Documents-Projetos-Persist-persist-landingpage/memory` is a symlink to it, and the folder from before the link is kept beside it as `memory.bak-2026-11-24`. `CLAUDE.md` at the repo root points to the folder.

**Why:** the user wants the memory with the project, versioned in git.

**How to apply:**
- Save every new learning as a note here. Writing through the automatic memory path lands in the same files.
- Commit the notes with the related work, in the same worktree and push, under the usual publishing rules ([[publishing-the-site]]).
- The GitHub repo `abalad/persisty-landingpage` is public. Never put an e-mail address, key, password or token value in a note; say where it lives instead (Keychain item, CLI command). On 2026-11-24 the user's personal Gmail was taken out of [[persisty-cloud-production]] before the first commit.
- If the link is ever missing, recreate it; don't write a second copy.
