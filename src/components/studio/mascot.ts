import * as THREE from "three";

/**
 * Persisty's mascot: the agent that keeps working. Soft warm-white clay, a
 * big round head on a bean of a body, two dark eyes and a smile, and on top
 * the Orbita's lime point as an antenna that glows at night. Built from
 * primitives so it needs no asset; it sits, facing +z, and types.
 */
export interface Mascot {
  group: THREE.Group;
  head: THREE.Group;
  armLeft: THREE.Object3D;
  armRight: THREE.Object3D;
  /** At the end of the right arm: whatever it holds goes here. */
  handRight: THREE.Object3D;
  feet: [THREE.Object3D, THREE.Object3D];
  antenna: THREE.Mesh;
  glow: THREE.PointLight;
  /** The mouth (half a torus: a smile; turned over, a frown) and the eyes, for faces beyond typing. */
  smile: THREE.Mesh;
  eyes: THREE.Mesh[];
}

export interface MascotMaterials {
  clay: THREE.Material;
  ink: THREE.Material;
  blush: THREE.Material;
  lime: THREE.MeshStandardMaterial;
}

const ARM_REST = -1.05;

export function createMascot(m: MascotMaterials): Mascot {
  const group = new THREE.Group();

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.34, 40, 32), m.clay);
  body.scale.set(1, 1.08, 0.94);
  body.position.y = 0.34;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const head = new THREE.Group();
  head.position.y = 0.84;
  group.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.34, 48, 40), m.clay);
  skull.scale.set(1.04, 0.96, 1);
  skull.castShadow = true;
  head.add(skull);

  const eyes: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.056, 24, 16), m.ink);
    eyes.push(eye);
    eye.scale.set(0.82, 1.22, 0.55);
    eye.position.set(side * 0.12, 0.05, 0.31);
    head.add(eye);
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 12), m.blush);
    cheek.scale.set(1.2, 0.6, 0.3);
    cheek.position.set(side * 0.2, -0.05, 0.282);
    cheek.rotation.y = side * 0.55;
    head.add(cheek);
  }

  // A smile: the lower half of a thin torus.
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.013, 10, 28, Math.PI), m.ink);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.06, 0.322);
  head.add(smile);

  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.17, 12), m.clay);
  stalk.position.y = 0.39;
  head.add(stalk);

  const antenna = new THREE.Mesh(new THREE.SphereGeometry(0.058, 24, 16), m.lime);
  antenna.position.y = 0.5;
  head.add(antenna);

  const glow = new THREE.PointLight(0xc6f24e, 0, 0.9, 2);
  glow.position.y = 0.5;
  head.add(glow);

  // Arms pivot at the shoulder and reach forward to the keyboard.
  const arm = (side: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.3, 0.48, 0.04);
    const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.2, 8, 16), m.clay);
    limb.position.y = -0.16;
    limb.castShadow = true;
    pivot.add(limb);
    pivot.rotation.x = ARM_REST;
    pivot.rotation.z = side * 0.18;
    group.add(pivot);
    return pivot;
  };
  const armRight = arm(1);
  const handRight = new THREE.Object3D();
  handRight.position.y = -0.34;
  armRight.add(handRight);

  const foot = (side: number) => {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), m.clay);
    f.scale.set(1, 0.55, 1.35);
    f.position.set(side * 0.15, 0.03, 0.08);
    f.castShadow = true;
    group.add(f);
    return f;
  };

  return { group, head, armLeft: arm(-1), armRight, handRight, feet: [foot(-1), foot(1)], antenna, glow, smile, eyes };
}

/**
 * Typing, breathing, now and then a look around. `seed` keeps several
 * mascots out of step; `glow` (0–1) is how brightly the antenna shines.
 */
export function animateMascot(mascot: Mascot, ms: number, seed: number, glow: number, typing: boolean) {
  const t = ms / 1000 + seed * 3.7;
  const keys = typing ? 0.11 : 0.02;
  mascot.armLeft.rotation.x = ARM_REST + Math.sin(t * 13) * keys;
  mascot.armRight.rotation.x = ARM_REST + Math.sin(t * 13 + 2.1) * keys;
  mascot.group.position.y = Math.sin(t * 2.2) * 0.008;
  // Mostly at the screen; a slow glance every few seconds.
  const glance = Math.max(0, Math.sin(t * 0.45)) ** 6;
  mascot.head.rotation.y = glance * 0.55 * (seed % 2 ? 1 : -1);
  mascot.head.rotation.x = typing ? 0.08 + Math.sin(t * 1.3) * 0.02 : -0.04;
  mascot.glow.intensity = 0.05 + glow * 0.2;
  (mascot.antenna.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + glow * 2.8;
}

/** A walking step: feet alternate, the body bobs and sways. `phase` grows with distance walked. */
export function walkMascot(mascot: Mascot, phase: number) {
  const [left, right] = mascot.feet;
  left.position.y = 0.03 + Math.max(0, Math.sin(phase)) * 0.07;
  right.position.y = 0.03 + Math.max(0, -Math.sin(phase)) * 0.07;
  left.position.z = 0.08 + Math.sin(phase) * 0.06;
  right.position.z = 0.08 - Math.sin(phase) * 0.06;
  mascot.group.position.y = Math.abs(Math.sin(phase)) * 0.05;
  mascot.group.rotation.z = Math.sin(phase) * 0.05;
  mascot.armLeft.rotation.x = -0.15 + Math.sin(phase) * 0.35;
}
