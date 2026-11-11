import type { V3 } from "./ik";

export type V2 = [number, number];

/**
 * An arm by its angles, in radians, in the arm's own frame and mirrored on the left, so equal numbers make a symmetric pose:
 * all zeros is the arm hanging at the side; shoulder [swing forward, twist, raise away from the body], elbow bend, wrist [bend, turn].
 * Or a target for the hand (IK), in the stage's space (see Leg). grip goes from 0, open (waving), to 1, closed (holding).
 */
export type Arm = { kind: "angles"; shoulder: V3; elbow: number; wrist: V2; grip: number } | { kind: "reach"; at: V3; grip: number };
/**
 * A foot planted at a target, or the leg hanging loose on its springs. Targets (feet and hands) are in the stage's space:
 * origin on the floor where the feet stand in the box, x right, y up, z towards the camera, in units (1 ≈ 100 px).
 * The root's x and yaw don't move them, so a planted foot stays put while the body shifts over it.
 */
export type Leg = { kind: "foot"; at: V3 } | { kind: "hang" };
export type Eyes = "normal" | "x" | "spiral";

export interface Props {
  sweat: number;                                                        // drops per second, 0–6
  stars: { mode: "orbit" | "tumble" | "burst"; since: number } | null;  // 3 orbiting, 2 quick, 5 leaving
  dust: { count: number; since: number } | null;                        // one burst per `since`
  mark: "!" | "?" | null;                                               // "…" and "zzz" are CSS, on the page
  panel: boolean;
  shadow: number;                                                       // contact shadow, 0–1
}

/** What the character should look like this frame (the spec's "Como ele se mexe"); the rig only applies it, through springs. */
export interface Pose {
  root: { x: number; yaw: number };                    // units (1 ≈ 100 px); yaw in radians, 0 = facing the camera
  /** Height of the pelvis above the floor in units (0.22 standing), lean [about x, about z] in radians, and what it swings from. */
  pelvis: { y: number; lean: V2; pivot: "feet" | "head" };
  squash: number;                                      // height scale, 1 at rest (0.9 crouched, 1.12 stretched)
  squashX: number;                                     // width scale, 1 at rest; both with the volume kept by the model
  chest: { twist: number; breath: number };            // twist in radians; breath = how much the chest swells now (scale − 1)
  head: V3;                                            // neck angles in radians: [nod, turn, tilt]
  face: {
    gaze: V2;                                          // the eyes' offset on the face in units, x right, y up, within ±0.02
    lidUp: number;                                     // 0 open … 1 closed
    lidLow: number;                                    // 0 down … 1 up (the smiling eye)
    brows: V2;                                         // [raise, tilt]: raise −1 … 1; tilt > 0 inner ends up (sad), < 0 down (cross, focused)
    mouth: number;                                     // -1 frown … 1 smile
    open: number;                                      // 0 closed … 1 wide open
    blush: number;                                     // 0 … 1
    eyes: Eyes;
  };
  arms: [Arm, Arm];                                    // [left, right], the character's own sides (left is +x facing the camera)
  legs: [Leg, Leg];                                    // [left, right]
  antennaKick: V2;                                     // radians added to the antenna springs' targets [about x, about z]
  props: Props;
}

/** A new pose at rest: standing, facing the camera, arms down, feet planted at (±0.12, 0, 0.04). */
function rest(): Pose {
  return {
    root: { x: 0, yaw: 0 },
    pelvis: { y: 0.22, lean: [0, 0], pivot: "feet" },
    squash: 1,
    squashX: 1,
    chest: { twist: 0, breath: 0 },
    head: [0, 0, 0],
    face: { gaze: [0, 0], lidUp: 0, lidLow: 0, brows: [0, 0], mouth: 0.6, open: 0, blush: 0, eyes: "normal" },
    arms: [
      { kind: "angles", shoulder: [0, 0, 0], elbow: 0, wrist: [0, 0], grip: 0 },
      { kind: "angles", shoulder: [0, 0, 0], elbow: 0, wrist: [0, 0], grip: 0 },
    ],
    legs: [{ kind: "foot", at: [0.12, 0, 0.04] }, { kind: "foot", at: [-0.12, 0, 0.04] }],
    antennaKick: [0, 0],
    props: { sweat: 0, stars: null, dust: null, mark: null, panel: false, shadow: 1 },
  };
}

function deepFreeze<T>(o: T): T {
  if (o && typeof o === "object") {
    for (const v of Object.values(o)) deepFreeze(v);
    Object.freeze(o);
  }
  return o;
}

/** Standing, facing the camera, arms down, feet planted at (±0.12, 0, 0.04). Frozen: compose hands out copies. */
export const REST: Pose = deepFreeze(rest());

export type Layer = "drag" | "physics" | "reaction" | "quirk" | "mood" | "base";
/** Highest first: drag (with the crash) > physics > reaction > quirk > steady mood > base. */
export const LAYERS: readonly Layer[] = ["drag", "physics", "reaction", "quirk", "mood", "base"];

export type Channel = "root" | "pelvis" | "squash" | "chest" | "head" | "gaze" | "lids" | "brows" | "mouth" | "blush" | "eyes"
  | "armL" | "armR" | "legL" | "legR" | "sweat" | "stars" | "dust" | "mark" | "panel" | "shadow";
export const CHANNELS: readonly Channel[] = ["root", "pelvis", "squash", "chest", "head", "gaze", "lids", "brows", "mouth", "blush", "eyes",
  "armL", "armR", "legL", "legR", "sweat", "stars", "dust", "mark", "panel", "shadow"];

/** What one layer wants: one optional field per channel; squash = [squash, squashX], lids = [up, low], mouth = [curve, open]. */
export interface Draft {
  root?: Pose["root"]; pelvis?: Pose["pelvis"]; squash?: V2; chest?: Pose["chest"]; head?: V3;
  gaze?: V2; lids?: V2; brows?: V2; mouth?: V2; blush?: number; eyes?: Eyes;
  armL?: Arm; armR?: Arm; legL?: Leg; legR?: Leg;
  sweat?: number; stars?: Props["stars"]; dust?: Props["dust"]; mark?: Props["mark"]; panel?: boolean; shadow?: number;
  antennaKick?: V2;
}
export interface Claim { layer: Layer; draft: Draft }

type Value<C extends Channel> = Exclude<Draft[C], undefined>;

/**
 * Channel by channel the highest layer that claims it wins; REST fills the rest; the antenna's kicks add up.
 * A field set to null (stars, dust, mark) is a claim: "none". Within one layer the first claim wins.
 * The pose is new, but the winning values are the drafts' own (not copied).
 */
export function compose(claims: Claim[]): { pose: Pose; owner: Partial<Record<Channel, Layer>> } {
  const won: Partial<Record<Channel, Draft>> = {};
  const owner: Partial<Record<Channel, Layer>> = {};
  const antennaKick: V2 = [0, 0];
  for (const { layer, draft } of claims) {
    const rank = LAYERS.indexOf(layer);
    for (const ch of CHANNELS) {
      if (draft[ch] === undefined) continue;
      const held = owner[ch];
      if (held === undefined || rank < LAYERS.indexOf(held)) {
        won[ch] = draft;
        owner[ch] = layer;
      }
    }
    if (draft.antennaKick) {
      antennaKick[0] += draft.antennaKick[0];
      antennaKick[1] += draft.antennaKick[1];
    }
  }
  const at = rest();
  const get = <C extends Channel>(ch: C, fallback: Value<C>): Value<C> => {
    const v = won[ch]?.[ch];
    return v === undefined ? fallback : (v as Value<C>);
  };
  const [squash, squashX] = get("squash", [at.squash, at.squashX]);
  const [lidUp, lidLow] = get("lids", [at.face.lidUp, at.face.lidLow]);
  const [mouth, open] = get("mouth", [at.face.mouth, at.face.open]);
  const pose: Pose = {
    root: get("root", at.root),
    pelvis: get("pelvis", at.pelvis),
    squash,
    squashX,
    chest: get("chest", at.chest),
    head: get("head", at.head),
    face: {
      gaze: get("gaze", at.face.gaze), lidUp, lidLow, brows: get("brows", at.face.brows),
      mouth, open, blush: get("blush", at.face.blush), eyes: get("eyes", at.face.eyes),
    },
    arms: [get("armL", at.arms[0]), get("armR", at.arms[1])],
    legs: [get("legL", at.legs[0]), get("legR", at.legs[1])],
    antennaKick,
    props: {
      sweat: get("sweat", at.props.sweat), stars: get("stars", at.props.stars), dust: get("dust", at.props.dust),
      mark: get("mark", at.props.mark), panel: get("panel", at.props.panel), shadow: get("shadow", at.props.shadow),
    },
  };
  return { pose, owner };
}
