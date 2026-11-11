/**
 * Draws from a fixed seed (mulberry32): the same numbers every time, in [0, 1). The tests and the gallery use it, so a
 * blink, a saccade or a quirk's interval falls on the same instant at every play; the floating window uses Math.random.
 */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
