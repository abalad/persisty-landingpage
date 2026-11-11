import type { PhysicsCues, PhysicsState } from "../physics";
import type { Pose } from "./pose";

/**
 * What the rig knows about the world and what it asks of the character each frame. The director turns a Situation into a
 * Frame; the animator brings the joints to the Frame's pose through their springs.
 */

/** A terminal's reaction ("say" comes in as "talk") or a click ("poke"). */
export type ReactionKind = "celebrate" | "oops" | "wave" | "think" | "talk" | "poke";
/** The floating mascot's mood: someone asks, someone works, or nothing. */
export type Mood3 = "asking" | "working" | "idle";
/**
 * Where it rests when nothing asks for it: standing; sunk to the head at the bottom edge (`peek`); sat on a window's top,
 * the legs hanging in front of it (`sit`); dozing standing where it is, over nothing after a change of scene (`doze`); or
 * hidden behind a screen's outer edge, the box flush against it, half the head and one hand on the corner (`edge`).
 */
export type Rest = "stand" | "peek" | "sit" | "doze" | "edge";
/** Where the pointer is: −1…1 around the head on each axis, y down; `at` when it last moved (ms, the rig's clock). */
export interface Look { x: number; y: number; at: number }

/**
 * Held by the pointer (the spec's "Arrasto"): the startle at the grab, hanging from the head, pulled up, or flying sideways.
 * `since` is when this phase began (ms, the rig's clock); `ax` the pointer's acceleration across (px/s², + to the right),
 * which swings the body; `facing` where it flies (+1 to the right).
 */
export type DragPhase = "startle" | "hang" | "up" | "flight";
export interface DragCue { phase: DragPhase; since: number; ax: number; facing: -1 | 1 }
/** A bump into the screen's side: which side, when (ms, the rig's clock), whether it was thrown, and how fast (px/s). */
export interface BumpCue { side: "left" | "right"; start: number; thrown: boolean; speed: number }
/**
 * A one-shot of the physics' (F) on a still body (timelines/windows.ts): testing the floor with the toes, on tiptoe at a
 * window's end, looking around after a change of scene. `start` on the rig's clock (ms; it may be ahead: testing the floor
 * after a landing waits for it to end); `side` the end it is about (−1 left, 1 right, 0 none).
 */
export interface Beat { id: "testFloor" | "tiptoe" | "sceneLook"; start: number; side: -1 | 0 | 1 }
/**
 * What the physics says of the body (physics.ts): its state and since when (ms, the rig's clock), the continuous cues,
 * the last landing, how high it fell from (px) and when it touched down (ms, the rig's clock), until the next one, and the
 * last one-shot (idle.ts `bodyBeat`), until the next one: the director plays it while it lasts.
 */
export interface BodyCue { state: PhysicsState; since: number; cues: PhysicsCues; landed: { height: number; at: number } | null; beat: Beat | null }

/**
 * A quirk (P) of the idle mascot: on a window, looking its top over and peeking over its end; anywhere, every few minutes,
 * stretching, yawning (it ends asleep), looking around, two little hops, knocking on the window's top, swinging the legs
 * (sat on a top); and waving to the cursor when it comes back.
 */
export type QuirkId = "lookAtWindow" | "peekOver" | "stretch" | "yawn" | "lookAround" | "hop" | "knock" | "swingLegs" | "waveCursor";
/**
 * A quirk from `start` (the rig's clock, ms; it may be ahead), towards `side` (−1 left, 1 right, 0 none: the end it peeks
 * over, where the cursor is for the wave, which way it looks first); `edge`, for the peek over the end, how far that end is
 * from the feet (px): the hand takes hold of the corner there.
 */
export interface QuirkCue { id: QuirkId; start: number; side: -1 | 0 | 1; edge?: number }

export interface Situation {
  mood: Mood3;
  reaction: { kind: ReactionKind; start: number } | null;
  look: Look | null;
  asleep: boolean;
  rest: Rest;
  theme: "light" | "dark";
  drag: DragCue | null;
  bump: BumpCue | null;
  /** Null without physics (before it is on, or with no screens): the base stands on its own. */
  body: BodyCue | null;
  /** The quirk playing (only idle and standing still, or sat on a top), or none. */
  quirk: QuirkCue | null;
  /**
   * Leaving a rest, from `start` (the rig's clock): out of `from` and up to standing in 700 ms, or with an alarm (someone
   * asks) in 500 ms, with a "!". The rest is already "stand" meanwhile.
   */
  exit: { start: number; alarm: boolean; from: Rest } | null;
  /** Behind which outer edge it hides (rest "edge"), and the one it last left: −1 the screen's left, 1 its right. */
  hideSide?: -1 | 1;
  /**
   * The page's badge with the count shows (someone needs you, with "do not disturb" too): one signal at a time, so no "!"
   * or "?" beside the head meanwhile. Left out, as the mood says (asking: the badge is up), as in the gallery's rows.
   */
  badge?: boolean;
  /**
   * Calm (reduced motion): each change one still pose. Left out, the director's own `reduced` (the gallery's); the rig
   * sets it, so the computer's setting changing with the page open counts from the next frame.
   */
  calm?: boolean;
}

/**
 * The character this frame: its pose, the antenna's tint (the rim leans towards it), how bright the antenna shines (0–1),
 * how strong the rim is, and the pace the loop draws at when nothing else moves.
 */
export interface Frame {
  pose: Pose;
  tint: "lime" | "amber" | "red";
  glow: number;
  rim: number;
  pace: "active" | "work" | "rest";
}
