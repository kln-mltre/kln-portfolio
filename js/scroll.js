// Scroll engine. Native scrolling is left alone; what moves on screen follows a progress value
// smoothed just enough for a wheel notch not to show as a jump. The smoothing is counted in
// time, not in frames: it is the same on a 60 Hz phone and a 144 Hz screen.

const items = [];
let snap = false;
let lastY = -1;
let lastH = -1;
let lastTime = 0;
let settled = false;

export const clamp = (v, lo = 0, hi = 1) => Math.min(Math.max(v, lo), hi);
// Progress of p inside the window [a, b], clamped. Works with a > b too.
export const span = (p, a, b) => clamp((p - a) / (b - a));
export const easeOut = (t) => 1 - (1 - t) ** 3;
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const lerp = (a, b, t) => a + (b - a) * t;

// The end of a pin, softened. A pinned piece goes from still to the full pace of the page at
// once; here that change is spread over `a` on either side of it. x: how far the scroll is past
// the end of the pin (negative before it). Returns how far the piece has travelled: nothing
// until -a, then more and more, and exactly the pace of the page from +a on.
export const RELEASE = 0.32;    // the stretch on either side, in viewport heights
export const released = (x, a) => (x <= -a ? 0 : x >= a ? x : (x + a) ** 2 / (4 * a));

// Capture mode: no smoothing, every value sits on its target.
export function setSnap(value) { snap = value; }

// measure(viewportHeight) returns the raw progress, kept within [min, max]; fn(value) applies it.
// `write` names the custom property set on `el` with the smoothed value. `ease` is the share of
// the way to the target covered in a sixtieth of a second: 0.2 trails the scroll by 75 ms.
export function track(el, measure, fn, { write = '--p', ease = 0.2, min = 0, max = 1 } = {}) {
  const item = { el, measure, fn, write, ease, min, max, value: 0, target: 0, fresh: true };
  items.push(item);
  settled = false;
  return item;
}

// The element's top edge travels from `from` to `to` (fractions of the viewport height).
export const entering = (el, from = 0.92, to = 0.5) => (vh) =>
  (from * vh - el.getBoundingClientRect().top) / ((from - to) * vh);
// A tall element with a pinned child: 0 when its top reaches the top, 1 when its bottom reaches the bottom.
// Below 0 it counts the approach in viewport heights; above 1, the departure.
export const pinned = (el) => (vh) => {
  const r = el.getBoundingClientRect();
  if (r.top > 0) return -r.top / vh;
  const travel = Math.max(r.height - vh, 1);
  if (-r.top <= travel) return -r.top / travel;
  return 1 + (-r.top - travel) / vh;
};

export function update(force = false) {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const now = performance.now();
  const frames = Math.min(now - lastTime, 50) / (1000 / 60);
  lastTime = now;
  if (!force && settled && y === lastY && vh === lastH) return;
  lastY = y;
  lastH = vh;

  // All the layout reads first, then all the writes.
  for (const it of items) it.raw = it.measure(vh);

  settled = true;
  for (const it of items) {
    it.target = clamp(Number.isFinite(it.raw) ? it.raw : 0, it.min, it.max);
    let next = snap || it.fresh ? it.target : it.value + (it.target - it.value) * (1 - (1 - it.ease) ** frames);
    if (Math.abs(it.target - next) < 0.0004) next = it.target;
    else settled = false;
    if (next === it.value && !it.fresh) continue;
    it.value = next;
    it.fresh = false;
    if (it.el && it.write) it.el.style.setProperty(it.write, next.toFixed(4));
    if (it.fn) it.fn(next);
  }
}

export function start() {
  const loop = () => {
    update();
    requestAnimationFrame(loop);
  };
  window.addEventListener('resize', () => update(true));
  update(true);
  requestAnimationFrame(loop);
}
