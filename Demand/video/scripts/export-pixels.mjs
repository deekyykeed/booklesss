/* Every pixel object as its own asset file.
 *
 *   node scripts/export-pixels.mjs
 *
 * Reads src/explainer/pixel-art.ts (Node runs the .ts directly — type
 * stripping) and writes, per object, into public/assets/pixel/:
 *   <name>.svg        crisp at any size (shape-rendering: crispEdges)
 *   <name>@16x.png    transparent PNG, one source pixel = 16x16 — drop-in for
 *                     Canva, Figma, CapCut, a slide
 * plus _sheet.png, every object on one board, for picking.
 *
 * PNGs are encoded here with node:zlib, so there's nothing to install. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync, crc32 } from "node:zlib";
import { ICONS } from "../src/explainer/pixel-art.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "assets", "pixel");
mkdirSync(OUT, { recursive: true });

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

function grid(art) {
  const w = Math.max(...art.rows.map((r) => r.length));
  return { w, h: art.rows.length, at: (x, y) => art.pal[art.rows[y][x]] ?? null };
}

function svg(art) {
  const g = grid(art);
  let rects = "";
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++) {
      const c = g.at(x, y);
      if (c) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`;
    }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g.w} ${g.h}" width="${g.w * 16}" height="${g.h * 16}" shape-rendering="crispEdges">${rects}</svg>\n`;
}

function png(width, height, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* paint one object into an RGBA buffer at (ox, oy), `s` px per source pixel */
function paint(buf, bw, art, ox, oy, s) {
  const g = grid(art);
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++) {
      const c = g.at(x, y);
      if (!c) continue;
      const [r, gg, b] = hex(c);
      for (let dy = 0; dy < s; dy++)
        for (let dx = 0; dx < s; dx++) {
          const i = ((oy + y * s + dy) * bw + (ox + x * s + dx)) * 4;
          buf[i] = r;
          buf[i + 1] = gg;
          buf[i + 2] = b;
          buf[i + 3] = 255;
        }
    }
}

const names = Object.keys(ICONS);
for (const name of names) {
  const art = ICONS[name];
  const g = grid(art);
  writeFileSync(join(OUT, `${name}.svg`), svg(art));
  const S = 16;
  const buf = Buffer.alloc(g.w * S * g.h * S * 4);
  paint(buf, g.w * S, art, 0, 0, S);
  writeFileSync(join(OUT, `${name}@16x.png`), png(g.w * S, g.h * S, buf));
}

// the board: a grid of every object on warm paper, for choosing at a glance
const CELL = 200;
const COLS = 5;
const ROWS = Math.ceil(names.length / COLS);
const bw = COLS * CELL;
const bh = ROWS * CELL;
const board = Buffer.alloc(bw * bh * 4);
for (let i = 0; i < bw * bh; i++) board.set([233, 231, 225, 255], i * 4);
names.forEach((name, k) => {
  const g = grid(ICONS[name]);
  const s = Math.floor(150 / Math.max(g.w, g.h));
  const ox = (k % COLS) * CELL + Math.floor((CELL - g.w * s) / 2);
  const oy = Math.floor(k / COLS) * CELL + Math.floor((CELL - g.h * s) / 2);
  paint(board, bw, ICONS[name], ox, oy, s);
});
writeFileSync(join(OUT, "_sheet.png"), png(bw, bh, board));

console.log(`${names.length} objects -> public/assets/pixel/ (svg + @16x png each, _sheet.png): ${names.join(", ")}`);
