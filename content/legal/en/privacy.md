---
title: Privacy policy
description: What data the website, the app and Persisty Cloud keep, where it is stored, what it is for and how to ask for it to be deleted.
updated: 2026-10-29
---

Persisty is built to keep as little as possible. The app works without an account and without internet, and what you do in it stays on your machine.

## In the app

Projects, sessions, terminal history, notes and AI usage stay in a local database on your computer. Persisty does not send code, terminal output or prompts anywhere, and it has no telemetry.

The app only reaches out to:

- read Claude Code's quota, with the credential Claude Code already stores;
- sign in to the Persisty Cloud account and renew the licence;
- talk to GitHub, GitLab or Bitbucket, for the integrations you connect;
- clone, fetch, pull and push commits on your git repositories' remotes. To show what is left to pull and push, it also fetches on its own when it opens and every 5 minutes while the app is on screen;
- look for new versions of the app (see below).

Every call shows up in **Settings › Privacy & network**, with its destination, purpose, size and result.

### Looking for new versions

To find out whether a new version is out, the app downloads from GitHub a public file that only says which version is the latest (`github.com/abalad/persisty-releases`). GitHub sees your computer's IP address and, in the request header, the app's version. No data from your account or your projects goes with it.

The check happens when the app opens, every 6 hours while it is open and when you click **Check for updates**. To turn the automatic check off, use **Settings › About**; the button still works. When you ask to install, the app downloads the new version from the same place.

## On the website

The website uses no analytics and no tracking cookies. It stores two kinds of cookie, both needed for it to work:

- the language you chose;
- your account session, when you sign in.

The website is hosted by Vercel, which receives the usual data from any visit to a website (IP address, browser, page requested).

## In your Persisty Cloud account

When you create an account, we keep:

- your e-mail and a display name taken from it;
- your personal organisation and, if there are any, the team organisations you belong to;
- the connected devices: name, system, app version and last access;
- your plan and, once they exist, the subscription details;
- the preferences you turn on, such as the new-version e-mail (and the language it comes in) and interest in Enterprise.

This data is stored in Supabase, in the São Paulo region. We use it to run the account, issue the licence and send the notices you asked for. We do not sell data and do not use it for advertising.

When payment is available, it will be processed by Stripe; Persisty does not see or store card details.

## Your rights

Under the LGPD (Brazil's data protection law), you can ask for access to your data, for it to be corrected or for your account to be deleted. When the account is deleted, the personal data is erased; only aggregate numbers that identify no one remain.

{{contact}}

## Changes

If this policy changes, the date at the top changes with it, and changes that affect what we keep are announced by e-mail to everyone with an account.
