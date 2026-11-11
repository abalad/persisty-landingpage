import type { MascotRect, Platform } from "./types";
import type { Beat, QuirkCue, QuirkId, Rest } from "./character/cues";
import { ARRIVE_MS, LANDING_MS, landingOf } from "./character/timelines/fall";
import { BOX, FEET, type Point } from "./layout";
import type { PhysicsStep } from "./physics";
import { outerSides, workUnder } from "./screens";

/**
 * What the idle mascot does with its body, pure (the spec's "Em pé e andando", "Andar junto e cair" and "Ócio"): where it
 * rests at 60 s (behind a screen's outer edge when one is near), the physics' one-shots on a still body (testing the floor,
 * tiptoe at an end, looking around after a change of scene), the quirks on a window (looking it over, peeking over its end),
 * and the idle director: a quirk every 4–8 min and the wave to the cursor that comes back. The page and the lab call them
 * with each physics step or on their own clock (ms), the draws from an injected `rand`.
 */

/** Where it is when the 60 s of nothing are up. */
export interface RestPlace {
  /** The physics is on (gravity and the strolls). */
  switchOn: boolean;
  /** It stands on a window. */
  onWindow: boolean;
  /** Over nothing, where a change of scene left it. */
  afterScene: boolean;
  /** The box on the work area's bottom edge (project 2's `restFor`). */
  atBottom: boolean;
  /** On the floor within 400 px of a screen's outer edge, the nearer one (`edgeNear`); null otherwise. */
  nearOuterEdge: "left" | "right" | null;
}

/**
 * The rest at 60 s: on a window it sits on the top; over nothing after a change of scene it dozes standing; on the floor
 * near an outer edge it walks there and hides behind it; elsewhere on the floor it sinks to the head (project 2's peek).
 * With the switch off, project 2's rest: peeking at the bottom edge, standing elsewhere.
 */
export function restAt(place: RestPlace): Rest {
  if (!place.switchOn) return place.atBottom ? "peek" : "stand";
  if (place.onWindow) return "sit";
  if (place.afterScene) return "doze";
  return place.nearOuterEdge ? "edge" : "peek";
}

/** How far the feet may walk to a screen's outer edge to hide behind it at rest (px). */
export const EDGE_PX = 400;

/**
 * Which outer edge of the screen under the feet is within 400 px of walking (the box flush against it), the nearer one;
 * null off every screen or with none that near. Where two monitors touch at the feet's height there is no edge.
 */
export function edgeNear(feet: Point, works: MascotRect[]): "left" | "right" | null {
  const work = workUnder(works, feet);
  if (!work) return null;
  const sides = outerSides(works, work, feet.y);
  const left = sides.left ? feet.x - (work.x + FEET.x) : Infinity;
  const right = sides.right ? work.x + work.w - (BOX.w - FEET.x) - feet.x : Infinity;
  if (Math.min(left, right) > EDGE_PX) return null;
  return right <= left ? "right" : "left";
}

/**
 * How long a new rest plays before it sleeps and the rig stops drawing (ms): sitting down, the legs swinging and the eyes
 * closing (the spec's 1–12 s to get there); dozing off standing; sinking to the head (asleep the rig draws one frame and
 * stops: the springs need the time to get there); behind the edge, from when it got there: turning to the screen, sliding
 * out, the hand on the corner, the eyes on the cursor a moment. A rest it already had (peeking at the bottom edge with the
 * switch off) sleeps at once, as before.
 */
export const REST_SETTLE_MS: Record<Rest, number> = { stand: 0, peek: 1000, sit: 7000, doze: 2500, edge: 4000 };
/** After a yawn the rest sleeps this soon at most (its own time if shorter): the eyes are heavy already. */
export const SLEEPY_SETTLE_MS = 3000;

/** Standing this close to a window's end (px) it goes on tiptoe; it may again once it was 2 px farther. */
export const TIPTOE_PX = 14;
/** Looking the window over comes this long after landing on it (ms), drawn. */
export const LOOK_AFTER = [5000, 15_000] as const;

/**
 * What `bodyBeat` remembers between steps (the page keeps one): the window it last landed on, whether it is at an end
 * already, when the last landing's animation ends, and the last list of windows (front to back), to know which end.
 */
export interface BeatMemory {
  platform: number | null;
  near?: boolean;
  busyUntil?: number;
  windows?: readonly Platform[];
}

/** Which end of its window the feet are nearer: −1 the left, 1 the right (1 without the list). */
function endOf(step: PhysicsStep, windows: readonly Platform[] | undefined): -1 | 1 {
  const r = windows?.find((w) => w.id === step.support);
  if (!r || !step.feet) return 1;
  return step.feet.x - r.x <= r.x + r.w - step.feet.x ? -1 : 1;
}

/**
 * The physics' one-shot this step starts, or null (the latest, if two):
 * - testing the floor: on landing on a window other than the last one (once the landing has played), and before one
 *   stroll on a window in two, the way it goes;
 * - tiptoe: standing on a window within 14 px of an end, once until it is away from it, towards that end;
 * - looking around: on a change of scene.
 * Updates `last`.
 */
export function bodyBeat(step: PhysicsStep, last: BeatMemory, rand: () => number, now: number): Beat | null {
  let beat: Beat | null = null;
  for (const e of step.events) {
    if (e.kind === "landed") {
      const ends = now + LANDING_MS[landingOf(e.height)];
      last.busyUntil = ends;
      if (e.platform !== null && e.platform !== last.platform) {
        last.platform = e.platform;
        beat = { id: "testFloor", start: ends, side: 0 };
      }
    } else if (e.kind === "stroll" && e.phase === "start") {
      if (step.support !== null && rand() < 0.5) beat = { id: "testFloor", start: now, side: step.cues.facing };
    } else if (e.kind === "scene") beat = { id: "sceneLook", start: now, side: 0 };
  }
  if (step.support === null) last.near = false;
  else if (step.state === "riding") {
    if (step.cues.edge < TIPTOE_PX) {
      if (!last.near) {
        last.near = true;
        beat ??= { id: "tiptoe", start: Math.max(now, last.busyUntil ?? -Infinity), side: endOf(step, last.windows) };
      }
    } else if (step.cues.edge >= TIPTOE_PX + 2) last.near = false;
  }
  return beat;
}

/**
 * The quirk on a window this step starts, or null: peeking over the end one stroll in three that ends within 40 px of it
 * (after the little step that ends the stroll), and looking the window over 5–15 s after landing on it (`landedAt`, the
 * touchdown on the rig's clock; `now` without it). The page calls it only while idle.
 */
export function windowQuirk(step: PhysicsStep, landedAt: number | null, rand: () => number, now: number): QuirkCue | null {
  let quirk: QuirkCue | null = null;
  for (const e of step.events) {
    if (e.kind === "stroll" && e.phase === "end" && e.edge !== 0) {
      if (rand() < 1 / 3) quirk = { id: "peekOver", start: now + ARRIVE_MS, side: e.edge, edge: step.cues.edge };
    } else if (e.kind === "landed" && e.platform !== null) {
      quirk = { id: "lookAtWindow", start: (landedAt ?? now) + LOOK_AFTER[0] + rand() * (LOOK_AFTER[1] - LOOK_AFTER[0]), side: 0 };
    }
  }
  return quirk;
}

// ---- the idle director: the quirks every few minutes and the wave to the cursor ------------------------------------------

/** Between two quirks, drawn (ms): only idle, and the clock starts over with any interaction. */
export const QUIRK_EVERY = [240_000, 480_000] as const;
/** The cursor is waved to when it comes back after this long away (ms), and at most once in as long. */
export const WAVE_AFTER = 180_000;

/** Where it is when a quirk comes due: what it can do there. */
export interface IdlePlace {
  /** It stands (or sits) on a window's top. */
  onWindow: boolean;
  /** Sat on the top (the rest): only what it does sitting. */
  seated: boolean;
  /** Room to stroll (on a window, 160 px to walk; never from a rest, which it would walk away from). */
  room: boolean;
  /** An outer edge within 400 px on the floor, where it hides at rest (it comes out there for a quirk and goes back). */
  nearOuterEdge: "left" | "right" | null;
}

export interface IdleDirector {
  /** Someone did something (a click, a drag, a speech): the quirk playing ends and the clock starts over. */
  interact(now: number): void;
  /**
   * The quirk due now, or null: every 4–8 min drawn while idle (not with "do not disturb"), never the same twice in a row,
   * among those that fit where it is. "stroll" is a stroll now; "peekOver" a stroll to the nearer end, then the peek.
   */
  quirk(now: number, place: IdlePlace, o: { idle: boolean; dnd: boolean }): QuirkId | "stroll" | null;
  /** The cursor came within 150 px: true when it should wave (away 3 min or more, and no wave in the last 3 min). */
  cursorNear(now: number): boolean;
  /** The cursor went away (past 150 px, or out of the watch's reach). */
  cursorAway(now: number): void;
}

/** What the clock draws from: the quirks of "Ócio" (the wave is the cursor's, the window's own quirks the physics'). */
const QUIRKS: readonly (QuirkId | "stroll")[] = ["stretch", "yawn", "lookAround", "hop", "knock", "swingLegs", "stroll", "peekOver"];
/** Sat on a window's top it only does what it can do sitting: swinging the legs, a yawn, looking around. */
const SEATED: ReadonlySet<QuirkId | "stroll"> = new Set(["swingLegs", "yawn", "lookAround"]);

/** Whether `id` fits `place`: knocking only on a window, the legs only sitting, strolls and peeks only with room. */
function fits(id: QuirkId | "stroll", place: IdlePlace): boolean {
  if (place.seated) return SEATED.has(id);
  switch (id) {
    case "swingLegs":
      return false;
    case "knock":
      return place.onWindow;
    case "stroll":
      return place.room;
    case "peekOver":
      return place.onWindow && place.room;
    default:
      return true;
  }
}

/**
 * The idle director, its draws from `rand`. The clock is armed by the first idle call and disarmed while it is not idle
 * (or "do not disturb" is on), so a quirk never comes right after work. `every` and `waveAfter` change the intervals (in
 * development, to measure them; the lab at 10×).
 */
export function createIdleDirector(rand: () => number, o: { every?: readonly [number, number]; waveAfter?: number } = {}): IdleDirector {
  const every = o.every ?? QUIRK_EVERY;
  const waveAfter = o.waveAfter ?? WAVE_AFTER;
  let due: number | null = null;
  let last: QuirkId | "stroll" | null = null;
  let awaySince: number | null = null;
  let waved = -Infinity;
  const arm = (now: number) => {
    due = now + every[0] + rand() * (every[1] - every[0]);
  };
  return {
    interact(now) {
      arm(now);
    },
    quirk(now, place, q) {
      if (!q.idle || q.dnd) {
        due = null;
        return null;
      }
      if (due === null) {
        arm(now);
        return null;
      }
      if (now < due) return null;
      arm(now);
      const options = QUIRKS.filter((id) => id !== last && fits(id, place));
      if (!options.length) return null;
      const pick = options[Math.min(options.length - 1, Math.floor(rand() * options.length))]!;
      last = pick;
      return pick;
    },
    cursorNear(now) {
      const away = awaySince;
      awaySince = null;
      if (away === null || now - away < waveAfter || now - waved < waveAfter) return false;
      waved = now;
      return true;
    },
    cursorAway(now) {
      if (awaySince === null) awaySince = now;
    },
  };
}
