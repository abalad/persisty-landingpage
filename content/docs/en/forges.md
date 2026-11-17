---
title: GitHub, GitLab and Bitbucket
description: Connect your accounts to list and clone repositories, private ones included, and to bring in GitHub issues.
group: integrations
order: 2
---

In **Settings › Integrations**, you connect accounts from GitHub, GitLab (gitlab.com or your company's own) and Bitbucket Cloud. With an account connected, **Add workspace** lists your repositories and clones the private ones.

## Connect accounts

The **Integrations** screen shows the **Connected** services first, with each one's account, then the **Available** ones. Click a service to open its page: **Connect account** makes the first connection, and **Add account** the ones after it. Each service takes several accounts, and each account shows its address, whether it came in **by code** or **by token**, and since when.

Persisty keeps the accounts and their tokens in the system's password store; on the Mac, that is the `Persisty Integrations` item in the Keychain. **Disconnect** makes Persisty forget the account but does not revoke its access on the service. The link at the foot of each page takes you to where you revoke it: the authorised apps on GitHub and gitlab.com, or the tokens at Atlassian.

## GitHub

**Connect account** opens **Connect to GitHub** with a code. Click **Open GitHub**, sign in to the account you want to connect, confirm the code and authorise Persisty. The window waits for the confirmation and closes on its own; Persisty never sees your password. The access requested covers your repositories, including private ones and your organisations'. If an organisation's repositories do not show up, it needs to approve Persisty.

## GitLab

**Where is your account?** offers two routes. With **gitlab.com**, **Continue in the browser** shows a code to confirm on gitlab.com, as with GitHub. With **Company GitLab**, enter the **GitLab address**, such as `gitlab.company.com`, and click **Create token on GitLab**: the page opens with the name and the `read_api` and `read_repository` scopes already ticked. Pick an expiry, create the token, paste it under **Paste the token** and click **Connect**. GitLab shows the token only once.

## Bitbucket

Bitbucket Cloud connects with an Atlassian API token. **Open Atlassian tokens** takes you to the page; choose Create API token with scopes, select Bitbucket and tick `read:user` and `read:repository`. Back in Persisty, enter the **Atlassian account e-mail**, paste the token and click **Connect**.

## What the accounts do

In **Add workspace**, with **Remote repository**, the field becomes **Link or search** and lists the connected accounts' repositories, with a filter by service; the steps are in [Clone a repository](/docs/projects-and-workspaces#clone-a-repository). A pasted link is looked up with that service's accounts, one by one, until one of them can see the repository. A clone over HTTPS uses that account's token, for its address only; a clone over SSH uses your own keys.

The GitHub account also brings in your repositories' issues, to [start sessions from them](/docs/issues), and serves the GitHub MCP server; see [MCP servers](/docs/mcp-servers).

## Clone folder

At the bottom of the **Integrations** screen, **Cloning › Default folder for clones** sets where a clone goes when the project has no workspaces yet. The default is `~/Documents/GitHub`, and **Choose…** changes it. In a project with workspaces, the clone goes next to them. The same folder applies to all three services.

## Open on the forge

**Open in** and **Copy path**, in the file tree and on the tab, lead to the file's page on GitHub, GitLab or Bitbucket, and the line author's card has **Open on the forge**. These links come from the folder's git remote and need no connected account. They work on github.com, gitlab.com and bitbucket.org; with a company GitLab, the item is unavailable and says "no remote on a known forge". See [Open in](/docs/files#open-in) and [Git in the editor](/docs/git-in-the-editor).

## Plan and limits

The GitHub, GitLab and Bitbucket integrations are on the free plan. The browser code works for GitHub and gitlab.com; a company GitLab and Bitbucket connect by token. For Bitbucket, only Bitbucket Cloud. Of the three, only GitHub brings issues.

Every call made with the accounts shows in [Privacy and the network log](/docs/privacy-and-network); clones show as `GIT`.
