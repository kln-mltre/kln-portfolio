// The KLNOS plate: the working system drawn as a graph, on a 2D canvas. It is built from the
// real configuration: one mark per rule file, agent, skill, hook, note and repository. The marks
// are real; where they sit and which lines join them is drawn for this page. It grows with the
// scroll, and the kind of mark the current chapter is about is lit and named.
import { update, span, easeOut, easeInOut } from './scroll.js';

const RULES = ['design', 'writing', 'documentation', 'SQL', 'TypeScript', 'Python', 'React Native', 'Next.js', 'tests'];
const AGENTS = ['explorer', 'builder', 'reviewer'];
const SKILLS = ['autonomy', 'lab', 'tools', 'recall', 'release'];
const HOOKS = ['session bridge', 'browser guard', 'consent', 'plan approval'];
const PROJECTS = ['KLNOS', 'UKit', 'TLPerf', 'Portfolio'];
// Which projects a rule applies to, by the stack of each (indexes into PROJECTS).
const APPLIES = {
  design: [0, 1, 2, 3], writing: [0, 1, 2, 3], documentation: [0, 1, 2, 3], tests: [0, 1, 2, 3], TypeScript: [0, 1, 2, 3],
  'React Native': [1], 'Next.js': [0, 2, 3], SQL: [0], Python: [],
};
const NOTES = 108;
const NOTES_PER_PROJECT = 24;
// The furthest a mark sits from the centre, in graph radii.
const EXTENT = 1.26;
const TAU = Math.PI * 2;

// A mark of each kind: how big, what shape, how visible when its chapter is not being read.
const LOOK = {
  hub: { size: 3.4, shape: 'square', base: 1 },
  rule: { size: 2.3, shape: 'square', base: 0.4 },
  agent: { size: 4.6, shape: 'ring', base: 0.5 },
  skill: { size: 2.1, shape: 'dot', base: 0.4 },
  hook: { size: 3.1, shape: 'diamond', base: 0.42 },
  project: { size: 4.8, shape: 'dot', base: 0.7 },
  note: { size: 1.05, shape: 'dot', base: 0.3 },
};
// Which chapter lights which kind (the chapters carry data-kind, see index.html).
const CHAPTER = { hub: 'rule', rule: 'rule', agent: 'agent', skill: 'agent', hook: 'hook', project: 'project', note: 'note' };
const PAPER = '244, 241, 234';
const RED = '210, 27, 16';

// The same numbers on every visit: the plate must not rearrange itself between two loads.
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Positions are in graph radii round the centre; `born` is the point of the act (see js/acts.js)
// at which a mark or a line appears.
function build() {
  const rnd = seeded(11);
  const nodes = [];
  const edges = [];
  const add = (kind, label, degrees, radius, born) => {
    const angle = (degrees * Math.PI) / 180;
    nodes.push({ kind, label, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, born, phase: rnd() * TAU });
    return nodes.length - 1;
  };
  const link = (a, b, kinds, born) => edges.push({ a, b, kinds, born: born ?? Math.max(nodes[a].born, nodes[b].born) + 0.01 });
  const jitter = (amount) => (rnd() - 0.5) * 2 * amount;

  const hub = add('hub', 'constitution', 0, 0, -0.75);
  const projects = PROJECTS.map((name, i) => {
    const id = add('project', name, -38 + i * 90 + jitter(7), 1 + jitter(0.03), -0.6 + i * 0.09);
    link(hub, id, ['project']);
    return id;
  });
  RULES.forEach((name, i) => {
    const id = add('rule', name, 8 + i * 40 + jitter(5), 0.68 + jitter(0.035), 0.1 + i * 0.011);
    link(hub, id, ['rule']);
    APPLIES[name].forEach((p) => link(id, projects[p], ['rule', 'project'], nodes[id].born + 0.035));
  });
  AGENTS.forEach((name, i) => link(hub, add('agent', name, -82 + i * 120, 0.2, 0.28 + i * 0.02), ['agent']));
  SKILLS.forEach((name, i) => link(hub, add('skill', name, -52 + i * 72 + jitter(6), 0.36 + jitter(0.02), 0.32 + i * 0.016), ['agent']));
  HOOKS.forEach((name, i) => link(hub, add('hook', name, 28 + i * 90, 0.5, 0.46 + i * 0.022), ['hook']));
  // Notes gather round the project they belong to; the rest float between them.
  projects.forEach((project) => {
    for (let i = 0; i < NOTES_PER_PROJECT; i += 1) {
      const angle = rnd() * TAU;
      const distance = 0.07 + rnd() ** 0.8 * 0.19;
      nodes.push({ kind: 'note', x: nodes[project].x + Math.cos(angle) * distance, y: nodes[project].y + Math.sin(angle) * distance, born: 0.62 + rnd() * 0.11, phase: rnd() * TAU });
      link(nodes.length - 1, project, ['note', 'project']);
    }
  });
  for (let i = NOTES_PER_PROJECT * PROJECTS.length; i < NOTES; i += 1) {
    const angle = rnd() * TAU;
    const radius = 0.8 + rnd() * 0.36;
    nodes.push({ kind: 'note', x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, born: 0.62 + rnd() * 0.11, phase: rnd() * TAU });
  }
  return { nodes, edges };
}

function mark(ctx, shape, x, y, s) {
  if (shape === 'square') { ctx.fillRect(x - s, y - s, s * 2, s * 2); return; }
  ctx.beginPath();
  if (shape === 'diamond') {
    const d = s * 1.3;
    ctx.moveTo(x, y - d); ctx.lineTo(x + d, y); ctx.lineTo(x, y + d); ctx.lineTo(x - d, y);
    ctx.closePath();
  } else {
    ctx.arc(x, y, s, 0, TAU);
  }
  ctx.fill();
}

// acts: where the scroll is in the act (js/acts.js).
// still: capture mode, where nothing drifts and a frame is drawn on request.
export function initBrain({ acts, still, reduced }) {
  const section = document.getElementById('system');
  const act = document.getElementById('klnos');
  const canvas = document.getElementById('brain');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  // From here the act is pinned (css/work.css); every measure below it has moved.
  section.classList.add('is-live');
  update(true);

  const { nodes, edges } = build();
  // When each kind is the one being read, as fractions of the act.
  const windows = {};
  act.querySelectorAll('.chapter[data-kind]').forEach((el) => { windows[el.dataset.kind] = el.dataset.at.split(',').map(Number); });
  const lastChapter = Math.max(...Object.values(windows).map((w) => w[1]));

  const wide = window.matchMedia('(min-width: 900px)');
  const geo = { cx: 0, cy: 0, r: 100, dpr: 1, wide: false };
  const state = { v: -1 };
  let dirty = true;

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    geo.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * geo.dpr);
    canvas.height = Math.round(h * geo.dpr);
    geo.wide = wide.matches;
    // Wide: right of the column of words, which keeps the left-hand quarter; below 1200 px the
    // column takes more than its quarter, so the graph moves right and draws in a little, or
    // Portfolio is named under the standfirst. Narrow: above the words.
    const tight = geo.wide && w < 1200;
    geo.cx = w * (geo.wide ? (tight ? 0.65 : 0.61) : 0.5);
    geo.cy = h * (geo.wide ? 0.5 : 0.43);
    geo.r = (geo.wide ? Math.min(w * (tight ? 0.3 : 0.34), h * 0.45) : Math.min(w * 0.47, h * 0.3)) / EXTENT;
    dirty = true;
  };

  function draw(time = 0) {
    dirty = false;
    ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    const v = state.v;
    if (v <= -1 || v >= 2) return;

    const grown = (born) => (reduced ? 1 : easeOut(span(v, born, born + 0.07)));
    const light = {};
    Object.entries(windows).forEach(([kind, [from, to]]) => {
      light[kind] = easeInOut(span(v, from - 0.015, from + 0.025)) * (1 - easeInOut(span(v, to - 0.015, to + 0.025)));
    });
    // After the last chapter the whole plate is evenly lit.
    const rest = easeInOut(span(v, lastChapter - 0.015, lastChapter + 0.03));
    // The plate turns a little as the act goes by, and each mark drifts on its own.
    const turn = reduced ? 0 : -0.3 + v * 0.62;
    const cos = Math.cos(turn);
    const sin = Math.sin(turn);
    const drift = reduced || still ? 0 : 0.011;
    const at = nodes.map((n) => {
      const x = n.x + Math.sin(time * 0.00045 + n.phase) * drift;
      const y = n.y + Math.cos(time * 0.00038 + n.phase * 1.7) * drift;
      return [geo.cx + (x * cos - y * sin) * geo.r, geo.cy + (x * sin + y * cos) * geo.r];
    });

    // The fence the hooks stand on, round the agents.
    const fence = grown(windows.hook ? windows.hook[0] - 0.01 : 0);
    if (fence > 0) {
      ctx.strokeStyle = `rgba(${PAPER}, ${((0.05 + (light.hook || 0) * 0.32 + rest * 0.07) * fence).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(geo.cx, geo.cy, 0.5 * geo.r, -Math.PI / 2, -Math.PI / 2 + TAU * fence);
      ctx.stroke();
    }

    ctx.lineWidth = 1;
    edges.forEach((edge) => {
      const p = grown(edge.born);
      if (p <= 0) return;
      const lit = Math.max(...edge.kinds.map((kind) => light[kind] || 0));
      const faint = nodes[edge.a].kind === 'note';
      const alpha = faint ? 0.06 + lit * 0.2 + rest * 0.05 : 0.1 + lit * 0.38 + rest * 0.1;
      const [ax, ay] = at[edge.a];
      const [bx, by] = at[edge.b];
      ctx.strokeStyle = `rgba(${PAPER}, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + (bx - ax) * p, ay + (by - ay) * p);
      ctx.stroke();
    });

    const small = geo.wide ? 1 : 0.86;
    nodes.forEach((node, index) => {
      const p = grown(node.born);
      if (p <= 0) return;
      const look = LOOK[node.kind];
      const lit = light[CHAPTER[node.kind]] || 0;
      const [x, y] = at[index];
      const size = look.size * small * (0.5 + p * 0.5) * (1 + lit * 0.22);
      const alpha = (look.base + (1 - look.base) * Math.max(lit, rest * 0.55)) * p;
      const colour = node.kind === 'hub' ? RED : PAPER;
      if (look.shape === 'ring') {
        // A ring is cut out of the lines that reach it, then drawn.
        ctx.fillStyle = '#0b0b0a';
        mark(ctx, 'dot', x, y, size);
        ctx.strokeStyle = `rgba(${colour}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, TAU);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${colour}, ${alpha.toFixed(3)})`;
        mark(ctx, look.shape, x, y, size);
      }

      // On a narrow screen the skills sit too close to the agents to be named as well.
      if (!node.label || (node.kind === 'skill' && !geo.wide)) return;
      // Projects keep their name; the other marks are named while their chapter is read.
      const named = node.kind === 'project' ? p * (0.5 + 0.5 * Math.max(lit, rest)) : lit * p;
      if (named < 0.02) return;
      let dx = x - geo.cx;
      let dy = y - geo.cy;
      const length = Math.hypot(dx, dy);
      if (length < 1) { dx = 0.72; dy = -0.7; } else { dx /= length; dy /= length; }
      const gap = size + 7;
      ctx.font = node.kind === 'project'
        ? `${geo.wide ? 15 : 13}px "Malartre Texte", Georgia, serif`
        : `${geo.wide ? 12.5 : 11}px "Malartre Texte", Georgia, serif`;
      ctx.textAlign = dx > 0.35 ? 'left' : dx < -0.35 ? 'right' : 'center';
      ctx.textBaseline = dy > 0.6 ? 'top' : dy < -0.6 ? 'bottom' : 'middle';
      ctx.fillStyle = `rgba(${PAPER}, ${named.toFixed(3)})`;
      ctx.fillText(node.label, x + dx * gap, y + dy * gap);
    });
  }

  acts.on('klnos', (v) => { state.v = v; dirty = true; });
  resize();
  new ResizeObserver(resize).observe(canvas);

  // Draw only when something changed, or while the act is on screen and the marks drift.
  let onScreen = false;
  new IntersectionObserver((entries) => { onScreen = entries[0].isIntersecting; }).observe(act);
  const loop = (time) => {
    if (dirty || (onScreen && !reduced && !still)) draw(time);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // The labels are type: the plate is ready once their face is in.
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  return fonts.then(() => { dirty = true; return { draw: () => draw(0) }; });
}
