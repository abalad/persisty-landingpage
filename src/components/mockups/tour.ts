/*
 * The camera of a guided tour over an app window drawn at desktop size:
 * where to scale and move it so a phone shows the whole window, or one part
 * of it close enough to read. Sizes are in the window's own pixels.
 */

export interface Size {
  w: number;
  h: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Close enough to read on a phone (the app's 13px text lands near 10px), wide enough for a terminal line. */
export const READ_ZOOM = 0.75;

/** Scale, then move: the window's top-left corner lands at (tx, ty) in the view. */
export interface Shot {
  k: number;
  tx: number;
  ty: number;
}

/** The whole window, as large as the view allows, centred. */
export function fitShot(view: Size, stage: Size): Shot {
  const k = Math.min(view.w / stage.w, view.h / stage.h);
  return { k, tx: (view.w - stage.w * k) / 2, ty: (view.h - stage.h * k) / 2 };
}

/** One axis: the part's position, held so the view never shows past the window's edges. */
function place(view: number, stage: number, wanted: number, k: number): number {
  const size = stage * k;
  if (size <= view) return (view - size) / 2;
  return Math.min(0, Math.max(view - size, wanted));
}

/**
 * `focus` at zoom `k`: centred in the view, or with its left edge at `margin`
 * for text that reads from the left.
 */
export function focusShot(view: Size, stage: Size, focus: Rect, k: number, align: "center" | "start" = "center", margin = 12): Shot {
  const x = align === "start" ? margin - focus.x * k : view.w / 2 - (focus.x + focus.w / 2) * k;
  const y = view.h / 2 - (focus.y + focus.h / 2) * k;
  return { k, tx: place(view.w, stage.w, x, k), ty: place(view.h, stage.h, y, k) };
}

/** Which chapter is playing `t` ms into the loop, and how far into it. */
export function chapterAt(chapters: { ms: number }[], t: number): { index: number; elapsed: number } {
  const total = chapters.reduce((sum, c) => sum + c.ms, 0);
  let left = t % total;
  for (let index = 0; index < chapters.length; index++) {
    if (left < chapters[index].ms) return { index, elapsed: left };
    left -= chapters[index].ms;
  }
  return { index: 0, elapsed: 0 };
}

/** The step of a timeline of step durations, `elapsed` ms after it started; the last step holds. */
export function stepAt(durations: number[], elapsed: number): number {
  let left = elapsed;
  for (let step = 0; step < durations.length - 1; step++) {
    if (left < durations[step]) return step;
    left -= durations[step];
  }
  return durations.length - 1;
}
