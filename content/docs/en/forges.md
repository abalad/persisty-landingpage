---
title: GitHub, GitLab and Bitbucket
description: Connect your accounts to list and clone repositories, private ones included, and to bring in GitHub issues.
group: integrations
order: 2
---

In [**Settings › Integrations**](/docs/settings#integrations), you connect accounts from GitHub, GitLab (gitlab.com or your company's own) and Bitbucket Cloud. With an account connected, [**Add workspace**](/docs/projects-and-workspaces#add-a-workspace) lists your repositories and clones the private ones.

## Connect accounts

The **Integrations** screen shows the **Connected** services first, with each one's account, then the **Available** ones. Click a service to open its page: **Connect account** makes the first connection, and **Add account** the ones after it. Each service takes several accounts, and each account shows its address, whether it came in **by code** or **by token**, and since when.

Persisty keeps the accounts and their tokens in the system's password store; on the Mac, that is the `Persisty Integrations` item in the Keychain. **Disconnect** makes Persisty forget the account but does not revoke its access on the service. The link at the foot of each page takes you to where you revoke it: the authorised apps on GitHub and gitlab.com, or the tokens at Atlassian. With a company GitLab, that link still opens gitlab.com; delete the token on your GitLab's tokens page.

## GitHub

![In Settings › Integrations, the GitHub page shows no account connected; Connect account opens the window with the code and waits for the confirmation in the browser, and the @demo account shows as connected.](/docs-media/forges/integracoes.mp4)

**Connect account** opens **Connect to GitHub** with a code. Click **Open GitHub**, sign in to the account you want to connect, confirm the code and authorise Persisty. The window waits for the confirmation and closes on its own; Persisty never sees your password. The access requested, `repo` and `read:org`, covers your repositories, including private ones and your organisations', and includes write access: Persisty uses it to list and clone and, when you [finish an issue](/docs/issues#finish), to comment on it and close it. If an organisation's repositories do not show up, it needs to approve Persisty.

## GitLab

**Where is your account?** offers two routes. With **gitlab.com**, **Continue in the browser** shows a code to confirm on gitlab.com, as with GitHub. With **Company GitLab**, enter the **GitLab address**, such as `gitlab.company.com`, and click **Create token on GitLab**: the page opens with the name and the `read_api` and `read_repository` scopes already ticked. Pick an expiry, create the token, paste it under **Paste the token** and click **Connect**. GitLab shows the token only once.

## Bitbucket

Bitbucket Cloud connects with an Atlassian API token. **Open Atlassian tokens** takes you to the page; choose Create API token with scopes, select Bitbucket and tick `read:user` and `read:repository`. Back in Persisty, enter the **Atlassian account e-mail**, paste the token and click **Connect**.

## What the accounts do

In **Add workspace**, with **Remote repository**, the field becomes **Link or search** and lists the connected accounts' repositories, with a filter by service; the steps are in [Clone a repository](/docs/projects-and-workspaces#clone-a-repository). A pasted link is looked up with that service's accounts, one by one, until one of them can see the repository; with no account for that service, it is looked up without signing in, and only a public repository shows. Git does the clone, straight with the service: over HTTPS with that account's token, for its address only; over SSH with your own keys.

The GitHub account also brings in your repositories' issues, to [start sessions from them](/docs/issues), and serves the GitHub MCP server; see [MCP servers](/docs/mcp-servers).

## Clone folder

At the bottom of the **Integrations** screen, **Cloning › Default folder for clones** sets where a clone goes when the project has no workspaces yet. The default is `~/Documents/GitHub`, and **Choose…** changes it. In a project with workspaces, the clone goes next to them. The same folder applies to all three services.

## Open on the forge

In the file tree and on the tab, the **Open in** menu has **Open on GitHub** (or GitLab, or Bitbucket), which opens the file's page, and **Copy path** has **Link on GitHub**, which copies its address. The [line author](/docs/git-in-the-editor#line-author)'s card has **Open on the forge**. These links come from the folder's git remote and need no connected account. They work on github.com, gitlab.com and bitbucket.org; with a company GitLab, the item is unavailable and says "no remote on a known forge". See [Open in](/docs/files#open-in) and [Copy path](/docs/files#copy-path).

## Plan and limits

The GitHub, GitLab and Bitbucket integrations are on the free plan. The browser code works for GitHub and gitlab.com; a company GitLab and Bitbucket connect by token. For Bitbucket, only Bitbucket Cloud. Of the three, only GitHub brings issues.

Every call made with the accounts shows in [Privacy and network](/docs/privacy-and-network); clones show as `GIT`.
