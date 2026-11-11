import * as THREE from "three";
import { DARK, LIME, canvasTexture } from "@/components/studio/parts";
import { twoBone, type V3 } from "./ik";
import { REST, type Pose, type V2 } from "./pose";

/**
 * The floating window's mascot, built from three.js primitives: the same white clay, big round head, dark eyes, smile and
 * lime antenna as `createMascot`, now with short legs, elbows, gloved hands with thumbs, lids, brows and a mouth that opens.
 *
 * Units: 1 ≈ 100 px. Stage space (where foot and hand targets live): origin on the floor between the feet, x right, y up,
 * z towards the camera; the character faces +z, so its left is +x. `group` is the root joint and sits in an untransformed
 * scene, so world space is stage space. Nothing here draws: the rig owns the renderer.
 *
 * Skeleton (positions at rest, in stage units; every joint is an Object3D with its pivot at the joint):
 *
 * | joint            | parent   | pivot                         | rest orientation and axes |
 * |------------------|----------|-------------------------------|---------------------------|
 * | root (= group)   | scene    | (0, 0, 0), on the floor       | position.x = Pose.root.x; rotation.y = yaw (0 faces the camera) |
 * | pelvis           | root     | y 0.22 (Pose.pelvis.y)        | rotation.x leans forward (+, top towards +z), rotation.z leans to the right (+, top towards −x) |
 * | torso            | pelvis   | the pelvis                    | holds the bean; its scale is the squash (`applyBody`, volume kept) |
 * | chest            | pelvis   | y 0.50 (0.28 up the torso)    | rotation.y = twist; position.y rides the torso's height (`applyBody`) |
 * | neck → head      | chest    | y 0.58, then 0.62 (skull base)| Euler YXZ: x = nod (+ face down), y = turn (+ towards +x), z = tilt (+ top towards −x); Pose.head goes to `head` as is |
 * | antenna0..2      | head     | y 1.19, 1.26, 1.32            | straight up at zero; rotation.x bends forward (+), rotation.z bends towards −x (+) |
 * | shoulder[i]      | chest    | (±0.27, 0.54)                 | at zero the arm points straight down (−y), frames aligned with the chest; Euler XZY; drive with `applyArm` or `reachHand`; a raise above the horizontal lifts it (ARM_UP) |
 * | elbow[i]         | shoulder | 0.15 down the arm             | one axis: rotation.x = −bend (the forearm folds forward); raised, the arm stretches (ARM_UP) |
 * | wrist[i]         | elbow    | 0.13 down the forearm         | rotation.x = −bend (the hand folds forward), rotation.y = ±turn |
 * | thumb[i]         | wrist    | front edge of the glove       | `applyGrip`: 0 spread forward (waving) … 1 folded on the palm (holding) |
 * | hip[i]           | pelvis   | (±0.12, 0.22)                 | at zero the thigh points straight down; Euler unused: `placeFoot` sets the quaternion |
 * | knee[i]          | hip      | 0.095 down the thigh          | one axis: rotation.x = bend (+, the shin folds back) |
 * | ankle[i]         | knee     | 0.09 down the shin, 0.045 above the sole | the foot points +z, flat at zero; `placeFoot` keeps it flat, facing where the root faces |
 *
 * i = 0 is the character's left (+x), 1 its right; the arms' angles are mirrored (`applyArm`): equal numbers, symmetric pose.
 *
 * The face lies pressed onto the skull (FACE): from the front it is the domed eyes, lids and mouth it always was, and a
 * turned head keeps its outline.
 *
 * Draws at rest: 29 meshes (lids, open mouth, X and spiral eyes start hidden). The props (props.ts) live outside `group`.
 */

/** How strong the Fresnel rim is, by theme. */
export const RIM = { dark: 0.3, light: 0.18 } as const;
/** The rim's own color, before it leans RIM_TINT towards the antenna's: a cold blue, so with 30% of lime it is still cool. */
export const RIM_BASE = 0xbcd0ff;
/** How far the rim leans towards the antenna's tint (lime, amber when someone asks, red on an error). */
export const RIM_TINT = 0.3;
/**
 * The rim's band: it rises from nothing where the surface turns `from` away from the camera (1 − n·v) to all of it at `to`,
 * about the outer 2 px of the head at 200 px, and `gain` times the theme's strength is how much light it adds there.
 */
const RIM_EDGE = { from: 0.55, to: 0.95, gain: 2.4 };
/**
 * The lime ball keeps its color: off the tone mapping (ACES washed it out to pale yellow) and rolled off towards white's
 * peak by its brightest channel, so the hue and the saturation stay while a brighter glow still reads brighter. `roll` is
 * how fast it gets there: the glow at rest (0.35) lands close to LIME itself.
 */
const GLOW = { roll: 1.3 };

export interface CharacterModel {
  group: THREE.Group;                                 // the root joint, at the feet (origin between them)
  joints: {
    root: THREE.Object3D; pelvis: THREE.Object3D; torso: THREE.Object3D; chest: THREE.Object3D; neck: THREE.Object3D; head: THREE.Object3D;
    antenna: [THREE.Object3D, THREE.Object3D, THREE.Object3D];
    shoulder: [THREE.Object3D, THREE.Object3D]; elbow: [THREE.Object3D, THREE.Object3D]; wrist: [THREE.Object3D, THREE.Object3D]; thumb: [THREE.Object3D, THREE.Object3D];
    hip: [THREE.Object3D, THREE.Object3D]; knee: [THREE.Object3D, THREE.Object3D]; ankle: [THREE.Object3D, THREE.Object3D];
  };
  face: { eyes: [THREE.Mesh, THREE.Mesh]; glints: [THREE.Mesh, THREE.Mesh]; lidsUp: [THREE.Mesh, THREE.Mesh]; lidsLow: [THREE.Mesh, THREE.Mesh];
          brows: [THREE.Mesh, THREE.Mesh]; smile: THREE.Mesh; mouth: THREE.Group; cheeks: [THREE.Mesh, THREE.Mesh];
          xEyes: [THREE.Group, THREE.Group]; spirals: [THREE.Mesh, THREE.Mesh] };
  /** What the IK uses: bone lengths, the ankle's height above the sole (a foot target is on the floor) and the wrist → palm centre. */
  limbs: { thigh: number; shin: number; upperArm: number; forearm: number; ankle: number; hand: number };
  /** The skull's centre (for the props around the head) and the lime ball's centre (for the halo). */
  anchors: { skull: THREE.Object3D; ball: THREE.Object3D };
  /** The arm's capsules, which stretch with the reach (applyArm). */
  armMeshes: { upper: [THREE.Mesh, THREE.Mesh]; fore: [THREE.Mesh, THREE.Mesh] };
  /** The Fresnel rim injected with onBeforeCompile into the clay. */
  rim: { strength: { value: number }; color: { value: THREE.Color } };
  antennaMaterial: THREE.MeshStandardMaterial;
  dispose(): void;
}

type Side = 0 | 1;
/** The character's left (+x) is side 0. */
const sign = (i: Side) => (i === 0 ? 1 : -1);
const SIDES = [0, 1] as const;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// ---- measures (units) -------------------------------------------------------------------------------------------------

const PELVIS_Y = REST.pelvis.y;                  // 0.22
const CHEST_Y = 0.28;                            // above the pelvis: y 0.50 standing
const NECK_Y = 0.08;                             // above the chest
const HEAD_Y = 0.04;                             // above the neck: the skull's base, y 0.62
/** The skull, as in createMascot: radius 0.34, flattened 1.04 × 0.96; its centre 0.272 above the head joint (y 0.892). */
const SKULL = { r: 0.34, sx: 1.04, sy: 0.96, y: 0.272 };
const SKULL_A = SKULL.r * SKULL.sx;
const SKULL_B = SKULL.r * SKULL.sy;
/** The antenna: its base just inside the skull's top, three joints 0.065 apart, the ball 0.075 past the last (top at y ≈ 1.45). */
const ANTENNA = { base: SKULL.y + 0.3, seg: 0.065, ball: 0.075, ballR: 0.055, radii: [0.018, 0.016, 0.014] as const };
/** The bean: a lathe profile, its bottom 0.035 below the pelvis and its top hidden in the head; widest (0.28) low on the belly. */
const BEAN = { bottom: -0.035, top: 0.42, r: 0.28, skew: 0.716, n: 2.2, depth: 0.92 };
const SHOULDER = { x: 0.27, y: 0.04 };           // on the chest, just under the head
/** At zero the arm hangs a little away from the belly, the forearm a little forward: a relaxed hang, not a soldier's. */
const ARM_REST = { splay: 0.22, elbow: 0.2 };
const UPPER_ARM = 0.15;
const FOREARM = 0.13;
const HAND = 0.06;                               // wrist → the glove's centre
/** The arm's radii: upper arm and forearm. */
const ARM_R = { upper: 0.05, fore: 0.044 };
/** The mitten's half sizes: across the palm (thinner: the palm faces the body), along the hand, front to back. */
const GLOVE = [0.05, 0.075, 0.066] as const;
/**
 * The thumb: a capsule (`r`, `length`) on the mitten's front edge, its base at (x towards the body, y up from the centre, z);
 * stubby and set at the edge, so an open hand reads as a mitten with its thumb out, not a ball on a stick.
 */
const THUMB = { r: 0.026, length: 0.03, x: 0.016, y: 0.018, z: 0.056 };
/**
 * A clay arm reaches: as it points above the horizontal (0 level … 1 nearly straight up) the shoulder rises by `lift` and
 * moves out by `out`, the arm stretches by up to `stretch` of its length and the elbow's rest bend lets go, so a full raise
 * puts the mitten over the top of the head. Out as far as it rises, the raised arm's root stays beside the skull's outline
 * (with half of it, a wave's upper arm came out from behind the head). Hanging or held out, the arm is its usual length.
 */
const ARM_UP = { lift: 0.18, out: 0.1, stretch: 0.5, level: 0.05, full: 0.9 };
const HIP_X = 0.12;
const THIGH = 0.095;
const SHIN = 0.09;
const ANKLE = 0.045;                             // the ankle above the sole
const FOOT = { w: 0.062, h: 0.042, l: 0.095, fwd: 0.035 };

/** The face, around the skull's centre. */
const EYE = { x: 0.125, y: 0.045, a: 0.048, b: 0.07, c: 0.03, sink: 0.006 };
/**
 * Brows: a short, thin stroke of ink (`half` its half length, `r` its radius, `flat` pressed into the face like paint) with
 * a slight arch (`arch`, its middle up), so they read as brows and not as floating minus signs; they lift and tilt as before.
 */
const BROW = { x: 0.13, y: 0.155, lift: 0.032, tilt: 0.42, knit: 0.012, half: 0.024, r: 0.0085, flat: 0.55, arch: 0.008, segments: 8 };
const MOUTH = { y: -0.08 };
const CHEEK = { x: 0.2, y: -0.05, z: 0.282 };
/**
 * Lids: how far they may close (the upper leaves a dark sliver ~1.7 px tall, "‿", so a closed eye still reads; the lower
 * stops at the smiling eye, "^"), and how much they tilt with the brows.
 */
const LID = { up: 0.88, low: 0.72, tilt: 0.35, r: 1.14 };
/**
 * Where the eyes catch the light, in view space: up and to the right, like the key light. The glint sits on each eye where
 * this direction points in the face's frame (`gain` from direction to the eye's oval, `edge` how near its rim it may go), the
 * same spot in both eyes, sliding against the head's turn and nod.
 */
const GLINT_DIR = new THREE.Vector3(0.15, 0.25, 1).normalize();
const GLINT = { gain: 2.2, edge: 0.72 };
const BLUSH_REST = new THREE.Color(DARK.blush);
const BLUSH_HOT = new THREE.Color(0xff7d86);
/**
 * The face is pressed onto the skull. Seen from the front every feature keeps its outline and its shading (its x and y in
 * the face's frame, and the normals of its full shape), but its height above the skull, along the face's z, is `press` of
 * what its shape gives: the domed eye's 0.024 becomes 0.0024 (a quarter of a pixel at 200 px). So a turned head keeps its
 * outline, the far eye sliding behind the skull's curvature instead of standing out of it, and what was in front of what
 * stays so (a lid over the eye, the glint on it, the tongue in the mouth), since every height shrinks by the same factor.
 * The brows and the cheeks, on steeper skull, are pressed along their own normal instead, so their sides keep facing out
 * (their shading moves by a fraction of a pixel). `smile` lifts the mouth's line a little more: its morph between two
 * arcs on the skull passes under their chord.
 */
const FACE = { press: 0.1, smile: 0.001 };

/** The skull's front surface (z) at (x, y) of the face. */
function skullZ(x: number, y: number): number {
  return SKULL.r * Math.sqrt(Math.max(0, 1 - (x / SKULL_A) ** 2 - (y / SKULL_B) ** 2));
}

/** Presses `p` (face space) onto the skull along the face's z (FACE), raised by `lift` more. */
function press(p: THREE.Vector3, lift = 0): THREE.Vector3 {
  const s = skullZ(p.x, p.y);
  p.z = s + lift + FACE.press * (p.z - s);
  return p;
}

/** The s for which `o` + s·`d` (face space, `d` out of the skull) lies on the skull's front. */
function skullAlong(o: THREE.Vector3, d: THREE.Vector3): number {
  const ox = o.x / SKULL_A, oy = o.y / SKULL_B, oz = o.z / SKULL.r;
  const dx = d.x / SKULL_A, dy = d.y / SKULL_B, dz = d.z / SKULL.r;
  const a = dx * dx + dy * dy + dz * dz;
  const b = ox * dx + oy * dy + oz * dz;
  return (-b + Math.sqrt(Math.max(0, b * b - a * (ox * ox + oy * oy + oz * oz - 1)))) / a;
}

const _p = new THREE.Vector3();
const _o = new THREE.Vector3();
const _d = new THREE.Vector3();
const _toFace = new THREE.Matrix4();
const _fromFace = new THREE.Matrix4();
const _turn = new THREE.Matrix4();
const _euler = new THREE.Euler();

/**
 * How to press (FACE): `lift` raised by that much more (face units), `turn` the points turned first (a lid closing), `own`
 * along the mesh's own z rather than the face's.
 */
type PressHow = { lift?: number; turn?: THREE.Matrix4; own?: boolean };
const AS_IS: PressHow = {};
const ALONG_OWN: PressHow = { own: true };
const TURNED: PressHow = { turn: _turn };

/**
 * Writes the points of `from` (in the space of a mesh whose local → face matrix is `toFace`, `fromFace` its inverse)
 * pressed onto the skull into `to`, which may be `from` itself. Nothing allocated.
 */
function pressPoints(from: ArrayLike<number>, to: THREE.TypedArray, toFace: THREE.Matrix4, fromFace: THREE.Matrix4, how = AS_IS) {
  const lift = how.lift ?? 0;
  if (how.own) _d.setFromMatrixColumn(toFace, 2);
  for (let k = 0; k < from.length; k += 3) {
    _p.set(from[k]!, from[k + 1]!, from[k + 2]!);
    if (how.turn) _p.applyMatrix4(how.turn);
    if (how.own) {
      // Along the mesh's z, in its own units: the skull is at s there.
      const s = skullAlong(_o.set(_p.x, _p.y, 0).applyMatrix4(toFace), _d);
      _p.z = s + lift / _d.length() + FACE.press * (_p.z - s);
    } else press(_p.applyMatrix4(toFace), lift).applyMatrix4(fromFace);
    to[k] = _p.x;
    to[k + 1] = _p.y;
    to[k + 2] = _p.z;
  }
}

/** Presses `g` (with its morphs) where its mesh lies, `toFace` from the mesh to the face: for the features that keep their shape. */
function pressGeometry<G extends THREE.BufferGeometry>(g: G, toFace: THREE.Matrix4, how = AS_IS): G {
  _fromFace.copy(toFace).invert();
  for (const a of [g.getAttribute("position"), ...(g.morphAttributes.position ?? [])]) {
    pressPoints(a.array, a.array as THREE.TypedArray, toFace, _fromFace, how);
    a.needsUpdate = true;
  }
  return g;
}

/**
 * What the face needs to stay pressed as it moves: the eyes' frames at rest (the eye, its lids and its glint are pressed
 * in it, and an eye that slides with the gaze carries them along), and the unpressed shapes that are pressed again when
 * they change: the lids as they close, the cheeks as they blush, the cavity and the tongue as the mouth opens.
 */
interface PressedFace {
  rest: [THREE.Matrix4, THREE.Matrix4];
  restInv: [THREE.Matrix4, THREE.Matrix4];
  lids: [{ position: Float32Array; normal: Float32Array }, { position: Float32Array; normal: Float32Array }];
  cheek: Float32Array;
  /** The cavity at rest and its morphs' moves (smile, frown), and the tongue. */
  cavity: { position: Float32Array; moves: [Float32Array, Float32Array] };
  tongue: Float32Array;
  /**
   * What each was last pressed for, NaN for never: the lids' [angle, tilt] (upper 0, upper 1, lower 0, lower 1), the blush,
   * the mouth's [open, curve].
   */
  at: Float64Array;
}
const AT = { lids: 0, blush: 8, mouth: 9 } as const;
const pressedFaces = new WeakMap<CharacterModel, PressedFace>();
const copyOf = (a: THREE.BufferAttribute | THREE.InterleavedBufferAttribute) => Float32Array.from(a.array as ArrayLike<number>);

const tilt = { yaw: 0, pitch: 0 };
/** The Euler (YXZ) angles that turn +z to the skull's normal at (x, y), written into `tilt`. */
function facing(x: number, y: number) {
  const z = skullZ(x, y);
  const nx = x / (SKULL_A * SKULL_A);
  const ny = y / (SKULL_B * SKULL_B);
  const nz = z / (SKULL.r * SKULL.r);
  const len = Math.hypot(nx, ny, nz);
  tilt.yaw = Math.atan2(nx, nz);
  tilt.pitch = -Math.asin(ny / len);
  return tilt;
}

// ---- materials --------------------------------------------------------------------------------------------------------

type Rim = CharacterModel["rim"];

/** Adds a Fresnel rim (the silhouette lit in the rim's color) to a lit material, sharing the uniforms so a change needs no recompile. */
function withRim<M extends THREE.MeshStandardMaterial>(m: M, rim: Rim): M {
  m.onBeforeCompile = (shader) => {
    shader.uniforms.rimStrength = rim.strength;
    shader.uniforms.rimColor = rim.color;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float rimStrength;\nuniform vec3 rimColor;")
      .replace(
        "#include <opaque_fragment>",
        `float rimK = smoothstep( ${RIM_EDGE.from.toFixed(3)}, ${RIM_EDGE.to.toFixed(3)}, 1.0 - saturate( dot( normal, normalize( vViewPosition ) ) ) );\n`
          + `\toutgoingLight += rimColor * rimStrength * ${RIM_EDGE.gain.toFixed(3)} * rimK;\n\t#include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => "persisty-clay-rim";
  return m;
}

/** The skull's frame as the lids need it, in view space: from the view to the skull's own space, and its normal matrix. */
type Skin = { fromView: { value: THREE.Matrix4 }; normal: { value: THREE.Matrix3 } };

/**
 * The lids' clay, shaded as the skin of the skull they lie on: each fragment takes the skull's normal at that point (its
 * sphere, through `skin`), not the shell's, so a blink, a sleepy or a smiling eye reads as a line of ink on the face and
 * not as a white eyeball. The rim follows that normal too, so it stays on the head's outline.
 */
function asSkin<M extends THREE.MeshStandardMaterial>(m: M, rim: Rim, skin: Skin): M {
  withRim(m, rim);
  const clay = m.onBeforeCompile;
  m.onBeforeCompile = (shader, renderer) => {
    clay(shader, renderer);
    shader.uniforms.skinFromView = skin.fromView;
    shader.uniforms.skinNormal = skin.normal;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform mat4 skinFromView;\nuniform mat3 skinNormal;")
      .replace(
        "#include <normal_fragment_maps>",
        "#include <normal_fragment_maps>\n\tnormal = normalize( skinNormal * ( skinFromView * vec4( - vViewPosition, 1.0 ) ).xyz );",
      );
  };
  m.customProgramCacheKey = () => "persisty-clay-skin";
  return m;
}

/** The antenna's lime, kept (GLOW): not tone mapped, its light rolled off by the brightest channel, the hue untouched. */
function withGlow(m: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  m.toneMapped = false;
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      "float glowPeak = max( max( outgoingLight.r, outgoingLight.g ), max( outgoingLight.b, 1e-4 ) );\n"
        + `\toutgoingLight *= ( 1.0 - exp( -${GLOW.roll.toFixed(3)} * glowPeak ) ) / glowPeak;\n\t#include <opaque_fragment>`,
    );
  };
  m.customProgramCacheKey = () => "persisty-antenna-glow";
  return m;
}

// ---- geometry ---------------------------------------------------------------------------------------------------------

/** The bean's radius at `t` (0 bottom … 1 top): a superellipse whose widest point sits low (an egg standing on its blunt end). */
function beanRadius(t: number): number {
  const u = Math.abs(2 * t ** BEAN.skew - 1);
  return BEAN.r * Math.max(0, 1 - u ** BEAN.n) ** (1 / BEAN.n);
}

function beanProfile(): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  const n = 30;
  for (let i = 0; i <= n; i++) {
    // Denser near the poles, where the outline turns.
    const t = (1 - Math.cos((Math.PI * i) / n)) / 2;
    points.push(new THREE.Vector2(i === 0 || i === n ? 0 : beanRadius(t), BEAN.bottom + t * (BEAN.top - BEAN.bottom)));
  }
  return points;
}

/** The unsquashed torso's radius (across, x) at height `y` above the pelvis: for hands that touch the belly. Its depth is BEAN.depth of it. */
export function torsoRadius(y: number): number {
  return beanRadius(clamp((y - BEAN.bottom) / (BEAN.top - BEAN.bottom), 0, 1));
}

const STRAND = { segments: 20, radial: 8, r: 0.012 };

/**
 * A round strand of ink along `points`, with flat caps; `r` its radius and `flat` how much of it stands out of the face (1
 * round, less pressed into it, like paint). The ring around each point is laid out the same way for any curve in the face's
 * plane, so strands of the same length can morph into one another without twisting.
 */
function strandAttributes(points: THREE.Vector3[], r: number = STRAND.r, flat = 1): { position: number[]; normal: number[] } {
  const position: number[] = [];
  const normal: number[] = [];
  const t = new THREE.Vector3();
  const side = new THREE.Vector3();
  const up = new THREE.Vector3();
  const out = new THREE.Vector3(0, 0, 1);
  const ring = (i: number) => {
    const p = points[i]!;
    t.subVectors(points[Math.min(points.length - 1, i + 1)]!, points[Math.max(0, i - 1)]!).normalize();
    side.crossVectors(out, t).normalize();   // in the face's plane, across the strand
    up.crossVectors(t, side).normalize();    // out of the face
    for (let j = 0; j < STRAND.radial; j++) {
      const a = (j / STRAND.radial) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      position.push(
        p.x + (c * side.x + s * flat * up.x) * r,
        p.y + (c * side.y + s * flat * up.y) * r,
        p.z + (c * side.z + s * flat * up.z) * r,
      );
      // An ellipse's normal: across it as is, out of the face steeper the flatter it is.
      const nx = c * side.x + (s / flat) * up.x;
      const ny = c * side.y + (s / flat) * up.y;
      const nz = c * side.z + (s / flat) * up.z;
      const len = Math.hypot(nx, ny, nz);
      normal.push(nx / len, ny / len, nz / len);
    }
  };
  for (let i = 0; i < points.length; i++) ring(i);
  // The caps' centres, last.
  const first = points[0]!;
  const last = points[points.length - 1]!;
  t.subVectors(points[1]!, first).normalize();
  position.push(first.x, first.y, first.z);
  normal.push(-t.x, -t.y, -t.z);
  t.subVectors(last, points[points.length - 2]!).normalize();
  position.push(last.x, last.y, last.z);
  normal.push(t.x, t.y, t.z);
  return { position, normal };
}

function strandIndex(count: number): number[] {
  const index: number[] = [];
  const R = STRAND.radial;
  for (let i = 0; i < count - 1; i++) {
    for (let j = 0; j < R; j++) {
      const a = i * R + j;
      const b = i * R + ((j + 1) % R);
      const c = (i + 1) * R + j;
      const d = (i + 1) * R + ((j + 1) % R);
      // Counter-clockwise seen from outside: around the ring, then along the strand.
      index.push(a, b, c, b, d, c);
    }
  }
  const start = count * R;
  const end = start + 1;
  for (let j = 0; j < R; j++) {
    index.push(start, (j + 1) % R, j);
    index.push(end, (count - 1) * R + j, (count - 1) * R + ((j + 1) % R));
  }
  return index;
}

/** The closed mouth's arc: `ends` and `middle` are heights on the face, `half` its half width. */
function mouthArc(ends: number, middle: number, half: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= STRAND.segments; i++) {
    const u = (2 * i) / STRAND.segments - 1;
    const x = u * half;
    const y = middle + (ends - middle) * u * u;
    points.push(new THREE.Vector3(x, y, skullZ(x, y) + 0.003));
  }
  return points;
}

/**
 * The closed mouth: a flat line that morphs into today's smile (target 0, the arc's middle down) or a frown (target 1, its
 * ends down), with the strand's thickness kept whatever the curve. REST's 0.6 of a smile is close to createMascot's arc.
 */
function smileGeometry(): THREE.BufferGeometry {
  const flat = strandAttributes(mouthArc(-0.075, -0.075, 0.056));
  const smile = strandAttributes(mouthArc(-0.05, -0.122, 0.066));
  const frown = strandAttributes(mouthArc(-0.102, -0.062, 0.05));
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(flat.position, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(flat.normal, 3));
  g.setIndex(strandIndex(STRAND.segments + 1));
  g.morphAttributes.position = [new THREE.Float32BufferAttribute(smile.position, 3), new THREE.Float32BufferAttribute(frown.position, 3)];
  g.morphAttributes.normal = [new THREE.Float32BufferAttribute(smile.normal, 3), new THREE.Float32BufferAttribute(frown.normal, 3)];
  return g;
}

/** A brow (BROW), centred on its pivot, in the face's plane. */
function browGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= BROW.segments; i++) {
    const u = (2 * i) / BROW.segments - 1;
    points.push(new THREE.Vector3(u * BROW.half, BROW.arch * (0.5 - u * u), 0));
  }
  const { position, normal } = strandAttributes(points, BROW.r, BROW.flat);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normal, 3));
  g.setIndex(strandIndex(BROW.segments + 1));
  return g;
}

/**
 * The open mouth's cavity, a unit sphere that morphs into a "D" (target 0: the top flattened, an open smile) or its
 * upside-down (target 1). The morphs are moves from the sphere, so the sphere itself can be pressed as the mouth opens.
 */
function cavityGeometry(): THREE.SphereGeometry {
  const g = new THREE.SphereGeometry(1, 28, 18);
  const pos = g.getAttribute("position");
  const nor = g.getAttribute("normal");
  const flatten = (top: boolean) => {
    const p: number[] = [];
    const n: number[] = [];
    const k = 0.22;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const squeezed = top ? y > 0 : y < 0;
      p.push(0, squeezed ? y * k - y : 0, 0);
      const ny = squeezed ? y / k : y;
      const len = Math.hypot(x, ny, z) || 1;
      n.push(x / len - nor.getX(i), ny / len - nor.getY(i), z / len - nor.getZ(i));
    }
    return { p: new THREE.Float32BufferAttribute(p, 3), n: new THREE.Float32BufferAttribute(n, 3) };
  };
  const happy = flatten(true);
  const sad = flatten(false);
  g.morphTargetsRelative = true;
  g.morphAttributes.position = [happy.p, sad.p];
  g.morphAttributes.normal = [happy.n, sad.n];
  return g;
}

function spiralTexture() {
  return canvasTexture(128, 128, (ctx) => {
    ctx.strokeStyle = "#16181d";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    const turns = 3;
    for (let a = 0; a <= turns * Math.PI * 2; a += 0.12) {
      const r = 5 + (a / (turns * Math.PI * 2)) * 54;
      ctx.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r);
    }
    ctx.stroke();
  });
}

// ---- the build --------------------------------------------------------------------------------------------------------

/**
 * Builds the character standing at REST. `standard` swaps the physical clay (sheen) and the clear-coated ink for
 * MeshStandardMaterial, keeping the rim: the cheaper look the CPU plan falls back to.
 */
export function buildCharacter(o: { standard?: boolean } = {}): CharacterModel {
  const standard = o.standard === true;
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures: THREE.Texture[] = [];
  const geo = <G extends THREE.BufferGeometry>(g: G): G => (geometries.add(g), g);
  const mat = <M extends THREE.Material>(m: M): M => (materials.add(m), m);
  const mesh = (name: string, g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const it = new THREE.Mesh(geo(g), m);
    it.name = name;
    it.position.set(x, y, z);
    parent.add(it);
    return it;
  };
  const joint = (name: string, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const it = new THREE.Object3D();
    it.name = name;
    it.position.set(x, y, z);
    parent.add(it);
    return it;
  };

  const rim: Rim = { strength: { value: RIM.dark }, color: { value: new THREE.Color(RIM_BASE).lerp(new THREE.Color(LIME), RIM_TINT) } };
  const clayMaterial = () => standard
    ? new THREE.MeshStandardMaterial({ color: DARK.clay, roughness: 0.6 })
    : new THREE.MeshPhysicalMaterial({ color: DARK.clay, roughness: 0.6, sheen: 0.6, sheenRoughness: 0.45, sheenColor: new THREE.Color(0xfff4e6) });
  const clay = mat(withRim(clayMaterial(), rim));
  const skin: Skin = { fromView: { value: new THREE.Matrix4() }, normal: { value: new THREE.Matrix3() } };
  const lidClay = mat(asSkin(clayMaterial(), rim, skin));
  const ink = mat(standard
    ? new THREE.MeshStandardMaterial({ color: DARK.ink, roughness: 0.25 })
    : new THREE.MeshPhysicalMaterial({ color: DARK.ink, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 }));
  const glintMat = mat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const blush = mat(new THREE.MeshStandardMaterial({ color: DARK.blush, roughness: 0.9 }));
  const cavityMat = mat(new THREE.MeshStandardMaterial({ color: 0x3b1a1f, roughness: 0.55 }));
  const tongueMat = mat(new THREE.MeshStandardMaterial({ color: 0xec7e86, roughness: 0.5 }));
  const antennaMaterial = mat(withGlow(new THREE.MeshStandardMaterial({ color: LIME, emissive: LIME, emissiveIntensity: 1, roughness: 0.4 })));
  const spiralMap = spiralTexture();
  // It spins about its middle (applyFace), so the pressed spirals keep still on the skull.
  spiralMap.center.set(0.5, 0.5);
  textures.push(spiralMap);
  const spiralMat = mat(new THREE.MeshBasicMaterial({ map: spiralMap, alphaTest: 0.5 }));

  // ---- the trunk
  const group = new THREE.Group();
  group.name = "root";
  const pelvis = joint("pelvis", group, 0, PELVIS_Y, 0);
  const torso = joint("torso", pelvis);
  const bean = geo(new THREE.LatheGeometry(beanProfile(), 44));
  bean.scale(1, 1, BEAN.depth);
  mesh("bean", bean, clay, torso);
  const chest = joint("chest", pelvis, 0, CHEST_Y, 0);
  const neck = joint("neck", chest, 0, NECK_Y, 0);
  neck.rotation.order = "YXZ";
  const head = joint("head", neck, 0, HEAD_Y, 0);
  head.rotation.order = "YXZ";
  const skull = mesh("skull", new THREE.SphereGeometry(SKULL.r, 48, 40), clay, head, 0, SKULL.y, 0);
  skull.scale.set(SKULL.sx, SKULL.sy, 1);
  // The lids shade as the skull's skin (asSkin): its frame in view space, as each lid is drawn, with nothing allocated.
  const skinView = new THREE.Matrix4();
  const toSkin = (_r: THREE.WebGLRenderer, _s: THREE.Scene, camera: THREE.Camera) => {
    skinView.multiplyMatrices(camera.matrixWorldInverse, skull.matrixWorld);
    skin.normal.value.getNormalMatrix(skinView);
    skin.fromView.value.copy(skinView).invert();
  };

  // ---- the antenna: three short clay segments that bend in a chain, and the lime ball
  const antenna: THREE.Object3D[] = [];
  let holder: THREE.Object3D = head;
  for (let k = 0; k < 3; k++) {
    const at = joint(`antenna${k}`, holder, 0, k === 0 ? ANTENNA.base : ANTENNA.seg, 0);
    const length = k === 2 ? ANTENNA.ball - ANTENNA.ballR * 0.5 : ANTENNA.seg;
    mesh(`stalk${k}`, new THREE.CapsuleGeometry(ANTENNA.radii[k], length, 4, 10), clay, at, 0, length / 2, 0);
    antenna.push(at);
    holder = at;
  }
  const ball = mesh("ball", new THREE.SphereGeometry(ANTENNA.ballR, 24, 16), antennaMaterial, holder, 0, ANTENNA.ball, 0);

  // ---- arms
  const upperArmGeo = geo(new THREE.CapsuleGeometry(ARM_R.upper, UPPER_ARM, 6, 14));
  const forearmGeo = geo(new THREE.CapsuleGeometry(ARM_R.fore, FOREARM, 6, 14));
  const gloveGeo = geo(new THREE.SphereGeometry(1, 24, 18));
  const thumbGeo = geo(new THREE.CapsuleGeometry(THUMB.r, THUMB.length, 4, 10));
  const shoulder: THREE.Object3D[] = [];
  const elbow: THREE.Object3D[] = [];
  const wrist: THREE.Object3D[] = [];
  const thumb: THREE.Object3D[] = [];
  const upper: THREE.Mesh[] = [];
  const fore: THREE.Mesh[] = [];
  for (const i of SIDES) {
    const s = sign(i);
    const sh = joint(`shoulder${i}`, chest, s * SHOULDER.x, SHOULDER.y, 0);
    sh.rotation.order = "XZY";
    upper.push(mesh(`upperArm${i}`, upperArmGeo, clay, sh, 0, -UPPER_ARM / 2, 0));
    const el = joint(`elbow${i}`, sh, 0, -UPPER_ARM, 0);
    fore.push(mesh(`forearm${i}`, forearmGeo, clay, el, 0, -FOREARM / 2, 0));
    const wr = joint(`wrist${i}`, el, 0, -FOREARM, 0);
    // A mitten: thinner across the palm (which faces the body), a little longer than wide, and a thumb that stands out.
    mesh(`hand${i}`, gloveGeo, clay, wr, 0, -HAND, 0).scale.set(GLOVE[0], GLOVE[1], GLOVE[2]);
    const th = joint(`thumb${i}`, wr, -s * THUMB.x, -HAND + THUMB.y, THUMB.z);
    mesh(`thumbTip${i}`, thumbGeo, clay, th, 0, -(THUMB.length / 2 + THUMB.r * 0.6), 0);
    shoulder.push(sh);
    elbow.push(el);
    wrist.push(wr);
    thumb.push(th);
  }

  // ---- legs
  const thighGeo = geo(new THREE.CapsuleGeometry(0.056, THIGH, 6, 14));
  const shinLength = SHIN - 0.02;
  const shinGeo = geo(new THREE.CapsuleGeometry(0.048, shinLength, 6, 14));
  const footGeo = geo(new THREE.SphereGeometry(1, 24, 16));
  const hip: THREE.Object3D[] = [];
  const knee: THREE.Object3D[] = [];
  const ankle: THREE.Object3D[] = [];
  for (const i of SIDES) {
    const s = sign(i);
    const hp = joint(`hip${i}`, pelvis, s * HIP_X, 0, 0);
    mesh(`thigh${i}`, thighGeo, clay, hp, 0, -THIGH / 2, 0);
    const kn = joint(`knee${i}`, hp, 0, -THIGH, 0);
    // The shin's lower cap stops above the sole, inside the foot.
    mesh(`shin${i}`, shinGeo, clay, kn, 0, -shinLength / 2, 0);
    const an = joint(`ankle${i}`, kn, 0, -SHIN, 0);
    mesh(`foot${i}`, footGeo, clay, an, 0, -ANKLE + FOOT.h, FOOT.fwd).scale.set(FOOT.w, FOOT.h, FOOT.l);
    hip.push(hp);
    knee.push(kn);
    ankle.push(an);
  }

  // ---- the face, around the skull's centre, pressed onto it (FACE): each side has its own shapes, pressed where they lie
  const faceRoot = joint("face", head, 0, SKULL.y, 0);
  const lidUpGeo = () => geo(new THREE.SphereGeometry(LID.r, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2));
  const lidLowGeo = () => geo(new THREE.SphereGeometry(LID.r, 28, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
  const glintGeo = geo(new THREE.SphereGeometry(0.012, 12, 8));
  const cheekGeo = () => geo(new THREE.SphereGeometry(0.05, 20, 12));
  const lidTemplate = (g: THREE.BufferGeometry) => ({ position: copyOf(g.getAttribute("position")), normal: copyOf(g.getAttribute("normal")) });
  const pressed: PressedFace = {
    rest: [new THREE.Matrix4(), new THREE.Matrix4()],
    restInv: [new THREE.Matrix4(), new THREE.Matrix4()],
    lids: [lidTemplate(new THREE.SphereGeometry(LID.r, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2)),
      lidTemplate(new THREE.SphereGeometry(LID.r, 28, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2))],
    cheek: copyOf(new THREE.SphereGeometry(0.05, 20, 12).getAttribute("position")),
    cavity: { position: new Float32Array(), moves: [new Float32Array(), new Float32Array()] },
    tongue: new Float32Array(),
    at: new Float64Array(11).fill(NaN),
  };
  const eyes: THREE.Mesh[] = [];
  const glints: THREE.Mesh[] = [];
  const lidsUp: THREE.Mesh[] = [];
  const lidsLow: THREE.Mesh[] = [];
  const brows: THREE.Mesh[] = [];
  const cheeks: THREE.Mesh[] = [];
  const xEyes: THREE.Group[] = [];
  const spirals: THREE.Mesh[] = [];
  for (const i of SIDES) {
    const s = sign(i);
    const ex = s * EYE.x;
    const { yaw, pitch } = facing(ex, EYE.y);
    // The eye is a unit sphere scaled to its oval; the lids live in that scaled space, so turning them keeps them on the eye.
    // Its frame at rest is the one the eye, its lids and its glint are pressed in.
    const eye = mesh(`eye${i}`, new THREE.SphereGeometry(1, 32, 20), ink, faceRoot, ex, EYE.y, skullZ(ex, EYE.y) - EYE.sink);
    eye.scale.set(EYE.a, EYE.b, EYE.c);
    eye.rotation.set(pitch, yaw, 0, "YXZ");
    eye.updateMatrix();
    pressed.rest[i].copy(eye.matrix);
    pressed.restInv[i].copy(eye.matrix).invert();
    pressGeometry(eye.geometry, eye.matrix);
    // The lids are pressed as they close (applyFace), each in its own copy of the hemisphere.
    const up = mesh(`lidUp${i}`, lidUpGeo(), lidClay, eye);
    up.visible = false;
    up.onBeforeRender = toSkin;
    const low = mesh(`lidLow${i}`, lidLowGeo(), lidClay, eye);
    low.visible = false;
    low.onBeforeRender = toSkin;
    const glint = mesh(`glint${i}`, glintGeo, glintMat, faceRoot);
    glint.scale.set(1, 1, 0.5 * FACE.press);
    glint.rotation.set(pitch, yaw, 0, "YXZ");

    // The brow is pressed where it rests; it slides and tilts on the skull from there (applyFace).
    const brow = mesh(`brow${i}`, browGeometry(), ink, faceRoot, s * BROW.x, BROW.y, skullZ(s * BROW.x, BROW.y) + 0.003);
    const normal = facing(s * BROW.x, BROW.y);
    brow.rotation.set(normal.pitch, normal.yaw, 0, "YXZ");
    brow.updateMatrix();
    pressGeometry(brow.geometry, brow.matrix, ALONG_OWN);

    // The cheeks are pressed as they blush and grow (applyFace).
    const cheek = mesh(`cheek${i}`, cheekGeo(), blush, faceRoot, s * CHEEK.x, CHEEK.y, CHEEK.z);
    cheek.scale.set(1.2, 0.6, 0.3);
    cheek.rotation.y = s * 0.55;

    const cross = new THREE.Group();
    cross.name = `xEye${i}`;
    cross.position.set(ex, EYE.y, skullZ(ex, EYE.y));
    cross.rotation.set(pitch, yaw, 0, "YXZ");
    cross.updateMatrix();
    for (const [part, turn] of [["a", Math.PI / 4], ["b", -Math.PI / 4]] as const) {
      // Rings along its length, so pressed it bends with the skull.
      const arm = mesh(`xEye${i}${part}`, new THREE.CapsuleGeometry(0.011, 0.07, 4, 8, 8), ink, cross, 0, 0, 0.006);
      arm.rotation.z = turn;
      arm.updateMatrix();
      pressGeometry(arm.geometry, _toFace.multiplyMatrices(cross.matrix, arm.matrix));
    }
    cross.visible = false;
    faceRoot.add(cross);

    // A grid, so pressed it bends with the skull; the texture spins, not the mesh (applyFace).
    const spiral = mesh(`spiral${i}`, new THREE.PlaneGeometry(0.12, 0.12, 8, 8), spiralMat, faceRoot, ex, EYE.y, skullZ(ex, EYE.y) + 0.008);
    spiral.rotation.set(pitch, yaw, 0, "YXZ");
    spiral.updateMatrix();
    pressGeometry(spiral.geometry, spiral.matrix);
    spiral.visible = false;

    eyes.push(eye);
    glints.push(glint);
    lidsUp.push(up);
    lidsLow.push(low);
    brows.push(brow);
    cheeks.push(cheek);
    xEyes.push(cross);
    spirals.push(spiral);
  }

  // The smile's arcs are pressed once; the cavity and the tongue as the mouth opens (applyFace).
  const smile = mesh("smile", pressGeometry(smileGeometry(), _toFace.identity(), { lift: FACE.smile }), ink, faceRoot);
  const mouth = new THREE.Group();
  mouth.name = "mouth";
  {
    const { pitch } = facing(0, MOUTH.y);
    mouth.position.set(0, MOUTH.y, skullZ(0, MOUTH.y) - 0.003);
    mouth.rotation.x = pitch;
    const cavity = mesh("cavity", cavityGeometry(), cavityMat, mouth);
    const tongue = mesh("tongue", new THREE.SphereGeometry(1, 20, 12), tongueMat, mouth, 0, -0.5, 0.42);
    tongue.scale.set(0.6, 0.38, 0.62);
    tongue.updateMatrix();
    const g = cavity.geometry;
    pressed.cavity.position = copyOf(g.getAttribute("position"));
    pressed.cavity.moves = [copyOf(g.morphAttributes.position![0]!), copyOf(g.morphAttributes.position![1]!)];
    pressed.tongue = copyOf(tongue.geometry.getAttribute("position"));
    mouth.visible = false;
    faceRoot.add(mouth);
  }

  const model: CharacterModel = {
    group,
    joints: {
      root: group, pelvis, torso, chest, neck, head,
      antenna: antenna as CharacterModel["joints"]["antenna"],
      shoulder: shoulder as [THREE.Object3D, THREE.Object3D], elbow: elbow as [THREE.Object3D, THREE.Object3D],
      wrist: wrist as [THREE.Object3D, THREE.Object3D], thumb: thumb as [THREE.Object3D, THREE.Object3D],
      hip: hip as [THREE.Object3D, THREE.Object3D], knee: knee as [THREE.Object3D, THREE.Object3D], ankle: ankle as [THREE.Object3D, THREE.Object3D],
    },
    face: {
      eyes: eyes as [THREE.Mesh, THREE.Mesh], glints: glints as [THREE.Mesh, THREE.Mesh],
      lidsUp: lidsUp as [THREE.Mesh, THREE.Mesh], lidsLow: lidsLow as [THREE.Mesh, THREE.Mesh],
      brows: brows as [THREE.Mesh, THREE.Mesh], smile, mouth, cheeks: cheeks as [THREE.Mesh, THREE.Mesh],
      xEyes: xEyes as [THREE.Group, THREE.Group], spirals: spirals as [THREE.Mesh, THREE.Mesh],
    },
    limbs: { thigh: THIGH, shin: SHIN, upperArm: UPPER_ARM, forearm: FOREARM, ankle: ANKLE, hand: HAND },
    anchors: { skull, ball },
    armMeshes: { upper: upper as [THREE.Mesh, THREE.Mesh], fore: fore as [THREE.Mesh, THREE.Mesh] },
    rim,
    antennaMaterial,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
  pressedFaces.set(model, pressed);

  // Stand at REST.
  applyBody(model, REST.squash, REST.squashX, REST.chest.breath);
  for (const i of SIDES) {
    const arm = REST.arms[i];
    if (arm.kind === "angles") applyArm(model, i, arm);
    const leg = REST.legs[i];
    if (leg.kind === "foot") placeFoot(model, i, leg.at);
  }
  applyFace(model, REST.face, 0);
  group.updateMatrixWorld(true);
  return model;
}

// ---- posing: the model's own conventions, for the animator ----------------------------------------------------------

/**
 * Squash (height) and squashX (width) on the torso with its volume kept: x·y·z = 1 before the breath, which swells the
 * bean's width and depth by `breath` (Pose.chest.breath, scale − 1). The chest, and with it the arms and the head, rides on
 * the torso's top; the shoulders stay on its sides. The legs don't squash: the animator lowers the pelvis and the IK bends
 * the knees.
 */
export function applyBody(model: CharacterModel, squash: number, squashX: number, breath: number): void {
  const s = Math.max(0.3, squash);
  const w = Math.max(0.3, squashX);
  const b = 1 + breath;
  const { torso, chest, shoulder } = model.joints;
  torso.scale.set((w / Math.sqrt(s)) * b, s / Math.sqrt(w), (1 / Math.sqrt(s * w)) * b);
  chest.position.y = CHEST_Y * torso.scale.y;
  for (const i of SIDES) shoulder[i].position.x = sign(i) * SHOULDER.x * torso.scale.x;
}

/**
 * An arm by its angles (pose.ts's Arm "angles"), mirrored on the right so equal numbers make a symmetric pose:
 * shoulder [swing forward, twist (the front of the arm turning out), raise away from the body], elbow bend (the forearm
 * forward), wrist [bend (the hand forward), turn (like the twist: the front of the hand turning out)]. All zeros is the arm
 * hanging at the side, a little away from the belly, the palm towards it. Returns how far it stretched the arm (0–1, ARM_UP).
 */
export function applyArm(model: CharacterModel, i: Side, a: { shoulder: V3; elbow: number; wrist: V2; grip: number }): number {
  const s = sign(i);
  const sh = model.joints.shoulder[i];
  sh.rotation.set(-a.shoulder[0], s * a.shoulder[1], s * (ARM_REST.splay + a.shoulder[2]), "XZY");
  // How far up the arm points, in the chest's frame: the reach (ARM_UP) grows with it.
  const y = _up.set(0, -1, 0).applyEuler(sh.rotation).y;
  const k = clamp((y - ARM_UP.level) / (ARM_UP.full - ARM_UP.level), 0, 1);
  const up = k * k * (3 - 2 * k);
  stretchArm(model, i, up);
  model.joints.elbow[i].rotation.set(-(ARM_REST.elbow * (1 - up) + a.elbow), 0, 0);
  model.joints.wrist[i].rotation.set(-a.wrist[0], s * a.wrist[1], 0);
  applyGrip(model, i, a.grip);
  return up;
}

/**
 * The arm's reach (ARM_UP), 0 its usual length and place … 1 all of it: the shoulder up and out, the capsules stretched.
 * The animator eases it over while an arm turns between its angles and a reach target.
 */
export function stretchArm(model: CharacterModel, i: Side, up: number): void {
  const { shoulder, elbow, wrist, torso } = model.joints;
  const { upper, fore } = model.armMeshes;
  const k = 1 + ARM_UP.stretch * up;
  shoulder[i].position.x = sign(i) * (SHOULDER.x * torso.scale.x + ARM_UP.out * up);
  shoulder[i].position.y = SHOULDER.y + ARM_UP.lift * up;
  elbow[i].position.y = -UPPER_ARM * k;
  wrist[i].position.y = -FOREARM * k;
  // A capsule stretched along its axis: its caps lengthen a little with it.
  upper[i].position.y = (-UPPER_ARM * k) / 2;
  upper[i].scale.y = (UPPER_ARM * k + 2 * ARM_R.upper) / (UPPER_ARM + 2 * ARM_R.upper);
  fore[i].position.y = (-FOREARM * k) / 2;
  fore[i].scale.y = (FOREARM * k + 2 * ARM_R.fore) / (FOREARM + 2 * ARM_R.fore);
}

const _up = new THREE.Vector3();

/**
 * The thumb: 0 spread forward and out (an open hand, waving: ~63° off the fingers, so held up it points to the side and
 * never up like a hitchhiker's), 1 folded down onto the palm (holding).
 */
export function applyGrip(model: CharacterModel, i: Side, grip: number): void {
  const g = clamp(grip, 0, 1);
  model.joints.thumb[i].rotation.set(-1.1 + 0.95 * g, 0, sign(i) * (0.2 - 0.6 * g));
}

const _root = new THREE.Vector3();
const _target = new THREE.Vector3();
const _pole = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _end = new THREE.Vector3();
const _t = new THREE.Vector3();
const _c = new THREE.Vector3();
const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _qp = new THREE.Quaternion();
const _v3: V3 = [0, 0, 0];
const _w3: V3 = [0, 0, 0];
const _p3: V3 = [0, 0, 0];

/**
 * Turns `upper` (its bone along its −y) so the middle joint lands on `_mid` and `lower` so the end lands on `_end`, all in
 * world space from `_root`. `fold` is the side the lower bone folds to in the upper's frame: −z for a knee (+1), +z for an
 * elbow (−1); `_pole` (world) is where the middle joint points, used when the chain is straight.
 */
function aim(upper: THREE.Object3D, lower: THREE.Object3D, fold: 1 | -1) {
  _t.subVectors(_mid, _root).normalize();
  _c.subVectors(_end, _mid).normalize();
  const cos = clamp(_t.dot(_c), -1, 1);
  // Where the lower bone leaves the upper's line, across it; straight, the pole's side decides.
  _z.copy(_c).addScaledVector(_t, -cos);
  if (_z.lengthSq() > 1e-12) _z.normalize().multiplyScalar(-fold);
  else {
    _z.copy(_pole).addScaledVector(_t, -_pole.dot(_t));
    // A bone along the pole itself (a leg stretched straight forward): bend in the vertical plane instead.
    if (_z.lengthSq() < 1e-12) _z.set(0, 1, 0).addScaledVector(_t, -_t.y);
    _z.normalize().multiplyScalar(fold);
  }
  _y.copy(_t).negate();
  _x.crossVectors(_y, _z);
  _m.makeBasis(_x, _y, _z);
  _q.setFromRotationMatrix(_m);
  upper.parent!.getWorldQuaternion(_qp);
  upper.quaternion.copy(_qp.invert().multiply(_q));
  lower.rotation.set(fold * Math.acos(cos), 0, 0);
}

const toV3 = (v: THREE.Vector3, out: V3): V3 => ((out[0] = v.x), (out[1] = v.y), (out[2] = v.z), out);

/**
 * Plants foot `i` at `at` (stage space, on the floor: the sole's point under the ankle) by two-bone IK, the knee forward
 * (where the pelvis faces), and lays the foot flat, pointing where the root faces. Out of reach the leg points straight at it.
 * Reads the joints' current world pose, so set the root and pelvis first.
 */
export function placeFoot(model: CharacterModel, i: Side, at: V3): void {
  const { pelvis, hip, knee, ankle, root } = model.joints;
  pelvis.updateWorldMatrix(true, false);
  _root.copy(hip[i].position).applyMatrix4(pelvis.matrixWorld);
  _target.set(at[0], at[1] + ANKLE, at[2]);
  _pole.set(0, 0, 1).transformDirection(pelvis.matrixWorld);
  const chain = twoBone(toV3(_root, _v3), toV3(_target, _w3), THIGH, SHIN, toV3(_pole, _p3));
  _mid.fromArray(chain.mid);
  _end.fromArray(chain.end);
  aim(hip[i], knee[i], 1);
  // Flat: the ankle's world rotation is the root's.
  root.getWorldQuaternion(_q);
  knee[i].updateWorldMatrix(true, false);
  knee[i].getWorldQuaternion(_qp);
  ankle[i].quaternion.copy(_qp.invert().multiply(_q));
}

/**
 * Puts hand `i`'s palm (the glove's centre) on `at` (stage space) by two-bone IK with a straight wrist, the elbow out and
 * back. Out of reach the arm points straight at it. Reads the joints' current world pose, so set the trunk first.
 */
export function reachHand(model: CharacterModel, i: Side, at: V3): void {
  const { chest, shoulder, elbow, wrist } = model.joints;
  const s = sign(i);
  // The IK's arm is the plain one, whatever a raise stretched.
  stretchArm(model, i, 0);
  chest.updateWorldMatrix(true, false);
  _root.copy(shoulder[i].position).applyMatrix4(chest.matrixWorld);
  _target.set(at[0], at[1], at[2]);
  _pole.set(s * 0.6, -0.35, -1).normalize().transformDirection(chest.matrixWorld);
  const chain = twoBone(toV3(_root, _v3), toV3(_target, _w3), UPPER_ARM, FOREARM + HAND, toV3(_pole, _p3));
  _mid.fromArray(chain.mid);
  _end.fromArray(chain.end);
  aim(shoulder[i], elbow[i], -1);
  wrist[i].rotation.set(0, 0, 0);
}

const _e = new THREE.Vector3();
const _qf = new THREE.Quaternion();
const _inv = new THREE.Matrix4();
const _lin = new THREE.Matrix3();
const _ra = new THREE.Vector3();
const _rb = new THREE.Vector3();

/** How far along +z (the face's frame) the line through (x, y) meets the front of `eye`'s oval; NaN when it misses. */
function eyeFront(eye: THREE.Mesh, x: number, y: number): number {
  // In the eye's unit-sphere space the line is A + z·B; the front is the larger root of |A + z·B| = 1.
  _inv.copy(eye.matrix).invert();
  _ra.set(x, y, 0).applyMatrix4(_inv);
  _rb.set(0, 0, 1).applyMatrix3(_lin.setFromMatrix4(_inv));
  const ab = _ra.dot(_rb);
  const bb = _rb.lengthSq();
  const disc = ab * ab - bb * (_ra.lengthSq() - 1);
  return disc < 0 ? NaN : (-ab + Math.sqrt(disc)) / bb;
}

/**
 * Lid `j` (0 upper, 1 lower) of eye `i`, shut by `angle` about the eye's x and tilted by `tilt` about its z (the hemisphere
 * turning over the eye), pressed onto the skull in the eye's rest frame like the eye itself; only when it changed.
 */
function shapeLid(pressed: PressedFace, lid: THREE.Mesh, i: Side, j: 0 | 1, angle: number, tilt: number): void {
  const at = AT.lids + 4 * j + 2 * i;
  if (pressed.at[at] === angle && pressed.at[at + 1] === tilt) return;
  pressed.at[at] = angle;
  pressed.at[at + 1] = tilt;
  _turn.makeRotationFromEuler(_euler.set(angle, 0, tilt, "ZXY"));
  const shape = pressed.lids[j];
  const g = lid.geometry;
  const position = g.getAttribute("position") as THREE.BufferAttribute;
  const normal = g.getAttribute("normal") as THREE.BufferAttribute;
  pressPoints(shape.position, position.array, pressed.rest[i], pressed.restInv[i], TURNED);
  for (let k = 0; k < normal.count; k++) {
    _p.fromArray(shape.normal, 3 * k).transformDirection(_turn);
    normal.setXYZ(k, _p.x, _p.y, _p.z);
  }
  position.needsUpdate = true;
  normal.needsUpdate = true;
  g.computeBoundingSphere();
}

/** The cheeks at `blush`: their color, and their size pressed onto the skull; the size only when it changed. */
function shapeCheeks(pressed: PressedFace, cheeks: [THREE.Mesh, THREE.Mesh], blush: number): void {
  (cheeks[0].material as THREE.MeshStandardMaterial).color.lerpColors(BLUSH_REST, BLUSH_HOT, blush);
  if (pressed.at[AT.blush] === blush) return;
  pressed.at[AT.blush] = blush;
  for (const cheek of cheeks) {
    cheek.scale.set(1.2 * (1 + 0.18 * blush), 0.6 * (1 + 0.18 * blush), 0.3);
    cheek.updateMatrix();
    const position = cheek.geometry.getAttribute("position") as THREE.BufferAttribute;
    pressPoints(pressed.cheek, position.array, cheek.matrix, _fromFace.copy(cheek.matrix).invert(), ALONG_OWN);
    position.needsUpdate = true;
    cheek.geometry.computeBoundingSphere();
  }
}

/**
 * The open mouth, `open` wide and curved by `m` (its smile's or frown's "D"): the cavity's size and morphs, and, when it
 * shows and only when they changed, the cavity and the tongue pressed onto the skull as they are now.
 */
function shapeMouth(pressed: PressedFace, mouth: THREE.Object3D, open: number, m: number): void {
  mouth.scale.set(0.042 + 0.022 * open + 0.014 * Math.max(0, m), 0.012 + 0.052 * open, 0.02);
  const cavity = mouth.children[0] as THREE.Mesh;
  const hole = cavity.morphTargetInfluences!;
  const w0 = (hole[0] = Math.max(0, m) * 0.85);
  const w1 = (hole[1] = Math.max(0, -m) * 0.85);
  if (!mouth.visible || (pressed.at[AT.mouth] === open && pressed.at[AT.mouth + 1] === m)) return;
  pressed.at[AT.mouth] = open;
  pressed.at[AT.mouth + 1] = m;
  mouth.updateMatrix();
  // The cavity is pressed as its morphs leave it, and kept less their moves, which the GPU adds back.
  const rest = pressed.cavity.position;
  const a = pressed.cavity.moves[0];
  const b = pressed.cavity.moves[1];
  const position = cavity.geometry.getAttribute("position") as THREE.BufferAttribute;
  const to = position.array;
  _fromFace.copy(mouth.matrix).invert();
  for (let k = 0; k < rest.length; k += 3) {
    _p.set(rest[k]! + w0 * a[k]! + w1 * b[k]!, rest[k + 1]! + w0 * a[k + 1]! + w1 * b[k + 1]!, rest[k + 2]! + w0 * a[k + 2]! + w1 * b[k + 2]!);
    press(_p.applyMatrix4(mouth.matrix)).applyMatrix4(_fromFace);
    to[k] = _p.x - w0 * a[k]! - w1 * b[k]!;
    to[k + 1] = _p.y - w0 * a[k + 1]! - w1 * b[k + 1]!;
    to[k + 2] = _p.z - w0 * a[k + 2]! - w1 * b[k + 2]!;
  }
  position.needsUpdate = true;
  cavity.geometry.computeBoundingSphere();
  const tongue = mouth.children[1] as THREE.Mesh;
  const tip = tongue.geometry.getAttribute("position") as THREE.BufferAttribute;
  _toFace.multiplyMatrices(mouth.matrix, tongue.matrix);
  pressPoints(pressed.tongue, tip.array, _toFace, _fromFace.copy(_toFace).invert());
  tip.needsUpdate = true;
  tongue.geometry.computeBoundingSphere();
}

/**
 * The face (pose.ts's Pose["face"]) on its meshes: the eyes slide by the gaze over the skull and keep their glint towards
 * the light (so it doesn't turn with the head), the lids close over the eyes and tilt with the brows, the brows lift
 * and tilt, the closed mouth bends from frown to smile and the open one shows the cavity and the tongue, the cheeks blush,
 * and X or spiral eyes take the eyes' place. `now` (ms) spins the spirals. All of it stays pressed onto the skull (FACE).
 * Reads the head's world pose: set the joints first.
 */
export function applyFace(model: CharacterModel, face: Pose["face"], now: number): void {
  const f = model.face;
  const pressed = pressedFaces.get(model)!;
  const mode = face.eyes;
  const gx = clamp(face.gaze[0], -0.02, 0.02);
  const gy = clamp(face.gaze[1], -0.02, 0.02);
  const up = clamp(face.lidUp, 0, 1) * LID.up;
  const low = clamp(face.lidLow, 0, 1) * LID.low;
  const raise = clamp(face.brows[0], -1, 1);
  const browTilt = clamp(face.brows[1], -1, 1);
  const faceRoot = f.eyes[0].parent!;
  // The light's direction in the face's frame, as a spot on the eye's oval (u right, v up, both within `edge` of the centre).
  faceRoot.updateWorldMatrix(true, false);
  _e.copy(GLINT_DIR).applyQuaternion(faceRoot.getWorldQuaternion(_qf).invert());
  let u = _e.x * GLINT.gain;
  let v = _e.y * GLINT.gain;
  const r = Math.hypot(u, v);
  if (r > GLINT.edge) {
    u *= GLINT.edge / r;
    v *= GLINT.edge / r;
  }
  const gu = u * EYE.a;
  const gv = v * EYE.b;
  // The spirals spin in their texture, so their pressed grids keep still.
  (f.spirals[0].material as THREE.MeshBasicMaterial).map!.rotation = -(now / 1000) * Math.PI * 2 * 1.2;
  for (const i of SIDES) {
    const s = sign(i);
    const eye = f.eyes[i];
    const ex = s * EYE.x + gx;
    const ey = EYE.y + gy;
    // The eye slides over the skull and turns with it, so its pressed shape and its lids stay on it.
    const normal = facing(ex, ey);
    eye.position.set(ex, ey, skullZ(ex, ey) - EYE.sink);
    eye.rotation.set(normal.pitch, normal.yaw, 0);
    eye.updateMatrix();
    eye.visible = mode === "normal";
    f.glints[i].visible = mode === "normal";
    f.xEyes[i].visible = mode === "x";
    f.spirals[i].visible = mode === "spiral";

    // The same offset from the centre in both eyes, on the front of each oval (which leans out with the skull), then
    // pressed as the eye was, in its rest frame.
    const z = eyeFront(eye, ex + gu, ey + gv);
    const glint = f.glints[i];
    _p.set(ex + gu, ey + gv, (Number.isNaN(z) ? eye.position.z + EYE.c : z) + 0.001).applyMatrix4(_inv).applyMatrix4(pressed.rest[i]);
    glint.position.copy(press(_p).applyMatrix4(pressed.restInv[i]).applyMatrix4(eye.matrix));
    glint.quaternion.copy(eye.quaternion);

    const lidUp = f.lidsUp[i];
    lidUp.visible = up > 0.01;
    if (lidUp.visible) shapeLid(pressed, lidUp, i, 0, Math.asin(2 * up - 1), -s * browTilt * LID.tilt);
    const lidLow = f.lidsLow[i];
    lidLow.visible = low > 0.01;
    if (lidLow.visible) shapeLid(pressed, lidLow, i, 1, Math.asin(1 - 2 * low), 0);

    const brow = f.brows[i];
    const bx = s * (BROW.x - Math.max(0, -browTilt) * BROW.knit);
    const by = BROW.y + raise * BROW.lift;
    const { yaw, pitch } = facing(bx, by);
    brow.position.set(bx, by, skullZ(bx, by) + 0.003);
    brow.rotation.set(pitch, yaw, -s * browTilt * BROW.tilt);
  }

  const m = clamp(face.mouth, -1, 1);
  const open = clamp(face.open, 0, 1);
  const opened = open > 0.04;
  f.smile.visible = !opened;
  f.mouth.visible = opened;
  const arc = f.smile.morphTargetInfluences!;
  arc[0] = Math.max(0, m);
  arc[1] = Math.max(0, -m);
  shapeMouth(pressed, f.mouth, open, m);

  shapeCheeks(pressed, f.cheeks, clamp(face.blush, 0, 1));
}

// ---- camera and budget ------------------------------------------------------------------------------------------------

/**
 * Like today's (fov 22, level), placed so the 200×200 box shows the feet at (100, 170) and 1 unit ≈ 100 px at the
 * character's plane: at fov 22 the half height of the view is one unit 1 / tan(11°) away.
 */
export const CAMERA = { fov: 22, height: 0.7, distance: 1 / Math.tan((11 * Math.PI) / 180) };

export function characterCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 50);
  camera.position.set(0, CAMERA.height, CAMERA.distance);
  camera.lookAt(0, CAMERA.height, 0);
  camera.updateMatrixWorld(true);
  return camera;
}

/** The draw calls under `root`: every visible Mesh, Sprite and Points (a hidden parent hides its children), one per material group. */
export function countDraws(root: THREE.Object3D): number {
  if (!root.visible) return 0;
  let n = 0;
  const o = root as THREE.Mesh;
  if (o.isMesh || (root as THREE.Sprite).isSprite || (root as THREE.Points).isPoints) {
    n += Array.isArray(o.material) ? Math.max(1, o.geometry.groups.length) : 1;
  }
  for (const child of root.children) n += countDraws(child);
  return n;
}
