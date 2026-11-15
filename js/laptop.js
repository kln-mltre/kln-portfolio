// The TLPerf laptop, built from primitives. The lid turns on its hinge, the page capture slides
// behind the screen, and the screen lights the keys in front of it.
import * as THREE from 'three';
import { slab, panel, glassMaterial, screenMaterial, poolTexture, loadTexture } from './shapes.js';

const W = 3.04;
const D = 2.06;
const BASE_T = 0.07;
const LID_T = 0.038;
const SCREEN_W = W - 0.15;
const SCREEN_H = SCREEN_W / 1.6;

// The keyboard, in key units: one unit is a letter key. Six rows, as on a real one; the pair in
// the last row is the up and down arrows sharing one key's place.
const UNIT = 0.187;
const GAP = 0.021;
const KEY_H = 0.014;
const ROWS = [
  { depth: 0.55, keys: Array(14).fill(14.5 / 14) },
  { depth: 1, keys: [...Array(13).fill(1), 1.5] },
  { depth: 1, keys: [1.5, ...Array(13).fill(1)] },
  { depth: 1, keys: [1.75, ...Array(11).fill(1), 1.75] },
  { depth: 1, keys: [2.25, ...Array(10).fill(1), 2.25] },
  { depth: 1, keys: [1, 1, 1, 1.25, 5, 1.25, 1, 1, [0.5, 0.5], 1] },
];
const KEYS_W = UNIT * 14.5;
const KEYS_D = UNIT * ROWS.reduce((sum, row) => sum + row.depth, 0);
const KEYS_TOP = -D / 2 + 0.16;

// The laptop stands for a 14-inch machine, about 313 mm wide: one millimetre in scene units.
export const LAPTOP_MM = W / 313;
export const LAPTOP_WIDTH = W;
export const LAPTOP_HEIGHT = D;

// Every key of one size is one instanced mesh: a few draw calls for the whole keyboard.
function keyboard(material, deckY) {
  const group = new THREE.Group();
  const sizes = new Map();
  let z = KEYS_TOP;
  ROWS.forEach((row) => {
    const depth = row.depth * UNIT;
    let x = -KEYS_W / 2;
    row.keys.forEach((key) => {
      const width = (Array.isArray(key) ? 1 : key) * UNIT;
      let offset = 0;
      (Array.isArray(key) ? key : [1]).forEach((share) => {
        const d = depth * share;
        const id = `${width.toFixed(4)}:${d.toFixed(4)}`;
        if (!sizes.has(id)) sizes.set(id, { w: width - GAP, d: d - GAP, at: [] });
        sizes.get(id).at.push([x + width / 2, z + offset + d / 2]);
        offset += d;
      });
      x += width;
    });
    z += depth;
  });
  const flat = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
  const place = new THREE.Matrix4();
  sizes.forEach(({ w, d, at }) => {
    const mesh = new THREE.InstancedMesh(slab(w, d, KEY_H, 0.022, 0.004), material, at.length);
    at.forEach(([kx, kz], index) => {
      place.makeTranslation(kx, deckY + KEY_H / 2, kz).multiply(flat);
      mesh.setMatrixAt(index, place);
    });
    group.add(mesh);
  });
  return group;
}

// What is printed on the keys: the US layout most laptops carry, small and grey as on the real
// thing. One entry per key of ROWS; the pair of arrows shares one place, as there.
const LEGENDS = [
  ['esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', ''],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete'],
  ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'return'],
  ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift'],
  ['fn', 'control', 'option', 'command', '', 'command', 'option', '←', ['↑', '↓'], '→'],
];

// The legends of every key, drawn once on a canvas laid just over the keys: one more draw call.
function legends(deckY) {
  const scale = 640;    // canvas pixels per scene unit
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(KEYS_W * scale);
  canvas.height = Math.round(KEYS_D * scale);
  const c = canvas.getContext('2d');
  c.fillStyle = 'rgba(250, 249, 245, 0.95)';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  let z = 0;
  ROWS.forEach((row, r) => {
    const depth = row.depth * UNIT;
    let x = 0;
    row.keys.forEach((key, k) => {
      const width = (Array.isArray(key) ? 1 : key) * UNIT;
      let offset = 0;
      (Array.isArray(key) ? key : [1]).forEach((share, i) => {
        const d = depth * share;
        const label = Array.isArray(LEGENDS[r][k]) ? LEGENDS[r][k][i] : LEGENDS[r][k];
        if (label) {
          const size = (label.length > 2 ? 0.14 : r === 0 ? 0.2 : 0.3) * Math.min(UNIT, d / share);
          c.font = `500 ${Math.round(size * scale)}px Helvetica, Arial, sans-serif`;
          c.fillText(label, (x + width / 2) * scale, (z + offset + d / 2) * scale);
        }
        offset += d;
      });
      x += width;
    });
    z += depth;
  });
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const material = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false });
  return laid(new THREE.PlaneGeometry(KEYS_W, KEYS_D), material, deckY + KEY_H + 0.0008, KEYS_TOP + KEYS_D / 2);
}

// A panel laid on its back, facing up.
function laid(geometry, material, y, z) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, y, z);
  return mesh;
}

// onReady: the page is in. onDetail: something that only refines the picture has arrived.
export function createLaptop(onReady, onDetail) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x77777b, metalness: 1, roughness: 0.36 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0a0a0b, metalness: 0.1, roughness: 0.5 });

  // The slab is built upright; laid on its back, its front face becomes the top of the base.
  const base = new THREE.Mesh(slab(W, D, BASE_T, 0.12, 0.01), metal);
  base.rotation.x = -Math.PI / 2;
  base.position.y = BASE_T / 2;
  group.add(base);

  // The deck is less of a mirror than the shell, so it takes the light the screen throws on it.
  const deck = new THREE.MeshStandardMaterial({ color: 0x77777b, metalness: 0.55, roughness: 0.5 });
  group.add(laid(panel(W - 0.05, D - 0.05, 0.1), deck, BASE_T + 0.0006, 0));
  group.add(laid(panel(KEYS_W + 0.035, KEYS_D + 0.035, 0.03), dark, BASE_T + 0.0012, KEYS_TOP + KEYS_D / 2));
  group.add(keyboard(new THREE.MeshStandardMaterial({ color: 0x18181a, metalness: 0.05, roughness: 0.6 }), BASE_T + 0.0012));
  group.add(legends(BASE_T + 0.0012));
  const padZ = (KEYS_TOP + KEYS_D + D / 2) / 2;
  const pad = new THREE.MeshStandardMaterial({ color: 0x808085, metalness: 0.7, roughness: 0.24 });
  group.add(laid(panel(1.28, 0.7, 0.045), pad, BASE_T + 0.0012, padZ));
  // The notch a finger opens the lid by.
  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.012, 0.03), dark);
  notch.position.set(0, BASE_T - 0.003, D / 2 - 0.012);
  group.add(notch);

  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, W * 0.8, 20), dark);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, BASE_T + 0.006, -D / 2 + 0.012);
  group.add(bar);

  // The hinge runs along the back edge. Everything on the lid is placed from that edge upward.
  const hinge = new THREE.Group();
  hinge.position.set(0, BASE_T + 0.016, -D / 2 + 0.01);
  group.add(hinge);

  const lidGeo = slab(W, D, LID_T, 0.12, 0.008);
  lidGeo.translate(0, D / 2, -LID_T / 2);
  hinge.add(new THREE.Mesh(lidGeo, metal));

  const bezel = new THREE.Mesh(panel(W - 0.02, D - 0.02, 0.112), new THREE.MeshStandardMaterial({ color: 0x050506, metalness: 0.1, roughness: 0.3 }));
  bezel.position.set(0, D / 2, 0.001);
  hinge.add(bezel);

  let view = 0.42;
  const page = loadTexture('img/tlperf-page.webp', () => {
    // The screen shows a 16:10 window of the tall capture.
    view = page.image.width / 1.6 / page.image.height;
    display.uniforms.view.value.set(1, view, 0, 1 - view);
    onReady();
  });
  const display = screenMaterial(page, loadTexture('img/tlperf-page-soft.webp', onDetail));
  display.uniforms.size.value.set(SCREEN_W, SCREEN_H);
  display.uniforms.corner.value = 0.012;
  display.uniforms.view.value.set(1, view, 0, 1 - view);
  const screen = new THREE.Mesh(panel(SCREEN_W, SCREEN_H, 0.035), display);
  screen.position.set(0, D / 2 + 0.03, 0.002);
  hinge.add(screen);

  const camera = new THREE.Mesh(new THREE.CircleGeometry(0.011, 20), new THREE.MeshBasicMaterial({ color: 0x15191f }));
  camera.position.set(0, D - 0.052, 0.0025);
  hinge.add(camera);

  const glass = new THREE.Mesh(panel(W - 0.02, D - 0.02, 0.112), glassMaterial());
  glass.position.set(0, D / 2, 0.004);
  hinge.add(glass);

  // What the screen gives off: a light on the keys, and a faint pool on the floor around the base.
  const glow = new THREE.SpotLight(0xffffff, 0, 0, 1.15, 1, 1.2);
  glow.position.set(0, D * 0.5, 0.5);
  const aim = new THREE.Object3D();
  aim.position.set(0, BASE_T, 0.1);
  group.add(aim);
  glow.target = aim;
  hinge.add(glow);

  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 2.2, D * 2.3),
    new THREE.MeshBasicMaterial({ map: poolTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }),
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = -0.008;
  pool.renderOrder = -1;
  group.add(pool);

  const corner = new THREE.Vector3();
  const cool = new THREE.Color(0x9aa2ad);
  const cream = new THREE.Color(0xf1e5cd);
  const state = { power: 0, scroll: 0 };
  // The capture opens on a dark hero and scrolls into a cream section: the screen gets brighter.
  const light = () => {
    const bright = Math.min(Math.max(0.08 + state.scroll * 1.11, 0), 1);
    glow.color.lerpColors(cool, cream, bright);
    glow.intensity = state.power * (0.9 + bright * 3.4);
    pool.material.opacity = 0.035 + state.power * (0.02 + bright * 0.05);
  };

  return {
    group,
    // 0: closed on the keyboard. 1: open, leaning a little past upright.
    setOpen(amount) { hinge.rotation.x = Math.PI / 2 + (-0.26 - Math.PI / 2) * amount; },
    // 0: screen off. 1: full brightness.
    setPower(amount) {
      display.uniforms.gain.value = amount;
      state.power = amount;
      light();
    },
    // 0: top of the page. 1: as far down as the capture has content.
    setScroll(amount) {
      display.uniforms.view.value.w = (1 - view) * (1 - amount * 0.82);
      state.scroll = amount;
      light();
    },
    // 0: black and white. 1: the site's own colours.
    setColour(amount) { display.uniforms.saturation.value = amount; },
    // No piece is singled out: called at the start of every frame.
    clear() { display.uniforms.onA.value = 0; display.uniforms.onB.value = 0; },
    // Singles out the piece of the page inside rect [u0, p0, u1, p1] (fractions across the page
    // and down the whole capture) by `amount`, 0 to 1, in slot 0 or 1. Returns its four corners
    // in the world (top left, top right, bottom right, bottom left), or null while it is not
    // wholly on screen.
    show(slot, rect, amount, out) {
      const [u0, p0, u1, p1] = rect;
      const top = 1 - (display.uniforms.view.value.w + view);
      const from = (p0 - top) / view;
      const to = (p1 - top) / view;
      if (amount <= 0.001 || state.power < 0.7 || from < 0.02 || to > 0.98) return null;
      const w = (u1 - u0) * SCREEN_W;
      const h = (to - from) * SCREEN_H;
      const x = ((u0 + u1) / 2 - 0.5) * SCREEN_W;
      const y = (0.5 - (from + to) / 2) * SCREEN_H;
      display.uniforms[slot ? 'spotB' : 'spotA'].value.set(x, y, w / 2, h / 2);
      display.uniforms[slot ? 'onB' : 'onA'].value = amount;
      screen.updateWorldMatrix(true, false);
      [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]].forEach(([cx, cy], i) => { out[i].copy(screen.localToWorld(corner.set(cx * w + x, cy * h + y, 0))); });
      return out;
    },
    // A point of the screen itself, as fractions across and down it: what the camera frames.
    glass(u, down, out) { return screen.localToWorld(out.set((u - 0.5) * SCREEN_W, (0.5 - down) * SCREEN_H, 0)); },
    // Where a point of the page is in the world right now: fractions across the page and down
    // the whole capture. Null while it is scrolled out of the screen, or the screen is off.
    point(u, p, out) {
      if (state.power < 0.7) return null;
      const top = 1 - (display.uniforms.view.value.w + view);
      const down = (p - top) / view;
      if (down < 0.04 || down > 0.96) return null;
      return screen.localToWorld(out.set((u - 0.5) * SCREEN_W, (0.5 - down) * SCREEN_H, 0));
    },
  };
}
