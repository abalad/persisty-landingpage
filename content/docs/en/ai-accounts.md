---
title: AI accounts and rotation
description: Connect several Claude Code accounts, follow each one's quota live, choose each session's account and let the queue wait when the quota runs out.
group: agents
order: 5
---

[**Settings › AI accounts**](/docs/settings#ai-accounts) holds this computer's Claude Code accounts: the one that was already signed in and the ones you connect through Persisty. Sessions under different accounts run at the same time, each using its own account's quota.

## Connected accounts

Each account shows its e-mail, organisation, Claude plan, how many sessions are open on it and the **5 h** and **7 d** [windows](/docs/usage-and-quota#the-5-h-and-7-d-windows). The account that was already on the computer has the **This computer** tag. The same e-mail in two organisations shows as two accounts. An account that is signed out shows **Not signed in**, and a quota that could not be read, **Quota unavailable**.

The bars come from the same place as Claude Code's `/usage`, with the credential it already stores on the machine. Persisty checks at most once a minute per account (the service refuses more frequent checks) and keeps the latest numbers on screen between checks. Seeing the accounts and their quotas is on the free plan.

## Connect an account

![In Settings › AI accounts, Connect account lets you type the account's e-mail; Sign in with the browser waits for the sign-in, and the new account joins the list with its 5-hour and 7-day windows.](/docs-media/ai-accounts/contas.mp4)

Connecting another account is [Pro](/docs/pro). Without it, **Connect account** is disabled and you use this computer's account.

1. On the **Another account** row, click **Connect account**. If you like, type the e-mail under **Account e-mail (optional)**: it only comes filled in on the sign-in page. Then click **Sign in with the browser**.
2. Persisty runs Claude Code's own sign-in (`claude auth login`) for a folder used only by that account, and the browser opens.
3. Finish signing in in the browser. The account shows up on its own. If the browser shows a code instead of returning to the app, paste it into **Code from the browser** and click **Send code**. While Persisty waits, **Open the sign-in again** opens the sign-in page once more, and the **×**, **Cancel**, gives up.

Persisty never sees your password and does not store the credential: Claude Code stores it.

To remove an account, use the disconnect button on its row and confirm with **Disconnect**. Persisty runs Claude Code's logout and deletes that account's folder; sessions already open with it carry on until you close them.

AI accounts warns you when two connected accounts signed in with the same e-mail. That happens when a `/login` inside a session changes the account without Persisty knowing. Disconnect the repeated one and connect the account it had again.

## What the accounts share

Sign-in and the prompt history stay separate per account. Settings (`settings.json`), instructions (`CLAUDE.md`), agents, commands, skills, output styles and plugins are this computer's account's, shared with the others.

Conversations and each project's memory also live in a single folder, this computer's account's `~/.claude/projects`. That is why a session that switches accounts loses nothing, and `/resume` on any account finds the whole conversation. An account that had a conversation folder of its own was merged into that one once, with nothing deleted: where both sides held a different file under the same name, one stayed and the other went to a backup folder.

## Rotation

![In AI accounts, turning on Rotate between accounts marks the Next in rotation; in New session, the Claude account field reads Automatic · rotation.](/docs-media/ai-accounts/rodizio.mp4)

With **Rotate between accounts** turned on, each new Claude Code session goes to the account with the most room, and the list marks which one is **Next in rotation**. In **New session**, the **Claude account** field comes set to **Automatic · rotation**; pick an account there to open that session on it.

Under **Switch accounts at**, which shows with rotation on, you choose the limit: 80%, 90% (the default), 95% or **100% · only at the limit**. The fuller window counts, the 5-hour or the 7-day one. An account at that point sits out of new sessions until it renews; if every account is there, the one that renews first is picked.

When a session reaches the limit you chose, it moves to another account with room as soon as its answer ends and carries on with the same conversation. If the session left a subagent or a command running, the switch waits for that work to finish. Rotation is Pro.

## Switch a session's account

On Pro, click the account's e-mail in the session footer to see the connected accounts, each with its fuller quota window, and pick another. While the agent is answering, the footer shows **switches when the answer ends** and the switch happens when the answer ends. As with rotation, a subagent or a command left running makes the switch wait. In a plain terminal, the next `claude` opens on the chosen account. At the bottom of the menu, **Manage accounts…** takes you to AI accounts; with a single account, the item is **Connect another account…**.

## One account for a project

On Pro, in the project's settings, under **Claude account**, pin the project to an account, the company's for example. Its sessions only open on that account, never switch to another and, at the limit, wait for its window to renew. **Any account** unpins the project.

In **Settings › AI accounts**, **Use only for the projects pinned to it** reserves an account for the projects pinned to it: rotation and the other projects leave that account alone. In the footer menu, an account the session cannot use shows as closed, and hovering over it says why, such as **Reserved for the projects pinned to it**. This computer's account cannot be reserved.

## When the quota runs out

If the account hits its limit and no other has room, the session header shows "Out of quota · back at 19:14 on …", and the [request queue](/docs/queue) waits in every session on that account, even after the app reopens. A turn that fails with an Anthropic server error also holds that session's queue, with **The last turn failed:** and the reason in the header. **Let the queue go now**, at the top of the queue, lets that session's requests through. This applies on every plan, and a notice tells you when the account runs out of quota and how many sessions are waiting.

## Carry on after the limit

On Pro, with **Go on with the task the limit cut** turned on (in AI accounts, with or without rotation; it starts on), the conversation the limit cut carries on by itself. Persisty types "continue" after moving the session to another account or, with the app open, when the window renews, once per renewal, and the account's queues move again. If the time passed with the app closed, the resumption comes as soon as it opens. A notice tells you when each session resumes; if you type first, the resumption is yours.

## About using several accounts

Persisty does not create accounts or touch limits. It uses the accounts you already have, such as your personal one and your company's, through Claude Code's own sign-in. Following each account's terms stays with you.

## Plan and limits

Seeing the accounts and their quotas is on the free plan, and the queue waits for the quota to renew on any plan. Connecting other accounts, rotation, switching a session's account, pinning a project to an account, reserving an account and carrying on the task the limit cut are Pro.

Accounts and rotation are for Claude Code only.
