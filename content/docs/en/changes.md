---
title: Changes and commits
description: The session's Changes panel, to stage, see the diff, commit, sync with the remote, switch branches, stash changes and resolve conflicts.
group: code
order: 8
---

The **Changes** panel is the git of the session's folder, like an IDE's source control. It opens from the **Changes** icon, in the tool bar on the session's right edge, or with <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd>. The icon shows how many files changed, also with the panel closed.

## Stage and discard

The list shows the files under **Staged** and **Changes**, with git's status letter: M (modified), A (added), D (deleted), R (renamed), U (untracked) or C (conflicted). A file's **+** stages it, and its **−** unstages it; on each group's title, **Stage all** and **Unstage all** do the same for every file.

The **↺** discards a file's changes, and **Discard all changes**, on the group's title, discards them all. Persisty asks first and records a [restore point](/docs/restore-points#before-discarding), as in the [editor](/docs/git-in-the-editor#discard-changes). A new file that is discarded is deleted.

Right-clicking a file, or <kbd>⇧</kbd> <kbd>F10</kbd> with it in focus, offers **Open file**, **Stage** or **Unstage**, **Discard changes**, **Copy path**, **Copy relative path** and **Reveal in Finder**. On an untracked file, the menu also has **Ignore this file** (or **Ignore this folder**) and **Ignore everything named** with its name; Persisty writes the rule to the `.gitignore` at the repository's root.

## See the diff

A click on a file shows its diff beside the list, in the current text, with removed lines in red and added ones in green. On a file not staged yet, **Open in editor** takes you to the file. The same goes for the files of a commit in the history and of a stash.

## Commit

![In the Changes panel, clicking App.tsx shows its diff; the file is staged, the message goes in the box, and Command and Enter make the commit, which appears at the top of History.](/docs-media/changes/commit.mp4)

Write the message in the box and commit with <kbd>⌘</kbd> <kbd>↵</kbd> or the **Commit** button. With nothing staged, the button becomes **Commit all**, which stages every change and commits.

**More commit actions**, on the arrow beside the button, holds **Commit and push**, **Amend last commit**, which folds what is staged into the last commit (an empty message keeps its message), and **Undo last commit**, which takes the commit back, with its changes staged and its message in the box. If that commit was already pushed, Persisty first warns that the next push will have to be forced.

## History

**History** lists the branch's last 30 commits, each with its message, short hash, author and how long ago; the ones not pushed yet have a filled dot and the tooltip **Not pushed**. A click opens the commit's files, and a click on a file shows its diff. Right-clicking a commit, or its **⋯**, offers **Copy SHA**, **Copy message**, **Create branch from here** and **Revert commit**; on the latest, **Undo last commit** too.

**Show the commit**, on the [line author](/docs/git-in-the-editor#line-author) card, opens the commit here, even when it is older than the 30 in the list.

## Sync with the remote

![The main branch is 2 commits behind and 1 ahead of the remote; the ↓ arrow asks how to combine them, Rebase: my commits on top brings in the new commits, and the ↑ arrow sends the rest, until the panel reads Up to date.](/docs-media/changes/git.mp4)

On a branch with a remote, the top of the panel shows its name and how it stands against the remote: **Up to date**, ↓ with the commits to pull and ↑ with the commits to push. A click on the arrow pulls or pushes. If both sides have new commits, Persisty asks how to join them: **Merge: a joining commit** or **Rebase: my commits on top**. A branch not on the remote yet shows **Publish branch**, which pushes the branch and tracks it from then on.

**Fetch from the remote** brings in the news right away. **More sync actions** holds **Pull with rebase**, **Pull with merge** and **Force push**, which asks first and only replaces the remote if nobody pushed anything since the last fetch.

The session header shows the same arrows beside the branch name. While the app is in view, Persisty fetches from the remote on its own every 5 minutes, unless someone fetched less than 3 minutes before.

## Branches

![Clicking the branch in the session header opens the branch list, with the warning about the changes that go along; typing feat/pagamento-pix offers Create branch, and Enter switches the header to the new branch.](/docs-media/changes/branch.mp4)

A click on the branch, in the session header, opens **Find or create a branch**: the **Local** ones, the **Remote** ones and, when the name you type does not exist, **Create branch** with it. The list warns when uncommitted changes go along and when the agent is working in that folder. The header's branch follows switches made from the terminal.

In the panel, the **Branches** group lists the local branches, with the current one marked and the arrows against the remote, and those **Only on the remote**. A click switches branch, and **New branch** creates one from where you are. Right-clicking a branch offers **Switch to it**, **Merge into** the current branch, **Rename** and **Delete**. Delete asks first; if the branch has commits that are on no other branch, Persisty asks again, with **Delete anyway**. The deleted branch stays on the remote, if it is there.

## Stash changes

The **Stashed** group is git's stash. **Stash changes** puts every change aside, new files included, with a name if you want one, and leaves the folder clean. A click on an item shows its files. Right-clicking it offers **Apply**, **Apply and remove** and **Discard**, which asks first.

## Conflicts

During a merge, rebase, cherry-pick or revert, the panel shows the operation, such as **Merge in progress**, and the files under **Conflicts**. For each file, pick **Accept the current version** or **Accept the incoming version**, or edit it and use **Mark as resolved**. With no conflicts left, **Continue** finishes the operation, and **Abort** asks first and puts everything back as it was before it started.

## Keys

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> opens and closes the panel, <kbd>⌘</kbd> <kbd>↵</kbd> commits and <kbd>⇧</kbd> <kbd>F10</kbd> opens the menu of the file in focus. With the cursor in the code, in the WebStorm (macOS) and VS Code keymaps, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> is **Find Previous** after a search in the file; there, use the **Changes** icon. On Windows and Linux, which are in preview, use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd>.

## Plan and limits

The **Changes** panel is on the free plan, including the restore point before discarding.

It works in folders that are git repositories; outside one, it says "This folder is not in a git repository." Persisty uses the credentials git already has on the computer, such as the Keychain and the SSH agent, and never asks for a password in the terminal: if git needs to ask, the refusal shows as git wrote it. With too many changes, the list says it is partial.
