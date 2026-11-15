// The work stage: one WebGL canvas pinned behind the words, a phone for UKit and a laptop for
// TLPerf, filmed like products. Each act is one travel of the camera: from the whole object to
// close-ups on one part of the screen then the next, and back to the whole object (js/shots.js
// holds the path). The piece of screen a sentence is about stays in focus while the rest of the
// screen blurs (js/shapes.js); on a wide screen the sentence is set beside the object
// (js/finder.js). A line in the margin reads out the shot: lens, distance, turn.
// Everything here moves with the scroll and at its pace: nothing holds, nothing rushes, and
// nothing hijacks the scroll itself.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { update, span, lerp, released, RELEASE } from './scroll.js';
import { PHONE_KEYS, LAPTOP_KEYS, along, soft, landing } from './shots.js';
import { createPhone, PHONE_WIDTH, PHONE_HEIGHT, PHONE_MM } from './phone.js';
import { createLaptop, LAPTOP_WIDTH, LAPTOP_HEIGHT, LAPTOP_MM } from './laptop.js';
import { createFinder } from './finder.js';

const FOV = 30;
const CAMERA_Z = 5.2;
const VIEW_H = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
// What a full-frame camera would need to see as this one does: the lens named in the margin.
const LENS = Math.round(12 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));

// acts: where the scroll is in each act (js/acts.js).
// still: capture mode, where nothing floats and a frame is drawn on request.
// mono: the screens stay in black and white (kept to compare the two looks).
export function initStage({ acts, still, reduced, mono }) {
  const work = document.getElementById('work');
  const canvas = document.getElementById('stage');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null; // no WebGL: the page keeps its still captures
  }
  // From here the two acts are pinned (css/work.css); every measure on the page has moved.
  work.classList.add('is-live');
  update(true);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 40);
  camera.position.set(0, 0, CAMERA_Z);

  // A key light from the upper left and a rim from behind, so dark objects keep an edge on black.
  // No light from the front right: on the glass it would mirror straight into the camera when
  // the phone turns that way, and hide the screen.
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-2.5, 3, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 3.4);
  rim.position.set(3, 1.5, -3.5);
  scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.3));

  let dirty = true;
  let pending = 2;
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });
  const loaded = () => {
    dirty = true;
    pending -= 1;
    if (pending === 0) { draw(); resolveReady(); }
  };
  const refined = () => { dirty = true; };
  const phone = createPhone(loaded, refined);
  const laptop = createLaptop(loaded, refined);
  scene.add(phone.group, laptop.group);
  const finder = createFinder(document.getElementById('finder'));

  // The sentences that are about a piece of a screen: which act, when their chapter is read,
  // which piece (data-rect, see index.html), and on which side their words are set.
  const callouts = [...work.querySelectorAll('.callout[data-rect]')].map((el) => {
    const [from, to] = el.closest('.chapter').dataset.at.split(',').map(Number);
    return {
      from, to,
      onPhone: el.closest('.act').id === 'ukit',
      rect: el.dataset.rect.split(',').map(Number),
      text: el.textContent.trim(),
      side: el.dataset.side || 'right',
      more: el.classList.contains('callout--more'),
      corners: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
    };
  });
  // The line in the margin of each act that reads out the shot.
  const readout = { phone: document.querySelector('#ukit .act__data'), laptop: document.querySelector('#tlperf .act__data') };
  const shown = { phone: '', laptop: '' };
  const read = (name, group, millimetre) => {
    const metres = CAMERA_Z / group.scale.x / millimetre / 1000;
    const turn = Math.round(THREE.MathUtils.radToDeg(group.rotation.y));
    const text = `Lens ${LENS} mm. Distance ${metres.toFixed(2)} m. Turn ${turn < 0 ? '\u2212' : ''}${Math.abs(turn)}\u00b0.`;
    if (text !== shown[name]) { shown[name] = text; readout[name].textContent = text; }
  };

  // The stylesheet lays the words out differently from 900px up (css/work.css): the objects
  // follow the same switch.
  const wide = window.matchMedia('(min-width: 900px)');
  // travel: how many screens the phone's act is pinned for.
  const fit = { wide: false, viewW: 1, phone: 1, laptop: 1, travel: 2.8 };
  const first = document.getElementById('ukit');
  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fit.viewW = VIEW_H * camera.aspect;
    fit.wide = wide.matches;
    fit.travel = Math.max(first.offsetHeight / height - 1, 0.1);
    // The size of each object when it is seen whole; the close-ups zoom on it.
    fit.phone = fit.wide
      ? Math.min((VIEW_H * 0.76) / PHONE_HEIGHT, (fit.viewW * 0.25) / PHONE_WIDTH)
      : Math.min((VIEW_H * 0.56) / PHONE_HEIGHT, (fit.viewW * 0.64) / PHONE_WIDTH);
    fit.laptop = fit.wide
      ? Math.min((fit.viewW * 0.42) / LAPTOP_WIDTH, (VIEW_H * 0.5) / LAPTOP_HEIGHT)
      : Math.min((fit.viewW * 0.88) / LAPTOP_WIDTH, (VIEW_H * 0.4) / LAPTOP_HEIGHT);
    dirty = true;
  };

  // Moves the object so that the point `locate` finds on it lands at (fx, fy) of the frame.
  const aim = new THREE.Vector3();
  const frame = (group, locate, fx, fy) => {
    group.position.set(0, 0, 0);
    group.updateMatrixWorld(true);
    locate(aim);
    // A point nearer the camera than the plane of the page looks further from the centre.
    const depth = CAMERA_Z / (CAMERA_Z - aim.z);
    group.position.set(((fx - 0.5) * fit.viewW) / depth - aim.x, ((0.5 - fy) * VIEW_H) / depth - aim.y, 0);
  };

  const state = { phone: -1, laptop: -1 };

  // With reduced motion each object stands whole and still, and only shows while its own act
  // is pinned; the screens change in steps.
  function posePhone(at, time) {
    const g = phone.group;
    g.visible = reduced ? at > -0.6 && at < 1.12 : at > -1 && at < 1.97;
    if (!g.visible) return;
    const v = reduced ? Math.min(Math.max(at, 0), 1) : at;
    const enter = soft(span(v, -1, 0));
    const t = span(v, 0, 1);
    // Leaves as the words of its act do (js/acts.js): it starts up a little before the pin
    // ends and is at the pace of the scroll a little after.
    const exit = Math.min(released(v <= 1 ? (v - 1) * fit.travel : v - 1, RELEASE), 1);
    const float = reduced || still ? 0 : Math.sin(time * 0.0011) * 0.012;
    const keys = PHONE_KEYS[fit.wide ? 'wide' : 'narrow'];
    const look = reduced ? keys[0] : along(keys, t);
    // Enters showing its back and turns to face the reader; leaves upward, turning away.
    g.rotation.set(lerp(0.55, 0.12, enter) - exit * 0.5, reduced ? -0.3 : lerp(-2.9, look.ry, enter) + exit * 1.7, reduced ? 0 : float * 1.5);
    g.scale.setScalar(fit.phone * look.zoom * lerp(0.82, 1, enter));
    frame(g, (out) => phone.glass(look.u, look.v, out), look.fx, look.fy);
    g.position.y += lerp(-0.5, 0, enter) + exit * 3.4 + float;
    // The welcome page of the app while the phone comes in and the opening line is read, then
    // one screen per chapter (data-at in index.html).
    phone.setScreen(reduced
      ? (t < 0.1 ? 0 : t < 0.35 ? 1 : t < 0.67 ? 2 : 3)
      : soft(span(t, 0.09, 0.19)) + soft(span(t, 0.29, 0.41)) + soft(span(t, 0.61, 0.73)));
    // The app's colours come in as the phone turns to face the reader.
    phone.setColour(mono ? 0 : soft(span(v, -0.3, 0.16)));
  }

  function poseLaptop(at, time) {
    const g = laptop.group;
    g.visible = at > (reduced ? -0.12 : -1);
    if (!g.visible) return;
    const v = reduced ? 0.4 : at;
    // Comes up as the page does, at the pace of the scroll, slows into its place, and turns to
    // it on the way.
    const rise = landing(span(v, -1, 0));
    const enter = soft(rise);
    const t = span(v, 0, 1);
    const leave = span(v, 1, 2);
    const float = reduced || still ? 0 : Math.sin(time * 0.0009) * 0.008;
    const keys = LAPTOP_KEYS[fit.wide ? 'wide' : 'narrow'];
    const look = reduced ? keys[0] : along(keys, t);
    // Arrives closed, seen from above; opens as it settles.
    const settle = soft(span(t, 0, 0.3));
    laptop.setOpen(soft(span(t, 0, 0.3)) - leave * 0.25);
    laptop.setPower(span(t, 0.1, 0.3));
    laptop.setColour(mono ? 0 : 1);
    // The page runs down to the coach while the camera travels across the screen.
    laptop.setScroll(reduced ? 0 : soft(span(t, 0.58, 0.76)));
    g.rotation.set(lerp(0.62, 0.36, enter) - settle * 0.2, lerp(-0.75, -0.36, enter) + settle * 0.36 + look.ry, 0);
    g.scale.setScalar(fit.laptop * look.zoom);
    frame(g, (out) => laptop.glass(look.u, look.v, out), look.fx, look.fy);
    g.position.y += lerp(-2.6, 0, rise) + float;
  }

  function draw(time = performance.now()) {
    posePhone(state.phone, time);
    poseLaptop(state.laptop, time);
    // The piece of screen being talked about stays sharp; the rest of the screen goes out of focus.
    phone.clear();
    laptop.clear();
    const held = [];
    callouts.forEach((c) => {
      const v = c.onPhone ? state.phone : state.laptop;
      let p = reduced
        ? Number(v >= c.from && v < c.to)
        : soft(span(v, c.from + 0.02, c.from + 0.11)) * (1 - soft(span(v, c.to - 0.07, c.to - 0.012)));
      // The second sentence of a chapter is kept for wide screens.
      if (c.more && !fit.wide) p = 0;
      const slot = c.more ? 1 : 0;
      const quad = c.onPhone
        ? (phone.group.visible ? phone.show(slot, c.rect[0], c.rect.slice(1), p, c.corners) : null)
        : (laptop.group.visible ? laptop.show(slot, c.rect, p, c.corners) : null);
      if (quad) held.push([c, p]);
    });
    // The room turns a little with the scroll: reflections travel across the glass and the metal.
    if (scene.environmentRotation) scene.environmentRotation.y = (state.phone + state.laptop) * 0.5;
    renderer.render(scene, camera);
    dirty = false;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // Where each object ends on either side, at mid height: the sentences are set clear of it.
    const edge = (object, u) => (object.glass(u, 0.5, aim).project(camera).x * 0.5 + 0.5) * width;
    const reach = { phone: { left: edge(phone, -0.06), right: edge(phone, 1.06) }, laptop: { left: edge(laptop, -0.03), right: edge(laptop, 1.03) } };
    finder.draw(held.map(([c, p]) => ({
      quad: c.corners.map((corner) => { corner.project(camera); return [(corner.x * 0.5 + 0.5) * width, (0.5 - corner.y * 0.5) * height]; }),
      p,
      text: fit.wide ? c.text : null,
      side: c.side,
      reach: reach[c.onPhone ? 'phone' : 'laptop'][c.side],
    })));
    if (phone.group.visible) read('phone', phone.group, PHONE_MM);
    if (laptop.group.visible) read('laptop', laptop.group, LAPTOP_MM);
  }

  acts.on('ukit', (v) => { state.phone = v; dirty = true; });
  acts.on('tlperf', (v) => { state.laptop = v; dirty = true; });

  resize();
  new ResizeObserver(resize).observe(canvas);

  // Render only when something changed, or while the section is on screen and the objects float.
  let onScreen = false;
  new IntersectionObserver((entries) => { onScreen = entries[0].isIntersecting; }).observe(work);
  const loop = (time) => {
    if (dirty || (onScreen && !reduced && !still && pending === 0)) draw(time);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  return ready.then(() => ({ draw }));
}
