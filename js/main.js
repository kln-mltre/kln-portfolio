// Entry point. Everything on the page reads without this file; it only sets things in motion.
import { start, setSnap } from './scroll.js';
import { initCover } from './cover.js';
import { initPages } from './pages.js';
import { initBar } from './bar.js';
import { initActs } from './acts.js';

const params = new URLSearchParams(window.location.search);
// Capture mode (see js/capture.js): nothing is smoothed, nothing plays by itself.
const capture = ['shot', 'enter', 'film'].some((key) => params.has(key));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

if (capture) {
  root.classList.add('is-shot');
  setSnap(true);
  // A capture cannot wait for an image to scroll into view.
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
}
// LABO nom: ?nom=creux shows the name of the cover drawn in one line (css/cover.css).
if (params.get('nom') === 'creux') root.classList.add('nom-creux');
// A reload must not open halfway down the page.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

const cover = initCover({ reduced, manual: capture });
const pages = initPages({ manual: capture, reduced });
initBar();
const acts = initActs({ reduced });

start();

// The two heavier parts arrive on their own: the page must be readable before them.
// ?no3d shows the page as it stands without WebGL; ?mono keeps the two screens in black and white.
const stage = params.has('no3d')
  ? Promise.resolve(null)
  : import('./stage.js')
    .then((module) => module.initStage({ acts, still: capture, reduced, mono: params.has('mono') }))
    .catch(() => null);
const brain = import('./brain.js')
  .then((module) => module.initBrain({ acts, still: capture, reduced }))
  .catch(() => null);

if (capture) import('./capture.js').then((module) => module.initCapture({ params, cover, pages, stage, brain }));
