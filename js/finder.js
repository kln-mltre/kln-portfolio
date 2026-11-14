// The words set beside the 3D stage on a wide screen: the sentence about a piece of screen is
// written clear of the object, level with the piece, at the end of one short tick. The stage
// gives, for every frame, the four corners of each piece and how far it has been singled out.
const PAPER = '244, 241, 234';
const NIGHT = '11, 11, 10';
const FONT = '"Instrument Sans", Helvetica, Arial, sans-serif';

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

export function createFinder(canvas) {
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  // One stroke, light in a dark casing: it reads on a dark interface and on a light page alike.
  const stroke = (weight, alpha) => {
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      pieces.forEach(({ quad, p, text, side, reach }) => {
        const cx = (quad[0][0] + quad[1][0] + quad[2][0] + quad[3][0]) / 4;
        const cy = (quad[0][1] + quad[1][1] + quad[2][1] + quad[3][1]) / 4;
        const corners = quad;
        if (!text) return;
        // The sentence, level with the middle of the piece, a tick away from it.
        const named = Math.min(Math.max((p - 0.62) / 0.38, 0), 1);
        if (named <= 0) return;
        const right = side !== 'left';
        const edge = right ? Math.max(corners[1][0], corners[2][0]) : Math.min(corners[0][0], corners[3][0]);
        // One level tick, from the piece to just past the edge of the object.
        const from = edge + (right ? 8 : -8);
        const end = right ? Math.max(reach + 16, from + 26) : Math.min(reach - 16, from - 26);
        ctx.beginPath();
        ctx.moveTo(from, cy);
        ctx.lineTo(from + (end - from) * named, cy);
        stroke(1, named * 0.9);
        ctx.font = `17px ${FONT}`;
        ctx.textAlign = right ? 'left' : 'right';
        ctx.textBaseline = 'middle';
        const lines = wrap(ctx, text, 172);
        const x = end + (right ? 12 : -12);
        lines.forEach((line, i) => {
          const y = cy + (i - (lines.length - 1) / 2) * 21;
          ctx.fillStyle = `rgba(${PAPER}, ${named.toFixed(3)})`;
          ctx.fillText(line, x, y);
        });
      });
    },
  };
}
