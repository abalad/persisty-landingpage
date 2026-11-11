import type { MascotRect } from "./types";
import { FLOOR_GAP, type Point } from "./layout";

/**
 * The screens as the mascot needs them, each one by its work area in logical px (as mascot.rs and the page read them from
 * the monitors): which one is under a point, the nearest one to a point off every screen, its floor, and which of its
 * sides are outer edges, the walls it can bump into. Between two monitors side by side there is no wall.
 */

/** Edges this close (px) touch: each work area is rounded in its own monitor's scale. */
const TOUCH = 1;

const contains = (r: MascotRect, p: Point) => p.x >= r.x && p.y >= r.y && p.x < r.x + r.w && p.y < r.y + r.h;
const same = (a: MascotRect, b: MascotRect) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

/** The work area `p` is on, or null off every screen. */
export function workUnder(works: MascotRect[], p: Point): MascotRect | null {
  return works.find((r) => contains(r, p)) ?? null;
}

/** The work area closest to `p` (the one it is on, if any), or null without screens. */
export function nearestWork(works: MascotRect[], p: Point): MascotRect | null {
  let best: MascotRect | null = null;
  let far = Infinity;
  for (const r of works) {
    const dx = Math.max(r.x - p.x, 0, p.x - (r.x + r.w));
    const dy = Math.max(r.y - p.y, 0, p.y - (r.y + r.h));
    const d = Math.hypot(dx, dy);
    if (d < far) {
      best = r;
      far = d;
    }
  }
  return best;
}

/** Where the feet stand on a screen with nothing under them: 30 px above its work area's bottom. */
export function floorAt(work: MascotRect): number {
  return work.y + work.h - FLOOR_GAP;
}

/** Whether each side of `work` is an outer edge at height y: no other work area touches it there (±1 px). */
export function outerSides(works: MascotRect[], work: MascotRect, y: number): { left: boolean; right: boolean } {
  const beside = (edge: number, side: "left" | "right") =>
    works.some(
      (r) =>
        r !== work &&
        !same(r, work) &&
        y >= r.y - TOUCH &&
        y <= r.y + r.h + TOUCH &&
        // Left of `work`, a neighbour's right side touches it; right of it, a neighbour's left side.
        Math.abs((side === "left" ? r.x + r.w : r.x) - edge) <= TOUCH,
    );
  return { left: !beside(work.x, "left"), right: !beside(work.x + work.w, "right") };
}
