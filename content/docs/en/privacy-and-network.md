---
title: Privacy and the network log
description: What stays on your machine, what goes out, and how to check every network call Persisty makes.
group: account
order: 2
---

Persisty is local: projects, sessions, history, notes and usage stay in a SQLite database on your machine. There is no telemetry.

## What never leaves

Code, terminal output and prompts never leave your machine through Persisty. The agents talk to their providers as they would without Persisty.

## What goes out, and why

The app only reaches out to:

- read Claude Code's quota (`api.anthropic.com`), with the credential Claude Code already stores; the token is neither saved nor logged;
- sign in to the Persisty Cloud account and renew the licence;
- talk to GitHub, GitLab or Bitbucket, for the integrations you connect;
- clone, fetch, pull and push commits on your git repositories' remotes (it also fetches on its own when it opens and every 5 minutes while the app is on screen, to show what is left to pull and push);
- look for new versions on GitHub, when it opens, every 6 hours and when you ask. You can turn the automatic check off in **Settings › About**.

## Network log

In **Settings › Privacy & network**, every call the app has made since it opened shows up with destination, reason, size, result and time. Headers, body and parameters are never shown or kept. The log is cleared when you quit the app.

More details on [Security](/security) and in the [Privacy policy](/privacy).
