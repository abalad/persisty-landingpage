import * as THREE from "three";
import type { Mood } from "./mood";

/** The mascot's height standing up, and sunk into the corner. */
export const UP = 0;
export const PEEK = -0.86;

/** Where the mascot rests: up when raised or standing, sunk when peeking (a little more once the session ended). */
export function restY(rest: "peek" | "stand", raised: boolean, mood: Mood): number {
  if (raised || rest === "stand") return UP;
  return mood === "ended" ? PEEK - 0.1 : PEEK;
}

const raycaster = new THREE.Raycaster();

/** Collects the meshes under `root` that are really shown (a hidden parent hides its children). */
function visibleMeshes(root: THREE.Object3D, out: THREE.Object3D[]) {
  if (!root.visible) return;
  if ((root as THREE.Mesh).isMesh) out.push(root);
  for (const child of root.children) visibleMeshes(child, out);
}

/** Whether the point (x, y, in px of a width×height canvas) lands on any visible mesh of `objects`. */
export function hitTest(objects: THREE.Object3D[], camera: THREE.Camera, x: number, y: number, width: number, height: number): boolean {
  if (width <= 0 || height <= 0) return false;
  const meshes: THREE.Object3D[] = [];
  for (const o of objects) visibleMeshes(o, meshes);
  raycaster.setFromCamera(new THREE.Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1), camera);
  return raycaster.intersectObjects(meshes, false).length > 0;
}
