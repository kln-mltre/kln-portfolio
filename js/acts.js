// The pinned acts. Each one reports how far the scroll is through it, lights the chapter being
// read and fills its progress rule. The 3D stage and the graph listen to the same value.
import { track, pinned, span, easeOut, released, RELEASE } from './scroll.js';

export function initActs({ reduced = false } = {}) {
  const listeners = new Map();
  const values = new Map();

  document.querySelectorAll('.act').forEach((act) => {
    // Each chapter says, as fractions of the act, when it is the one being read.
    const chapters = [...act.querySelectorAll('.chapter')].map((el) => {
      const [from, to] = el.dataset.at.split(',').map(Number);
      return { el, from, to };
    });
    const title = act.querySelector('.act__title');
    let current = null;

    track(act, pinned(act), (v) => {
      values.set(act.id, v);
      const reading = chapters.find((c) => v >= c.from && v < c.to) || chapters[v < 0 ? 0 : chapters.length - 1];
      if (reading !== current) {
        current = reading;
        chapters.forEach((c) => c.el.classList.toggle('is-on', c === reading));
        // The graph lights the kind of node the chapter is about.
        act.dataset.reading = reading.el.dataset.kind || '';
      }
      act.style.setProperty('--t', span(v, 0, 1).toFixed(4));
      title.style.setProperty('--lit', (1 - span(v, 0.05, 0.28) * 0.6).toFixed(3));
      // The words of the act come in with it (css/work.css reads --show on every piece).
      act.style.setProperty('--show', easeOut(span(v, -0.35, 0.02)).toFixed(3));
      (listeners.get(act.id) || []).forEach((fn) => fn(v, act));
    // The acts trail the scroll by 55 ms: under that, a wheel shows its notches; over it, the
    // objects keep moving after the hand has stopped.
    }, { write: null, ease: 0.26, min: -1, max: 2 });

    // The end of the pin, softened (css/work.css): the pinned pieces are carried a little ahead
    // of the page around the moment it takes them, by --release pixels, so they start to move
    // before and reach its pace after. Read without smoothing: it has to match the page to the
    // pixel. The canvas pinned across a whole section follows its last act.
    if (!reduced) {
      const section = act.parentElement;
      const last = act === [...section.querySelectorAll('.act')].pop();
      track(act, (vh) => {
        const past = vh - act.getBoundingClientRect().bottom;
        return released(past, RELEASE * vh) - Math.max(past, 0);
      }, last ? (lift) => section.style.setProperty('--release-all', lift.toFixed(1)) : null, { write: '--release', ease: 1, min: 0, max: 1e5 });
    }
  });

  return {
    // fn(v, act): v runs from -1 (a screen before the act) through 0..1 (pinned) to 2 (a screen after).
    on(id, fn) {
      listeners.set(id, [...(listeners.get(id) || []), fn]);
      if (values.has(id)) fn(values.get(id), document.getElementById(id));
    },
  };
}
