// Procedural ASCII beach: a grassy dune on the left sloping down to flat
// sand, a smaller dune range on the right, cirrus wisps overhead, and
// grass tufts and wrack scattered across the foreground. Everything is laid
// out in fractions of the grid so the composition survives any width.

export type Material = "cloud" | "grass" | "sand" | "wet" | "wrack";

export interface Cell {
  ch: string;
  material: Material;
  alpha: number;
}

/** Row-major grid of `cols * rows` cells; null is empty sky or sand. */
export type Scene = (Cell | null)[];

/** A rectangle of cells (inclusive) kept clear, e.g. behind footer text. */
export interface Hole {
  c0: number;
  r0: number;
  c1: number;
  r1: number;
}

const BEACH_LINE = 0.62; // fraction of height where the dunes meet flat sand
const LEFT_DUNE_END = 0.55;
const CLOUD_DRIFT = 0.004; // grid widths per second

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

interface Wisp {
  x: number;
  y: number;
  len: number;
  dy: number; // vertical drift from start to end
  bend: number; // mid-point bulge
  thick: number;
  density: number;
}

const WISPS: Wisp[] = [
  {
    x: 0.04,
    y: 0.24,
    len: 0.2,
    dy: -0.1,
    bend: -0.02,
    thick: 0.045,
    density: 1,
  },
  {
    x: 0.17,
    y: 0.14,
    len: 0.28,
    dy: 0.06,
    bend: -0.03,
    thick: 0.075,
    density: 1,
  },
  {
    x: 0.46,
    y: 0.22,
    len: 0.16,
    dy: -0.05,
    bend: 0.01,
    thick: 0.068,
    density: 1,
  },
  {
    x: 0.5,
    y: 0.33,
    len: 0.2,
    dy: -0.05,
    bend: 0.02,
    thick: 0.053,
    density: 1,
  },
  {
    x: 0.55,
    y: 0.05,
    len: 0.4,
    dy: 0.04,
    bend: -0.01,
    thick: 0.03,
    density: 0.9,
  },
  {
    x: 0.62,
    y: 0.17,
    len: 0.38,
    dy: -0.06,
    bend: 0.02,
    thick: 0.033,
    density: 0.85,
  },
  {
    x: 0.7,
    y: 0.31,
    len: 0.28,
    dy: -0.04,
    bend: 0.015,
    thick: 0.045,
    density: 0.95,
  },
  {
    x: 0.76,
    y: 0.43,
    len: 0.2,
    dy: -0.02,
    bend: 0,
    thick: 0.03,
    density: 0.75,
  },
  { x: 0, y: 0.31, len: 0.14, dy: 0.03, bend: 0, thick: 0.03, density: 0.75 },
  {
    x: 0.28,
    y: 0.37,
    len: 0.14,
    dy: -0.03,
    bend: 0.01,
    thick: 0.03,
    density: 0.7,
  },
];

/** Grass clumps on the flat sand as [x, y]; lower ones are nearer and bigger. */
const TUFTS: [number, number][] = [
  [0.03, 0.7],
  [0.07, 0.655],
  [0.1, 0.7],
  [0.14, 0.68],
  [0.19, 0.745],
  [0.09, 0.8],
  [0.17, 0.83],
  [0.22, 0.675],
  [0.27, 0.72],
  [0.31, 0.66],
  [0.25, 0.64],
  [0.37, 0.69],
  [0.42, 0.655],
  [0.47, 0.675],
  [0.52, 0.66],
  [0.56, 0.69],
  [0.6, 0.66],
  [0.33, 0.79],
  [0.04, 0.86],
  [0.4, 0.84],
];

/** Dark clumps of washed-up seaweed as [x, y, width]. */
const WRACK: [number, number, number][] = [
  [0.63, 0.665, 3],
  [0.72, 0.66, 2],
  [0.79, 0.7, 3],
  [0.68, 0.745, 2],
  [0.85, 0.73, 3],
  [0.91, 0.705, 2],
  [0.95, 0.77, 2],
  [0.58, 0.76, 2],
  [0.74, 0.8, 1],
  [0.88, 0.79, 2],
  [0.66, 0.82, 1],
  [0.97, 0.675, 1],
  [0.45, 0.76, 2],
  [0.53, 0.815, 1],
  [0.8, 0.82, 2],
];

const CROWN_TOP = ["w", "v", "W", "Y", "^", '"', '"'];
const CROWN_BODY = ["W", "w", "Y", "v", '"', "'", ","];
const CROWN_FAR = ["^", '"', "w", "v", ","];
const FACE_GRASS = ['"', "'", "w", "v", ",", "'"];
const BASE_LINE = ["_", "_", "_", "-"];
const GRASS_TIPS = ["'", '"', ",", "'"];
const HORIZON = ["_", "-", "."];
const SAND_DOTS = [".", ",", "`", "'"];
const WET_SAND = [":", ";", ".", ","];
const SAND_FAINT = ["`", ".", "'", "`"];
const WRACK_GLYPHS = ["#", "%", "&", "*"];

/**
 * One row of a grass clump, `k` blades either side of the centre. `offset`
 * leans the whole clump: negative to the left, positive to the right.
 */
function blades(k: number, offset: number): string {
  let row = "";
  for (let p = -k; p <= k; p++) {
    const d = p + offset;
    row += d < 0 ? "\\" : d === 0 ? "|" : "/";
  }
  return row;
}

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

function pick<T>(list: T[], r: number): T {
  return list[Math.min(list.length - 1, Math.floor(r * list.length))];
}

/** Catmull-Rom through the skyline points, plus a little wind-blown noise. */
function skyline(u: number): number {
  let i = 0;
  while (i < SKYLINE.length - 2 && SKYLINE[i + 1][0] <= u) i++;
  const p0 = SKYLINE[Math.max(0, i - 1)][1];
  const p1 = SKYLINE[i][1];
  const p2 = SKYLINE[i + 1][1];
  const p3 = SKYLINE[Math.min(SKYLINE.length - 1, i + 2)][1];
  const span = SKYLINE[i + 1][0] - SKYLINE[i][0];
  const t = Math.min(1, Math.max(0, (u - SKYLINE[i][0]) / span));
  const t2 = t * t;
  const t3 = t2 * t;
  const y =
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
  return Math.min(
    BEACH_LINE,
    y + 0.006 * Math.sin(u * 53) + 0.004 * Math.sin(u * 131 + 1)
  );
}

function cloudIntensity(u: number, y: number, t: number): number {
  const drift = t * CLOUD_DRIFT;
  let best = 0;

  for (let i = 0; i < WISPS.length; i++) {
    const w = WISPS[i];
    let du = u - w.x - drift;
    du -= Math.floor(du + 0.5); // wrap so wisps re-enter from the left
    const s = du / w.len;
    if (s < 0 || s > 1) continue;

    const feather = Math.pow(Math.sin(Math.PI * s), 0.6);
    const yc = w.y + w.dy * s + w.bend * Math.sin(Math.PI * s);
    // Lumpy thickness so the streaks puff up into cloud bodies
    const thick = w.thick * (0.8 + 0.5 * Math.sin(s * 21 + i * 2.3));
    const dy = (y - yc) / thick;
    const ripple = 0.75 + 0.25 * Math.sin(s * 38 + i * 1.7);
    best = Math.max(best, w.density * feather * Math.exp(-dy * dy) * ripple);
  }

  return best;
}

/** Gusts travel across the beach; -1 leans left, 1 leans right. */
function wind(u: number, t: number): number {
  return 0.7 * Math.sin(u * 9 - t * 1.1) + 0.3 * Math.sin(u * 23 + t * 0.7 + 2);
}

function leanIndex(lean: number): number {
  if (lean < -0.45) return 0;
  if (lean < -0.15) return 1;
  if (lean <= 0.15) return 2;
  if (lean <= 0.45) return 3;
  return 4;
}

export function buildScene(
  cols: number,
  rows: number,
  t: number,
  holes: Hole[] = []
): Scene {
  const cells: Scene = new Array(cols * rows).fill(null);
  const beachRow = Math.floor(BEACH_LINE * rows);

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

  const stamp = (
    col: number,
    row: number,
    text: string,
    material: Material,
    alpha: number
  ) => {
    for (let i = 0; i < text.length; i++) {
      set(col + i, row, text[i], material, alpha);
    }
  };

  for (let col = 0; col < cols; col++) {
    const u = (col + 0.5) / cols;
    const topRow = Math.min(beachRow, Math.floor(skyline(u) * rows));
    const hasDune = topRow < beachRow;
    const onLeftDune = u < LEFT_DUNE_END;

    const faceRows = beachRow - topRow;
    // Distant dunes sit back a little dimmer
    const far = onLeftDune ? 1 : 0.75;
    // Thick grass cap at the far-left end of the big dune, thinning out by
    // a third of the way along
    const capDepth = onLeftDune
      ? Math.round(faceRows * 0.35 * Math.max(0, 1 - u / 0.3))
      : 0;

    for (let row = 0; row < rows; row++) {
      const y = (row + 0.5) / rows;
      const r = hash(col, row);
      const r2 = hash(col, row, 1);

      if (row < topRow) {
        if (hasDune && row === topRow - 1 && r < 0.35) {
          set(col, row, pick(GRASS_TIPS, r2), "grass", 0.65 * far);
          continue;
        }

        // Block shades give the clouds solid bodies with soft edges
        const intensity = cloudIntensity(u, y, t);
        if (intensity < 0.08) continue;
        const dithered = intensity + (r - 0.5) * 0.15;

        if (dithered > 0.8) set(col, row, "█", "cloud", 0.5);
        else if (dithered > 0.55) set(col, row, "▓", "cloud", 0.55);
        else if (dithered > 0.3) set(col, row, "▒", "cloud", 0.55);
        else if (dithered > 0.12) set(col, row, "░", "cloud", 0.55);
        continue;
      }

      if (row < beachRow) {
        const faceT = (row - topRow) / faceRows; // 0 at the ridge, 1 at the base

        // A solid grass crest draws the skyline
        if (row === topRow) {
          set(
            col,
            row,
            pick(onLeftDune ? CROWN_TOP : CROWN_FAR, r2),
            "grass",
            0.9 * far
          );
          continue;
        }

        if (row - topRow <= capDepth) {
          if (r < 0.85) set(col, row, pick(CROWN_BODY, r2), "grass", 0.75);
          continue;
        }

        // Odd clumps on the slope, more toward the shaded left end
        const grassChance = onLeftDune
          ? 0.03 + 0.2 * Math.max(0, 1 - u / 0.2)
          : 0.06;
        if (r < grassChance) {
          set(col, row, pick(FACE_GRASS, r2), "grass", 0.6 * far);
          continue;
        }

        // Sand shaded from bright at the ridge to shadow at the base, with
        // diagonal bands running down the slope, so the face reads as one
        // rounded mass rather than a scatter of dots
        const hatch =
          Math.sin(
            col * 0.55 +
              (onLeftDune ? -1 : 1) * row * 1.7 +
              0.6 * Math.sin(col * 0.09)
          ) > 0.45;
        const bright = 1 - faceT * 0.8 - (hatch ? 0.25 : 0) + (r2 - 0.5) * 0.15;
        const ch =
          bright > 0.7 ? "=" : bright > 0.45 ? "-" : bright > 0.2 ? ":" : ".";
        set(col, row, ch, "sand", (0.35 + 0.35 * Math.max(0, bright)) * far);
        continue;
      }

      if (row === beachRow) {
        if (hasDune) {
          if (r < 0.95) set(col, row, pick(BASE_LINE, r2), "sand", 0.5 * far);
        } else if (r < 0.55) {
          set(col, row, pick(HORIZON, r2), "sand", 0.3);
        }
        continue;
      }

      // Flat sand: long wind ripples that stretch as they come toward the
      // viewer, darker wet streaks, and a faint carpet of grains between.
      const depth = (y - BEACH_LINE) / (1 - BEACH_LINE);
      const ripple = Math.sin(
        col * 0.35 * (1 - 0.45 * depth) +
          row * 0.55 +
          1.2 * Math.sin(col * 0.04 + row * 0.3)
      );
      const wet =
        Math.sin(col * 0.06 - row * 0.25 + 1.5) +
          0.5 * Math.sin(col * 0.13 + row * 0.4) >
        0.95;

      if (ripple > 0.8 && r < 0.97) {
        set(col, row, "~", "sand", 0.3 + 0.1 * r2);
      } else if (ripple > 0.5 && r < 0.9) {
        set(col, row, "-", "sand", 0.24 + 0.08 * r2);
      } else if (wet && r < 0.85) {
        set(col, row, pick(WET_SAND, r2), "wet", 0.3 + 0.1 * r2);
      } else if (r < 0.45) {
        set(col, row, pick(SAND_DOTS, r2), "sand", 0.18 + 0.08 * r2);
      } else if (r < 0.75) {
        set(col, row, pick(SAND_FAINT, r2), "sand", 0.12 + 0.05 * r2);
      }
    }
  }

  // Narrow grids can't fit every clump without them merging into a hedge
  const sparse = cols < 90;

  // Keep clumps above the footer text along the bottom edge
  const lowestRow = rows - 5;

  TUFTS.forEach(([x, y], i) => {
    if (sparse && i % 2) return;
    const size = Math.min(sparse ? 2 : 3, y > 0.78 ? 3 : y > 0.7 ? 2 : 1);
    const base = Math.min(Math.round(y * rows), lowestRow);
    const top = base - (size - 1);
    if (top <= beachRow) return;
    const col = Math.round(x * cols);
    const offset = leanIndex(wind(x, t)) - 2;
    const alpha = 0.55 + 0.1 * size;

    for (let k = 1; k <= size; k++) {
      stamp(col - k, top + k - 1, blades(k, offset), "grass", alpha);
    }
    // A little shadow grounds the clump on the sand
    for (let p = -size; p <= size; p++) {
      if (hash(col + p, base + 1, 5) < 0.6) {
        set(col + p, base + 1, p % 2 ? "." : ",", "wet", 0.35);
      }
    }
  });

  WRACK.forEach(([x, y, width], i) => {
    if (sparse && i % 2) return;
    const w = width + (y > 0.74 && !sparse ? 1 : 0); // nearer clumps look bigger
    const row = Math.min(Math.round(y * rows), lowestRow);
    if (row <= beachRow) return;
    const col = Math.round(x * cols) - Math.floor(w / 2);

    for (let p = 0; p < w; p++) {
      set(
        col + p,
        row,
        pick(WRACK_GLYPHS, hash(col + p, row, 3)),
        "wrack",
        0.6
      );
    }
    // Bigger clumps get a second, narrower row underneath
    if (w >= 3 && !sparse) {
      for (let p = 1; p < w; p++) {
        set(
          col + p,
          row + 1,
          pick(WRACK_GLYPHS, hash(col + p, row + 1, 4)),
          "wrack",
          0.45
        );
      }
    }
  });

  // Knock out the cells behind overlaid text, with a column of breathing
  // room either side, so it reads as written into the scene
  for (const h of holes) {
    for (let row = Math.max(0, h.r0); row <= Math.min(rows - 1, h.r1); row++) {
      for (
        let col = Math.max(0, h.c0 - 1);
        col <= Math.min(cols - 1, h.c1 + 1);
        col++
      ) {
        cells[row * cols + col] = null;
      }
    }
  }

  return cells;
}
