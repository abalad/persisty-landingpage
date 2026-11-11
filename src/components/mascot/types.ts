/* The mascot's geometry types, copied from the desktop app (apps/desktop/src/lib/types.ts). */

/** A window the mascot can stand on: its number and its bounds (logical, top-left origin), nothing else. */
export interface Platform {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A rectangle in logical pixels. */
export interface MascotRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Which way the window grew from the closed mascot. */
export type MascotSide = "above_left" | "above_right" | "below_left" | "below_right";

/** Where the balloon put the window. */
export interface Placement {
  frame: MascotRect;
  side: MascotSide;
  /** The mascot's 200×200 box inside the window. */
  mascot: MascotRect;
}
