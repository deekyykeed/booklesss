"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { StudyDay } from "@/lib/progress";

/* ------------------------------------------------------------------ *
 * Time studied, one week at a view.
 *
 * The plot is a Monday-to-Sunday week — seven slots, always — and the
 * chevrons page back through earlier weeks, as far as the first recorded
 * day and no further. The current week draws its line only up to today:
 * the remaining weekday labels stand as empty slots rather than a line
 * confidently reporting zeroes for days that haven't happened.
 *
 * One series — minutes read per day — so there is no legend: the heading names
 * what's plotted. The line carries the readable step of the brand green
 * (#17754d, 4.6:1 on the card); the wash beneath is the light step at 10%,
 * which is too pale to read as a line on its own and is only there to give the
 * curve a body. Grid and every label wear text tokens, never the series colour.
 *
 * Minutes come from StudyClock, which only counts a visible tab with recent
 * interaction — see its accrual rules. Days before that shipped hold checkpoint
 * counts but no time, so the line legitimately sits at zero across them while
 * the tooltip still reports the checkpoints. Nothing here is estimated.
 * ------------------------------------------------------------------ */

const H = 152;
const PAD = { t: 16, r: 12, b: 24, l: 34 };

const LINE = "#17754d"; // --color-brand-deep
const WASH = "#3ecf8e"; // --color-brand, at 10%

/** Clean tick values, so the axis never reads 7.3 minutes. */
function niceMax(minutes: number): number {
  if (minutes <= 10) return 10;
  for (const step of [15, 20, 30, 45, 60, 90, 120]) if (minutes <= step) return step;
  return Math.ceil(minutes / 60) * 60;
}

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Monday of the week `back` weeks before the one containing today. Local
 *  time throughout — study days are recorded against local dates. */
function mondayOf(back: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - back * 7);
  return d;
}

const fmtDay = (iso: string, long = false) => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, long
    ? { weekday: "short", day: "numeric", month: "short" }
    : { day: "numeric", month: "short" });
};

/** "21–27 Jul" / "28 Jul – 3 Aug" — the visible week, tersely. */
function fmtRange(mon: Date): string {
  const sun = new Date(mon);
  sun.setDate(sun.getDate() + 6);
  const m = (d: Date) => d.toLocaleDateString(undefined, { month: "short" });
  return m(mon) === m(sun)
    ? `${mon.getDate()}–${sun.getDate()} ${m(sun)}`
    : `${mon.getDate()} ${m(mon)} – ${sun.getDate()} ${m(sun)}`;
}

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

const fmtMins = (secs: number) => {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StudyChart({ days, hydrated }: { days: Record<string, StudyDay>; hydrated: boolean }) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(680);
  const [cursor, setCursor] = useState<number | null>(null);
  /** Weeks back from the current one. 0 = this week. */
  const [back, setBack] = useState(0);

  /* Measured rather than a scaling viewBox: preserveAspectRatio="none" would
   * stretch the 2px stroke and turn the end marker into an ellipse.
   *
   * Keyed on hydrated as well as mount. The measured box is only in the tree
   * once there's a chart to measure, so on a first paint that renders the
   * placeholder the ref is still null — an effect that ran only on mount would
   * bail there and leave the chart stuck at its default width forever. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setW(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [hydrated]);

  const monday = useMemo(() => mondayOf(back), [back]);
  const todayIso = isoDay(new Date());

  /* The seven slots of the visible week, gaps filled with zeroes. `drawn` is
   * the prefix the line may cover — everything for a past week, up to today
   * for the current one. Future days keep their slot and label but get no
   * line: an absence is not a measurement. */
  const series = useMemo(() => {
    const out: (StudyDay & { date: string })[] = [];
    const cursor = new Date(monday);
    for (let i = 0; i < 7; i++) {
      const date = isoDay(cursor);
      out.push({ date, ...(days[date] ?? { checks: 0, secs: 0, steps: 0 }) });
      cursor.setDate(cursor.getDate() + 1);
    }
    return out;
  }, [days, monday]);
  const drawn = useMemo(
    () => (back === 0 ? series.filter((d) => d.date <= todayIso) : series),
    [series, back, todayIso],
  );

  /* Paging stops at the first recorded day — an endless run of provably empty
   * weeks is scrolling for its own sake. With nothing recorded at all there is
   * nowhere to go. */
  const earliest = useMemo(() => {
    let min: string | undefined;
    for (const [date, d] of Object.entries(days)) {
      if ((d.secs || d.checks) && (!min || date < min)) min = date;
    }
    return min;
  }, [days]);
  const canGoBack = !!earliest && earliest < series[0].date;

  const plotW = Math.max(1, w - PAD.l - PAD.r);
  const plotH = H - PAD.t - PAD.b;
  const max = niceMax(Math.max(...drawn.map((d) => d.secs / 60), 0));
  const step = plotW / 6; // seven slots, six gaps — fixed, so Mon–Sun always fills the width

  const x = useCallback((i: number) => PAD.l + i * step, [step]);
  const y = useCallback((mins: number) => PAD.t + plotH - (mins / max) * plotH, [plotH, max]);

  const line = useMemo(
    () => smoothPath(drawn.map((d, i) => ({ x: x(i), y: y(d.secs / 60) }))),
    [drawn, x, y],
  );
  const area = drawn.length > 1
    ? `${line} L${x(drawn.length - 1).toFixed(1)} ${PAD.t + plotH} L${PAD.l} ${PAD.t + plotH} Z`
    : "";

  const totalSecs = drawn.reduce((n, d) => n + d.secs, 0);
  /* With nothing recorded, a line pinned to the baseline is worse than no line:
   * it draws a confident zero across a week nobody has studied, which looks
   * like a measurement rather than an absence. The axes stay so the shape is
   * legible; the plot says what's missing. */
  const hasData = totalSecs > 0;
  const active = hasData && cursor !== null ? drawn[cursor] : undefined;
  /* The peak is the one point worth a direct label — a number on every day
   * would crowd even seven points, and the tooltip has the rest. */
  const peak = drawn.reduce((best, d, i) => (d.secs > (drawn[best]?.secs ?? 0) ? i : best), 0);
  const showPeak = hasData && cursor === null;

  const page = (dir: 1 | -1) => {
    setCursor(null);
    setBack((b) => Math.max(0, b + dir));
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!step || !hasData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - rect.left - PAD.l) / step);
    setCursor(Math.min(drawn.length - 1, Math.max(0, i)));
  };

  const onKey = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!hasData) return;
    const last = drawn.length - 1;
    const at = cursor ?? last;
    if (e.key === "ArrowLeft") setCursor(Math.max(0, at - 1));
    else if (e.key === "ArrowRight") setCursor(Math.min(last, at + 1));
    else if (e.key === "Home") setCursor(0);
    else if (e.key === "End") setCursor(last);
    else if (e.key === "Escape") setCursor(null);
    else return;
    e.preventDefault();
  };

  if (!hydrated) return <div className="chart-frame" style={{ height: H }} />;

  const weekLabel = back === 0 ? "This week" : back === 1 ? "Last week" : fmtRange(monday);

  return (
    <div>
      {/* The week being looked at, and the way to earlier ones. */}
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-[12px] font-medium text-muted">
          {weekLabel}
          {back > 0 && <span className="text-placeholder"> · {fmtRange(monday)}</span>}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => page(1)}
            disabled={!canGoBack}
            aria-label="Earlier week"
            title="Earlier week"
            className="squircle grid h-6 w-6 place-items-center rounded-lg text-muted transition-colors hover:bg-active hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={back === 0}
            aria-label="Later week"
            title="Later week"
            className="squircle grid h-6 w-6 place-items-center rounded-lg text-muted transition-colors hover:bg-active hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      {/* data-no-swipe: the plot is an interactive horizontal surface — a
          finger sweeping the crosshair must never read as a drawer swipe. */}
      <div ref={box} className="relative" data-no-swipe>
        <svg
          width={w}
          height={H}
          role="img"
          tabIndex={0}
          aria-label={
            hasData
              ? `Minutes studied per day, ${weekLabel.toLowerCase()} (${fmtRange(monday)}). ${fmtMins(totalSecs)} in total.`
              : `Minutes studied per day, ${weekLabel.toLowerCase()} (${fmtRange(monday)}). Nothing recorded.`
          }
          onPointerMove={onMove}
          onPointerLeave={() => setCursor(null)}
          onBlur={() => setCursor(null)}
          onKeyDown={onKey}
          className="block touch-pan-y focus:outline-none"
        >
          <defs>
            {/* The head's lift — same recipe as the stat-tile sparklines, so
                every line on the dashboard ends the same way. */}
            <filter id={`${id}f`} x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.3" floodColor={LINE} floodOpacity="0.45" />
            </filter>
          </defs>
          {/* gridlines: hairline, solid, one step off the surface */}
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line
                x1={PAD.l}
                x2={PAD.l + plotW}
                y1={y(max * f)}
                y2={y(max * f)}
                stroke="var(--color-line)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <text
                x={PAD.l - 8}
                y={y(max * f) + 3.5}
                textAnchor="end"
                className="fill-[var(--color-placeholder)] text-[10px] tabular-nums"
              >
                {Math.round(max * f)}
              </text>
            </g>
          ))}

          {hasData ? (
            <>
              <path d={area} fill={WASH} fillOpacity="0.1" />
              <path d={line} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </>
          ) : (
            <text
              x={PAD.l + plotW / 2}
              y={PAD.t + plotH / 2 + 4}
              textAnchor="middle"
              className="fill-[var(--color-muted)] text-[12.5px]"
            >
              {back === 0
                ? "No reading time yet this week — open a step and this fills in."
                : "Nothing recorded this week."}
            </text>
          )}

          {/* x labels: the seven weekdays, every one — that's the point of a
              week view. Days yet to happen sit dimmer. */}
          {series.map((d, i) => (
            <text
              key={d.date}
              x={x(i)}
              y={H - 7}
              textAnchor={i === 0 ? "start" : i === 6 ? "end" : "middle"}
              className={
                d.date > todayIso
                  ? "fill-[var(--color-line-2)] text-[10px]"
                  : d.date === todayIso
                    ? "fill-[var(--color-muted)] text-[10px] font-semibold"
                    : "fill-[var(--color-placeholder)] text-[10px]"
              }
            >
              {WEEKDAYS[i]}
            </text>
          ))}

          {/* The head of the line — today in the current week, Sunday in a past
              one. Always drawn (the crosshair dot simply lands on top of it when
              the cursor reaches the end), so the reader can see where the line
              ends without hovering. White with the line's ring and a shadow in
              the same hue — the head design the stat-tile sparklines wear. */}
          {hasData && drawn.length > 0 && (
            <circle
              cx={x(drawn.length - 1)}
              cy={y(drawn[drawn.length - 1].secs / 60)}
              r="3.5"
              fill="#ffffff"
              stroke={LINE}
              strokeWidth="1.2"
              filter={`url(#${id}f)`}
            />
          )}

          {showPeak && (
            <text
              x={Math.min(Math.max(x(peak), PAD.l + 16), PAD.l + plotW - 16)}
              y={Math.max(y(drawn[peak].secs / 60) - 9, 11)}
              textAnchor="middle"
              className="fill-[var(--color-ink)] text-[10.5px] font-semibold"
            >
              {fmtMins(drawn[peak].secs)}
            </text>
          )}

          {/* the crosshair finds the X — readers aim at a day, not a 2px line */}
          {active && (
            <>
              <line
                x1={x(cursor!)}
                x2={x(cursor!)}
                y1={PAD.t - 4}
                y2={PAD.t + plotH}
                stroke="var(--color-line-2)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <circle
                cx={x(cursor!)}
                cy={y(active.secs / 60)}
                r="3.5"
                fill="#ffffff"
                stroke={LINE}
                strokeWidth="1.2"
                filter={`url(#${id}f)`}
              />
            </>
          )}
        </svg>

        {active && (
          <div
            className="chart-tip"
            style={{
              left: Math.min(Math.max(x(cursor!), 54), Math.max(w - 54, 54)),
              top: Math.max(y(active.secs / 60) - 12, 0),
            }}
          >
            <p className="font-semibold text-ink">{fmtMins(active.secs)}</p>
            <p className="text-[11px] text-muted">{fmtDay(active.date, true)}</p>
            {active.checks > 0 && (
              <p className="text-[11px] text-muted">
                {active.checks} checkpoint{active.checks === 1 ? "" : "s"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Everything the hover shows, reachable without hovering. */}
      <details className="chart-table">
        <summary>View as table</summary>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Checkpoints</th>
            </tr>
          </thead>
          <tbody>
            {drawn.filter((d) => d.secs || d.checks).map((d) => (
              <tr key={d.date}>
                <td>{fmtDay(d.date, true)}</td>
                <td className="tabular-nums">{fmtMins(d.secs)}</td>
                <td className="tabular-nums">{d.checks}</td>
              </tr>
            ))}
            {!drawn.some((d) => d.secs || d.checks) && (
              <tr>
                <td colSpan={3}>Nothing recorded this week.</td>
              </tr>
            )}
          </tbody>
        </table>
      </details>
    </div>
  );
}
