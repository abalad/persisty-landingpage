---
title: Privacy and network
description: What stays on your machine, what goes out and why, and how to check every network call Persisty makes.
group: account
order: 3
---

Persisty is local: [projects](/docs/projects-and-workspaces), [sessions](/docs/sessions), history, [notes](/docs/notes) and [usage](/docs/usage-and-quota) stay in a SQLite database on your machine. There is no telemetry. In [**Settings › Privacy & network**](/docs/settings#privacy--network), you can check this and see every call the app has made to the outside.

## Privacy

At the top of the screen, the **Privacy** group says that **Telemetry** is off, that **Session data** stays on this machine and that **External integrations** are optional.

Code, terminal output and prompts never leave your machine through Persisty, except for the commits you yourself push to your git repository's remote. The agents talk to their providers, and to the [MCP servers](/docs/mcp-servers) you turn on for the project, as they would without Persisty. [Voice dictation](/docs/voice) runs on the computer, and the audio never leaves it.

The persisty.app website uses Google Analytics only after you click **Accept** on the cookie notice. That applies to the website, not to the app. More details on [Security](/security) and in the [Privacy policy](/privacy).

## What goes out, and why

The app only reaches out to:

- read Claude Code's quota (`api.anthropic.com`), with the credential Claude Code already stores; the token is neither saved nor logged;
- sign in to the Persisty Cloud account and renew the [licence](/docs/account-and-license#licence), on the Persisty Cloud server, a `supabase.co` address;
- talk to GitHub, GitLab or Bitbucket, for the [accounts you connect](/docs/forges);
- read [issues](/docs/issues) from Linear, Jira, ClickUp and GitHub, for the task integrations you connect; on **Finish**, when you click **Send**, write to the issue the comment you reviewed, if it is not empty, and the new status;
- clone, fetch, pull and push commits on your git repositories' remotes (it also fetches on its own when it opens and every 5 minutes while the app is on screen, to show what is left to pull and push);
- download a [language server](/docs/editor#the-language-server) when the editor needs one that is neither in the project nor on the system: Node from `nodejs.org`, npm packages from `registry.npmjs.org` (or from the registry in your `.npmrc`) and rust-analyzer from GitHub;
- download the dictation [voice model](/docs/voice#voice-model) from `huggingface.co`, when you click **Download** in **Settings › Voice**;
- in **Settings › MCP servers**, [search the official MCP registry](/docs/mcp-servers#search-the-official-registry) (`registry.modelcontextprotocol.io`) for the name you type and download the servers' icons; on **Test**, ask a remote server to start a connection, with the credentials you gave it;
- [look for new versions](/docs/updates) on GitHub, when it opens, every 6 hours and when you ask, and download the update when you click **Install and restart**. You can turn the automatic check off in [**Settings › About**](/docs/settings#about).

A preview feature you turn on may make other calls, and those also show in the [network log](#network-log).

## Network log

![Searching for sentry in MCP servers queries the official registry; in Privacy & network, the list of network calls shows that call, with its destination, purpose, bytes sent and received, time and result.](/docs-media/privacy-and-network/rede.mp4)

Below, **Network calls since the app opened** lists every call with destination, reason, bytes sent and received, result and time. Cloning, fetching, pulling and pushing commits show as `GIT`, with 0 bytes: git itself does the transfer, and the app does not measure it. A redirected call, such as the update check and download, gets one line for each server it went through. Headers, body and parameters are never shown or kept. The list does not refresh on its own: **Refresh** reads it again.

## macOS permissions

On a Mac, the programs running in the sessions do not use the privacy permissions given to Persisty, such as the microphone, folders and accessibility: macOS decides for them and asks when it needs to. That is why the first session in a protected folder, such as Documents, Desktop or Downloads, may ask for access to it.

If you updated from a version before 0.9.0, the sessions, new ones included, keep using Persisty's permissions until the Mac restarts.

## Plan and limits

Everything on this page works on any plan, with no account. The log keeps the 500 most recent calls and is cleared when you quit the app. Keeping the sessions' permissions apart only happens on macOS.
