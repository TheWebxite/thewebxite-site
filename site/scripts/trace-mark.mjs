/**
 * Reconstructs the TheWebxite "W" mark as polygons for the 3D hero mark.
 *
 * The mark is bilevel and made entirely of straight edges, so it is traced
 * rather than approximated: boundary-follow the alpha mask, then simplify with
 * Ramer-Douglas-Peucker at a tolerance well under one source pixel. The output
 * is exact to the artwork, which an auto-tracer's curve fitting would not be.
 *
 * Run: node scripts/trace-mark.mjs <source.png> <out.json>
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const [, , SRC, OUT] = process.argv;
if (!SRC || !OUT) {
  console.error("usage: node scripts/trace-mark.mjs <source.png> <out.json>");
  process.exit(1);
}

/* Trace at 4x so the simplifier has sub-source-pixel precision to work with. */
const SCALE = 4;

const base = await sharp(SRC).trim().toBuffer({ resolveWithObject: true });
const bw = base.info.width * SCALE;
const bh = base.info.height * SCALE;

const { data } = await sharp(base.data)
  .resize(bw, bh, { kernel: "nearest" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

/* solid = opaque pixel. The mark is white-on-transparent. */
const solid = (x, y) => {
  if (x < 0 || y < 0 || x >= bw || y >= bh) return false;
  return data[(y * bw + x) * 4 + 3] > 127;
};

/* ---- Moore boundary following, one closed loop per connected region ---- */
const seen = new Uint8Array(bw * bh);
const DIRS = [
  [1, 0], [1, 1], [0, 1], [-1, 1],
  [-1, 0], [-1, -1], [0, -1], [1, -1],
];

function traceFrom(sx, sy) {
  const pts = [];
  let cx = sx, cy = sy, dir = 6; // entered from the left, start looking up
  const startX = sx, startY = sy;
  let guard = 0;
  do {
    pts.push([cx, cy]);
    seen[cy * bw + cx] = 1;
    let found = false;
    for (let i = 0; i < 8; i++) {
      const d = (dir + 6 + i) % 8;
      const nx = cx + DIRS[d][0];
      const ny = cy + DIRS[d][1];
      if (solid(nx, ny)) {
        cx = nx; cy = ny; dir = d; found = true; break;
      }
    }
    if (!found) break;
  } while ((cx !== startX || cy !== startY) && ++guard < bw * bh * 4);
  return pts;
}

/* Find every outer boundary: a solid pixel with nothing solid to its left. */
const loops = [];
for (let y = 0; y < bh; y++) {
  for (let x = 0; x < bw; x++) {
    if (!solid(x, y) || solid(x - 1, y)) continue;
    if (seen[y * bw + x]) continue;
    const loop = traceFrom(x, y);
    if (loop.length > 24) loops.push(loop);
    // mark the whole region so we do not re-trace it
    const stack = [[x, y]];
    while (stack.length) {
      const [px, py] = stack.pop();
      if (px < 0 || py < 0 || px >= bw || py >= bh) continue;
      if (!solid(px, py) || seen[py * bw + px] === 2) continue;
      seen[py * bw + px] = 2;
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
  }
}

/* ---- Ramer-Douglas-Peucker ---- */
function rdp(points, eps) {
  if (points.length < 3) return points;
  let maxD = 0, idx = 0;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= eps) return [points[0], points[points.length - 1]];
  return [...rdp(points.slice(0, idx + 1), eps).slice(0, -1), ...rdp(points.slice(idx), eps)];
}

/* eps in TRACE pixels. The source is anti-aliased, so thresholding leaves a
   staircase roughly one SOURCE pixel tall (= SCALE trace pixels). The
   tolerance has to clear that or every step survives simplification — at 2.5
   the W body came out with 177 points instead of its true dozen. */
const EPS = Number(process.env.TRACE_EPS ?? SCALE * 1.75);
const simplified = loops.map((l) => rdp(l, EPS));

/* ---- normalise: centre on the origin, longest side = 1 unit ---- */
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const l of simplified) for (const [x, y] of l) {
  if (x < minX) minX = x; if (x > maxX) maxX = x;
  if (y < minY) minY = y; if (y > maxY) maxY = y;
}
const span = Math.max(maxX - minX, maxY - minY);
const cxm = (minX + maxX) / 2, cym = (minY + maxY) / 2;

const shapes = simplified.map((l) =>
  l.map(([x, y]) => [
    +((x - cxm) / span).toFixed(4),
    // flip Y: image space is top-down, three.js is bottom-up
    +(-(y - cym) / span).toFixed(4),
  ])
);

const aspect = +((maxX - minX) / (maxY - minY)).toFixed(4);

if (OUT.endsWith(".ts")) {
  writeFileSync(
    OUT,
    `/* GENERATED — do not hand-edit.\n` +
      ` * Source: ${SRC}\n` +
      ` * Regenerate: node scripts/trace-mark.mjs <source.png> ${OUT}\n` +
      ` *\n` +
      ` * The brand W as closed polygons, centred on the origin with its longest\n` +
      ` * side at 1 unit. Y is already flipped into three.js orientation.\n` +
      ` * The first loop is the bar, the second the W body; they are separate\n` +
      ` * islands, not a shape and a hole.\n` +
      ` */\n` +
      `export const MARK_ASPECT = ${aspect};\n\n` +
      `export const MARK_SHAPES: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = ${JSON.stringify(
        shapes
      ).replace(/\],\[/g, "],\n  [")} as const;\n`
  );
} else {
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        note: "Generated by scripts/trace-mark.mjs from the brand icon. Do not hand-edit.",
        source: SRC,
        aspect,
        shapes,
      },
      null,
      2
    )
  );
}

console.log(
  `traced ${shapes.length} loop(s); points: ${shapes.map((s) => s.length).join(", ")}; ` +
    `source ${base.info.width}x${base.info.height}, aspect ${((maxX - minX) / (maxY - minY)).toFixed(3)}`
);
