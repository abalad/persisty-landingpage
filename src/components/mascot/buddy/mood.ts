import type { Reaction } from "./signals";

/*
 * Copied from the desktop app (persist-application, apps/desktop/src/features/buddy/mood.ts): only what the floating
 * mascot's character reads. The app's mood comes from a session's activity; the site sets it by hand.
 */

/** How long each reaction keeps the mascot up, in ms (a click is a "poke"). */
export const REACTION_MS: Record<Reaction["kind"] | "poke", number> = { celebrate: 1900, oops: 1700, wave: 1500, think: 2300, say: 3800, poke: 950 };

/** The mascot's mood: the session's real state, as the person would read it. */
export type Mood = "working" | "asking" | "done" | "busy" | "idle" | "ended" | "stopped" | "failed";

/** What the dictation asks of this mascot: it holds the microphone while it listens, and lowers it to transcribe. */
export type Dictation = "off" | "listening" | "transcribing";
