import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { REACTION_MS, type Mood, type Reaction } from "./buddyMood";
import { createMascot } from "./mascot";
import { DARK, LIME, addLights, createMaterials } from "./parts";

/**
 * The mascot that keeps a terminal company, live in 3D. It peeks from the
 * corner (just the head), follows the pointer with its eyes, rises to ask
 * for you, to celebrate or to say something, and hops when clicked. It only
 * draws while visible, at most 30 times a second; with reduced motion it
 * holds each pose and draws once per change.
 *
 * The desktop app's rig (features/buddy/rig.ts) as it is, but for `sleep`:
 * on a page the mascot also rests while scrolled out of view.
 */
export interface BuddyRig {
  setMood(mood: Mood): void;
  react(reaction: Reaction): void;
  poke(): void;
  /** Where the pointer is, relative to the mascot: -1…1 on each axis (y down). */
  look(x: number, y: number): void;
  resize(width: number, height: number, dpr: number): void;
  /** Off screen it draws nothing; back on, it carries on where it is. */
  sleep(asleep: boolean): void;
  dispose(): void;
}

export interface RigOptions {
  reduced: boolean;
  /** Told when the mascot rises out of the corner or sinks back. */
  onRaise?: (raised: boolean) => void;
}

const UP = 0;
const PEEK = -0.86;
/** Frames per second while something moves (rising, reacting, followed, working), and at rest. */
const FPS_ACTIVE = 30;
const FPS_REST = 12;
const AMBER = 0xe3b24a;
const RED = 0xef7d7d;

interface Pose {
  y: number;
  armL: [number, number];
  armR: [number, number];
  head: [number, number, number];
  eyes: number;
  squash: number;
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function createRig(canvas: HTMLCanvasElement, options: RigOptions): BuddyRig | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;
  addLights(scene, DARK, 2);

  const m = createMaterials(DARK);
  const mascot = createMascot(m);
  // Its own antenna material, tinted by mood: amber when it asks, red when it failed.
  const antennaMat = m.lime.clone();
  mascot.antenna.material = antennaMat;
  // The eyes are the two ink spheres on the head; they close to blink and to sleep.
  const eyes = mascot.head.children.filter((c): c is THREE.Mesh => (c as THREE.Mesh).isMesh && (c as THREE.Mesh).material === m.ink && (c as THREE.Mesh).geometry.type === "SphereGeometry");
  // Turned a little towards the terminal it sits beside.
  mascot.group.rotation.y = -0.32;
  scene.add(mascot.group);

  const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 50);
  camera.position.set(0, 0.72, 4.6);
  camera.lookAt(0, 0.66, 0);

  let mood: Mood = "idle";
  let reaction: { kind: Reaction["kind"] | "poke"; start: number } | null = null;
  let lookAt = { x: 0, y: 0, at: -Infinity };
  let raised = false;
  let nextBlink = 2500;
  const pose: Pose = { y: PEEK, armL: [-0.1, -0.18], armR: [-0.1, 0.18], head: [0, 0, 0], eyes: 1, squash: 1 };
  const antennaColor = new THREE.Color(LIME);
  const now = () => performance.now();

  const isRaised = (t: number) => mood === "asking" || (reaction !== null && t - reaction.start < REACTION_MS[reaction.kind]);

  /** Where every part should be at time `t`. */
  function target(t: number): Pose {
    const s = t / 1000;
    const p: Pose = { y: isRaised(t) ? UP : mood === "ended" ? PEEK - 0.1 : PEEK, armL: [-0.1, -0.18], armR: [-0.1, 0.18], head: [0, 0, 0], eyes: 1, squash: 1 + Math.sin(s * 2.2) * 0.012 };
    switch (mood) {
      case "working":
        p.head = [0.12 + Math.sin(s * 6) * 0.04, -0.25, 0];
        break;
      case "asking":
        p.armR = [-0.25, 2.5 + Math.sin(s * 5) * 0.12];
        p.head = [-0.08, 0, 0.14];
        break;
      case "busy":
        p.head = [0.06, -0.55 + Math.sin(s * 1.4) * 0.08, 0];
        break;
      case "ended":
        p.head = [0.22, 0, 0.08];
        p.eyes = 0.12;
        break;
      case "failed":
        p.head = [0.3, 0, -0.1];
        break;
      default:
        // Idle, done, stopped: an occasional glance.
        p.head = [-0.04, Math.max(0, Math.sin(s * 0.45)) ** 6 * 0.5, 0];
    }
    // Following the pointer wins over the mood's gaze for a while after it moved.
    if (t - lookAt.at < 2500 && mood !== "ended") {
      p.head[0] = clamp(lookAt.y * 0.45, -0.35, 0.35);
      p.head[1] = clamp(lookAt.x * 0.75 + 0.32, -0.9, 0.9);
    }
    if (reaction && t - reaction.start < REACTION_MS[reaction.kind]) {
      const k = (t - reaction.start) / REACTION_MS[reaction.kind];
      const e = t - reaction.start;
      switch (reaction.kind) {
        case "celebrate":
          p.y += Math.abs(Math.sin(k * Math.PI * 3)) * 0.2 * (1 - k);
          p.armL = [-0.2, -2.6 - Math.sin(e / 90) * 0.15];
          p.armR = [-0.2, 2.6 + Math.sin(e / 90) * 0.15];
          p.head = [-0.15, 0, 0];
          break;
        case "oops":
          p.armR = [-2.5, 0.7];
          p.head = [0.18, Math.sin(e / 55) * 0.3 * (1 - k), 0];
          break;
        case "wave":
        case "say":
          p.armR = [-0.2, 2.4 + Math.sin(e / 85) * 0.35];
          p.head = [-0.05, 0.1, 0.12 * Math.sin(e / 300)];
          break;
        case "think":
          p.armR = [-1.9, 0.75];
          p.head = [-0.18, 0.25, 0.2];
          break;
        case "poke": {
          const hop = Math.sin(clamp(k * 1.6, 0, 1) * Math.PI);
          p.y += hop * 0.16;
          p.squash = 1 - Math.sin(clamp(k * 3, 0, 1) * Math.PI) * 0.1 + hop * 0.04;
          p.armR = [-0.2, 2.2 + Math.sin(e / 80) * 0.4];
          break;
        }
      }
    }
    if (!options.reduced && mood !== "ended" && t > nextBlink) {
      p.eyes = 0.1;
      if (t > nextBlink + 130) nextBlink = t + 2600 + Math.random() * 2600;
    }
    return p;
  }

  function apply(p: Pose, k: number) {
    pose.y = lerp(pose.y, p.y, k);
    pose.armL = [lerp(pose.armL[0], p.armL[0], k), lerp(pose.armL[1], p.armL[1], k)];
    pose.armR = [lerp(pose.armR[0], p.armR[0], k), lerp(pose.armR[1], p.armR[1], k)];
    pose.head = [lerp(pose.head[0], p.head[0], k), lerp(pose.head[1], p.head[1], k), lerp(pose.head[2], p.head[2], k)];
    // Blinks snap; everything else eases.
    pose.eyes = p.eyes < pose.eyes ? p.eyes : lerp(pose.eyes, p.eyes, Math.max(k, 0.5));
    pose.squash = lerp(pose.squash, p.squash, k);

    mascot.group.position.y = pose.y;
    mascot.group.scale.set(1 / Math.sqrt(pose.squash), pose.squash, 1 / Math.sqrt(pose.squash));
    mascot.armLeft.rotation.set(pose.armL[0], 0, pose.armL[1]);
    mascot.armRight.rotation.set(pose.armR[0], 0, pose.armR[1]);
    mascot.head.rotation.set(pose.head[0], pose.head[1], pose.head[2]);
    for (const eye of eyes) eye.scale.y = 1.22 * pose.eyes;

    const wanted = mood === "asking" ? AMBER : mood === "failed" ? RED : LIME;
    antennaColor.lerp(new THREE.Color(wanted), k);
    antennaMat.color.copy(antennaColor);
    antennaMat.emissive.copy(antennaColor);
    const bright = mood === "ended" || mood === "stopped" ? 0.25 : mood === "working" ? 1.6 + Math.sin(now() / 160) * 0.8 : reaction ? 2.4 : 1;
    antennaMat.emissiveIntensity = lerp(antennaMat.emissiveIntensity, bright, k);
  }

  function draw(t: number, k: number) {
    apply(target(t), k);
    renderer.render(scene, camera);
    const up = isRaised(t);
    if (up !== raised) {
      raised = up;
      options.onRaise?.(up);
    }
  }

  // ---- the loop: only while the page is visible, capped -------------------------------
  let frame = 0;
  let last = 0;
  let disposed = false;
  let asleep = false;
  const tick = (t: number) => {
    frame = 0;
    if (disposed) return;
    const active = isRaised(t) || t - lookAt.at < 2500 || mood === "working" || mood === "busy";
    if (t - last >= 1000 / (active ? FPS_ACTIVE : FPS_REST) - 2) {
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      draw(t, 1 - Math.exp(-dt * 11));
    }
    schedule();
  };
  const schedule = () => {
    if (options.reduced || disposed || asleep || frame || document.visibilityState !== "visible") return;
    frame = requestAnimationFrame(tick);
  };
  const still = () => {
    if (disposed) return;
    const t = now();
    // Reduced motion: straight to the pose, once; a reaction still shows, without the motion.
    draw(t, 1);
    if (reaction && t - reaction.start < REACTION_MS[reaction.kind]) window.setTimeout(still, REACTION_MS[reaction.kind] - (t - reaction.start) + 20);
  };
  const changed = () => (options.reduced ? still() : schedule());
  const onVisibility = () => changed();
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setMood(next) {
      mood = next;
      changed();
    },
    react(r) {
      reaction = { kind: r.kind, start: now() };
      changed();
    },
    poke() {
      reaction = { kind: "poke", start: now() };
      changed();
    },
    look(x, y) {
      lookAt = { x, y, at: now() };
      changed();
    },
    resize(width, height, dpr) {
      renderer.setPixelRatio(Math.min(dpr, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (options.reduced) still();
      else draw(now(), 1);
    },
    sleep(next) {
      asleep = next;
      changed();
    },
    dispose() {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
      antennaMat.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
