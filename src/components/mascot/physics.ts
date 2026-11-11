import type { MascotRect, Platform } from "./types";
import { BOX, FEET, HEADROOM, type Point } from "./layout";
import { covered, goingAway, MARGIN, MIN_SUPPORT, moveOf, PREDICT_MS, sceneChange, supportMotion, validTop, type Sample } from "./platforms";
import { floorAt, nearestWork, outerSides, workUnder } from "./screens";

/**
 * The floating mascot's physics on the screens' floor and on top of their windows, pure: logical screen px, `now` in ms (the
 * rig's clock, the same one `setWindows` is given). It keeps two points apart, the feet (where it is now) and the anchor (the
 * place the person chose: where they last let it go), and moves the feet in fixed steps of 1/60 s, at most 4 a call; the
 * time beyond them is dropped, so a frame that comes minutes late (the Mac waking up) never makes it jump.
 *
 * The states:
 * - `held`: the person has it and the page moves the window; no feet;
 * - `air`: gravity on the vertical only, the air's drag (τ 400 ms) on the horizontal only. It lands on the highest top it
 *   passes between one step and the next that holds it (`validTop`; never the window it slipped from), else on the floor:
 *   `floorAt` of the work area under the feet. The box stops at outer edges, where a throw at 600 px/s or more bumps and
 *   comes back with 35% of its speed; the feet stop `HEADROOM` under the work area's top, and fall. Feet on no screen go to
 *   the nearest work area;
 * - `landed`: still for 450 ms after a landing, then `ground`, or `riding` on a window (which it follows meanwhile);
 * - `ground`: standing on the floor; idle, every 45–120 s drawn, it strolls (`walking`) to within ±160 px (in x) of the
 *   anchor, at least 60 px, at 32 px/s. Farther than that (a fall the person did not cause, a monitor gone, a rest behind
 *   the screen's edge), it walks back in stretches of up to 400 px, 2 s apart. Asked, it strolls now (`strollNow`), walks to
 *   a side of the screen until the box is flush against it (`toEdge`, the rest behind an outer edge) or back home (`home`,
 *   idle or not). None of them moves the anchor; any command stops them where they are. After a change of scene it is
 *   `ground` where it was, over nothing, until a top shows up within 6 px of the feet or a command comes;
 * - `riding`: on a window's top, going along with it: across, the feet trail their place on it by τ 60 ms (never ahead); up
 *   or down they keep on the top (a rising window pushes them, never swallows them), the place guessed up to 50 ms past the
 *   last read. A move carries the feet; a resize
 *   only carries them when it moves the top. Idle on a still window with 160 px to walk, it strolls there, 40 px from its
 *   ends. On a window the anchor goes along with it, when it is on that window;
 * - `teeter`: riding a window moving at 40 px/s or more, its balance; calmer, back to `riding` 250 ms later. From 450 px/s
 *   the stress (despair) fills at speed / 1350 a second; slower, it empties in 700 ms;
 * - `slip`: 180 ms where it was, then `air` without that window. It slips when the stress fills, the window goes faster than
 *   1500 px/s or down faster than 1100 (unless it is going away, below), the feet come within 10 px of its end, or its top
 *   goes within `HEADROOM` of the work area's top;
 * - `pause`: the cartoon pause in the air: 900 ms when the window goes from under the feet (closed, hidden, minimized, or
 *   covered there by another one come to the front), then a slip; 400 ms when the balloon lets it loose over nothing
 *   (`freeze`), then the fall. A window more than 10% off the size it last stood still at (no change for 100 ms, or for 2×
 *   the cadence when that is longer) that moves as fast as a slip between two reads is going away, not carried: a minimize,
 *   whose genie first widens it at the same top, then drops it while it shrinks (`goingAway`);
 *
 * `active` (the loop has steps to run) is false standing, held, frozen and riding a still window with the feet in place.
 *
 * Calm (`setCalm`, reduced motion): there are no steps and nothing in between. On a window the feet are pinned to their
 * place on its top at each read (no lag, no stress, no balance); a window that goes, is covered at the feet or no longer
 * holds them, a drop and a put-down over nothing take the feet straight to where a fall would land (`jumped`, then
 * `landed`); a throw does not fly; no walk of any kind. It is only ever held, standing or riding.
 */

export type PhysicsState = "held" | "ground" | "riding" | "teeter" | "slip" | "pause" | "air" | "landed" | "walking";

/** What the pose turns into continuous movement. */
export interface PhysicsCues {
  /** How far the feet trail their place on the window under them (px, along x: > 0 when the window pulls right); 0 off it. */
  lag: number;
  /** The feet's speed (px/s). */
  speed: number;
  /** The feet's velocity (px/s, y down). */
  vx: number;
  vy: number;
  /** 0–1, keeping up with a fast window (above 0, despair); 0 off it. */
  stress: number;
  /** Where it goes: walking, or flying across faster than 50 px/s; 0 otherwise. */
  facing: -1 | 0 | 1;
  /** In the air, in a pause or a slip, how high above what it would land on the feet are (px); 0 otherwise. */
  height: number;
  /** px walked since this walk began (a step every 14 px); 0 when not walking. */
  walked: number;
  /** px from the feet to the support's nearest end; Infinity on the floor. */
  edge: number;
}

export type PhysicsEvent =
  | { kind: "slipped" }
  | { kind: "landed"; height: number; platform: number | null }
  | { kind: "bumped"; side: "left" | "right"; speed: number }
  | { kind: "stroll"; phase: "start" | "end"; edge: -1 | 0 | 1 }
  | { kind: "scene" }
  | { kind: "anchored"; anchor: Point }
  /** Calm: the feet went straight from `from` to `to`, where they landed, with no fall in between. */
  | { kind: "jumped"; from: Point; to: Point };

export interface PhysicsStep {
  feet: Point | null;
  anchor: Point;
  /** The feet are not where the last step said. */
  moved: boolean;
  active: boolean;
  state: PhysicsState;
  /** The window it stands or walks on (its number), null off every window: the page watches it move. */
  support: number | null;
  cues: PhysicsCues;
  /** What happened since the last step (commands included), oldest first. */
  events: PhysicsEvent[];
}

/** One read of the screen's windows. */
export interface WindowRead {
  /** When it was read, on the page's clock (ms). */
  at: number;
  /** Front to back. */
  windows: Platform[];
  /** The Space changed. */
  scene: boolean;
  /** The list's cadence when it was read (ms). */
  period: number;
}

export interface Physics {
  /** The monitors' work areas (logical px). A change re-checks what it stands on, and stops a walk. */
  setWorks(works: MascotRect[]): void;
  /** A read of the windows. On a window it goes along with it; the window gone, going away (minimized) or covered at the
   * feet, it pauses in the air, slips and falls. A change of scene (marked, or 60% of the windows gone) leaves it where it
   * is (`scene`). Held or frozen, the list is only kept. */
  setWindows(list: WindowRead): void;
  /** Put down at `feet`, the anchor as the page has it (said by no `anchored`): within 6 px of a top that holds it, on it;
   * within 6 px above the floor (or below it) it stands; higher, it falls, not by the person. */
  rest(feet: Point, anchor: Point): void;
  /** The person has it: no feet until `drop` or `rest`. */
  hold(): void;
  /** The person let go at `feet` with `v` (px/s): its landing point becomes the anchor. */
  drop(feet: Point, v: Point): void;
  /** The balloon is open: nothing moves, nor follows a window. Let loose with a top within 6 px of the feet it rides on;
   * over nothing, it pauses 400 ms and falls. */
  freeze(on: boolean): void;
  /** Idle and awake: strolls and the walk back to the anchor are allowed. */
  setIdle(on: boolean): void;
  /**
   * On the floor, walks (at the stroll's pace, in one go) until the box is flush against that side of the work area under
   * the feet: the rest behind an outer edge (the page says which side is one). Already there, nothing. The anchor stays.
   */
  toEdge(side: "left" | "right"): void;
  /** Walks back to within ±160 px of the anchor, in stretches of up to 400 px 2 s apart, idle or not; near it, nothing. */
  home(): void;
  /**
   * A stroll now, standing on the floor or on a still window, if there is room: true if it set off. `toward` (−1 or 1) walks
   * to where it may walk by that end of the window (40 px from it), to peek over it, when that is 60–400 px away.
   */
  strollNow(toward?: -1 | 1): boolean;
  /**
   * Calm (reduced motion) or not. On: a walk stops where it is, a fall (the pause, the slip, the air) is at once where it
   * lands, the balance and the stress are over and the feet on their place on the window. Off: the steps go on from there.
   */
  setCalm(on: boolean): void;
  /** One frame: the fixed steps the time since the last call asks for, at most 4. */
  step(now: number): PhysicsStep;
}

/**
 * - `gravity` (px/s²): 100 px fall in ≈ 0.28 s, 600 px in ≈ 0.68 s; `airTau` (ms): the air's drag on the horizontal speed;
 * - `stepMs`, `maxSteps`: the fixed step and the most a call runs;
 * - `snap` (px): feet this close to a floor or a top stand on it;
 * - `bumpSpeed` (px/s), `rebound`: thrown into an outer edge this fast it bumps and comes back with 35% of its speed;
 * - `landedMs`: still after a landing (the body's landing may last longer); `freezeDropMs`: the pause in the air after the
 *   balloon;
 * - `light`, `tumble` (px): a fall under 60 px is a light landing, over 300 a tumble (the body's);
 * - `strollSpeed` (px/s), `strollStep` (px): the walk, a step every 14 px (the body's); `strollEvery` (ms): between strolls,
 *   drawn; `strollMin` (px): the shortest stroll; `groundReach` (px): it strolls within ±160 px of the anchor;
 *   `backStretch` (px): walking back to it, stretches of up to 400;
 * - on a window: `lagTau` (ms), the feet's lag behind their place on it (200 px/s → 12 px); `still` (px/s), slower than this
 *   the window stands; `despair` (px/s), from here the stress fills, at speed / (`slipNow` × `stressFull` / 1000) a second
 *   (900 ms at 1500 px/s), and below it empties in `stressEmpty` (ms); `slipNow`, `dropDown` (px/s), faster across, or down,
 *   it slips at once; `margin` (px), the room the feet need from its ends; `slipMs`, `vanishMs` (ms), the slip and the pause
 *   in the air when the window goes; `hysteresis` (ms), a calmer pose only after this; `predictMs`, the guess past a read;
 *   `minSupport` (px), the smallest window that holds him; `strollMargin` (px), strolls keep this far from its ends;
 *   `walkable` (px), the least room to walk for a stroll on it.
 */
export const PHYS = {
  gravity: 2600, airTau: 400, stepMs: 1000 / 60, maxSteps: 4, snap: 6, bumpSpeed: 600, rebound: 0.35, landedMs: 450, freezeDropMs: 400,
  light: 60, tumble: 300, strollSpeed: 32, strollStep: 14, strollEvery: [45_000, 120_000], strollMin: 60, groundReach: 160, backStretch: 400,
  lagTau: 60, still: 40, despair: 450, slipNow: 1500, dropDown: 1100, stressFull: 900, stressEmpty: 700, margin: MARGIN, slipMs: 180,
  vanishMs: 900, hysteresis: 250, predictMs: PREDICT_MS, minSupport: MIN_SUPPORT, strollMargin: 40, walkable: 160,
} as const;

/** How far the box reaches to the right of the feet (`FEET.x` to the left). */
const RIGHT = BOX.w - FEET.x;
/** Walking back to the anchor, the rest before each stretch (ms): a tumble gets up and dusts itself off first (1.8 s). */
const BACK_PAUSE_MS = 2000;
/** Slower than this across (px/s), it faces no side in the air. */
const FACING_MIN = 50;
/** Room for the fixed step's rounding (ms). */
const EPS = 1e-6;
/** The stress a second per px/s of the window's speed: full in 900 ms at 1500 px/s. */
const FILL = (PHYS.slipNow * PHYS.stressFull) / 1000;
/** Feet this close (px) to their place on a still window are in it. */
const SETTLE = 0.01;
/** Before the first list, the cadence a read is judged by (ms). */
const FIRST_CADENCE = 125;
/** A support that changes after this long unchanged (ms), or 2× the cadence when that is longer, stood still before it: the
 * size it had then is the one a minimize is told by. */
const STILL_MS = 100;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const sameRects = (a: MascotRect[], b: MascotRect[]) =>
  a.length === b.length && a.every((r, i) => {
    const s = b[i]!;
    return r.x === s.x && r.y === s.y && r.w === s.w && r.h === s.h;
  });

/** Where something following `t0 → t1` (moving linearly over `dt` s) with a lag `tau` (s) is after `dt`, from `f`: exact, so
 * at a steady speed v it trails by v·τ whatever the step. */
const follow = (f: number, t0: number, t1: number, dt: number, tau: number) => {
  const v = (t1 - t0) / dt;
  return t1 - v * tau + (f - t0 + v * tau) * Math.exp(-dt / tau);
};

export function createPhysics(o: { rand: () => number; strollEvery?: readonly [number, number] }): Physics {
  const every = o.strollEvery ?? PHYS.strollEvery;
  let works: MascotRect[] = [];
  let state: PhysicsState = "held";
  /** Null until it is first put down, and while held. */
  let feet: Point | null = null;
  let anchor: Point = { x: 0, y: 0 };
  let vx = 0;
  let vy = 0;
  let frozen = false;
  let idle = false;
  /** This fall is the person letting go: where it lands becomes the anchor. */
  let byPerson = false;
  /** The highest the feet were in this fall (the smallest y): a landing's height is from there. */
  let top = 0;
  /** In `landed`, `pause` and `slip`, how long it has been (ms of fixed steps); how long the pause lasts, and what follows. */
  let phaseMs = 0;
  let pauseMs: number = PHYS.freezeDropMs;
  let pauseThen: "air" | "slip" = "air";
  /** The walk: where it ends (over one or more stretches), where this stretch ends, which way, how far it went. */
  let target: number | null = null;
  let goal = 0;
  let heading: -1 | 1 = 1;
  let walked = 0;
  /** When the next walk starts (the steps' clock), null until armed. */
  let nextWalk: number | null = null;
  /** Walking back to the anchor because it was asked (`home`): the stretches go on even when not idle. */
  let homing = false;
  let last: number | null = null;
  let acc = 0;
  /** The feet the last step gave. */
  let shown: Point | null = null;
  let queue: PhysicsEvent[] = [];
  /** The last list of windows, front to back, and its cadence (ms). */
  let wins: Platform[] = [];
  let listAt = 0;
  let cadence = FIRST_CADENCE;
  /** The window it stands on, its reads since (oldest first, the last few), and where the feet belong on it, in x, at the
   * last read: the window's moves carry that place, its resizes do not. */
  let support: number | null = null;
  let samples: Sample[] = [];
  let spot = 0;
  /** The support's size when it last stood still, and the read where it last changed (the page's clock). */
  let rested = { w: 0, h: 0 };
  let changedAt = 0;
  /** The window the anchor is on: while he stands on it, its moves carry the anchor. */
  let anchorOn: number | null = null;
  /** The window it slipped from, which this fall never lands on. */
  let origin: number | null = null;
  /** After a change of scene: standing where it was, over nothing. */
  let stranded = false;
  /** Riding a still window with the feet in their place: no steps to run. */
  let settled = false;
  let stress = 0;
  /** How long the window has gone slower than `still` (ms): the calmer pose comes after `hysteresis`. */
  let calmMs = 0;
  /** The feet behind their place on the window (px, x), and how far they are from its nearer end. */
  let lag = 0;
  let toEnd = Infinity;
  /** Reduced motion: no steps, the feet straight where they belong. */
  let calm = false;

  /** The states the fixed steps run in; calm, none. */
  const moving = () => !calm && state !== "ground" && state !== "held" && !(state === "riding" && settled);

  /** The span the feet can walk on `work`: the box inside it. */
  const span = (work: MascotRect) => ({ lo: work.x + FEET.x, hi: work.x + work.w - RIGHT });
  const workAt = (p: Point) => workUnder(works, p) ?? nearestWork(works, p);
  /** The support as last read. */
  const rect = () => samples[samples.length - 1]!.rect;

  /**
   * Where `p` is put: on the work area under it, or off every screen on the nearest one. Standing within 6 px above the floor
   * or below it; on a screen, below its floor it stays, and off every screen it stands on the floor. Not standing, never
   * above the ceiling. The box stays inside the outer edges (inside the whole area, off every screen).
   */
  const settle = (p: Point): { at: Point; standing: boolean } | null => {
    const under = workUnder(works, p);
    const work = under ?? nearestWork(works, p);
    if (!work) return null;
    const { lo, hi } = span(work);
    const floor = floorAt(work);
    const standing = p.y >= floor - PHYS.snap;
    let x = p.x;
    if (under) {
      const sides = outerSides(works, work, p.y);
      if (sides.left) x = Math.max(x, lo);
      if (sides.right) x = Math.min(x, hi);
    } else x = clamp(x, lo, hi);
    const y = standing ? (under ? Math.max(p.y, floor) : floor) : Math.max(p.y, work.y + HEADROOM);
    return { at: { x, y }, standing };
  };

  /** The window of the last list whose top holds feet at x with y0 ≤ top ≤ y1, the highest one (never `from`); -1 if none. */
  const topIn = (x: number, y0: number, y1: number, from: number | null): number => {
    let best = -1;
    for (let i = 0; i < wins.length; i += 1) {
      const w = wins[i]!;
      if (w.y < y0 || w.y > y1 || (best >= 0 && w.y >= wins[best]!.y)) continue;
      const work = workAt({ x, y: w.y });
      if (work && validTop(wins, i, x, work, from)) best = i;
    }
    return best;
  };

  const setAnchor = (p: Point) => {
    if (p.x === anchor.x && p.y === anchor.y) return;
    anchor = { x: p.x, y: p.y };
    queue.push({ kind: "anchored", anchor: { ...anchor } });
  };

  /** Stops a walk where it is, and forgets the planned one. */
  const halt = () => {
    if (state === "walking") {
      state = support !== null ? "riding" : "ground";
      vx = 0;
      if (support !== null) {
        spot = feet!.x;
        settled = false;
      }
    }
    walked = 0;
    target = null;
    nextWalk = null;
    homing = false;
  };

  /** On window `i` of the last list, the feet already on its top: it follows it from here. */
  const board = (i: number) => {
    const w = wins[i]!;
    support = w.id;
    samples = [{ at: listAt, rect: { ...w } }];
    rested = { w: w.w, h: w.h };
    changedAt = listAt;
    spot = feet!.x;
    settled = false;
    stress = 0;
    calmMs = 0;
    lag = 0;
    toEnd = Math.min(feet!.x - w.x, w.x + w.w - feet!.x);
    origin = null;
    stranded = false;
  };

  /** Off the window it stood on. */
  const leave = () => {
    support = null;
    samples = [];
    settled = false;
    stress = 0;
    lag = 0;
    toEnd = Infinity;
  };

  /** A top within 6 px of the feet becomes its support. */
  const perch = (): boolean => {
    const at = feet!;
    const i = topIn(at.x, at.y - PHYS.snap, at.y + PHYS.snap, null);
    if (i < 0) return false;
    feet = { x: at.x, y: wins[i]!.y };
    board(i);
    state = "riding";
    return true;
  };

  const land = (platform: number | null) => {
    const at = feet!;
    queue.push({ kind: "landed", height: Math.max(0, at.y - top), platform });
    // Calm: no still moment after it, it stands (or rides) from now.
    state = calm ? (platform !== null ? "riding" : "ground") : "landed";
    phaseMs = 0;
    vx = 0;
    vy = 0;
    origin = null;
    if (platform !== null) board(wins.findIndex((w) => w.id === platform));
    if (byPerson) {
      setAnchor(at);
      anchorOn = platform;
    }
    byPerson = false;
  };

  /** Falls from where it is, not by the person. */
  const fall = () => {
    state = "air";
    vx = 0;
    vy = 0;
    byPerson = false;
    top = feet!.y;
  };

  /** 180 ms where it is, then the fall. */
  const slip = () => {
    state = "slip";
    phaseMs = 0;
    vx = 0;
    vy = 0;
    byPerson = false;
    queue.push({ kind: "slipped" });
  };

  /** Off the window it rides, which the fall leaves out. */
  const slipOff = () => {
    origin = support;
    leave();
    slip();
  };

  /** The window went from under the feet: the cartoon pause, then a slip. */
  const vanish = () => {
    origin = support;
    leave();
    state = "pause";
    phaseMs = 0;
    pauseMs = PHYS.vanishMs;
    pauseThen = "slip";
    vx = 0;
    vy = 0;
    byPerson = false;
  };

  /**
   * Calm: from where the feet are straight to where a fall from there would land, the highest top under them that holds
   * them (never `origin`) or the floor, said by `jumped` when that is farther than 6 px; then landed there. `byPerson` and
   * `origin` are the caller's.
   */
  const jump = () => {
    const at = feet!;
    halt();
    leave();
    stranded = false;
    vx = 0;
    vy = 0;
    const s = settle(at);
    if (!s) {
      // No screens: where it is until they come back.
      state = "ground";
      return;
    }
    let to = s.at;
    let platform: number | null = null;
    if (!s.standing) {
      const floor = floorAt(workAt(to)!);
      const i = topIn(to.x, to.y, floor, origin);
      to = { x: to.x, y: i >= 0 ? wins[i]!.y : floor };
      if (i >= 0) platform = wins[i]!.id;
    }
    top = Math.min(at.y, to.y);
    if (Math.hypot(to.x - at.x, to.y - at.y) > PHYS.snap) queue.push({ kind: "jumped", from: { x: at.x, y: at.y }, to: { x: to.x, y: to.y } });
    feet = to;
    land(platform);
  };

  /**
   * Calm: the feet straight on their place on the window as last read. The box stops at outer edges (its place on the window
   * moves); a top under the floor leaves it on the floor; a top within 174 px of the work area's top, or an end within 10 px
   * of the feet, and it jumps off.
   */
  const pin = () => {
    const r = rect();
    let x = spot;
    let y = r.y;
    const work = workAt({ x, y });
    let over = false;
    if (work) {
      const { lo, hi } = span(work);
      const sides = outerSides(works, work, y);
      const held = sides.left && x < lo ? lo : sides.right && x > hi ? hi : x;
      if (held !== x) {
        x = held;
        spot = x;
      }
      const floor = floorAt(work);
      if (y > floor) {
        feet = { x, y: floor };
        leave();
        state = "ground";
        return;
      }
      over = y < work.y + HEADROOM;
      y = Math.max(y, work.y + HEADROOM);
    }
    feet = { x, y };
    toEnd = Math.min(x - r.x, r.x + r.w - x);
    state = "riding";
    settled = true;
    stress = 0;
    lag = 0;
    calmMs = 0;
    vx = 0;
    vy = 0;
    if (over || toEnd < PHYS.margin) {
      origin = support;
      byPerson = false;
      jump();
    }
  };

  /** On the floor where it is (the walk stopped), or over nothing after a change of scene. */
  const strand = () => {
    halt();
    leave();
    origin = null;
    vx = 0;
    vy = 0;
    byPerson = false;
    state = "ground";
    const work = workUnder(works, feet!);
    stranded = !work || feet!.y < floorAt(work) - PHYS.snap;
  };

  /** Put down at `p` with `v`: by the person, standing there it lands at once. Calm, a throw does not fly: it lands below. */
  const place = (p: Point, thrown: Point, person: boolean) => {
    const v = calm ? { x: 0, y: 0 } : thrown;
    halt();
    leave();
    origin = null;
    stranded = false;
    vx = 0;
    vy = 0;
    byPerson = person;
    const s = settle(p);
    if (!s) {
      // No screens yet: where it was put.
      feet = { x: p.x, y: p.y };
      state = "ground";
      if (person) setAnchor(feet);
      byPerson = false;
      return;
    }
    const i = v.y >= 0 ? topIn(s.at.x, p.y - PHYS.snap, p.y + PHYS.snap, null) : -1;
    if (i >= 0) {
      feet = { x: s.at.x, y: wins[i]!.y };
      top = Math.min(p.y, feet.y);
      if (person) land(wins[i]!.id);
      else {
        board(i);
        state = "riding";
      }
      return;
    }
    feet = s.at;
    top = Math.min(p.y, s.at.y);
    if (s.standing && v.y >= 0) {
      if (person) land(null);
      else state = "ground";
      return;
    }
    if (calm) return jump();
    state = "air";
    vx = v.x;
    vy = v.y;
  };

  /** The box at an outer edge: thrown into it at 600 px/s or more, it bumps and comes back with 35%; slower, it stops. */
  const wall = (side: "left" | "right", edge: number): number => {
    const into = side === "right" ? vx > 0 : vx < 0;
    if (into && Math.abs(vx) >= PHYS.bumpSpeed) {
      queue.push({ kind: "bumped", side, speed: Math.abs(vx) });
      vx = -vx * PHYS.rebound;
    } else if (into) vx = 0;
    return edge;
  };

  /** One fixed step in the air: exact for constant gravity and for the drag, so the frame rate never shows. */
  const fly = (dt: number) => {
    const at = feet!;
    const work = workUnder(works, at) ?? nearestWork(works, at);
    if (!work) {
      // The screens are gone: it stays where it is until they come back.
      state = "ground";
      vx = 0;
      vy = 0;
      return;
    }
    const sides = outerSides(works, work, at.y);
    const { lo, hi } = span(work);
    const decay = Math.exp((-dt * 1000) / PHYS.airTau);
    let x = at.x + (vx * PHYS.airTau * (1 - decay)) / 1000;
    vx *= decay;
    if (sides.right && x > hi) x = wall("right", hi);
    else if (sides.left && x < lo) x = wall("left", lo);
    let y = at.y + vy * dt + (PHYS.gravity * dt * dt) / 2;
    vy += PHYS.gravity * dt;
    // The floor and the ceiling of the screen it is over now, found at the height it came from (a fast fall may pass the
    // bottom of the screen in one step).
    const over = workUnder(works, { x, y: at.y }) ?? nearestWork(works, { x, y: at.y }) ?? work;
    const ceiling = over.y + HEADROOM;
    if (y < ceiling) {
      y = ceiling;
      vy = Math.max(vy, 0);
    }
    top = Math.min(top, y);
    const floor = floorAt(over);
    // Falling, the highest top it passed in this step (however fast, it never goes through one).
    const i = y > at.y ? topIn(x, at.y, Math.min(y, floor), origin) : -1;
    if (i >= 0) {
      feet = { x, y: wins[i]!.y };
      land(wins[i]!.id);
      return;
    }
    feet = { x, y: Math.min(y, floor) };
    if (y >= floor) land(null);
  };

  /**
   * One fixed step on the window it stands on, at `at` (the steps' clock): the feet after their place on it, the stress, and
   * whether it slips. Its place is guessed from the reads (`supportMotion`), linear over the step.
   */
  const ride = (dt: number, at: number) => {
    const from = feet!;
    const r = rect();
    const now = supportMotion(samples, at, cadence);
    const speed = Math.hypot(now.vx, now.vy);
    if (speed > PHYS.slipNow || now.vy > PHYS.dropDown) {
      slipOff();
      return;
    }
    const was = supportMotion(samples, at - dt * 1000, cadence);
    const tau = PHYS.lagTau / 1000;
    // Where the feet belong: their place at the last read, carried on by the guess (exactly there when it stands).
    let aim = spot + (now.left - r.x);
    let x = follow(from.x, spot + (was.left - r.x), aim, dt, tau);
    // Up or down, the feet keep on the top: a rising window pushes them up (the knees take it), it never swallows them.
    let y = now.top;
    const work = workAt({ x, y });
    if (work) {
      // The box stops at outer edges, and the window goes on under it: its place on the window moves with it.
      const { lo, hi } = span(work);
      const sides = outerSides(works, work, y);
      const held = sides.left && x < lo ? lo : sides.right && x > hi ? hi : x;
      if (held !== x) {
        x = held;
        spot = x - (now.left - r.x);
        aim = x;
      }
      // A top under the floor leaves it on the floor; one over the ceiling slips it (below), the box inside the work area.
      const floor = floorAt(work);
      if (now.top > floor) {
        feet = { x, y: floor };
        leave();
        state = "ground";
        vx = 0;
        vy = 0;
        return;
      }
      y = Math.max(y, work.y + HEADROOM);
    }
    vx = (x - from.x) / dt;
    vy = (y - from.y) / dt;
    feet = { x, y };
    lag = aim - x;
    toEnd = Math.min(x - now.left, now.left + r.w - x);
    stress = speed >= PHYS.despair ? Math.min(1, stress + (speed * dt) / FILL) : Math.max(0, stress - (dt * 1000) / PHYS.stressEmpty);
    if (toEnd < PHYS.margin || stress >= 1 || (work && now.top < work.y + HEADROOM)) {
      slipOff();
      return;
    }
    if (state === "riding" || state === "teeter") {
      if (speed >= PHYS.still) {
        state = "teeter";
        calmMs = 0;
      } else {
        calmMs += dt * 1000;
        if (calmMs >= PHYS.hysteresis - EPS) state = "riding";
      }
    }
    if (state === "riding" && speed === 0 && stress === 0 && Math.abs(aim - x) < SETTLE && Math.abs(now.top - y) < SETTLE) {
      feet = { x: aim, y: now.top };
      settled = true;
      vx = 0;
      vy = 0;
      lag = 0;
    }
  };

  /** One fixed step of a walk: 32 px/s towards this stretch's end. */
  const walk = (dt: number) => {
    const at = feet!;
    const stride = PHYS.strollSpeed * dt;
    const x = Math.abs(goal - at.x) <= stride ? goal : at.x + heading * stride;
    walked += Math.abs(x - at.x);
    feet = { x, y: at.y };
    vx = heading * PHYS.strollSpeed;
    if (support !== null) {
      const r = rect();
      spot = x;
      toEnd = Math.min(x - r.x, r.x + r.w - x);
    }
    if (x !== goal) return;
    queue.push({ kind: "stroll", phase: "end", edge: brink(x) });
    if (goal === target) target = null;
    state = support !== null ? "riding" : "ground";
    settled = false;
    vx = 0;
    walked = 0;
    nextWalk = null;
  };

  /** One fixed step of 1/60 s, at `at` on the steps' clock. */
  const tick = (dt: number, at: number) => {
    switch (state) {
      case "air":
        fly(dt);
        break;
      case "landed":
        if (support !== null) ride(dt, at);
        if (state !== "landed") break;
        phaseMs += PHYS.stepMs;
        if (phaseMs >= PHYS.landedMs - EPS) state = support !== null ? "riding" : "ground";
        break;
      case "riding":
      case "teeter":
        ride(dt, at);
        break;
      case "slip":
        phaseMs += PHYS.stepMs;
        if (phaseMs >= PHYS.slipMs - EPS) fall();
        break;
      case "pause":
        phaseMs += PHYS.stepMs;
        if (phaseMs >= pauseMs - EPS) {
          if (pauseThen === "slip") slip();
          else fall();
        }
        break;
      case "walking":
        walk(dt);
        break;
      default:
        // Held and standing nothing moves.
        break;
    }
  };

  /** Where it may walk: on the floor, the box inside the work area under it; on a window, also 40 px from its ends, and
   * only with 160 px of it; null over nothing or with no room. */
  const walkSpan = (): { lo: number; hi: number } | null => {
    if (stranded || !feet) return null;
    const work = workUnder(works, feet);
    if (!work) return null;
    const s = span(work);
    if (support === null) return s;
    const r = rect();
    const lo = Math.max(s.lo, r.x + PHYS.strollMargin);
    const hi = Math.min(s.hi, r.x + r.w - PHYS.strollMargin);
    return hi - lo >= PHYS.walkable ? { lo, hi } : null;
  };

  /** At the end of a walk on a window: -1 or 1 when it ends within 40 px of where it may walk by that end of the window
   * (where peeking over the edge fits), 0 otherwise and on the floor. */
  const brink = (x: number): -1 | 0 | 1 => {
    const s = support !== null ? walkSpan() : null;
    if (!s) return 0;
    const r = rect();
    if (s.lo === r.x + PHYS.strollMargin && x - s.lo < PHYS.strollMargin) return -1;
    if (s.hi === r.x + r.w - PHYS.strollMargin && s.hi - x < PHYS.strollMargin) return 1;
    return 0;
  };

  /** Where the walks gather: the anchor's x, inside where it may walk. */
  const home = (s: { lo: number; hi: number }) => clamp(anchor.x, s.lo, s.hi);

  /** Farther than ±160 px from the anchor: it walks back. */
  const far = (): boolean => {
    const s = walkSpan();
    return s !== null && Math.abs(feet!.x - home(s)) > PHYS.groundReach;
  };

  /** A walk's end, drawn: within ±160 px of the anchor, inside `s`, at least 60 px from `fx`; null if there is none. */
  const pick = (fx: number, s: { lo: number; hi: number }): number | null => {
    const c = home(s);
    const a = Math.max(s.lo, c - PHYS.groundReach);
    const b = Math.min(s.hi, c + PHYS.groundReach);
    const below = Math.max(0, Math.min(b, fx - PHYS.strollMin) - a);
    const above = Math.max(0, b - Math.max(a, fx + PHYS.strollMin));
    if (below + above <= 0) return null;
    const u = o.rand() * (below + above);
    return u < below ? a + u : Math.max(a, fx + PHYS.strollMin) + (u - below);
  };

  /** Sets off now, in one go, to `x` (on what it stands on), the walk's end: a stroll to an end, or to the screen's side. */
  const walkTo = (x: number) => {
    target = x;
    goal = x;
    heading = x > feet!.x ? 1 : -1;
    walked = 0;
    state = "walking";
    queue.push({ kind: "stroll", phase: "start", edge: 0 });
  };

  /** Standing still on the floor (not stranded) or on a still window with the feet in place: where a walk may start. */
  const still = () => (state === "ground" && !stranded) || (state === "riding" && settled);

  /** Starts the next walk, or the next stretch of one: the distance left split evenly into stretches of up to 400 px. */
  const startWalk = () => {
    const at = feet!;
    const s = walkSpan();
    if (!s) return;
    target ??= pick(at.x, s);
    if (target === null) return;
    const left = target - at.x;
    const stretches = Math.ceil(Math.abs(left) / PHYS.backStretch);
    if (stretches === 0) {
      target = null;
      return;
    }
    goal = stretches === 1 ? target : at.x + left / stretches;
    heading = left > 0 ? 1 : -1;
    walked = 0;
    state = "walking";
    queue.push({ kind: "stroll", phase: "start", edge: 0 });
  };

  /** Standing and idle (on the floor, or on a still window with the feet in place): arms the next walk (soon when there is
   * more to walk or it is far, else a stroll in 45–120 s), and starts it when due. */
  const schedule = (now: number) => {
    if (homing && target === null && !far()) homing = false;
    if (calm || !still() || !(idle || homing) || frozen || !feet) {
      nextWalk = null;
      return;
    }
    if (nextWalk === null) {
      nextWalk = now + (target !== null || far() ? BACK_PAUSE_MS : every[0] + o.rand() * (every[1] - every[0]));
      return;
    }
    if (now < nextWalk) return;
    nextWalk = null;
    startWalk();
  };

  const cues = (): PhysicsCues => {
    const walking = state === "walking";
    const facing: -1 | 0 | 1 = walking ? heading : state === "air" && Math.abs(vx) >= FACING_MIN ? (vx > 0 ? 1 : -1) : 0;
    let height = 0;
    if (feet && (state === "air" || state === "pause" || state === "slip")) {
      const work = workAt(feet);
      if (work) {
        const floor = floorAt(work);
        const i = topIn(feet.x, feet.y, floor, origin);
        height = Math.max(0, (i >= 0 ? wins[i]!.y : floor) - feet.y);
      }
    }
    const on = support !== null;
    return { lag: on ? lag : 0, speed: Math.hypot(vx, vy), vx, vy, stress, facing, height, walked: walking ? walked : 0, edge: on ? toEnd : Infinity };
  };

  return {
    setWorks(list) {
      const changed = !sameRects(works, list);
      works = list.map((r) => ({ ...r }));
      if (!changed || frozen || !feet) return;
      if (support !== null) {
        // The window still holds it; the next step clamps the box to the new edges (calm: now).
        halt();
        settled = false;
        if (calm) pin();
        return;
      }
      if (stranded || (state !== "ground" && state !== "walking" && state !== "landed")) return;
      halt();
      const s = settle(feet);
      if (!s) return;
      feet = s.at;
      if (s.standing) return;
      if (!calm) return fall();
      byPerson = false;
      jump();
    },
    setWindows(l) {
      const before = wins;
      wins = l.windows.map((w) => ({ ...w }));
      listAt = l.at;
      cadence = l.period;
      if (!feet || state === "held" || frozen) return;
      if (l.scene || sceneChange(before, wins)) {
        // Another scene: no pause, no fall. Where it is, unless a top is right under the feet.
        strand();
        queue.push({ kind: "scene" });
        perch();
        return;
      }
      if (stranded) {
        perch();
        return;
      }
      if (support === null) return;
      const i = wins.findIndex((w) => w.id === support);
      const w = wins[i];
      const prev = samples[samples.length - 1]!;
      const was = prev.rect;
      const changed = w !== undefined && (w.x !== was.x || w.y !== was.y || w.w !== was.w || w.h !== was.h);
      // Changed after standing still: the size it had until now is the one it stood at.
      if (changed && l.at - changedAt >= Math.max(STILL_MS, 2 * cadence)) rested = { w: was.w, h: was.h };
      // Gone, covered at the feet, or going away (minimized): the window goes from under the feet.
      if (!w || covered(wins, i, feet.x) || goingAway(prev, { at: l.at, rect: w }, rested, PHYS.slipNow, PHYS.dropDown)) {
        halt();
        if (!calm) return vanish();
        // Calm: no pause in the air, no slip, no fall; straight to where it lands.
        origin = support;
        byPerson = false;
        jump();
        return;
      }
      if (changed) {
        // It moved or was resized: a stroll stops at once; its moves carry the feet's place, and the anchor if it is there.
        changedAt = l.at;
        halt();
        const m = moveOf(was, w);
        spot += m.dx;
        if (anchorOn === support) setAnchor({ x: anchor.x + m.dx, y: anchor.y + w.y - was.y });
        settled = false;
      }
      samples.push({ at: l.at, rect: { ...w } });
      if (samples.length > 3) samples.shift();
      // Calm: each read puts the feet straight on their place on it.
      if (calm) pin();
    },
    rest(p, a) {
      anchor = { x: a.x, y: a.y };
      place(p, { x: 0, y: 0 }, false);
      const r = support !== null ? rect() : null;
      anchorOn = r && Math.abs(a.y - r.y) <= PHYS.snap && a.x >= r.x && a.x <= r.x + r.w ? support : null;
    },
    hold() {
      halt();
      leave();
      origin = null;
      stranded = false;
      state = "held";
      feet = null;
      vx = 0;
      vy = 0;
      byPerson = false;
    },
    drop(p, v) {
      place(p, v, true);
    },
    freeze(on) {
      if (on === frozen) return;
      frozen = on;
      vx = 0;
      vy = 0;
      if (on) {
        halt();
        if (state === "landed" || state === "teeter") state = support !== null ? "riding" : "ground";
        stress = 0;
        lag = 0;
        return;
      }
      if (!feet || state === "held") return;
      origin = null;
      if (support !== null) {
        // Its window still under the feet (±6 px): on it again from here.
        const i = wins.findIndex((w) => w.id === support);
        leave();
        const w = wins[i];
        const work = w ? workAt({ x: feet.x, y: w.y }) : null;
        if (w && work && Math.abs(w.y - feet.y) <= PHYS.snap && validTop(wins, i, feet.x, work, null)) {
          feet = { x: feet.x, y: w.y };
          board(i);
          state = "riding";
          return;
        }
      }
      if (perch()) return;
      stranded = false;
      const s = settle(feet);
      if (!s) return;
      feet = s.at;
      if (s.standing) {
        state = "ground";
        return;
      }
      byPerson = false;
      if (calm) return jump();
      state = "pause";
      phaseMs = 0;
      pauseMs = PHYS.freezeDropMs;
      pauseThen = "air";
    },
    setIdle(on) {
      if (on === idle) return;
      idle = on;
      halt();
    },
    toEdge(side) {
      if (calm || !feet || frozen || stranded || support !== null) return;
      if (state === "walking") halt();
      if (state !== "ground") return;
      const work = workUnder(works, feet);
      if (!work) return;
      const s = span(work);
      const x = side === "left" ? s.lo : s.hi;
      halt();
      if (Math.abs(x - feet.x) < SETTLE) return;
      walkTo(x);
    },
    home() {
      if (calm || !feet || frozen) return;
      if (state === "walking") halt();
      if (!still() || !far()) return;
      halt();
      homing = true;
      startWalk();
    },
    strollNow(toward) {
      if (calm || !feet || frozen) return false;
      if (state === "walking") halt();
      const s = still() ? walkSpan() : null;
      if (!s) return false;
      halt();
      if (toward) {
        const end = toward < 0 ? s.lo : s.hi;
        const d = Math.abs(end - feet.x);
        if (d < PHYS.strollMin || d > PHYS.backStretch) return false;
        walkTo(end);
        return true;
      }
      startWalk();
      return state === "walking";
    },
    setCalm(on) {
      if (on === calm) return;
      calm = on;
      acc = 0;
      if (!on) {
        // The steps again: on a window it follows it from here.
        settled = false;
        return;
      }
      halt();
      if (!feet || state === "held" || frozen) return;
      vx = 0;
      vy = 0;
      if (state === "air" || state === "pause" || state === "slip") jump();
      else if (support !== null) pin();
      else if (state === "landed") state = "ground";
    },
    step(now) {
      const dt = last === null ? 0 : Math.max(0, now - last);
      last = now;
      if (feet && !frozen && moving()) {
        acc += dt;
        let n = Math.floor((acc + EPS) / PHYS.stepMs);
        if (n > PHYS.maxSteps) {
          n = PHYS.maxSteps;
          acc = 0;
        } else acc = Math.max(0, acc - n * PHYS.stepMs);
        for (let k = 0; k < n; k += 1) tick(PHYS.stepMs / 1000, now - acc - (n - 1 - k) * PHYS.stepMs);
      } else acc = 0;
      schedule(now);
      const out = feet ? { x: feet.x, y: feet.y } : null;
      const moved = out !== null && (shown === null || shown.x !== out.x || shown.y !== out.y);
      shown = out;
      const events = queue;
      queue = [];
      return { feet: out, anchor: { ...anchor }, moved, active: out !== null && !frozen && moving(), state, support, cues: cues(), events };
    },
  };
}
