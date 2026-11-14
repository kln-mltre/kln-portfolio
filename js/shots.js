// The path of the camera through each act of the work stage, and the pace it is travelled at.
//
// A key is what the camera sees when the scroll is `at` (a fraction of the act). zoom: on the
// object's fitted size. u, v: the point of the screen being looked at, across and down. fx, fy:
// where that point sits in the frame. ry: how far the object is turned.
//
// Between two keys the view never holds and never rushes: every value follows the scroll along
// a curve that passes through the keys without overshooting them. The object moves when the
// reader scrolls, as fast as they scroll, and stops when they stop. The first pacing held each
// shot and eased from one to the next in a tenth of the act: the same travel packed in a
// burst, seven times faster at its peak, which read as the page taking the wheel.
//
// A close-up is reached halfway through its chapter (data-at in index.html).
import { clamp } from './scroll.js';

const VALUES = ['zoom', 'u', 'v', 'fx', 'fy', 'ry'];

export const PHONE_KEYS = {
  narrow: [
    { at: 0, zoom: 1, u: 0.5, v: 0.5, fx: 0.5, fy: 0.45, ry: -0.36 },
    { at: 0.21, zoom: 1.5, u: 0.5, v: 0.27, fx: 0.5, fy: 0.36, ry: -0.1 },
    { at: 0.515, zoom: 1.5, u: 0.5, v: 0.36, fx: 0.5, fy: 0.37, ry: 0.07 },
    { at: 0.79, zoom: 1.45, u: 0.5, v: 0.33, fx: 0.5, fy: 0.37, ry: 0.13 },
    { at: 1, zoom: 1, u: 0.5, v: 0.5, fx: 0.5, fy: 0.45, ry: 0.3 },
  ],
  wide: [
    { at: 0, zoom: 1, u: 0.5, v: 0.5, fx: 0.58, fy: 0.5, ry: -0.36 },
    { at: 0.21, zoom: 1.3, u: 0.5, v: 0.3, fx: 0.58, fy: 0.43, ry: -0.14 },
    { at: 0.515, zoom: 1.3, u: 0.5, v: 0.42, fx: 0.6, fy: 0.47, ry: 0.1 },
    { at: 0.79, zoom: 1.3, u: 0.5, v: 0.42, fx: 0.58, fy: 0.47, ry: -0.1 },
    { at: 1, zoom: 1, u: 0.5, v: 0.5, fx: 0.58, fy: 0.5, ry: 0.3 },
  ],
};

// For the laptop the point is on its screen (v: 1 is the hinge), whatever the page shows. The
// camera waits for the lid to be most of the way up before it starts in.
export const LAPTOP_KEYS = {
  narrow: [
    { at: 0, zoom: 1, u: 0.5, v: 1, fx: 0.5, fy: 0.55, ry: 0 },
    { at: 0.24, zoom: 1, u: 0.5, v: 1, fx: 0.5, fy: 0.55, ry: 0 },
    { at: 0.53, zoom: 1.9, u: 0.32, v: 0.45, fx: 0.5, fy: 0.36, ry: 0.09 },
    { at: 0.79, zoom: 1.9, u: 0.62, v: 0.5, fx: 0.5, fy: 0.36, ry: -0.07 },
    { at: 1, zoom: 1, u: 0.5, v: 1, fx: 0.5, fy: 0.55, ry: 0 },
  ],
  wide: [
    { at: 0, zoom: 1, u: 0.5, v: 1, fx: 0.64, fy: 0.72, ry: -0.14 },
    { at: 0.24, zoom: 1, u: 0.5, v: 1, fx: 0.64, fy: 0.72, ry: -0.14 },
    { at: 0.53, zoom: 1.36, u: 0.42, v: 0.5, fx: 0.62, fy: 0.5, ry: -0.05 },
    { at: 0.79, zoom: 1.3, u: 0.5, v: 0.5, fx: 0.57, fy: 0.5, ry: 0.03 },
    { at: 1, zoom: 1, u: 0.5, v: 1, fx: 0.64, fy: 0.72, ry: -0.14 },
  ],
};

// A move that has to start and to end inside the act (a lid, a swipe of the screen): it leaves
// and arrives without a jolt, and at its fastest goes half as fast again as the scroll.
export const soft = (t) => t * t * (3 - 2 * t);

// A piece that comes up with the page and has to stop in its place: at the pace of the scroll
// until the last stretch, where it slows down instead of hitting the stop.
export const landing = (t, stretch = 0.35) => {
  const left = 1 - t;
  return 1 - (left < stretch ? (left * left) / (2 * stretch) : left - stretch / 2) / (1 - stretch / 2);
};

// The slope of each value at each key: zero where the value turns back, and otherwise weighted
// towards the gentler of the two slopes around the key, which is what keeps the curve from
// overshooting (a monotone cubic, after Fritsch and Carlson).
const slopes = new WeakMap();
function slopesOf(keys) {
  if (slopes.has(keys)) return slopes.get(keys);
  const last = keys.length - 1;
  const all = {};
  VALUES.forEach((name) => {
    const step = [];
    const rate = [];
    for (let i = 0; i < last; i += 1) {
      step.push(keys[i + 1].at - keys[i].at);
      rate.push((keys[i + 1][name] - keys[i][name]) / step[i]);
    }
    const slope = new Array(keys.length).fill(0);
    // It sets off with the scroll, and comes to rest on the last key: the release of the act
    // takes over from there (released, js/scroll.js).
    slope[0] = rate[0];
    for (let i = 1; i < last; i += 1) {
      if (rate[i - 1] * rate[i] > 0) {
        const before = 2 * step[i] + step[i - 1];
        const after = step[i] + 2 * step[i - 1];
        slope[i] = (before + after) / (before / rate[i - 1] + after / rate[i]);
      }
    }
    all[name] = slope;
  });
  slopes.set(keys, all);
  return all;
}

// What the camera sees at t, a fraction of the act.
export function along(keys, t) {
  const slope = slopesOf(keys);
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].at) i += 1;
  const from = keys[i];
  const to = keys[i + 1];
  const step = to.at - from.at;
  const s = clamp((t - from.at) / step);
  const s2 = s * s;
  const s3 = s2 * s;
  const view = {};
  VALUES.forEach((name) => {
    view[name] = (2 * s3 - 3 * s2 + 1) * from[name] + (s3 - 2 * s2 + s) * step * slope[name][i]
      + (3 * s2 - 2 * s3) * to[name] + (s3 - s2) * step * slope[name][i + 1];
  });
  return view;
}
