import { PHYS, type PhysicsCues } from "../../physics";
import type { V3 } from "../ik";
import type { Arm, Draft, Leg } from "../pose";
import { SPRINGS, type Tuning } from "../springs";
import { HANG, arm, clamp, keys, lerp, ramp, reach, smooth, span, wave } from "./curves";

/**
 * The body of the physics (the spec's "Andar junto e cair" and "Passeio"), as timelines: the fall, the three landings by
 * height, the stroll's steps and the little step that ends it. Pure functions of the physics' cues and of their own
 * clocks (ms); the director decides which of their channels the physics claims (director.ts). They follow the spec's
 * principles: the weight of a fall shows in how deep the knees bend, how much the belly shakes and how much dust rises;
 * every move has its anticipation (the weight on the standing leg before the first step, a lean forward before getting
 * up); what stops goes on and settles (the antenna, the arms, the belly).
 *
 * The knees bend mostly by the squash: the animator sinks the pelvis 0.4 per unit of squash under 1 (0.85 → 6 px), and the
 * squash's and the pelvis' springs (4 Hz, ζ 0.4) come from the fall's stretch and pass their targets. So right after a
 * touchdown the squash's target rises again (it is passed on the way down), the pelvis' dips only a little more, and the
 * body shows about 6 px down on a light landing, 12 on a medium one, and sits on the floor in a tumble without going
 * through it (tuned by simulating both springs from the fall). Feet are planted in the stage's space, which goes along
 * with the window: walking, the box moves with the feet, so a foot on the floor goes back in it as fast as the box goes
 * forward and stays put on the screen. A prop's `since` is on the landing's own clock; the director moves it to the rig's.
 */

export type Landing = "light" | "medium" | "tumble";
/** How long each landing lasts (ms). */
export const LANDING_MS = { light: 600, medium: 900, tumble: 1800 } as const;

/** A fall under 60 px lands light, up to 300 medium, over 300 is a tumble (the physics' PHYS.light and PHYS.tumble). */
export function landingOf(height: number): Landing {
  return height < PHYS.light ? "light" : height <= PHYS.tumble ? "medium" : "tumble";
}

/** The eyes go first, the head 80 ms later, the body 160 ms later (the spec's "Antecipação"). */
const LEAD = { head: 80, body: 160 } as const;
/** Where the feet stand at rest: x ±0.12 (left is +x), z 0.04. */
const FOOT_X = 0.12;
const FOOT_Z = 0.04;
const side = (i: 0 | 1) => (i === 0 ? 1 : -1);
/** A whip on the antenna `e` ms after a touchdown, `size` rad: forward, as the ball keeps going down, then back. */
const whip = (e: number, size: number) => (e < 160 ? size * Math.sin((Math.PI * e) / 160) * (1 - e / 320) : 0);
/** The belly's kick at a touchdown: swollen for 50 ms, then let go; its spring (5 Hz, ζ 0.25) shakes it. */
const bellyKick = (e: number, size: number) => (e < 50 ? size : 0);

// ---- the fall --------------------------------------------------------------------------------------------------------

/**
 * In the air: the arms up (`raise`) and flailing in turn at `hz`; the arms' spring (4 Hz) shows about a third of an 8 Hz
 * swing, so the target swings by `flail` to show ±0.3. Stretched with the speed up to `stretch` at `full` px/s (a fall of
 * ~600 px). Into a throw across it leans up to `lean` and turns up to `yaw` at `across` px/s, between the flight's 3/4
 * and the front. The antenna bends back with the speed (`kick`) and flutters.
 *
 * The arms stay out of the head. Raised, the clay arm's shoulder rises to just under the skull's side (model.ts, ARM_UP),
 * so an arm within ~20° of straight up (a raise past ~2.55) puts its elbow on the skull and the forearm and the mitten go
 * through it, whatever the elbow, the wrist or the swing do, and the stretch (1.12) pulls the shoulders in a little more.
 * So the flail's middle is `raise` 2.1, not the spec's 2.5: ±0.3 around it, the crests leave the mitten level with the
 * top of the head and about 2 px clear of it. And the arms get there over `rise` ms, from `from` (about shoulder height):
 * sent straight to the top from wherever they were (hanging, flung ahead in a flight), their spring carried them ~20% past
 * it, over the head.
 */
const FALL = { raise: 2.1, from: 1.4, rise: 300, flail: 0.9, hz: 8, stretch: 0.12, full: 1800, lean: 0.3, yaw: 0.6, across: 1200, kick: 0.3 } as const;

/**
 * Falling (or thrown), `e` ms after it left the floor or the hand (settled in the flail when not told): arms up and
 * flailing, the hands open, the legs hanging on their springs, the body stretched by the speed and leaning into a throw,
 * the antenna bent; eyes wide, brows up, a little "o", looking where it goes. No contact shadow: the floor is far. The head
 * is not the fall's.
 */
export function falling(c: PhysicsCues, now: number, e = Infinity): Draft {
  const p = (now / 1000) * FALL.hz * 2 * Math.PI;
  const speed = Math.hypot(c.vx, c.vy);
  const k = Math.min(1, speed / FALL.full);
  const across = clamp(c.vx / FALL.across, -1, 1);
  const down = clamp(c.vy / FALL.across, -1, 1);
  const raise = lerp(FALL.from, FALL.raise, ramp(e, 0, FALL.rise));
  /** One arm's flail, `q` its phase: up and down, forward and back, the elbow and the wrist behind the shoulder. */
  const flail = (q: number): Arm =>
    arm(0.3 * Math.sin(q + 1.2), 0, raise + FALL.flail * (Math.sin(q) + 0.25 * Math.sin(2 * q)), 0.45 + 0.35 * Math.sin(q - 0.8), 0.5 * Math.sin(q - 1.6), 0, 0);
  return {
    root: { x: 0, yaw: FALL.yaw * across },
    pelvis: { y: 0.22, lean: [0, -FALL.lean * across], pivot: "feet" },
    squash: [1 + FALL.stretch * k, 1],
    chest: { twist: 0.08 * Math.sin(p / 2), breath: 0 },
    armL: flail(p),
    armR: flail(p + Math.PI),
    legL: HANG,
    legR: HANG,
    gaze: [0.012 * across, -0.012 * down],
    lids: [0, 0],
    brows: [0.85, 0.45],
    mouth: [-0.15, 0.5],
    blush: 0,
    eyes: "normal",
    sweat: 0,
    stars: null,
    dust: null,
    shadow: 0,
    antennaKick: [-FALL.kick * k - 0.06 * Math.sin(0.75 * p + 1), 0.35 * across + 0.08 * Math.sin(0.75 * p)],
  };
}

// ---- the landings ----------------------------------------------------------------------------------------------------

/** The landing `e` ms after touching down from `height` px, or null before it and once it is over. */
export function landing(height: number, e: number): Draft | null {
  const kind = landingOf(height);
  if (!(e >= 0) || e >= LANDING_MS[kind]) return null;
  switch (kind) {
    case "light":
      return light(clamp(height / PHYS.light, 0, 1), e);
    case "medium":
      return medium(clamp((height - PHYS.light) / (PHYS.tumble - PHYS.light), 0, 1), e);
    case "tumble":
      return tumble(e);
  }
}

const planted = (i: 0 | 1, x = FOOT_X, y = 0, z = FOOT_Z): Leg => ({ kind: "foot", at: [side(i) * x, y, z] });
const FEET = { legL: planted(0), legR: planted(1) } as const;

/**
 * A light landing (`w` 0…1 within it, by height): the knees bend (the pelvis a little down, and the squash's sink), squash
 * 0.85 → 1.04 → 1, the body pitching forward a touch; the arms open to ±0.9 for balance and come back down; two puffs.
 * The fall's surprise settles on the face over `FACE_MS.light` (the "o" closes back to the smile, the brows come down),
 * so it does not cut to rest at the touchdown; then the face is whoever's it was.
 */
function light(w: number, e: number): Draft {
  const dip = 0.003 + 0.006 * w;
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: keys(e, [[0, 0.22 - dip], [120, 0.22 - dip], [260, 0.222], [420, 0.22]]), lean: [keys(e, [[0, 0.07], [110, 0.07], [300, -0.02], [480, 0]]), 0], pivot: "feet" },
    squash: [keys(e, [[0, 0.85], [30, 0.88], [100, 0.95], [210, 1.04], [340, 0.995], [480, 1]]), 1],
    chest: { twist: 0, breath: bellyKick(e, 0.02 + 0.015 * w) },
    ...FEET,
    armL: landingArms(e, 0.9, 560),
    armR: landingArms(e, 0.9, 560),
    sweat: 0,
    stars: null,
    dust: { count: 2, since: 0 },
    shadow: 1,
    antennaKick: [whip(e, 0.3), 0],
    ...(e < FACE_MS.light ? settling(e) : {}),
  };
}

/** How long a landing holds the face after the touchdown (ms): the fall's surprise settling, or the medium one's wince. */
const FACE_MS = { light: 220, medium: 320 } as const;
/** The fall's face (falling's brows and "o") settling back to rest over FACE_MS.light. */
function settling(e: number): Draft {
  const k = ramp(e, 0, FACE_MS.light);
  return { lids: [0, 0], brows: [lerp(0.7, 0, k), lerp(0.35, 0, k)], mouth: [lerp(-0.15, 0.6, ramp(e, 40, FACE_MS.light)), lerp(0.4, 0, ramp(e, 0, 160))] };
}

/** Arms flung open to `raise` at the touchdown (from wherever the fall had them), held, and down by `down` ms. */
const landingArms = (e: number, raise: number, down: number): Arm =>
  arm(keys(e, [[0, 0.22], [down * 0.35, 0.12], [down, 0]]), 0, keys(e, [[0, raise], [down * 0.35, raise], [down, 0]]), keys(e, [[0, 0.4], [down, 0]]), keys(e, [[0, 0.25], [down, 0]]));

/**
 * A medium landing (`w` 0…1 within it, by height): the knees deep, squash 0.72 and a stretch past the middle, the belly
 * shaking, the body pitching forward and back; a wince: the eyes squeezed shut for 120 ms, the brows down, the mouth
 * tight, open again by FACE_MS.medium (then the face is whoever's it was); the head sinking, then past the middle, up (the
 * director lays it over whoever has the head); four puffs.
 */
function medium(w: number, e: number): Draft {
  const dip = 0.012 + 0.015 * w;
  const shut = 1 - ramp(e, 120, 200);
  const ease = ramp(e, 150, FACE_MS.medium);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: {
      y: keys(e, [[0, 0.22 - dip], [140, 0.22 - dip], [330, 0.224], [540, 0.219], [700, 0.22]]),
      lean: [keys(e, [[0, 0.12], [140, 0.12], [330, -0.05], [560, 0.015], [750, 0]]), 0],
      pivot: "feet",
    },
    squash: [keys(e, [[0, 0.72], [30, 0.77], [100, 0.85], [270, 1.06], [440, 0.985], [620, 1.005], [760, 1]]), 1],
    chest: { twist: 0, breath: bellyKick(e, 0.06 + 0.04 * w) },
    ...FEET,
    armL: landingArms(e, 1.2, 840),
    armR: landingArms(e, 1.2, 840),
    ...(e < FACE_MS.medium ? { lids: [shut, 0.35 * shut], brows: [lerp(-0.5, 0, ease), lerp(-0.15, 0, ease)], mouth: [lerp(-0.45, 0.6, ease), lerp(0.12, 0, ease)] } satisfies Draft : {}),
    head: [keys(e, [[0, 0], [70, 0.2], [240, -0.09], [420, 0.03], [620, 0]]), 0, 0],
    sweat: 0,
    stars: null,
    dust: { count: 4, since: 0 },
    shadow: 1,
    antennaKick: [whip(e, 0.5), 0],
  };
}

/** Patting the dust off: each hand strokes down the front of the belly at `hz`, the two in turn, from `top` to `low`. */
const DUST_OFF = { from: 1320, to: 1640, hz: 5, x: 0.17, top: 0.44, low: 0.34, z: 0.245 } as const;
/** Where a hand hangs at rest (model.ts), give or take: a reaching hand comes down to it before the arm goes back to angles. */
const HAND_REST: V3 = [0.345, 0.25, 0.06];

/**
 * A tumble: it sits with the impact, the pelvis 0.15 down and leaning back, the legs out in front (kicked up a little),
 * the arms flung up and then propping it behind; X eyes for 0.6 s, two quick stars, six puffs, the head lolling. Then a
 * hard blink and a shake of the head; the feet come back under it and it leans forward (anticipation), stands up, looks
 * down and pats the dust off its belly with both hands, and stands as at rest.
 */
function tumble(e: number): Draft {
  const dazed = 1 - ramp(e, 150, 700);
  const shake = e >= 600 && e < 900 ? 0.22 * Math.exp(-(e - 600) / 120) * Math.sin(((e - 600) / 1000) * 6 * 2 * Math.PI) : 0;
  const blink = span(e, 600, 630, 690, 770);
  const look = span(e, 1250, 1330, 1600, 1720);
  const feetX = keys(e, [[0, 0.13], [1050, 0.13], [1300, FOOT_X]]);
  const feetZ = keys(e, [[0, 0.06], [150, 0.17], [820, 0.17], [1050, 0.07], [1300, FOOT_Z]]);
  const kick = keys(e, [[0, 0], [60, 0.05], [220, 0]]);
  return {
    root: { x: 0, yaw: 0 },
    pelvis: {
      y: keys(e, [[0, 0.15], [60, 0.115], [150, 0.097], [300, 0.078], [450, 0.07], [800, 0.075], [980, 0.09], [1100, 0.12], [1300, 0.225], [1420, 0.218], [1550, 0.22]]),
      lean: [
        keys(e, [[0, -0.08], [110, -0.26], [280, -0.17], [450, -0.22], [800, -0.21], [1000, 0.3], [1150, 0.32], [1320, 0.04], [1450, 0.06], [1650, 0.06], [1760, 0]]),
        0.07 * wave(e, 2) * dazed,
      ],
      pivot: "feet",
    },
    squash: [keys(e, [[0, 0.9], [60, 0.92], [200, 1.05], [380, 0.98], [540, 1], [1000, 1], [1100, 0.94], [1300, 1.05], [1450, 1]]), 1],
    chest: { twist: 0.06 * Math.sin(((e - DUST_OFF.from) / 1000) * DUST_OFF.hz * 2 * Math.PI) * span(e, 1300, 1360, 1600, 1660), breath: bellyKick(e, 0.12) },
    legL: planted(0, feetX, kick, feetZ),
    legR: planted(1, feetX, kick * 0.7, feetZ),
    armL: tumbleArm(0, e),
    armR: tumbleArm(1, e),
    head: [
      keys(e, [[0, 0.1], [120, -0.16], [300, 0.08], [500, 0.03], [900, 0.03], [1100, 0.12], [1300, 0.05], [1400, 0.3], [1600, 0.3], [1760, 0]]),
      shake,
      0.15 * wave(e, 2.4, 0.6) * dazed,
    ],
    gaze: [0, -0.015 * look],
    lids: [Math.max(blink, 0.3 * look, 0.12 * span(e, 770, 800, 1000, 1100)), 0],
    brows: [
      keys(e, [[0, 0.5], [300, 0.3], [600, 0.15], [900, -0.15], [1250, -0.2], [1400, -0.1], [1760, 0]]),
      keys(e, [[0, 0.4], [300, 0.55], [700, 0.5], [900, -0.25], [1250, -0.3], [1400, 0.1], [1760, 0]]),
    ],
    mouth: [
      keys(e, [[0, -0.4], [600, -0.3], [900, -0.1], [1300, 0.1], [1450, 0.3], [1760, 0.6]]) + 0.15 * wave(e, 1.6) * dazed,
      keys(e, [[0, 0.35], [400, 0.2], [700, 0.08], [900, 0]]),
    ],
    blush: 0,
    eyes: e < 600 ? "x" : "normal",
    sweat: 0,
    stars: { mode: "tumble", since: 0 },
    dust: { count: 6, since: 0 },
    shadow: 1,
    antennaKick: [whip(e, 0.7) + 0.25 * keys(e, [[1050, 0], [1250, 0.4], [1400, 0]]), 0],
  };
}

/**
 * An arm through the tumble: flung up at the impact, down to prop the body behind it, forward to help it up, then the hand
 * on the belly patting it and back down to its side.
 */
function tumbleArm(i: 0 | 1, e: number): Arm {
  const s = side(i);
  if (e < DUST_OFF.from - 60) {
    return arm(
      keys(e, [[0, 0.2], [110, 0.1], [300, -0.5], [820, -0.55], [1050, 0.65], [1200, 0.5]]),
      0,
      keys(e, [[0, 1.3], [110, 1.7], [300, 0.6], [820, 0.55], [1050, 0.3], [1200, 0.35]]),
      keys(e, [[0, 0.3], [300, 0.1], [820, 0.1], [1050, 0.6], [1200, 0.9]]),
      0.2,
      0,
      keys(e, [[0, 0], [420, 0.4], [820, 0.4], [1050, 0]]),
    );
  }
  // Each hand strokes down the belly, the two in turn; then down the side to where it hangs.
  const q = ((e - DUST_OFF.from) / 1000) * DUST_OFF.hz * 2 * Math.PI + (i === 0 ? 0 : Math.PI);
  const stroke = 0.5 + 0.5 * Math.cos(q);
  const y = lerp(DUST_OFF.low, DUST_OFF.top, stroke);
  const off = ramp(e, DUST_OFF.to, DUST_OFF.to + 120);
  const bulge = Math.sin(Math.PI * off);
  return reach(
    s * lerp(DUST_OFF.x, HAND_REST[0], off),
    lerp(y, HAND_REST[1], off),
    lerp(DUST_OFF.z, HAND_REST[2], off) + 0.06 * bulge,
    0.3 * (1 - off),
  );
}

// ---- the walk --------------------------------------------------------------------------------------------------------

/**
 * The stroll: a step every `step` px (the physics' 14), the swinging foot up to `lift`; the hips rise and fall by `hip`
 * around `y` (lowest as a foot lands, highest over the standing foot), sway `sway` over it and lean `lean` forward; the
 * arms swing ±`swing` against the legs, the chest turning with them; 3/4 to where it goes (`yaw`), the eyes first
 * (`gaze`, for `eyes` ms), then the head, then the body. Turned that far with the head straight, the far eye hides behind
 * the skull and the face reads as a profile with one eye: the head turns back towards the camera by `counter`, so the
 * face is 3/4 too. Before the first step the weight goes onto the standing leg (`shift` ms).
 */
const WALK = { step: PHYS.strollStep, lift: 0.06, hip: 0.025, y: 0.2, sway: 0.04, lean: 0.06, swing: 0.3, twist: 0.06, yaw: 1.1, counter: 0.4, gaze: 0.018, eyes: 300, shift: 150 } as const;
/**
 * Where the head turns (rad, against the body: the director adds it to whoever has the head) for the face to point
 * `face` while the body is at `body` (both from the front).
 */
const headFor = (face: number, body: number): V3 => [0, face - body, 0];
/**
 * How far a spring has gone towards a target that jumped `t` ms ago (0 before, 1 there): the body's turn follows its yaw
 * target this way, so the head's counter-turn can keep up with it instead of trailing it (the face swung past 3/4 into a
 * profile). `lead` (ms) is how much earlier to ask for it: the head has a spring of its own.
 */
function along(t: number, [hz, zeta]: Tuning = SPRINGS.yaw, lead = 40): number {
  const s = (t + lead) / 1000;
  if (s <= 0) return 0;
  const w = 2 * Math.PI * hz;
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * s) * (Math.cos(wd * s) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * s));
}
/** Half a stride (units): the swinging foot goes from −REACH to +REACH while the box goes one step on. */
const REACH = WALK.step / 200;

/**
 * The stroll `walked` px into it, `e` ms after it began, going `facing` (+1 to the right). One foot swings while the
 * other stands; the first step starts with the feet together, so it is half a stride. The feet turn 3/4 with the body,
 * keeping the hips' width across it.
 */
export function walk(walked: number, facing: -1 | 1, e: number): Draft {
  const f = facing;
  const n = Math.floor(walked / WALK.step);
  const k = walked / WALK.step - n;
  // The foot on the side it goes to steps first.
  const swinging: 0 | 1 = (n + (f === 1 ? 0 : 1)) % 2 === 0 ? 0 : 1;
  const forward = lerp(n === 0 ? 0 : -REACH, REACH, smooth(k));
  const back = lerp(n === 0 ? 0 : REACH, -REACH, k);
  const lift = WALK.lift * Math.sin(Math.PI * k) * (n === 0 ? ramp(e, 60, 200) : 1);
  const stride: [number, number] = swinging === 0 ? [forward, back] : [back, forward];
  const turn = WALK.yaw * f * ramp(e, LEAD.body, LEAD.body + 260);
  const c = Math.cos(turn);
  const sn = Math.sin(turn);
  const at = (i: 0 | 1): Leg => {
    const l = side(i) * FOOT_X;
    return { kind: "foot", at: [l * c + FOOT_Z * sn + stride[i] * f, i === swinging ? lift : 0, -l * sn + FOOT_Z * c] };
  };
  // Over the standing foot (lean[1] > 0 tips the top towards −x, the character's right); on the first step it gets there first.
  const over = Math.max(Math.sin(Math.PI * k), n === 0 ? ramp(e, 0, WALK.shift) * (1 - k) : 0);
  const sway = WALK.sway * over * (swinging === 0 ? 1 : -1);
  // The face goes round after the eyes and ahead of the body, and stops at 3/4 less the counter-turn.
  const face = (WALK.yaw - WALK.counter) * f * ramp(e, LEAD.head, LEAD.head + 180);
  const body = WALK.yaw * f * along(e - LEAD.body);
  return {
    root: { x: 0, yaw: e >= LEAD.body ? WALK.yaw * f : 0 },
    pelvis: { y: WALK.y - WALK.hip * Math.cos(2 * Math.PI * k), lean: [WALK.lean, sway], pivot: "feet" },
    squash: [1 - 0.012 * (1 - Math.sin(Math.PI * k)), 1],
    chest: { twist: WALK.twist * (stride[0] - stride[1]) / (2 * REACH), breath: 0 },
    legL: at(0),
    legR: at(1),
    armL: arm((-WALK.swing * stride[0]) / REACH, 0, 0.12, 0.35),
    armR: arm((-WALK.swing * stride[1]) / REACH, 0, 0.12, 0.35),
    ...(e < WALK.eyes ? { gaze: [WALK.gaze * f, -0.004] as [number, number] } : {}),
    ...(e >= LEAD.head ? { head: headFor(face, body) } : {}),
    shadow: 1,
  };
}

/** How long the arrival lasts (ms): a little step with each foot, and it faces the front. */
export const ARRIVE_MS = 480;

/**
 * The end of a stroll, from where its feet were (`from`, stage space): the eyes come to the front first, the head after
 * them (from its counter-turn) and the body at 120 ms; the foot behind takes a little step to where it stands at rest, then the other one; the
 * hips settle and the arms come down.
 */
export function arrive(from: readonly [V3, V3], facing: -1 | 1, e: number): Draft | null {
  if (!(e >= 0) || e >= ARRIVE_MS) return null;
  const f = facing;
  const first: 0 | 1 = from[0][0] * f <= from[1][0] * f ? 0 : 1;
  const step = (i: 0 | 1): Leg => {
    const [a, b, up] = i === first ? [0, 220, 0.04] : [160, 400, 0.03];
    const k = ramp(e, a, b);
    const p = from[i];
    return { kind: "foot", at: [lerp(p[0], side(i) * FOOT_X, k), lerp(p[1], 0, k) + up * Math.sin(Math.PI * k), lerp(p[2], FOOT_Z, k)] };
  };
  const face = (WALK.yaw - WALK.counter) * f * (1 - ramp(e, 40, 300));
  const body = WALK.yaw * f * (1 - along(e - 120));
  return {
    root: { x: 0, yaw: e < 120 ? WALK.yaw * f : 0 },
    pelvis: { y: keys(e, [[0, 0.2], [180, 0.205], [380, 0.22]]), lean: [keys(e, [[0, WALK.lean], [300, 0]]), 0], pivot: "feet" },
    squash: [keys(e, [[0, 1], [140, 0.975], [300, 1.01], [460, 1]]), 1],
    chest: { twist: 0, breath: 0 },
    legL: step(0),
    legR: step(1),
    armL: arm(0, 0, keys(e, [[0, 0.12], [400, 0]]), keys(e, [[0, 0.35], [400, 0]])),
    armR: arm(0, 0, keys(e, [[0, 0.12], [400, 0]]), keys(e, [[0, 0.35], [400, 0]])),
    ...(e < 120 ? { gaze: [-0.016 * f, 0] as [number, number] } : {}),
    head: headFor(face, body),
    shadow: 1,
  };
}
