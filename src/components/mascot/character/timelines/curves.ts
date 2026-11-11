import type { Arm, Leg } from "../pose";

/**
 * The small vocabulary the timelines are written in: easing, ramps, keyed tracks, hops, and the arm and leg shapes.
 * Times are ms; everything is pure, so a timeline is a function of its clock.
 */

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Slow in and out. */
export const smooth = (k: number) => {
  const x = clamp(k, 0, 1);
  return x * x * (3 - 2 * x);
};
/** 0 before `a`, 1 after `b`, eased in and out between. */
export const ramp = (t: number, a: number, b: number) => (b > a ? smooth((t - a) / (b - a)) : t >= b ? 1 : 0);
/** Up from 0 over [a, b], held, and back down over [c, d]: a gesture that comes and goes. */
export const span = (t: number, a: number, b: number, c: number, d: number) => ramp(t, a, b) * (1 - ramp(t, c, d));
/** A sine of `hz` at `t` ms. */
export const wave = (t: number, hz: number, phase = 0) => Math.sin((t / 1000) * hz * 2 * Math.PI + phase);

/**
 * A keyed track: [ms, value] pairs in order, eased in and out from one to the next, held before the first and after the
 * last. Easing between every key lets a pose pass through, like an animator's keys with spline tangents flattened.
 */
export function keys(t: number, k: readonly (readonly [number, number])[]): number {
  if (t <= k[0]![0]) return k[0]![1];
  for (let i = 1; i < k.length; i++) {
    const [t1, v1] = k[i]!;
    if (t < t1) {
      const [t0, v0] = k[i - 1]!;
      return lerp(v0, v1, smooth((t - t0) / (t1 - t0)));
    }
  }
  return k[k.length - 1]![1];
}

/** A hop over [from, to] (ms) to `height` units: a parabola, as gravity draws it. */
export function hop(t: number, from: number, to: number, height: number): number {
  if (t <= from || t >= to) return 0;
  const k = (t - from) / (to - from);
  return 4 * height * k * (1 - k);
}

/** A cheap, repeatable 0–1 for an integer: the same syllable or beat is always the same. */
export function hash(n: number): number {
  let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** An arm by its angles (pose.ts): shoulder [swing forward, twist, raise], elbow, wrist [bend, turn], grip. */
export const arm = (swing: number, twist: number, raise: number, elbow: number, bend = 0, turn = 0, grip = 0): Arm =>
  ({ kind: "angles", shoulder: [swing, twist, raise], elbow, wrist: [bend, turn], grip });
/**
 * The wave (someone asking, the terminal's `wave`, the cursor coming back), the arm up: the upper arm out to the side a
 * little above the shoulder and towards the camera (a negative swing brings an arm above the horizontal forward; a positive
 * one sent it behind the head), the twist that turns the elbow's fold up, so the forearm stands beside the head with the
 * open palm to the camera and the thumb out to the side. `elbow` is the forearm's middle, leaning out a little; the beat
 * swings it `beat` either way about the elbow, out and back in, the shoulder bobbing `bob`; the hand is bent back in by
 * `wrist` and flicks a beat behind (`wag`), so it tilts between upright and towards the head and the thumb never points
 * up. Folded further in, the thumb would touch the head's outline; tilted out, the hand reads as a thumb up.
 */
export const WAVE_UP = { swing: -0.4, twist: 1.6, raise: 1.95, elbow: 0.5, beat: 0.18, wrist: 0.6, wag: 0.1, bob: 0.05 } as const;

/**
 * The waving arm: `swing`, `twist`, `raise` and `elbow` as each wave keys them (from its anticipation up to WAVE_UP), `p`
 * the beat's phase (radians) and `w` 0–1 how much it waves: the forearm swings out and in, the shoulder bobbing with it,
 * the hand a beat behind and bent back in a little (`wrist`), so the fingers stay up and the thumb out to the side. The
 * hand is open (grip 0).
 */
export function waving(swing: number, twist: number, raise: number, elbow: number, p: number, w: number): Arm {
  return arm(
    swing,
    twist,
    raise + w * WAVE_UP.bob * Math.sin(p + 0.8),
    Math.max(0, elbow + w * WAVE_UP.beat * Math.sin(p)),
    w * (WAVE_UP.wrist + WAVE_UP.wag * Math.sin(p - 1.4)),
    0,
    0,
  );
}

/** A hand on a point of the stage. */
export const reach = (x: number, y: number, z: number, grip = 0): Arm => ({ kind: "reach", at: [x, y, z], grip });
/** The arm hanging at rest. */
export const ARM_DOWN: Arm = arm(0, 0, 0, 0);
/** A foot planted where it stands at rest (side 0 is the character's left, +x), `up` units off the floor. */
export const foot = (side: 0 | 1, up = 0, x = 0, z = 0): Leg => ({ kind: "foot", at: [(side === 0 ? 0.12 : -0.12) + x, up, 0.04 + z] });
export const HANG: Leg = { kind: "hang" };
