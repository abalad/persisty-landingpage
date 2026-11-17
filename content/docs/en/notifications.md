---
title: Notifications
description: When and how Persisty tells you an agent has finished or is asking for permission, with an in-app alert, a system notification and a sound.
group: agents
order: 4
---

When an agent finishes its turn or asks for permission, Persisty tells you, unless you are already looking at that session. The notice can be an alert in the corner of the window, the system notification and a short sound.

## When Persisty tells you

With the Persisty window in focus, an alert shows in the corner with the session's name, **Finished and waiting for you** or **Asks for permission**, and a **View** button that opens the session. The alert goes away on its own after 10 seconds, and at most three show at once. With another window in front, the system notification comes instead. Both come with two short, quiet tones. If the session is already in front of you, with Persisty in focus, nothing shows.

An answer that left work in the background only tells you when that work is over; see [Background work](/docs/agents#background-work). The quota notices come the same way: when an account runs out of quota, with how many sessions are waiting, and when each session goes on with its task; see [When the quota runs out](/docs/ai-accounts#when-the-quota-runs-out).

## Set them up

[**Settings › Notifications**](/docs/settings#notifications) has three switches, all on to begin with. **In-app alerts** turns the corner alert on, and **Play a sound** turns the two tones on. **Mute while Persisty is focused** leaves the system notification out while the window is in focus; turned off, you get the alert and the notification at the same time.

## Send a test

**Send a test**, on the same screen, fires the alert, the sound and the system notification at once, ignoring focus and mute, so you can see how they look.

If the system notification does not show, check that Persisty is allowed in the system's notification settings. When the system says it blocked them, the screen shows **Blocked by the system**; allow Persisty there and send the test again. The system does not always say so, which is why the hint on where to look is always on the screen.

## Plan and limits

Notifications are on the free plan and come while Persisty is open. They rely on Claude Code's hooks: by default, Codex CLI does not send its state to Persisty and gives no notices.
