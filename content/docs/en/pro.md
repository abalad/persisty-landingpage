---
title: Pro features
description: Request queue, restore points, check on finish and own folder per session.
group: work
order: 2
---

The Pro features live in the **bar on the session's right edge** (**Queue** and **Restore points**) and in the session header. They require a Persisty account on the Pro plan; what has already been saved stays usable if the plan ends. Claude accounts, with rotation, switching from the footer and an account per project, are in [AI accounts and rotation](/docs/ai-accounts).

## Request queue

The queue works like a chat. Write the next request now and choose when it goes to the agent:

- **as soon as the agent is free**;
- **when the 5-hour window renews**, with the time read from the live quota of the session's own account;
- **from a time on**.

The queue's header says what the agent is doing. The next requests are numbered, in the order they will go, with when each one goes and why the ones below are waiting. You can drag to reorder (or <kbd>⌥</kbd> <kbd>↑</kbd> and <kbd>⌥</kbd> <kbd>↓</kbd>), edit a request that has not gone yet (the queue waits while you edit), send one next and take one out. **Pause queue** holds everything, also after the app reopens. Sent requests fold away at the bottom.

The text box takes images: <kbd>⌘</kbd> <kbd>V</kbd>, drag or the paperclip, up to 8 per request and 10 MB each (PNG, JPEG, GIF or WebP). They stay on this computer, and the agent gets their paths at the end of the request.

Requests go one at a time, in queue order, and only when the agent is waiting for its next request; never in the middle of work or over a permission request. Each request goes exactly as written, as a single paste. When the account runs out of quota, the queue waits for the window to renew; see [When the quota runs out](/docs/ai-accounts#when-the-quota-runs-out-pro).

The queue is checked every 10 seconds while Persisty is open. With the app closed, nothing is sent. On the free plan, requests already in the queue can be paused, reordered, sent next or taken out.

## Restore points

Each request to an agent saves the state of the session's folder before the agent starts, named after the request's first line. In the **Restore points** tab you see what would come back and what would be deleted before you confirm. Restoring saves the current state as a new point, so you can undo it.

- It works in git folders and with agents that report the request through a hook (Claude Code).
- It saves tracked and new files; whatever `.gitignore` ignores is left out.
- The git branch, HEAD and index do not change; commits made by the agent are not undone.
- Points are stored as commits under `refs/persist/checkpoints/`, which a regular `git push` does not send. There are 50 per session.

## Check on finish

Pick a workspace command (for example `pnpm test`) under **Check on finish with…**. When the agent stops after changing files, the command runs on its own in the session's folder, and the header says whether it passed, failed (with the exit code) or is still running.

This applies to agent sessions inside a workspace. The result is not sent to the agent.

## Own folder per session

In git folders, a new session can get a `persist/<name>` branch in a folder of its own (a git worktree), so two agents never edit the same files.

- The folder lives in `~/.persist/worktrees` and does not bring along what git ignores (`node_modules`, `.env`, builds).
- When you close the session, Persisty asks whether to keep the folder, remove it, or remove it and discard the uncommitted files, and says how many commits the branch holds.
- The branch is never deleted.
