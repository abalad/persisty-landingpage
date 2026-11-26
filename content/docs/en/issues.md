---
title: "Issues: Linear, Jira, ClickUp, Azure DevOps and GitHub"
description: Start a session from an issue and, at the end, comment on it and change its status without leaving Persisty.
group: integrations
order: 1
---

Persisty reads issues from Linear, Jira, ClickUp and GitHub, and work items from Azure DevOps. You pick one when you create the session, the agent gets the request with the title, the link and the description, and at the end **Finish** comments on the issue and changes its status.

## Connect the service

GitHub issues come from the account you connected to clone repositories; see [GitHub, GitLab and Bitbucket](/docs/forges). Linear, Jira, ClickUp and Azure DevOps connect with a token, in [**Settings › Integrations**](/docs/settings#integrations): open the service, click **Connect account** and follow the steps on its page.

In Linear, create a personal key in Security & access, under Personal API keys; **Open Linear** takes you there. In Jira, enter the **Jira address**, such as `company.atlassian.net`, create an API token at Atlassian with Create API token, without scopes, and enter the **Atlassian account e-mail** that made the token. In ClickUp, generate your personal token in Settings › Apps, under API Token; it starts with `pk_`. In Azure DevOps, enter the **Organization address**, such as `dev.azure.com/company`; the older `company.visualstudio.com` address works too, and on the company's own server (Azure DevOps Server) it is the collection's address, such as `ado.company.com/DefaultCollection`. **Open Azure DevOps tokens** takes you to the personal access tokens: in New Token, choose the organisation and the scopes Work Items (Read & write) and Project and Team (Read). The token expires on the date you pick when you create it. Paste the key or the token and click **Connect**. Persisty checks the token with the service before keeping it in the system's password store.

Each service takes more than one account, and each one shows under **Accounts** with **Disconnect**. Disconnecting makes Persisty forget the token but does not delete it on the service: to revoke it, delete the token there or, in ClickUp, generate a new one.

## Link it to the project

Each project takes its issues from one service. Right-click the project, open [**Project settings › Tasks**](/docs/projects-and-workspaces#project-settings) and click **Link a service**. Choose the **Account** and where the issues come from: the **Repository** on GitHub, the **Team** in Linear, the **Project** in Jira, the **List** in ClickUp or the **Project** in Azure DevOps. On GitHub, the repositories of the project's workspaces come first, marked "this project's workspace", and, if there are any, the first one is already chosen. **Link** saves it.

Afterwards, **Change** switches the account or the scope, and **Unlink** removes the link. With no account connected, the section shows **Open Integrations**.

## Start from an issue

![In New session, Choose issue lists the Linear issues; the chosen ENG-123 names the session and fills in the Request to the agent, and Create and open starts the session, with the key and Finish in its header.](/docs-media/issues/issue.mp4)

In the [**New session**](/docs/sessions#new-session) window (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>), the **Issue** group has **Start from an issue**. **Choose issue** lists the open issues of whatever you linked to the project, most recently updated first. **Mine**, the default, shows only those assigned to you, and **All open** shows them all. The search filters what has arrived by key or title, **Load more** brings the next page, and **Refresh** fetches the list again. In a project with no service yet, **Link a service** opens the **Tasks** section right there.

The chosen issue names the session, such as `ENG-123 Fix the login`, and fills in **Request to the agent** with "Work on issue ENG-123: Fix the login", the link and the description. Edit the request if you like: it goes as the first request as soon as the agent is ready. In a **Terminal** there is no request, and the issue is only linked to the session. Before you create the session, **Change** picks another issue, and **Remove the issue** clears the choice.

With **Own folder (worktree)** on, the **New branch** also comes from the issue: the name Linear suggests or, on the other services, the key and the title in lower case, without accents and joined by hyphens, such as `eng-123-fix-the-login`, cut at a whole word within 60 characters. The own folder is Pro; see [Own folder](/docs/worktrees).

## Finish

![In the ENG-123 issue's session, Finish opens the finishing window with the comment already written; the New status is set to In Review, and Send comments on the issue and changes its status.](/docs-media/issues/concluir.mp4)

A session started from an issue shows its key in the header; clicking it opens the issue in the browser. Beside it, **Finish** opens the finishing window. The **Comment** comes already written, with the agent and the folder's current branch, such as "Done with Claude Code, through Persisty." and "Branch: eng-123-fix-the-login". In a **Terminal** session, the first line is just "Done with Persisty." Change the text as you like; left empty, nothing is posted.

**New status** lists the team's states in Linear, the transitions the issue offers now in Jira, the list's statuses in ClickUp and, in Azure DevOps, the states of the work item's type. On GitHub, the options are **Close** and **Keep open**. The default is **Leave as is**, and the status you send comes already chosen for the project's next issue.

Nothing reaches the service before you click **Send**. The window says what worked and what failed, and **Try again** sends only the part that failed: the comment never goes twice.

## Plan and limits

The task integrations are on the free plan. They list only open issues, and each project links one service at a time. For Jira, it is Jira Cloud. In Azure DevOps, the comment goes into the work item's discussion. The Azure DevOps integration arrived in 0.16.0 and is still being checked against a real organisation. Issues from GitLab and Bitbucket are not read.

The first request goes when Persisty knows the agent is ready. In [Codex CLI](/docs/agents#codex-cli), Persisty does not receive the agent's state by default, so the request waits in the session's [queue](/docs/queue).

The issue's title, link and description only reach the agent when you start a session from it, in the request you can edit first. Reading issues, commenting and changing the status are calls to the service, with your token, and each one shows in [Privacy and network](/docs/privacy-and-network).
