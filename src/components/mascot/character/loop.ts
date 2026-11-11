/**
 * The one requestAnimationFrame the floating mascot runs: the motor's turn (Task 12) in every frame, and a drawing whenever
 * 1000 / fps − 2 ms went by since the last one, with `beforeDraw` right before it (on a stage the box moves then, so its
 * move and the drawing go to the screen in one commit). No frames while the page is hidden, while it sleeps or with
 * reduced motion; reduced, each wake draws once, straight to the pose (like today's rig's `still`), with no `beforeDraw`.
 */
export interface FrameLoop {
  /** Asks for frames again (reduced: draws once now). */
  wake(): void;
  /** Stops asking for frames until the next wake. */
  sleep(): void;
  /** Whether an animation frame is asked for. */
  pending(): boolean;
  /** Reduced motion turned on (no frame asked for any more, the next wake draws once) or off (frames again, if awake). */
  setReduced(on: boolean): void;
  dispose(): void;
}

/** The longest gap one drawing accounts for, in seconds: a frame late by more doesn't make the springs leap. */
const MAX_DT = 0.25;

export function createFrameLoop(o: {
  reduced: boolean;
  /** The motor's turn, first in every frame (Task 12); true while it has steps to take. */
  before?: (now: number) => boolean;
  /** Right before each drawing (after `before`), and only in frames that draw: on a stage, the box to its place. */
  beforeDraw?: (now: number) => void;
  /** Asked every frame, so what moves (the caller reads what `before` and `draw` said) sets the pace at once. */
  fps: (now: number) => number;
  /** Draws; true while anything still moves. `dt` in seconds since the last drawing (0 for the first after a pause). */
  draw: (now: number, dt: number) => boolean;
}): FrameLoop {
  let reduced = o.reduced;
  let frame = 0;
  /** When the last drawing was; −∞ after a pause, so the first one comes at once and counts no time. */
  let last = -Infinity;
  let awake = false;
  let disposed = false;

  const visible = () => document.visibilityState === "visible";

  const tick = (now: number) => {
    frame = 0;
    if (disposed || !awake || !visible()) return;
    o.before?.(now);
    if (now - last >= 1000 / o.fps(now) - 2) {
      const dt = last === -Infinity ? 0 : Math.min(MAX_DT, (now - last) / 1000);
      last = now;
      o.beforeDraw?.(now);
      o.draw(now, dt);
    }
    schedule();
  };
  const schedule = () => {
    if (reduced || disposed || !awake || frame || !visible()) return;
    frame = requestAnimationFrame(tick);
  };
  const cancel = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = -Infinity;
  };
  const onVisibility = () => (visible() ? schedule() : cancel());
  document.addEventListener("visibilitychange", onVisibility);

  return {
    wake() {
      if (disposed) return;
      awake = true;
      if (reduced) o.draw(performance.now(), 0);
      else schedule();
    },
    sleep() {
      awake = false;
      cancel();
    },
    pending: () => frame !== 0,
    setReduced(on) {
      if (on === reduced) return;
      reduced = on;
      if (on) cancel();
      else schedule();
    },
    dispose() {
      disposed = true;
      awake = false;
      cancel();
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
