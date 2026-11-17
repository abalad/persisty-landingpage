---
title: Restore points
description: Each request to the agent saves the folder's state before it starts, and so does discarding changes; see what would change and go back to any point.
group: agents
order: 8
---

A restore point is the state of the files in the session's folder at one moment. Persisty records one before each request to the agent and another before you discard changes, and lets you go back to any of them. The points live in **Restore points**, in the bar on the session's right edge.

## What is recorded

Each request to Claude Code records the folder's state before the agent starts, named after the request's first line. If nothing changed since the last point, no new point is recorded. The list shows the points from newest to oldest, each with how long ago it was recorded.

A point keeps tracked and new files; whatever `.gitignore` ignores is left out. It is stored as a commit under `refs/persist/checkpoints/`, which a regular `git push` does not send. The git branch, HEAD and index do not change.

## Restore

Click a point to see what restoring changes: how many files come back and how many created later are deleted, with the list of them. **Restore this point** asks for confirmation and puts the files back as they were before that request. If the agent is working in the folder, the confirmation tells you to stop it first, because it may rewrite files during the restore.

Restoring first saves the current state as a new point, **Before restoring**, so you can undo it. Only the folder's files come back: commits made by the agent stay on the branch.

## Before discarding

Discarding changes, in the **Changes** panel or in the **Git** submenu of the editor's tree and tabs, first saves a point called **Before discarding changes**. If that point cannot be recorded, nothing is discarded. To undo a discard, restore that point.

## Plan and limits

Recording a point on every request is Pro. The point before discarding is recorded on every plan, and the list shows and restores saved points on every plan, also after Pro ends.

Points only exist in git folders. The points per request rely on the Claude Code hook that reports the request; Codex CLI records none. There are 50 per session, and the oldest go first. Closing the session deletes its points.
