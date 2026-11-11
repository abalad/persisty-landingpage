import type { QuirkId, Rest } from "../cues";
import type { V3 } from "../ik";
import type { Arm, Draft, Leg } from "../pose";
import { breathing } from "./base";
import { ARM_DOWN, HANG, WAVE_UP, arm, clamp, foot, hop, keys, lerp, ramp, reach, smooth, span, wave, waving } from "./curves";
import { SEAT, dangling, lookAtWindow, peekOver } from "./windows";

/**
 * The idle life (the spec's "Ócio"), as timelines: the quirks that come every few minutes, the wave to the cursor that
 * comes back, hiding behind a screen's outer edge to rest, and the way out of every rest. Pure functions of their own clock
 * (ms); the director decides what each claims (the quirks as the quirk layer, P; hiding as the rest, in the base; the way
 * out as a reaction, R).
 *
 * The spec's principles: the eyes go first, the head 80 ms later, the body after; every gesture has its anticipation (the
 * knees bend before the stretch and the hops, the arm pulls back before the wave, it leans back out before it comes out
 * from the edge); what stops goes on (the antenna whips on every turn and landing, the stretch lets go and shakes). They
 * are ours: no prop comes in. Feet and hands are in the stage's space (pose.ts): a body that moves its root moves its
 * planted feet with it. Facing the camera the character's left (armL, legL) is on the +x side, the screen's right.
 */

/** How long each timed quirk lasts (ms). The yawn ends asleep: the page puts it to rest when it is over (YAWN_MS). */
export const QUIRK_MS = { stretch: 3200, lookAround: 3500, hop: 1400, knock: 2800, swingLegs: 3000, waveCursor: 1500 } as const;
/** The yawn, until the rest takes over. */
export const YAWN_MS = 2600;
/** Leaving a rest (ms): calmly, or with an alarm (someone asks), quicker and with a "!". */
export const EXIT_MS = { calm: 700, alarm: 500 } as const;
/** Peeking from the bottom edge: the pelvis this far down, so only the head shows above the box's bottom (the old sink, 0.86 units). */
export const PEEK_Y = 0.22 - 0.86;

const STAND = 0.22;
const FOOT_X = 0.12;
const FOOT_Z = 0.04;
/** Where the left hand hangs at rest (model.ts), give or take; the right one is mirrored. */
const HAND_REST: V3 = [0.345, 0.25, 0.06];
const planted = (x: number, y = 0, z = FOOT_Z): Leg => ({ kind: "foot", at: [x, y, z] });
/** Standing, facing the camera, the feet where they stand. */
const STANDING: Draft = { root: { x: 0, yaw: 0 }, legL: foot(0), legR: foot(1) };
/** The arm on the screen's side `s` (+1 its right, +x: the character's left). */
const armOn = (s: -1 | 1): "armL" | "armR" => (s === 1 ? "armL" : "armR");
/** A foot from `from` to where it stands (`i` 0 the left), stepping over `k` (0–1): lifted on the way, exactly there at 1. */
const stepTo = (i: 0 | 1, from: V3, k: number, lift = 0.035): Leg => {
  if (k >= 1) return foot(i);
  const to = foot(i);
  const at = (to as Extract<Leg, { kind: "foot" }>).at;
  const m = smooth(k);
  return { kind: "foot", at: [lerp(from[0], at[0], m), lerp(from[1], at[1], m) + lift * Math.sin(Math.PI * m), lerp(from[2], at[2], m)] };
};

/**
 * A quirk's pose `e` ms into it, towards `side` (the end it peeks over, where the cursor is, which way it looks first), or
 * null outside it. The peek over a window's end takes its distance from the director (`peekOver`).
 */
export function quirk(id: QuirkId, side: -1 | 0 | 1, e: number): Draft | null {
  const s: -1 | 1 = side === -1 ? -1 : 1;
  switch (id) {
    case "lookAtWindow":
      return lookAtWindow(e);
    case "peekOver":
      return peekOver(s, e);
    case "stretch":
      return stretch(e);
    case "yawn":
      return yawn(e);
    case "lookAround":
      return lookAround(s, e);
    case "hop":
      return hops(e);
    case "knock":
      return knock(e);
    case "swingLegs":
      return swingLegs(e);
    case "waveCursor":
      return waveCursor(s, e);
  }
}

// ---- stretching --------------------------------------------------------------------------------------------------------

/** The stretch: how far the knees bend first, how high it goes on tiptoe, the arms' raise (under 2.5: the forearms clear the head). */
const STRETCH = { crouch: 0.055, toes: 0.03, raise: 2.4, top: 1.1, quiver: 9, shakeHz: 5, shake: 0.09 } as const;

/**
 * Stretching (`e` ms in, null outside QUIRK_MS.stretch): a breath in, the knees bend and the arms dip (anticipation); up it
 * goes, the arms over the head, on tiptoe, stretched to squash 1.1, the head back, the eyes shut and the mouth open in an
 * "aah"; held with a quiver; then it lets go at once (the arms drop in 150 ms, the heels come down) and shakes its body side
 * to side, the arms flopping, the antenna whipping; it settles content, eyes smiling.
 */
function stretch(e: number): Draft | null {
  if (!(e >= 0) || e >= QUIRK_MS.stretch) return null;
  const crouch = span(e, 120, 480, 520, 900);
  const up = span(e, 520, 1100, 1900, 2000);
  const quiver = span(e, 1100, 1250, 1750, 1900) * Math.sin((e / 1000) * STRETCH.quiver * 2 * Math.PI);
  const shaking = span(e, 2020, 2080, 2450, 2750) * (1 - 0.5 * ramp(e, 2100, 2750));
  const shake = shaking * Math.sin(((e - 2050) / 1000) * STRETCH.shakeHz * 2 * Math.PI);
  const drop = span(e, 1950, 2030, 2060, 2220);
  const content = span(e, 2500, 2700, 2950, 3150);
  const raise = keys(e, [[0, 0], [120, 0], [480, 0.12], [560, 0.3], [1100, STRETCH.raise], [1900, STRETCH.raise], [2050, 0.25], [2300, 0.15], [2700, 0.08], [3100, 0]]) + 0.04 * quiver;
  const swing = keys(e, [[0, 0], [120, 0], [480, -0.25], [560, -0.1], [1100, 0.15], [1900, 0.15], [2050, 0.1], [3100, 0]]);
  const elbow = keys(e, [[0, 0], [120, 0], [480, 0.35], [700, 0.5], [1100, 0.12], [1900, 0.12], [2050, 0.3], [3100, 0]]);
  const twist = keys(e, [[0, 0], [560, 0], [1100, 0.5], [1900, 0.5], [2100, 0], [3100, 0]]);
  const wrist = keys(e, [[0, 0], [700, 0], [1100, -0.45], [1900, -0.45], [2050, 0], [3100, 0]]);
  /** One arm, `s` +1 the left: flopping out in turn with the shake. */
  const limb = (s: 1 | -1): Arm => arm(swing + 0.12 * shake * s, twist, raise + 0.18 * Math.max(0, s * shake), elbow + 0.25 * Math.abs(shake), wrist, 0, 0);
  const toes = STRETCH.toes * up;
  return {
    root: { x: 0, yaw: 0 },
    pelvis: {
      y: STAND - STRETCH.crouch * crouch + toes + 0.004 * quiver - 0.03 * drop + 0.01 * Math.abs(shake),
      lean: [0.06 * crouch - 0.06 * up, STRETCH.shake * shake],
      pivot: "feet",
    },
    squash: [keys(e, [[0, 1], [120, 1], [480, 0.9], [560, 0.95], [1100, STRETCH.top], [1900, STRETCH.top], [2000, 0.93], [2100, 0.94], [2300, 1.02], [2550, 1], [3200, 1]]), 1],
    chest: { twist: 0.08 * shake, breath: 0.03 * span(e, 0, 400, 1800, 2000) },
    legL: foot(0, toes),
    legR: foot(1, toes),
    armL: limb(1),
    armR: limb(-1),
    head: [
      keys(e, [[0, 0], [120, 0.05], [480, 0.12], [700, 0], [1100, -0.2], [1900, -0.2], [2050, 0.06], [2400, 0], [3200, 0]]),
      0.12 * shaking * Math.sin(((e - 2100) / 1000) * STRETCH.shakeHz * 2 * Math.PI),
      0.06 * shake,
    ],
    gaze: [0, 0.006 * span(e, 0, 200, 500, 700)],
    // Shut all the way: only then does the closed eye's dark line ("‿") show; a lower lid up would cover it.
    lids: [keys(e, [[0, 0], [150, 0], [500, 0.4], [900, 1], [1900, 1], [2000, 0.15], [2200, 0], [3200, 0]]), 0.45 * content],
    brows: [0.3 * up + 0.15 * content, 0],
    mouth: [lerp(lerp(0.6, 0.3, up), 0.9, content), 0.4 * span(e, 700, 1100, 1800, 1950)],
    shadow: 1,
    antennaKick: [-0.3 * drop + 0.05 * quiver, 0.25 * shake],
  };
}

// ---- yawning -------------------------------------------------------------------------------------------------------------

/**
 * The hand at the mouth, by its angles (searched on the real model: the back of the glove within ~4 px of the mouth, in
 * front of it, with the head back 0.15–0.2 and turned 0.15 towards it): the arm forward and up across the chest, turned
 * so the back of the hand faces out.
 */
const YAWN_HAND = { swing: 2.2, twist: -1.6, raise: -0.5, elbow: 0.45 } as const;

/**
 * Yawning (`e` ms in, null from YAWN_MS): the mouth opens slowly to a wide yawn (0.8 s), the head goes back, the chest
 * fills, the eyes squeeze shut; the right hand comes up to the mouth and pats it twice; the mouth closes with a content
 * little smile, the lids stay heavy, the head droops and the body slumps a little. The page puts it to rest then: it sits
 * (on the top, on a window), sinks or hides, and sleeps.
 */
function yawn(e: number): Draft | null {
  if (!(e >= 0) || e >= YAWN_MS) return null;
  const k = clamp(e / 800, 0, 1);
  const open = (e < 800 ? 0.88 * k ** 1.5 : 0.88 + 0.02 * span(e, 900, 1000, 1300, 1400) * Math.sin((e / 1000) * 5 * Math.PI)) * (1 - ramp(e, 1450, 1750));
  const pat = 0.14 * span(e, 1000, 1050, 1350, 1420) * Math.max(0, Math.sin(((e - 1000) / 1000) * 3 * 2 * Math.PI));
  const hand = (v: number, from: number) => keys(e, [[0, 0], [450, 0], [600, from], [950, v], [1450, v], [1750, 0.15 * v], [2000, 0]]);
  return {
    pelvis: {
      y: STAND + 0.006 * span(e, 300, 800, 1400, 1700) - 0.008 * ramp(e, 1800, 2600),
      lean: [keys(e, [[0, 0], [800, -0.04], [1450, -0.04], [1800, 0.04], [2600, 0.05]]), 0],
      pivot: "feet",
    },
    chest: { twist: 0, breath: keys(e, [[0, 0], [150, 0], [800, 0.035], [1450, 0.03], [1800, -0.01], [2600, 0]]) },
    legL: foot(0),
    legR: foot(1),
    armR: arm(hand(YAWN_HAND.swing, -0.15), hand(YAWN_HAND.twist, 0), hand(YAWN_HAND.raise, 0.1), hand(YAWN_HAND.elbow, 0.4) + pat, 0, 0, 0.3),
    armL: arm(-0.1 * span(e, 200, 800, 1450, 1800), 0, keys(e, [[0, 0], [300, 0.2], [800, 0.45], [1450, 0.4], [1800, 0], [2600, 0]]), 0.5 * span(e, 200, 800, 1450, 1800)),
    head: [
      keys(e, [[0, 0], [150, 0], [700, -0.15], [1450, -0.15], [1750, 0.06], [2600, 0.14]]),
      keys(e, [[0, 0], [500, 0], [850, -0.15], [1450, -0.15], [1800, 0], [2600, 0]]),
      keys(e, [[0, 0], [800, 0.05], [1450, 0.05], [2000, 0.1], [2600, 0.12]]),
    ],
    gaze: [0, 0.004 * span(e, 0, 300, 1400, 1700) - 0.004 * ramp(e, 1800, 2400)],
    // The eyes grow heavy from the start and shut all the way as it yawns (only then does the closed eye's line show; a
    // lower lid up would cover it); after it, heavy.
    lids: [keys(e, [[0, 0], [100, 0.12], [450, 0.5], [800, 1], [1450, 1], [1700, 0.5], [2600, 0.62]]), 0],
    // Sleepy, not bored: the brows' inner ends up as it closes its mouth, the mouth slack.
    brows: [keys(e, [[0, 0], [300, 0.15], [800, 0.35], [1450, 0.35], [1700, 0.12], [2600, 0.12]]), keys(e, [[0, 0], [1400, 0], [1700, 0.35], [2600, 0.35]])],
    mouth: [keys(e, [[0, 0.6], [600, -0.05], [1450, -0.05], [1750, 0.3], [2600, 0.15]]), open],
    shadow: 1,
    antennaKick: [0.1 * ramp(e, 1800, 2600) - 0.08 * span(e, 400, 800, 1450, 1700), 0],
  };
}

// ---- looking around ------------------------------------------------------------------------------------------------------

/**
 * Looking around (`side` first, `e` ms in, null outside QUIRK_MS.lookAround): the eyes go to that side, the head follows
 * 80 ms later and the chest after it, held 0.6 s; the eyes to the other side, the head after them, held; back to the front
 * and a little "hm" nod. The brows up, curious; the antenna swinging behind each turn.
 */
function lookAround(s: -1 | 1, e: number): Draft | null {
  if (!(e >= 0) || e >= QUIRK_MS.lookAround) return null;
  const TURN: readonly (readonly [number, number])[] = [[0, 0], [80, 0], [450, 0.55], [1150, 0.55], [1600, -0.55], [2300, -0.55], [2750, 0], [3500, 0]];
  const turn = s * keys(e, TURN);
  const chest = s * keys(e - 160, TURN);
  const body = s * keys(e - 240, TURN);
  const curious = span(e, 0, 120, 2750, 3000);
  return {
    root: { x: 0, yaw: 0.1 * body },
    chest: { twist: 0.15 * chest, breath: 0 },
    head: [keys(e, [[0, 0], [80, 0], [450, -0.06], [1150, -0.06], [1600, -0.04], [2300, -0.04], [2750, 0], [2950, 0.09], [3200, 0]]), turn - 0.1 * body, -0.1 * turn],
    gaze: [s * keys(e, [[0, 0], [50, 0.018], [1080, 0.018], [1130, -0.018], [2230, -0.018], [2290, 0], [3500, 0]]), 0.004 * curious],
    brows: [0.3 * curious, -0.05 * curious],
    mouth: [lerp(0.6, 0.35, curious), 0],
    antennaKick: [0.06 * span(e, 2750, 2900, 2950, 3200), s * (0.2 * span(e, 80, 200, 350, 550) - 0.25 * span(e, 1150, 1280, 1450, 1700) + 0.15 * span(e, 2300, 2420, 2600, 2850))],
  };
}

// ---- two little hops -----------------------------------------------------------------------------------------------------

/** The hops: [takeoff, landing, height]; the second lower. */
const HOPS = [[200, 540, 0.1], [700, 1000, 0.08]] as const;
/** A short whip pulse on the antenna `d` ms after a landing. */
const landed = (d: number) => (d >= 0 && d < 110 ? 0.3 * Math.sin((Math.PI * d) / 110) : 0);

/**
 * Two little hops in place (`e` ms in, null outside QUIRK_MS.hop): a crouch with the arms back first, a hop with the arms
 * up, a squash on landing and a quick crouch again, a second hop a little lower, and dust on the second landing; happy
 * eyes. Only drawn: the feet on the top stay where they are. The dust's `since` is on the quirk's clock.
 */
function hops(e: number): Draft | null {
  if (!(e >= 0) || e >= QUIRK_MS.hop) return null;
  let h = 0;
  let kick = 0;
  for (const [up, down, height] of HOPS) {
    h += hop(e, up, down, height);
    kick += landed(e - down);
  }
  const tuck = 0.04 * clamp(h / 0.04, 0, 1);
  const face = span(e, 0, 80, 1200, 1380);
  const raise = keys(e, [[0, 0], [180, 0.15], [260, 0.9], [540, 0.5], [700, 0.3], [760, 0.85], [1000, 0.45], [1250, 0]]);
  const swing = keys(e, [[0, 0], [180, -0.35], [260, 0.25], [560, -0.1], [700, -0.3], [760, 0.2], [1050, 0], [1250, 0]]);
  const elbow = keys(e, [[0, 0], [180, 0.4], [260, 0.3], [1250, 0]]);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: STAND + h, lean: [keys(e, [[0, 0], [180, 0.07], [260, -0.04], [540, 0.04], [700, 0.06], [780, -0.03], [1000, 0.04], [1200, 0]]), 0], pivot: "feet" },
    squash: [keys(e, [[0, 1], [60, 1], [180, 0.8], [225, 1.08], [370, 1], [520, 1.04], [555, 0.8], [640, 0.84], [690, 0.82], [725, 1.07], [850, 1], [985, 1.04], [1015, 0.76], [1140, 1.04], [1260, 0.99], [1400, 1]]), 1],
    legL: foot(0, h + tuck, 0, -0.6 * tuck),
    legR: foot(1, h + tuck, 0, -0.6 * tuck),
    armL: arm(swing, 0, raise, elbow, 0.2, 0, 0.3),
    armR: arm(swing, 0, raise, elbow, 0.2, 0, 0.3),
    head: [keys(e, [[0, 0], [180, 0.08], [260, -0.08], [560, 0.05], [700, 0.06], [780, -0.06], [1020, 0.06], [1250, 0]]), 0, 0.05 * wave(e, 1.4) * face],
    gaze: [0, 0.004 * face],
    lids: [0, 0.6 * face],
    brows: [0.3 * face, 0],
    mouth: [lerp(0.6, 1, face), 0.25 * face],
    dust: e >= HOPS[1][1] ? { count: 2, since: HOPS[1][1] } : null,
    shadow: 1,
    antennaKick: [kick, 0],
  };
}

// ---- knocking on the window ----------------------------------------------------------------------------------------------

/** Where the knuckles knock on the top: beside the right foot, a little in front of it. */
const KNOCK_AT = { x: -0.29, z: 0.12, low: 0.04 } as const;

/**
 * Knocking on the window's top (`e` ms in, null outside QUIRK_MS.knock): the eyes go down, the head after them; it crouches
 * and leans over to its right (the short arm can only reach the top so), the hand closes into a fist and knocks twice;
 * it lays the hand on the top and leans its ear right over to it, the eyes up and aside, listening… nothing; it straightens
 * and shrugs, the forearms up and the palms out, the brows up. On a window only (the idle director's rule).
 */
function knock(e: number): Draft | null {
  if (!(e >= 0) || e >= QUIRK_MS.knock) return null;
  const down = span(e, 150, 550, 1850, 2150);
  const listen = span(e, 1100, 1300, 1700, 1850);
  const shrug = span(e, 2000, 2150, 2450, 2700);
  const look = span(e, 0, 80, 1050, 1250);
  const knocks = (at: number) => (e >= at - 60 && e < at + 60 ? Math.sin((Math.PI * (e - at + 60)) / 120) : 0);
  // The shrug: the upper arms a little out, the forearms turned out and up, the palms up (searched on the real model: the
  // hands out at the shoulders' height).
  const shrugArm = arm(0.15 * shrug, 1.4 * shrug, 0.7 * shrug, 1.2 * shrug, -0.3 * shrug);
  let armR: Arm;
  if (e >= 150 && e < 1850) {
    const toward = ramp(e, 200, 600);
    // The fist winds up well above the top before each knock (a stroke that shows at 200 px), then rests on it, listening.
    const y = keys(e, [[0, 0.25], [200, 0.25], [560, 0.16], [650, 0.22], [760, KNOCK_AT.low], [860, 0.22], [970, KNOCK_AT.low], [1080, 0.075], [1850, 0.075]]);
    const grip = keys(e, [[0, 0], [400, 0.2], [600, 1], [1080, 1], [1150, 0.4], [1850, 0.4]]);
    armR = reach(lerp(-HAND_REST[0], KNOCK_AT.x, toward), y, lerp(HAND_REST[2], KNOCK_AT.z, toward), grip);
  } else armR = shrugArm;
  // The other arm out a little for balance, loose.
  const balance = arm(-0.15 * down, 0, 0.35 * down, 0.5 * down, 0.2 * down);
  const knocking = span(e, 500, 650, 1000, 1150);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: STAND - 0.1 * down + 0.008 * shrug, lean: [0.1 * down, 0.3 * down + 0.12 * listen], pivot: "feet" },
    squash: [1 + 0.03 * shrug - 0.03 * (knocks(760) + knocks(970)) * 0.5, 1],
    chest: { twist: 0, breath: 0.02 * listen },
    legL: foot(0),
    legR: foot(1),
    armL: e < 2000 ? balance : shrugArm,
    armR,
    head: [0.25 * look + 0.05 * listen - 0.05 * shrug, -0.12 * listen, 0.5 * listen + 0.15 * shrug],
    gaze: [0.012 * listen, -0.016 * look + 0.012 * listen],
    lids: [0, 0],
    brows: [0.2 * look + 0.15 * knocking + 0.35 * listen + 0.45 * shrug, -0.1 * look],
    // Curious as it knocks, an "o" as it listens, a flat "dunno" in the shrug.
    mouth: [lerp(lerp(lerp(0.6, 0.3, knocking), 0.2, listen), 0.05, shrug), 0.06 * knocking + 0.14 * listen],
    shadow: 1,
    antennaKick: [0.12 * (knocks(760) + knocks(970)), -0.15 * listen],
  };
}

// ---- swinging the legs, seated -----------------------------------------------------------------------------------------

/** Swinging the legs seated: quicker and wider than the seat's own 0.5 Hz, and the slow look around. */
const SWING = { hz: 1.1, amp: 0.95, lookHz: 0.45, turn: 0.35 } as const;

/**
 * Sat on a window's top (the rest), it wakes up a little (`e` ms in, null outside QUIRK_MS.swingLegs): the lids half open,
 * the legs swing quicker over the edge, in turn, the eyes and then the head looking around; then the lids grow heavy again
 * and the swing slows, back to sleep. Only the legs, the head and the face: the seat is the rest's.
 */
function swingLegs(e: number): Draft | null {
  if (!(e >= 0) || e >= QUIRK_MS.swingLegs) return null;
  const on = ramp(e, 0, 300) * (1 - ramp(e, 2500, 3000));
  const awake = span(e, 0, 250, 2500, 2950);
  const phi = SWING.amp * on * Math.sin((e / 1000) * SWING.hz * 2 * Math.PI);
  const look = Math.sin((e / 1000) * SWING.lookHz * 2 * Math.PI);
  return {
    legL: { kind: "foot", at: dangling(1, phi) },
    legR: { kind: "foot", at: dangling(-1, -phi) },
    head: [0.1 * (1 - awake) - 0.04 * awake, SWING.turn * awake * Math.sin(((e - 120) / 1000) * SWING.lookHz * 2 * Math.PI), 0.04 * Math.sin((e / 1000) * SWING.hz * 2 * Math.PI)],
    gaze: [0.015 * awake * look, 0.002 * awake],
    lids: [lerp(0.65, 0.2, awake), 0],
    brows: [0.15 * awake, 0.25 * (1 - awake)],
    mouth: [lerp(0.2, 0.7, awake), 0],
    antennaKick: [0.04 * on * Math.sin((e / 1000) * 2 * SWING.hz * 2 * Math.PI), 0],
  };
}

// ---- waving to the cursor ------------------------------------------------------------------------------------------------

/**
 * The wave: when the arm is up, its beat (Hz) (the arm itself is the terminal's wave's, WAVE_UP); the body's turn, the
 * head's turn to the cursor and, once the body has turned, back towards the camera (`back`), so the face stays on the
 * person and never in profile.
 */
const WAVE = { from: 650, hz: 2.1, yaw: 0.4, turn: 0.25, back: -0.12 } as const;

/**
 * The cursor came back after a while, on `side` (`e` ms in, null outside QUIRK_MS.waveCursor): the eyes are already on it
 * (the base looks at the cursor); the head turns to it 80 ms later, the body turns 0.4 after it; the hand on that side pulls
 * back (anticipation), sweeps up in an arc, out to the side and forward, and waves open beside the head, the elbow and the
 * wrist a beat behind; it smiles, the cheeks blushing; then the arm comes down and it faces the front.
 */
function waveCursor(s: -1 | 1, e: number): Draft | null {
  if (!(e >= 0) || e >= QUIRK_MS.waveCursor) return null;
  const face = ramp(e, 0, 150) * (1 - ramp(e, 1280, 1480));
  const p = (Math.max(0, e - WAVE.from) / 1000) * WAVE.hz * 2 * Math.PI;
  const w = span(e, WAVE.from - 40, WAVE.from + 100, 1180, 1300);
  const out = 1 - ramp(e, 1250, 1500);
  const hand = waving(
    keys(e, [[0, 0], [250, 0], [420, -0.35], [WAVE.from, WAVE_UP.swing], [1250, WAVE_UP.swing], [1450, 0]]),
    keys(e, [[0, 0], [420, 0], [WAVE.from, WAVE_UP.twist], [1250, WAVE_UP.twist], [1450, 0]]),
    keys(e, [[0, 0], [250, 0], [420, 0.12], [WAVE.from, WAVE_UP.raise], [1250, WAVE_UP.raise], [1450, 0]]),
    keys(e, [[0, 0], [250, 0], [420, 0.75], [WAVE.from, WAVE_UP.elbow], [1250, WAVE_UP.elbow], [1450, 0]]),
    p,
    w,
  );
  const d: Draft = {
    root: { x: 0, yaw: s * keys(e, [[0, 0], [160, 0], [420, WAVE.yaw], [1250, WAVE.yaw], [1500, 0]]) },
    pelvis: { y: STAND, lean: [0, -s * 0.04 * span(e, 300, 500, 1200, 1450)], pivot: "feet" },
    chest: { twist: s * 0.05 * span(e, 160, 400, 1250, 1500), breath: 0 },
    head: [-0.06 * span(e, 80, 260, 1250, 1500), s * keys(e, [[0, 0], [80, 0], [260, WAVE.turn], [440, WAVE.back], [1250, WAVE.back], [1500, 0]]), s * (0.12 * span(e, 200, 400, 1250, 1500) + 0.03 * w * Math.sin(p - 0.6))],
    lids: [0, 0.45 * face],
    brows: [0.35 * face, 0],
    mouth: [lerp(0.6, 1, face), 0.25 * face],
    blush: 0.55 * face,
    antennaKick: [0, -s * 0.12 * span(e, 160, 300, 400, 600) * out],
  };
  d[armOn(s)] = hand;
  d[armOn(s === 1 ? -1 : 1)] = arm(0, 0, 0.1 * face, 0.15 * face);
  return d;
}

// ---- hiding behind the screen's edge -------------------------------------------------------------------------------------

/**
 * Hidden behind the edge on `side`: how far the root goes past the box's middle (units: the box's side is at ±1), the body
 * turned towards the screen, leaning back in at the top and the head tilted over so half of it stays in the box, the
 * inner hand holding the corner (`hand`, at the box's side), its grip.
 */
const HIDE = { x: 1.33, yaw: 0.3, lean: 0.34, tilt: 0.42, turn: 0.15, hand: [0.9, 0.44, 0.2] as V3, grip: 0.85 } as const;
/** Settled behind the edge from this long after it began hiding (ms). */
const HIDE_MS = 1400;

/**
 * Hidden behind a screen's outer edge on `side` (−1 the left, 1 the right; the box flush against it), at `now` (the rig's
 * clock: it breathes), `e` ms since it began hiding (left out: settled). It turns to the screen (the eyes first, its back
 * to the edge), leans the other way a moment (anticipation) and slides out sideways in two steps, its feet with it; the
 * body goes out of the box, the top leaning back in and the head tilted over, so half the head stays, peeking; the inner
 * hand comes up and holds the corner. The eyes are on the screen, or on the cursor (the director's base).
 */
export function edgeHide(side: -1 | 1, now: number, e?: number): Draft {
  const s = side;
  const t = e === undefined ? Infinity : Math.max(0, e);
  const turnIn = ramp(t, 100, 450);
  const lean = span(t, 300, 450, 500, 700);
  const out = ramp(t, 450, 1150);
  const tip = ramp(t, 650, 1300);
  const hold = ramp(t, 950, HIDE_MS);
  const breath = breathing(now);
  const x = s * HIDE.x * out;
  const lead = s === 1 ? 0 : 1;
  const step = (i: 0 | 1, k: number): Leg => {
    const m = smooth(k);
    return planted((i === 0 ? FOOT_X : -FOOT_X) + s * HIDE.x * m, 0.03 * Math.sin(Math.PI * m));
  };
  const inner = armOn(s === 1 ? -1 : 1);
  const from: V3 = [x - s * HAND_REST[0], HAND_REST[1], HAND_REST[2]];
  const d: Draft = {
    root: { x, yaw: -s * HIDE.yaw * turnIn },
    pelvis: { y: STAND - 0.02 * span(t, 300, 450, 600, 900) - 0.01 * tip, lean: [0.02 * tip, s * (HIDE.lean * tip - 0.06 * lean)], pivot: "feet" },
    squash: [1 - 0.04 * span(t, 300, 450, 550, 800), 1],
    chest: { twist: 0, breath: breath.chest!.breath },
    legL: step(0, lead === 0 ? ramp(t, 450, 800) : ramp(t, 700, 1150)),
    legR: step(1, lead === 1 ? ramp(t, 450, 800) : ramp(t, 700, 1150)),
    armL: ARM_DOWN,
    armR: ARM_DOWN,
    head: [0.03 * tip + breath.head![0], s * (HIDE.turn * tip - 0.25 * span(t, 180, 400, 600, 900)), s * HIDE.tilt * tip + 0.02 * wave(now, 0.2)],
    gaze: [-s * (0.016 * span(t, 100, 160, 600, 900) + 0.01 * tip), 0],
    lids: [0, 0],
    brows: [0.1 * tip, 0],
    mouth: [0.55, 0],
    shadow: 1 - out,
    antennaKick: [0, s * 0.15 * span(t, 450, 600, 900, 1150)],
  };
  if (hold > 0) d[inner] = reach(lerp(from[0], s * HIDE.hand[0], hold), lerp(from[1], HIDE.hand[1], hold), lerp(from[2], HIDE.hand[2], hold), HIDE.grip * hold);
  return d;
}

// ---- out of a rest -------------------------------------------------------------------------------------------------------

/**
 * Startled arms (the alarm) over [0.1, 0.6] of the way out (`to`): up and open; after that the way out lets go of them and
 * the request's wave has them, sweeping up from where it is on its own clock (held down until the end of the way out,
 * the arm sprang up to the wave all at once and its hand went across the head).
 */
const STARTLED = { to: 0.6 } as const;
const startled = (u: number): Arm => arm(0.3 * span(u, 0.08, 0.2, 0.45, STARTLED.to), 0, 1.1 * span(u, 0.08, 0.2, 0.45, STARTLED.to), 0.6 * span(u, 0.08, 0.2, 0.45, STARTLED.to), 0.2);

/**
 * The alarm's face and mark: brows up, eyes wide, a gasp, "!" by the head, settling into the request's face by the end;
 * the arms are the request's once the startle is over (STARTLED).
 */
function alarmed(d: Draft, u: number): Draft {
  const gasp = span(u, 0, 0.12, 0.7, 1);
  d.mark = "!";
  d.lids = [0, 0];
  d.brows = [0.85 * span(u, 0, 0.1, 0.85, 1.2), 0.3 * gasp];
  d.mouth = [lerp(0.6, -0.2, gasp), 0.45 * gasp];
  d.eyes = "normal";
  d.antennaKick = [(d.antennaKick?.[0] ?? 0) - 0.35 * span(u, 0, 0.08, 0.15, 0.4), d.antennaKick?.[1] ?? 0];
  if (u >= STARTLED.to) {
    delete d.armL;
    delete d.armR;
  }
  return d;
}

/** Waking calmly: the heavy lids open with the rise (the brows sleepy until then, not bored), a smile comes back. */
function awake(d: Draft, u: number, from: number, at: number): Draft {
  const open = ramp(u, at, at + 0.15);
  d.lids = [lerp(from, 0, open), 0];
  d.brows = [0.12 * (1 - open) + 0.25 * span(u, at, at + 0.1, 0.7, 1), 0.3 * (1 - open)];
  d.mouth = [lerp(0.25, 0.6, ramp(u, at, at + 0.3)), 0.12 * span(u, at, at + 0.1, at + 0.15, at + 0.35)];
  return d;
}

/**
 * Leaving `rest` (`e` ms in, null outside 700 ms, or 500 with an `alarm`): from where that rest left it up to standing in
 * the box, with anticipation, and `side`'s edge for the hide. Out of the peek it sinks a little more and pops up; out of the
 * seat it leans back, pushes on the ledge and hops up, the feet swinging back over the edge; dozing, the head drops a hair
 * and snaps up, a shake; from behind the edge it leans back out, lets go of the corner and slides in, stepping. The alarm
 * (someone asks) is quicker, jumps, the arms up a moment, with a "!", the brows up, eyes wide and a gasp.
 */
export function leaveRest(rest: Rest, alarm: boolean, e: number, side: -1 | 1 = 1): Draft | null {
  const D = alarm ? EXIT_MS.alarm : EXIT_MS.calm;
  if (!(e >= 0) || e >= D) return null;
  const u = e / D;
  // The alarm's jump, on top of the way up.
  const j = ramp(u, 0.25, 0.75);
  const jump = alarm && j < 1 ? 0.07 * Math.sin(Math.PI * j) : 0;
  let d: Draft;
  switch (rest) {
    case "peek": {
      const up = u >= 0.45;
      d = {
        ...STANDING,
        pelvis: { y: keys(u, [[0, PEEK_Y], [0.2, PEEK_Y - 0.04], [0.6, 0.255], [0.78, 0.212], [0.9, STAND], [1, STAND]]) + jump, lean: [keys(u, [[0, 0], [0.2, 0.05], [0.55, -0.05], [0.85, 0], [1, 0]]), 0], pivot: "feet" },
        squash: [keys(u, [[0, 1], [0.2, 0.9], [0.45, 1.08], [0.7, 0.95], [0.85, 1.01], [1, 1]]), 1],
        legL: up ? foot(0, jump) : HANG,
        legR: up ? foot(1, jump) : HANG,
        armL: alarm ? startled(u) : arm(0.1 * span(u, 0.35, 0.55, 0.65, 0.95), 0, 0.5 * span(u, 0.35, 0.55, 0.65, 0.95), 0.3 * span(u, 0.35, 0.55, 0.65, 0.95)),
        armR: alarm ? startled(u) : arm(0.1 * span(u, 0.35, 0.55, 0.65, 0.95), 0, 0.5 * span(u, 0.35, 0.55, 0.65, 0.95), 0.3 * span(u, 0.35, 0.55, 0.65, 0.95)),
        head: [keys(u, [[0, 0.12], [0.2, 0.16], [0.55, -0.1], [0.8, 0.03], [1, 0]]), 0, 0],
        shadow: ramp(u, 0.4, 0.7),
        antennaKick: [-0.3 * span(u, 0.4, 0.5, 0.55, 0.75), 0],
      };
      awake(d, u, 0.75, 0.25);
      break;
    }
    case "sit": {
      const toStand = (i: 0 | 1, k: number) => stepTo(i, dangling(i === 0 ? 1 : -1, 0), k, 0.06);
      const pushing = u < 0.3;
      const hand = (s: 1 | -1): Arm =>
        pushing ? reach(s * SEAT.hand[0], SEAT.hand[1] + 0.02 * span(u, 0, 0.1, 0.2, 0.3), SEAT.hand[2], 0.4) : alarm ? startled(u) : arm(0.3 * span(u, 0.3, 0.45, 0.6, 0.9), 0, 0.35 * span(u, 0.3, 0.45, 0.6, 0.9), 0.4 * span(u, 0.3, 0.45, 0.6, 0.9));
      d = {
        ...STANDING,
        pelvis: { y: keys(u, [[0, SEAT.y], [0.2, SEAT.y - 0.012], [0.6, 0.265], [0.8, 0.212], [0.9, STAND], [1, STAND]]) + jump, lean: [keys(u, [[0, -0.03], [0.2, -0.07], [0.55, 0.06], [0.85, 0], [1, 0]]), 0], pivot: "feet" },
        squash: [keys(u, [[0, 1], [0.2, 0.95], [0.55, 1.06], [0.8, 0.96], [1, 1]]), 1],
        legL: jump > 0 && u >= 0.75 ? foot(0, jump) : toStand(0, ramp(u, 0.2, 0.7)),
        legR: jump > 0 && u >= 0.75 ? foot(1, jump) : toStand(1, ramp(u, 0.25, 0.75)),
        armL: hand(1),
        armR: hand(-1),
        head: [keys(u, [[0, 0.15], [0.2, 0.2], [0.55, -0.06], [0.8, 0.02], [1, 0]]), 0, 0],
        shadow: lerp(0.7, 1, ramp(u, 0.3, 0.7)),
        antennaKick: [-0.25 * span(u, 0.4, 0.5, 0.55, 0.75), 0],
      };
      awake(d, u, 0.65, 0.3);
      break;
    }
    case "edge": {
      const s = side;
      const lead = s === 1 ? 1 : 0;
      const hideFeet: [V3, V3] = [[FOOT_X + s * HIDE.x, 0, FOOT_Z], [-FOOT_X + s * HIDE.x, 0, FOOT_Z]];
      const x = s * keys(u, [[0, HIDE.x], [0.2, HIDE.x + 0.05], [0.72, 0], [1, 0]]);
      const inner = armOn(s === 1 ? -1 : 1);
      const outer = armOn(s);
      d = {
        root: { x, yaw: -s * HIDE.yaw * (1 - ramp(u, 0.2, 0.7)) },
        pelvis: {
          y: keys(u, [[0, STAND - 0.01], [0.2, 0.2], [0.55, 0.23], [0.85, 0.215], [1, STAND]]) + jump,
          lean: [0.02 * (1 - ramp(u, 0.2, 0.6)), s * keys(u, [[0, HIDE.lean], [0.2, HIDE.lean + 0.04], [0.65, -0.06], [0.85, 0.02], [1, 0]])],
          pivot: "feet",
        },
        squash: [keys(u, [[0, 1], [0.2, 0.96], [0.5, 1.03], [0.85, 0.97], [1, 1]]), 1],
        legL: jump > 0 && u >= 0.75 ? foot(0, jump) : stepTo(0, hideFeet[0], ramp(u, lead === 0 ? 0.2 : 0.4, lead === 0 ? 0.5 : 0.75)),
        legR: jump > 0 && u >= 0.75 ? foot(1, jump) : stepTo(1, hideFeet[1], ramp(u, lead === 1 ? 0.2 : 0.4, lead === 1 ? 0.5 : 0.75)),
        head: [0.03 * (1 - ramp(u, 0.2, 0.6)), s * keys(u, [[0, HIDE.turn], [0.3, HIDE.turn], [0.75, 0], [1, 0]]), s * keys(u, [[0, HIDE.tilt], [0.25, HIDE.tilt + 0.05], [0.7, -0.05], [0.9, 0], [1, 0]])],
        shadow: ramp(u, 0.4, 0.8),
        antennaKick: [0, -s * 0.2 * span(u, 0.3, 0.45, 0.55, 0.8)],
      };
      d[inner] = alarm ? startled(u) : u < 0.35 ? reach(s * HIDE.hand[0], HIDE.hand[1], HIDE.hand[2], HIDE.grip * (1 - ramp(u, 0, 0.2))) : arm(0.15 * span(u, 0.35, 0.5, 0.7, 0.95), 0, 0.3 * span(u, 0.35, 0.5, 0.7, 0.95), 0.3 * span(u, 0.35, 0.5, 0.7, 0.95));
      d[outer] = alarm ? startled(u) : arm(0.2 * span(u, 0.2, 0.4, 0.6, 0.9), 0, 0.35 * span(u, 0.2, 0.4, 0.6, 0.9), 0.4 * span(u, 0.2, 0.4, 0.6, 0.9));
      awake(d, u, 0.7, 0.05);
      break;
    }
    case "doze":
    case "stand": {
      const dozing = rest === "doze";
      const shake = alarm ? 0 : 0.12 * span(u, 0.4, 0.5, 0.75, 0.95) * Math.sin((e / 1000) * 6 * 2 * Math.PI);
      d = {
        ...STANDING,
        legL: foot(0, jump),
        legR: foot(1, jump),
        pelvis: { y: keys(u, [[0, dozing ? 0.21 : STAND], [0.2, 0.205], [0.45, 0.235], [0.7, 0.218], [1, STAND]]) + jump, lean: [keys(u, [[0, dozing ? 0.02 : 0], [0.2, 0.04], [0.45, -0.03], [0.8, 0], [1, 0]]), 0], pivot: "feet" },
        squash: [keys(u, [[0, 1], [0.2, 0.97], [0.45, 1.05], [0.7, 0.98], [1, 1]]), 1],
        armL: alarm ? startled(u) : arm(0, 0, 0.35 * span(u, 0.3, 0.45, 0.6, 0.9), 0.3 * span(u, 0.3, 0.45, 0.6, 0.9)),
        armR: alarm ? startled(u) : arm(0, 0, 0.35 * span(u, 0.3, 0.45, 0.6, 0.9), 0.3 * span(u, 0.3, 0.45, 0.6, 0.9)),
        head: [keys(u, [[0, dozing ? 0.2 : 0.12], [0.18, dozing ? 0.26 : 0.16], [0.4, -0.1], [0.6, 0.03], [0.8, 0], [1, 0]]), shake, 0.4 * shake],
        antennaKick: [-0.3 * span(u, 0.35, 0.42, 0.5, 0.7), 0],
        shadow: 1,
      };
      awake(d, u, dozing ? 0.75 : 0.9, 0.25);
      break;
    }
  }
  return alarm ? alarmed(d, u) : d;
}
