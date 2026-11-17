---
title: MCP servers
description: Install MCP servers from other services, such as GitHub, Sentry or Supabase, and choose which ones each project's Claude Code sessions get.
group: integrations
order: 3
---

An MCP server gives the agent tools from another service, such as GitHub issues, Sentry errors or Supabase tables. In Persisty, you install a server once, in **Settings › MCP servers**, and switch it on in the projects that should get it. The servers apply to Claude Code only.

## Install from the selection

**Available** holds a selection of 16 servers, each published by the company itself, with a search and a filter by category. Each card says how the server connects, such as **Sign in in the browser**, **Token** or **Uses your GitHub account**.

**Install** opens the server's window, with who published it, the **Name of this installation**, **What will run** and the **Configuration** fields, the required ones marked. When the server offers both ways, **How it connects** chooses between **Remote, sign-in in the browser** and **On this computer, with a token**. The GitHub one asks for the **GitHub account**, one of those connected in [Integrations](/docs/forges).

**Test** tries it before you install: a server on this computer is started and lists its tools, and a remote one answers the request to connect. A server that asks for a browser sign-in does it in the first session that uses it.

## Search the official registry

From two letters on, the search also asks the official MCP registry, `registry.modelcontextprotocol.io`. What it finds shows under **In the official registry**: servers published by the company itself with ✔, the others with their author's name. When you install one of these, the window warns that Persisty has not reviewed the server. Some formats cannot be installed yet, and the card says why.

## Add manually

For a server outside the list, such as your company's or one from a README, use **Add manually**. Give it a **Name** and choose **How it runs**: **Command on this computer**, with the command, its arguments and the **Environment variables**, or **Remote address (URL)**, with the **Headers**. Tick **Secret** on the values that are tokens. The address must start with `https://`; `http://` only works for `localhost`.

You can also paste the configuration: the JSON the README says to put into Claude Code, or the `claude mcp add` (or `add-json`) command. Persisty fills in the form, and several pasted servers are added one after the other. **Test connection** tries it, and **Add** installs it.

## Switch it on in a project

Installing does not switch the server on in any project. In **Project settings › MCP servers**, each installed server has a switch, off by default. Right after an install, **Switch on in**, followed by the name of the project in focus, takes you straight to that screen.

The choice applies to Claude Code sessions that start or restart afterwards. A `claude` typed in a Persisty terminal also gets the project's servers, unless you pass your own `--mcp-config`.

## Installed servers

Under **Installed**, each card shows the projects the server is on in and its state, such as **Ready**, **Token missing** or **Needs npx**. Only the ready ones, and those that sign in in the browser in the first session, reach the sessions. **Configure** changes the installation, and **Add token** shows when the token is missing. **Install again** makes a second installation under another name, such as one database per project. **Remove** takes the server out of every project and deletes its secrets.

The tokens stay in the system's password store, the Keychain on the Mac, and reach the session's configuration file only while the agent runs; the file is deleted when the session stops. Persisty never reads or changes your `~/.claude.json` or `.mcp.json`, and the names it uses end in `-persisty`, so they never hide a server of yours with the same name.

## Plan and limits

MCP servers are on the free plan. Persisty only passes them to Claude Code sessions; Codex CLI does not get them. A server that runs on this computer needs the program that runs it, such as `npx`, `uvx` or `docker`. When a server takes its secret on the command line, the window warns that other programs on the computer can see it while it runs.

The registry search, the icons and **Test** on a remote server are network calls listed in [Privacy and the network log](/docs/privacy-and-network). Persisty's own tools for the agents are on another screen; see [Agents that read Persisty](/docs/agent-access).
