"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

/* Scales a fixed-size widget down to the width it is given, never up. The
 * widgets are drawn at the reference's own 1x size (half the Paper board's
 * @2x), so on a phone a 563px card has to shrink to ~358px without
 * reflowing — `zoom` rather than `transform: scale` because zoom also shrinks
 * the box the widget occupies, so the page below it moves up with it.
 * Hidden until measured, then faded in, so a phone never paints the
 * full-size widget overflowing for a frame before hydration. */
export function Fit({ w, children }: { w: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const measure = () => {
      setZoom(Math.min(1, host.clientWidth / w));
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div
      ref={ref}
      className="kit-fit"
      data-ready={ready ? "" : undefined}
      style={{ width: w, zoom } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* The gradient glass button: a face, a lip under it (the button's thickness)
 * and a glow under that. The face's top-right sheen follows the pointer —
 * the one thing the Paper board cannot show. `state` forces a look for the
 * states row; left out, the button is live. */
export function GlassButton({
  children,
  onClick,
  disabled,
  state,
  label,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  state?: "hover" | "pressed";
  label?: string;
}) {
  const face = useRef<HTMLSpanElement>(null);

  const follow = (e: PointerEvent<HTMLButtonElement>) => {
    const el = face.current;
    if (!el || state) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${Math.max(8, Math.min(92, x))}%`);
    el.style.setProperty("--my", `${Math.max(2, Math.min(60, y))}%`);
  };
  const rest = () => {
    face.current?.style.removeProperty("--mx");
    face.current?.style.removeProperty("--my");
  };

  return (
    <button
      type="button"
      className="kit-gbtn"
      data-state={state}
      disabled={disabled}
      onClick={onClick}
      onPointerMove={follow}
      onPointerLeave={rest}
      aria-label={label}
    >
      <span className="kit-gbtn-glow" aria-hidden />
      <span className="kit-gbtn-lip" aria-hidden />
      <span ref={face} className="kit-gbtn-face">
        {children}
      </span>
    </button>
  );
}

/* Happy Files' folder, drawn as vectors. The face is a mesh of blurred colour
 * blobs clipped to the silhouette (peach top-left, coral right, a blue dome
 * rising from the bottom), under a cream inner glow along the top contour and
 * a thin peach halo outside it; the lip under it is the folder's thickness.
 * Every value was matched against the reference crop by rendering both side
 * by side, so change one and re-check. The ids are per-instance (useId) —
 * three folders on one page would otherwise share one set of filters. */
const TOP = "M0 62 A62 62 0 0 1 62 0 H112 C130 0 134 45 154 45 H228 A58 58 0 0 1 286 103";
const LIP = `${TOP} V186 A58 58 0 0 1 228 244 H58 A58 58 0 0 1 0 186 Z`;
const FACE = `${TOP} V146 A58 58 0 0 1 228 204 H58 A58 58 0 0 1 0 146 Z`;

export function HappyFolder({ className, style }: { className?: string; style?: CSSProperties }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `hf${uid}${n}`;
  const url = (n: string) => `url(#${id(n)})`;
  const blur = (n: string, s: number) => (
    <filter id={id(n)} x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation={s} />
    </filter>
  );

  return (
    <svg className={className} style={style} viewBox="0 0 420 400" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id("face")}>
          <path d={FACE} />
        </clipPath>
        <clipPath id={id("lip")}>
          <path d={LIP} />
        </clipPath>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="0" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF5EC" stopOpacity="1" />
          <stop offset="0.3" stopColor="#FFF4EA" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={id("halo")} x1="0" y1="0" x2="0" y2="244" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F6D3C3" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#F3D9D6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#E4E2F6" stopOpacity="0.2" />
        </linearGradient>
        {blur("b26", 26)}
        {blur("b16", 16)}
        {blur("b6", 6)}
        {blur("b2", 1.8)}
        {blur("b1", 0.9)}
        {blur("glow", 18)}
      </defs>
      <g transform="translate(67 45)">
        <ellipse cx="143" cy="236" rx="135" ry="36" fill="#6A6CFF" opacity="0.4" filter={url("glow")} />
        <path d={LIP} fill="none" stroke={url("halo")} strokeWidth="2.6" filter={url("b1")} />
        <g clipPath={url("lip")}>
          <rect x="-20" y="-20" width="330" height="290" fill="#8693FC" />
          <ellipse cx="300" cy="228" rx="110" ry="60" fill="#B2A8F6" filter={url("b26")} />
          <ellipse cx="-10" cy="225" rx="70" ry="50" fill="#8F90FC" filter={url("b16")} />
          <path d={LIP} fill="none" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="7" filter={url("b6")} />
        </g>
        <g clipPath={url("face")}>
          <rect x="-30" y="-30" width="350" height="270" fill="#FF9F8E" />
          <ellipse cx="55" cy="6" rx="150" ry="72" fill="#FFB271" filter={url("b26")} />
          <ellipse cx="272" cy="74" rx="95" ry="66" fill="#FF8D8D" filter={url("b26")} />
          <ellipse cx="306" cy="142" rx="55" ry="80" fill="#F79DC3" filter={url("b26")} />
          <ellipse cx="126" cy="210" rx="160" ry="110" fill="#5C5DF9" filter={url("b26")} />
          <ellipse cx="126" cy="220" rx="118" ry="78" fill="#5A62FF" filter={url("b16")} />
          <ellipse cx="-8" cy="178" rx="55" ry="62" fill="#8B7BEE" filter={url("b16")} />
          <ellipse cx="292" cy="190" rx="58" ry="48" fill="#9E88F0" filter={url("b16")} />
          <path d={FACE} fill="none" stroke={url("rim")} strokeWidth="24" filter={url("b6")} />
          <path d={FACE} fill="none" stroke={url("rim")} strokeWidth="4" strokeOpacity="0.6" filter={url("b2")} />
        </g>
      </g>
    </svg>
  );
}

/* The plus on the add tile: two capsules sharing one blue core, warm on the
 * top arm, pink on the right, lavender on the left. */
export function PlusMark({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `pl${uid}${n}`;
  const url = (n: string) => `url(#${id(n)})`;
  return (
    <svg className={className} viewBox="0 0 130 130" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id("base")} cx="65" cy="72" r="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5D63FE" />
          <stop offset="0.55" stopColor="#6466F7" />
          <stop offset="1" stopColor="#7C70EC" />
        </radialGradient>
        <linearGradient id={id("top")} x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFC9AE" />
          <stop offset="0.12" stopColor="#FFB497" />
          <stop offset="0.35" stopColor="#FFA690" />
          <stop offset="0.55" stopColor="#F29DA6" />
          <stop offset="0.75" stopColor="#C88AC4" stopOpacity="0.65" />
          <stop offset="1" stopColor="#9C7FD6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("right")} cx="130" cy="65" r="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EDB3D0" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#D696D2" stopOpacity="0.55" />
          <stop offset="1" stopColor="#D696D2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("left")} cx="0" cy="65" r="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B9A9EE" stopOpacity="0.9" />
          <stop offset="1" stopColor="#B9A9EE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="45" width="130" height="40" rx="20" fill={url("base")} />
      <rect x="45" y="0" width="40" height="130" rx="20" fill={url("base")} />
      <rect x="0" y="45" width="130" height="40" rx="20" fill={url("right")} />
      <rect x="0" y="45" width="130" height="40" rx="20" fill={url("left")} />
      <rect x="45" y="0" width="40" height="66" rx="20" fill={url("top")} />
    </svg>
  );
}

/* Counts up from 0 once `run` turns true (the card scrolled into view). With
 * reduced motion it lands on the number without counting. */
export function useCountUp(target: number, run: boolean, ms = 900) {
  const [n, setN] = useState(0);
  useLayoutEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return n;
}
