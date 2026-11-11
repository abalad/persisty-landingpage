import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DARK, addLights, createMaterials } from "./parts";
import { composeVignette, frameVignette, type Vignette, type VignetteName } from "./vignettes";

/**
 * The studio's still pictures, live (copied from the desktop app, apps/desktop/src/features/art/live.ts): each one's
 * own scene, moving (the mascot breathes, blinks, follows the pointer with its head; the scene does its thing), hopping
 * when poked. One WebGL renderer, off screen, draws every active picture in view into its own 2D canvas, so a page of
 * them costs one context. On the site a picture moves only while it is active (its card hovered, or the one in view on
 * a phone); the rest stay their stills and draw nothing. If the system takes the context away, every picture goes back
 * to its still and a new context is made a moment later; after a few losses the stills stay.
 */
export interface LiveArt {
  /** Moves while active; still otherwise (the caller shows the picture then). */
  setActive(on: boolean): void;
  /** The scene's answer to a click: its big move, and a hop. */
  poke(): void;
  dispose(): void;
}

/** Each picture's own proportions (height over width), as rendered for the stills. */
const RATIO: Partial<Record<VignetteName, number>> = { dock: 560 / 480 };
const FPS = 24;
const HOP_MS = 650;
const MAX_LOSSES = 3;
const RETRY_MS = 1500;

interface Pose {
  y: number;
  scale: THREE.Vector3;
  head: THREE.Euler;
  armLeft: THREE.Euler;
  armRight: THREE.Euler;
}

interface Instance {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  vignette: Vignette;
  base: Pose;
  eyes: THREE.Mesh[];
  antenna: THREE.MeshStandardMaterial;
  size: { w: number; h: number };
  visible: boolean;
  active: boolean;
  hover: boolean;
  hop: number;
  nextBlink: number;
  seed: number;
  ready: boolean;
  onReady: () => void;
  onLost: () => void;
  observer: IntersectionObserver | null;
  resize: ResizeObserver | null;
}

let renderer: THREE.WebGLRenderer | null = null;
let environment: THREE.Texture | null = null;
const instances = new Set<Instance>();
let frame = 0;
let last = 0;
let pointer: { x: number; y: number; at: number } | null = null;
let listening = false;
/** Times the system took the context away. */
let losses = 0;
let retryAt = 0;
let retry = 0;

function shared(): THREE.WebGLRenderer | null {
  if (renderer) return renderer;
  if (losses > MAX_LOSSES || performance.now() < retryAt) return null;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setScissorTest(true);
  environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  for (const i of instances) i.scene.environment = environment;
  renderer.domElement.addEventListener("webglcontextlost", lose);
  if (!listening) {
    listening = true;
    window.addEventListener("pointermove", (e) => {
      pointer = { x: e.clientX, y: e.clientY, at: performance.now() };
    });
    document.addEventListener("visibilitychange", schedule);
  }
  return renderer;
}

/** The context is gone: back to the stills, and a new one in a moment. */
function lose() {
  losses += 1;
  retryAt = performance.now() + RETRY_MS;
  renderer?.domElement.removeEventListener("webglcontextlost", lose);
  renderer = null;
  environment = null;
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  for (const i of instances) {
    if (!i.ready) continue;
    i.ready = false;
    i.onLost();
  }
  clearTimeout(retry);
  retry = window.setTimeout(schedule, RETRY_MS);
}

const snapshot = (v: Vignette): Pose => ({
  y: v.mascot.group.position.y,
  scale: v.mascot.group.scale.clone(),
  head: v.mascot.head.rotation.clone(),
  armLeft: v.mascot.armLeft.rotation.clone(),
  armRight: v.mascot.armRight.rotation.clone(),
});

/** Back to the still's pose, so each frame's motion starts from it. */
function restore(v: Vignette, p: Pose) {
  v.mascot.group.position.y = p.y;
  v.mascot.group.scale.copy(p.scale);
  v.mascot.head.rotation.copy(p.head);
  v.mascot.armLeft.rotation.copy(p.armLeft);
  v.mascot.armRight.rotation.copy(p.armRight);
}

/** The mascot's own life over the scene's: breathing, blinking, looking at the pointer, hopping. */
function live(i: Instance, ms: number) {
  const { mascot } = i.vignette;
  const breath = Math.sin(ms / 1000 * 2.2 + i.seed) * 0.012;
  mascot.group.scale.set(i.base.scale.x * (1 - breath / 2), i.base.scale.y * (1 + breath), i.base.scale.z * (1 - breath / 2));
  const hop = i.hop > 0 ? Math.sin(Math.min(1, (ms - i.hop) / HOP_MS) * Math.PI) : 0;
  if (hop > 0) mascot.group.position.y = i.base.y + hop * 0.16;
  // The head turns to the pointer while it moves nearby, then goes back to what it was doing.
  const box = i.canvas.getBoundingClientRect();
  if (pointer && ms - pointer.at < 2500 && box.width) {
    const dx = (pointer.x - (box.left + box.width / 2)) / 500;
    const dy = (pointer.y - (box.top + box.height * 0.45)) / 400;
    const k = Math.min(1, 1.6 - (ms - pointer.at) / 1600);
    mascot.head.rotation.y += Math.max(-0.7, Math.min(0.7, dx)) * 0.7 * Math.max(0, k);
    mascot.head.rotation.x += Math.max(-0.35, Math.min(0.35, dy)) * 0.35 * Math.max(0, k);
  }
  let open = 1;
  if (ms > i.nextBlink) {
    open = 0.1;
    if (ms > i.nextBlink + 130) i.nextBlink = ms + 2400 + Math.random() * 3000;
  }
  if (hop > 0.4) open = 0.2;
  for (const eye of i.eyes) eye.scale.y = 1.22 * open;
  i.antenna.emissiveIntensity = 0.6 + (i.hover ? 1.4 : 0) + hop * 2;
}

function schedule() {
  if (frame || document.visibilityState !== "visible") return;
  if (![...instances].some((i) => i.visible && i.active)) return;
  frame = requestAnimationFrame(tick);
}

function tick(ms: number) {
  frame = 0;
  // A lost context comes back here, once its wait is over.
  const r = shared();
  if (!r) return;
  if (ms - last >= 1000 / FPS - 2) {
    last = ms;
    const shown = [...instances].filter((i) => i.visible && i.active && i.size.w > 0 && i.size.h > 0);
    // The renderer's canvas grows to the largest picture; each is drawn in its corner and copied out.
    const needW = Math.max(1, ...shown.map((i) => i.size.w));
    const needH = Math.max(1, ...shown.map((i) => i.size.h));
    const current = r.getSize(new THREE.Vector2());
    if (current.x < needW || current.y < needH) r.setSize(Math.max(current.x, needW), Math.max(current.y, needH), false);
    const height = r.domElement.height;
    for (const i of shown) {
      restore(i.vignette, i.base);
      i.vignette.tick(ms);
      live(i, ms);
      r.setViewport(0, 0, i.size.w, i.size.h);
      r.setScissor(0, 0, i.size.w, i.size.h);
      r.render(i.scene, i.camera);
      i.ctx.clearRect(0, 0, i.size.w, i.size.h);
      i.ctx.drawImage(r.domElement, 0, height - i.size.h, i.size.w, i.size.h, 0, 0, i.size.w, i.size.h);
      if (!i.ready) {
        i.ready = true;
        i.onReady();
      }
    }
  }
  schedule();
}

/**
 * Plays `name` live into `canvas` (sized by its box, at the picture's own
 * proportions). Returns null without WebGL; `onReady` fires once a first
 * frame is in the canvas, for the still to give way, and `onLost` when the
 * context is gone, for the still to come back (`onReady` again once it is).
 */
export function attachLiveArt(canvas: HTMLCanvasElement, name: VignetteName, onReady: () => void, onLost: () => void): LiveArt | null {
  const ctx = canvas.getContext("2d");
  // Waiting for a new context still plays once it is there; never having one, or giving up, does not.
  if (!ctx || (!shared() && (losses === 0 || losses > MAX_LOSSES))) return null;
  const scene = new THREE.Scene();
  scene.environment = environment;
  scene.environmentIntensity = 0.5;
  const m = createMaterials(DARK);
  const vignette = composeVignette(name, m);
  scene.add(vignette.group);
  const { key } = addLights(scene, DARK, 3);
  key.shadow.mapSize.set(1024, 1024);
  const ratio = RATIO[name] ?? 10 / 16;
  const camera = new THREE.PerspectiveCamera(24, 1 / ratio, 0.1, 100);
  frameVignette(vignette.group, camera);
  const antenna = (vignette.mascot.antenna.material as THREE.MeshStandardMaterial).clone();
  vignette.mascot.antenna.material = antenna;
  const eyes = vignette.mascot.head.children.filter((c): c is THREE.Mesh => (c as THREE.Mesh).isMesh && (c as THREE.Mesh).material === m.ink && (c as THREE.Mesh).geometry.type === "SphereGeometry");

  const instance: Instance = {
    canvas,
    ctx,
    scene,
    camera,
    vignette,
    base: snapshot(vignette),
    eyes,
    antenna,
    size: { w: 0, h: 0 },
    visible: false,
    active: false,
    hover: false,
    hop: 0,
    nextBlink: 1500 + Math.random() * 2000,
    seed: Math.random() * 6,
    ready: false,
    onReady,
    onLost,
    observer: null,
    resize: null,
  };

  // The canvas keeps the picture's proportions inside its box (object-fit: contain), at device pixels.
  const fit = () => {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.min(box.width, box.height / ratio);
    instance.size = { w: Math.max(1, Math.round(w * dpr)), h: Math.max(1, Math.round(w * ratio * dpr)) };
    canvas.width = instance.size.w;
    canvas.height = instance.size.h;
    schedule();
  };
  fit();
  instance.resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
  instance.resize?.observe(canvas);
  instance.observer =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          instance.visible = entries.some((e) => e.isIntersecting);
          schedule();
        })
      : null;
  if (instance.observer) instance.observer.observe(canvas);
  else instance.visible = true;

  instances.add(instance);
  schedule();

  return {
    setActive(on) {
      instance.active = on;
      instance.hover = on;
      schedule();
    },
    poke() {
      const ms = performance.now();
      instance.hop = ms;
      vignette.poke(ms);
      schedule();
    },
    dispose() {
      instances.delete(instance);
      instance.observer?.disconnect();
      instance.resize?.disconnect();
      scene.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
      antenna.dispose();
    },
  };
}
