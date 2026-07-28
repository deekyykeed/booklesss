"use client";

import { useEffect, useId, useRef, useState } from "react";
import { smoothPath } from "./StudyChart";

/* ------------------------------------------------------------------ *
 * The tile-and-card sparkline — a backdrop, not a figure beside the number.
 *
 * Anchored to the bottom of whatever box it's given and spanning its full
 * width, behind the text, at a fraction of the ink it would have as a
 * foreground element: the line carries the shape, the wash gives it a floor,
 * and nothing is labelled — it's atmosphere with the true curve, and the
 * numbers in front are the data. Same monotone-cubic as the big chart, so
 * even the backdrop can't overshoot what happened.
 *
 * Width is measured (ResizeObserver) rather than stretched through a
 * viewBox — preserveAspectRatio="none" would distort the stroke.
 *
 * Shared by the stat tiles and the course cards so the two read as one set.
 * ------------------------------------------------------------------ */

/** The pale end of a Plump gradient: the hue mixed toward white, the same
 *  arithmetic the icon generator uses, so line and icon share their stops. */
export function pale(hex: string, t: number): string {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return "#" + c.map((v) => Math.round(v + (255 - v) * t).toString(16).padStart(2, "0")).join("");
}

export function Spark({
  series,
  tone,
  height = 62,
  /** Where the curve starts, as a fraction of the width. The tiles keep it to
   *  the right half, clear of the number and the delta; a card with nothing
   *  else on that line can run it wider. */
  from = 0.5,
  /** How far short of the right edge the curve's head stops. The wash still
   *  runs to the edge; this is only so the head dot clears a rounded corner. */
  padRight = 5,
}: {
  /** The stat's recent history, oldest first. */
  series: number[];
  tone: string;
  height?: number;
  from?: number;
  padRight?: number;
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setW(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = height;
  const TOP = 6;
  /* The curve opens with a zero anchor so it lifts out of the floor instead
   * of materialising mid-air. The anchor is a drawing convention, not a
   * datum — the real days follow it. */
  const LEFT = Math.round(w * from);
  const max = Math.max(...series);
  const n = series.length;

  return (
    <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: H }}>
      {w > LEFT && n > 1 && max > 0 && (() => {
        const drawn = [0, ...series];
        /* Shy of the right edge, so the head dot isn't halved by the card's
           overflow clip. */
        const pts = drawn.map((v, i) => ({
          x: LEFT + (i * (w - LEFT - padRight)) / (drawn.length - 1),
          y: TOP + (1 - v / max) * (H - TOP),
        }));
        const line = smoothPath(pts);
        /* The line stops shy of the edge for the head's sake, but the wash
           carries on flat to the card edge — otherwise that gap reads as a
           seam between the fill and the corner. */
        const area = `${line} L${w} ${pts[pts.length - 1].y.toFixed(1)} L${w} ${H} L${LEFT} ${H} Z`;
        return (
          <svg width={w} height={H} className="block">
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={tone} stopOpacity="0.10" />
                <stop offset="1" stopColor={tone} stopOpacity="0" />
              </linearGradient>
              {/* The line wears the icon's own gradient, pale stop to main
                  colour, still fading in — faint where the window begins,
                  arriving at full presence at today. */}
              <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={pale(tone, 0.55)} stopOpacity="0.12" />
                <stop offset="1" stopColor={tone} stopOpacity="0.9" />
              </linearGradient>
              <filter id={`${id}f`} x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.3" floodColor={tone} floodOpacity="0.45" />
              </filter>
            </defs>
            <path d={area} fill={`url(#${id})`} />
            <path d={line} fill="none" stroke={`url(#${id}s)`} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {/* Today: a white head ringed in the line's main colour, lifted
                off the card by a shadow in the same hue — an open point where
                the line has got to, not a plug on the end. */}
            <circle
              cx={pts[pts.length - 1].x}
              cy={pts[pts.length - 1].y}
              r="3.5"
              fill="#ffffff"
              stroke={tone}
              strokeWidth="1.2"
              filter={`url(#${id}f)`}
            />
          </svg>
        );
      })()}
    </div>
  );
}
