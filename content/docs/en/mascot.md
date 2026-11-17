---
title: Mascot
description: The mascot in the terminal's corner follows the session's agent; on macOS it can also leave the app and tell you things on top of your windows.
group: agents
order: 3
---

The mascot sits in the corner of the session's terminal and reacts to what the agent does. On macOS it can also leave the app and stand on your windows, to tell you when a session needs you.

![The mascot walks along the top of a window and reaches its edge.](/changelog/0.10.0/mascote.mp4)

## In the terminal

The mascot follows the session in focus: it rises when something is pending, such as a permission request, celebrates when a turn ends and looks sorry when the session's process fails. Its head follows the pointer, and it hops when you click it. With [voice dictation](/docs/voice) on, the mascot of the terminal that will receive the text holds a microphone while you speak and celebrates when the text goes in.

In a Persisty terminal, the `persisty` command makes that terminal's mascot react: `persisty celebrate`, `persisty oops`, `persisty wave`, `persisty think` or `persisty say` followed by up to 80 characters of text. A script can use it to say it has finished.

It starts on. To remove it, turn off [**Settings › Appearance › Mascot in the terminal**](/docs/settings#appearance), or right-click it and choose **Hide mascot**.

## Outside the app

On macOS, the mascot can leave the terminal's corner and stand on your windows, on top of any app. That way it tells you things while you are in your editor or browser. It starts off: turn it on in **Settings › Appearance › Mascot outside the app**, or with **Show the mascot outside the app** in the command palette. With the mascot outside the app, the one in the terminal goes away.

It stands on top of the front window, rides along when the window moves and falls when it goes away; when nothing is happening, it sits down and dozes. Drag it anywhere, on any display, and it remembers where. Clicking or dragging the mascot does not take the focus away from the app you are in.

**The mascot walks on your windows**, on the same screen, starts on. Turned off, the mascot stays only where you leave it.

## Notices and balloon

When a session asks for you and Persisty is not in focus, the mascot rises, shows how many are waiting and says which one, such as "checkout asks for permission" or "api asked a question". It also tells you when a session finishes. Clicking what it says opens the session.

A click on the mascot opens a balloon. Under **Needs you** are the sessions that are waiting, from the oldest wait to the newest, with what they asked for, how long ago and an **Open** button; the ones that do not fit go to the [Board](/docs/board), in an item such as **+2 on the Board**. Under **Notices** are the sessions that finished or ran into an error, with **Ok** to remove one and **Clear** to remove them all.

At the top of the balloon are **Open the Board**, the bell and **Hide mascot**, which turns off the mascot outside the app. The bell turns on **Do not disturb**: the mascot stops rising and speaking, but the count goes on. **Notify me again**, on the same bell, undoes it.

## Plan and limits

The mascot is on the free plan. Outside the app, it exists only on macOS and only while Persisty is open: quitting Persisty closes the mascot. Like the Board, it only opens sessions and never answers for you.
