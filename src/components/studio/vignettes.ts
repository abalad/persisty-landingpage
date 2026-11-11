import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  DARK,
  LIME,
  addLights,
  box,
  buildArch,
  buildBubble,
  buildCoffeeMachine,
  buildDesk,
  buildFolder,
  buildParcel,
  buildPlant,
  buildRocketPad,
  buildStandingMascot,
  canvasTexture,
  castShadows,
  createMaterials,
  glowMat,
  puffTexture,
  type Materials,
} from "./parts";
import type { Mascot } from "./mascot";

/**
 * Still pictures made from the studio's pieces: one small scene on a clay
 * disc, framed by itself, rendered once with a transparent background. They
 * are exported as images (see scripts/art) for the guide, the empty states
 * and the site, and played live over those images in the app (features/art).
 */

export const VIGNETTES = ["wave", "desk", "folders", "project", "rocket", "tests", "coffee", "settings", "dock"] as const;
export type VignetteName = (typeof VIGNETTES)[number];

/** The direction the camera looks from, the studio's own three-quarter view. */
const VIEW = new THREE.Vector3(Math.cos(0.5) * Math.cos(Math.PI / 4), Math.sin(0.5), Math.cos(0.5) * Math.sin(Math.PI / 4)).normalize();
const FACING = Math.PI / 4;

function disc(m: Materials, radius: number) {
  const g = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius - 0.08, 0.28, 72), [m.islandSide, m.islandTop, m.islandSide]);
  slab.position.y = -0.14;
  g.add(slab);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius - 0.04, 0.05, 12, 96), m.islandTop);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.01;
  g.add(rim);
  return castShadows(g);
}

/** One slot of the dock: an empty row drawn as a dashed outline, or the lit one with a "+". */
function slotTexture(lit: boolean) {
  return canvasTexture(380, 170, (ctx) => {
    ctx.fillStyle = "#11141a";
    ctx.fillRect(0, 0, 380, 170);
    const outline = (color: string, dash: number[]) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(42, 22);
      ctx.arcTo(358, 22, 358, 148, 20);
      ctx.arcTo(358, 148, 22, 148, 20);
      ctx.arcTo(22, 148, 22, 22, 20);
      ctx.arcTo(22, 22, 358, 22, 20);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    };
    if (!lit) {
      outline("#2f3543", [16, 12]);
      ctx.fillStyle = "#262b36";
      ctx.beginPath();
      ctx.arc(66, 85, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(96, 74, 150, 10);
      ctx.fillRect(96, 94, 92, 8);
      return;
    }
    outline("#c6f24e", [16, 12]);
    ctx.fillStyle = "#c6f24e";
    ctx.fillRect(158, 78, 64, 14);
    ctx.fillRect(183, 53, 14, 64);
  });
}

/** Lays a group out in the studio's floor axes: `u` to the right, `v` away from the viewer. */
const place = (o: THREE.Object3D, u: number, v: number, turn = 0) => {
  o.position.set((u - v) / Math.SQRT2, o.position.y, (-u - v) / Math.SQRT2);
  o.rotation.y = FACING + turn;
  return o;
};

/**
 * One vignette, built: its group, its mascot, and how it moves. The group as
 * built is the still picture's pose; `tick` plays the scene's own life from
 * there (the live pictures in the app), `poke` its answer to a click.
 */
export interface Vignette {
  group: THREE.Group;
  mascot: Mascot;
  tick(ms: number): void;
  poke(ms: number): void;
}

const ARM_REST = -1.05;
/** 0 → 1 → 0 over `length` ms from `start`; 0 outside. */
const bump = (ms: number, start: number, length: number) => {
  const k = (ms - start) / length;
  return k <= 0 || k >= 1 ? 0 : Math.sin(k * Math.PI);
};

export function composeVignette(name: VignetteName, m: Materials): Vignette {
  const g = new THREE.Group();
  const tapes = [m.limeFlat, m.blue, m.amber, m.red];
  let poked = -Infinity;
  const poke = (ms: number) => {
    poked = ms;
  };

  if (name === "wave") {
    g.add(disc(m, 1.15));
    const mascot = buildStandingMascot(m, undefined, -0.25);
    mascot.armRight.rotation.z = 2.45;
    mascot.head.rotation.x = -0.1;
    const bubble = buildBubble();
    bubble.position.set(0.36, 0.66, 0);
    mascot.head.add(bubble);
    g.add(place(mascot.group, -0.1, 0.05));
    g.add(place(buildParcel(m, m.amber), 0.62, -0.25, 0.3));
    return {
      group: g,
      mascot,
      poke,
      tick(ms) {
        // A wave every few seconds, a big one when clicked; the "?" bobs.
        const big = bump(ms, poked, 1400);
        const c = ms % 4500;
        const swing = big > 0 ? Math.sin((ms - poked) / 70) * 0.45 : c < 1300 ? Math.sin((c / 1300) * Math.PI * 4) * 0.28 : 0;
        mascot.armRight.rotation.z = 2.45 + swing;
        bubble.position.y = 0.66 + Math.sin(ms / 520) * 0.025 + big * 0.08;
      },
    };
  }
  if (name === "desk") {
    g.add(disc(m, 1.35));
    const d = buildDesk(m);
    d.mascot.armLeft.rotation.x = -1.05;
    d.mascot.head.rotation.x = 0.08;
    g.add(place(d.group, 0, 0.1));
    const plant = buildPlant(m);
    plant.group.scale.setScalar(0.85);
    g.add(place(plant.group, 1.0, 0.2));
    const mascot = d.mascot;
    return {
      group: g,
      mascot,
      poke,
      tick(ms) {
        const s = ms / 1000;
        // Typing; clicked, it looks up from the laptop and waves.
        const look = bump(ms, poked, 1600);
        mascot.armLeft.rotation.x = ARM_REST + Math.sin(s * 13) * 0.11 * (1 - look);
        mascot.armRight.rotation.x = ARM_REST + Math.sin(s * 13 + 2.1) * 0.11 * (1 - look) - look * 0.9;
        mascot.armRight.rotation.z = -0.18 + look * 1.6 + look * Math.sin((ms - poked) / 80) * 0.25;
        mascot.head.rotation.x = 0.08 + Math.sin(s * 1.3) * 0.02 - look * 0.25;
        mascot.head.rotation.y = look * 0.45;
        d.faceLight.intensity = 0.22 + Math.sin(s * 7) * 0.03;
        plant.leaves.rotation.z = Math.sin(s / 1.3) * 0.04;
      },
    };
  }
  if (name === "folders") {
    g.add(disc(m, 1.25));
    const held = buildFolder(m, m.limeFlat);
    held.scale.setScalar(0.62);
    held.rotation.set(1.35, 0, 0);
    const mascot = buildStandingMascot(m, held, -1.35);
    g.add(place(mascot.group, -0.2, 0.05));
    const blue = buildFolder(m, m.blue);
    g.add(place(blue, 0.62, 0.35, -0.35));
    const amber = buildFolder(m, m.amber);
    amber.scale.setScalar(0.85);
    g.add(place(amber, 0.85, -0.25, -0.6));
    const turns = [blue.rotation.y, amber.rotation.y];
    return {
      group: g,
      mascot,
      poke,
      tick(ms) {
        const s = ms / 1000;
        // The folder held out, gently; held up high when clicked.
        mascot.armRight.rotation.x = -1.35 + Math.sin(s / 0.8) * 0.05 - bump(ms, poked, 1200) * 0.9;
        blue.rotation.y = (turns[0] as number) + Math.sin(s / 1.5) * 0.06;
        amber.rotation.y = (turns[1] as number) + Math.sin(s / 1.5 + 1.4) * 0.06;
        blue.position.y = bump(ms, poked + 150, 500) * 0.12;
        amber.position.y = bump(ms, poked + 350, 500) * 0.12;
      },
    };
  }
  if (name === "project") {
    g.add(disc(m, 1.45));
    const mascot = buildStandingMascot(m, undefined, -0.6);
    g.add(place(mascot.group, 0, 0));
    const folders = [
      [m.limeFlat, -0.95, 0.35, 0.5],
      [m.blue, 0.05, 1.0, 0],
      [m.amber, 0.95, 0.35, -0.5],
    ].map(([color, u, v, turn]) => {
      const folder = buildFolder(m, color as THREE.Material);
      folder.scale.setScalar(0.85);
      g.add(place(folder, u as number, v as number, turn as number));
      return folder;
    });
    return {
      group: g,
      mascot,
      poke,
      tick(ms) {
        const s = ms / 1000;
        // Looking over its folders; clicked, they hop one after the other.
        mascot.head.rotation.y = Math.sin(s / 2.2) * 0.55;
        folders.forEach((f, i) => {
          f.position.y = Math.max(0, Math.sin(s * 1.1 + i * 2.1)) * 0.025 + bump(ms, poked + i * 160, 480) * 0.18;
        });
      },
    };
  }
  if (name === "rocket") {
    g.add(disc(m, 1.3));
    const pad = buildRocketPad(m);
    pad.rocket.rotation.y = FACING;
    g.add(place(pad.group, -0.25, 0.25, -FACING));
    const remote = box(0.1, 0.16, 0.05, 0.015, m.device);
    remote.rotation.x = 1.3;
    const lightMat = glowMat(0xef7d7d);
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), lightMat);
    light.position.set(0, 0.05, 0.03);
    remote.add(light);
    const mascot = buildStandingMascot(m, remote, -2.2);
    g.add(place(mascot.group, 0.75, -0.3, -0.5));
    const rocketY = pad.rocket.position.y;
    return {
      group: g,
      mascot,
      poke,
      tick(ms) {
        // The remote's light blinks; clicked, the rocket hops off the pad and lands.
        lightMat.emissiveIntensity = 1.5 + Math.sin(ms / 260) * 1.4;
        const flight = bump(ms, poked, 1700);
        pad.rocket.position.y = rocketY + flight * flight * 0.55;
        pad.flame.visible = flight > 0.02;
        pad.flame.scale.set(1, 0.6 + flight * 0.6 + Math.sin(ms / 30) * 0.08, 1);
        pad.flameLight.intensity = flight * 2.5;
        mascot.armRight.rotation.x = -2.2 - flight * 0.4;
      },
    };
  }
  if (name === "tests") {
    g.add(disc(m, 1.3));
    const belt = box(1.9, 0.08, 0.46, 0.03, m.device);
    belt.position.y = 0.34;
    const beltGroup = new THREE.Group();
    beltGroup.add(belt);
    for (const x of [-0.8, 0.8]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10), m.metal);
      leg.position.set(x, 0.15, 0);
      beltGroup.add(leg);
    }
    const arch = buildArch(m);
    arch.group.rotation.y = Math.PI / 2;
    arch.scanMat.color.set(0x9fe870);
    arch.scanMat.emissive.set(0x9fe870);
    arch.scanLight.color.set(0x9fe870);
    beltGroup.add(arch.group);
    const parcels = [-0.55, 0, 0.55].map((x, i) => {
      const parcel = buildParcel(m, tapes[i] as THREE.Material);
      parcel.position.set(x, 0.38, 0);
      beltGroup.add(parcel);
      return { parcel, x };
    });
    g.add(place(castShadows(beltGroup), -0.15, 0.2, -FACING + 0.15));
    const clipboard = box(0.2, 0.26, 0.02, 0.01, m.desk);
    clipboard.rotation.x = 1.2;
    const mascot = buildStandingMascot(m, clipboard, -1.3);
    g.add(place(mascot.group, 0.6, -0.55, -0.4));
    return {
      group: g,
      mascot,
      poke,
      tick(ms) {
        // Parcels ride the belt through the scanner, shrinking in and out at its ends.
        for (const { parcel, x } of parcels) {
          const along = ((x + 0.85 + ms * 0.00032) % 1.7) - 0.85;
          parcel.position.x = along;
          const edge = Math.min(1, (0.85 - Math.abs(along)) / 0.15);
          parcel.scale.setScalar(Math.max(0.001, edge));
        }
        const flash = bump(ms, poked, 700);
        arch.scanMat.emissiveIntensity = 2.6 + Math.sin(ms / 180) * 0.8 + flash * 4;
        arch.scanLight.intensity = 0.8 + flash * 1.5;
        mascot.armRight.rotation.x = -1.3 - flash * 0.5;
      },
    };
  }
  if (name === "settings") {
    // Tuning a console: three sliders, two lights and a dial, wrench in hand.
    g.add(disc(m, 1.3));
    const panel = new THREE.Group();
    const body = box(1.0, 0.56, 0.34, 0.05, m.device);
    body.position.y = 0.28;
    panel.add(body);
    const knobs = [
      [m.limeFlat, -0.3, 0.08],
      [m.blue, 0, -0.07],
      [m.amber, 0.3, 0.03],
    ].map(([color, x, dy]) => {
      const track = box(0.045, 0.34, 0.02, 0.01, m.ink);
      track.position.set(x as number, 0.28, 0.17);
      panel.add(track);
      const knob = box(0.12, 0.065, 0.06, 0.02, color as THREE.Material);
      knob.position.set(x as number, 0.28 + (dy as number), 0.185);
      panel.add(knob);
      return { knob, y: knob.position.y };
    });
    const leds = [0x9fe870, 0x7aa7e8].map((color, i) => {
      const mat = glowMat(color);
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 8), mat);
      light.position.set(-0.38 + i * 0.1, 0.575, 0.06);
      panel.add(light);
      return mat;
    });
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.05, 24), m.metal);
    dial.position.set(0.3, 0.585, 0.02);
    panel.add(dial);
    // The notch turns with the dial: it is the dial's, at the same place as ever.
    const notch = box(0.02, 0.02, 0.06, 0.008, m.limeFlat);
    notch.position.set(0, 0.03, 0.04);
    dial.add(notch);
    g.add(place(castShadows(panel), -0.3, 0.25));
    const wrench = new THREE.Group();
    wrench.add(box(0.035, 0.2, 0.025, 0.012, m.metal));
    const jaw = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.016, 8, 16, Math.PI * 1.4), m.metal);
    jaw.position.y = 0.12;
    jaw.rotation.z = -Math.PI * 0.2;
    wrench.add(jaw);
    wrench.rotation.x = 1.2;
    const mascot = buildStandingMascot(m, wrench, -1.5);
    mascot.head.rotation.y = -0.3;
    g.add(place(mascot.group, 0.62, -0.3, -0.45));
    return {
      group: g,
      mascot,
      poke,
      tick(ms) {
        const s = ms / 1000;
        // Sliders drift, lights blink, the dial turns, the wrench taps; clicked, every slider goes to the top.
        const all = bump(ms, poked, 1100);
        knobs.forEach(({ knob, y }, i) => {
          const drift = y + Math.sin(s / 1.1 + i * 1.7) * 0.06;
          knob.position.y = drift + (0.4 - drift) * all;
        });
        leds.forEach((mat, i) => {
          mat.emissiveIntensity = 1.6 + Math.sin(s * 2.6 + i * 2.2) * 1.4;
        });
        dial.rotation.y = s * 0.6;
        mascot.armRight.rotation.x = -1.5 + Math.max(0, Math.sin(s * 5)) * 0.06;
      },
    };
  }
  if (name === "dock") {
    // The agents' dock: a tower of three slots, two empty, the lowest one lit
    // and waiting; the mascot points at it.
    g.add(disc(m, 1.2));
    const tower = new THREE.Group();
    const plinth = box(1.02, 0.1, 0.46, 0.03, m.metal);
    plinth.position.y = 0.05;
    tower.add(plinth);
    const body = box(0.94, 1.66, 0.3, 0.07, m.device);
    body.position.y = 0.1 + 0.83;
    tower.add(body);
    const litMap = slotTexture(true);
    const screens = [0.38, 0.9, 1.42].map((y, i) => {
      const lit = i === 0;
      const bezel = box(0.82, 0.4, 0.04, 0.03, m.ink);
      bezel.position.set(0, 0.1 + y, 0.15);
      tower.add(bezel);
      const mat = new THREE.MeshBasicMaterial({ map: lit ? litMap : slotTexture(false), color: new THREE.Color(1.25, 1.25, 1.25), toneMapped: false });
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.34), mat);
      screen.position.set(0, 0.1 + y, 0.172);
      tower.add(screen);
      return { mat, map: mat.map };
    });
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.26, 12), m.metal);
    mast.position.set(0.3, 1.89, 0);
    tower.add(mast);
    const beaconMat = m.lime.clone();
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 14), beaconMat);
    beacon.position.set(0.3, 2.04, 0);
    tower.add(beacon);
    const spill = new THREE.PointLight(LIME, 0.35, 1.2, 2);
    spill.position.set(0.2, 0.42, 0.55);
    tower.add(spill);
    g.add(place(castShadows(tower), -0.32, 0.32, 0.12));
    const mascot = buildStandingMascot(m, undefined, -0.3);
    mascot.armLeft.rotation.set(-0.9, 0, -1.25);
    mascot.head.rotation.y = -0.45;
    mascot.head.rotation.x = 0.06;
    g.add(place(mascot.group, 0.62, -0.42, -0.5));
    const plant = buildPlant(m);
    plant.group.scale.setScalar(0.62);
    g.add(place(plant.group, -0.82, -0.42));
    return {
      group: g,
      mascot,
      poke,
      tick(ms) {
        const s = ms / 1000;
        // The waiting slot breathes, the beacon blinks, the pointing arm bobs;
        // clicked, the empty slots light up one after the other.
        const glow = 1.25 + Math.sin(s * 2.4) * 0.3;
        (screens[0] as { mat: THREE.MeshBasicMaterial }).mat.color.setScalar(glow);
        spill.intensity = 0.35 + Math.sin(s * 2.4) * 0.12;
        beaconMat.emissiveIntensity = 0.6 + Math.max(0, Math.sin(s * 3)) ** 4 * 2.4;
        mascot.armLeft.rotation.x = -0.9 + Math.sin(s / 0.7) * 0.05;
        screens.slice(1).forEach((screen, i) => {
          screen.mat.map = bump(ms, poked + i * 260, 700) > 0 ? litMap : screen.map;
        });
        plant.leaves.rotation.z = Math.sin(s / 1.4) * 0.04;
      },
    };
  }
  // coffee: a break by the machine, steam rising.
  g.add(disc(m, 1.15));
  const machine = buildCoffeeMachine(m);
  g.add(place(machine, -0.35, 0.35, 0.2));
  const puffs = puffTexture();
  const steam = [0.15, 0.45, 0.75].map((k, i) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffs, transparent: true, depthWrite: false, opacity: 0.4 * (1 - k) }));
    sprite.position.set(Math.sin(i * 2) * 0.04, 0.3 + k * 0.6, 0.22);
    sprite.scale.setScalar(0.08 + k * 0.18);
    machine.add(sprite);
    return { sprite, k, i };
  });
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.11, 20), m.amber);
  mug.rotation.x = 1.2;
  const mascot = buildStandingMascot(m, mug, -1.4);
  mascot.head.rotation.y = -0.35;
  g.add(place(mascot.group, 0.45, -0.2, -0.3));
  return {
    group: g,
    mascot,
    poke,
    tick(ms) {
      // Steam keeps rising; every few seconds (or when clicked) a sip.
      for (const { sprite, k, i } of steam) {
        const p = (k + ms / 2600) % 1;
        sprite.position.set(Math.sin(i * 2 + p * 3) * 0.04, 0.3 + p * 0.6, 0.22);
        sprite.scale.setScalar(0.08 + p * 0.18);
        (sprite.material as THREE.SpriteMaterial).opacity = 0.4 * (1 - p) * Math.min(1, p * 6);
      }
      const sip = Math.max(bump(ms % 6500, 4800, 1400), bump(ms, poked, 1400));
      mascot.armRight.rotation.x = -1.4 - sip * 0.85;
      mascot.head.rotation.x = -sip * 0.18;
    },
  };
}

/**
 * Points the camera at `content` from the studio's three-quarter view and
 * pulls it in until what is seen fills `fill` of the frame (2 = edge to
 * edge): the meshes' own vertices are projected, as a box's corners would
 * overshoot a round disc.
 */
export function frameVignette(content: THREE.Object3D, camera: THREE.PerspectiveCamera, fill = 1.62) {
  content.updateMatrixWorld(true);
  const points: THREE.Vector3[] = [];
  content.traverse((o) => {
    // A sprite (the bubble) has no mesh of its own: its square stands in.
    if ((o as THREE.Sprite).isSprite) {
      const c = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
      const r = new THREE.Vector3().setFromMatrixScale(o.matrixWorld).x / 2;
      for (const [dx, dy] of [[-r, -r], [r, -r], [-r, r], [r, r]] as const) points.push(c.clone().add(new THREE.Vector3(dx, dy, 0)));
      return;
    }
    const mesh = o as THREE.Mesh;
    const position = mesh.isMesh ? (mesh.geometry.getAttribute("position") as THREE.BufferAttribute | undefined) : undefined;
    if (!position) return;
    const step = Math.max(1, Math.floor(position.count / 400));
    for (let i = 0; i < position.count; i += step) points.push(new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld));
  });
  const center = new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3());
  let distance = 12;
  for (let pass = 0; pass < 5; pass++) {
    camera.position.copy(center).addScaledVector(VIEW, distance);
    camera.lookAt(center);
    camera.updateMatrixWorld();
    const ndc = points.map((pt) => pt.clone().project(camera));
    const xs = ndc.map((v) => v.x);
    const ys = ndc.map((v) => v.y);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    // Re-centre on what the camera sees, then scale the distance to the fill wanted.
    const mid = new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, (ndc[0] as THREE.Vector3).z).unproject(camera);
    center.add(mid.sub(center));
    distance *= Math.max(maxX - minX, maxY - minY) / fill;
  }
  camera.position.copy(center).addScaledVector(VIEW, distance);
  camera.lookAt(center);
  camera.updateMatrixWorld();
}

/**
 * Renders one vignette into `canvas` at `width`×`height` CSS pixels times
 * `scale`, framed to fit with a margin, and returns it as a WebP data URL
 * with a transparent background.
 */
export function renderVignette(canvas: HTMLCanvasElement, name: VignetteName, width: number, height: number, scale = 2): string {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(scale);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;
  const m = createMaterials(DARK);
  const content = composeVignette(name, m).group;
  scene.add(content);
  addLights(scene, DARK, 3);

  const camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 100);
  frameVignette(content, camera);

  renderer.render(scene, camera);
  const url = canvas.toDataURL("image/webp", 0.92);
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    mesh.geometry?.dispose();
  });
  pmrem.dispose();
  renderer.dispose();
  return url;
}
