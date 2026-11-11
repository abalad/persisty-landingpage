/** One channel on its way to a target: where it is and how fast it moves. */
export interface Spring { x: number; v: number }

/** Frequency in Hz and damping ratio (below 1 it passes the target and comes back). */
export type Tuning = readonly [hz: number, zeta: number];

/** The longest step a spring takes at once, so it stays stable even at 10 fps. */
export const SUBSTEP = 1 / 120;

/** The spec's starting values ("Molas que passam do ponto"), tuned in the gallery. */
export const SPRINGS: {
  lean: Tuning; squash: Tuning; belly: Tuning; x: Tuning; yaw: Tuning; head: Tuning; arms: Tuning; hangingLegs: Tuning; hang: Tuning;
  antenna: readonly [Tuning, Tuning, Tuning];
} = {
  lean: [2.5, 0.35],          // the body's lean: passes and comes back
  squash: [4, 0.4],           // squash and squashX: the landing sinks, stretches and settles
  belly: [5, 0.25],           // the belly's wobble after a landing
  x: [3, 0.3],                // the x offset: bounces off a wall
  yaw: [3, 0.7],              // turns without spinning
  head: [3.5, 0.5],           // arrives a little after the body
  arms: [4, 0.45],            // follow with a lag
  hangingLegs: [2, 0.25],     // swing like a pendulum
  hang: [1.6, 0.2],           // the body under the head while held up by the pointer
  antenna: [[6, 0.15], [7, 0.15], [8, 0.15]],   // three joints, a long whip
};

/** A longer gap between frames (the Mac waking up) counts as this much: by then the springs are near their targets, and minutes of substeps would freeze the page. */
export const MAX_DT = 1;

/** Semi-implicit, in substeps of at most 1/120 s: v += (ω²(target − x) − 2ζωv)·h; x += v·h. */
export function stepSpring(s: Spring, target: number, tuning: Tuning, dt: number): void {
  if (!(dt > 0)) return;
  const span = Math.min(dt, MAX_DT);
  const w = 2 * Math.PI * tuning[0];
  const k = w * w;
  const c = 2 * tuning[1] * w;
  // Equal substeps: 0.1 s is exactly twelve of 1/120, not twelve and a sliver.
  const n = Math.ceil(span / SUBSTEP - 1e-9);
  const h = span / n;
  for (let i = 0; i < n; i++) {
    s.v += (k * (target - s.x) - c * s.v) * h;
    s.x += s.v * h;
  }
}

/** Whether the spring has arrived: x on the target and v at rest, both within `eps`. */
export function settled(s: Spring, target: number, eps = 1e-3): boolean {
  return Math.abs(s.x - target) < eps && Math.abs(s.v) < eps;
}
