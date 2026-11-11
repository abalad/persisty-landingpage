import { REST_SETTLE_MS, SLEEPY_SETTLE_MS } from "../../idle";
import { PHYS, type PhysicsCues, type PhysicsState } from "../../physics";
import type { Beat, BodyCue, DragCue, Look, QuirkCue, QuirkId, ReactionKind, Situation } from "../cues";
import { smooth } from "./curves";
import { BUMP_MS } from "./drag";
import { ARRIVE_MS, LANDING_MS, landingOf } from "./fall";
import { REACTION_MS } from "./moods";
import { EXIT_MS, QUIRK_MS, YAWN_MS } from "./quirks";
import { BEAT_MS, WINDOW_QUIRK_MS } from "./windows";

/**
 * The catalog of behaviors (the spec's "Catálogo de comportamentos"), as the gallery plays them: each one is a situation
 * over time, which the director turns into poses exactly as the floating window's rig would. Times inside the situation
 * (a reaction's `start`, the cursor's `at`) are on the play's own clock, 0 at its start; the gallery sets the theme.
 */
export interface Behavior {
  id: string;                                   // kebab-case pt: "em-pe", "batida", "pouso-medio"…
  label: string;                                // the catalog row, as the spec names it
  prio: "A" | "F" | "R" | "P" | "H" | "B";
  ms: number | null;                            // one play; null: continuous (looped every 6 s)
  scene(e: number): Situation;                  // the situation `e` ms into the play
  /** At a window's end: how far it is to the right of the feet (px); the gallery's window ends there. */
  edge?: number;
}

/** How long the gallery plays a continuous behavior before it starts it again (ms). */
export const CONTINUOUS_MS = 6000;

/** Nothing happening: idle, awake, standing (not peeking), nothing pointed at, not held. */
const calm = (): Situation => ({ mood: "idle", reaction: null, look: null, asleep: false, rest: "stand", theme: "dark", drag: null, bump: null, body: null, quirk: null, exit: null });

/**
 * A pointer that keeps moving, out to where the look is widest: far right of the head and a little above for 2.6 s (the
 * body turns at 2 s), an arc over the top of the head (~250 px above it) to the far lower left, held there (the body turns
 * again), then close to the head, where it looks straight ahead.
 */
function wandering(e: number): Look {
  let x: number;
  let y: number;
  if (e < 2600) {
    x = 0.85 + 0.06 * Math.sin(e / 400);
    y = -0.2 + 0.1 * Math.sin(e / 650);
  } else if (e < 3200) {
    const k = smooth((e - 2600) / 600);
    x = 0.85 + (-0.85 - 0.85) * k;
    y = -0.2 + (0.45 + 0.2) * k - 0.9 * Math.sin(Math.PI * k);
  } else if (e < 5400) {
    x = -0.85 + 0.05 * Math.sin(e / 500);
    y = 0.45 + 0.08 * Math.sin(e / 700);
  } else {
    x = 0.03;
    y = 0.02;
  }
  return { x, y, at: e };
}

/** Peeking at the bottom of the screen, it follows a pointer that drifts above it. */
const drifting = (e: number): Look => ({ x: 0.55 * Math.sin(e / 900), y: -0.55 + 0.2 * Math.sin(e / 1300), at: e });

/**
 * Held and swung: the pointer goes side to side (120 px at 0.7 Hz) for 3 s, holds still while the body settles, then
 * jerks once to the right at 4.5 s. Its acceleration (px/s²) is what swings the body.
 */
function swung(e: number): number {
  const w = 0.7 * 2 * Math.PI;
  if (e < 3000) return -120 * w * w * Math.sin((w * e) / 1000);
  if (e >= 4500 && e < 4650) return 6000 * Math.sin((Math.PI * (e - 4500)) / 150);
  return 0;
}

/**
 * A whole drag, as a person does it (the floating window's tracker gives the same cues): grabbed, the startle; carried a
 * little, hanging and swinging; flung to the right, flying; stopped, the body swings on past the head; flung back to the
 * left; stopped again, and left hanging.
 */
function carried(e: number): DragCue {
  if (e < 350) return { phase: "startle", since: 0, ax: 0, facing: 1 };
  if (e < 1700) return { phase: "hang", since: 350, ax: 1800 * Math.sin(((e - 350) / 1000) * 1.4 * 2 * Math.PI), facing: 1 };
  if (e < 2900) return { phase: "flight", since: 1700, ax: 0, facing: 1 };
  if (e < 3500) return { phase: "hang", since: 2900, ax: e < 3050 ? -6000 : 0, facing: 1 };
  if (e < 4700) return { phase: "flight", since: 3500, ax: 0, facing: -1 };
  return { phase: "hang", since: 4700, ax: e < 4850 ? 6000 : 0, facing: -1 };
}

const reacting = (kind: ReactionKind) => (): Situation => ({ ...calm(), reaction: { kind, start: 0 } });
const held = (cue: (e: number) => DragCue) => (e: number): Situation => ({ ...calm(), drag: cue(e) });

// ---- phase 2: the body as the physics tells it (physics.ts: gravity 2600 px/s², the air's drag, the walk's 32 px/s)

/** The physics' cues with nothing moving. */
const still = (): PhysicsCues => ({ lag: 0, speed: 0, vx: 0, vy: 0, stress: 0, facing: 0, height: 0, walked: 0, edge: Infinity });
const bodied = (body: BodyCue): Situation => ({ ...calm(), body });
/** On the floor since `since`; the last landing, if any, still told (the physics keeps `landed` 450 ms, then stands). */
function standing(since: number, landed: BodyCue["landed"] = null, e = since): Situation {
  const settling = landed !== null && e < landed.at + PHYS.landedMs;
  return bodied({ state: settling ? "landed" : "ground", since: settling ? landed.at : landed ? Math.max(since, landed.at + PHYS.landedMs) : since, cues: still(), landed, beat: null });
}

/**
 * Standing, then the floor goes from under it and it falls `height` px, touching down at `touchdown` ms, and lands. The
 * landing rows touch down at 1 s: the gallery's `at` for an instant of a landing is 1000 plus that instant.
 */
const TOUCHDOWN = 1000;
function dropped(height: number, touchdown = TOUCHDOWN): (e: number) => Situation {
  const fall = Math.sqrt((2 * height) / PHYS.gravity) * 1000;
  const from = touchdown - fall;
  return (e) => {
    if (e < from) return standing(0);
    if (e >= touchdown) return standing(0, { height, at: touchdown }, e);
    const t = (e - from) / 1000;
    const vy = PHYS.gravity * t;
    return bodied({ state: "air", since: from, cues: { ...still(), vy, speed: vy, height: height - (PHYS.gravity * t * t) / 2 }, landed: null, beat: null });
  };
}

/**
 * Thrown: grabbed (the startle), carried, flown to the right and let go at `release` ms, up and to the right at (vx, vy)
 * px/s from `height` px above the floor; the air's drag slows it across, gravity brings it down, and it lands from the top
 * of its arc (~230 px: a medium landing).
 */
const THROW = { release: 1100, vx: 1100, vy: -650, height: 150 } as const;
const THROW_TOP = THROW.height + (THROW.vy * THROW.vy) / (2 * PHYS.gravity);
const THROW_LANDS = THROW.release + ((-THROW.vy + Math.sqrt(THROW.vy * THROW.vy + 2 * PHYS.gravity * THROW.height)) / PHYS.gravity) * 1000;
function thrown(e: number): Situation {
  const hold = (drag: DragCue): Situation => ({ ...calm(), drag, body: { state: "held", since: 0, cues: still(), landed: null, beat: null } });
  if (e < 350) return hold({ phase: "startle", since: 0, ax: 0, facing: 1 });
  if (e < 700) return hold({ phase: "hang", since: 350, ax: 0, facing: 1 });
  if (e < THROW.release) return hold({ phase: "flight", since: 700, ax: 0, facing: 1 });
  if (e >= THROW_LANDS) return standing(THROW_LANDS, { height: THROW_TOP, at: THROW_LANDS }, e);
  const t = (e - THROW.release) / 1000;
  const vx = THROW.vx * Math.exp((-t * 1000) / PHYS.airTau);
  const vy = THROW.vy + PHYS.gravity * t;
  const height = THROW.height - (THROW.vy * t + (PHYS.gravity * t * t) / 2);
  const facing = Math.abs(vx) >= 50 ? (vx > 0 ? 1 : -1) : 0;
  return bodied({ state: "air", since: THROW.release, cues: { ...still(), vx, vy, speed: Math.hypot(vx, vy), facing, height }, landed: null, beat: null });
}

/** A stroll on the floor: standing, 3.5 s to the right (112 px), the little step and a rest, 3.5 s back to the left. */
const STROLLS = [[600, 4100, 1], [5200, 8700, -1]] as const;
function strolling(e: number): Situation {
  for (const [from, to, facing] of STROLLS) {
    if (e >= from && e < to) {
      const cues = { ...still(), facing, vx: PHYS.strollSpeed * facing, speed: PHYS.strollSpeed, walked: (PHYS.strollSpeed * (e - from)) / 1000 };
      return bodied({ state: "walking", since: from, cues, landed: null, beat: null });
    }
  }
  return standing(e >= STROLLS[1][1] ? STROLLS[1][1] : e >= STROLLS[0][1] ? STROLLS[0][1] : 0);
}

// ---- phase 3: the body on the windows (physics.ts: the feet trail the window by τ 60 ms, the stress fills from 450 px/s)

/** On a window's top: nothing moving, its end `edge` px away. */
const onTop = (over: Partial<PhysicsCues> = {}): PhysicsCues => ({ ...still(), edge: 150, ...over });
/** Riding a still window since `since`, with a one-shot or a quirk if said. */
const atop = (since = 0, beat: Beat | null = null, edge = 150, quirk: QuirkCue | null = null): Situation =>
  ({ ...bodied({ state: "riding", since, cues: onTop({ edge }), landed: null, beat }), quirk });

/** The physics' fixed step (ms): the window rows are tracks of its steps. */
const STEP = PHYS.stepMs;

/**
 * Riding a window that moves at `vel(e)` ([vx, vy] px/s), as the physics does it in fixed steps: the feet trail their
 * place by τ (the lag); teetering at 40 px/s or more and for 250 ms after; the stress filling from 450 px/s (900 ms at
 * 1500) and emptying in 700 ms; slipping when it fills or the window goes past 1500 px/s, 180 ms where it was, then
 * falling `fall` px and landing (still 450 ms), standing. Each step's body, from 0 to `ms` or 1.5 s after the landing.
 */
function track(ms: number, vel: (e: number) => readonly [number, number], fall: number): BodyCue[] {
  const out: BodyCue[] = [];
  const dt = STEP / 1000;
  const tau = PHYS.lagTau / 1000;
  let state: PhysicsState = "riding";
  let since = 0;
  let calmMs = Infinity;
  let stress = 0;
  let lag = 0;
  let slipAt = Infinity;
  let landed: BodyCue["landed"] = null;
  const drop = Math.sqrt((2 * fall) / PHYS.gravity) * 1000;
  for (let k = 0; ; k += 1) {
    const e = k * STEP;
    let next: PhysicsState = state;
    let cues = onTop();
    if (e < slipAt) {
      const [vx, vy] = vel(e);
      const speed = Math.hypot(vx, vy);
      lag += (vx - lag / tau) * dt;
      stress = speed >= PHYS.despair ? Math.min(1, stress + (speed * dt * 1000) / (PHYS.slipNow * PHYS.stressFull)) : Math.max(0, stress - (dt * 1000) / PHYS.stressEmpty);
      calmMs = speed >= PHYS.still ? 0 : calmMs + STEP;
      next = calmMs < PHYS.hysteresis ? "teeter" : "riding";
      if (stress >= 1 || speed > PHYS.slipNow) {
        slipAt = e;
        next = "slip";
      }
      cues = onTop({ lag, speed, vx, vy, stress, edge: 150 });
    } else if (e < slipAt + PHYS.slipMs) {
      next = "slip";
      cues = { ...still(), lag: 0, height: fall };
    } else if (e < slipAt + PHYS.slipMs + drop) {
      next = "air";
      const t = (e - slipAt - PHYS.slipMs) / 1000;
      const vy = PHYS.gravity * t;
      cues = { ...still(), vy, speed: vy, height: fall - (PHYS.gravity * t * t) / 2 };
    } else {
      const at = Math.round(slipAt + PHYS.slipMs + drop);
      landed = { height: fall, at };
      next = e < at + PHYS.landedMs ? "landed" : "ground";
    }
    if (next !== state) {
      state = next;
      since = e;
    }
    out.push({ state, since, cues, landed, beat: null });
    if (e >= ms || (landed && e >= landed.at + 1500)) break;
  }
  return out;
}

/** A track played back: the body at the step nearest `e` (held at its end). */
const play = (bodies: BodyCue[]) => (e: number): Situation => bodied(bodies[Math.min(bodies.length - 1, Math.max(0, Math.round(e / STEP)))]!);
/** How long a track lasts with its landing played (ms). */
const lasts = (bodies: BodyCue[]) => {
  const l = bodies.at(-1)!.landed;
  return l ? Math.ceil(l.at + LANDING_MS[landingOf(l.height)] + 400) : Math.ceil((bodies.length - 1) * STEP);
};

/**
 * Balance: still, then the window is dragged left and right (±260 px/s, a swing every 1.5 s), then lifted at 220 px/s (the
 * knees take the push), then left still: never fast enough to despair.
 */
const BALANCE = track(5200, (e) => {
  if (e >= 600 && e < 3600) return [260 * Math.sin((2 * Math.PI * (e - 600)) / 1500), 0];
  if (e >= 3600 && e < 4400) return [0, -220];
  return [0, 0];
}, 0);
/**
 * Despair: still, then the window goes round and round (a flat oval, mostly across) faster and faster, from 200 px/s by
 * 300 a second: balance, then despair as the stress fills, the sweat, until it slips; it falls 180 px and lands.
 */
const DESPAIR = track(9000, (e) => {
  if (e < 500) return [0, 0];
  const t = (e - 500) / 1000;
  const a = 200 + 300 * t;
  const q = 2 * Math.PI * 0.5 * t;
  return [a * Math.cos(q), 0.3 * a * Math.sin(q)];
}, 180);
/** The slip: still, then dragged steadily to the right (320 px/s), then yanked at 1700 px/s: it slips at once, falls 120 px. */
const SLIP = track(4000, (e) => (e < 400 ? [0, 0] : e < 1200 ? [320, 0] : [1700, 0]), 120);

/**
 * The window goes from under it: riding, then the cartoon pause in the air (900 ms), the slip (180 ms), a fall of 220 px
 * and a medium landing, on the floor.
 */
const GONE = { at: 800, fall: 220 } as const;
const GONE_DROP = Math.sqrt((2 * GONE.fall) / PHYS.gravity) * 1000;
const GONE_LANDS = Math.round(GONE.at + PHYS.vanishMs + PHYS.slipMs + GONE_DROP);
function gone(e: number): Situation {
  if (e < GONE.at) return atop();
  const p = e - GONE.at;
  if (p < PHYS.vanishMs) return bodied({ state: "pause", since: GONE.at, cues: { ...still(), height: GONE.fall }, landed: null, beat: null });
  if (p < PHYS.vanishMs + PHYS.slipMs) return bodied({ state: "slip", since: GONE.at + PHYS.vanishMs, cues: { ...still(), height: GONE.fall }, landed: null, beat: null });
  if (e < GONE_LANDS) {
    const t = (p - PHYS.vanishMs - PHYS.slipMs) / 1000;
    const vy = PHYS.gravity * t;
    return bodied({ state: "air", since: GONE.at + PHYS.vanishMs + PHYS.slipMs, cues: { ...still(), vy, speed: vy, height: GONE.fall - (PHYS.gravity * t * t) / 2 }, landed: null, beat: null });
  }
  return standing(GONE_LANDS, { height: GONE.fall, at: GONE_LANDS }, e);
}

/** Testing the floor: dropped from 50 px onto a window, it lands (light) and then taps the top. */
const TEST = { fall: 50, touchdown: 1000 } as const;
function tested(e: number): Situation {
  const s = dropped(TEST.fall, TEST.touchdown)(e);
  if (e < TEST.touchdown) return e < TEST.touchdown - Math.sqrt((2 * TEST.fall) / PHYS.gravity) * 1000 ? atop() : s;
  const landed = { height: TEST.fall, at: TEST.touchdown };
  const beat: Beat = { id: "testFloor", start: TEST.touchdown + LANDING_MS.light, side: 0 };
  const settling = e < TEST.touchdown + PHYS.landedMs;
  return bodied({ state: settling ? "landed" : "riding", since: settling ? TEST.touchdown : TEST.touchdown + PHYS.landedMs, cues: onTop(), landed, beat });
}

/**
 * A stroll on a window: standing, then it tests the floor before the first step (the physics already walks: the body is
 * held back and catches up), walks 4 s to the right (128 px) and stops within 40 px of where it may walk by the right end,
 * 60 px from it: after the little step that ends it, it peeks over the end.
 */
const WALK = { from: 600, ms: 4800, edge: 60 } as const;
const WALK_ENDS = WALK.from + WALK.ms;
function windowStroll(e: number): Situation {
  if (e < WALK.from) return atop(0, null, WALK.edge + (PHYS.strollSpeed * WALK.ms) / 1000);
  const beat: Beat = { id: "testFloor", start: WALK.from, side: 1 };
  if (e < WALK_ENDS) {
    const walked = (PHYS.strollSpeed * (e - WALK.from)) / 1000;
    const cues = onTop({ facing: 1, vx: PHYS.strollSpeed, speed: PHYS.strollSpeed, walked, edge: WALK.edge + (PHYS.strollSpeed * WALK.ms) / 1000 - walked });
    return bodied({ state: "walking", since: WALK.from, cues, landed: null, beat });
  }
  return atop(WALK_ENDS, beat, WALK.edge, { id: "peekOver", start: WALK_ENDS + ARRIVE_MS, side: 1, edge: WALK.edge });
}

/** Sitting: standing on a window, it sits down on the top at 300 ms, swings its legs and dozes off; asleep when it settled. */
const SIT_AT = 300;
const sitting = (e: number): Situation => ({ ...atop(), rest: e >= SIT_AT ? "sit" : "stand", asleep: e >= SIT_AT + REST_SETTLE_MS.sit });

/** A change of scene: riding, then the windows are gone at 1 s: it stays where it was, over nothing, and looks around. */
const sceneChanged = (e: number): Situation =>
  e < 1000 ? atop() : bodied({ state: "ground", since: 1000, cues: still(), landed: null, beat: { id: "sceneLook", start: 1000, side: 0 } });

// ---- phase 4: the idle life (quirks.ts; idle.ts says when)

/** When a quirk row's quirk starts (ms). */
const QUIRK_AT = 300;
/** On the floor, a quirk from QUIRK_AT, towards `side`. */
const quirking = (id: QuirkId, side: -1 | 0 | 1 = 0) => (): Situation => ({ ...standing(0), quirk: { id, start: QUIRK_AT, side } });

/** Yawning on a window: the yawn, then it sits on the top (sleepy already) and sleeps sooner than a rest of its own. */
const YAWN_SITS = QUIRK_AT + YAWN_MS;
const YAWN_SLEEPS = YAWN_SITS + SLEEPY_SETTLE_MS;
const yawning = (e: number): Situation => ({ ...atop(), quirk: { id: "yawn", start: QUIRK_AT, side: 0 }, rest: e >= YAWN_SITS ? "sit" : "stand", asleep: e >= YAWN_SLEEPS });

/** Swinging the legs: sat on a window asleep, the quirk wakes it at 2 s for its 3 s, and it sleeps again. */
const SWING_AT = 2000;
const swinging = (e: number): Situation => {
  const awake = e < 1500 || (e >= SWING_AT && e < SWING_AT + QUIRK_MS.swingLegs);
  return { ...atop(), rest: "sit", asleep: !awake, quirk: e >= SWING_AT ? { id: "swingLegs", start: SWING_AT, side: 0 } : null };
};

/** The cursor comes back from the right at 400 ms, after a long while away, a little above the head: it waves. */
const WAVE_AT = 400;
const waving = (e: number): Situation =>
  e < WAVE_AT ? standing(0) : { ...standing(0), look: { x: 0.55 + 0.03 * Math.sin(e / 300), y: -0.3, at: e }, quirk: { id: "waveCursor", start: WAVE_AT, side: 1 } };

/**
 * The rest near the screen's right edge: a walk to it (2 s, 64 px), the little step, then it hides behind it (the box flush
 * against the edge: the canvas's right side), the eyes on a cursor over the screen from 3.5 s; asleep once it settled.
 */
const HIDE_WALK = [300, 2300] as const;
const HIDE_SLEEPS = HIDE_WALK[1] + ARRIVE_MS + REST_SETTLE_MS.edge;
function hiding(e: number): Situation {
  if (e >= HIDE_WALK[0] && e < HIDE_WALK[1]) {
    const cues = { ...still(), facing: 1 as const, vx: PHYS.strollSpeed, speed: PHYS.strollSpeed, walked: (PHYS.strollSpeed * (e - HIDE_WALK[0])) / 1000 };
    return bodied({ state: "walking", since: HIDE_WALK[0], cues, landed: null, beat: null });
  }
  const at = e >= HIDE_WALK[1] ? HIDE_WALK[1] : 0;
  const s = standing(at);
  if (e < HIDE_WALK[1]) return s;
  return { ...s, rest: "edge", hideSide: 1, asleep: e >= HIDE_SLEEPS, look: e >= 3500 && e < HIDE_SLEEPS ? { x: -0.6 + 0.05 * Math.sin(e / 500), y: -0.1, at: e } : null };
}

/** Out of the seat: sat on a window and asleep, then out of the rest calmly at 2.2 s, standing on the top. */
const LEAVE_AT = 2200;
const leaving = (e: number): Situation =>
  e < LEAVE_AT ? { ...atop(), rest: "sit", asleep: e >= 1500 } : { ...atop(), exit: { start: LEAVE_AT, alarm: false, from: "sit" } };

/** Someone asks: hidden behind the right edge and asleep, then at 2.6 s out with the alarm, and it asks (amber, waving). */
const ALARM_AT = 2600;
const alarmed = (e: number): Situation =>
  e < ALARM_AT
    ? { ...standing(0), rest: "edge", hideSide: 1, asleep: e >= 1800 }
    : { ...standing(0), hideSide: 1, mood: "asking", exit: { start: ALARM_AT, alarm: true, from: "edge" } };

/** Every row the gallery shows, in the spec's order; each phase adds its own. */
export const CATALOG: Behavior[] = [
  { id: "em-pe", label: "Em pé no chão", prio: "B", ms: null, scene: calm },
  { id: "susto", label: "Susto", prio: "A", ms: 1000, scene: held((e) => (e < 350 ? { phase: "startle", since: 0, ax: 0, facing: 1 } : { phase: "hang", since: 350, ax: 0, facing: 1 })) },
  { id: "pendurado", label: "Pendurado", prio: "A", ms: null, scene: held((e) => ({ phase: "hang", since: -1000, ax: swung(e), facing: 1 })) },
  { id: "puxado", label: "Puxado para cima", prio: "A", ms: null, scene: held((e) => ({ phase: "up", since: -1000, ax: 400 * Math.sin(e / 300), facing: 1 })) },
  { id: "voo", label: "Voo de lado", prio: "A", ms: null, scene: held((e) => (e < 3000 ? { phase: "flight", since: 0, ax: 0, facing: 1 } : { phase: "flight", since: 3000, ax: 0, facing: -1 })) },
  { id: "arrasto", label: "Arrasto: susto, pendurado e voo", prio: "A", ms: 6200, scene: held(carried) },
  { id: "batida", label: "Batida na parede", prio: "A", ms: BUMP_MS.end + 360, scene: () => ({ ...calm(), bump: { side: "right", start: 0, thrown: false, speed: 800 } }) },
  { id: "olhar-cursor", label: "Olhar o cursor", prio: "B", ms: null, scene: (e) => ({ ...calm(), look: wandering(e) }) },
  { id: "espia-pela-base", label: "Descanso: espia pela base", prio: "B", ms: null, scene: (e) => ({ ...calm(), rest: "peek", look: drifting(e) }) },
  { id: "pede", label: "Pede", prio: "H", ms: null, scene: () => ({ ...calm(), mood: "asking" }) },
  { id: "trabalha", label: "Trabalha", prio: "H", ms: null, scene: () => ({ ...calm(), mood: "working" }) },
  { id: "comemora", label: "Comemora", prio: "R", ms: REACTION_MS.celebrate, scene: reacting("celebrate") },
  { id: "ops", label: "Ops", prio: "R", ms: REACTION_MS.oops, scene: reacting("oops") },
  { id: "fala", label: "Fala", prio: "R", ms: REACTION_MS.talk, scene: reacting("talk") },
  { id: "aceno", label: "Sinal do terminal: aceno", prio: "R", ms: REACTION_MS.wave, scene: reacting("wave") },
  { id: "pensa", label: "Sinal do terminal: pensa", prio: "R", ms: REACTION_MS.think, scene: reacting("think") },
  { id: "clique", label: "Clique", prio: "R", ms: REACTION_MS.poke, scene: reacting("poke") },
  { id: "passeio-chao", label: "Passeio no chão", prio: "F", ms: 9800, scene: strolling },
  { id: "queda", label: "Queda", prio: "F", ms: 1200 + LANDING_MS.tumble + 400, scene: dropped(900, 1200) },
  { id: "pouso-leve", label: "Pouso leve", prio: "F", ms: TOUCHDOWN + LANDING_MS.light + 400, scene: dropped(40) },
  { id: "pouso-medio", label: "Pouso médio", prio: "F", ms: TOUCHDOWN + LANDING_MS.medium + 400, scene: dropped(150) },
  { id: "tombo", label: "Tombo", prio: "F", ms: TOUCHDOWN + LANDING_MS.tumble + 400, scene: dropped(450) },
  { id: "arremesso", label: "Soltar e arremesso", prio: "F", ms: Math.ceil(THROW_LANDS + LANDING_MS.medium + 400), scene: thrown },
  { id: "em-pe-janela", label: "Em pé numa janela", prio: "B", ms: null, scene: () => atop() },
  { id: "equilibrio", label: "Equilíbrio", prio: "F", ms: lasts(BALANCE), scene: play(BALANCE) },
  { id: "desespero", label: "Desespero", prio: "F", ms: lasts(DESPAIR), scene: play(DESPAIR) },
  { id: "escorregao", label: "Escorregão", prio: "F", ms: lasts(SLIP), scene: play(SLIP) },
  { id: "some-debaixo", label: "Some debaixo dele", prio: "F", ms: Math.ceil(GONE_LANDS + LANDING_MS.medium + 400), scene: gone },
  { id: "testar-chao", label: "Testar o chão", prio: "F", ms: TEST.touchdown + LANDING_MS.light + BEAT_MS.testFloor + 400, scene: tested },
  { id: "olhar-janela", label: "Olhar a janela", prio: "P", ms: 300 + WINDOW_QUIRK_MS.lookAtWindow + 400, scene: () => atop(0, null, 150, { id: "lookAtWindow", start: 300, side: 0 }) },
  { id: "passeio-janela", label: "Passeio numa janela", prio: "F", ms: WALK_ENDS + ARRIVE_MS + WINDOW_QUIRK_MS.peekOver + 400, edge: WALK.edge, scene: windowStroll },
  { id: "espiar-beirada", label: "Espiar pela beirada", prio: "P", ms: 300 + WINDOW_QUIRK_MS.peekOver + 400, edge: 60, scene: () => atop(0, null, 60, { id: "peekOver", start: 300, side: 1, edge: 60 }) },
  { id: "ponta-dos-pes", label: "Na ponta dos pés", prio: "F", ms: 300 + BEAT_MS.tiptoe + 500, edge: 12, scene: () => atop(0, { id: "tiptoe", start: 300, side: 1 }, 12) },
  { id: "sentado", label: "Descanso: sentado na janela", prio: "B", ms: SIT_AT + REST_SETTLE_MS.sit + 1000, scene: sitting },
  { id: "troca-de-cena", label: "Troca de cena", prio: "F", ms: 1000 + BEAT_MS.sceneLook + 400, scene: sceneChanged },
  { id: "espreguicar", label: "Espreguiçar", prio: "P", ms: QUIRK_AT + QUIRK_MS.stretch + 400, scene: quirking("stretch") },
  { id: "bocejar", label: "Bocejar e cochilar", prio: "P", ms: YAWN_SLEEPS + 800, scene: yawning },
  { id: "olhar-em-volta", label: "Olhar em volta", prio: "P", ms: QUIRK_AT + QUIRK_MS.lookAround + 400, scene: quirking("lookAround", 1) },
  { id: "pulinho", label: "Pulinho", prio: "P", ms: QUIRK_AT + QUIRK_MS.hop + 400, scene: quirking("hop") },
  { id: "toc-toc", label: "Toc-toc", prio: "P", ms: QUIRK_AT + QUIRK_MS.knock + 400, scene: () => atop(0, null, 150, { id: "knock", start: QUIRK_AT, side: 0 }) },
  { id: "balancar-pernas", label: "Balançar as pernas", prio: "P", ms: SWING_AT + QUIRK_MS.swingLegs + 800, scene: swinging },
  { id: "aceno-cursor", label: "Acenar para o cursor", prio: "P", ms: WAVE_AT + QUIRK_MS.waveCursor + 600, scene: waving },
  { id: "descanso-borda", label: "Descanso: atrás da borda", prio: "B", ms: HIDE_SLEEPS + 1000, scene: hiding },
  { id: "sair-descanso", label: "Sair do descanso", prio: "R", ms: LEAVE_AT + EXIT_MS.calm + 900, scene: leaving },
  { id: "alarme", label: "Sair do descanso: alarme", prio: "R", ms: ALARM_AT + EXIT_MS.alarm + 2000, scene: alarmed },
];
