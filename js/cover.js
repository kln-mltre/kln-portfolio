// The cover: the words arrive on a photograph that is already there, then three planes shift
// against each other, with the scroll and with the pointer.
import { track, lerp, span } from './scroll.js';

// When each part starts to arrive and how long it takes, in milliseconds.
const NAME = [0, 1500];
const BAR = [300, 900];
const LINE = [480, 1000];
const ROW = [600, 900, 90];   // first row, duration, then each next row this much later
const CREDIT = [950, 900];
export const ARRIVED = 2100;

const expo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

// manual: capture mode. The arrival does not play; enter(ms) sets it at a moment (null: arrived).
export function initCover({ reduced, manual }) {
  const cover = document.querySelector('.cover');
  const parts = [
    [cover.querySelector('.cover__name'), ...NAME],
    [document.getElementById('bar'), ...BAR],
    [cover.querySelector('.cover__line'), ...LINE],
    ...[...cover.querySelectorAll('.cover__proofs .row')].map((row, index) => [row, ROW[0] + index * ROW[2], ROW[1]]),
    [cover.querySelector('.cover__credit'), ...CREDIT],
  ];
  const enter = (ms) => parts.forEach(([el, start, length]) => {
    el.style.setProperty('--k', ms === null ? '1' : expo(span(ms - start, 0, length)).toFixed(4));
  });

  if (reduced) { enter(null); return { enter }; }

  // --s: 0 with the cover in place, 1 once a full screen of the next page has slid over it.
  track(cover, (vh) => window.scrollY / vh, null, { write: '--s' });
  if (manual) { enter(null); return { enter }; }

  enter(0);
  let startTime = 0;
  const tick = (now) => {
    if (!startTime) startTime = now;
    const t = now - startTime;
    if (t >= ARRIVED) { enter(null); return; }
    enter(t);
    requestAnimationFrame(tick);
  };
  // The name is type: wait for the face it is set in, but never more than a moment.
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise((r) => setTimeout(r, 900))]).then(() => {
    requestAnimationFrame(tick);
    // A tab opened in the background gets no animation frames: the words must still arrive.
    setTimeout(() => enter(null), ARRIVED + 2500);
  });

  // Pointer parallax, only where there is a pointer to follow.
  if (!window.matchMedia('(pointer: fine)').matches) return { enter };
  const aim = { x: 0, y: 0 };
  const now = { x: 0, y: 0 };
  let running = false;
  const step = () => {
    now.x = lerp(now.x, aim.x, 0.07);
    now.y = lerp(now.y, aim.y, 0.07);
    cover.style.setProperty('--mx', now.x.toFixed(4));
    cover.style.setProperty('--my', now.y.toFixed(4));
    running = Math.abs(aim.x - now.x) + Math.abs(aim.y - now.y) > 0.002;
    if (running) requestAnimationFrame(step);
  };
  window.addEventListener('pointermove', (event) => {
    if (window.scrollY > window.innerHeight) return;
    aim.x = (event.clientX / window.innerWidth) * 2 - 1;
    aim.y = (event.clientY / window.innerHeight) * 2 - 1;
    if (!running) { running = true; requestAnimationFrame(step); }
  }, { passive: true });
  return { enter };
}
