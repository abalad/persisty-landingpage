import * as THREE from "three";
import { LIME } from "@/components/studio/parts";
import type { Frame } from "./cues";
import type { V3 } from "./ik";
import { RIM_BASE, RIM_TINT, applyArm, applyBody, applyFace, applyGrip, placeFoot, reachHand, stretchArm, type CharacterModel } from "./model";
import { REST, type Pose } from "./pose";
import type { PropPools } from "./props";
import { SPRINGS, stepSpring, type Spring, type Tuning } from "./springs";

/**
 * Brings the model to each frame's pose: every channel on its spring (the spec's "Molas que passam do ponto"), then the
 * model's own helpers write the joints, in its order: root, pelvis, torso and chest, head and antenna; then the limbs
 * (angles, or IK for planted feet and reaching hands); then the face; then the props around the head and the antenna, the
 * tint and the rim. With reduced motion every channel goes straight to its target.
 *
 * Decisions on what the spec leaves open (tuned in the gallery):
 * - The face is not sprung: blinks and saccades jump (spec), and the timelines that write the face ease its expressions.
 * - The legs don't squash (model.ts): below 1 the squash lowers the pelvis by SINK per unit, and the IK bends the knees.
 * - The breath rides the belly's spring, so a sudden swell wobbles; the chest's twist rides the lean's.
 * - Each limb blends between its two ways (angles or hanging, IK) on a spring of its own, so a hand that takes hold of an
 *   edge or a foot that leaves the floor turns over smoothly instead of jumping; a raised arm's stretch goes over with it.
 * - "Moving" means on the way somewhere (MOVING): breathing, working's nod and other slow, continuous motion draw at the
 *   pace the director asks for, not at the active one.
 * - The antenna lags behind the head's and the body's motion (WHIP), each joint behind the one below, on top of the kick.
 * - A body held by the head ("head" pivot) swings on the `hang` tuning around the skull's centre.
 * Nothing is allocated per frame here; the IK's two-bone solve still returns small arrays (accepted for now).
 */
export interface Animator {
  /**
   * Joints towards `frame` by their springs (straight there with reduced motion), legs and reaching arms by IK, props and
   * tint; true while anything is still on its way (MOVING), a prop moves or the tint eases over.
   */
  step(frame: Frame, now: number, dt: number): boolean;
  /** Reduced motion turned on or off with the page open: from the next step, straight to the pose, or by the springs again. */
  setReduced(on: boolean): void;
}

/** The antenna's tints: lime, amber when someone asks, red on an error (today's rig's colors). */
export const TINTS = { lime: LIME, amber: 0xe3b24a, red: 0xef7d7d } as const;

/** How far the pelvis sinks per unit of squash below 1: 0.85 takes it 0.06 down (6 px), and the knees bend. */
const SINK = 0.4;
/** A leg hanging loose: the thigh a little forward, the knee a little bent; gravity keeps it down against the body's lean. */
const HANG = { swing: -0.15, knee: 0.35 };
/** A limb turning over between its angles and its IK: critically damped, quick, never past. */
const BLEND: Tuning = [5, 1];
/**
 * A channel is still on its way while it is `off` from its target (units or rad: ~2 px) or faster than `speed` (per s,
 * ~50 px/s). Breathing (±0.012), the weight's shift (±0.02 at 0.3 Hz) and working's nod (±0.03 at 1.1 Hz) stay under both,
 * so they draw at the director's pace (10 or 20 fps); a settle after a change draws at the active one.
 */
const MOVING = { off: 0.02, speed: 0.5 };
/**
 * How far the antenna bends behind the motion, in radians per unit a second: the head's and the body's turning, the
 * body sliding sideways, and each joint behind the one below it.
 */
const WHIP = { head: 0.05, sway: 0.05, slide: 0.25, chain: 0.04 };
/** How fast the tint eases over (1/s), and how the antenna's emissive follows the glow (0–1). */
const TINT_RATE = 6;
const GLOW = { base: 0.5, gain: 1.5 };
/** Props that still move: stars that burst or tumble, dust and a mark coming in, for this long after they start (ms). */
const PROP_MS = { stars: 1300, dust: 600, mark: 600 };

type Side = 0 | 1;
const SIDES = [0, 1] as const;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const spring = (x = 0): Spring => ({ x, v: 0 });

interface ArmSprings { shoulder: [Spring, Spring, Spring]; elbow: Spring; wrist: [Spring, Spring]; grip: Spring; reach: Spring }
interface LegSprings { swing: [Spring, Spring]; knee: Spring; plant: Spring }

export function createAnimator(model: CharacterModel, props: PropPools, o: { reduced: boolean }): Animator {
  let reduced = o.reduced;
  const j = model.joints;

  // ---- the springs, at REST
  const root = { x: spring(REST.root.x), yaw: spring(REST.root.yaw) };
  const pelvis = { y: spring(REST.pelvis.y), lean: [spring(), spring()] as const };
  const squash = [spring(REST.squash), spring(REST.squashX)] as const;
  const belly = spring(REST.chest.breath);
  const twist = spring(REST.chest.twist);
  const head = [spring(), spring(), spring()] as const;
  const antenna = [[spring(), spring()], [spring(), spring()], [spring(), spring()]] as const;
  const arms: [ArmSprings, ArmSprings] = [armSprings(), armSprings()];
  const legs: [LegSprings, LegSprings] = [legSprings(), legSprings()];
  function armSprings(): ArmSprings {
    return { shoulder: [spring(), spring(), spring()], elbow: spring(), wrist: [spring(), spring()], grip: spring(), reach: spring() };
  }
  function legSprings(): LegSprings {
    return { swing: [spring(HANG.swing), spring()], knee: spring(HANG.knee), plant: spring(1) };
  }

  // ---- what each limb last asked for, kept while it turns over to its other way
  const angleGoal = SIDES.map(() => ({ shoulder: [0, 0, 0] as V3, elbow: 0, wrist: [0, 0] as [number, number] }));
  const angleNow = SIDES.map(() => ({ shoulder: [0, 0, 0] as V3, elbow: 0, wrist: [0, 0] as [number, number], grip: 0 }));
  const reachAt: [V3, V3] = [[0, 0, 0], [0, 0, 0]];
  const footAt: [V3, V3] = [[0, 0, 0], [0, 0, 0]];
  for (const i of SIDES) {
    const leg = REST.legs[i];
    if (leg.kind === "foot") footAt[i] = [leg.at[0], leg.at[1], leg.at[2]];
  }
  const qa = [new THREE.Quaternion(), new THREE.Quaternion(), new THREE.Quaternion()] as const;
  const qb = [new THREE.Quaternion(), new THREE.Quaternion(), new THREE.Quaternion()] as const;

  // The skull's centre above the pelvis, standing: what a body held by the head swings around.
  const headPivot = model.anchors.skull.getWorldPosition(new THREE.Vector3()).y - j.pelvis.getWorldPosition(new THREE.Vector3()).y;
  const swing = new THREE.Vector3();

  // ---- the tint and the props' places
  const tintColors = { lime: new THREE.Color(TINTS.lime), amber: new THREE.Color(TINTS.amber), red: new THREE.Color(TINTS.red) };
  const tintNow = new THREE.Color(TINTS.lime);
  const rimBase = new THREE.Color(RIM_BASE);
  const headAt = new THREE.Vector3();
  const ballAt = new THREE.Vector3();
  const propArgs: { now: number; dt: number; head: THREE.Vector3; antenna: THREE.Vector3; glow: number; height: number; floor: number | undefined; reduced: boolean } =
    { now: 0, dt: 0, head: headAt, antenna: ballAt, glow: 0, height: 0, floor: undefined, reduced };
  let lastMark: Pose["props"]["mark"] = null;
  let markAt = -Infinity;

  // ---- one step
  let h = 0;
  let moving = false;
  /** One channel towards its target: straight there with reduced motion. */
  function go(s: Spring, target: number, tuning: Tuning) {
    if (reduced) {
      s.x = target;
      s.v = 0;
      return;
    }
    stepSpring(s, target, tuning, h);
    if (Math.abs(s.x - target) > MOVING.off || Math.abs(s.v) > MOVING.speed) moving = true;
  }

  /** Two poses of a chain (upper, middle, end), blended: `qa` and `qb` hold them, `k` from the first to the second. */
  function blend(a: THREE.Object3D, b: THREE.Object3D, c: THREE.Object3D, k: number) {
    a.quaternion.slerpQuaternions(qa[0], qb[0], k);
    b.quaternion.slerpQuaternions(qa[1], qb[1], k);
    c.quaternion.slerpQuaternions(qa[2], qb[2], k);
  }
  const keep = (into: typeof qa, a: THREE.Object3D, b: THREE.Object3D, c: THREE.Object3D) => {
    into[0].copy(a.quaternion);
    into[1].copy(b.quaternion);
    into[2].copy(c.quaternion);
  };

  function arm(i: Side, a: Pose["arms"][Side]) {
    const s = arms[i];
    const goal = angleGoal[i]!;
    const now = angleNow[i]!;
    if (a.kind === "angles") {
      goal.shoulder[0] = a.shoulder[0];
      goal.shoulder[1] = a.shoulder[1];
      goal.shoulder[2] = a.shoulder[2];
      goal.elbow = a.elbow;
      goal.wrist[0] = a.wrist[0];
      goal.wrist[1] = a.wrist[1];
    } else {
      reachAt[i][0] = a.at[0];
      reachAt[i][1] = a.at[1];
      reachAt[i][2] = a.at[2];
    }
    for (let k = 0; k < 3; k++) go(s.shoulder[k]!, goal.shoulder[k]!, SPRINGS.arms);
    go(s.elbow, goal.elbow, SPRINGS.arms);
    go(s.wrist[0], goal.wrist[0], SPRINGS.arms);
    go(s.wrist[1], goal.wrist[1], SPRINGS.arms);
    go(s.grip, a.grip, SPRINGS.arms);
    go(s.reach, a.kind === "reach" ? 1 : 0, BLEND);
    const k = clamp01(s.reach.x);
    const sh = j.shoulder[i];
    const el = j.elbow[i];
    const wr = j.wrist[i];
    let up = 0;
    if (k < 0.999) {
      now.shoulder[0] = s.shoulder[0].x;
      now.shoulder[1] = s.shoulder[1].x;
      now.shoulder[2] = s.shoulder[2].x;
      now.elbow = s.elbow.x;
      now.wrist[0] = s.wrist[0].x;
      now.wrist[1] = s.wrist[1].x;
      now.grip = s.grip.x;
      up = applyArm(model, i, now);
    } else applyGrip(model, i, s.grip.x);
    if (k <= 0.001) return;
    if (k < 0.999) keep(qa, sh, el, wr);
    reachHand(model, i, reachAt[i]);
    if (k < 0.999) {
      keep(qb, sh, el, wr);
      blend(sh, el, wr, k);
      // The IK's arm is the plain one: a raised arm's stretch lets go along the way, not at once.
      stretchArm(model, i, up * (1 - k));
    }
  }

  function leg(i: Side, l: Pose["legs"][Side]) {
    const s = legs[i];
    if (l.kind === "foot") {
      footAt[i][0] = l.at[0];
      footAt[i][1] = l.at[1];
      footAt[i][2] = l.at[2];
    }
    // Hanging, the leg keeps down whatever the body's lean.
    go(s.swing[0], HANG.swing - pelvis.lean[0].x, SPRINGS.hangingLegs);
    go(s.swing[1], -pelvis.lean[1].x, SPRINGS.hangingLegs);
    go(s.knee, HANG.knee, SPRINGS.hangingLegs);
    go(s.plant, l.kind === "foot" ? 1 : 0, BLEND);
    const k = clamp01(s.plant.x);
    const hp = j.hip[i];
    const kn = j.knee[i];
    const an = j.ankle[i];
    if (k < 0.999) {
      hp.rotation.set(s.swing[0].x, 0, s.swing[1].x);
      kn.rotation.set(s.knee.x, 0, 0);
      an.rotation.set(0, 0, 0);
    }
    if (k <= 0.001) return;
    if (k < 0.999) keep(qa, hp, kn, an);
    placeFoot(model, i, footAt[i]);
    if (k < 0.999) {
      keep(qb, hp, kn, an);
      blend(hp, kn, an, k);
    }
  }

  function propsMoving(p: Pose["props"], now: number) {
    if (reduced) return false;
    if (p.mark !== lastMark) {
      lastMark = p.mark;
      markAt = now;
    }
    if (p.sweat > 0 || now - markAt < PROP_MS.mark) return true;
    if (p.stars && (p.stars.mode === "orbit" || now - p.stars.since < PROP_MS.stars)) return true;
    return !!p.dust && now - p.dust.since < PROP_MS.dust;
  }

  return {
    step(frame, now, dt) {
      const pose = frame.pose;
      h = dt;
      moving = false;

      // ---- the trunk
      go(root.x, pose.root.x, SPRINGS.x);
      go(root.yaw, pose.root.yaw, SPRINGS.yaw);
      const held = pose.pelvis.pivot === "head";
      go(pelvis.y, pose.pelvis.y, SPRINGS.squash);
      go(pelvis.lean[0], pose.pelvis.lean[0], held ? SPRINGS.hang : SPRINGS.lean);
      go(pelvis.lean[1], pose.pelvis.lean[1], held ? SPRINGS.hang : SPRINGS.lean);
      go(squash[0], pose.squash, SPRINGS.squash);
      go(squash[1], pose.squashX, SPRINGS.squash);
      go(belly, pose.chest.breath, SPRINGS.belly);
      go(twist, pose.chest.twist, SPRINGS.lean);
      for (let k = 0; k < 3; k++) go(head[k]!, pose.head[k]!, SPRINGS.head);

      j.root.position.x = root.x.x;
      j.root.rotation.y = root.yaw.x;
      const y = pelvis.y.x - SINK * Math.max(0, 1 - squash[0].x);
      j.pelvis.rotation.set(pelvis.lean[0].x, 0, pelvis.lean[1].x);
      if (held) {
        // Turned around the skull's centre, which stays where it would be standing.
        swing.set(0, -headPivot, 0).applyEuler(j.pelvis.rotation);
        j.pelvis.position.set(swing.x, y + headPivot + swing.y, swing.z);
      } else j.pelvis.position.set(0, y, 0);
      applyBody(model, squash[0].x, squash[1].x, belly.x);
      j.chest.rotation.y = twist.x;
      j.head.rotation.set(head[0].x, head[1].x, head[2].x);

      // ---- the antenna: the kick, and a lag behind the motion, each joint behind the one below
      const kickX = pose.antennaKick[0];
      const kickZ = pose.antennaKick[1];
      go(antenna[0][0], kickX - WHIP.head * head[0].v - WHIP.sway * pelvis.lean[0].v, SPRINGS.antenna[0]);
      go(antenna[0][1], kickZ - WHIP.head * head[2].v - WHIP.sway * pelvis.lean[1].v + WHIP.slide * root.x.v, SPRINGS.antenna[0]);
      for (let k = 1; k < 3; k++) {
        const below = antenna[k - 1]!;
        go(antenna[k]![0], kickX - WHIP.chain * below[0].v, SPRINGS.antenna[k]!);
        go(antenna[k]![1], kickZ - WHIP.chain * below[1].v, SPRINGS.antenna[k]!);
      }
      for (let k = 0; k < 3; k++) j.antenna[k]!.rotation.set(antenna[k]![0].x, 0, antenna[k]![1].x);

      // ---- the limbs, then the face
      for (const i of SIDES) {
        arm(i, pose.arms[i]);
        leg(i, pose.legs[i]);
      }
      applyFace(model, pose.face, now);

      // ---- the props, around where the head and the antenna are now
      model.group.updateMatrixWorld(true);
      model.anchors.skull.getWorldPosition(headAt);
      model.anchors.ball.getWorldPosition(ballAt);
      // How far the feet are above the floor: the lowest planted one, or, both hanging, how far the body rose.
      const l0 = pose.legs[0];
      const l1 = pose.legs[1];
      const planted = l0.kind === "foot" ? (l1.kind === "foot" ? Math.min(l0.at[1], l1.at[1]) : l0.at[1]) : l1.kind === "foot" ? l1.at[1] : NaN;
      propArgs.now = now;
      propArgs.dt = dt;
      propArgs.glow = frame.glow;
      propArgs.height = Number.isNaN(planted) ? Math.max(0, pelvis.y.x - REST.pelvis.y) : Math.max(0, planted);
      // A planted foot is drawn over the stage's floor (y 0): the shadow and the dust stay on it while a hop lifts the feet.
      propArgs.floor = Number.isNaN(planted) ? undefined : 0;
      props.update(pose.props, propArgs);
      if (propsMoving(pose.props, now)) moving = true;

      // ---- the tint (the antenna, its halo and 30% of the rim) and the rim's strength
      const goal = tintColors[frame.tint];
      if (reduced) tintNow.copy(goal);
      else {
        tintNow.lerp(goal, 1 - Math.exp(-dt * TINT_RATE));
        if (Math.abs(tintNow.r - goal.r) + Math.abs(tintNow.g - goal.g) + Math.abs(tintNow.b - goal.b) < 1e-3) tintNow.copy(goal);
        else moving = true;
      }
      model.antennaMaterial.color.copy(tintNow);
      model.antennaMaterial.emissive.copy(tintNow);
      model.antennaMaterial.emissiveIntensity = GLOW.base + GLOW.gain * frame.glow;
      props.tint.copy(tintNow);
      model.rim.color.value.copy(rimBase).lerp(tintNow, RIM_TINT);
      model.rim.strength.value = frame.rim;
      return moving;
    },
    setReduced(on) {
      reduced = on;
      propArgs.reduced = on;
    },
  };
}
