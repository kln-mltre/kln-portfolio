// The UKit phone: an iPhone 13 Pro, built from primitives to its real dimensions, so that the
// app sits in it as it does in the hand. No model file to download.
//   body 71.5 x 146.7 x 7.65 mm; display 64.6 x 139.8 mm (390 x 844 points), corners of 47.33
//   points; the black border is what is left, 3.45 mm all round; the notch is about 26.8 x 5.5 mm.
// tools/screens.py lays the screens out for that display (status bar either side of the notch).
import * as THREE from 'three';
import { slab, panel, roundedRect, glassMaterial, screenMaterial, loadTexture } from './shapes.js';

const MM = 0.774 / 71.5; // one millimetre in scene units: the phone keeps the width it had
const BODY_W = 71.5 * MM;
const BODY_H = 146.7 * MM;
const DEPTH = 7.65 * MM;
const SCREEN_W = 64.6 * MM;
const SCREEN_H = 139.8 * MM;
const BORDER = (BODY_W - SCREEN_W) / 2;
const SCREEN_R = 7.84 * MM;
const BODY_R = SCREEN_R + BORDER;
const NOTCH_W = 26.8 * MM;
const NOTCH_H = 5.5 * MM;

export const PHONE_MM = MM;
export const PHONE_WIDTH = BODY_W;
export const PHONE_HEIGHT = BODY_H;
export const PHONE_SCREENS = 3;

// The notch: a tab hanging from the top edge of the display, flared where it meets the edge.
function notchShape() {
  const top = SCREEN_H / 2;
  const half = NOTCH_W / 2;
  const flare = 0.9 * MM;
  const round = 2.4 * MM;
  const foot = top - NOTCH_H;
  const s = new THREE.Shape();
  s.moveTo(-half - flare, top + BORDER * 0.6);
  s.lineTo(-half - flare, top);
  s.quadraticCurveTo(-half, top, -half, top - flare);
  s.lineTo(-half, foot + round);
  s.quadraticCurveTo(-half, foot, -half + round, foot);
  s.lineTo(half - round, foot);
  s.quadraticCurveTo(half, foot, half, foot + round);
  s.lineTo(half, top - flare);
  s.quadraticCurveTo(half, top, half + flare, top);
  s.lineTo(half + flare, top + BORDER * 0.6);
  s.closePath();
  return new THREE.ShapeGeometry(s, 12);
}

// A rear camera: a steel ring, dark glass, and the bright rings of the optics inside it.
// The back faces -z, so what is flat on it is turned to look that way.
function lens(steel, x, y, z) {
  const group = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x06070a, metalness: 0.6, roughness: 0.05, clearcoat: 1 });
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(7.8 * MM, 7.8 * MM, 2.6 * MM, 56), steel);
  const eye = new THREE.Mesh(new THREE.CylinderGeometry(6.5 * MM, 6.5 * MM, 2.9 * MM, 56), glass);
  ring.rotation.x = Math.PI / 2;
  eye.rotation.x = Math.PI / 2;
  const flat = (geometry, colour, depth) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: colour, metalness: 1, roughness: 0.22 }));
    mesh.rotation.y = Math.PI;
    mesh.position.z = -depth * MM;
    return mesh;
  };
  group.add(ring, eye, flat(new THREE.RingGeometry(3.6 * MM, 4.9 * MM, 40), 0x22262d, 1.47), flat(new THREE.CircleGeometry(2.3 * MM, 32), 0x101a2a, 1.48));
  group.position.set(x, y, z);
  return group;
}

// onReady: the screens are in. onDetail: something that only refines the picture has arrived.
export function createPhone(onReady, onDetail) {
  const group = new THREE.Group();

  // Graphite: a dark polished steel band, black glass in front, frosted dark glass behind.
  const steel = new THREE.MeshStandardMaterial({ color: 0x4a4a4d, metalness: 1, roughness: 0.2 });
  const black = new THREE.MeshPhysicalMaterial({ color: 0x030303, metalness: 0, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });
  const frosted = new THREE.MeshPhysicalMaterial({ color: 0x3a3b3f, metalness: 0.25, roughness: 0.6 });
  const dark = new THREE.MeshBasicMaterial({ color: 0x000000 });
  group.add(new THREE.Mesh(slab(BODY_W, BODY_H, DEPTH, BODY_R, 0.5 * MM), [black, steel]));

  const backGlass = new THREE.Mesh(panel(BODY_W - 1.2 * MM, BODY_H - 1.2 * MM, BODY_R - 0.6 * MM), frosted);
  backGlass.rotation.y = Math.PI;
  backGlass.position.z = -DEPTH / 2 - 0.0006;
  group.add(backGlass);

  // The three app screens sit side by side in one image; sliding the window swipes between them.
  const texture = loadTexture('img/ukit-screens.jpg', onReady);
  const display = screenMaterial(texture, loadTexture('img/ukit-screens-soft.jpg', onDetail));
  display.uniforms.size.value.set(SCREEN_W, SCREEN_H);
  display.uniforms.corner.value = 2.6 * MM;
  display.uniforms.view.value.set(1 / PHONE_SCREENS, 1, 0, 0);
  // The app is dark by design; lifted a little so it reads as a lit screen.
  display.uniforms.gain.value = 1.2;
  const screen = new THREE.Mesh(panel(SCREEN_W, SCREEN_H, SCREEN_R), display);
  screen.position.z = DEPTH / 2 + 0.0012;
  group.add(screen);

  const notch = new THREE.Mesh(notchShape(), dark);
  notch.position.z = DEPTH / 2 + 0.0018;
  group.add(notch);
  // In the notch, the front camera; above it, in the border, the slit of the earpiece.
  const camera = new THREE.Mesh(new THREE.CircleGeometry(1.7 * MM, 28), new THREE.MeshBasicMaterial({ color: 0x0a0f18 }));
  camera.position.set(7.4 * MM, SCREEN_H / 2 - NOTCH_H / 2, DEPTH / 2 + 0.0021);
  const glint = new THREE.Mesh(new THREE.CircleGeometry(0.5 * MM, 14), new THREE.MeshBasicMaterial({ color: 0x1f2a3c }));
  glint.position.set(7 * MM, SCREEN_H / 2 - NOTCH_H / 2 + 0.4 * MM, DEPTH / 2 + 0.0023);
  const earpiece = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(9.5 * MM, 0.8 * MM, 0.4 * MM), 6), new THREE.MeshBasicMaterial({ color: 0x151517 }));
  earpiece.position.set(0, SCREEN_H / 2 + BORDER * 0.52, DEPTH / 2 + 0.0021);
  group.add(camera, glint, earpiece);

  const glass = new THREE.Mesh(panel(BODY_W - 1 * MM, BODY_H - 1 * MM, BODY_R - 0.5 * MM), glassMaterial());
  glass.position.z = DEPTH / 2 + 0.0028;
  group.add(glass);

  // Back: the camera plateau, 36.5 x 37.8 mm, in the corner that is top left when seen from behind.
  const plateauX = BODY_W / 2 - (3.3 + 18.25) * MM;
  const plateauY = BODY_H / 2 - (3.3 + 18.9) * MM;
  const plateau = new THREE.Mesh(slab(36.5 * MM, 37.8 * MM, 1.7 * MM, 9.2 * MM, 0.4 * MM),
    [new THREE.MeshPhysicalMaterial({ color: 0x3e3f43, metalness: 0.3, roughness: 0.28, clearcoat: 0.6 }), steel]);
  plateau.position.set(plateauX, plateauY, -DEPTH / 2 - 0.6 * MM);
  group.add(plateau);
  const lensZ = -DEPTH / 2 - 1.9 * MM;
  // Seen from behind: two lenses down the left, one on the right; from the model's side, mirrored.
  group.add(
    lens(steel, plateauX + 8.6 * MM, plateauY + 9.3 * MM, lensZ),
    lens(steel, plateauX + 8.6 * MM, plateauY - 9.3 * MM, lensZ),
    lens(steel, plateauX - 8.9 * MM, plateauY, lensZ),
  );
  const dot = (radius, colour, x, y) => {
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius * MM, 24), new THREE.MeshBasicMaterial({ color: colour }));
    mesh.rotation.y = Math.PI;
    mesh.position.set(plateauX + x * MM, plateauY + y * MM, -DEPTH / 2 - 1.48 * MM);
    group.add(mesh);
  };
  dot(2.8, 0xd8d4c8, -9.3, 12.3);  // flash
  dot(2.2, 0x0b0b0d, -9.3, -12.3); // LiDAR

  // The band's buttons: side button on the right; ring switch and two volume keys on the left.
  const key = (side, y, tall) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.9 * MM, tall * MM, 2.9 * MM), steel);
    mesh.position.set(side * (BODY_W / 2 + 0.2 * MM), y * MM, 0);
    group.add(mesh);
  };
  key(1, 23, 17.5);
  key(-1, 40.5, 5.6);
  key(-1, 27, 9.6);
  key(-1, 14, 9.6);
  const port = new THREE.Mesh(new THREE.BoxGeometry(8.2 * MM, 0.4 * MM, 2.6 * MM), dark);
  port.position.set(0, -BODY_H / 2 - 0.05 * MM, 0);
  group.add(port);

  let shown = 0;
  const corner = new THREE.Vector3();
  return {
    group,
    // No piece is singled out: called at the start of every frame.
    clear() { display.uniforms.onA.value = 0; display.uniforms.onB.value = 0; },
    // Singles out the piece of screen `index` inside rect [u0, v0, u1, v1] (fractions of that
    // screen, v from the top) by `amount`, 0 to 1, in slot 0 or 1. Returns its four corners in
    // the world (top left, top right, bottom right, bottom left), or null while it is not wholly
    // on the glass.
    show(slot, index, rect, amount, out) {
      const [u0, v0, u1, v1] = rect;
      const shift = index - shown;
      if (amount <= 0.001 || u0 + shift < 0.01 || u1 + shift > 0.99) return null;
      const w = (u1 - u0) * SCREEN_W;
      const h = (v1 - v0) * SCREEN_H;
      const x = ((u0 + u1) / 2 + shift - 0.5) * SCREEN_W;
      const y = (0.5 - (v0 + v1) / 2) * SCREEN_H;
      display.uniforms[slot ? 'spotB' : 'spotA'].value.set(x, y, w / 2, h / 2);
      display.uniforms[slot ? 'onB' : 'onA'].value = amount;
      screen.updateWorldMatrix(true, false);
      [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]].forEach(([cx, cy], i) => { out[i].copy(screen.localToWorld(corner.set(cx * w + x, cy * h + y, 0))); });
      return out;
    },
    // 0, 1, 2 are the screens; values in between are mid-swipe.
    setScreen(position) {
      shown = Math.min(Math.max(position, 0), PHONE_SCREENS - 1);
      display.uniforms.view.value.z = shown / PHONE_SCREENS;
    },
    // 0: black and white. 1: the app's own colours.
    setColour(amount) { display.uniforms.saturation.value = amount; },
    // A point of the glass itself, as fractions across and down it: what the camera frames.
    glass(u, v, out) { return screen.localToWorld(out.set((u - 0.5) * SCREEN_W, (0.5 - v) * SCREEN_H, 0)); },
    // Where a point of one app screen is in the world right now: the screen's index, then
    // fractions across and down it. Null while that screen is swiped out of view.
    point(index, u, v, out) {
      const across = u + index - shown;
      if (across < 0.03 || across > 0.97) return null;
      return screen.localToWorld(out.set((across - 0.5) * SCREEN_W, (0.5 - v) * SCREEN_H, 0));
    },
  };
}
