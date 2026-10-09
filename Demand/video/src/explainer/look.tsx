import React from "react";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";

/* The explainer look — "launch film" grammar, Booklesss content.
 *
 * Two worlds cut hard against each other: warm off-white PAPER and matte INK.
 * One accent (red), one heat ramp (the thermal gradient map that turns the
 * camera into animation), small lowercase type, grain on everything. This is a
 * different palette from the app's on purpose: the app is where you read, this
 * is an ad for reading it. */
export const K = {
  paper: "#E9E7E1",
  paperDeep: "#D9D6CD",
  ink: "#131211",
  inkSoft: "#2A2826",
  red: "#D7261E",
  white: "#F6F4EE",
  muted: "#8C8880",
} as const;

export const SATOSHI = "Satoshi";
export const sat = `"${SATOSHI}", "Inter", -apple-system, "Segoe UI", sans-serif`;
/* The luxury register — editorial serif, used for the ONE word per phrase that
 * carries it. Instrument Serif, OFL (licence beside the files in public/fonts). */
export const SERIF = "Instrument Serif";
export const serif = `"${SERIF}", Georgia, "Times New Roman", serif`;

const fontHandle = delayRender("Loading Satoshi");
Promise.all([
  loadFont({ family: SATOSHI, url: staticFile("fonts/Satoshi-Medium.ttf"), weight: "500", format: "truetype" }),
  loadFont({ family: SATOSHI, url: staticFile("fonts/Satoshi-Bold.ttf"), weight: "700", format: "truetype" }),
  loadFont({
    family: SATOSHI,
    url: staticFile("fonts/Satoshi-Regular-Italic.ttf"),
    weight: "400",
    style: "italic",
    format: "truetype",
  }),
  loadFont({ family: SERIF, url: staticFile("fonts/InstrumentSerif-Regular.ttf"), weight: "400", format: "truetype" }),
  loadFont({
    family: SERIF,
    url: staticFile("fonts/InstrumentSerif-Italic.ttf"),
    weight: "400",
    style: "italic",
    format: "truetype",
  }),
])
  .then(() => continueRender(fontHandle))
  .catch((err) => {
    console.warn("Satoshi failed to load:", err);
    continueRender(fontHandle);
  });

/* ---------------------------------------------------------------- filters */

/* The heat map. Grey the frame, then map luminance through a ramp:
 * black -> blood -> red -> orange -> yellow -> near-white. Works on ANY
 * footage with no segmentation, as long as the subject is lit brighter than
 * the background — which is the one shooting rule this look depends on. */
export const ThermalDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="thermal" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0"
        />
        {/* contrast: crush the background before the ramp */}
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.7" intercept="-0.28" />
          <feFuncG type="linear" slope="1.7" intercept="-0.28" />
          <feFuncB type="linear" slope="1.7" intercept="-0.28" />
        </feComponentTransfer>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.04 0.30 0.78 0.98 1 1" />
          <feFuncG type="table" tableValues="0.03 0.04 0.13 0.42 0.78 0.96" />
          <feFuncB type="table" tableValues="0.03 0.03 0.04 0.06 0.22 0.82" />
        </feComponentTransfer>
      </filter>
      {/* ragged edge for the ink blob transition */}
      <filter id="inkEdge" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="90" />
      </filter>
    </defs>
  </svg>
);

/* ---------------------------------------------------------------- texture */

/* Film grain: fresh noise every frame (the seed is the frame), laid over
 * everything. Static grain reads as a dirty screen; moving grain reads as film. */
export const Grain: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.11 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
    <svg width="100%" height="100%">
      <filter id={`g${frame % 24}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${frame % 24})`} />
    </svg>
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.38 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 60% at 50% 48%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/* Paper: off-white with a soft hot-spot, as if lit from slightly above. */
export const Paper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 90% 70% at 50% 40%, #F1EFEA 0%, ${K.paper} 55%, ${K.paperDeep} 100%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Ink: React.FC<{ children?: React.ReactNode; tint?: string }> = ({ children, tint }) => (
  <AbsoluteFill
    style={{
      background: tint ?? `radial-gradient(ellipse 90% 70% at 50% 45%, #1C1A18 0%, ${K.ink} 70%, #0A0909 100%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- marks */

/* Four-point sparkle — the accent hit on a reveal. */
export const Sparkle: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = K.red,
  style,
}) => (
  <svg width={size} height={size} viewBox="-1 -1 2 2" style={style}>
    <path d="M0,-1 Q0.1,-0.1 1,0 Q0.1,0.1 0,1 Q-0.1,0.1 -1,0 Q-0.1,-0.1 0,-1Z" fill={color} />
  </svg>
);

/* A pen loop drawn round something, by hand: 1.15 turns of a wobbly ellipse,
 * drawn on with a dash offset. Seeded so each loop wobbles differently but the
 * same loop wobbles the same way every frame. */
export function loopPath(rx: number, ry: number, seed: number, turns = 1.15): string {
  const N = 64;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const a = -0.9 + (i / N) * Math.PI * 2 * turns;
    const j = 1 + 0.07 * Math.sin(i * 0.9 + seed * 3.1) + 0.04 * Math.sin(i * 2.3 + seed);
    const drift = 1 + (0.08 * i) / N;
    const x = rx * Math.cos(a) * j * drift;
    const y = ry * Math.sin(a) * j;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d;
}

export const PenLoop: React.FC<{
  rx: number;
  ry: number;
  progress: number;
  seed?: number;
  color?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({ rx, ry, progress, seed = 1, color = K.red, width = 4, style }) => {
  const pad = width * 4;
  const W = rx * 2.4 + pad;
  const H = ry * 2.4 + pad;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}
      style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -W / 2, marginTop: -H / 2, overflow: "visible", ...style }}
    >
      <path
        d={loopPath(rx, ry, seed)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
      />
    </svg>
  );
};

/* A hand-drawn stroke between two points, slightly bowed, drawn on. */
export const PenLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  bow?: number;
  color?: string;
  width?: number;
}> = ({ x1, y1, x2, y2, progress, bow = 10, color = K.ink, width = 6 }) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - bow;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path
        d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
      />
    </svg>
  );
};

/* Blinking block cursor — 15 frames on, 15 off, like a terminal. */
export const Cursor: React.FC<{ frame: number; color: string; h: number }> = ({ frame, color, h }) => (
  <span
    style={{
      display: "inline-block",
      width: h * 0.42,
      height: h * 0.82,
      marginLeft: h * 0.22,
      background: color,
      verticalAlign: "-0.1em",
      opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
    }}
  />
);
