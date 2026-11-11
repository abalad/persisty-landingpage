import type { Mood } from "../buddy/mood";
import type { BuddyRig, RigOptions } from "../buddy/types";
import { hitTest } from "../buddy/rigPure";
import { createAnimator } from "./animate";
import type { BodyCue, BumpCue, DragCue, Frame, Look, Mood3, QuirkCue, Rest, Situation } from "./cues";
import { STILL_BUMP_MS, createDirector } from "./director";
import { createFrameLoop } from "./loop";
import { buildCharacter } from "./model";
import { createProps } from "./props";
import { createStage } from "./stage";
import { LOOK_MS } from "./timelines/base";
import { REACTION_MS } from "./timelines/moods";

/**
 * The floating window's mascot, live in 3D: the articulated character (model.ts) posed by the director, brought there by
 * the animator's springs and drawn on one requestAnimationFrame (loop.ts) at 30 fps while anything moves, 20 while it
 * works and 10 at rest; none while hidden or asleep. With reduced motion (the options' `reduced` at the start, `setCalm`
 * after) it asks for no frames: it holds each pose and draws once per change, and the motor gets no turn.
 * The same interface as the terminal's Buddy rig (features/buddy/rig.ts), which stays as it is.
 */
export interface CharacterRigOptions extends RigOptions {
  /** Frames per second while it works (default 20). */
  fpsWork?: number;
  /** The page's theme at the start: the rim is stronger on the dark one. */
  theme?: "light" | "dark";
  /** The cheaper clay (MeshStandardMaterial), if the CPU asks for it. */
  standard?: boolean;
  /** The draws (blinks, saccades, quirks); Math.random by default. */
  rand?: () => number;
}

export interface CharacterRig extends BuddyRig {
  setTheme(theme: "light" | "dark"): void;
  /** Held by the pointer (the cue's times on the rig's clock, `performance.now()`), or let go (null). */
  setDrag(cue: DragCue | null): void;
  /** A bump into the screen's side, from `cue.start` (the rig's clock). */
  bump(cue: BumpCue): void;
  /**
   * The motor's turn, first in every frame of the one loop (motor.ts `Motor.frame`), or none: true while the physics is
   * active, and the drawing keeps the active pace meanwhile.
   */
  setMotor(fn: ((now: number) => boolean) | null): void;
  /**
   * Run right before each drawing of the one loop (motor.ts `Motor.place`, the host's `flush`), or none: on a stage the
   * box's move goes in the drawing's commit. The drawings outside the loop (asleep, a new size or theme, calm) don't run it.
   */
  setPlacer(fn: (() => void) | null): void;
  /** What the physics says of the body (null without physics: the base stands on its own). */
  setBody(cue: BodyCue | null): void;
  /** A quirk from `cue.start` (the rig's clock; it may be ahead), or none: drawn only idle, awake and standing still. */
  setQuirk(cue: QuirkCue | null): void;
  /** The page's badge with the count shows or not: while it does, no "!" or "?" beside the head. Doesn't wake it. */
  setBadge(on: boolean): void;
  /** Where it rests: standing, peeking, sat on a window's top, dozing standing, or hidden behind the outer edge on `side`. */
  setRest(rest: Rest, side?: -1 | 1): void;
  /**
   * Out of the rest it is in: the way out plays (700 ms, or 500 with an `alarm` and a "!"), from that rest up to standing,
   * and it stands from then on. Awake.
   */
  leaveRest(alarm: boolean): void;
  /**
   * Reduced motion turned on or off with the page open. On: no loop (no frame, no motor's turn), no springs, one drawing per
   * change; a drag one still held pose, a bump a still impact pose for 400 ms with no dizziness nor orbiting stars; each prop
   * at most one still frame, the "!" appearing without a bounce. Off: the loop and the springs again.
   */
  setCalm(on: boolean): void;
}

const FPS = { active: 30, work: 20, rest: 10 } as const;

/** The page's mood, as the character reads it: someone asks, someone works, or nothing. */
function mood3(mood: Mood): Mood3 {
  if (mood === "asking") return "asking";
  return mood === "working" || mood === "busy" ? "working" : "idle";
}

/** Null without WebGL. */
export function createCharacterRig(canvas: HTMLCanvasElement, options: CharacterRigOptions): CharacterRig | null {
  // The renderer, the light and the camera, shared with the gallery (stage.ts).
  const stage = createStage(canvas);
  if (!stage) return null;
  const { renderer, scene, camera } = stage;

  /** Reduced motion, now. */
  let reduced = options.reduced;
  const model = buildCharacter({ standard: options.standard === true });
  const props = createProps();
  scene.add(model.group, props.group);
  const animator = createAnimator(model, props, { reduced });
  const director = createDirector(options.rand ?? Math.random);
  // The physical clay compiles once, now, not on the first frame that shows a hidden part.
  renderer.compile(scene, camera);

  const look: Look = { x: 0, y: 0, at: -Infinity };
  const situation: Situation = { mood: "idle", reaction: null, look: null, asleep: false, rest: options.rest ?? "peek", theme: options.theme ?? "dark", drag: null, bump: null, body: null, quirk: null, exit: null, calm: reduced };
  const fpsActive = options.fpsActive ?? FPS.active;
  const fpsWork = options.fpsWork ?? FPS.work;
  const fpsRest = options.fpsRest ?? FPS.rest;
  let pace: Frame["pace"] = "rest";
  let moving = false;
  /** The motor, and whether it said its physics is active in this frame. */
  let motor: ((now: number) => boolean) | null = null;
  let driven = false;
  /** Right before each drawing of the loop: on a stage, the box to its place. */
  let placer: (() => void) | null = null;
  let raised: boolean | null = null;
  let width = 1;
  let height = 1;
  let disposed = false;
  /** Reduced motion: the drawing due when a reaction or a look is over (a timeout). */
  let still = 0;
  const now = () => performance.now();

  /** Told when it rises out of the corner or sinks back: for now, up anywhere but peeking. */
  const raise = () => {
    const up = situation.rest !== "peek";
    if (up === raised) return;
    raised = up;
    options.onRaise?.(up);
  };

  /**
   * With reduced motion it draws once per change, and the end of a reaction, of a look or of a bump's held impact is a
   * change too: one more drawing then, back to the pose without it (today's rig does the same with `still`).
   */
  const drawWhenOver = (t: number) => {
    if (still) window.clearTimeout(still);
    still = 0;
    if (!reduced || disposed || situation.asleep) return;
    let end = Infinity;
    const r = situation.reaction;
    if (r && r.start + REACTION_MS[r.kind] > t) end = r.start + REACTION_MS[r.kind];
    if (situation.look && situation.look.at + LOOK_MS > t) end = Math.min(end, situation.look.at + LOOK_MS);
    const b = situation.bump;
    if (b && b.start + STILL_BUMP_MS > t) end = Math.min(end, b.start + STILL_BUMP_MS);
    if (end === Infinity) return;
    still = window.setTimeout(() => {
      still = 0;
      if (!situation.asleep) draw(now(), 0);
    }, end - t + 20);
  };

  /** One frame: the director's pose, brought by the springs over `dt` seconds, drawn. True while anything still moves. */
  const draw = (t: number, dt: number) => {
    if (disposed) return false;
    const frame = director.frameAt(t, situation);
    pace = frame.pace;
    moving = animator.step(frame, t, dt);
    renderer.render(scene, camera);
    raise();
    drawWhenOver(t);
    return moving;
  };
  const loop = createFrameLoop({
    reduced,
    before: (t) => (driven = motor ? motor(t) : false),
    beforeDraw: () => placer?.(),
    fps: () => (moving || driven || pace === "active" ? fpsActive : pace === "work" ? fpsWork : fpsRest),
    draw,
  });

  /** Anything that happens wakes it (any mood, reaction, poke or look), and the loop picks the change up. */
  const stir = () => {
    situation.asleep = false;
    loop.wake();
  };

  const api: CharacterRig = {
    setMood(next) {
      situation.mood = mood3(next);
      stir();
    },
    setDictation() {},
    setLevel() {},
    react(r) {
      situation.reaction = { kind: r.kind === "say" ? "talk" : r.kind, start: now() };
      stir();
    },
    poke() {
      situation.reaction = { kind: "poke", start: now() };
      stir();
    },
    look(x, y) {
      look.x = x;
      look.y = y;
      look.at = now();
      situation.look = look;
      stir();
    },
    hit(x, y) {
      model.group.updateMatrixWorld(true);
      // The props never count: only the character itself.
      return hitTest([model.group], camera, x, y, width, height);
    },
    sleep(on) {
      if (disposed || on === situation.asleep) return;
      if (on) {
        situation.asleep = true;
        loop.sleep();
        // One frame with the eyes closed, then nothing until something wakes it.
        draw(now(), 0);
      } else stir();
    },
    setRest(next, side) {
      situation.rest = next;
      if (side) situation.hideSide = side;
      // A new rest ends the way out of the last one.
      if (next !== "stand") situation.exit = null;
      raise();
      if (!situation.asleep) loop.wake();
    },
    leaveRest(alarm) {
      if (disposed) return;
      situation.exit = { start: now(), alarm, from: situation.rest };
      situation.rest = "stand";
      raise();
      stir();
    },
    setDrag(cue) {
      const was = situation.drag;
      situation.drag = cue;
      // Moving, the loop already draws the drag at 30 fps. Reduced, a drag is one held pose: it draws as it starts and as it ends.
      if (!reduced || (was === null) !== (cue === null)) stir();
    },
    bump(cue) {
      situation.bump = cue;
      stir();
    },
    setMotor(fn) {
      motor = fn;
      driven = false;
      if (fn && !situation.asleep) loop.wake();
    },
    setPlacer(fn) {
      placer = fn;
    },
    setBody(cue) {
      const was = situation.body;
      situation.body = cue;
      if (situation.asleep || disposed) return;
      // Moving, the loop draws the body as it goes; reduced, once per change of state.
      if (!reduced || was?.state !== cue?.state) loop.wake();
    },
    setQuirk(cue) {
      if (cue === situation.quirk) return;
      situation.quirk = cue;
      if (!situation.asleep && !disposed) loop.wake();
    },
    setBadge(on) {
      if (on === situation.badge) return;
      situation.badge = on;
      if (!situation.asleep && !disposed) loop.wake();
    },
    setCalm(on) {
      if (disposed || on === reduced) return;
      reduced = on;
      situation.calm = on;
      animator.setReduced(on);
      loop.setReduced(on);
      if (on) driven = false;
      // Asleep it stays as it was drawn; awake, once straight to the pose (calm), or the loop again (the still redraw due
      // when a reaction ends is not needed then).
      if (situation.asleep) return;
      if (on) draw(now(), 0);
      else {
        drawWhenOver(now());
        loop.wake();
      }
    },
    setTheme(theme) {
      if (theme === situation.theme) return;
      situation.theme = theme;
      // Asleep or still, the new rim shows at once; awake, the loop's next frame has it.
      if (situation.asleep) draw(now(), 0);
      else loop.wake();
    },
    resize(w, h, dpr) {
      width = w;
      height = h;
      renderer.setPixelRatio(Math.min(dpr, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // A new size clears the canvas: draw it again now, asleep or not; awake, the loop goes on from there.
      draw(now(), 0);
      if (!situation.asleep && !reduced) loop.wake();
    },
    dispose() {
      disposed = true;
      if (still) window.clearTimeout(still);
      loop.dispose();
      model.dispose();
      props.dispose();
      stage.dispose();
    },
  };
  return api;
}
