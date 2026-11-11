import type { BodyCue, DragCue, Frame, QuirkCue, Situation } from "./cues";
import type { V3 } from "./ik";
import { RIM } from "./model";
import { compose, type Channel, type Claim, type Draft, type Layer, type V2 } from "./pose";
import { LOOK_MS, breathing, createEyeClock, lookAt } from "./timelines/base";
import { HANG, foot, smooth } from "./timelines/curves";
import { BUMP_MS, bump, dragPose } from "./timelines/drag";
import { arrive, falling, landing, landingOf, walk } from "./timelines/fall";
import { REACTION_KEY, REACTION_MS, asking, reaction, working } from "./timelines/moods";
import { PEEK_Y, YAWN_MS, edgeHide, leaveRest, quirk } from "./timelines/quirks";
import {
  BEAT_MS, CALMER_AFTER_MS, balance, dozeOff, peekOver, sceneLook, sit, slip, standUp, testFloor, tiptoe, vanishPause,
} from "./timelines/windows";

/** Turns the situation into what the character should look like now. */
export interface Director {
  /** The frame is the director's own, the same object each call: read it before the next. */
  frameAt(now: number, s: Situation): Frame;
  /** Which layer held each channel in the last frame (for the tests and the gallery). */
  owners(): Readonly<Partial<Record<Channel, Layer>>>;
}

/**
 * How bright the antenna shines (0–1), as today's floating mascot does it: steady at rest, a little brighter asking, a
 * 1 Hz pulse working, full during a reaction, dim asleep.
 */
const GLOW = { rest: 0.35, asking: 0.45, work: 0.72, workPulse: 0.35, reaction: 1, asleep: 0.15 } as const;
/** Oops blinks the antenna and the rim red twice: these spans of the reaction (ms). */
const OOPS_RED = [[0, 350], [600, 950]] as const;
/** The head follows the eyes this much later when a look begins (ms), and the chest after the head. */
const LEAD = { head: 80, body: 160 } as const;
/** Fewer blinks while working (the intervals stretch by 1 / rate), the eyes down on the panel. */
const WORK_BLINKS = 0.55;
const WORK_GAZE: V2 = [0, -0.014];
/** A look's side counts from this far across (the page's units), as in base.ts's lookAt. */
const SIDE = 0.12;
/** After a yawn, the rest it goes to keeps the lids at least this heavy until it sleeps, the brows and the mouth sleepy. */
const SLEEPY_LIDS = 0.55;
const SLEEPY_BROWS: V2 = [0.12, 0.35];
const SLEEPY_MOUTH: V2 = [0.15, 0.04];
/** With reduced motion a mood is the instant this far into it (ms): asking, the arm up and the hand open. */
const STILL_MOOD_MS = 1700;
/** With reduced motion a bump is its impact, held this long (ms). */
export const STILL_BUMP_MS = 400;
/** Asleep: eyes shut, the head a little down. */
const ASLEEP: Draft = { lids: [1, 0], head: [0.12, 0, 0.04], mouth: [0.3, 0] };
/**
 * Testing the floor before a stroll: the physics walks from the stroll's first step, so while the toes tap the box goes on
 * with the feet and the body is drawn back where it stood (`PHYS.strollSpeed` × the test: 25.6 px); then it catches up over
 * `catch` ms, walking a little quicker, before the shortest stroll (60 px, 1.9 s) can end. A beat this close to the walk's
 * start (ms) is its test.
 */
const TEST_WALK = { held: (32 * BEAT_MS.testFloor) / 1000, catch: 1000, slack: 50 } as const;

/**
 * What the physics (F) claims while the body moves, by the table "Prioridade entre as camadas": the body, the legs, the
 * arms and the props; the face falling and in a tumble, and for a moment after the other landings (the fall's surprise
 * settling, the medium one's wince: without it the face cut from the fall's "o" to a smile at the touchdown, and the
 * squeezed eyes over a smile read as bliss), and the walk's eyes, which lead its turns; the head only in a tumble and in the
 * air pause, with the pause's "!". Despair takes the face; the balance only the body (its look where the window goes is
 * added to the head and to the base's eyes); the slip the face's surprise; the one-shots on a still body (`beat`) the eyes
 * and the brows (and tiptoe the mouth). What a motion asks of the head without claiming it is added to whoever has it: the
 * medium landing's sinking head, the walk's turn ahead of the body and back towards the camera at 3/4, the balance's look
 * (not while someone asks: then head and face are the request's), a beat's nod or look around.
 */
type Motion = "air" | "light" | "medium" | "tumble" | "walk" | "arrive" | "balance" | "despair" | "slip" | "pause" | "beat";
const BODY: readonly Channel[] = ["root", "pelvis", "squash", "chest", "armL", "armR", "legL", "legR", "sweat", "stars", "dust", "shadow"];
const FACE: readonly Channel[] = ["gaze", "lids", "brows", "mouth", "blush", "eyes"];
interface Hold { face: readonly Channel[]; head: boolean; extra?: readonly Channel[]; eyes?: boolean }
const HOLDS: Record<Motion, Hold> = {
  air: { face: FACE, head: false },
  tumble: { face: FACE, head: true },
  light: { face: ["lids", "brows", "mouth"], head: false },
  medium: { face: ["lids", "brows", "mouth"], head: false },
  walk: { face: ["gaze"], head: false },
  arrive: { face: ["gaze"], head: false },
  balance: { face: [], head: false, eyes: true },
  despair: { face: FACE, head: false },
  slip: { face: ["gaze", "lids", "brows", "mouth"], head: false },
  pause: { face: FACE, head: true, extra: ["mark"] },
  beat: { face: ["gaze", "brows"], head: false },
};
/** Standing on something: a walk that ends there ends with a little step. */
const STANDING: ReadonlySet<BodyCue["state"]> = new Set(["ground", "landed", "riding"]);
/** Still on the top or the floor: where a one-shot plays. */
const STILL: ReadonlySet<BodyCue["state"]> = new Set(["ground", "landed", "riding"]);
/** What a celebration shows on a moving window (the spec): the eyes, the cheeks and the stars. */
const CELEBRATE_RIDING: readonly Channel[] = ["gaze", "lids", "eyes", "blush", "stars"];
/** What working keeps sat on a window or sunk at the edge: the head and the brows, without the panel and the typing. */
const WORK_LOW: readonly Channel[] = ["head", "brows"];

/** Only the channels `chs` of `d`. */
function only(d: Draft, chs: readonly Channel[]): Draft {
  const out: Draft = {};
  for (const ch of chs) if (d[ch] !== undefined) (out as Record<Channel, unknown>)[ch] = d[ch];
  return out;
}

/** The physics' claim for a motion (only what its draft says now), and what it adds to the head and to the base's eyes. */
function split(motion: Motion, draft: Draft, face?: readonly Channel[]): { claim: Draft; head: V3 | null; gaze: V2 | null } {
  const holds = HOLDS[motion];
  const claim: Draft = draft.antennaKick ? { antennaKick: draft.antennaKick } : {};
  const put = (ch: Channel) => {
    if (draft[ch] !== undefined) (claim as Record<Channel, unknown>)[ch] = draft[ch];
  };
  for (const ch of BODY) put(ch);
  for (const ch of face ?? holds.face) put(ch);
  for (const ch of holds.extra ?? []) put(ch);
  if (holds.head) put("head");
  return { claim, head: !holds.head && draft.head ? draft.head : null, gaze: holds.eyes && draft.gaze ? draft.gaze : null };
}

/** A landing's dust and stars, from its own clock to the rig's (`at`, the touchdown). */
function onClock(d: Draft, at: number): Draft {
  const out = { ...d };
  if (d.dust) out.dust = { ...d.dust, since: d.dust.since + at };
  if (d.stars) out.stars = { ...d.stars, since: d.stars.since + at };
  return out;
}

/** `d` drawn `dx` units across: its root and its planted feet (the body behind the box, while the box goes on). */
function shifted(d: Draft, dx: number): Draft {
  const out: Draft = { ...d, root: { x: (d.root?.x ?? 0) + dx, yaw: d.root?.yaw ?? 0 } };
  if (d.legL?.kind === "foot") out.legL = { kind: "foot", at: [d.legL.at[0] + dx, d.legL.at[1], d.legL.at[2]] };
  if (d.legR?.kind === "foot") out.legR = { kind: "foot", at: [d.legR.at[0] + dx, d.legR.at[1], d.legR.at[2]] };
  return out;
}

/** What a quirk may do sat on a window's top: the head and the face, the chest, and its own limbs (the legs, the yawning hand). */
const SEATED_QUIRK: Partial<Record<QuirkCue["id"], readonly Channel[]>> = {
  swingLegs: ["head", "gaze", "lids", "brows", "mouth", "legL", "legR"],
  lookAround: ["head", "gaze", "brows", "mouth", "chest"],
  yawn: ["head", "gaze", "lids", "brows", "mouth", "chest", "armR"],
};

/**
 * A quirk's pose `e` ms into it, or null outside it (sat on a top, only what it may do sitting); its dust and stars moved
 * from the quirk's clock to the rig's.
 */
function quirkPose(q: QuirkCue, e: number, seated: boolean): Draft | null {
  const d = q.id === "peekOver" ? peekOver(q.side === -1 ? -1 : 1, e, q.edge ?? 60) : quirk(q.id, q.side, e);
  if (!d) return null;
  if (d.dust) d.dust = { ...d.dust, since: d.dust.since + q.start };
  if (d.stars) d.stars = { ...d.stars, since: d.stars.since + q.start };
  const sitting = SEATED_QUIRK[q.id];
  return seated ? (sitting ? only(d, sitting) : null) : d;
}

/**
 * The real director: it gathers each layer's claim for the situation and composes them (pose.ts): the drag and the bump
 * (A), the physics (F: falling, landing, walking, going along with a window, the slip and the pause in the air, the
 * one-shots on a still body; standing, the feet on the support), the way out of a rest and the reaction (R), the quirk (P:
 * only idle, standing still, or what it does sat on a top), the mood (H: only arms, head, brows, the panel and the marks)
 * and the base (B: breath and weight, the cursor, blinks and saccades; the rest: sunk to the head when peeking, sat on the
 * window's top, dozing, hidden behind the screen's edge; sleepy after a yawn). Outside the composition it decides what is
 * always the mood's: the antenna's tint (amber asking, red twice on an oops, lime otherwise, whatever layer holds the
 * body), its glow, the rim (the theme's) and the drawing's pace; and no mark while the page's badge shows (`badge`).
 *
 * Blinks lie over every layer's lids (a held, sleepy or smiling eye still blinks), the saccades only over the base's gaze.
 * Its state: the eyes' clock (drawn from `rand`), when the mood changed, when the cursor came and went to a side, the last
 * walk's feet (for the little step that ends it), the stress of the last 250 ms (a calmer pose only after them), the side
 * the window last pulled (where a slip goes), since when it rests as it does (and when it stopped sitting), and when the
 * physics last moved the body (hiding starts after it). With reduced motion every change is one still pose: no
 * breathing, blinks or saccades; a reaction holds its key pose for as long as it lasts, a bump its impact for 400 ms, a
 * drag one held pose, the way out of a rest none; the physics only stands (with reduced motion the page puts it straight
 * where it lands, without a fall). Reduced motion is the situation's `calm`, or `o.reduced` where it says nothing.
 */
export function createDirector(rand: () => number, o: { reduced?: boolean } = {}): Director {
  const reducedAlways = o.reduced === true;
  const eyes = createEyeClock(rand);
  const frame: Frame = { pose: compose([]).pose, tint: "lime", glow: GLOW.rest, rim: RIM.dark, pace: "rest" };
  let owners: Partial<Record<Channel, Layer>> = {};
  let mood: Situation["mood"] | null = null;
  let moodSince = 0;
  let looking = false;
  let lookSince = 0;
  let side = 0;
  let sideSince = 0;
  let walking = false;
  let walkFeet: readonly [V3, V3] = [[0, 0, 0], [0, 0, 0]];
  let walkFacing: -1 | 1 = 1;
  let arriveAt: number | null = null;
  /** The stress seen in the last CALMER_AFTER_MS (times and values, oldest first): the pose shows the most of it. */
  const stressAt: number[] = [];
  const stressOf: number[] = [];
  /** The window's last pull (px of lag) while on it: a slip goes the other way. */
  let pull = 0;
  /** The rest as last seen and since when; when it last stopped sitting. */
  let rest: Situation["rest"] | null = null;
  let restSince = 0;
  let sat = false;
  let roseAt = -Infinity;
  /** When the physics last moved the body (a walk, its little step at the end): hiding behind the edge starts after it. */
  let movedAt = -Infinity;

  /** Held still: one pose for the whole drag. */
  const heldStill = (cue: DragCue): DragCue => ({ phase: "hang", since: cue.since - 1000, ax: 0, facing: cue.facing });

  /** The most stress of the last CALMER_AFTER_MS, `v` the stress now: despair calms down only after them. */
  function shownStress(now: number, v: number): number {
    stressAt.push(now);
    stressOf.push(v);
    while (stressAt.length > 0 && stressAt[0]! <= now - CALMER_AFTER_MS) {
      stressAt.shift();
      stressOf.shift();
    }
    let most = 0;
    for (const s of stressOf) most = Math.max(most, s);
    return most;
  }

  /** The one-shot playing on a still body, with the face it claims, or null. */
  function beatOn(b: BodyCue, now: number): { draft: Draft; face: readonly Channel[] } | null {
    const beat = b.beat;
    if (!beat) return null;
    const e = now - beat.start;
    let d: Draft | null;
    let face: readonly Channel[] = HOLDS.beat.face;
    switch (beat.id) {
      case "testFloor":
        d = testFloor(e);
        break;
      case "tiptoe":
        d = tiptoe(beat.side === -1 ? -1 : 1, e);
        face = ["gaze", "brows", "mouth"];
        break;
      case "sceneLook":
        d = sceneLook(e);
        break;
    }
    if (!d) return null;
    // The feet stay planted where the beat does not move them, and the shadow under them.
    return { draft: { legL: foot(0), legR: foot(1), shadow: 1, ...d }, face };
  }

  /**
   * What the body does now: falling, walking (testing the floor before it), the slip and the pause in the air, a landing
   * still playing (whatever the state on the floor), the little step at the end of a walk, going along with a window
   * (balance, despair), a one-shot on a still body; or null, standing still.
   */
  function motion(b: BodyCue, now: number): { motion: Motion; draft: Draft; face?: readonly Channel[] } | null {
    const was = walking;
    walking = b.state === "walking";
    const riding = b.state === "teeter" || b.state === "riding";
    const stress = shownStress(now, riding ? b.cues.stress : 0);
    if (riding && b.cues.lag !== 0) pull = b.cues.lag;
    if (walking) {
      arriveAt = null;
      const f = b.cues.facing === -1 ? -1 : 1;
      const e = now - b.since;
      const beat = b.beat;
      const testing = beat?.id === "testFloor" && Math.abs(beat.start - b.since) <= TEST_WALK.slack;
      let draft: Draft;
      let kind: Motion = "walk";
      let face: readonly Channel[] | undefined;
      if (testing && e < BEAT_MS.testFloor) {
        // The toes tap where it stood: the box (and the feet in it) went on by what was walked.
        draft = shifted(testFloor(Math.max(0, e))!, (-f * b.cues.walked) / 100);
        kind = "beat";
        face = HOLDS.beat.face;
      } else {
        const behind = testing ? TEST_WALK.held * (1 - smooth((e - BEAT_MS.testFloor) / TEST_WALK.catch)) : 0;
        draft = shifted(walk(Math.max(0, b.cues.walked - behind), f, testing ? e - BEAT_MS.testFloor : e), (-f * behind) / 100);
      }
      if (draft.legL?.kind === "foot" && draft.legR?.kind === "foot") walkFeet = [draft.legL.at, draft.legR.at];
      walkFacing = f;
      return face ? { motion: kind, draft, face } : { motion: kind, draft };
    }
    if (was) arriveAt = STANDING.has(b.state) ? b.since : null;
    if (b.state === "air") {
      arriveAt = null;
      return { motion: "air", draft: falling(b.cues, now, now - b.since) };
    }
    if (b.state === "pause") {
      arriveAt = null;
      return { motion: "pause", draft: vanishPause(now - b.since) };
    }
    if (b.state === "slip") {
      arriveAt = null;
      // Away from the window's pull (it goes right: it falls back to the left); with none, a side of its own.
      const way: -1 | 1 = pull > 0.5 ? -1 : pull < -0.5 ? 1 : Math.floor(b.since / 997) % 2 === 0 ? 1 : -1;
      return { motion: "slip", draft: slip(way, now - b.since) };
    }
    const l = b.landed;
    const landed = l ? landing(l.height, now - l.at) : null;
    if (l && landed) return { motion: landingOf(l.height), draft: onClock(landed, l.at) };
    if (arriveAt !== null) {
      const draft = arrive(walkFeet, walkFacing, now - arriveAt);
      if (draft) return { motion: "arrive", draft };
      arriveAt = null;
    }
    if (b.state === "teeter" || (b.state === "riding" && stress > 0)) {
      return { motion: stress > 0 ? "despair" : "balance", draft: balance(stress === b.cues.stress ? b.cues : { ...b.cues, stress }, now) };
    }
    if (STILL.has(b.state)) {
      const beat = beatOn(b, now);
      if (beat) return { motion: "beat", draft: beat.draft, face: beat.face };
    }
    return null;
  }

  return {
    frameAt(now, s) {
      const reduced = s.calm ?? reducedAlways;
      if (s.mood !== mood) {
        mood = s.mood;
        moodSince = now;
      }
      if (s.rest !== rest) {
        rest = s.rest;
        restSince = now;
      }
      const claims: Claim[] = [];
      const asks = s.mood === "asking";

      // ---- A: the bump first (it wins over the drag's own pose), then the drag
      let bumping: Draft | null = null;
      if (s.bump) bumping = reduced ? (now - s.bump.start < STILL_BUMP_MS ? bump(s.bump, s.bump.start + BUMP_MS.impact - 20) : null) : bump(s.bump, now);
      if (bumping) claims.push({ layer: "drag", draft: bumping });
      if (s.drag) claims.push({ layer: "drag", draft: dragPose(reduced ? heldStill(s.drag) : s.drag, now) });

      // ---- F: the physics; nothing while held (the drag has it all); with reduced motion it only stands
      const b = s.drag || s.body?.state === "held" ? null : s.body;
      if (!b || reduced) {
        walking = false;
        arriveAt = null;
      }
      const moved = b && !reduced ? motion(b, now) : null;
      if (moved) movedAt = now;
      const over = moved ? split(moved.motion, moved.draft, moved.face) : null;
      if (over) claims.push({ layer: "physics", draft: over.claim });
      const alongWindow = moved?.motion === "balance" || moved?.motion === "despair";

      // ---- R: the way out of a rest (the rest is "stand" already), from the rest it left up to standing; then the
      // reaction, on its own clock, its props' times moved to the rig's
      const x = s.exit;
      const exiting = x && !reduced && !s.drag ? leaveRest(x.from, x.alarm, now - x.start, s.hideSide ?? 1) : null;
      if (exiting) claims.push({ layer: "reaction", draft: exiting });
      const r = s.reaction;
      const re = r ? now - r.start : -1;
      let reacting: Draft | null = null;
      if (r && re >= 0 && re < REACTION_MS[r.kind]) {
        reacting = reaction(r.kind, reduced ? REACTION_KEY[r.kind] : re);
        if (reacting?.stars) reacting = { ...reacting, stars: { ...reacting.stars, since: reacting.stars.since + r.start } };
        // Celebrating on a moving window: only the eyes, the cheeks and the stars; the body is the physics'.
        if (reacting && r.kind === "celebrate" && alongWindow) reacting = only(reacting, CELEBRATE_RIDING);
      }
      if (reacting) claims.push({ layer: "reaction", draft: reacting });

      // ---- the rest: where it is, and whether something brings it up (asking, a reaction, a fall, a drag)
      const lowered = !s.drag && !bumping && !moved && !reacting && !exiting && !asks;
      const peek = s.rest === "peek" && lowered;
      const sitting = s.rest === "sit" && lowered && !reduced;
      if (sat && !sitting) roseAt = now;
      sat = sitting;
      const rising = !sitting && !moved && !s.drag && !reduced ? standUp(now - roseAt) : null;
      const dozing = s.rest === "doze" && lowered && !s.asleep && !reduced;
      const hiding = s.rest === "edge" && lowered && !reduced;

      // ---- P: the quirk, only idle, awake and standing still, or sat on a top (what it does sitting)
      const q = s.quirk;
      const quirking =
        q && s.mood === "idle" && !s.drag && !bumping && !moved && !exiting && !s.asleep && (s.rest === "stand" || sitting) && !reduced ? quirkPose(q, now - q.start, sitting) : null;
      if (quirking) claims.push({ layer: "quirk", draft: quirking });

      // ---- H: the mood (asking, a reaction or a fall brings it up out of the peek or the seat; working stays down, without
      // its panel and its typing)
      // Standing still, the physics holds the feet on the support and the contact shadow, under what is only drawn: a
      // reaction's hops lift the feet, a quirk walks them to the end and back, the peek hides them, the seat hangs them
      // over the edge and the hide takes them out past it, while the feet stay on the top all the same.
      if (b && !moved && !peek && !sitting && !hiding) {
        const still: Draft = { shadow: 1 };
        if (!reacting?.legL && !reacting?.legR && !quirking?.legL && !quirking?.legR && !rising) {
          still.legL = foot(0);
          still.legR = foot(1);
        }
        claims.push({ layer: "physics", draft: still });
      }
      // Reduced: a moment with the arm up and the "!" showing.
      const me = reduced ? STILL_MOOD_MS : now - moodSince;
      if (asks) claims.push({ layer: "mood", draft: asking(me) });
      else if (s.mood === "working") claims.push({ layer: "mood", draft: peek || sitting || hiding ? only(working(me), WORK_LOW) : working(me) });

      // ---- B: the base
      const look = s.look && now - s.look.at < LOOK_MS && !s.asleep ? s.look : null;
      if (look && !looking) lookSince = Math.min(now, look.at);
      looking = look !== null;
      const lookSide = look && Math.abs(look.x) >= SIDE ? Math.sign(look.x) : 0;
      if (lookSide !== side) {
        side = lookSide;
        sideSince = look ? Math.min(now, look.at) : now;
      }
      const base: Draft = reduced ? {} : { ...breathing(now) };
      if (s.asleep) Object.assign(base, ASLEEP);
      // Working, the eyes are on the work unless the cursor calls them.
      else if (s.mood === "working") base.gaze = WORK_GAZE;
      const l = look ? lookAt(now, look, sideSince) : null;
      if (l) {
        // The eyes at once, the head 80 ms later, the chest after it.
        base.gaze = l.gaze;
        base.root = l.root;
        if (now - lookSince >= LEAD.head) base.head = l.head;
        if (now - lookSince >= LEAD.body) base.chest = { twist: l.chest.twist, breath: base.chest?.breath ?? 0 };
      }
      if (peek) {
        base.pelvis = { y: PEEK_Y, lean: base.pelvis?.lean ?? [0, 0], pivot: "feet" };
        base.legL = HANG;
        base.legR = HANG;
        base.shadow = 0;
      } else if (sitting) {
        const d = sit(now, now - restSince);
        Object.assign(base, only(d, ["pelvis", "squash", "legL", "legR", "armL", "armR", "shadow"]));
        base.chest = { twist: base.chest?.twist ?? 0, breath: d.chest!.breath };
        if (!s.asleep) {
          Object.assign(base, only(d, ["lids", "brows", "mouth"]));
          if (!l) {
            base.head = d.head!;
            base.gaze = d.gaze!;
          }
        }
      } else if (hiding) {
        // Behind the edge: the body out of the box, from when it stood still there (after the walk and its little step);
        // the eyes on the cursor, or on the screen; asleep, the head nods where it peeks.
        const d = edgeHide(s.hideSide ?? 1, now, now - Math.max(restSince, movedAt));
        Object.assign(base, only(d, ["root", "pelvis", "squash", "chest", "legL", "legR", "armL", "armR", "head", "shadow"]));
        if (s.asleep) base.head = [d.head![0] + ASLEEP.head![0], d.head![1], d.head![2]];
        else {
          Object.assign(base, only(d, ["brows", "mouth"]));
          if (!l) base.gaze = d.gaze!;
        }
      } else if (rising) Object.assign(base, rising);
      else if (dozing) {
        const d = dozeOff(now, now - restSince);
        Object.assign(base, only(d, ["pelvis", "lids", "brows", "mouth"]));
        if (!l) base.head = d.head!;
      }
      // After a yawn (the quirk's cue kept until something wakes it), the rest it goes to stays sleepy until it sleeps: heavy
      // lids, the brows' inner ends up, the mouth slack (sleepy, not bored).
      if (q?.id === "yawn" && now - q.start >= YAWN_MS && !s.asleep) {
        base.lids = [Math.max(base.lids?.[0] ?? 0, SLEEPY_LIDS), base.lids?.[1] ?? 0];
        base.brows = SLEEPY_BROWS;
        base.mouth = SLEEPY_MOUTH;
      }
      claims.push({ layer: "base", draft: base });

      const { pose, owner } = compose(claims);
      owners = owner;
      // One signal at a time: while the page's badge counts who needs you, no "!" or "?" beside the head (the startle's,
      // the pause's, the alarm's); the badge says it.
      if (s.badge ?? asks) pose.props.mark = null;

      // ---- what the physics adds to the head and to the base's eyes without claiming them; with someone asking, going
      // along with a window leaves the head and the face to the request
      if (over?.head && !(asks && alongWindow)) pose.head = [pose.head[0] + over.head[0], pose.head[1] + over.head[1], pose.head[2] + over.head[2]];
      if (over?.gaze && owner.gaze === "base" && !look && !asks) pose.face.gaze = over.gaze;

      // ---- the eyes' life, over whatever holds the face
      if (!reduced && !s.asleep) {
        const sees = eyes.at(now, pose.head[1] + pose.root.yaw, s.mood === "working" ? WORK_BLINKS : 1);
        // Wide-eyed in a panic (despair, the slip, the pause in the air) and out of a rest with the alarm: no blink shuts them.
        const wide = moved?.motion === "despair" || moved?.motion === "slip" || moved?.motion === "pause" || (!!exiting && !!x?.alarm);
        if (pose.face.eyes === "normal" && !wide) pose.face.lidUp = Math.max(pose.face.lidUp, sees.blink);
        if (owner.gaze === undefined || owner.gaze === "base") {
          // On the cursor the jumps are half as big: the eyes stay on it.
          const k = look ? 0.5 : 1;
          const g = pose.face.gaze;
          pose.face.gaze = [clampGaze(g[0] + k * sees.saccade[0]), clampGaze(g[1] + k * sees.saccade[1])] as V2;
        }
      }

      // ---- what is always the mood's: the tint and the glow; the rim; the pace
      let tint: Frame["tint"] = asks ? "amber" : "lime";
      if (r && r.kind === "oops" && re >= 0 && re < REACTION_MS.oops && (reduced || OOPS_RED.some(([a, b]) => re >= a && re < b))) tint = "red";
      let glow: number = GLOW.rest;
      if (s.asleep) glow = GLOW.asleep;
      else if (reacting) glow = GLOW.reaction;
      else if (s.mood === "working") glow = reduced ? GLOW.work : GLOW.work + GLOW.workPulse * Math.sin((now / 1000) * 2 * Math.PI);
      else if (asks) glow = GLOW.asking;
      frame.pose = pose;
      frame.tint = tint;
      frame.glow = Math.min(1, Math.max(0, glow));
      frame.rim = RIM[s.theme];
      frame.pace = moved || quirking || rising || exiting || (!s.asleep && (s.drag || bumping || reacting || look || asks)) ? "active" : s.asleep ? "rest" : s.mood === "working" ? "work" : "rest";
      return frame;
    },
    owners: () => owners,
  };
}

/** The eyes stay on the face (model.ts clamps the gaze to ±0.02 too). */
const clampGaze = (v: number) => Math.min(0.02, Math.max(-0.02, v));
