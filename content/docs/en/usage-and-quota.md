---
title: Usage, cost and quota
description: Spend per session, context used and the 5-hour and 7-day windows, with what each number means.
group: work
order: 4
---

The footer of every agent session shows the model, the spend, the context used and the 5 h and 7 d windows. In a Claude Code session, the footer's model is a picker; see [Model per session](/docs/agents#model-per-session).

The **Details** panel (<kbd>⌘</kbd> <kbd>I</kbd>) shows these numbers for the focused session and the project's spend for the month, under **AI this month**. **Usage details**, in the same panel, opens the project's usage page: spend and tokens for **Today** and **This month**, the Claude Code sessions, and the **By session**, **By model** and **By provider** tables. With **All projects**, the page brings everything together and shows **By project** instead of **By session**.

## Spend

Spend comes from Claude Code's local records and from the status line it calculates itself. Token-based estimates use list prices with a date and a source, and **are not the invoice** from the provider.

In **Settings › AI usage**, **Daily alert (USD)** and **Monthly alert (USD)** put a notice at the top of the workspace when the day's or the month's estimate, across all projects, reaches the value. Empty or 0 turns it off. The same screen shows the data sources and has **Open detailed usage**.

## Quota

The 5-hour and 7-day windows are percentages of the subscription, not money. They come from the same service as Claude Code's `/usage` and are checked at most once a minute. Per-model windows, when there are any, show in the Details panel.

When the account runs out of quota, the session header shows **Out of quota · back at …** with the time the window renews. When the last turn fails with an Anthropic error, it shows **The last turn failed: …** with the reason. Either way, the session's queue waits; see [When the quota runs out](/docs/ai-accounts#when-the-quota-runs-out).

Each session shows the account it runs under (e-mail and plan). In the footer, clicking it opens the connected accounts to switch the session's one (Pro). If you have several accounts, see [AI accounts and rotation](/docs/ai-accounts).

## Context

The context percentage is how much of the model's context window the conversation already takes up, according to Claude Code itself.
