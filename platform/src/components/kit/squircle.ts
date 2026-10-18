/* Continuous ("squircle") corners — the superellipse feel the reference
 * widgets have and a CSS border-radius cannot draw. A border-radius corner is
 * a quarter circle that meets the straight edge with a visible kink in
 * curvature; a squircle starts bending earlier and eases into the arc, so the
 * corner reads as one soft surface (owner, 2026-10-18: "the components need
 * that super ellipse on them … that squircle feel").
 *
 * This is the smoothed corner Figma and iOS use: a short circular arc at the
 * middle of the corner, joined to each edge by two cubic Béziers whose length
 * is set by `smoothing` (0 = plain circle, 0.6 = iOS, 1 = longest blend). The
 * corner spans (1 + smoothing) × radius along each edge; when a side is too
 * short for that, smoothing is reduced for that corner rather than the shape
 * being distorted.
 *
 * MEASURED, NOT GUESSED: the Jay tiles fit radius 62.5 with smoothing 0.8 (at
 * 1x) — read off the reference's own edge pixels row by row, rmse ~1.4px. */

type Corner = { a: number; b: number; c: number; d: number; p: number; arc: number; r: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

export function corner(r: number, smoothing: number, budget: number): Corner {
  if (r <= 0) return { a: 0, b: 0, c: 0, d: 0, p: 0, arc: 0, r: 0 };
  const radius = Math.min(r, budget);
  let s = smoothing;
  let p = (1 + s) * radius;
  s = Math.max(0, Math.min(s, budget / radius - 1));
  p = Math.min(p, budget);
  const arcMeasure = 90 * (1 - s);
  const arc = Math.sin(rad(arcMeasure / 2)) * radius * Math.SQRT2;
  const alpha = (90 - arcMeasure) / 2;
  const p3ToP4 = radius * Math.tan(rad(alpha / 2));
  const beta = 45 * s;
  const c = p3ToP4 * Math.cos(rad(beta));
  const d = c * Math.tan(rad(beta));
  const b = (p - arc - c - d) / 3;
  const a = 2 * b;
  return { a, b, c, d, p, arc, r: radius };
}

const n = (v: number) => +v.toFixed(2);

/* Relative path commands for one corner, starting where the straight edge
 * ends. `dir` is the edge being left: the corner turns clockwise from it. */
function turn(k: Corner, dir: "right" | "down" | "left" | "up"): string {
  const { a, b, c, d, arc, r } = k;
  if (!r) return "";
  const s = a + b + c;
  switch (dir) {
    case "right": // top-right
      return `c ${n(a)} 0 ${n(a + b)} 0 ${n(s)} ${n(d)} a ${n(r)} ${n(r)} 0 0 1 ${n(arc)} ${n(arc)} c ${n(d)} ${n(c)} ${n(d)} ${n(b + c)} ${n(d)} ${n(s)}`;
    case "down": // bottom-right
      return `c 0 ${n(a)} 0 ${n(a + b)} ${n(-d)} ${n(s)} a ${n(r)} ${n(r)} 0 0 1 ${n(-arc)} ${n(arc)} c ${n(-c)} ${n(d)} ${n(-(b + c))} ${n(d)} ${n(-s)} ${n(d)}`;
    case "left": // bottom-left
      return `c ${n(-a)} 0 ${n(-(a + b))} 0 ${n(-s)} ${n(-d)} a ${n(r)} ${n(r)} 0 0 1 ${n(-arc)} ${n(-arc)} c ${n(-d)} ${n(-c)} ${n(-d)} ${n(-(b + c))} ${n(-d)} ${n(-s)}`;
    case "up": // top-left
      return `c 0 ${n(-a)} 0 ${n(-(a + b))} ${n(d)} ${n(-s)} a ${n(r)} ${n(r)} 0 0 1 ${n(arc)} ${n(-arc)} c ${n(c)} ${n(-d)} ${n(b + c)} ${n(-d)} ${n(s)} ${n(-d)}`;
  }
}

/** A w×h rectangle with squircle corners, as an SVG path string (also valid
 *  inside CSS `clip-path: path("…")`). `r` is one radius or [tl, tr, br, bl]. */
export function squirclePath(
  w: number,
  h: number,
  r: number | [number, number, number, number],
  smoothing = 0.6,
): string {
  const [tl, tr, br, bl] = typeof r === "number" ? [r, r, r, r] : r;
  const budget = Math.min(w, h) / 2;
  const TL = corner(tl, smoothing, budget);
  const TR = corner(tr, smoothing, budget);
  const BR = corner(br, smoothing, budget);
  const BL = corner(bl, smoothing, budget);
  return [
    `M ${n(w - TR.p)} 0`,
    turn(TR, "right") || `L ${n(w)} 0`,
    `L ${n(w)} ${n(h - BR.p)}`,
    turn(BR, "down") || `L ${n(w)} ${n(h)}`,
    `L ${n(BL.p)} ${n(h)}`,
    turn(BL, "left") || `L 0 ${n(h)}`,
    `L 0 ${n(TL.p)}`,
    turn(TL, "up") || "L 0 0",
    "Z",
  ].join(" ");
}

/** The same shape as a CSS clip-path value. */
export const squircleClip = (...args: Parameters<typeof squirclePath>) => `path("${squirclePath(...args)}")`;

/* Happy Files' silhouette with squircle corners: a tab on the left whose
 * right shoulder falls in an S to the body's top edge. Drawn on the folder's
 * own 286-wide grid (the reference's @2x units). `bottom` is 204 for the face
 * and 244 for the lip under it. */
export function folderPath(bottom: number): string {
  const top = 45; // the body's top edge, right of the shoulder
  const side = (bottom - top) / 2;
  const TL = corner(62, 0.6, 104);
  const TR = corner(58, 0.6, side);
  const BR = corner(58, 0.6, side);
  const BL = corner(58, 0.6, Math.min(143, bottom - TL.p));
  return [
    `M ${n(TL.p)} 0`,
    "L 112 0",
    "C 130 0 134 45 154 45",
    `L ${n(286 - TR.p)} ${top}`,
    turn(TR, "right"),
    `L 286 ${n(bottom - BR.p)}`,
    turn(BR, "down"),
    `L ${n(BL.p)} ${bottom}`,
    turn(BL, "left"),
    `L 0 ${n(TL.p)}`,
    turn(TL, "up"),
    "Z",
  ].join(" ");
}
