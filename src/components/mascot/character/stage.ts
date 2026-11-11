import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { characterCamera } from "./model";

/**
 * Where the character is drawn, the same wherever it is (the floating window's rig and the development gallery), so what
 * the gallery shows is what the window shows: a transparent renderer in sRGB with ACES at 1.05; the light, with no shadow
 * maps; and the camera that frames the 200×200 box (model.ts's CAMERA). The caller adds the character and its props to `scene`.
 *
 * The light is a vinyl toy's (LIGHT): a warm key from up and to the right that leaves a soft terminator on the left of
 * the head and the belly, a cool fill from the left so that side is cool rather than grey, a cold light from behind for
 * the silhouette, and the Buddy's room, dimmed, for the eyes' reflections. Brighter fill or room and the head goes back
 * to a flat white disc; a stronger key and the lit side burns out under ACES.
 */
export const LIGHT = {
  env: 0.3,
  key: { color: 0xffe6c8, intensity: 3, at: [3.5, 4.5, 5.5] },
  fill: { color: 0x9fb6ff, intensity: 0.9, at: [-5, 0.5, 3] },
  back: { color: 0xa9bfff, intensity: 2.5, at: [-3, 3, -5] },
} as const;

export interface Stage {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** The light's environment and the renderer; what the caller added to the scene is the caller's to dispose. */
  dispose(): void;
}

/** Null without WebGL. */
export function createStage(canvas: HTMLCanvasElement): Stage | null {
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
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  room.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = LIGHT.env;
  for (const l of [LIGHT.key, LIGHT.fill, LIGHT.back]) {
    const light = new THREE.DirectionalLight(l.color, l.intensity);
    light.position.set(l.at[0], l.at[1], l.at[2]);
    scene.add(light);
  }

  return {
    renderer,
    scene,
    camera: characterCamera(),
    dispose() {
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
