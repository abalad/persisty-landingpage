/** A point or a direction in the character's space, in units (1 ≈ 100 px). */
export type V3 = [number, number, number];

/** Where the middle joint and the end of a two-bone chain go, and whether the end got to the target. */
export interface Chain { mid: V3; end: V3; reached: boolean }

const EPS = 1e-9;

const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: V3): V3 => add([0, 0, 0], a, 1 / len(a));

/** Some unit vector at a right angle to the unit `u`. */
function anyPerpendicular(u: V3): V3 {
  return unit(cross(u, Math.abs(u[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
}

/** The part of `pole` at a right angle to the unit `u`, as a unit vector: the side the middle joint bends to. */
function bendSide(pole: V3, u: V3): V3 {
  const off = add(pole, u, -dot(pole, u));
  return len(off) > EPS ? unit(off) : anyPerpendicular(u);
}

/**
 * Two bones by the law of cosines: where the middle joint (knee, elbow) goes for the end to reach `target`, bent towards `pole`; out of reach, straight at it.
 * `pole` is a direction (the knee's is forward, [0, 0, 1]); only its part across the root→target line counts.
 * Closer than the bones can fold (|upper − lower|), the chain folds flat on the line towards the target and doesn't reach it either.
 */
export function twoBone(root: V3, target: V3, upper: number, lower: number, pole: V3): Chain {
  const d = add(target, root, -1);
  const far = len(d);
  // The target on the root itself leaves no line to follow: lay one across the pole.
  const u = far > EPS ? add([0, 0, 0], d, 1 / far) : len(pole) > EPS ? anyPerpendicular(unit(pole)) : [0, -1, 0] as V3;
  const max = upper + lower;
  if (far > max + EPS) return { mid: add(root, u, upper), end: add(root, u, max), reached: false };
  const min = Math.abs(upper - lower);
  const reached = far >= min - EPS;
  const l = Math.min(Math.max(far, min), max);
  // How far along the line the middle joint sits, and how far off it.
  const a = l > EPS ? (upper * upper - lower * lower + l * l) / (2 * l) : 0;
  const h = Math.sqrt(Math.max(0, upper * upper - a * a));
  const mid = add(add(root, u, a), bendSide(pole, u), h);
  return { mid, end: reached ? [target[0], target[1], target[2]] : add(root, u, l), reached };
}
