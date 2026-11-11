---
title: Troubleshooting and limitations
description: Known situations, what to do in each one and what Persisty does not do yet.
group: reference
order: 2
---

## The agent's state shows as unknown

Claude Code shows the folder trust prompt before any hook. Answer it in the terminal and the state appears. In Codex, approve the hooks with `/hooks` inside Codex.

## I typed `claude` in a terminal and the session did not become an agent

Terminals opened before a Persisty update do not have the wrapper that Persisty uses to adopt Claude Code. Open a new terminal.

## The quota shows as unavailable

Persisty reads the quota with the credential Claude Code stores. If that credential has expired, the bars use the session's own numbers until Claude Code renews it. Accounts connected through Persisty need the item Claude Code creates in the Keychain when you finish signing in.

## The queue did not send the request

The queue only sends while Persisty is open and the agent is waiting for its next request. Requests never go during work or over a permission request. If the session header says "Out of quota", the queue is waiting for the account to renew; **Let the queue go now**, at the top of the queue, lets the requests through. Also check that the queue is not paused.

## What Persisty does not do yet

- Switch a session's account in the middle of a turn. With rotation on, the switch happens when the turn ends.
- Integrations with analytics tools.
- Split the terminal into side-by-side panes.
- In the editor: renaming or deleting files.
- A signed Windows installer, and Windows and Linux tested on real machines.
