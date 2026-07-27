"use client";

import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ *
 * Completion ring — one shape, three sizes, used everywhere progress is
 * shown: beside each step in the sidebar (14px), in the right panel's
 * header (18px), and on the end-of-step card (44px).
 *
 * The arc animates its dash offset, so ticking a checkpoint sweeps the ring
 * forward rather than jumping. At 100% a brand-green disc with a check fades
 * over the top — remounted on each transition to complete, so the pop replays
 * every time (a CSS animation on a persistent element only ever fires once).
 * ------------------------------------------------------------------ */

type Props = {
  /** 0..1. Values outside the range are clamped. */
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
  /** Accessible label; omit to leave the ring decorative. */
  label?: string;
};

export function CompletionRing({ value, size = 16, stroke = 2, className, style, label }: Props) {
  const v = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const complete = v >= 1;
  const c = size / 2;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  // Check drawn as fractions of the box, so one path serves every size.
  const check = `M${size * 0.29} ${size * 0.52}L${size * 0.44} ${size * 0.67}L${size * 0.72} ${size * 0.35}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={"shrink-0 " + (className ?? "")}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} opacity={0.16} />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - v)}
        transform={`rotate(-90 ${c} ${c})`}
        style={{ transition: "stroke-dashoffset 420ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      {/* key: remount on each completion so ringPop replays */}
      <g key={complete ? "done" : "todo"} className={complete ? "ring-pop" : undefined} style={{ opacity: complete ? 1 : 0 }}>
        <circle cx={c} cy={c} r={c} fill="var(--color-brand)" />
        <path
          d={check}
          fill="none"
          stroke="#fff"
          strokeWidth={Math.max(1.25, size * 0.115)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
