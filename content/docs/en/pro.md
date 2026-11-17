---
title: Pro features
description: Request queue, restore points, check on finish and own folder per session.
group: account
order: 1
---

The queue and restore points live in the **bar on the session's right edge** (**Request queue** and **Restore points**). The own folder is chosen in **New session**, and check on finish in the workspace command menu, to the right of the tabs. The Pro features require a Persisty account on the Pro plan; what has already been saved stays usable if the plan ends. Claude accounts, with rotation, switching from the footer and an account per project, are in [AI accounts and rotation](/docs/ai-accounts).

## Request queue

The queue works like a chat. Write the next request now and choose when it goes to the agent:

- **as soon as the agent is free**;
- **when the 5-hour window renews**, with the time read from the live quota of the session's own account;
- **from a time on**.

The queue's header says what the agent is doing. The next requests are numbered, in the order they will go, with when each one goes and why the ones below are waiting. You can drag to reorder (or <kbd>⌥</kbd> <kbd>↑</kbd> and <kbd>⌥</kbd> <kbd>↓</kbd>), edit a request that has not gone yet (the queue waits while you edit), send one next and take one out. **Pause queue** holds everything, also after the app reopens. Sent requests fold away at the bottom.

The text box takes images: <kbd>⌘</kbd> <kbd>V</kbd>, drag or the paperclip, up to 8 per request and 10 MB each (PNG, JPEG, GIF or WebP). They stay on this computer, and the agent gets their paths at the end of the request.

Requests go one at a time, in queue order, and only when the agent is waiting for its next request; never in the middle of work or over a permission request. Each request goes exactly as written, as a single paste. When the account runs out of quota, the queue waits for the window to renew; see [When the quota runs out](/docs/ai-accounts#when-the-quota-runs-out).

The queue is checked every 10 seconds while Persisty is open. With the app closed, nothing is sent. Only writing, editing and attaching images are Pro. On the free plan, requests already in the queue still go and can be paused, resumed, reordered, sent next or taken out, and **Let the queue go now** works too.

## Restore points

Each request to an agent saves the state of the session's folder before the agent starts, named after the request's first line. In the **Restore points** tab you see what would come back and what would be deleted before you confirm. Restoring saves the current state as a new point, so you can undo it.

Discarding changes also saves a point first, **Before discarding changes**, on the free plan too. The tab lists and restores saved points on every plan; only recording a point on every request is Pro.

- It works in git folders and with agents that report the request through a hook (Claude Code).
- It saves tracked and new files; whatever `.gitignore` ignores is left out.
- The git branch, HEAD and index do not change; commits made by the agent are not undone.
- Points are stored as commits under `refs/persist/checkpoints/`, which a regular `git push` does not send. There are 50 per session.

## Check on finish

In the workspace command menu, to the right of the tabs, pick a command (for example `pnpm test`) and click **Check on finish with** followed by its name. When the agent stops after changing files, the command runs on its own in the session's folder, and the session header shows **Check** with the result: running, passed, failed (with the exit code) or stopped. Clicking it opens the output.

This applies to agent sessions inside a workspace. The result is not sent to the agent.

## Own folder per session

In git folders, a new session can get a `persist/<name>` branch in a folder of its own (a git worktree), so two agents never edit the same files. In **New session**, turn on **Own folder (worktree)**; you can change the branch name under **New branch**.

- The folder lives in `~/.persist/worktrees`, or in the one you choose under **Settings › Workspace › Worktrees folder** (it applies to new worktrees). It does not bring along what git ignores (`node_modules`, `.env`, builds).
- When you close the session, Persisty says how many uncommitted files the folder has and how many commits the branch has that its base lacks, and offers **Keep the folder** and **Remove the folder**, or **Discard and remove** when there are uncommitted files.
- The branch is never deleted.
