import * as THREE from "three";
import { createMascot, type Mascot } from "@/components/studio/mascot";
import { createMaterials, DARK } from "@/components/studio/parts";

/** How the mascot takes each step of cancelling. */
/**
 * `puzzled`: asked why, a head tilt and a scratch, wondering rather than sad.
 * `settled`: the plan is cancelled as the person wanted; neither sad nor glad, a small calm smile and a nod.
 */
export type CancelMood = "puzzled" | "hopeful" | "pleading" | "goodbye" | "celebrate" | "settled";

export interface CancelScene {
  setMood(mood: CancelMood): void;
  resize(width: number, height: number, dpr: number): void;
  sleep(asleep: boolean): void;
  dispose(): void;
}

interface Pose {
  headX: number;
  headZ: number;
  armL: [number, number];
  armR: [number, number];
  /** -1 a frown, 1 a smile. */
  mouth: number;
  /** How open the eyes are. */
  eyes: number;
  /** One eye opens more than the other, as a raised brow would: 0 even. */
  squint: number;
  /** The mouth pushed to one side: 0 centred. */
  mouthX: number;
  /** How bright the antenna shines, 0–1. */
  glow: number;
  y: number;
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** The still face of each mood; `pose` adds the movement on top. */
const BASE: Record<CancelMood, Pose> = {
  puzzled: { headX: -0.08, headZ: 0.26, armL: [0.04, -0.05], armR: [-2.75, -0.42], mouth: -0.12, eyes: 1.02, squint: 0.2, mouthX: 0.035, glow: 0.3, y: 0 },
  hopeful: { headX: -0.14, headZ: 0.12, armL: [-0.32, -0.22], armR: [-0.32, 0.22], mouth: 0.55, eyes: 1.05, squint: 0, mouthX: 0, glow: 0.9, y: 0 },
  pleading: { headX: 0.06, headZ: 0.2, armL: [-1.38, 0.32], armR: [-1.38, -0.32], mouth: -0.25, eyes: 1.15, squint: 0, mouthX: 0, glow: 0.5, y: 0 },
  goodbye: { headX: 0.2, headZ: -0.08, armL: [0.05, -0.05], armR: [-2.55, 0.42], mouth: -0.55, eyes: 0.75, squint: 0, mouthX: 0, glow: 0.2, y: -0.01 },
  celebrate: { headX: -0.22, headZ: 0, armL: [-2.85, -0.5], armR: [-2.85, 0.5], mouth: 1, eyes: 1, squint: 0, mouthX: 0, glow: 1, y: 0 },
  settled: { headX: 0.04, headZ: 0.07, armL: [0.02, -0.04], armR: [0.02, 0.04], mouth: 0.32, eyes: 0.88, squint: 0, mouthX: 0, glow: 0.45, y: 0 },
};

/** The pose at a moment: the mood's face, breathing, and what each mood does over time. */
function pose(mood: CancelMood, s: number, still: boolean): Pose {
  const p: Pose = { ...BASE[mood], armL: [...BASE[mood].armL], armR: [...BASE[mood].armR] };
  if (still) return p;
  p.y += Math.sin(s * 2.1) * 0.008;
  switch (mood) {
    case "puzzled":
      // The head sways a little, the hand scratches in short bursts and the antenna flickers as if thinking.
      p.headZ += Math.sin(s * 0.9) * 0.05;
      if (s % 2.8 < 1.1) p.armR[1] += Math.sin(s * 14) * 0.07;
      p.glow += Math.max(0, Math.sin(s * 2.4)) * 0.35;
      break;
    case "hopeful":
      p.y += Math.max(0, Math.sin(s * 2.6)) * 0.02;
      p.headZ += Math.sin(s * 1.3) * 0.05;
      break;
    case "pleading":
      p.armL[0] += Math.sin(s * 3.2) * 0.06;
      p.armR[0] += Math.sin(s * 3.2) * 0.06;
      break;
    case "goodbye":
      p.armR[1] += Math.sin(s * 5.5) * 0.32;
      break;
    case "celebrate":
      p.y += Math.abs(Math.sin(s * Math.PI * 1.6)) * 0.12;
      p.armL[1] += Math.sin(s * 11) * 0.12;
      p.armR[1] -= Math.sin(s * 11) * 0.12;
      break;
    case "settled": {
      // One slow nod every few seconds: "done, all set".
      const t = s % 3.4;
      if (t < 0.7) p.headX += Math.sin((t / 0.7) * Math.PI) * 0.14;
      break;
    }
  }
  return p;
}

/**
 * The mascot in full body for the cancelling dialog: lit like the studio's
 * clay, on a transparent ground so the dialog's panel shows behind it. Poses
 * ease from one mood to the next; `reduced` holds each pose and draws once
 * per change. Null without WebGL.
 */
export function createCancelScene(canvas: HTMLCanvasElement, { reduced }: { reduced: boolean }): CancelScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 20);
  camera.position.set(0, 0.78, 3.75);
  camera.lookAt(0, 0.62, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x262b37, 1.1));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.9);
  key.position.set(-1.6, 2.4, 2.6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc6f24e, 0.55);
  rim.position.set(1.8, 1.2, -1.8);
  scene.add(rim);

  // A soft contact shadow instead of a shadow map: cheap, and enough to stand it on the panel.
  const shadowTexture = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.5), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.001;
  scene.add(shadow);

  const materials = createMaterials(DARK);
  const mascot: Mascot = createMascot(materials);
  scene.add(mascot.group);

  let mood: CancelMood = "puzzled";
  let current: Pose = pose(mood, 0, true);
  let frame = 0;
  let asleep = false;
  let last = performance.now();
  let nextBlink = last + 2400;
  let blinkUntil = 0;

  const apply = (p: Pose, blink: boolean) => {
    mascot.group.position.y = p.y;
    mascot.head.rotation.x = p.headX;
    mascot.head.rotation.z = p.headZ;
    mascot.armLeft.rotation.x = p.armL[0];
    mascot.armLeft.rotation.z = -0.18 + p.armL[1];
    mascot.armRight.rotation.x = p.armR[0];
    mascot.armRight.rotation.z = 0.18 + p.armR[1];
    // A smile is the lower half of the ring; a frown, a smaller upper half set a little lower.
    mascot.smile.rotation.z = p.mouth >= 0 ? Math.PI : 0;
    mascot.smile.position.y = p.mouth >= 0 ? -0.06 : -0.11;
    mascot.smile.position.x = p.mouthX;
    mascot.smile.scale.set(p.mouth >= 0 ? 1 : 0.72, Math.max(0.2, Math.abs(p.mouth) * (p.mouth >= 0 ? 1 : 0.7)), 1);
    mascot.eyes.forEach((eye, i) => {
      eye.scale.y = 1.22 * (blink ? 0.08 : p.eyes * (1 + (i === 0 ? p.squint : -p.squint)));
    });
    mascot.glow.intensity = 0.05 + p.glow * 0.25;
    (mascot.antenna.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15 + p.glow * 3;
    shadow.scale.setScalar(1 - Math.max(0, p.y) * 2.2);
  };

  const draw = () => renderer.render(scene, camera);

  const tick = (now: number) => {
    frame = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const target = pose(mood, now / 1000, false);
    const k = 1 - Math.exp(-dt * 7);
    current = {
      headX: lerp(current.headX, target.headX, k),
      headZ: lerp(current.headZ, target.headZ, k),
      armL: [lerp(current.armL[0], target.armL[0], k), lerp(current.armL[1], target.armL[1], k)],
      armR: [lerp(current.armR[0], target.armR[0], k), lerp(current.armR[1], target.armR[1], k)],
      mouth: lerp(current.mouth, target.mouth, k * 1.4),
      eyes: lerp(current.eyes, target.eyes, k),
      squint: lerp(current.squint, target.squint, k),
      mouthX: lerp(current.mouthX, target.mouthX, k),
      glow: lerp(current.glow, target.glow, k),
      y: lerp(current.y, target.y, Math.min(1, k * 2)),
    };
    if (now > nextBlink) {
      blinkUntil = now + 130;
      nextBlink = now + 2600 + Math.random() * 2600;
    }
    apply(current, now < blinkUntil);
    draw();
    if (!asleep) frame = requestAnimationFrame(tick);
  };

  const still = () => {
    current = pose(mood, 0, true);
    apply(current, false);
    draw();
  };

  if (reduced) still();
  else frame = requestAnimationFrame(tick);

  return {
    setMood(next) {
      mood = next;
      if (reduced) still();
    },
    resize(width, height, dpr) {
      renderer.setPixelRatio(Math.min(dpr, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      // Fit the whole body (about 1.8 high and 1.3 wide with its arms up) in the column or the phone's band,
      // standing in the lower part with room above the antenna.
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const z = Math.max(0.92 / tan, 0.66 / (tan * camera.aspect));
      const centerY = (z * tan) - 0.28;
      camera.position.set(0, centerY + 0.08, z);
      camera.lookAt(0, centerY, 0);
      camera.updateProjectionMatrix();
      draw();
    },
    sleep(value) {
      asleep = value;
      if (value) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!reduced && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    },
    dispose() {
      cancelAnimationFrame(frame);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry.dispose();
      });
      shadowTexture.dispose();
      for (const m of Object.values(materials)) (m as THREE.Material).dispose();
      renderer.dispose();
    },
  };
}
