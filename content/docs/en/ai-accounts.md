---
title: AI accounts and rotation
description: Connect several Claude Code accounts, follow each one's quota live, choose each session's account and let the queue wait when the quota runs out.
group: work
order: 1
---

**Settings › AI accounts** holds this computer's Claude Code accounts: the one that was already signed in and the ones you connect through Persisty. Each one shows its organisation, plan and the **5-hour** and **7-day** windows. The same e-mail in two organisations shows as two accounts, with the organisation's name beside it.

## Connect an account (Pro)

Connecting another account is a Pro plan feature. Without it, **Connect account** is disabled and you use this computer's account.

1. In AI accounts, on the **Another account** row, click **Connect account**. If you like, type the account's e-mail (it is optional: it only comes filled in on the sign-in page) and click **Sign in with the browser**.
2. Persisty runs Claude Code's own sign-in (`claude auth login`) for a folder used only by that account, and the browser opens.
3. Finish signing in in the browser. The account shows up on its own. If the browser shows a code instead of returning to the app, paste it into **Code from the browser** and click **Send code**.

Persisty never sees your password and does not store the credential: Claude Code stores it. Sign-in and the prompt history stay separate per account. Settings (`settings.json`), instructions (`CLAUDE.md`), agents, commands, skills, output styles and plugins are shared with this computer's account, and so are conversations and the project's memory: `/resume` on any account finds the whole conversation.

To remove an account, use **Disconnect**: Persisty runs Claude Code's logout and deletes that account's folder. AI accounts warns you when two connected accounts signed in with the same e-mail, which happens when a `/login` is done inside a session.

## Live quota

The 5 h and 7 d bars come from the same place as Claude Code's `/usage`, with the credential it already stores on the machine. Persisty checks at most once a minute per account (the service refuses more frequent checks) and keeps the latest numbers on screen between checks.

## Rotation (Pro)

With **Rotate between accounts** turned on, each new Claude Code session goes to the account with the most room. The fuller window counts, the 5-hour or the 7-day one. Under **Switch accounts at** you choose the limit: 80%, 90% (the default), 95% or **100% · only at the limit**. An account at that point sits out of new sessions until it renews; if every account is there, the one that renews first is picked. In New session, the **Claude account** field comes set to **Automatic · rotation**.

When a session reaches the limit you chose, it moves to another account with room as soon as its answer ends and carries on with the same conversation. If the session left a subagent or a command running, the switch waits for that work to finish.

## Switch a session's account (Pro)

Click the account's e-mail in the session footer to see the connected accounts, each with its fuller quota window, and pick another. While the agent is answering, the switch happens when the answer ends. In a plain terminal, the next `claude` opens on the chosen account.

## One account for a project (Pro)

In the project's settings, under **Claude account**, pin the project to an account, the company's for example. Its sessions only open on that account, never switch to another and, at the limit, wait for its window to renew.

In **Settings › AI accounts**, **Use only for the projects pinned to it** reserves an account for the projects pinned to it: rotation and the other projects leave that account alone, and the footer says why. This computer's account cannot be reserved.

## When the quota runs out

If the account hits its limit and no other has room, the session header shows "Out of quota · back at 19:14 on …", and the request queue waits in every session on that account, even after the app reopens. A turn that fails with an Anthropic server error also holds that session's queue, with the reason in the header. **Let the queue go now**, at the top of the queue, lets the requests through. This applies on every plan.

On Pro, with **Go on with the task the limit cut** turned on (in AI accounts, with or without rotation; it starts on), the cut conversation carries on by itself: Persisty types "continue" after moving the session to another account or, with the app open, when the window renews, once per renewal, and the account's queues move again. If the time passed with the app closed, the resumption comes as soon as it opens. A notice tells you when the account runs out of quota and when each session resumes; if you type first, the resumption is yours.

## About using several accounts

Persisty does not create accounts or touch limits. It uses the accounts you already have, such as your personal one and your company's, through Claude Code's own sign-in. Following each account's terms stays with you.
