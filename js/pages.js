// The typographic pages: the rules that draw themselves, the counter, the flash photograph.
import { track, entering, span, easeInOut, easeOut } from './scroll.js';

// The hairline of each section label draws itself across the page as the label comes into
// view. It is the one entrance on the page: the words themselves do not move in.
function initLabels() {
  document.querySelectorAll('.label').forEach((el) => track(el, entering(el, 0.98, 0.6), null, { ease: 0.12 }));
}

// The counter: each digit sits on a reel; the further right, the more turns it makes. The figure
// is written in the page; the reels take its place.
function initCounter() {
  const figure = document.querySelector('.count__figure');
  const holder = figure.querySelector('.count__digits');
  const target = holder.textContent.trim();
  holder.textContent = '';
  const reels = [];
  let order = 0;
  [...target].forEach((ch) => {
    if (!/\d/.test(ch)) { holder.append(ch); return; }
    const steps = order === 0 ? Number(ch) : order * 10 + Number(ch);
    const reel = document.createElement('span');
    reel.className = 'reel';
    const strip = document.createElement('span');
    strip.className = 'reel__strip';
    for (let i = 0; i <= steps; i += 1) {
      const cell = document.createElement('i');
      cell.textContent = String(((Number(ch) - steps + i) % 10 + 10) % 10);
      strip.append(cell);
    }
    reel.append(strip);
    holder.append(reel);
    reels.push({ strip, steps });
    order += 1;
  });
  track(figure, entering(figure, 0.92, 0.3), (p) => {
    const turn = easeInOut(span(p, 0, 0.82));
    reels.forEach(({ strip, steps }) => strip.style.setProperty('--roll', (turn * steps).toFixed(3)));
    figure.style.setProperty('--plus', span(p, 0.78, 0.9).toFixed(3));
  }, { write: null });
}

// The flash photograph: lit once, when enough of it is on screen.
// Returns flash(ms): in capture mode, sets the moment by hand (null: simply lit once reached).
function initShot({ manual, reduced }) {
  const figure = document.getElementById('shot');
  const burst = figure.querySelector('.shot__flash');
  track(figure, entering(figure, 1, 0.1));
  const reached = () => figure.getBoundingClientRect().top < window.innerHeight * 0.6;
  if (manual) {
    return (ms) => {
      if (ms === null) {
        figure.style.removeProperty('--r');
        burst.style.opacity = '';
        figure.classList.toggle('is-lit', reached());
        return;
      }
      // The same curves as the stylesheet, set at one instant.
      figure.classList.remove('is-lit');
      figure.style.setProperty('--r', (-24 + easeInOut(span(ms, 200, 2600)) * 174).toFixed(2));
      burst.style.opacity = (ms < 68 ? ms / 68 : 1 - easeOut(span(ms, 68, 750))).toFixed(3);
    };
  }
  if (reduced) {
    // No flash: the colour is simply there once the picture has been reached.
    const check = () => { if (reached()) figure.classList.add('is-lit'); };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return check;
  }
  // It fires once more than half of the picture has risen above the lower part of the screen:
  // by then the eye is on it.
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    // A fast flick can jump past the threshold: a picture already above the screen counts too.
    if ((entry.isIntersecting && entry.intersectionRatio >= 0.55) || entry.boundingClientRect.top < 0) {
      figure.classList.add('is-lit');
      observer.disconnect();
    }
  }, { rootMargin: '0px 0px -28% 0px', threshold: [0, 0.55] });
  observer.observe(figure);
  return () => {};
}

export function initPages(options) {
  initLabels();
  initCounter();
  return { flash: initShot(options) };
}
