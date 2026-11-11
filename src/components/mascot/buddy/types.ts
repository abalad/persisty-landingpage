import type { Dictation, Mood } from "./mood";
import type { Reaction } from "./signals";

/* The terminal mascot's rig interface, copied from the desktop app (apps/desktop/src/features/buddy/rig.ts). */
export interface BuddyRig {
  setMood(mood: Mood): void;
  /** While the person dictates to this terminal the mascot holds a microphone; it wins over the mood. */
  setDictation(dictation: Dictation): void;
  /** The microphone's level, 0…1, about every 50 ms. It only reaches the 3D; nothing renders again. */
  setLevel(level: number): void;
  react(reaction: Reaction): void;
  poke(): void;
  /** Where the pointer is, relative to the mascot: -1…1 on each axis (y down). */
  look(x: number, y: number): void;
  /** Whether the point (x, y, in CSS px of the canvas) lands on the mascot. */
  hit(x: number, y: number): boolean;
  /** Asleep: one frame with the eyes closed, then nothing is drawn until something wakes it (any mood, reaction, poke or look). */
  sleep(on: boolean): void;
  /** Where it rests when nothing asks for it: peeking from the corner, or standing. */
  setRest(rest: "peek" | "stand"): void;
  resize(width: number, height: number, dpr: number): void;
  dispose(): void;
}

export interface RigOptions {
  reduced: boolean;
  /** Told when the mascot rises out of the corner or sinks back. */
  onRaise?: (raised: boolean) => void;
  /** Frames per second while something moves (default 30). */
  fpsActive?: number;
  /** Frames per second at rest (default 12). */
  fpsRest?: number;
  /** Where it rests: peeking from the corner (default) or standing. */
  rest?: "peek" | "stand";
}
