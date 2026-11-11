import type { MascotRect, Platform } from "./types";
import { HEADROOM } from "./layout";

/**
 * The screen's windows as platforms for the floating mascot, pure: logical screen px, times in ms on the page's clock. Which
 * tops hold him, how the window under him moves (from the reads Rust sends, only when the list changes), and when a new
 * list is a change of scene rather than windows going away.
 */

/** How far past a read the support's top and left are guessed at most (ms): less than the feet's lag, so the guess never
 * carries them ahead of the window. */
export const PREDICT_MS = 50;
/** Room the feet need from a window's ends (px). */
export const MARGIN = 10;
/** The smallest window that holds him (px, w × h): the body is ~70 px wide. */
export const MIN_SUPPORT = [80, 40] as const;
/** A window this much wider, narrower, taller or shorter (share of its size) than when it last stood still is resized. */
const RESIZED = 0.1;
/** A change of scene: this share of the last list's windows gone, of at least `SCENE_MIN`. */
const SCENE_GONE = 0.6;
const SCENE_MIN = 3;

/** One read of a window: when (the page's clock) and where. */
export interface Sample {
  at: number;
  rect: Platform;
}

/** On one axis, the part both edges moved together: nothing when they went apart or one stayed. */
const shared = (a: number, b: number) => (a > 0 && b > 0 ? Math.min(a, b) : a < 0 && b < 0 ? Math.max(a, b) : 0);

/** How far a window moved from `a` to `b`: on each axis, what both its edges did together. A resize is not a move. */
export function moveOf(a: Platform, b: Platform): { dx: number; dy: number } {
  return { dx: shared(b.x - a.x, b.x + b.w - (a.x + a.w)), dy: shared(b.y - a.y, b.y + b.h - (a.y + a.h)) };
}

/**
 * The support's velocity (px/s) and its top and left guessed at `now`, from its reads, oldest first. Its last read is old
 * once it is more than 2× the cadence (the list's period) behind `now`: then it stands where it was read. Fresh, the speed
 * is the mean between the last two reads, when they are within 2× the cadence of each other (further apart, the window
 * stood still between them: the list only comes when something changed). Resizes are not moves (`moveOf`). The top and left
 * are carried on by that speed for what has passed since the last read, at most `PREDICT_MS`.
 */
export function supportMotion(samples: Sample[], now: number, cadence: number): { vx: number; vy: number; top: number; left: number } {
  const last = samples[samples.length - 1];
  if (!last) return { vx: 0, vy: 0, top: 0, left: 0 };
  const prev = samples[samples.length - 2];
  const fresh = 2 * cadence;
  let vx = 0;
  let vy = 0;
  const gap = prev ? last.at - prev.at : Infinity;
  if (prev && now - last.at <= fresh && gap > 0 && gap <= fresh) {
    const m = moveOf(prev.rect, last.rect);
    vx = (m.dx * 1000) / gap;
    vy = (m.dy * 1000) / gap;
  }
  const ahead = Math.min(Math.max(now - last.at, 0), PREDICT_MS);
  return { vx, vy, top: last.rect.y + (vy * ahead) / 1000, left: last.rect.x + (vx * ahead) / 1000 };
}

/**
 * Whether the support, read at `last` after `prev`, is going away rather than being carried: more than 10% off `settled`
 * (its size when it last stood still) in width or height, and its move between the two reads (`moveOf`), over the time
 * between them however long it is, faster than `fast` px/s, or down faster than `down`. A minimize: the genie first widens
 * the window at the same top (a resize), then drops its top fast at almost the same height while it shrinks.
 */
export function goingAway(prev: Sample, last: Sample, settled: { w: number; h: number }, fast: number, down: number): boolean {
  const gap = last.at - prev.at;
  const r = last.rect;
  if (gap <= 0 || (Math.abs(r.w - settled.w) <= RESIZED * settled.w && Math.abs(r.h - settled.h) <= RESIZED * settled.h)) return false;
  const m = moveOf(prev.rect, r);
  const vx = (m.dx * 1000) / gap;
  const vy = (m.dy * 1000) / gap;
  return Math.hypot(vx, vy) > fast || vy > down;
}

/** Whether a window in front of `windows[index]` (earlier in the list) is over its top where the feet are. */
export function covered(windows: Platform[], index: number, feetX: number): boolean {
  const top = windows[index]!.y;
  for (let j = 0; j < index; j += 1) {
    const r = windows[j]!;
    if (feetX >= r.x && feetX < r.x + r.w && top >= r.y && top < r.y + r.h) return true;
  }
  return false;
}

/**
 * Whether the top of `windows[index]` holds feet at `feetX`: they fit with `MARGIN` from its ends; it is at least `HEADROOM`
 * under the top of `work` (the box never leaves the work area); the window is `MIN_SUPPORT` or bigger; no window in front
 * covers it there; and it is not `origin`, the window he slipped from in this fall.
 */
export function validTop(windows: Platform[], index: number, feetX: number, work: MascotRect, origin: number | null): boolean {
  const w = windows[index];
  if (!w || w.id === origin) return false;
  return (
    w.w >= MIN_SUPPORT[0] &&
    w.h >= MIN_SUPPORT[1] &&
    feetX >= w.x + MARGIN &&
    feetX <= w.x + w.w - MARGIN &&
    w.y >= work.y + HEADROOM &&
    !covered(windows, index, feetX)
  );
}

/** Whether `next` is another scene (a Space or desktop switch, the screen locked) rather than windows going: at least 60% of
 * the windows in `prev` are gone, of 3 or more. */
export function sceneChange(prev: Platform[], next: Platform[]): boolean {
  if (prev.length < SCENE_MIN) return false;
  const ids = new Set(next.map((w) => w.id));
  const gone = prev.filter((w) => !ids.has(w.id)).length;
  return gone >= SCENE_GONE * prev.length - 1e-9;
}
