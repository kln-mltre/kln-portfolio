// Capture mode, for the scripts in tools/. A normal visit never loads this file.
// ?shot=<scroll px> freezes the page at a position, ?enter=<ms> freezes the arrival on the cover
// at a moment, &flash=<ms> freezes the flash photograph that long after it fired. tools/film.py
// then drives the same state frame after frame through window.__film.go().
import { update } from './scroll.js';
import { ARRIVED } from './cover.js';

export async function initCapture({ params, cover, pages, stage, brain }) {
  const root = document.documentElement;
  const figure = document.getElementById('shot');

  // Fonts change every measure on the page: nothing is settled before they are in.
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((resolve) => { window.addEventListener('load', resolve, { once: true }); });
  const [, , scene, plate] = await Promise.all([fonts, loaded, stage, brain]);
  update(true);

  // Two animation frames, or a short wait where the browser hands none out (a framed page under
  // virtual time).
  const painted = () => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
    setTimeout(resolve, 60);
  });
  const number = (value) => (value === null || value === undefined ? null : Number(value));

  // The whole state of the page for one picture. enterAt: milliseconds into the arrival on the
  // cover (null: arrived). flashAt: milliseconds after the flash photograph fired.
  async function go({ y = 0, enterAt = null, flashAt = null } = {}) {
    cover.enter(enterAt);
    window.scrollTo(0, y);
    update(true);
    pages.flash(flashAt);
    if (scene) scene.draw();
    if (plate) plate.draw();
    await painted();
  }

  await go({ y: number(params.get('shot')) || 0, enterAt: number(params.get('enter')), flashAt: number(params.get('flash')) });

  const tops = [...document.querySelectorAll('section[id], article[id]')].map((el) => [el.id, Math.round(el.getBoundingClientRect().top + window.scrollY)]);
  const frame = figure.getBoundingClientRect();
  const map = {
    height: root.scrollHeight,
    // The scroll position at which the flash photograph fires: 55 % of it above the lower 28 %
    // of the screen (the same rule as the observer in js/pages.js), or the end of the page.
    flash: Math.round(Math.min(frame.top + window.scrollY + frame.height * 0.55 - window.innerHeight * 0.72, root.scrollHeight - window.innerHeight)),
    // How long the arrival on the cover lasts.
    arrival: ARRIVED,
    ...Object.fromEntries(tops),
  };
  window.__film = { go, map };
  // tools/frame.html relays the map to tools/map.sh.
  window.parent.postMessage({ map }, '*');
  document.title = 'ready';
}
