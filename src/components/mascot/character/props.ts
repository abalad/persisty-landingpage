import * as THREE from "three";
import { LIME, canvasTexture } from "@/components/studio/parts";
import type { Props } from "./pose";

/**
 * What appears around the character: sweat drops, stars, dust, the "!" and "?" marks, the work panel, the contact shadow and
 * the antenna's halo. Each has a fixed pool built once; `update` only moves, scales and shows them, allocating nothing.
 * "zzz" and "…" are not here: they are CSS on the page, since the rig is asleep or still when they show.
 *
 * Everything is in stage space (see model.ts) and lives in its own group, never inside the model's: props never count
 * for a hit. `now` and the props' `since` are in ms (the rig's clock), `dt` in seconds.
 */

export const POOLS = { sweat: 6, stars: 5, dust: 6 } as const;

export interface PropPools {
  group: THREE.Group;                                 // never inside the model's group: props never count for a hit
  /** The halo's color: the rig copies the antenna's tint into it (lime, amber when someone asks, red on an error). */
  tint: THREE.Color;
  /**
   * `head` is the skull's centre and `antenna` the lime ball's (model.anchors, in stage space); `glow` 0–1 is how bright the
   * antenna shines; `height` how far the feet are above the floor (the shadow fades with it). `floor` is the floor's y in
   * stage space when the pose knows it (feet drawn above it in a hop: 0); without it the floor is `height` below the feet
   * (at most 0.25). The shadow and the dust lie on it. Reduced motion: one still frame of each.
   */
  update(props: Props, o: { now: number; dt: number; head: THREE.Vector3; antenna: THREE.Vector3; glow: number; height: number; floor?: number | undefined; reduced: boolean }): void;
  dispose(): void;
}

const SWEAT = { life: 0.6, gravity: 3.2, speed: [0.55, 0.65, 0.12] as const, from: [0.3, 0.1, 0.1] as const };
const STAR = { size: 1, orbit: { turn: 0.8, rx: 0.38, rz: 0.24, y: 0.22, enter: 150 }, tumble: 700, burst: 1200 };
/**
 * Dust: small round clay puffs that grow from `from` to `to` units across over the first `hold` of their `life`, then
 * shrink away still solid (a puff fading out over a dark desktop turns into a grey smudge), the last of it fading.
 */
const DUST = { life: 0.5, from: 0.07, to: 0.17, opacity: 0.95, hold: 0.5 };
const MARK = { size: 0.2, at: [0.36, 0.3, 0.15] as const };
/** The contact shadow: a near-black ellipse with a dense core, so it shows on a dark desktop and stays soft on a white window. */
const SHADOW = { opacity: 0.5, w: 0.52, h: 0.11, fade: 0.6, color: 0x05060a };
/**
 * The antenna's halo, blended over what is behind (an additive one vanishes on a light page): `opacity` at rest plus
 * `bright` times the glow, at its centre.
 */
const HALO = { size: 0.26, grow: 0.14, opacity: 0.3, bright: 0.45 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (k: number) => 1 - (1 - k) ** 3;

function radial(stops: [number, string][]) {
  return canvasTexture(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    for (const [at, color] of stops) g.addColorStop(at, color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  });
}

/**
 * A puff of dust in clay: three round lobes, lit from up and to the right like the character, cooler underneath, so it
 * reads as a little cloud on a dark desktop and on a white window alike.
 */
function puffTexture() {
  return canvasTexture(64, 64, (ctx) => {
    const lobes: [number, number, number][] = [[23, 38, 15], [41, 39, 14], [32, 26, 15]];
    for (const [x, y, r] of lobes) {
      const g = ctx.createRadialGradient(x + r * 0.35, y - r * 0.45, r * 0.1, x, y, r);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.55, "#f3f0ea");
      g.addColorStop(1, "#c3cad9");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/**
 * An amber badge with an ink outline and an ink glyph, ~18 px round on screen: the family of the page's count badge
 * (mascot.css .mascot__badge), which takes its place while someone asks.
 */
function markTexture(glyph: string) {
  return canvasTexture(128, 128, (ctx) => {
    ctx.fillStyle = "#e3b24a";
    ctx.strokeStyle = "#15171c";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(64, 64, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#15171c";
    ctx.font = "800 76px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, 64, 68);
  });
}

/** A five-pointed star, extruded thin and centred. */
function starGeometry() {
  const shape = new THREE.Shape();
  for (let k = 0; k < 10; k++) {
    const r = k % 2 === 0 ? 0.06 : 0.026;
    const a = Math.PI / 2 + (k * Math.PI) / 5;
    if (k === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.015, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2 });
  g.center();
  return g;
}

interface Drop { mesh: THREE.Mesh; age: number; vx: number; vy: number; vz: number }

export function createProps(): PropPools {
  const group = new THREE.Group();
  group.name = "props";

  // Textures and materials, once.
  const puff = puffTexture();
  const haloMap = radial([[0, "rgba(255,255,255,1)"], [0.3, "rgba(255,255,255,0.65)"], [0.6, "rgba(255,255,255,0.2)"], [1, "rgba(255,255,255,0)"]]);
  const shadowMap = radial([[0, "rgba(255,255,255,1)"], [0.3, "rgba(255,255,255,0.6)"], [0.7, "rgba(255,255,255,0.16)"], [1, "rgba(255,255,255,0)"]]);
  const bang = markTexture("!");
  const ask = markTexture("?");
  const sweatMat = new THREE.MeshStandardMaterial({ color: 0xa8dcff, emissive: 0x2a6fa8, emissiveIntensity: 0.35, roughness: 0.12, transparent: true, opacity: 0.88 });
  const starMat = new THREE.MeshStandardMaterial({ color: 0xffc63d, emissive: 0xffa21a, emissiveIntensity: 0.9, roughness: 0.35, metalness: 0.1 });
  const haloMat = new THREE.SpriteMaterial({ map: haloMap, color: LIME, transparent: true, depthWrite: false, toneMapped: false });
  // The material copies a color it is given: the tint is its own.
  const tint = haloMat.color;
  const shadowMat = new THREE.SpriteMaterial({ map: shadowMap, color: SHADOW.color, transparent: true, depthWrite: false, opacity: 0, toneMapped: false });
  // Off the tone mapping, the marks' amber is the page's badge's and the antenna's own (ACES paled it).
  const bangMat = new THREE.SpriteMaterial({ map: bang, transparent: true, depthWrite: false, toneMapped: false });
  const askMat = new THREE.SpriteMaterial({ map: ask, transparent: true, depthWrite: false, toneMapped: false });
  const paneMat = new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  const barMat = new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  // 0.036: a drop about 9 px long as it leaves the head, so it reads at 200 px.
  const sweatGeo = new THREE.SphereGeometry(0.036, 12, 10);
  const starGeo = starGeometry();
  const paneGeo = new THREE.PlaneGeometry(0.46, 0.26);
  const barGeo = new THREE.PlaneGeometry(1, 1);
  const dustMats: THREE.SpriteMaterial[] = [];

  const shadow = new THREE.Sprite(shadowMat);
  shadow.name = "shadow";
  shadow.visible = false;
  group.add(shadow);

  const halo = new THREE.Sprite(haloMat);
  halo.name = "halo";
  group.add(halo);

  const drops: Drop[] = [];
  for (let k = 0; k < POOLS.sweat; k++) {
    const mesh = new THREE.Mesh(sweatGeo, sweatMat);
    mesh.name = `sweat${k}`;
    mesh.visible = false;
    group.add(mesh);
    drops.push({ mesh, age: Infinity, vx: 0, vy: 0, vz: 0 });
  }

  const stars: THREE.Mesh[] = [];
  for (let k = 0; k < POOLS.stars; k++) {
    const star = new THREE.Mesh(starGeo, starMat);
    star.name = `star${k}`;
    star.visible = false;
    group.add(star);
    stars.push(star);
  }

  const puffs: THREE.Sprite[] = [];
  for (let k = 0; k < POOLS.dust; k++) {
    // The puff's own colors, as drawn; each turned a little so the six don't look stamped.
    const m = new THREE.SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0, toneMapped: false, rotation: ((k % 3) - 1) * 0.35 });
    dustMats.push(m);
    const sprite = new THREE.Sprite(m);
    sprite.name = `dust${k}`;
    sprite.visible = false;
    group.add(sprite);
    puffs.push(sprite);
  }

  const marks = { "!": new THREE.Sprite(bangMat), "?": new THREE.Sprite(askMat) };
  for (const [glyph, sprite] of Object.entries(marks)) {
    sprite.name = `mark${glyph}`;
    sprite.visible = false;
    group.add(sprite);
  }

  const panel = new THREE.Group();
  panel.name = "panel";
  panel.rotation.x = -1.05;
  panel.add(new THREE.Mesh(paneGeo, paneMat));
  const bars: THREE.Mesh[] = [];
  for (let k = 0; k < 3; k++) {
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(0, 0.07 - k * 0.07, 0.002);
    panel.add(bar);
    bars.push(bar);
  }
  panel.visible = false;
  group.add(panel);

  let sweatDue = 0;
  let sweatSide = 1;
  let wasSweating = false;
  let markShown: Props["mark"] = null;
  let markSince = 0;

  function spawnDrop(head: THREE.Vector3) {
    // The oldest drop makes way.
    let pick = drops[0]!;
    for (const d of drops) if (d.age > pick.age) pick = d;
    pick.age = 0;
    pick.vx = sweatSide * SWEAT.speed[0];
    pick.vy = SWEAT.speed[1];
    pick.vz = SWEAT.speed[2];
    pick.mesh.position.set(head.x + sweatSide * SWEAT.from[0], head.y + SWEAT.from[1], head.z + SWEAT.from[2]);
    sweatSide = -sweatSide;
  }

  function updateSweat(rate: number, head: THREE.Vector3, dt: number, reduced: boolean) {
    if (reduced) {
      // One still drop beside the head while it sweats.
      drops.forEach((d, k) => {
        d.age = Infinity;
        d.mesh.visible = k === 0 && rate > 0;
      });
      if (rate > 0) {
        const m = drops[0]!.mesh;
        m.position.set(head.x + SWEAT.from[0], head.y + SWEAT.from[1], head.z + SWEAT.from[2]);
        m.scale.set(0.8, 1.25, 0.8);
        m.rotation.set(0, 0, 0);
      }
      return;
    }
    // The first drop comes at once, the next ones at the rate.
    if (rate > 0 && !wasSweating) sweatDue = 1;
    wasSweating = rate > 0;
    sweatDue += Math.min(rate, 6) * dt;
    while (sweatDue >= 1) {
      sweatDue -= 1;
      spawnDrop(head);
    }
    for (const d of drops) {
      d.age += dt;
      const alive = d.age < SWEAT.life;
      d.mesh.visible = alive;
      if (!alive) continue;
      d.vy -= SWEAT.gravity * dt;
      d.mesh.position.x += d.vx * dt;
      d.mesh.position.y += d.vy * dt;
      d.mesh.position.z += d.vz * dt;
      // Shrinks over its second half, stretched along the way it goes.
      const k = 1 - clamp01((d.age / SWEAT.life - 0.5) * 2);
      d.mesh.scale.set(0.8 * k, 1.25 * k, 0.8 * k);
      d.mesh.rotation.set(0, 0, Math.atan2(d.vy, d.vx) - Math.PI / 2);
    }
  }

  function updateStars(s: Props["stars"], head: THREE.Vector3, now: number, reduced: boolean) {
    let shown = 0;
    if (s) {
      const t = Math.max(0, now - s.since);
      if (s.mode === "orbit") {
        shown = 3;
        const turn = reduced ? 0.15 : (t / 1000) * STAR.orbit.turn;
        const grow = reduced ? 1 : clamp01(t / STAR.orbit.enter);
        for (let k = 0; k < 3; k++) {
          const a = (turn + k / 3) * Math.PI * 2;
          const star = stars[k]!;
          star.position.set(head.x + Math.cos(a) * STAR.orbit.rx, head.y + STAR.orbit.y + Math.sin(a * 2) * 0.02, head.z + Math.sin(a) * STAR.orbit.rz);
          star.rotation.set(0, a * 2, 0);
          star.scale.setScalar(STAR.size * grow);
        }
      } else if (s.mode === "tumble") {
        const k = reduced ? 0.4 : t / STAR.tumble;
        if (k < 1) {
          shown = 2;
          for (let j = 0; j < 2; j++) {
            const side = j === 0 ? 1 : -1;
            const star = stars[j]!;
            star.position.set(head.x + side * (0.2 + 0.18 * easeOut(k)), head.y + 0.28 + Math.sin(Math.PI * k) * 0.12, head.z + 0.12);
            star.rotation.set(0, 0, side * k * 6);
            star.scale.setScalar(STAR.size * Math.min(1, k / 0.15) * (1 - clamp01((k - 0.7) / 0.3)));
          }
        }
      } else {
        const k = reduced ? 0.5 : t / STAR.burst;
        if (k < 1) {
          shown = 5;
          for (let j = 0; j < 5; j++) {
            const a = Math.PI * (0.15 + (0.7 * j) / 4);
            const r = 0.22 + 0.38 * easeOut(k);
            const star = stars[j]!;
            star.position.set(head.x + Math.cos(a) * r, head.y + 0.12 + Math.sin(a) * r * 0.8, head.z + 0.2);
            star.rotation.set(0, k * 5, (j - 2) * 0.4 + k * 3);
            star.scale.setScalar(STAR.size * Math.min(1, k / 0.1) * (1 - clamp01((k - 0.6) / 0.4)));
          }
        }
      }
    }
    stars.forEach((star, k) => (star.visible = k < shown));
  }

  function updateDust(d: Props["dust"], head: THREE.Vector3, floor: number, now: number, reduced: boolean) {
    const k = d ? (reduced ? 0.3 : Math.max(0, now - d.since) / 1000 / DUST.life) : 1;
    const count = d && k < 1 ? Math.min(POOLS.dust, Math.max(0, Math.floor(d.count))) : 0;
    puffs.forEach((puffSprite, j) => {
      puffSprite.visible = j < count;
      if (j >= count) return;
      // Out to both sides along the floor, alternating, the later ones further and faster.
      const side = j % 2 === 0 ? 1 : -1;
      const rank = Math.floor(j / 2);
      const e = easeOut(k);
      puffSprite.position.set(head.x + side * (0.1 + rank * 0.07 + e * (0.18 + rank * 0.06)), floor + 0.03 + e * (0.05 + rank * 0.02), 0.1);
      const grow = easeOut(Math.min(1, k / DUST.hold));
      const away = clamp01((k - DUST.hold) / (1 - DUST.hold));
      puffSprite.scale.setScalar((DUST.from + (DUST.to - DUST.from) * grow) * (1 - away * away));
      dustMats[j]!.opacity = DUST.opacity * (1 - away ** 4);
    });
  }

  function updateMark(mark: Props["mark"], head: THREE.Vector3, now: number, reduced: boolean) {
    if (mark !== markShown) {
      markShown = mark;
      markSince = now;
    }
    marks["!"].visible = mark === "!";
    marks["?"].visible = mark === "?";
    if (!mark) return;
    // In on a spring: past full size and back.
    const t = (now - markSince) / 1000;
    const s = reduced ? 1 : 1 - Math.exp(-7 * t) * Math.cos(16 * t);
    const sprite = marks[mark];
    sprite.position.set(head.x + MARK.at[0], head.y + MARK.at[1], head.z + MARK.at[2]);
    sprite.scale.setScalar(MARK.size * Math.max(0.001, s));
  }

  function updatePanel(on: boolean, head: THREE.Vector3, now: number, reduced: boolean) {
    panel.visible = on;
    if (!on) return;
    panel.position.set(head.x, 0.34, 0.44);
    bars.forEach((bar, k) => {
      const pulse = reduced ? 0.6 : 0.5 + 0.5 * Math.sin((now / 1000) * Math.PI * 2 * (1.3 + k * 0.4) + k * 1.7);
      const len = 0.08 + 0.22 * pulse;
      bar.scale.set(len, 0.026, 1);
      bar.position.x = -0.18 + len / 2;
    });
  }

  return {
    group,
    tint,
    update(props, o) {
      const { head, now, reduced } = o;
      const height = Math.max(0, o.height);
      const glow = clamp01(o.glow);

      const floor = o.floor ?? -Math.min(height, 0.25);
      const fade = clamp01(1 - height / SHADOW.fade);
      shadowMat.opacity = SHADOW.opacity * clamp01(props.shadow) * fade;
      shadow.visible = shadowMat.opacity > 0.003;
      shadow.position.set(head.x, floor - 0.015, 0.02);
      shadow.scale.set(SHADOW.w * (1 - 0.4 * (1 - fade)), SHADOW.h * (1 - 0.4 * (1 - fade)), 1);

      halo.position.copy(o.antenna);
      halo.scale.setScalar(HALO.size + HALO.grow * glow);
      haloMat.opacity = HALO.opacity + HALO.bright * glow;

      updateSweat(props.sweat, head, Math.max(0, o.dt), reduced);
      updateStars(props.stars, head, now, reduced);
      updateDust(props.dust, head, floor, now, reduced);
      updateMark(props.mark, head, now, reduced);
      updatePanel(props.panel, head, now, reduced);
    },
    dispose() {
      for (const g of [sweatGeo, starGeo, paneGeo, barGeo]) g.dispose();
      for (const m of [sweatMat, starMat, haloMat, shadowMat, bangMat, askMat, paneMat, barMat, ...dustMats]) m.dispose();
      for (const t of [puff, haloMap, shadowMap, bang, ask]) t.dispose();
    },
  };
}
