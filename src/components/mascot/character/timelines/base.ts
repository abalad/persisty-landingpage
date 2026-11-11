import type { Look } from "../cues";
import type { Draft, V2 } from "../pose";

/**
 * The base layer (the spec's "Em pé" and "Olhar o cursor", and "Olhos vivos" in "Princípios"): what the character does
 * when nothing else asks for it. It breathes and shifts its weight, blinks and moves its eyes a little, and follows the
 * cursor: the eyes at once, the head after them, the body only if the cursor stays on one side.
 */

/** How long a look lasts after the pointer last moved (the floating window's was 2.5 s). */
export const LOOK_MS = 8000;

/**
 * The eyes' clock, drawn from `rand`: `blink` 0 open … 1 shut, `saccade` the eyes' small jump around where they look, in
 * units of the face (gaze). Call it with a time that goes forward; `headTurn` is where the head is turned now (rad, the
 * root's yaw included), and a turn of more than 0.5 rad since the last blink brings one with it. `rate` below 1 blinks
 * less (concentrated).
 */
export interface EyeClock { at(now: number, headTurn: number, rate?: number): { blink: number; saccade: V2 } }

/**
 * Blinks: every 2.5–6 s (`gap`, a little under so a frame late still lands within), now and then (`double`) a second one
 * 280–340 ms after the first, never a third. Each closes in 60 ms, stays shut 70 and opens over 110: a frame at 10 fps
 * still catches it shut.
 */
const BLINK = { gap: [2500, 5950], again: [280, 340], double: 0.22, close: 60, shut: 70, open: 110, turn: 0.5 } as const;
/** Saccades: a jump of up to 0.01 across and 0.006 up or down, every 0.8–3 s; a jump, not a glide (the spec's 40 ms). */
const SACCADE = { x: 0.01, y: 0.006, every: [800, 2980] } as const;
/** A gap longer than this (asleep, hidden) starts the clock afresh rather than catching up. */
const STALE_MS = 10_000;

export function createEyeClock(rand: () => number): EyeClock {
  const between = (r: readonly [number, number]) => r[0] + rand() * (r[1] - r[0]);
  let last = NaN;
  let next = 0;
  let start = -Infinity;
  let second = false;
  let turnAt = 0;
  let saccadeAt = 0;
  let sx = 0;
  let sy = 0;
  const length = BLINK.close + BLINK.shut + BLINK.open;
  return {
    at(now, headTurn, rate = 1) {
      if (!(now >= last) || now - last > STALE_MS) {
        next = now + between(BLINK.gap) / rate;
        saccadeAt = now + between(SACCADE.every);
        start = -Infinity;
        second = false;
        turnAt = headTurn;
      }
      last = now;
      const blinking = now - start < length;
      const turned = Math.abs(headTurn - turnAt) > BLINK.turn;
      // A blink starts at the frame that sees it due, so a slow frame rate never skips one.
      if (!blinking && (now >= next || turned)) {
        start = now;
        turnAt = headTurn;
        if (!second && rand() < BLINK.double) {
          second = true;
          next = now + between(BLINK.again);
        } else {
          second = false;
          next = now + between(BLINK.gap) / rate;
        }
      } else if (blinking && turned) turnAt = headTurn;
      if (now >= saccadeAt) {
        sx = (rand() * 2 - 1) * SACCADE.x;
        sy = (rand() * 2 - 1) * SACCADE.y;
        saccadeAt = now + between(SACCADE.every);
      }
      const e = now - start;
      let blink = 0;
      if (e < BLINK.close) blink = 1 - (1 - e / BLINK.close) ** 2;
      else if (e < BLINK.close + BLINK.shut) blink = 1;
      else if (e < length) {
        const k = (e - BLINK.close - BLINK.shut) / BLINK.open;
        blink = 1 - k * k * (3 - 2 * k);
      }
      return { blink, saccade: [sx, sy] };
    },
  };
}

/** Breath and weight: one cycle every 1 / 0.3 s, the chest ±1.2%, the weight from foot to foot ±0.02 rad, a little behind. */
const BREATH = { hz: 0.3, chest: 0.012, weight: 0.02, lag: 1.1, nod: 0.012 } as const;

/**
 * Standing at rest: the chest swells and settles (in a little quicker than out), the weight goes from one foot to the
 * other, and the head lifts a hair with each breath in.
 */
export function breathing(now: number): Draft {
  const p = (now / 1000) * BREATH.hz * 2 * Math.PI;
  const breath = Math.sin(p + 0.3 * Math.sin(p));
  return {
    chest: { twist: 0, breath: BREATH.chest * breath },
    pelvis: { y: 0.22, lean: [0, BREATH.weight * Math.sin(p - BREATH.lag)], pivot: "feet" },
    head: [-BREATH.nod * breath, 0, 0],
  };
}

/**
 * The cursor (`Look`, the page's units: x 420 px and y 320 px per unit, MascotWindow.tsx). Within `near` px of the head it
 * looks straight ahead. Otherwise the eyes go towards it (`gaze` up and down, `gazeX` across), the face turns towards it up
 * to ±`face` (the body's turn, the chest's twist and the head's together; most of the way by ~230 px out) and nods up to
 * ±0.35, and tilts a little towards it, the chest twisting a little; after `sideMs` on one side the body turns up to ±0.3
 * (`yaw`, `perTurn` of the face's turn) and the head turns back by as much, so the face keeps pointing where it did. The
 * spec's ±0.9 (today's floating mascot) was written before the face hugged the skull: at 200 px a face turned past ~0.5,
 * with the eyes slid towards the cursor, has the far eye on the skull's outline, so the face stops there and the eyes
 * point the rest of the way.
 */
const LOOK = {
  span: { x: 420, y: 320 }, near: 40, gaze: 0.02, gazeX: 0.016, face: 0.48, reach: 2, nod: 0.35, tilt: 0.08, twist: 0.08, side: 0.12, sideMs: 2000,
  yaw: 0.3, perTurn: 0.65,
} as const;

/** What a look claims: the eyes, the head, the chest's twist (its breath is the breathing's) and the body's turn. */
export type LookDraft = Required<Pick<Draft, "gaze" | "head" | "chest" | "root">>;

/** Where the head looks, and the body after 2 s on one side (`sideSince`: when the cursor came to this side); null 8 s after the last move. */
export function lookAt(now: number, look: Look, sideSince: number): LookDraft | null {
  if (now - look.at >= LOOK_MS) return null;
  if (Math.hypot(look.x * LOOK.span.x, look.y * LOOK.span.y) < LOOK.near) {
    return { gaze: [0, 0], head: [0, 0, 0], chest: { twist: 0, breath: 0 }, root: { x: 0, yaw: 0 } };
  }
  const across = Math.tanh(LOOK.reach * look.x);
  const turn = LOOK.face * across;
  const side = Math.abs(look.x) < LOOK.side ? 0 : Math.sign(look.x);
  const yaw = side !== 0 && now - sideSince >= LOOK.sideMs ? side * Math.min(LOOK.yaw, Math.abs(turn) * LOOK.perTurn) : 0;
  const twist = LOOK.twist * across;
  return {
    gaze: [LOOK.gazeX * Math.tanh(2.5 * look.x), -LOOK.gaze * Math.tanh(2.5 * look.y)],
    head: [LOOK.nod * Math.tanh(1.5 * look.y), turn - yaw - twist, -LOOK.tilt * across],
    chest: { twist, breath: 0 },
    root: { x: 0, yaw },
  };
}
