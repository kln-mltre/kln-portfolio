// The bar: it steps aside on the way down, comes back on the way up, and a short red rule marks
// the section being read.
import { track, span } from './scroll.js';

export function initBar() {
  const bar = document.getElementById('bar');

  // A soft dark band behind the bar once the cover is left, so it reads over anything.
  track(bar, (vh) => span(window.scrollY / vh, 0.55, 1), null, { write: '--shade' });

  let last = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const down = y > last + 4;
    const up = y < last - 4;
    if (y < window.innerHeight * 0.9) bar.classList.remove('is-away');
    else if (down) bar.classList.add('is-away');
    else if (up) bar.classList.remove('is-away');
    if (down || up) last = y;
  }, { passive: true });

  const links = new Map([...bar.querySelectorAll('[data-section]')].map((a) => [a.dataset.section, a]));
  // A section is current while it crosses the middle of the screen.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => links.get(entry.target.id)?.classList.toggle('is-current', entry.isIntersecting));
  }, { rootMargin: '-50% 0px -50% 0px' });
  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
