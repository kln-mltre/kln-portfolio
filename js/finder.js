// The words set beside the 3D stage on a wide screen: the sentence about a piece of screen is
// written clear of the object, level with the piece, at the end of one short tick. The stage
// gives, for every frame, the four corners of each piece and how far it has been singled out.
const PAPER = '244, 241, 234';
const NIGHT = '11, 11, 10';
const FONT = '"Malartre Texte", Georgia, serif';
const MARGIN = 40;

// Breaks a sentence into lines no wider than `width`.
function wrap(ctx, text, width) {
  const lines = [];
  let line = '';
  text.split(' ').forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; } else line = next;
  });
  if (line) lines.push(line);
  return lines;
}

// Each sentence is drawn in a band of the page this tall (CSS pixels, as in css/work.css), moved
// to its height. A canvas the size of the screen, nearly all of it empty and sent again every
// frame the words moved, cost a modest graphics chip as much as the antialiasing of the stage.
const BAND = 160;

export function createFinder(first) {
  // One band per sentence a frame can hold: the main one and, on a wide screen, the second.
  const second = first.cloneNode();
  second.removeAttribute('id');
  first.after(second);
  const bands = [first, second].map((canvas) => ({ canvas, ctx: canvas.getContext('2d'), shown: '', top: null }));
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    bands.forEach((band) => {
      band.canvas.width = Math.round(band.canvas.clientWidth * dpr);
      band.canvas.height = Math.round(BAND * dpr);
      band.shown = '';
    });
  };
  resize();
  new ResizeObserver(resize).observe(first);

  // One stroke, light in a dark casing: it reads on a dark interface and on a light page alike.
  const stroke = (ctx, weight, alpha) => {
    ctx.lineWidth = weight + 2;
    ctx.strokeStyle = `rgba(${NIGHT}, ${(alpha * 0.45).toFixed(3)})`;
    ctx.stroke();
    ctx.lineWidth = weight;
    ctx.strokeStyle = `rgba(${PAPER}, ${alpha.toFixed(3)})`;
    ctx.stroke();
  };

  return {
    // pieces: [{ quad, p, text, side, reach }]. quad: four corners in canvas pixels (top left,
    // top right, bottom right, bottom left). p: 0 nothing, up to 1 locked. text and side ('left'
    // or 'right'): the sentence to set beside the object, or no text on a narrow screen. reach:
    // where the object ends on that side; the sentence is set clear of it, never over the screen.
    draw(pieces) {
      // What this frame shows: one tick and one sentence per piece being named.
      const marks = [];
      const measure = bands[0].ctx;
      measure.font = `17px ${FONT}`;
      pieces.forEach(({ quad, p, text, side, reach }) => {
        if (!text) return;
        // The sentence, level with the middle of the piece, a tick away from it.
        const named = Math.min(Math.max((p - 0.62) / 0.38, 0), 1);
        if (named <= 0) return;
        const cy = (quad[0][1] + quad[1][1] + quad[2][1] + quad[3][1]) / 4;
        const right = side !== 'left';
        const edge = right ? Math.max(quad[1][0], quad[2][0]) : Math.min(quad[0][0], quad[3][0]);
        // One level tick, from the piece to just past the edge of the object.
        const from = edge + (right ? 8 : -8);
        const end = right ? Math.max(reach + 16, from + 26) : Math.min(reach - 16, from - 26);
        const x = end + (right ? 12 : -12);
        // The sentence stays inside the frame, clear of the shot readout set along its right edge.
        const room = right ? first.clientWidth - MARGIN - x : x - MARGIN;
        marks.push({ cy, from, tip: from + (end - from) * named, named, right, x, lines: wrap(measure, text, Math.min(172, room)) });
      });

      bands.forEach((band, index) => {
        const mark = marks[index];
        const { canvas, ctx } = band;
        if (!mark) {
          if (band.shown) { band.shown = ''; canvas.style.visibility = 'hidden'; }
          return;
        }
        // The band sits on a whole device pixel, so that a sentence lands on the same fraction
        // of a pixel as it did on the full canvas, and is drawn the same.
        const top = Math.floor((mark.cy - BAND / 2) * dpr) / dpr;
        const { cy, from, tip, named, right, x, lines } = mark;
        const sign = `${top} ${cy} ${from} ${tip} ${named.toFixed(3)} ${x} ${lines.join('|')}`;
        if (sign === band.shown) return;
        band.shown = sign;
        if (band.top !== top) { canvas.style.transform = `translate3d(0, ${top}px, 0)`; band.top = top; }
        canvas.style.visibility = 'visible';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, -top * dpr);
        ctx.beginPath();
        ctx.moveTo(from, cy);
        ctx.lineTo(tip, cy);
        stroke(ctx, 1, named * 0.9);
        ctx.font = `17px ${FONT}`;
        ctx.textAlign = right ? 'left' : 'right';
        ctx.textBaseline = 'middle';
        lines.forEach((line, i) => {
          const y = cy + (i - (lines.length - 1) / 2) * 21;
          ctx.fillStyle = `rgba(${PAPER}, ${named.toFixed(3)})`;
          ctx.fillText(line, x, y);
        });
      });
    },
  };
}
