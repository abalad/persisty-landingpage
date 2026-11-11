import type { ReactionKind } from "../cues";
import type { V3 } from "../ik";
import type { Arm, Draft, V2 } from "../pose";
import { ARM_DOWN, WAVE_UP, arm, clamp, foot, hash, hop, keys, lerp, ramp, reach, span, wave, waving } from "./curves";

/**
 * The session's moods and the reactions (the spec's "Humores da sessão"), as timelines: pure functions of their own clock,
 * in ms. A mood (H) claims only the arms, the head, the brows and the panel and marks; a reaction (R) faces the person
 * and claims the body's squash and its drawn hops, the arms, the head and the face. They follow the spec's principles:
 * every gesture has its anticipation; the eyes go first, the head 80 ms later and the body 160 ms later; arms and head
 * move in arcs (keys eased in and out, the elbow and the wrist a beat behind the shoulder); one readable action at a time.
 *
 * The right arm (the character's right, the screen's left) is the one that waves and reaches: the "!" (a startle, the pause
 * in the air) shows on the other side of the head (props.ts). A prop's `since` here is on the reaction's own clock; the director moves it to the rig's.
 */

/** How long each reaction lasts (today's, with "say" as the talk). */
export const REACTION_MS: Record<ReactionKind, number> = { celebrate: 1900, oops: 1700, talk: 1200, wave: 1500, think: 2300, poke: 950 };
/** With reduced motion a reaction is one still pose for as long as it lasts: the instant that says it best. */
export const REACTION_KEY: Record<ReactionKind, number> = { celebrate: 1480, oops: 800, talk: 350, wave: 640, think: 1100, poke: 640 };

const FACING = { root: { x: 0, yaw: 0 } } as const;
const LOOKING_AT_YOU: V2 = [0, 0];

// ---- the moods ----------------------------------------------------------------------------------------------------------

/** Asking: the wave's beat (Hz) and when the arm is up (ms). */
const ASK = { hz: 1.7, from: 420 } as const;

/**
 * Someone asks (`t` since it began): the brows go up at once, the head tilts up and a little towards the arm 80 ms later,
 * and the right arm goes down and back, then sweeps up in an arc, out to the side and forward, and waves an open hand
 * beside the head (WAVE_UP), the elbow and the wrist a beat behind the shoulder; the other hand lifts a little with each
 * wave. No mark: the page's badge with the count says someone asks (one signal at a time).
 */
export function asking(t: number): Draft {
  const brows = ramp(t, 0, 120);
  const headIn = ramp(t, 80, 300);
  const p = (Math.max(0, t - ASK.from) / 1000) * ASK.hz * 2 * Math.PI;
  const w = ramp(t, ASK.from - 40, ASK.from + 180);
  return {
    armR: waving(
      keys(t, [[0, 0], [60, 0], [200, -0.4], [ASK.from, WAVE_UP.swing]]),
      keys(t, [[0, 0], [200, 0], [ASK.from + 40, WAVE_UP.twist]]),
      keys(t, [[0, 0], [60, 0], [200, 0.05], [ASK.from + 40, WAVE_UP.raise]]),
      keys(t, [[0, 0], [60, 0], [200, 0.7], [ASK.from + 40, WAVE_UP.elbow]]),
      p,
      w,
    ),
    armL: arm(0.12 * headIn, 0, 0.18 * headIn + w * 0.08 * (0.5 - 0.5 * Math.sin(p)), 0.35 * headIn),
    head: [-0.1 * headIn + w * 0.025 * Math.sin(2 * p), 0, 0.05 * headIn + w * 0.015 * Math.sin(p - 0.5)],
    brows: [0.65 * brows, 0.2 * brows],
    mark: null,
  };
}

/**
 * Typing: each hand taps at `hz`, the two in turn, the tempo never quite even; the hands rest on `at` (stage space, over
 * the panel's near edge, within the short arms' reach) and drift a little across it; `lift` how high a hand comes up.
 */
const TYPE = { hz: 2.3, lift: 0.032, at: [0.15, 0.41, 0.28], drift: 0.025, grip: 0.35 } as const;

/**
 * Someone works (`t` since it began): typing in the air before the small lime panel, looking down at it and nodding,
 * brows knitted in concentration. The director blinks less meanwhile.
 */
export function working(t: number): Draft {
  const p = (t / 1000) * TYPE.hz * 2 * Math.PI + 0.6 * wave(t, 0.37);
  const strength = 0.75 + 0.25 * wave(t, 0.21, 1);
  const dx = TYPE.drift * wave(t, 0.17);
  const [x, y, z] = TYPE.at;
  return {
    armL: reach(x + dx, y + TYPE.lift * strength * Math.max(0, Math.sin(p)) ** 0.7, z, TYPE.grip),
    armR: reach(-x + dx, y + TYPE.lift * strength * Math.max(0, -Math.sin(p)) ** 0.7, z, TYPE.grip),
    head: [0.27 + 0.035 * wave(t, 1.1), 0.06 * wave(t, 0.17, 0.4), 0.02 * wave(t, 0.29)],
    brows: [-0.35, -0.5],
    panel: true,
  };
}

// ---- the reactions ------------------------------------------------------------------------------------------------------

/** A reaction's pose `e` ms after it began, or null once it is over. */
export function reaction(kind: ReactionKind, e: number): Draft | null {
  if (!(e >= 0) || e >= REACTION_MS[kind]) return null;
  switch (kind) {
    case "celebrate":
      return celebrate(e);
    case "oops":
      return oops(e);
    case "talk":
      return talk(e);
    case "wave":
      return hello(e);
    case "think":
      return think(e);
    case "poke":
      return poke(e);
  }
}

/** Where the hand hangs at rest (model.ts), give or take: a reaching hand comes down to it before the arm turns back to its angles. */
const HAND_REST: V3 = [-0.345, 0.25, 0.06];

/**
 * A hand on `from` that lets go over [a, b] ms: down the side in an arc that bulges a little forward, to where it hangs at
 * rest, so the arm turning back to its angles is a small step and not a swing out.
 */
function handDown(e: number, a: number, b: number, from: V3, grip: number): Arm {
  const k = ramp(e, a, b);
  const bulge = Math.sin(Math.PI * k);
  return reach(lerp(from[0], HAND_REST[0], k) - 0.02 * bulge, lerp(from[1], HAND_REST[1], k), lerp(from[2], HAND_REST[2], k) + 0.08 * bulge, grip * (1 - k));
}

/** A short whip pulse on the antenna `d` ms after a landing: forward, as the ball keeps going down. */
const landingKick = (d: number) => (d >= 0 && d < 110 ? 0.35 * Math.sin((Math.PI * d) / 110) : 0);
/** The feet with the body `h` units up: tucked a little (the knees fold) while in the air. */
const feetUp = (h: number): Pick<Draft, "legL" | "legR"> => {
  const tuck = 0.04 * clamp(h / 0.04, 0, 1);
  return { legL: foot(0, h + tuck, 0, -tuck * 0.6), legR: foot(1, h + tuck, 0, -tuck * 0.6) };
};

/** Celebrate: three hops, [takeoff, landing, height], lower each time. */
const HOPS = [[170, 480, 0.16], [570, 860, 0.12], [950, 1210, 0.08]] as const;
/**
 * The squash through the hops: the crouch, stretched at each takeoff and landing, flat at each landing and crouched again
 * before the next; past the last landing a little stretch and back. These are the spring's targets: it rounds the corners
 * off and gets about two thirds of the way in a short squash, so they go deeper than what shows (~0.88 crouched, ~0.85
 * on landing).
 */
const CELEBRATE_SQUASH: readonly (readonly [number, number])[] = [
  [0, 1], [130, 0.8], [185, 1.1], [325, 1], [460, 1.06],
  [490, 0.72], [545, 0.86], [585, 1.08], [715, 1], [840, 1.05],
  [870, 0.74], [925, 0.88], [965, 1.07], [1080, 1], [1195, 1.04],
  [1225, 0.74], [1340, 1.05], [1460, 1],
];

/**
 * A turn ended: the eyes smile first; it crouches with its arms back (anticipation), hops three times, lower each time,
 * arms up in a V that dip at each landing; cheeks blush, five stars burst at the first takeoff; it lands, settles, and the
 * arms come down.
 */
function celebrate(e: number): Draft {
  let h = 0;
  let kick = 0;
  for (const [up, down, height] of HOPS) {
    h += hop(e, up, down, height);
    kick += landingKick(e - down);
  }
  const face = ramp(e, 0, 60) * (1 - ramp(e, 1700, 1880));
  const raise = keys(e, [[0, 0], [150, 0.15], [200, 0.5], [330, 2.45], [480, 2.25], [600, 2.5], [870, 2.3], [980, 2.5], [1230, 2.3], [1350, 2.5], [1500, 2.45], [1820, 0]]);
  const swing = keys(e, [[0, 0], [150, -0.5], [300, 0.25], [1500, 0.25], [1820, 0]]);
  const elbow = keys(e, [[0, 0], [150, 0.45], [300, 0.3], [1500, 0.3], [1820, 0]]);
  const twist = keys(e, [[0, 0], [150, 0], [330, 0.5], [1500, 0.5], [1820, 0]]);
  const sway = 0.09 * wave(e, 1.3) * span(e, 200, 350, 1400, 1700);
  return {
    ...FACING,
    pelvis: { y: 0.22 + h, lean: [keys(e, [[0, 0], [150, 0.07], [260, -0.04], [1300, -0.03], [1500, 0]]), -0.4 * sway], pivot: "feet" },
    squash: [keys(e, CELEBRATE_SQUASH), 1],
    ...feetUp(h),
    armL: arm(swing, twist, raise, elbow, 0.2, 0, 0.6),
    armR: arm(swing, twist, raise, elbow, 0.2, 0, 0.6),
    head: [keys(e, [[0, 0], [80, 0], [160, 0.1], [300, -0.15], [1500, -0.12], [1850, 0]]), 0, sway],
    gaze: LOOKING_AT_YOU,
    lids: [0, 0.85 * face],
    brows: [0.5 * face, 0],
    mouth: [lerp(0.6, 1, face), 0.45 * span(e, 40, 140, 1650, 1850)],
    blush: 0.85 * span(e, 0, 300, 1600, 1890),
    stars: e >= 180 ? { mode: "burst", since: 180 } : null,
    antennaKick: [kick, 0],
  };
}

/**
 * An error: a start (brows up, a little "o", a jolt up), then the right hand dips and goes up to the side of the head,
 * scratching it; the head goes down and leans into the hand with a small embarrassed shake; sad brows, a frown, the eyes
 * away; one drop of sweat. The director blinks the antenna and the rim red twice.
 */
function oops(e: number): Draft {
  const start = span(e, 0, 60, 120, 260);
  const sad = ramp(e, 200, 320) * (1 - ramp(e, 1450, 1680));
  const scratch = 0.012 * wave(e, 4) * span(e, 520, 600, 1050, 1150);
  const armR = e < 260
    ? arm(keys(e, [[0, 0], [100, 0], [260, -0.3]]), 0, keys(e, [[0, 0], [100, 0], [260, 0.3]]), keys(e, [[0, 0], [100, 0], [260, 0.7]]), 0, 0, 0.2)
    : e < 1620 ? handDown(e, 1450, 1620, [-0.37, 0.87 + scratch, 0.04], 0.3) : ARM_DOWN;
  return {
    ...FACING,
    pelvis: { y: 0.22, lean: [0.06 * sad, 0.03 * sad], pivot: "feet" },
    squash: [1 + 0.04 * start - 0.03 * sad, 1],
    armR,
    armL: arm(0, 0, 0.12 * sad, 0.2 * sad),
    head: [
      keys(e, [[0, 0], [80, 0], [150, -0.1], [320, 0.16], [1450, 0.16], [1650, 0]]),
      0.1 * wave(e, 2.2) * span(e, 400, 500, 1000, 1200),
      keys(e, [[0, 0], [200, 0], [400, 0.15], [1450, 0.15], [1650, 0]]),
    ],
    gaze: [-0.012 * sad, -0.008 * sad],
    lids: [0.28 * sad, 0.12 * sad],
    brows: [lerp(0.6 * start, -0.25, sad), lerp(0.2 * start, 0.75, sad)],
    mouth: [lerp(lerp(0.6, -0.2, start), -0.75, sad), 0.22 * start],
    sweat: e >= 300 && e < 1150 ? 0.8 : 0,
    antennaKick: [-0.3 * start, 0],
  };
}

/** Talking: syllables at 6 Hz from `from` to `to`, each opening the mouth to its own height. */
const TALK = { from: 100, to: 1080, hz: 6 } as const;

/** How open the mouth is `e` ms in: closed between syllables, each a little different. */
function syllable(e: number): { open: number; n: number } {
  if (e < TALK.from || e >= TALK.to) return { open: 0, n: -1 };
  const slot = ((e - TALK.from) / 1000) * TALK.hz;
  const n = Math.floor(slot);
  return { open: (0.36 + 0.3 * hash(n + 17)) * Math.sin(Math.PI * (slot - n)) ** 0.8, n };
}

/**
 * It speaks: a breath in (the head lifts a hair), then the mouth opens and closes with each syllable, the brows lifting on
 * the stressed ones, the head nodding the beat, and the left hand opens out to explain.
 */
function talk(e: number): Draft {
  const { open, n } = syllable(e);
  const on = span(e, 100, 200, 1000, 1150);
  const gesture = span(e, 60, 260, 980, 1180);
  return {
    ...FACING,
    head: [-0.05 * ramp(e, 0, 100) * (1 - ramp(e, 1000, 1150)) + 0.08 * Math.max(0, wave(e - 100, 2)) * on, 0, 0.06 * wave(e, 0.9, 0.5) * on],
    gaze: LOOKING_AT_YOU,
    lids: [0, 0.2 * on],
    brows: [0.15 * on + (n >= 0 ? 0.25 * hash(n + 3) : 0) * on, 0],
    mouth: [0.45, open],
    armL: arm(0.65 * gesture, -0.5 * gesture, 0.3 * gesture, 1.1 * gesture + 0.15 * wave(e, 2) * span(e, 150, 250, 950, 1050), -0.2 * gesture, 0.4 * gesture),
  };
}

/** Waving: the beat (Hz), from when the arm is up, and how long it waves. */
const HELLO = { hz: 2.1, from: 420 } as const;

/**
 * A wave: the face turns to the person and smiles first, the head tilts 80 ms later and the body leans into it 160 ms
 * later; the right arm pulls back (anticipation), sweeps up in an arc, out to the side and forward, and waves an open hand
 * beside the head (WAVE_UP), the elbow and the wrist behind the shoulder, then comes down.
 */
function hello(e: number): Draft {
  const face = ramp(e, 0, 60) * (1 - ramp(e, 1250, 1480));
  const headIn = ramp(e, 80, 200) * (1 - ramp(e, 1250, 1480));
  const body = ramp(e, 160, 360) * (1 - ramp(e, 1250, 1480));
  const p = (Math.max(0, e - HELLO.from) / 1000) * HELLO.hz * 2 * Math.PI;
  const w = span(e, HELLO.from - 40, HELLO.from + 100, 1150, 1260);
  return {
    ...FACING,
    pelvis: { y: 0.22, lean: [0, 0.05 * body], pivot: "feet" },
    armR: waving(
      keys(e, [[0, 0], [20, 0], [170, -0.35], [HELLO.from, WAVE_UP.swing], [1200, WAVE_UP.swing], [1450, 0]]),
      keys(e, [[0, 0], [170, 0], [HELLO.from, WAVE_UP.twist], [1200, WAVE_UP.twist], [1450, 0]]),
      keys(e, [[0, 0], [20, 0], [170, 0.12], [HELLO.from, WAVE_UP.raise], [1200, WAVE_UP.raise], [1450, 0]]),
      keys(e, [[0, 0], [20, 0], [170, 0.75], [HELLO.from, WAVE_UP.elbow], [1200, WAVE_UP.elbow], [1450, 0]]),
      p,
      w,
    ),
    head: [-0.06 * headIn, 0, 0.06 * headIn + 0.015 * w * Math.sin(p - 0.6)],
    gaze: LOOKING_AT_YOU,
    lids: [0, 0.4 * face],
    brows: [0.35 * face, 0],
    mouth: [lerp(0.6, 1, face), 0.25 * face],
    blush: 0.45 * face,
  };
}

/**
 * Thinking: the eyes go up and to the side first, the head follows 80 ms later and the body leans back 160 ms later; the
 * right hand dips, then goes to the chin and taps it; the mouth purses, the eyes drift; then all of it comes back. The
 * "…" is the page's, beside the head.
 */
function think(e: number): Draft {
  const out = 1 - ramp(e, 1950, 2250);
  const eyes = ramp(e, 0, 50) * out;
  const headIn = ramp(e, 80, 320) * out;
  const body = ramp(e, 160, 420) * out;
  const drift = span(e, 600, 900, 1700, 1900);
  const tap = 0.012 * Math.abs(wave(e, 1.4)) * span(e, 700, 800, 1650, 1750);
  const armR = e < 260
    ? arm(keys(e, [[0, 0], [60, 0], [260, -0.2]]), 0, keys(e, [[0, 0], [60, 0], [260, 0.15]]), keys(e, [[0, 0], [60, 0], [260, 0.5]]), 0, 0, 0.3)
    : e < 2150 ? handDown(e, 1950, 2150, [-0.12, 0.62 + tap, 0.26], 0.65) : ARM_DOWN;
  return {
    ...FACING,
    pelvis: { y: 0.22, lean: [-0.04 * body, 0], pivot: "feet" },
    armR,
    armL: arm(-0.15 * body, 0, 0.3 * body, 0.6 * body, 0, 0, 0.3),
    head: [-0.3 * headIn, 0.25 * headIn, -0.15 * headIn + 0.04 * wave(e, 0.7) * drift],
    gaze: [0.012 * eyes + 0.006 * wave(e, 0.4) * drift, 0.019 * eyes],
    lids: [0.15 * headIn, 0],
    brows: [0.35 * eyes, -0.1 * eyes],
    mouth: [lerp(0.6, -0.15, eyes), 0],
  };
}

/** A click: crouch, one little hop, smiling eyes, a squash on landing and the antenna's whip. */
function poke(e: number): Draft {
  const h = hop(e, 120, 440, 0.12);
  const face = span(e, 0, 60, 760, 930);
  const raise = keys(e, [[0, 0], [100, 0.1], [250, 0.9], [440, 0.5], [650, 0]]);
  const swing = keys(e, [[0, 0], [100, -0.3], [250, 0.2], [600, 0]]);
  const elbow = keys(e, [[0, 0], [100, 0.3], [250, 0.45], [650, 0]]);
  return {
    ...FACING,
    pelvis: { y: 0.22 + h, lean: [keys(e, [[0, 0], [100, 0.08], [250, -0.03], [600, 0]]), 0], pivot: "feet" },
    squash: [keys(e, [[0, 1], [100, 0.8], [135, 1.09], [280, 1], [425, 1.05], [455, 0.74], [580, 1.04], [700, 1]]), 1],
    ...feetUp(h),
    armL: arm(swing, 0, raise, elbow, 0, 0, 0.2),
    armR: arm(swing, 0, raise, elbow, 0, 0, 0.2),
    head: [keys(e, [[0, 0], [80, 0], [110, 0.08], [260, -0.1], [500, 0.05], [700, 0]]), 0, 0],
    gaze: LOOKING_AT_YOU,
    lids: [0, 0.8 * face],
    brows: [0.4 * face, 0],
    mouth: [lerp(0.6, 1, face), 0.3 * face],
    blush: 0.5 * face,
    antennaKick: [landingKick(e - 440), 0],
  };
}
