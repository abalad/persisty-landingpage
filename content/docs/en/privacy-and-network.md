---
title: Privacy and the network log
description: What stays on your machine, what goes out, and how to check every network call Persisty makes.
group: account
order: 3
---

Persisty is local: projects, sessions, history, notes and usage stay in a SQLite database on your machine. There is no telemetry.

## What never leaves

Code, terminal output and prompts never leave your machine through Persisty, except for the commits you yourself push to your git repository's remote. The agents talk to their providers as they would without Persisty.

## What goes out, and why

The app only reaches out to:

- read Claude Code's quota (`api.anthropic.com`), with the credential Claude Code already stores; the token is neither saved nor logged;
- sign in to the Persisty Cloud account and renew the licence;
- talk to GitHub, GitLab or Bitbucket, for the integrations you connect;
- read issues from Linear, Jira, ClickUp and GitHub, for the task integrations you connect; on **Finish**, when you click **Send**, write to the issue the comment you reviewed, if it is not empty, and the new status;
- clone, fetch, pull and push commits on your git repositories' remotes (it also fetches on its own when it opens and every 5 minutes while the app is on screen, to show what is left to pull and push);
- download a language server when the editor needs one that is neither in the project nor on the system: Node from `nodejs.org`, npm packages from `registry.npmjs.org` (or from the registry in your `.npmrc`) and rust-analyzer from GitHub;
- download the dictation voice model from `huggingface.co`, when you click **Download** in **Settings › Voice**;
- in **Settings › MCP servers**, search the official MCP registry (`registry.modelcontextprotocol.io`) for the name you type and download the servers' icons; on **Test**, ask a remote server to start a connection, with the credentials you gave it;
- look for new versions on GitHub, when it opens, every 6 hours and when you ask, and download the update when you click **Install and restart**. You can turn the automatic check off in **Settings › About**.

## Network log

In **Settings › Privacy & network**, every call the app has made since it opened shows up with destination, reason, bytes sent and received, result and time. Cloning, fetching, pulling and pushing commits show as `GIT`, with 0 bytes: git itself does the transfer, and the app does not measure it. Headers, body and parameters are never shown or kept. The log keeps the 500 most recent calls and is cleared when you quit the app.

More details on [Security](/security) and in the [Privacy policy](/privacy).
