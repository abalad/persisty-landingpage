/*
 * The terminal mascot's moods and reactions, as in the desktop app
 * (features/buddy/mood.ts and the Reaction of signals.ts). The app reads the
 * mood from the session's real state; the site's windows say it from their
 * story.
 */

/** What makes the mascot rise for a moment (a click is a "poke"). */
export type Reaction = { kind: "celebrate" | "oops" | "wave" | "think" } | { kind: "say"; text: string };

/** How long each reaction keeps the mascot up, in ms. */
export const REACTION_MS: Record<Reaction["kind"] | "poke", number> = { celebrate: 1900, oops: 1700, wave: 1500, think: 2300, say: 3800, poke: 950 };

/** The mascot's mood: the session's state, as the person would read it. */
export type Mood = "working" | "asking" | "done" | "busy" | "idle" | "ended" | "stopped" | "failed";

/** What the mascot does by itself as the mood changes: a finished turn is celebrated, a failure regretted. */
export function reactionTo(prev: Mood | null, next: Mood): Reaction | null {
  if (prev === null || prev === next) return null;
  if (prev === "working" && next === "done") return { kind: "celebrate" };
  if (next === "failed") return { kind: "oops" };
  return null;
}
