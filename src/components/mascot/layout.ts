import type { CSSProperties } from "react";
import type { MascotSide, Placement } from "./types";

export type Point = { x: number; y: number };

/** The mascot's box (the closed window), in logical px (mascot.rs COLLAPSED). */
export const BOX = { w: 200, h: 200 };
/** The feet inside the box (mascot.rs FEET). */
export const FEET: Point = { x: 100, y: 170 };
/** The head's centre standing, in the box: the skull's centre, 0.89 units above the feet (character/model.ts). */
export const HEAD: Point = { x: 100, y: 81 };
/** The head's centre when only the head peeks from the bottom edge: today's sink, 0.86 units, below HEAD. */
export const HEAD_PEEK: Point = { x: 100, y: 167 };
/** The feet above the work area's bottom. */
export const FLOOR_GAP = 30;
/** How high above the feet the box reaches, and a little more. */
export const HEADROOM = FEET.y + 4;
export const BALLOON_W = 360;
/** How far the balloon reaches into the box: down to just above the antenna (~25 px from the top), or up to just below the feet (170 + 2). */
export const REACH_ABOVE = 22;
export const REACH_BELOW = 28;
/** Where the person's chosen place is kept: the feet, `{x, y}`, logical. */
export const FEET_KEY = "ui.mascot.feet";

/** The closed window's top-left for feet at `feet`. */
export function windowAt(feet: Point): Point {
  return { x: feet.x - FEET.x, y: feet.y - FEET.y };
}

/** The feet for a closed window at `topLeft`. */
export function feetAt(topLeft: Point): Point {
  return { x: topLeft.x + FEET.x, y: topLeft.y + FEET.y };
}

/** Where the mascot's box sits: pinned to the corner it keeps on screen when the balloon opens, so the window can grow or shrink under it without it jumping. */
export function boxStyle(anchor: MascotSide, placement: Placement | null): CSSProperties {
  const vertical = anchor.startsWith("above") ? "bottom" : "top";
  const horizontal = anchor.endsWith("left") ? "right" : "left";
  if (!placement) return { [vertical]: 0, [horizontal]: 0 };
  const { frame, mascot } = placement;
  return {
    [vertical]: vertical === "top" ? mascot.y : frame.h - mascot.y - mascot.h,
    [horizontal]: horizontal === "left" ? mascot.x : frame.w - mascot.x - mascot.w,
  };
}

/** 360 wide, pinned to the side the window grew from (right: 0 when it grew left, left: 0 when right), above or below the mascot, its tail over the mascot's head. */
export function balloonStyle(p: Placement): CSSProperties {
  const grewLeft = p.side.endsWith("left");
  const offset = grewLeft ? p.frame.w - BALLOON_W : 0;
  const tail = { "--balloon-tail": `${p.mascot.x + p.mascot.w / 2 - offset}px` } as CSSProperties;
  const across = grewLeft ? { width: BALLOON_W, right: 0 } : { width: BALLOON_W, left: 0 };
  return p.side.startsWith("above")
    ? { ...tail, ...across, top: 0, height: Math.max(0, p.mascot.y + REACH_ABOVE) }
    : { ...tail, ...across, top: Math.max(0, p.mascot.y + p.mascot.h - REACH_BELOW), bottom: 0 };
}
