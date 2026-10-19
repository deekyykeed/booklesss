"use client";

import { memo, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { HugeIcon, type HugeIconName } from "@/components/icons/huge";
import { folderPath, squircleClip, squirclePath } from "./squircle";

/* A widget at its drawn size. Every Fit on the page shares ONE scale, set on
 * .kit as --kit-s by the showcase (the column width ÷ 575, the width of the
 * widest pair of widgets that share a row on a phone). It used to be one
 * scale per widget, each shrunk to fit the screen on its own — so on a phone
 * Book a Call lost a third of its size while the avatar kept all of its, and
 * the set stopped reading as one set (owner, 2026-10-18: "things are scaled
 * up too much or too little"). `zoom` rather than transform because zoom also
 * shrinks the box, so what follows moves up with it. */
export function Fit({ w, children }: { w: number; children: ReactNode }) {
  return (
    <div className="kit-fit" style={{ width: w }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- surfaces */

type SurfaceKind = "tile" | "white" | "glass" | "card";

type Glow = { top?: string; bottom?: string };

/* The body of a card, drawn as a squircle in SVG — CSS cannot draw the shape,
 * and a clip-path would cut away the rim and the glows that make these read as
 * glass. Every layer is the same path, so the rim and the glow follow the
 * corner exactly:
 *
 *   tile  — the Jay soft tile: #F6F6F6 rising to white at the base, a 1px
 *           white rim, a white glow along the bottom edge. Optional layers
 *           (opacity 0 until the card's CSS turns them on): a lift shadow, a
 *           selection ring, a pressed inner shade.
 *   white — the brief card's white frame.
 *   glass — the Ron panel: translucent lavender-grey, a top rim, a long soft
 *           drop shadow.
 *   card  — a Ron card: near-white with a white hairline and two coloured
 *           glows, one above and one below.
 *
 * Sits behind the card's content (z-index -1 inside the card's own stacking
 * context — the card must be `isolation: isolate`). */
/* Memoised: its props are numbers and strings, and it is the costliest thing
 * on a card (blurred SVG layers), so a parent re-render must not redraw it. */
export const Surface = memo(function Surface({
  w,
  h,
  r,
  s = 0.8,
  kind = "tile",
  glow,
}: {
  w: number;
  h: number;
  r: number | [number, number, number, number];
  s?: number;
  kind?: SurfaceKind;
  glow?: Glow;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (x: string) => `sf${uid}${x}`;
  const url = (x: string) => `url(#${id(x)})`;
  const d = squirclePath(w, h, r, s);
  const blur = (x: string, dev: number) => (
    <filter id={id(x)} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation={dev} />
    </filter>
  );

  /* Exactly the card's box, with the shadows and rings drawn past it through
   * overflow: visible. A padded viewBox would make the box itself wider than
   * the card, and near the screen edge that box became a sideways scroll. */
  return (
    <svg
      className="kit-surface"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ left: 0, top: 0 }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={id("c")}>
          <path d={d} />
        </clipPath>
        {kind === "tile" && (
          <linearGradient id={id("f")} x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F8F8F8" />
            <stop offset="0.55" stopColor="#F6F6F6" />
            <stop offset="0.86" stopColor="#F7F7F7" />
            <stop offset="1" stopColor="#FFFFFF" />
          </linearGradient>
        )}
        {kind === "glass" && (
          <linearGradient id={id("f")} x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#EEEDF2" stopOpacity="0.94" />
            <stop offset="0.55" stopColor="#E8E8EB" stopOpacity="0.94" />
            <stop offset="1" stopColor="#E5E5E7" stopOpacity="0.96" />
          </linearGradient>
        )}
        <linearGradient id={id("low")} x1="0" y1={h - 26} x2="0" y2={h} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.25" />
        </linearGradient>
        {blur("b4", 4)}
        {blur("b6", 6)}
        {blur("b12", 12)}
        {blur("b26", 26)}
      </defs>

      {kind === "tile" && (
        <>
          <path className="kit-sf-lift" d={d} fill="rgba(90,90,140,0.14)" filter={url("b12")} transform="translate(0 12)" />
          <path className="kit-sf-ring" d={d} fill="none" stroke="rgba(94,104,255,0.32)" strokeWidth="10" />
          <path className="kit-sf-ring" d={d} fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <path d={d} fill={url("f")} />
          <g clipPath={url("c")}>
            <path d={d} fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d={d} fill="none" stroke={url("low")} strokeWidth="16" filter={url("b4")} />
            <path className="kit-sf-press" d={d} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="12" filter={url("b6")} transform="translate(0 4)" />
          </g>
        </>
      )}

      {kind === "white" && <path d={d} fill="#FFFFFF" />}

      {kind === "glass" && (
        <>
          <path d={d} fill="rgba(60,55,80,0.16)" filter={url("b26")} transform="translate(0 24)" />
          <path d={d} fill={url("f")} />
          <g clipPath={url("c")}>
            <path d={d} fill="none" stroke={url("rim")} strokeWidth="2" />
          </g>
        </>
      )}

      {kind === "card" && (
        <>
          {glow?.top && <path className="kit-sf-glow-t" d={d} fill={glow.top} filter={url("b6")} transform="translate(0 -3)" />}
          {glow?.bottom && <path className="kit-sf-glow-b" d={d} fill={glow.bottom} filter={url("b6")} transform="translate(0 5)" />}
          <path d={d} fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="2" />
          <path className="kit-sf-card" d={d} fill="#FBFBFD" />
        </>
      )}
    </svg>
  );
});

/* ---------------------------------------------------------------- glass button */

/* Measured off the reference: radius 40 at smoothing 0.6 (rmse 1.7px). */
const BUTTON_CLIP = squircleClip(263, 125, 40, 0.6);

/* The gradient glass button: a face, a lip under it (the button's thickness)
 * and a glow under that. No white sheen spot: the owner had it removed
 * (2026-10-18), so nothing follows the pointer. `state` forces a look for
 * the states row; left out, the button is live. */
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

  return (
    <button
      type="button"
      className="kit-gbtn"
      data-state={state}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
    >
      <span className="kit-gbtn-glow" aria-hidden />
      <span className="kit-gbtn-lip" style={{ clipPath: BUTTON_CLIP }} aria-hidden />
      <span ref={face} className="kit-gbtn-face" style={{ clipPath: BUTTON_CLIP }}>
        {children}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- buttons at usable sizes */

/* The widget's glass button is 125px tall — right for the widget it lives
 * in, and no use as a button (owner, 2026-10-18: "I just don't think button
 * sizes are usable — too big"). These are the app's buttons: the same glass
 * (and the same soft tile material for the quiet one) at control sizes, with
 * the same proportions — corner radius 0.32 × height at iOS smoothing, lip
 * 0.08 × height, the glow under it — and 16/20px icons. Width follows the
 * label, so the squircle is measured off the face and shared with the lip
 * through --sq. */
export type ButtonSize = "sm" | "md" | "lg";

const SIZES: Record<ButtonSize, { h: number; lip: number; fs: number; px: number; icon: number }> = {
  sm: { h: 36, lip: 3, fs: 14, px: 14, icon: 16 },
  md: { h: 44, lip: 3.5, fs: 15, px: 18, icon: 20 },
  lg: { h: 52, lip: 4, fs: 16, px: 22, icon: 20 },
};

/** Sets --sq on `host` to a squircle the size of `box`, kept current as it resizes. */
function useSquircleVar(r: (h: number) => number, s = 0.6) {
  const host = useRef<HTMLElement | null>(null);
  const box = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const b = box.current;
    const hst = host.current ?? b;
    if (!b || !hst) return;
    const apply = () => {
      const w = b.offsetWidth;
      const h = b.offsetHeight;
      if (w && h) hst.style.setProperty("--sq", squircleClip(w, h, r(h), s));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(b);
    return () => ro.disconnect();
  }, [r, s]);
  return { host, box };
}

const RADIUS = (h: number) => h * 0.32;

export function Button({
  variant = "glass",
  size = "md",
  icon,
  iconOnly,
  label,
  children,
  state,
  disabled,
  onClick,
}: {
  variant?: "glass" | "soft";
  size?: ButtonSize;
  icon?: HugeIconName;
  iconOnly?: boolean;
  label?: string;
  children?: ReactNode;
  state?: "hover" | "pressed";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const cfg = SIZES[size];
  const { host, box } = useSquircleVar(RADIUS);
  const glass = variant === "glass";

  return (
    <button
      ref={(el) => {
        host.current = el;
      }}
      type="button"
      className={`kit-btn kit-btn--${variant}`}
      data-state={state}
      data-icon-only={iconOnly ? "" : undefined}
      disabled={disabled}
      onClick={onClick}
      aria-label={iconOnly ? label : undefined}
      data-size={size}
    >
      {glass && <span className="kit-btn-glow" aria-hidden />}
      {glass && <span className="kit-btn-lip" aria-hidden />}
      <span
        ref={(el) => {
          box.current = el;
        }}
        className="kit-btn-face"
      >
        {icon && <HugeIcon name={icon} size={cfg.icon} strokeWidth={1.75} />}
        {!iconOnly && <span>{children ?? label}</span>}
      </span>
    </button>
  );
}

/* The Book a Call widget's working parts at control size — a minutes stepper
 * with 16px chevrons and a medium glass button on one soft bar. What the
 * widget becomes when it is a control in the app rather than a card. */
const BAR_MINUTES = [15, 30, 45, 60, 90];

export function CallBar() {
  const [i, setI] = useState(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [booked, setBooked] = useState(false);
  const { host, box } = useSquircleVar(RADIUS);
  const step = (d: 1 | -1) => {
    setDir(d);
    setBooked(false);
    setI((v) => Math.min(BAR_MINUTES.length - 1, Math.max(0, v + d)));
  };
  return (
    <div
      ref={(el) => {
        host.current = el;
        box.current = el;
      }}
      className="kit-bar"
    >
      <span className="kit-bar-value" aria-live="polite">
        <b key={BAR_MINUTES[i]} data-dir={dir}>
          {BAR_MINUTES[i]}
        </b>
        <span>mins</span>
      </span>
      <span className="kit-bar-step">
        <button type="button" aria-label="Longer call" disabled={i === BAR_MINUTES.length - 1} onClick={() => step(1)}>
          <HugeIcon name="arrow-up" size={16} strokeWidth={2} />
        </button>
        <button type="button" aria-label="Shorter call" disabled={i === 0} onClick={() => step(-1)}>
          <HugeIcon name="chevron-down" size={16} strokeWidth={2} />
        </button>
      </span>
      <Button size="md" onClick={() => setBooked((b) => !b)}>
        {booked ? "Booked" : "Book a Call"}
      </Button>
    </div>
  );
}

/* ---------------------------------------------------------------- happy files */

/* Happy Files' folder, drawn as vectors. The face is a mesh of blurred colour
 * blobs clipped to the silhouette (peach top-left, coral right, a blue dome
 * rising from the bottom), under a cream inner glow along the top contour and
 * a thin peach halo outside it; the lip under it is the folder's thickness.
 * The silhouette's corners are squircles too (folderPath). Every value was
 * matched against the reference crop by rendering both side by side, so
 * change one and re-check. The ids are per-instance (useId) — several folders
 * on one page would otherwise share one set of filters. */
const LIP = folderPath(244);
const FACE = folderPath(204);

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

/* ---------------------------------------------------------------- plus */

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
