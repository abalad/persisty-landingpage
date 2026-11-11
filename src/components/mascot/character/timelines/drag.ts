import type { BumpCue, DragCue } from "../cues";
import type { Draft, V2 } from "../pose";
import { HANG, arm, clamp, foot, keys, lerp, ramp, span, wave } from "./curves";

/**
 * Held by the pointer, and the bump into the screen's side (the spec's "Arrasto"), as timelines on the rig's clock. The
 * drag layer (A) claims every channel it names; while hanging or flying it leaves the marks to the mood (none while
 * someone asks: the page's badge says it). The startle's "!" gives way to the badge too (the director).
 */

/** The startle's stretch and how hard and how long the antenna fires (rad, ms). */
const STARTLE = { squash: 1.06, kick: 0.7, kickMs: 90, jolt: 0.03 } as const;
/**
 * Hanging from the head: the body swings `gain` rad per px/s² of the pointer's acceleration, the other way, up to `most`;
 * the antenna lags by `whip` per px/s²; the head keeps a little more upright than the body (`level`).
 */
const HANGING = { gain: 1e-4, most: 0.6, whip: 5e-5, whipMost: 0.4, level: 0.4, squash: 1.03, up: 1.1 } as const;
/** Flying sideways: 3/4 turned to where it goes, leaning forward, the face turned back a little towards the person. */
const FLIGHT = { yaw: 1.1, lean: 0.35, face: 0.45, kick: -0.5 } as const;

const EYES_ON_YOU: V2 = [0, 0];

/** The pose while held: the startle, hanging, pulled up or flying. */
export function dragPose(cue: DragCue, now: number): Draft {
  const e = Math.max(0, now - cue.since);
  switch (cue.phase) {
    case "startle":
      return startle(e);
    case "hang":
      return hanging(cue, e, HANGING.squash);
    case "up":
      return hanging(cue, e, HANGING.up);
    case "flight":
      return flight(cue, e);
  }
}

/**
 * Grabbed: brows up and eyes wide at once, the "!", a jolt up, stretched (1.06), legs tucked, arms flung up with the hands
 * open, mouth in an "o"; the antenna fires and whips; the head snaps back 80 ms in.
 */
function startle(e: number): Draft {
  const fire = STARTLE.kick * Math.exp(-e / STARTLE.kickMs);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: 0.22 + STARTLE.jolt, lean: [-0.05, 0], pivot: "head" },
    squash: [STARTLE.squash, 1],
    legL: HANG,
    legR: HANG,
    armL: arm(0.2, 0, 1.7, 0.35, -0.3, 0, 0),
    armR: arm(0.2, 0, 1.7, 0.35, -0.3, 0, 0),
    head: [-0.12 * ramp(e, 80, 160), 0, 0],
    gaze: EYES_ON_YOU,
    lids: [0, 0],
    brows: [0.9, 0.1],
    mouth: [0, 0.5],
    blush: 0,
    eyes: "normal",
    mark: "!",
    stars: null,
    antennaKick: [-fire, 0.3 * fire],
  };
}

/**
 * Hanging from the head: the body swings under it (the animator's 1.6 Hz pendulum), driven by the pointer's acceleration;
 * the legs hang loose behind; the arms dangle a little forward; an unimpressed look at the camera, the upper lid at 0.3.
 * Pulled up, the same, stretched to 1.1.
 */
function hanging(cue: DragCue, e: number, stretch: number): Draft {
  const swing = clamp(-cue.ax * HANGING.gain, -HANGING.most, HANGING.most);
  const whip = clamp(cue.ax * HANGING.whip, -HANGING.whipMost, HANGING.whipMost);
  // From the startle's open arms down to a dangle, over the first 300 ms.
  const settle = ramp(e, 0, 300);
  const raise = 0.3 + 1.2 * (1 - settle);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: 0.22, lean: [0.04, swing], pivot: "head" },
    squash: [stretch, 1],
    legL: HANG,
    legR: HANG,
    armL: arm(0.25, 0, raise, 0.35, 0.2, 0, 0.1),
    armR: arm(0.25, 0, raise, 0.35, 0.2, 0, 0.1),
    head: [-0.05, 0, -HANGING.level * swing],
    gaze: EYES_ON_YOU,
    lids: [0.3, 0],
    brows: [-0.15, -0.25],
    mouth: [-0.15, 0],
    blush: 0,
    eyes: "normal",
    antennaKick: [0, whip],
  };
}

/**
 * Flying sideways: turned 3/4 to where it goes and leaning forward, the head up and turned back a little towards the
 * person; one arm stretched ahead in a fist, the other trailing; the legs hang behind; the antenna bent back; eyes half
 * shut against the wind, a determined little smile. The arm ahead is the far one: turned 3/4, the near arm reaching
 * forward only crosses the belly, while the far one's fist shows past the front of the body and the near one past its back.
 */
function flight(cue: DragCue, e: number): Draft {
  const f = cue.facing;
  // Straight ahead (the raise takes the rest pose's splay back, or the arm points at the camera) and straight behind.
  const ahead = arm(1.9, 0, -0.22, 0.05, 0, 0, 1);
  const behind = arm(-0.9, 0, 0.05, 0.2, 0.2, 0, 0.4);
  const flutter = 0.03 * wave(e, 3.1);
  return {
    root: { x: 0, yaw: FLIGHT.yaw * f },
    pelvis: { y: 0.22, lean: [FLIGHT.lean, 0], pivot: "head" },
    squash: [1.02, 0.97],
    legL: HANG,
    legR: HANG,
    // Turned to the right (+1), the character's left arm (side 0) is the far one.
    armL: f === 1 ? ahead : behind,
    armR: f === 1 ? behind : ahead,
    head: [-0.25, -FLIGHT.face * f, 0],
    gaze: [0.01 * f, 0],
    lids: [0.45, 0.15],
    brows: [-0.3, -0.3],
    mouth: [0.3, 0],
    blush: 0,
    eyes: "normal",
    antennaKick: [FLIGHT.kick + flutter, 0],
  };
}

// ---- the bump -----------------------------------------------------------------------------------------------------------

/** The bump's phases, from its start (ms): the impact, the rebound, the dizziness and the recovery. */
export const BUMP_MS = { impact: 140, rebound: 490, dizzy: 2490, end: 2840 } as const;

/**
 * The impact: the body goes to the box's side and flattens against it (squashX 0.78). The root's spring (3 Hz, ζ 0.3)
 * is slow for a hit, so its target leads: `throw` for the first `lead` ms, then `reach`, which with its overshoot and the
 * lean into the wall puts the side of the head at the box's edge about 80 ms in. `flat` then `flatter`: the squash's
 * spring gets about two thirds of the way in 140 ms, so its target goes past 0.78 to show it. The X eyes stay `daze` ms
 * into the rebound, while the body is still at the wall. The rebound: thrown, it bounces off past the middle (35% of
 * `speed`, up to `most`). The dizziness: 5° around the feet at 1.5 Hz, drifting ±3 px and bobbing 3%, three stars
 * orbiting; in over 150 ms, settling over its last 500. The recovery: a head shake at 12 Hz that dies away, and a hard blink.
 */
const BUMP = {
  throw: 0.6, lead: 50, reach: 0.3, flat: 0.78, flatter: 0.62, daze: 220, rebound: { share: 0.35, gain: 1 / 4000, most: 0.22 },
  dizzy: { lean: (5 * Math.PI) / 180, hz: 1.5, drift: 0.03, bob: 0.03, in: 150, settle: 500 },
  shake: { hz: 12, turn: 0.45, decay: 110 },
} as const;

/** The bump `now` (the rig's clock), or null before it and once it is over. */
export function bump(cue: BumpCue, now: number): Draft | null {
  const e = now - cue.start;
  if (!(e >= 0) || e >= BUMP_MS.end) return null;
  const dir = cue.side === "right" ? 1 : -1;
  if (e < BUMP_MS.impact) return impact(dir, e);
  if (e < BUMP_MS.rebound) return rebound(cue, dir, e);
  if (e < BUMP_MS.dizzy) return dizzy(cue, dir, e);
  return recovery(e);
}

/** Flat against the wall: X eyes, an "ouch" mouth, arms flung, legs off the floor, the antenna whipping on into the wall. */
function impact(dir: number, e: number): Draft {
  const k = 1 - e / BUMP_MS.impact;
  return {
    root: { x: keys(e, [[0, BUMP.throw], [BUMP.lead, BUMP.throw], [BUMP.lead + 30, BUMP.reach]]) * dir, yaw: 0 },
    pelvis: { y: 0.22, lean: [0, -0.1 * dir], pivot: "feet" },
    squash: [1, keys(e, [[0, BUMP.flat], [40, BUMP.flatter], [BUMP_MS.impact, 0.68]])],
    legL: HANG,
    legR: HANG,
    armL: arm(0.1, 0, 1.4, 0.3, 0, 0, 0),
    armR: arm(0.1, 0, 1.4, 0.3, 0, 0, 0),
    head: [-0.06, 0, -0.18 * dir],
    gaze: EYES_ON_YOU,
    lids: [0, 0],
    brows: [0.7, 0.3],
    mouth: [-0.3, 0.4],
    blush: 0,
    eyes: "x",
    stars: null,
    antennaKick: [0, -0.6 * dir * (0.4 + 0.6 * k)],
  };
}

/** Off the wall on the root's spring (past the middle if it was thrown), the body springing back to round, dazed. */
function rebound(cue: BumpCue, dir: number, e: number): Draft {
  const k = (e - BUMP_MS.impact) / (BUMP_MS.rebound - BUMP_MS.impact);
  const away = cue.thrown ? Math.min(BUMP.rebound.most, cue.speed * BUMP.rebound.share * BUMP.rebound.gain) : 0;
  return {
    root: { x: -away * dir, yaw: 0 },
    pelvis: { y: 0.22, lean: [0, 0.08 * dir * (1 - k)], pivot: "feet" },
    squash: [0.94 + 0.06 * k, 1.06 - 0.06 * k],
    legL: k < 0.5 ? HANG : foot(0),
    legR: k < 0.5 ? HANG : foot(1),
    armL: arm(0, 0, 0.6, 0.4, 0, 0, 0),
    armR: arm(0, 0, 0.6, 0.4, 0, 0, 0),
    head: [0.05, 0, 0.12 * dir],
    gaze: EYES_ON_YOU,
    lids: [0.35, 0],
    brows: [0.1, 0.5],
    mouth: [-0.2, 0.15],
    blush: 0,
    eyes: e < BUMP.daze ? "x" : "normal",
    stars: null,
    antennaKick: [0, 0],
  };
}

/** Dizzy: round and round on its feet, the head lolling ahead of the body, spiral eyes, three stars orbiting. */
function dizzy(cue: BumpCue, dir: number, e: number): Draft {
  const d = e - BUMP_MS.rebound;
  const amount = ramp(d, 0, BUMP.dizzy.in) * (1 - ramp(e, BUMP_MS.dizzy - BUMP.dizzy.settle, BUMP_MS.dizzy));
  const a = (d / 1000) * BUMP.dizzy.hz * 2 * Math.PI * dir;
  const lean = BUMP.dizzy.lean * amount;
  return {
    root: { x: BUMP.dizzy.drift * amount * Math.sin(a * 0.5), yaw: 0 },
    pelvis: { y: 0.22, lean: [lean * Math.sin(a), lean * Math.cos(a)], pivot: "feet" },
    squash: [1 - BUMP.dizzy.bob * amount * (0.5 + 0.5 * Math.cos(2 * a)), 1],
    legL: foot(0),
    legR: foot(1),
    armL: arm(0.1 * Math.sin(a), 0, 0.35 + 0.1 * amount, 0.4),
    armR: arm(-0.1 * Math.sin(a), 0, 0.35 + 0.1 * amount, 0.4),
    head: [0.1 * amount * Math.sin(a + 0.8), 0, 0.14 * amount * Math.cos(a + 0.8)],
    gaze: EYES_ON_YOU,
    lids: [0.2, 0],
    brows: [0.2, 0.55],
    mouth: [-0.25 + 0.3 * Math.sin(a * 0.5), 0.12 + 0.06 * wave(e, 0.8)],
    blush: 0,
    eyes: "spiral",
    stars: { mode: "orbit", since: cue.start + BUMP_MS.rebound },
    antennaKick: [0, 0],
  };
}

/** Shaking it off: the head shakes at 12 Hz, dying away; a hard blink; then itself again. */
function recovery(e: number): Draft {
  const d = e - BUMP_MS.dizzy;
  const shake = BUMP.shake.turn * Math.exp(-d / BUMP.shake.decay) * Math.sin((d / 1000) * BUMP.shake.hz * 2 * Math.PI);
  const squeeze = span(d, 0, 30, 110, 170);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: 0.22, lean: [0, 0], pivot: "feet" },
    squash: [keys(d, [[0, 1], [60, 0.95], [200, 1.02], [350, 1]]), 1],
    legL: foot(0),
    legR: foot(1),
    head: [0, shake, 0],
    gaze: EYES_ON_YOU,
    lids: [squeeze, 0.4 * squeeze],
    brows: [-0.4 * squeeze, 0],
    mouth: [lerp(-0.2, 0.6, ramp(d, 150, 350)), 0],
    blush: 0,
    eyes: "normal",
    stars: null,
    antennaKick: [0, 0.6 * shake],
  };
}

