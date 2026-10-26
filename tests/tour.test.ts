import { describe, expect, it } from "vitest";
import { chapterAt, fitShot, focusShot, stepAt } from "@/components/mockups/tour";

const phone = { w: 360, h: 270 };
const app = { w: 1120, h: 600 };

describe("fitShot", () => {
  it("shows the whole window as large as the view allows, centred", () => {
    const shot = fitShot(phone, app);
    expect(shot.k).toBeCloseTo(360 / 1120);
    expect(shot.tx).toBeCloseTo(0);
    expect(shot.ty).toBeCloseTo((270 - 600 * (360 / 1120)) / 2);
  });
});

describe("focusShot", () => {
  it("centres the part in view at the given zoom", () => {
    expect(focusShot(phone, app, { x: 500, y: 200, w: 100, h: 50 }, 0.8)).toEqual({ k: 0.8, tx: 180 - 550 * 0.8, ty: 135 - 225 * 0.8 });
  });

  it("never shows past the window's top or left edge", () => {
    expect(focusShot(phone, app, { x: 0, y: 0, w: 50, h: 50 }, 0.8)).toEqual({ k: 0.8, tx: 0, ty: 0 });
  });

  it("never shows past the window's bottom or right edge", () => {
    const shot = focusShot(phone, app, { x: 1100, y: 580, w: 20, h: 20 }, 0.8);
    expect(shot.tx).toBeCloseTo(360 - 1120 * 0.8);
    expect(shot.ty).toBeCloseTo(270 - 600 * 0.8);
  });

  it("can put the part's left edge at a margin, for text that reads from the left", () => {
    expect(focusShot(phone, app, { x: 200, y: 200, w: 100, h: 50 }, 0.8, "start", 12).tx).toBeCloseTo(12 - 200 * 0.8);
  });

  it("centres an axis the window does not fill at that zoom", () => {
    expect(focusShot(phone, { w: 300, h: 200 }, { x: 0, y: 0, w: 10, h: 10 }, 1)).toEqual({ k: 1, tx: 30, ty: 35 });
  });
});

describe("chapterAt", () => {
  const chapters = [{ ms: 1000 }, { ms: 2000 }, { ms: 500 }];

  it("finds the chapter playing and how far into it", () => {
    expect(chapterAt(chapters, 0)).toEqual({ index: 0, elapsed: 0 });
    expect(chapterAt(chapters, 999)).toEqual({ index: 0, elapsed: 999 });
    expect(chapterAt(chapters, 1000)).toEqual({ index: 1, elapsed: 0 });
    expect(chapterAt(chapters, 3499)).toEqual({ index: 2, elapsed: 499 });
  });

  it("starts over after the last chapter", () => {
    expect(chapterAt(chapters, 3500)).toEqual({ index: 0, elapsed: 0 });
    expect(chapterAt(chapters, 7100)).toEqual({ index: 0, elapsed: 100 });
  });
});

describe("stepAt", () => {
  it("walks a timeline of step durations and holds the last step", () => {
    const steps = [100, 200, 300];
    expect(stepAt(steps, 0)).toBe(0);
    expect(stepAt(steps, 99)).toBe(0);
    expect(stepAt(steps, 100)).toBe(1);
    expect(stepAt(steps, 299)).toBe(1);
    expect(stepAt(steps, 300)).toBe(2);
    expect(stepAt(steps, 10_000)).toBe(2);
  });
});
