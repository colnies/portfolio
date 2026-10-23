// Procedural ASCII beach, lit like a real one. The dune faces and the flat
// sand are 3D surfaces shaded by one low sun out over the sea, with hummocks
// and wind ripples bumping their normals, and brightness rendered as block
// shades. Skylines are filled in eighths of a row so silhouettes are smooth
// rather than stepped. One onshore wind drives the clouds, the grass and the
// sand blowing off the crests, so a gust can be watched crossing the whole
// scene. The composition is laid out in fractions of the grid so it survives
// any width; texture is sized in cells so the grain stays the same at every
// width.

export type Material = "cloud" | "grass" | "sand" | "wet" | "wrack";

export interface Cell {
  ch: string;
  material: Material;
  alpha: number;
}

/** Row-major grid of `cols * rows` cells; null is empty sky or sand. */
export type Scene = (Cell | null)[];

const BEACH_LINE = 0.62; // fraction of height where the dunes meet flat sand
const LEFT_DUNE_END = 0.55;
const WIND = -1; // onshore, from the sea on the right toward the dunes
const CLOUD_DRIFT = 0.7; // cells per second
const CLOUD_COVER = 0.56; // noise level where cloud begins; lower is cloudier
// Low sun out over the sea to the right, a little behind the dunes, so it
// rakes across the faces instead of flattening them
const SUN = normalize([0.8, 0.5, 0.15]);
const DUNE_RUN = 3; // windward slope depth per unit of height, about 18°
const HUMMOCK = 4; // height of the lumps on the faces, in rows
const CELL_ASPECT = 2; // a cell is about twice as tall as it is wide
// Beach relief, in units of the nearest row's distance from the viewer
const RIPPLE_LENGTH = 0.12;
const RIPPLE_HEIGHT = 0.003;
const SWALE = 0.15;

/** Dune skyline as [x, y] fractions, y growing downward. */
const SKYLINE: [number, number][] = [
  [0, 0.3],
  [0.1, 0.33],
  [0.22, 0.39],
  [0.34, 0.47],
  [0.44, 0.545],
  [0.52, 0.6],
  [LEFT_DUNE_END, BEACH_LINE],
  // Low scrub in the gap between the two dunes
  [0.575, BEACH_LINE],
  [0.59, 0.585],
  [0.61, BEACH_LINE],
  [0.635, 0.57],
  [0.7, 0.49],
  [0.75, 0.54],
  [0.8, 0.51],
  [0.86, 0.56],
  [0.93, 0.592],
  [1, 0.608],
];

const SHADES = ["░", "▒", "▓", "█"]; // clouds and dune faces, dim to bright
const EIGHTHS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"]; // cell filled from below
const WRACK_GLYPHS = ["#", "%", "&", "*"];

/** Deterministic per-cell noise so the scene is stable across frames. */
function hash(x: number, y: number, salt = 0): number {
  let h =
    Math.imul(x, 374761393) +
    Math.imul(y, 668265263) +
    Math.imul(salt + 1, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/**
 * Interleaved gradient noise: a low-discrepancy dither that breaks shade
 * boundaries up evenly, without the speckle of white noise or the visible
 * grid of a Bayer matrix.
 */
function dither(x: number, y: number): number {
  const f = 0.06711056 * x + 0.00583715 * y;
  const g = 52.9829189 * (f - Math.floor(f));
  return g - Math.floor(g);
}

function pick<T>(list: T[], r: number): T {
  return list[
    Math.max(0, Math.min(list.length - 1, Math.floor(r * list.length)))
  ];
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** Smooth value noise in [0, 1]. */
function noise(x: number, y: number, salt: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, salt);
  const b = hash(xi + 1, yi, salt);
  const c = hash(xi, yi + 1, salt);
  const d = hash(xi + 1, yi + 1, salt);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Fractal noise in [0, 1], clustered around 0.5. */
function fbm(x: number, y: number, salt: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise(x, y, salt + o);
    norm += amp;
    x = x * 2.03 + 1.7;
    y = y * 2.03 + 3.1;
    amp *= 0.5;
  }
  return sum / norm;
}

function normalize(v: number[]): number[] {
  const len = Math.hypot(v[0], v[1], v[2]);
  return v.map((c) => c / len);
}

/** Lumps on the dune faces: x along the dune, z up the slope, both in rows. */
function hummock(x: number, z: number): number {
  return HUMMOCK * fbm(x * 0.14, z * 0.25, 33);
}

/** Catmull-Rom through the skyline points, roughened by wind-cut noise. */
function skyline(u: number): number {
  let i = 0;
  while (i < SKYLINE.length - 2 && SKYLINE[i + 1][0] <= u) i++;
  const p0 = SKYLINE[Math.max(0, i - 1)][1];
  const p1 = SKYLINE[i][1];
  const p2 = SKYLINE[i + 1][1];
  const p3 = SKYLINE[Math.min(SKYLINE.length - 1, i + 2)][1];
  const span = SKYLINE[i + 1][0] - SKYLINE[i][0];
  const t = clamp01((u - SKYLINE[i][0]) / span);
  const t2 = t * t;
  const t3 = t2 * t;
  const y =
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
  return Math.min(BEACH_LINE, y + 0.014 * (fbm(u * 30, 0, 2, 3) - 0.5));
}

/** Gust strength 0..1. Gust fronts roll across the beach with the wind. */
function gust(u: number, t: number): number {
  return smoothstep(0.32, 0.68, fbm(u * 3 - WIND * t * 0.25, t * 0.04, 9, 3));
}

/**
 * How far grass leans, -1 to the left through 0 upright to 1 to the right.
 * Gusts push it over; between them each blade flutters on its own phase.
 */
function lean(u: number, t: number, jitter: number): number {
  const g = gust(u, t);
  return (
    WIND * (0.15 + 0.65 * g) +
    0.25 * Math.sin(t * (1.5 + 2 * g) + jitter * Math.PI * 2)
  );
}

function bladeGlyph(dir: number): string {
  return dir < -0.35 ? "\\" : dir > 0.35 ? "/" : "|";
}

/**
 * Marram cover along the crests: thick at the far-left end of the big dune
 * and thinning out by its middle, with patchy clumps on the small dunes.
 */
function grassDensity(u: number): number {
  const patch = noise(u * 30, 0, 70);
  if (u < LEFT_DUNE_END) {
    return clamp01(1 - u / 0.4) * (0.7 + 0.3 * patch) + 0.15 * patch;
  }
  return patch > 0.55 ? 0.4 * patch : 0;
}

export function buildScene(cols: number, rows: number, t: number): Scene {
  const cells: Scene = new Array(cols * rows).fill(null);
  const beachY = BEACH_LINE * rows; // fractional row
  const beachRow = Math.floor(beachY);
  const groundRows = rows - beachY;

  const set = (
    col: number,
    row: number,
    ch: string,
    material: Material,
    alpha: number
  ) => {
    if (col < 0 || col >= cols || row < 0 || row >= rows) return;
    cells[row * cols + col] = { ch, material, alpha };
  };

  const clear = (col: number, row: number) => {
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      cells[row * cols + col] = null;
    }
  };

  const isEmpty = (col: number, row: number) =>
    col >= 0 &&
    col < cols &&
    row >= 0 &&
    row < rows &&
    cells[row * cols + col] === null;

  // Crest height per column, in fractional rows
  const crest = new Float64Array(cols);
  for (let col = 0; col < cols; col++) {
    crest[col] = Math.min(beachY, skyline((col + 0.5) / cols) * rows);
  }
  const slopeAt = (ys: Float64Array, col: number) => {
    const a = Math.max(0, col - 1);
    const b = Math.min(cols - 1, col + 1);
    return (ys[b] - ys[a]) / (b - a);
  };
  const hasFace = (col: number) => beachY - crest[col] > 0.8;

  // Sky: domain-warped noise thresholded into cloud, each cell lit by
  // comparing its density with a sample taken toward the sun, so tops glow
  // and bellies sink. Clouds thin out just above the crests to keep the
  // skyline clear.
  for (let col = 0; col < cols; col++) {
    const px = (col - WIND * CLOUD_DRIFT * t) / 24;
    for (let row = 0; row < Math.floor(crest[col]); row++) {
      const fade = smoothstep(1, 4, crest[col] - row - 1);
      if (fade <= 0) continue;
      const py = row / 4;
      const wx = px + 0.8 * fbm(px * 0.5, py * 0.5, 20, 3);
      const wy = py + 0.4 * fbm(px * 0.5 + 3.7, py * 0.5, 21, 3);
      const n = fbm(wx, wy, 22) * (0.85 + 0.15 * fade);
      const density = clamp01((n - CLOUD_COVER) / 0.17) * fade;
      if (density <= 0) continue;

      const toSun = fbm(wx + 0.12, wy - 0.25, 22);
      const lit = clamp01(0.5 + (n - toSun) * 6);
      const level = density * 3.4 + (dither(col, row) - 0.5) * 0.9;
      if (level < 0.5) continue;
      set(
        col,
        row,
        SHADES[Math.min(3, Math.floor(level - 0.5))],
        "cloud",
        0.35 + 0.3 * lit
      );
    }
  }

  // Dune faces, shaded as 3D surfaces. Each column's face rises from the
  // beach to its crest along a smoothstep profile, concave at the toe and
  // rounded over at the brink, so rows near the crest foreshorten as the
  // surface turns away. Fractal hummocks bump the normals and a low sun
  // raking in from over the sea picks them out in light and shadow.
  // Brightness sets both a glyph's ink and its alpha, so faces read as
  // continuous tone rather than flat fill.
  for (let col = 0; col < cols; col++) {
    if (!hasFace(col)) continue;
    const far = (col + 0.5) / cols < LEFT_DUNE_END ? 1 : 0.75; // distant dunes sit back dimmer
    const top = crest[col];
    const height = beachY - top;
    const x = col / CELL_ASPECT; // in rows, so all three axes share a unit
    // How fast the crest rises along the dune, per row of width
    const rise = -slopeAt(crest, col) * CELL_ASPECT;

    const shade = (s: number) => {
      const depth = height * DUNE_RUN;
      const z = s * depth;
      const h = hummock(x, z);
      const gx = rise * s * s * (3 - 2 * s) + (hummock(x + 0.5, z) - h) * 2;
      const gz =
        (height * 6 * s * (1 - s)) / depth + (hummock(x, z + 0.5) - h) * 2;
      const diffuse = Math.max(
        0,
        (-gx * SUN[0] + SUN[1] - gz * SUN[2]) / Math.hypot(gx, 1, gz)
      );
      // Hollows down at the toe see less sky than the brink, and a little
      // gamma lets the shadowed sides fall away
      return clamp01(Math.pow(0.06 + 0.08 * s + diffuse, 1.3));
    };

    // No outline on the skyline: the crest cell is filled from the bottom
    // up to where the crest crosses it, in eighths of a row, so the top of
    // the sand mass is the silhouette
    const cover = Math.round((1 - (top % 1)) * 8);
    if (cover > 0) {
      set(
        col,
        Math.floor(top),
        EIGHTHS[cover - 1],
        "sand",
        (0.1 + 0.35 * shade(1)) * far
      );
    }

    for (let row = Math.floor(top) + 1; row < beachRow; row++) {
      // Invert the smoothstep profile to find how far up the face this is
      const p = clamp01((beachY - row - 0.5) / height);
      const s = 0.5 - Math.sin(Math.asin(1 - 2 * p) / 3);
      const lum = clamp01(shade(s) + 0.08 * (hash(col, row) - 0.5));
      const level = lum * 3.6 + (dither(col, row) - 0.5) * 0.9;
      if (level < 0.5) continue;
      set(
        col,
        row,
        SHADES[Math.min(3, Math.floor(level - 0.5))],
        "sand",
        (0.12 + 0.4 * lum) * far
      );
    }
  }

  // The beach, shaded in perspective with the same sun as the dunes. Each
  // row maps to a distance on the ground. Wind ripples run across the
  // onshore wind, so they converge on the vanishing point, each with a
  // gentle windward back and a steep lee the sun can't reach. They fade out
  // where they'd get finer than the grid can show rather than alias into
  // noise. Broad swales roll the light, damp patches go dark and smooth, and
  // the far sand loses contrast into the haze. There's no drawn horizon: the
  // top row is filled in eighths up to the beach line, like the crests.
  for (let row = beachRow; row < rows; row++) {
    const below = row + 1 - beachY; // rows from the beach line to this row's foot
    const dist = groundRows / Math.max(0.5, row + 0.5 - beachY);
    const near = clamp01(below / groundRows);
    const colWidth = (2 * dist) / cols; // ground covered by one column
    const ripples = smoothstep(3, 6, RIPPLE_LENGTH / colWidth);
    const cover = row === beachRow ? Math.round(below * 8) : 8;
    if (cover <= 0) continue;

    for (let col = 0; col < cols; col++) {
      if (!isEmpty(col, row)) continue;
      const x = ((col + 0.5) / cols - 0.5) * dist * 2;

      const damp = smoothstep(0.55, 0.63, fbm(x * 0.7, dist * 0.5, 60, 3));
      const swale = fbm(x * 0.8, dist * 0.6, 61, 3);
      let gx = (fbm(x * 0.8 + 0.05, dist * 0.6, 61, 3) - swale) * SWALE * 20;
      const gz = (fbm(x * 0.8, dist * 0.6 + 0.05, 61, 3) - swale) * SWALE * 20;

      // Skewed ripple, sin(a) + sin(2a) / 4: a long gentle back and a short
      // steep lee, without the hard edges that would tile into bricks
      const phase =
        (-x + RIPPLE_LENGTH * 2 * noise(x * 2, dist * 1.5, 62)) / RIPPLE_LENGTH;
      const f = phase - Math.floor(phase);
      const climb =
        2 *
        Math.PI *
        (Math.cos(2 * Math.PI * f) + 0.5 * Math.cos(4 * Math.PI * f));
      gx -= ((RIPPLE_HEIGHT * climb) / RIPPLE_LENGTH) * ripples * (1 - damp);

      const diffuse = Math.max(
        0,
        (-gx * SUN[0] + SUN[1] - gz * SUN[2]) / Math.hypot(gx, 1, gz)
      );
      const lum = clamp01(
        Math.pow(0.06 + diffuse, 1.3) *
          (1 - 0.5 * damp) *
          (0.55 + 0.45 * near) +
          0.06 * (hash(col, row) - 0.5)
      );
      const alpha = (0.06 + 0.22 * lum) * (0.55 + 0.45 * near);

      if (cover < 8) {
        set(col, row, EIGHTHS[cover - 1], "sand", alpha * 0.8);
        continue;
      }
      const level = lum * 3 + (dither(col, row) - 0.5) * 0.9;
      if (level < 0.5) continue;
      set(
        col,
        row,
        SHADES[Math.min(3, Math.floor(level - 0.5))],
        damp > 0.5 ? "wet" : "sand",
        alpha
      );
    }
  }

  // Draws one blade of grass up from its root. Blades stand fairly
  // upright at the root and bend with the wind toward the tip, and a
  // slanted stroke steps a cell sideways so it joins the row above.
  const blade = (
    col: number,
    root: number,
    height: number,
    splay: number,
    bend: number,
    alpha: number
  ) => {
    let c = col;
    for (let i = 0; i < height; i++) {
      const along = height > 1 ? i / (height - 1) : 1;
      const ch = bladeGlyph(splay + bend * along * along);
      set(
        c,
        root - i,
        i === height - 1 && ch === "|" ? "'" : ch,
        "grass",
        alpha
      );
      c += ch === "/" ? 1 : ch === "\\" ? -1 : 0;
    }
  };

  // Marram grass on the crests. Where cover is heavy the upper face takes on
  // the grass's colour, the way a vegetated dune looks greener from a
  // distance, and a fringe of blades stands up off the skyline.
  for (let col = 0; col < cols; col++) {
    if (!hasFace(col)) continue;
    const u = (col + 0.5) / cols;
    const dens = grassDensity(u);
    if (dens <= 0) continue;
    const far = u < LEFT_DUNE_END ? 1 : 0.75;
    const top = Math.floor(crest[col]);

    const capDepth = Math.round((beachY - crest[col]) * 0.45 * dens);
    for (let row = top; row <= top + capDepth; row++) {
      const cell = cells[row * cols + col];
      if (!cell || row >= beachRow) continue;
      const depthT = (row - top) / (capDepth + 1);
      const cover = dens * (0.4 + 0.9 * fbm(col * 0.15, row * 0.6, 71, 3));
      if (cover * (1 - 0.6 * depthT) < 0.35) continue;
      cell.material = "grass";
      cell.alpha *= 0.85;
    }

    const r = hash(col, 0, 74);
    if (r < 0.08 + 0.45 * dens) {
      const height = Math.min(
        u < LEFT_DUNE_END ? 3 : 2,
        1 + Math.floor(hash(col, 0, 75) * (0.6 + 2.2 * dens))
      );
      // Root in the crest cell when the sand fills less than half of it,
      // so no blade floats a row clear of the dune
      blade(
        col,
        crest[col] % 1 > 0.5 ? top : top - 1,
        height,
        0.5 * (hash(col, 0, 77) - 0.5),
        lean(u, t, hash(col, 0, 76)),
        (0.5 + 0.25 * dens) * far
      );
    }
  }

  // Sand smoking off the bare crests while a gust is passing
  for (let col = 0; col < cols; col++) {
    if (!hasFace(col)) continue;
    const u = (col + 0.5) / cols;
    if (grassDensity(u) > 0.3) continue;
    const g = gust(u, t);
    const r = hash(col, 1, 85);
    if (g < 0.4 || r > 0.18) continue;
    const phase = (t * 0.8 + r * 37) % 1;
    const c = col + Math.round(WIND * phase * 6);
    const row =
      Math.floor(crest[col]) - 1 - Math.round(Math.sin(phase * Math.PI) * 1.2);
    if (isEmpty(c, row)) {
      set(c, row, phase < 0.5 ? "·" : ".", "sand", 0.55 * g * (1 - phase));
    }
  }

  // Clumps on the flat sand come from jittered grids: grass gathers on the
  // landward side where it can take hold, wrack toward the sea, and nearer
  // clumps are drawn bigger. Narrow grids keep them small so they don't
  // merge into a hedge, and all stay a row clear of the bottom edge.
  const sparse = cols < 90;
  const lowestRow = rows - 2;

  for (let gy = beachRow + 2; gy <= lowestRow; gy += 3) {
    for (let gx = 0; gx < cols; gx += 10) {
      const col = gx + Math.floor(hash(gx, gy, 91) * 10);
      const row = Math.min(lowestRow, gy + Math.floor(hash(gx, gy, 92) * 3));
      const u = (col + 0.5) / cols;
      const near = (row - beachY) / groundRows;
      const chance = 0.5 * smoothstep(0.45, 0.85, u) * (sparse ? 0.6 : 1);
      if (hash(gx, gy, 90) > chance) continue;

      const w = Math.min(sparse ? 2 : 4, 1 + Math.floor(near * 3.5));
      const c0 = col - Math.floor(w / 2);
      for (let p = 0; p < w; p++) {
        set(
          c0 + p,
          row,
          pick(WRACK_GLYPHS, hash(c0 + p, row, 3)),
          "wrack",
          0.6
        );
      }
      clear(c0 - 1, row); // shadow, away from the sun
      // Bigger clumps get a second, narrower row underneath
      for (let p = 1; p < w - 1; p++) {
        set(
          c0 + p,
          row + 1,
          pick(WRACK_GLYPHS, hash(c0 + p, row + 1, 4)),
          "wrack",
          0.45
        );
      }
    }
  }

  for (let gy = beachRow + 2; gy <= lowestRow; gy += 3) {
    for (let gx = 0; gx < cols; gx += 10) {
      const col = gx + Math.floor(hash(gx, gy, 81) * 10);
      const base = Math.min(lowestRow, gy + Math.floor(hash(gx, gy, 82) * 3));
      const u = (col + 0.5) / cols;
      const chance =
        (0.1 + 0.55 * (1 - smoothstep(0.25, 0.7, u))) * (sparse ? 0.6 : 1);
      if (hash(gx, gy, 80) > chance) continue;

      const near = (base - beachY) / groundRows;
      const size = Math.min(sparse ? 2 : 3, 1 + Math.floor(near * 3));
      const tuftLean = lean(u, t, hash(col, base, 83));
      // Nearer clumps stand out; distant ones settle into the haze
      const alpha = (0.4 + 0.08 * size) * (0.6 + 0.4 * near);

      // The low sun on the right throws a short shadow off to the left
      for (let p = 1; p <= size + 1; p++) clear(col - size - p, base);

      // A full fan of blades from one root, tallest in the middle and
      // splaying outward, all bending the same way in the wind
      for (let p = -size; p <= size; p++) {
        const height = Math.max(
          1,
          Math.round(size + 1 - Math.abs(p) * 0.8 - hash(col + p, base, 84))
        );
        blade(col + p, base, height, (0.9 * p) / size, tuftLean, alpha);
      }
    }
  }

  return cells;
}
