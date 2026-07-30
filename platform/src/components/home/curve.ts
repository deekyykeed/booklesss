/**
 * A smooth path through the points — monotone cubic, not a plain spline.
 *
 * The distinction matters here rather than being a preference. A cardinal or
 * Catmull-Rom curve overshoots around a peak: after a 47-minute day between two
 * quiet ones, it dips below the baseline on the way out and draws negative
 * minutes, and it rounds the top up past 47 to a number nobody recorded. The
 * Fritsch–Carlson filter below clamps the tangents so the curve can never
 * overshoot a local extreme — every point on the line stays within the values
 * either side of it. The curve is a reading aid; it must not invent data.
 *
 * That rule holds for a backdrop as much as for a figure, which is why the
 * sparklines draw through here too.
 */
export function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return pts.length ? `M${pts[0].x} ${pts[0].y}` : "";

  const n = pts.length;
  const h: number[] = []; // x spacing
  const d: number[] = []; // secant slopes
  for (let i = 0; i < n - 1; i++) {
    h[i] = pts[i + 1].x - pts[i].x;
    d[i] = h[i] === 0 ? 0 : (pts[i + 1].y - pts[i].y) / h[i];
  }

  /* Averaged secants — except at a turning point, where the tangent must be
   * flat. When the secants either side disagree in sign the day is a local peak
   * or trough, and any non-zero tangent there sends the curve past it: a zero
   * day between a busy one and a quiet one would be drawn as negative minutes.
   * This is the step that keeps the line inside the data. */
  const m: number[] = [d[0]];
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  }
  m[n - 1] = d[n - 2];

  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      // A flat run stays flat — no bulge between two equal days.
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }

  let out = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const t = h[i] / 3;
    const c1x = pts[i].x + t;
    const c1y = pts[i].y + m[i] * t;
    const c2x = pts[i + 1].x - t;
    const c2y = pts[i + 1].y - m[i + 1] * t;
    out += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${pts[i + 1].x.toFixed(1)} ${pts[i + 1].y.toFixed(1)}`;
  }
  return out;
}
