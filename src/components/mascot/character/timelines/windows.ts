import { PHYS, type PhysicsCues } from "../../physics";
import type { V3 } from "../ik";
import type { Arm, Draft, Leg } from "../pose";
import { breathing } from "./base";
import { ARM_DOWN, arm, clamp, foot, keys, lerp, ramp, reach, smooth, span, wave } from "./curves";

/**
 * The body on the windows (the spec's "Andar junto e cair", "Em pé e andando" and the rest on a window's top), as
 * timelines: pure functions of the physics' cues and of their own clocks (ms). The director decides which of their channels
 * each layer claims (director.ts): the balance and the despair, the slip and the cartoon pause in the air when the window
 * goes are the physics' (F); testing the floor, tiptoe at the end and looking around after a change of scene are its
 * one-shots on a still body (F); looking the window over and peeking over its end are quirks (P); sitting on the top is a
 * rest (B).
 *
 * They follow the spec's principles: the eyes go first, the head 80 ms later, the body after; every move has its
 * anticipation (the weight on the standing foot before the toe taps, a look down before sitting, the realisation before
 * the "!"); what stops goes on (the antenna, the arms on their springs). Feet and hands are in the stage's space (pose.ts):
 * a body that goes towards the end of the window moves its root and its feet together, and comes back where the physics
 * has it. Sides: −1 is the window's left end (−x), 1 its right (+x); facing the camera the character's left (armL, legL)
 * is on the +x side.
 */

/** A calmer pose (despair → balance) takes over only this long after the window calmed down (the physics' hysteresis). */
export const CALMER_AFTER_MS = PHYS.hysteresis;
/** The slip, and the pause in the air when the window goes from under the feet (the physics' own times). */
export const SLIP_MS = PHYS.slipMs;
export const VANISH_MS = PHYS.vanishMs;
/** How long each one-shot of the physics lasts (ms). */
export const BEAT_MS = { testFloor: 800, tiptoe: 1200, sceneLook: 1200 } as const;
/** How long each quirk on a window lasts (ms). */
export const WINDOW_QUIRK_MS = { lookAtWindow: 1500, peekOver: 2500 } as const;

/** The character's side for a window's end: +1 (the right end, +x) is its left (index 0). */
const sideOf = (side: -1 | 1): 0 | 1 => (side === 1 ? 0 : 1);
/** Where the feet stand at rest, and where a hand hangs at rest (model.ts), give or take. */
const FOOT_X = 0.12;
const FOOT_Z = 0.04;
const HAND_REST: V3 = [0.345, 0.25, 0.06];
const planted = (x: number, y = 0, z = FOOT_Z): Leg => ({ kind: "foot", at: [x, y, z] });

// ---- going along with a window: balance and despair --------------------------------------------------------------------

/**
 * - the knees bend (`knees`), the arms open to `raise` with corrections in counter-phase (±`fix` at `fixHz`) and lean
 *   against the body's tilt (`counter` per rad), the hands loose; the body leans against the lag (`perLag` rad a px); the
 *   head turns where the window goes (`look` at `lookPx` px of lag) and the eyes go first (`gaze`); the antenna whips
 *   behind it (`kick` rad a px);
 * - a rising window pushes the knees (squash below 1 at `push` px/s up, at most `squash`), a falling one lightens;
 * - despair, as the stress fills: the arms windmill at `hz`, around `windmill` with ±`circle` up and down and ±`swing`
 *   forward and back a quarter turn apart (a circle), the two in turn; the body sways ±`sway` at `swayHz` (its spring, 2.5 Hz,
 *   passes the target: ±0.16 shows as about ±0.22); the feet scuffle; brows up, mouth in an O, eyes wide; `sweat` drops a
 *   second at full stress.
 * The spec's windmill is ±2.4 ± 0.8; a raised clay arm past ~2.55 puts the forearm through the head (see fall.ts), so the
 * circle's middle is 2.0 and its top 2.5, the forward and back swing carrying the rest of the motion.
 */
const BALANCE = {
  knees: 0.04, raise: 1.3, fix: 0.15, fixHz: 1.2, counter: 1.5, perLag: 0.004, look: 0.3, lookPx: 8, gaze: 0.014, kick: 0.006, twist: 1.2, elbow: 0.45,
  push: 6000, squash: [0.93, 1.04] as const,
  windmill: 2.0, circle: 0.5, swing: 0.7, hz: 4, sway: 0.16, swayHz: 2.5, top: 2.55, sweat: 6, scuffle: 0.025,
} as const;

/**
 * Riding a window that moves (`c` the physics' cues, `now` the rig's clock): balance, turning into despair as the stress
 * fills. Claims the body, the legs, the arms and the sweat; the face only in despair (brows, mouth, lids, gaze); the head
 * and the eyes' look where it goes are for the director to add.
 */
export function balance(c: PhysicsCues, now: number): Draft {
  const k = clamp(c.stress, 0, 1);
  const lean = -c.lag * BALANCE.perLag + BALANCE.sway * k * wave(now, BALANCE.swayHz);
  const p = (now / 1000) * BALANCE.hz * 2 * Math.PI;
  const fix = BALANCE.fix * wave(now, BALANCE.fixHz);
  const toward = Math.tanh(c.lag / BALANCE.lookPx);
  /** One arm: open and correcting (balance), or circling (despair), `q` its phase, `s` +1 left, −1 right. */
  const limb = (q: number, s: 1 | -1): Arm => {
    const calm = BALANCE.raise + s * fix + s * BALANCE.counter * lean * (1 - k);
    const wild = BALANCE.windmill + BALANCE.circle * Math.sin(q);
    // Balancing, the arm turned on itself so the elbow's fold lifts the forearm: an S, the hand loose at the end.
    return arm(
      lerp(0.12, BALANCE.swing * Math.cos(q), k),
      lerp(BALANCE.twist, 0, k),
      Math.min(BALANCE.top, lerp(calm, wild, k)),
      lerp(BALANCE.elbow + s * 0.6 * fix, 0.45 + 0.25 * Math.sin(q - 0.8), k),
      lerp(0.35, 0.4 * Math.sin(q - 1.5), k),
    );
  };
  const scuffle = (q: number) => BALANCE.scuffle * k * Math.max(0, Math.sin(q));
  const d: Draft = {
    root: { x: 0, yaw: 0 },
    pelvis: { y: 0.22 - BALANCE.knees - 0.012 * k, lean: [0.04 + 0.05 * k * wave(now, BALANCE.swayHz, 1.3), lean], pivot: "feet" },
    squash: [clamp(1 + c.vy / BALANCE.push, BALANCE.squash[0], BALANCE.squash[1]), 1],
    chest: { twist: -0.05 * toward + 0.08 * k * wave(now, BALANCE.swayHz, 0.6), breath: 0 },
    legL: foot(0, scuffle(p / 2)),
    legR: foot(1, scuffle(p / 2 + Math.PI)),
    armL: limb(p, 1),
    armR: limb(p + Math.PI, -1),
    head: [0.04 + 0.05 * k * wave(now, 3.1), BALANCE.look * toward + 0.1 * k * wave(now, 1.7), -0.5 * lean],
    gaze: [BALANCE.gaze * toward, -0.004],
    sweat: BALANCE.sweat * k,
    shadow: 1,
    antennaKick: [0.06 * k * Math.sin(p), c.lag * BALANCE.kick + 0.12 * k * Math.sin(0.7 * p)],
  };
  if (k > 0) {
    d.lids = [0, 0];
    d.brows = [0.9 * k, 0.5 * k];
    d.mouth = [lerp(0.6, -0.35, k), 0.75 * k];
    d.gaze = [BALANCE.gaze * toward + 0.008 * k * wave(now, 2.3), 0.004 * k];
  }
  return d;
}

/**
 * The slip (`e` ms into it, `side` the way it goes): a foot escapes, the one on that side, up and out; the body tips that
 * way 0.45 (and back a little), the arms fly forward and up to catch something, the brows up and the mouth an O. Quick and
 * eased out, held at its end: the fall takes over after SLIP_MS.
 */
export function slip(side: -1 | 1, e: number): Draft {
  const k = 1 - (1 - clamp(e / SLIP_MS, 0, 1)) ** 2;
  const out = sideOf(side);
  const legs: [Leg, Leg] = [planted(FOOT_X), planted(-FOOT_X)];
  legs[out] = planted((out === 0 ? FOOT_X : -FOOT_X) + side * 0.1 * k, 0.09 * k, FOOT_Z + 0.06 * k);
  const reachOut = arm(1.3 * k, 0, 0.25 + 0.55 * k, 0.3, 0.2);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: 0.22 - 0.03 * k, lean: [-0.15 * k, -side * 0.45 * k], pivot: "feet" },
    squash: [1 + 0.05 * k, 1],
    chest: { twist: 0, breath: 0 },
    legL: legs[0],
    legR: legs[1],
    armL: reachOut,
    armR: reachOut,
    gaze: [side * 0.01 * k, 0.008 * k],
    lids: [0, 0],
    brows: [0.9 * k, 0.45 * k],
    mouth: [lerp(0.3, -0.2, k), 0.6 * k],
    sweat: 0,
    shadow: 1 - k,
    antennaKick: [-0.3 * k, side * 0.3 * k],
  };
}

/** The cartoon pause: the legs pedal in the void at `hz`, over `pedal`; it looks down (`down` rad), the "!" at `mark`. */
const PAUSE = { hz: 6, pedal: [540, 600] as const, down: 0.5, mark: 550 } as const;

/**
 * The window went from under the feet (`e` ms ago): it stays where it was, in the air, for VANISH_MS. Nothing at first: it
 * has not noticed. The eyes drop, then the head (0.5): nothing there. A beat; then the head snaps up to the camera, brows up,
 * eyes wide, a gulp, a "!" by the head, the hands drawn up to the chest; and the legs pedal in the void at 6 Hz, in turn.
 * Then the slip and the fall. Claims the head too, and the mark.
 */
export function vanishPause(e: number): Draft {
  // Nothing for 120 ms; the eyes drop, the head after them by 330 and held there (nothing under it…) until 520.
  const down = ramp(e, 160, 330) * (1 - ramp(e, 520, 590));
  const seen = ramp(e, 520, 590);
  const eyesDown = ramp(e, 120, 160) * (1 - ramp(e, 500, 540));
  const a = ramp(e, PAUSE.pedal[0], PAUSE.pedal[1]);
  const p = (e / 1000) * PAUSE.hz * 2 * Math.PI;
  /** A foot circling under its hip, `q` its phase. */
  const pedal = (x: number, q: number): Leg => planted(x, a * (0.035 + 0.03 * Math.sin(q)), FOOT_Z + a * 0.05 * Math.cos(q));
  const gulp = arm(0.35 * seen, 0, 0.3 * seen + 0.04 * seen * Math.sin(p * 0.5), 1.25 * seen, 0.3 * seen, 0, 0.4 * seen);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: 0.22, lean: [0.06 * down, 0], pivot: "feet" },
    squash: [1 + 0.04 * span(e, 530, 570, 590, 720), 1],
    chest: { twist: 0, breath: 0.01 * seen },
    legL: pedal(FOOT_X, p),
    legR: pedal(-FOOT_X, p + Math.PI),
    armL: gulp,
    armR: gulp,
    head: [PAUSE.down * down - 0.06 * seen, 0, 0],
    gaze: [0, -0.018 * eyesDown + 0.004 * seen],
    lids: [0, 0],
    brows: [lerp(0.15 * down, 0.85, seen), 0.35 * seen],
    mouth: [lerp(lerp(0.6, 0.1, ramp(e, 250, 420)), -0.3, seen), 0.35 * seen],
    blush: 0,
    eyes: "normal",
    sweat: 0,
    mark: e >= PAUSE.mark ? "!" : null,
    shadow: 1 - ramp(e, 0, 200),
    antennaKick: [-0.25 * span(e, 530, 560, 590, 710), 0],
  };
}

// ---- the one-shots on a still body -----------------------------------------------------------------------------------

/**
 * Testing the floor (`e` ms in, null outside BEAT_MS.testFloor): the eyes go down to the top, the head after them; the
 * weight onto the left foot; the right one slides a little forward and taps the top twice with its toe (180 ms each), then
 * comes back; a firm nod: it holds. Claims the legs, the body, the arms, the gaze and the brows; the nod is added to the
 * head.
 */
export function testFloor(e: number): Draft | null {
  if (!(e >= 0) || e >= BEAT_MS.testFloor) return null;
  const weight = span(e, 0, 140, 560, 700);
  const tap = (a: number) => (e > a && e < a + 180 ? Math.sin((Math.PI * (e - a)) / 180) : 0);
  const forward = span(e, 100, 160, 520, 620);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: 0.22 - 0.008 * weight, lean: [0.04 * weight, -0.03 * weight], pivot: "feet" },
    squash: [1, 1],
    chest: { twist: -0.03 * forward, breath: 0 },
    legL: foot(0),
    legR: foot(1, 0.05 * (tap(150) + tap(345)), -0.015 * forward, 0.07 * forward),
    armL: arm(0.05, 0, 0.18 * weight, 0.25 * weight),
    armR: arm(-0.05, 0, 0.12 * weight, 0.2 * weight),
    gaze: [-0.004 * span(e, 0, 60, 640, 760), -0.016 * span(e, 0, 60, 640, 760)],
    brows: [-0.15 * span(e, 100, 200, 560, 700), -0.2 * span(e, 100, 200, 560, 700)],
    head: [keys(e, [[0, 0], [80, 0], [260, 0.34], [540, 0.34], [600, 0.42], [670, 0.12], [740, 0.2], [800, 0]]), -0.08 * weight, 0.05 * weight],
    shadow: 1,
    antennaKick: [0.08 * span(e, 590, 610, 640, 720), 0],
  };
}

/**
 * On tiptoe at the window's end on `side` (`e` ms in, null outside BEAT_MS.tiptoe): the eyes go down to the edge and the
 * brows up; it sways out over it, on its outer foot, the other leg up; the arms windmill for 0.6 s; it throws its weight
 * back with a step away from the edge, lets its breath out and stands where it stood. Claims the body, the legs, the arms,
 * the gaze, the brows and the mouth; the head's look down at the edge is added.
 */
export function tiptoe(side: -1 | 1, e: number): Draft | null {
  if (!(e >= 0) || e >= BEAT_MS.tiptoe) return null;
  const outer = sideOf(side);
  const out = span(e, 80, 300, 760, 1000);
  const lift = span(e, 120, 260, 740, 880);
  const back = span(e, 760, 900, 980, 1150);
  const w = span(e, 120, 220, 680, 800);
  const q = ((e - 150) / 1000) * 3.2 * 2 * Math.PI;
  const windmill = (phase: number): Arm => arm(0.8 * w * Math.cos(q + phase), 0, 0.15 + 1.35 * w + 0.6 * w * Math.sin(q + phase), 0.3 + 0.2 * w, 0.2 * w);
  const legs: [Leg, Leg] = [planted(FOOT_X), planted(-FOOT_X)];
  const innerX = (outer === 0 ? -FOOT_X : FOOT_X) - side * 0.05 * back;
  legs[1 - outer] = planted(innerX, 0.07 * lift + 0.03 * Math.sin(Math.PI * back), FOOT_Z - 0.04 * lift);
  const wobble = 0.05 * span(e, 200, 300, 700, 800) * wave(e, 3.3);
  return {
    root: { x: side * 0.03 * out - side * 0.02 * back, yaw: 0 },
    pelvis: { y: 0.22 + 0.01 * lift, lean: [0.05 * out, -side * (0.15 * out - 0.05 * back) + wobble], pivot: "feet" },
    squash: [1 + 0.03 * lift - 0.035 * span(e, 950, 1020, 1060, 1180), 1],
    chest: { twist: 0, breath: 0.03 * span(e, 950, 1000, 1050, 1180) },
    legL: legs[0],
    legR: legs[1],
    armL: windmill(0),
    armR: windmill(Math.PI),
    gaze: [side * 0.012 * span(e, 0, 60, 700, 850), -0.014 * span(e, 0, 60, 700, 850)],
    brows: [0.8 * span(e, 0, 80, 900, 1100), 0.35 * span(e, 0, 80, 900, 1100)],
    mouth: [lerp(0.6, -0.1, span(e, 80, 160, 900, 1050)), 0.35 * span(e, 100, 200, 750, 900) + 0.15 * span(e, 950, 1000, 1050, 1150)],
    head: [0.3 * span(e, 60, 200, 600, 800), side * 0.25 * span(e, 60, 200, 700, 900), -side * 0.08 * out],
    shadow: 1,
    antennaKick: [0, side * 0.25 * out + 0.15 * w * Math.sin(q)],
  };
}

/**
 * After a change of scene (`e` ms in, null outside BEAT_MS.sceneLook): where am I? The eyes to one side, the head after
 * them, held; the other side; back to the front. The brows up a little, the chest turning with the head. Claims the gaze
 * and the brows; the turns are added to the head.
 */
export function sceneLook(e: number): Draft | null {
  if (!(e >= 0) || e >= BEAT_MS.sceneLook) return null;
  const turn = keys(e, [[0, 0], [80, 0], [300, -0.42], [480, -0.42], [700, 0.42], [880, 0.42], [1150, 0]]);
  return {
    gaze: [keys(e, [[0, 0], [50, -0.018], [400, -0.018], [450, 0.018], [850, 0.018], [950, 0]]), 0.004 * span(e, 0, 100, 900, 1100)],
    brows: [0.4 * span(e, 0, 100, 950, 1150), 0.15 * span(e, 0, 100, 950, 1150)],
    chest: { twist: 0.12 * turn, breath: 0 },
    head: [-0.04 * span(e, 0, 100, 950, 1150), turn, 0.04 * turn],
    antennaKick: [0, -0.15 * keys(e, [[0, 0], [300, 0.5], [480, 0], [700, -0.5], [880, 0], [1150, 0]])],
  };
}

// ---- the quirks on a window ------------------------------------------------------------------------------------------

/**
 * Looking the window over (`e` ms in, null outside WINDOW_QUIRK_MS.lookAtWindow): it leans in a little, the head goes
 * down 0.45 and cocks, the eyes sweep the top from one end to the other, the brows go up (the spec's one raised brow: the
 * brows rise together, the head's cock makes it a question), a thoughtful "hm"; then back.
 */
export function lookAtWindow(e: number): Draft | null {
  if (!(e >= 0) || e >= WINDOW_QUIRK_MS.lookAtWindow) return null;
  const down = span(e, 150, 400, 1200, 1480);
  const sweep = keys(e, [[0, 0], [250, -0.018], [400, -0.018], [1100, 0.018], [1250, 0.018], [1500, 0]]);
  return {
    pelvis: { y: 0.22, lean: [0.05 * down, 0], pivot: "feet" },
    head: [0.45 * down, 6 * sweep * down, 0.12 * down],
    gaze: [sweep, -0.012 * down],
    brows: [0.45 * span(e, 300, 450, 1150, 1400), -0.1 * span(e, 300, 450, 1150, 1400)],
    mouth: [lerp(0.6, 0.2, span(e, 350, 500, 1150, 1400)), 0],
  };
}

/** The peek over the end: how far it goes, how low it crouches, how much it turns, and its hand on the corner. */
const PEEK = { gap: 0.33, most: 0.3, crouch: 0.09, lean: 0.3, yaw: 0.15, hand: 0.035, down: 0.45, turn: 0.05, tilt: 0.35 } as const;

/**
 * Peeking over the end on `side` (`e` ms in, null outside WINDOW_QUIRK_MS.peekOver), the end `edge` px from the feet: the
 * eyes and the head go there first; two little steps to it (the outer foot first); it crouches and leans over it (0.3),
 * turned a little that way, the hand on that side down on the corner and gripping it (IK), the other arm out for balance;
 * it looks down over the edge… then at the camera, brows up, a gulp; it lets go, straightens and steps back to where the
 * physics has it, facing the front. All of it is drawn: the feet on the window stay where they were.
 */
export function peekOver(side: -1 | 1, e: number, edge = 60): Draft | null {
  if (!(e >= 0) || e >= WINDOW_QUIRK_MS.peekOver) return null;
  const near = sideOf(side);
  const corner = (side * edge) / 100;
  const go = side * clamp(edge / 100 - PEEK.gap, 0, PEEK.most);
  // The steps: the outer foot first going, the inner one first coming back.
  const outer = ramp(e, 150, 380) * (1 - ramp(e, 2150, 2380));
  const inner = ramp(e, 330, 560) * (1 - ramp(e, 2000, 2230));
  const stepUp = (k: number) => 0.035 * Math.sin(Math.PI * k);
  const outerK = e < 1000 ? ramp(e, 150, 380) : ramp(e, 2150, 2380);
  const innerK = e < 1000 ? ramp(e, 330, 560) : ramp(e, 2000, 2230);
  const legs: [Leg, Leg] = [planted(FOOT_X), planted(-FOOT_X)];
  const sx = (i: 0 | 1) => (i === 0 ? FOOT_X : -FOOT_X);
  legs[near] = planted(sx(near) + go * outer, stepUp(outerK));
  legs[1 - near] = planted(sx((1 - near) as 0 | 1) + go * inner, stepUp(innerK));
  const there = (outer + inner) / 2;
  const low = span(e, 620, 950, 1950, 2200);
  const turned = span(e, 120, 350, 2050, 2350);
  const down = span(e, 950, 1150, 1450, 1560);
  const seen = span(e, 1500, 1580, 1900, 2050);
  // The hand: from where it hangs down to the corner, held, and back up as it straightens.
  const rest: V3 = [go + side * HAND_REST[0], HAND_REST[1], HAND_REST[2]];
  const onCorner: V3 = [corner, PEEK.hand, 0];
  let hand: Arm;
  if (e >= 650 && e < 2150) {
    const k = e < 1500 ? smooth((e - 650) / 300) : 1 - smooth((e - 1950) / 200);
    hand = reach(lerp(rest[0], onCorner[0], k), lerp(rest[1], onCorner[1], k), lerp(rest[2], onCorner[2], k), 0.85 * (e < 1500 ? ramp(e, 850, 1000) : 1 - ramp(e, 1950, 2100)));
  } else hand = ARM_DOWN;
  const other = arm(0.1 * low, 0, 0.9 * low, 0.4 * low, 0.2 * low);
  const arms: [Arm, Arm] = [ARM_DOWN, ARM_DOWN];
  arms[near] = hand;
  arms[1 - near] = other;
  const eyes = span(e, 0, 60, 1450, 1520);
  return {
    root: { x: go * there, yaw: side * PEEK.yaw * turned },
    pelvis: { y: 0.22 - PEEK.crouch * low, lean: [0.04 * low, -side * PEEK.lean * low], pivot: "feet" },
    squash: [1 - 0.03 * low, 1],
    chest: { twist: 0, breath: 0 },
    legL: legs[0],
    legR: legs[1],
    armL: arms[0],
    armR: arms[1],
    // Down over the edge (the face towards it, never past 3/4), then straight at the camera, upright against the lean.
    head: [
      0.12 * span(e, 80, 250, 600, 900) + PEEK.down * down - 0.05 * seen,
      side * PEEK.turn * span(e, 80, 250, 1450, 1560) - side * PEEK.yaw * turned * seen,
      -side * PEEK.tilt * down + side * PEEK.lean * low * seen,
    ],
    gaze: [side * 0.016 * eyes, -0.01 * eyes - 0.008 * down + 0.004 * seen],
    lids: [0, 0],
    brows: [0.3 * span(e, 900, 1050, 1450, 1520) + 0.8 * seen, 0.3 * seen],
    mouth: [lerp(0.6, -0.15, seen), 0.28 * seen],
    shadow: 1,
    // The antenna trails behind the lean (inwards), so the ball stays in the box.
    antennaKick: [0.1 * low, side * 0.15 * low],
  };
}

// ---- resting on the top ----------------------------------------------------------------------------------------------

/**
 * Sat on the top, as it reads from the front at 200 px (the camera is level, so a bent knee doesn't show by itself): the
 * pelvis `y` above it (the bean's bottom on the window's edge), tilted back `lean` rad; the arms propped out on the top
 * beside the hips (`hand`, wider than the shoulders, so they don't hang as they do standing); the thighs forward and down
 * `thighDown` rad, the knees at the hips' width and the feet together under the belly (`foot` across), a seated diamond
 * no standing pose has; the shins hang in front of the window `rest` rad forward of straight down and swing from
 * the knee ±`swing` rad at `hz`, the two in counter-phase, a kick forward lifting the foot `kick`, so the feet are never
 * level for long. Sitting down and dozing off: the lids grow heavy from `drowsy`, the head nods and the swing slows, by
 * the time the page puts it to sleep (idle.ts REST_SETTLE_MS.sit).
 */
const SIT = {
  y: 0.03, lean: -0.08, hz: 0.5, rest: 0.4, swing: 0.65, kick: 0.05, foot: 0.06, thigh: 0.095, thighDown: 0.6, shin: 0.09,
  ankle: 0.045, hand: [0.35, 0.015, 0.02] as V3, drowsy: [3000, 6800] as const,
} as const;
/** Sat on the top, as the quirks seated and the way up out of the seat need it: the pelvis's height, the left hand on the ledge. */
export const SEAT = { y: SIT.y, hand: SIT.hand } as const;

/**
 * Where a hanging foot is, its shin `phi` rad forward of where it rests (SIT.rest forward of straight down), on the side
 * `s` (+1 the left, +x). The knee is the IK's (it bends towards where the pelvis faces); this is the sole's point.
 */
export function dangling(s: number, phi: number): V3 {
  const knee = [SIT.y - SIT.thigh * Math.sin(SIT.thighDown), SIT.thigh * Math.cos(SIT.thighDown)] as const;
  const shin = SIT.rest + phi;
  return [s * SIT.foot, knee[0] - SIT.shin * Math.cos(shin) - SIT.ankle + SIT.kick * Math.max(0, Math.sin(shin)), knee[1] + SIT.shin * Math.sin(shin)];
}

/**
 * Sitting on the window's top at `now` (the rig's clock), `e` ms since it began to sit (left out: settled and awake): a
 * glance down behind it, then it lowers itself, the legs swinging out over the edge and the hands down on the top; the legs
 * swing slowly in counter-phase; it breathes; with time the eyes close, the head nods and the legs slow.
 */
export function sit(now: number, e?: number): Draft {
  const settled = e === undefined;
  const t = settled ? Infinity : e;
  const lower = settled ? 1 : ramp(t, 150, 750);
  const drowsy = settled ? 0 : ramp(t, SIT.drowsy[0], SIT.drowsy[1]);
  const a = SIT.swing * (1 - 0.75 * drowsy) * (settled ? 1 : ramp(t, 600, 1100));
  const phi = a * wave(now, SIT.hz);
  const feet = [dangling(1, phi), dangling(-1, -phi)] as const;
  const leg = (i: 0 | 1): Leg => {
    const from: V3 = [i === 0 ? FOOT_X : -FOOT_X, 0, FOOT_Z];
    const k = settled ? 1 : smooth((t - 250 - 120 * i) / 500);
    const to = feet[i];
    // On the way, the foot comes forward and up over the edge.
    return { kind: "foot", at: [lerp(from[0], to[0], k), lerp(from[1], to[1], k) + 0.05 * Math.sin(Math.PI * k), lerp(from[2], to[2], k) + 0.04 * Math.sin(Math.PI * k)] };
  };
  const hand = (i: 0 | 1): Arm => {
    const s = i === 0 ? 1 : -1;
    const k = settled ? 1 : smooth((t - 350) / 450);
    const [x, y, z] = SIT.hand;
    return reach(s * lerp(HAND_REST[0], x, k), lerp(HAND_REST[1], y, k), lerp(HAND_REST[2], z, k), 0.4 * k);
  };
  const breath = breathing(now);
  const nod = settled ? 0 : 0.22 * drowsy + 0.12 * span(t, 5400, 5500, 5550, 5800) * -1 + 0.06 * drowsy * wave(now, 0.25);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: {
      y: lerp(0.22, SIT.y, lower) + 0.015 * span(t, 0, 150, 150, 400),
      lean: [lerp(0, SIT.lean, lower) + 0.06 * span(t, 0, 150, 300, 600), 0.012 * wave(now, SIT.hz, 1.2) * lower],
      pivot: "feet",
    },
    squash: [1 - 0.04 * span(t, 600, 750, 800, 1000), 1],
    chest: { twist: 0, breath: breath.chest!.breath },
    legL: leg(0),
    legR: leg(1),
    armL: hand(0),
    armR: hand(1),
    head: [breath.head![0] + 0.25 * span(t, 0, 120, 250, 500) + nod, 0.04 * wave(now, 0.13) * (1 - drowsy), 0.03 * wave(now, SIT.hz, 2.2) * lower + 0.12 * drowsy],
    gaze: [0, -0.012 * span(t, 0, 80, 250, 500) - 0.006 * drowsy],
    lids: [0.65 * drowsy + 0.2 * span(t, 5550, 5650, 5700, 5900), 0],
    // Sleepy, not bored: the brows droop at their ends and the mouth goes slack.
    brows: [0.12 * drowsy, 0.3 * drowsy],
    mouth: [lerp(0.6, 0.15, drowsy), 0.12 * drowsy],
    shadow: 0.7,
  };
}

/** How long getting up from the seat takes (ms): the feet come back up over the edge to stand on the top. */
export const RISE_MS = 380;

/**
 * Getting up from the seat (`e` ms since it stopped sitting, null after RISE_MS): the feet swing back up over the edge and
 * plant on the top (the pelvis rises on its spring), the hands come off the top. Only the legs and the arms: without it the
 * feet would jump from hanging to standing.
 */
export function standUp(e: number): Draft | null {
  if (!(e >= 0) || e >= RISE_MS) return null;
  const leg = (i: 0 | 1): Leg => {
    const k = smooth((e - 60 * i) / (RISE_MS - 80));
    const from = dangling(i === 0 ? 1 : -1, 0);
    return { kind: "foot", at: [lerp(from[0], i === 0 ? FOOT_X : -FOOT_X, k), lerp(from[1], 0, k) + 0.04 * Math.sin(Math.PI * k), lerp(from[2], FOOT_Z, k)] };
  };
  const k = smooth(e / 250);
  const hand = (s: 1 | -1): Arm => reach(s * lerp(SIT.hand[0], HAND_REST[0], k), lerp(SIT.hand[1], HAND_REST[1], k), lerp(SIT.hand[2], HAND_REST[2], k), 0.4 * (1 - k));
  return { legL: leg(0), legR: leg(1), armL: e < 250 ? hand(1) : ARM_DOWN, armR: e < 250 ? hand(-1) : ARM_DOWN };
}

/**
 * Dozing standing where it is (over nothing after a change of scene), `e` ms since it began: the lids heavy at once and
 * heavier, the head sinking and jerking back up once, a slow sway.
 */
export function dozeOff(now: number, e: number): Draft {
  const t = Math.max(0, e);
  const heavy = ramp(t, 0, 2500);
  const breath = breathing(now);
  return {
    pelvis: { y: 0.22 - 0.01 * heavy, lean: [0.02 * heavy, 0.02 * wave(now, 0.2)], pivot: "feet" },
    chest: breath.chest!,
    head: [breath.head![0] + 0.2 * heavy - 0.15 * span(t, 1600, 1680, 1720, 1950), 0, 0.05 * wave(now, 0.2)],
    lids: [0.45 + 0.3 * heavy - 0.3 * span(t, 1600, 1680, 1720, 1900), 0],
    brows: [0.1 + 0.05 * heavy, 0.25 + 0.1 * heavy],
    mouth: [lerp(0.4, 0.15, heavy), 0.06 + 0.08 * heavy],
  };
}
