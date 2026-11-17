---
title: Request queue
description: Write the agent's next request now and choose when it goes, as soon as the agent is free, when the 5-hour window renews or from a chosen time.
group: agents
order: 7
---

The queue holds the next requests for an agent and hands them over one at a time, when their time comes and the agent is free. It lives in **Request queue**, in the bar on the session's right edge, and works like a chat: what goes first is at the top, and the text box at the bottom.

## Queue a request

Write the request in the box, choose when it goes and click **Queue it**, or use <kbd>⌘</kbd> <kbd>↵</kbd>. On Windows and Linux, the keys on this page use <kbd>Ctrl</kbd> instead of <kbd>⌘</kbd> and <kbd>Alt</kbd> instead of <kbd>⌥</kbd>.

The queue's header says what the agent is doing, such as **Working**, **Done, ready for the next one** or **Asking for permission**. Waiting requests are numbered under **Up next**, in the order they will go, with when each one goes and why the ones below are waiting, such as "waiting for no. 1". The first one has the **next** tag. Sent requests fold away at the bottom, under **Sent**. In the session's bar, the queue icon shows how many requests are waiting, also with the panel closed.

## When each request goes

Beside the box, choose when the request goes: **As soon as the agent is free**, **When the 5-hour window renews** or **From a chosen time**, which you set. The 5-hour window uses the time read from the live quota of the session's own account; while that time is not known, the option is disabled.

A chosen time is only the earliest: the request still waits for the agent to be free and for the requests above it to go.

## Reorder and edit

Drag a request by its handle to reorder it or, with it in focus, use <kbd>⌥</kbd> <kbd>↑</kbd> and <kbd>⌥</kbd> <kbd>↓</kbd>. Each request has buttons to edit it, send it next and take it off the queue. Sending next puts the request at the top and drops its chosen time: it goes as soon as the agent is free.

Editing puts the text back in the box, and the queue waits while you edit. If you leave it untouched for 15 minutes, the queue moves again. **Pause queue** holds everything, also after the app reopens, until you click **Resume queue**.

## Images

The box takes images: <kbd>⌘</kbd> <kbd>V</kbd>, dragging onto the box or the paperclip, **Attach images**. Up to 8 per request, of up to 10 MB each, in PNG, JPEG, GIF or WebP. They stay on this computer, and the agent gets their paths at the end of the request, on a line that starts with `Images:`. If an image disappears from the disk before its time, the request does not go, and **Sent** says why. In Codex CLI, images have not been verified yet.

## How requests reach the agent

Requests go one at a time, in queue order, and only when the agent is waiting for its next request. They never go in the middle of work, nor while the answer has left a subagent or a command in the background, nor over a permission request. Between one request and the next, the queue waits at least 20 seconds.

Each request goes exactly as written, as a single paste, and Persisty presses Enter right after it, so Claude Code sends it instead of keeping it as a draft. Line breaks inside the request send nothing early, and a long request goes in whole.

When the account runs out of quota, the queue waits for the window to renew; see [When the quota runs out](/docs/ai-accounts#when-the-quota-runs-out).

## Plan and limits

Only writing, editing and attaching images are Pro. On the free plan, requests already in the queue still go and can be paused, resumed, reordered, sent next or taken out, and **Let the queue go now** works too.

The queue is checked every 10 seconds while Persisty is open. With the app closed, nothing is sent. The queue is for agent sessions only. If the session ends, the requests that were waiting leave the queue with the note **the session ended first**. In Codex CLI, Persisty does not receive the agent's state yet, so it cannot tell when the agent is free, and requests do not go.
