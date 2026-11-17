---
title: Updates
description: How Persisty looks for and installs new versions, what happens to open sessions and where to download each version.
group: account
order: 4
---

Persisty looks for new versions on its own and installs one when you click. The check and the download come from Persisty's releases repository on GitHub, and each one shows in [Privacy and network](/docs/privacy-and-network).

## Update in the app

The automatic check runs half a minute after the app opens and then every 6 hours while it stays open. When there is a new version, a notice appears in the bottom right corner with its number, such as "Persisty 0.13.0 is available", and the version you are on. **What's new** opens what changed in that version in your browser. **Install and restart** downloads the update showing its progress, checks the file's signature, installs it and opens Persisty on the new version.

To check right away, click **Check for updates** in **Settings › About**. The row then says "Checking…" and then "You're on the newest version" or the new version, with **Install and restart** beside it. If it cannot check, it says "Couldn't check right now". An automatic check that fails shows nothing and tries again next time.

The notice's close button, **Skip this version**, hides the notice for that version; the next version's notice shows as usual. A skipped version stays in **Settings › About**, for you to install whenever you like.

If the download goes 30 seconds without receiving anything, it gives up. When installing fails, the notice shows **Couldn't install:** with the reason and swaps the button for **Download**, which opens the [download page](/download).

## Open sessions

On a Mac, the app installs and restarts without asking anything, and the open sessions come back with it: when it opens, Persisty reattaches them, as in [Coming back after a crash](/docs/sessions-and-recovery#when-persisty-opens).

On Windows and Linux, which are in preview, installing may end the open sessions. With any session open, the app asks first: **Install the new version now?** says how many sessions may be ended, and **Install anyway** goes ahead. When it opens, the ones that ended come back according to [each one's rule](/docs/sessions-and-recovery#when-to-relaunch).

## Turn off the automatic check

**Check for updates automatically**, in **Settings › About**, is on by default. Off, the app only checks when you click **Check for updates**. Every check and every download shows in the [network log](/docs/privacy-and-network#network-log), with one line for each server it went through.

## Windows and Linux

Windows and Linux are in preview: the app ships unsigned and has not yet been tested on real machines. On Windows, the update's installer runs without asking questions and closes Persisty on its own to replace the files.

On Linux, only the AppImage updates from the app. Installed from the `.deb` package, the notice and **Settings › About** show **Download** instead of **Install and restart**, and the new version comes from the download page. The `.deb` installs alongside the programs the system already has, with no name clash.

## Download

The [download page](/download) offers the latest version for each system: on the Mac, a universal DMG, for Apple Silicon and Intel, signed and notarised by Apple; on Windows, an `.exe` installer (x64); on Linux, the AppImage and the `.deb` package (x64).

[All versions](/download/versions) lists every version, newest first, with the date, size and SHA-256 of each file. To check a download, compare its SHA-256 with what `shasum -a 256 file-name` shows on Mac and Linux, or `Get-FileHash file-name` in Windows PowerShell.

## What's new and release e-mails

The [changelog](/changelog) says what changed in each version and has an RSS feed in each language. In **Settings › About**, the **What's new** row opens that page. To get an e-mail when a new version is out, turn it on in [My account](/account), under **Release e-mails**.

## Plan and limits

Updating is on the free plan and needs no account. Checking and installing only happen while Persisty is open, and nothing installs until you click. The app needs macOS 12 or later; it has been tested on Apple Silicon and should work on Intel.
