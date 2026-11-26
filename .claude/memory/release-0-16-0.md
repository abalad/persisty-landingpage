---
name: release-0-16-0
description: Release 0.16.0 (paste from history, scratch files, Create Gist, Azure DevOps, Sign in again, Windows mascot) published on the site 2026-11-26 with the user's OK given in the request; Azure DevOps and the Windows fixes still being checked
metadata:
  type: project
---

App v0.16.0 (tag at app 1710fcd) was published on GitHub 2026-11-26 20:18 UTC. The app session prepared the changelog in three languages and `src/data/releases.json` in its scratchpad; the user pasted the request with the OK to publish ("você tem o ok para publicar"), so the site went out without a review page. Merge "Merge release/0.16.0: …" on site main (`git log --merges --grep=release/0.16.0`).

- Changelog corrections to the app session's draft:
  - Command + Shift + N makes a scratch file in WebStorm macOS only with the cursor in the code (outside it the app's key opens "Escolher o que abrir"); the app CHANGELOG says "dentro do código", the draft had dropped it.
  - The phone clause ("o celular vê as conversas do próprio computador") is out: the phone app is still Planned ([[remote-phone-app-plan]]), and no changelog mentions it.
  - en labels follow en.json: "Paste from History", "The mascot walks on your windows".
- Docs (pt-BR written and checked against app v0.16.0; en and es mirrored from the pt-BR diff and reviewed):
  - editor#colar-do-histórico (new), the Markdown preview key (⌘⇧V is Paste from History inside the code in the WebStorm keymaps), keymap rows;
  - files#arquivos-de-rascunho and files#criar-gist (new), keys, limits;
  - issues (Azure DevOps: organization address, PAT scopes Work Items Read & write + Project and Team Read, Project, states of the work item type), title now lists Azure DevOps;
  - ai-accounts#entrar-de-novo (new), the quota reasons, Windows HOME in the limits;
  - mascot: the floating mascot was already on Windows and Linux (the docs said macOS only); now walks on windows on Windows too, Linux stays where left;
  - voice (dictation key clash warning), board (a question card shows its end), changes (git index no longer held), shortcuts, settings, troubleshooting, privacy-and-network (Gists, Azure DevOps), forges (gist permission), PRODUCT.md.
- Video: `editor/markdown.mp4` re-recorded on a `git archive` copy of v0.16.0; the scene now clicks the eye button, because ⌘⇧V in the code opens Paste from History. The other editor videos predate the folded "Rascunhos" header at the bottom of the tree and the Integrations list without Azure DevOps; left as they are (no behavior shown in them changed).
- Not changed, for the user to decide: the privacy policy (`content/legal/*/privacy.md`, a legal page) lists the issue services without Azure DevOps and doesn't mention Gists; the features line in `messages/*/features.json` lists Linear, Jira, ClickUp and GitHub.
- Still being checked by the app session: Azure DevOps against a real organization; the Windows mascot and the Windows HOME fix on a real machine. The docs say so in the limits.

Related: [[release-updates-docs]], [[publishing-the-site]], [[release-0-15-0]]
