---
title: Git in the editor
description: Each file's Git inside the editor, with gutter marks, the author of each line, git blame annotation, diffs and history, and the Git submenu of the tree and the tab.
group: code
order: 7
---

The [editor](/docs/editor) shows the open file's Git without you leaving it: what changed since the last commit, who changed each line and the file's history. To commit, push and switch branches, use the [Changes](/docs/changes) panel.

## Gutter marks

In a file inside a repository, the gutter marks the lines added, changed and deleted since the last commit, and the marks keep up as you type. The **Changes since the last commit** button, on the tab bar, shows the file's diff against HEAD in the editor itself. For a file that is not in the last commit, such as a new file or one outside a repository, the button is greyed out, and the status bar says **not in git**.

## Line author

At the end of the cursor's line, after a moment's pause, the editor shows who changed the line, when and with what message, such as "Ana, 3 d ago • Fix the time zone". After 7 days, the commit's date and time show instead. A line not committed yet says "You • not committed". Hovering opens the commit card, with **Copy hash**, **Show the commit**, which opens the commit in the [Changes history](/docs/changes#history), and [**Open on the forge**](/docs/forges#open-on-the-forge), which opens the file at that commit, on the same line, on GitHub, GitLab or Bitbucket. From the keyboard, use **Show the line's commit card**, in the palette (<kbd>⌘</kbd> <kbd>K</kbd>).

In [**Settings › Editor › Line author (git blame)**](/docs/settings#editor), **Show the author at the end of the line** is on by default. While it is on, **Author**, **Date** and **Message** choose what shows, and **Delay**, from 300 to 2000 ms, how long you stay still before it shows; the default is 600 ms.

## Annotate with Git Blame

**Annotate with Git Blame**, on the **Git** submenu or in the palette, puts each line's author and date in the gutter, coloured by the commit's age. A click on the annotation highlights the lines of the same commit and opens its card, and right-clicking it offers **Show the commit's diff**, **Annotate the previous revision**, **Copy hash** and **Close the annotation**. Files over 20,000 lines are not annotated.

## The Git submenu

Right-clicking the [tree](/docs/files) or a [tab](/docs/tabs-and-groups#the-tab-menu) offers the **Git** submenu: **Show Diff**, **Show History**, **Show History for Selection**, **Compare with Branch…**, **Compare with Commit…**, **Stage**, **Unstage**, **Discard Changes** and **Annotate with Git Blame**. They are all in the palette too.

**Show History for Selection** uses the lines selected in the code, so it works from the tab and the palette, not from the tree. **Stage**, **Unstage** and **Discard Changes** take several files and folders; the others, a single file. An item that does not apply to what you picked is greyed out and says why, such as "file not under version control" or "no changes".

## Diffs and history in tabs

Diffs and history open in read-only tabs, beside the file tabs. A diff against the open file follows the text you have not saved yet, and the tab's title says "unsaved" when that is the case.

**Show History** lists the commits that changed the file, newest first, and the chosen commit's diff shows below; the arrows move through the list. **Show in the panel** opens the commit in [Changes](/docs/changes), and **Copy hash** copies its hash. **Compare with Branch…** and **Compare with Commit…** open a list with search to pick the other side.

## Discard Changes

**Discard Changes** asks first and records a restore point, **Before discarding changes**. Text you typed in an open tab is saved first, so the point keeps it too. To bring the file back, use the [Restore points](/docs/restore-points#before-discarding) panel.

## Plan and limits

Everything on this page is on the free plan, including the restore point before discarding.

These features only appear in folders that are git repositories. Nothing here goes to the internet, except **Open on the forge**, which opens the browser. Files over 20,000 lines are not annotated, and an annotation that takes too long is stopped.
