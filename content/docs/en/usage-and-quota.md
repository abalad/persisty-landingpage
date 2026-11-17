---
title: Usage, cost and quota
description: Estimated spend per session, project and model, spend alerts, the 5-hour and 7-day windows and the context used, with what each number means.
group: agents
order: 6
---

The footer of every agent session shows the model, the estimated spend, the context used and the 5 h and 7 d windows of the account it runs under. In a Claude Code session, the footer's model is a picker; see [Model per session](/docs/agents#model-per-session).

## Estimated spend

The **Details** panel (<kbd>⌘</kbd> <kbd>I</kbd>) shows these numbers for the focused session and the project's spend for the month, under **AI this month**. **Usage details**, in the same panel, opens the project's **AI usage** page: requests, tokens and cost for **Today** and **This month**, the Claude Code sessions with their cost, context and windows, and the **By session**, **By model** and **By provider** tables. **All projects**, at the top, brings everything together and shows **By project** instead of **By session**.

The page also opens from **AI usage — all projects** in the command palette, and from **Open detailed usage** in [**Settings › AI usage**](/docs/settings#ai-usage). **Sync** reads the records again, and **Back** or <kbd>Esc</kbd> closes the page.

Spend comes from Claude Code's local records and from the status line it calculates itself. Token-based estimates use list prices with a date and a source, and **are not the invoice** from the provider.

## Spend alerts

In **Settings › AI usage**, **Daily alert (USD)** and **Monthly alert (USD)** put a notice at the top of the workspace when the day's or the month's estimate, across all projects, reaches the value. Empty or 0 turns it off.

## Data sources

The same screen lists the **Data sources** and when each was last read. Today the numbers come from two: Claude Code's local records and its status line. The others on the list, such as Codex CLI and the Anthropic and OpenAI APIs, show as **Not connected**, and Codex's spend is not counted yet.

## The 5 h and 7 d windows

The 5-hour and 7-day windows are percentages of the subscription, not money. They come live from the same service as Claude Code's `/usage`, checked at most once a minute per account. Each session shows the windows of the account it runs under, with the e-mail and plan beside them; with several accounts, each session has its own numbers. Per-model 7-day windows, when the account has them, show in the **Details** panel.

When the account runs out of quota, the session header shows **Out of quota · back at …** with the time the window renews. When the last turn fails with an Anthropic error, it shows **The last turn failed: …** with the reason. Either way, the session's [queue](/docs/queue) waits; see [When the quota runs out](/docs/ai-accounts#when-the-quota-runs-out). In the footer, clicking the account opens the connected accounts to switch the session's one ([Pro](/docs/pro)); see [AI accounts and rotation](/docs/ai-accounts).

## Context

The context percentage is how much of the model's context window the conversation already takes up, according to Claude Code itself.

## Plan and limits

Spend, quota, context and the spend alerts are on the free plan; switching a session's account from the footer is Pro.

The numbers are estimates made on this computer, not the invoice, and only Claude Code is counted, as [Data sources](#data-sources) explains.
