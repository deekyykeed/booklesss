import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/* The reader app's own ambient backdrop, ported from `.bg-waves` in
 * platform/src/app/globals.css. Same base colour, same six hues, same idea:
 * soft radial gradients fading to transparent (no blur filter — the gradient
 * IS the softness, which also keeps the render fast).
 *
 * The CSS version uses @keyframes; a Remotion render has no wall clock, so
 * every position is a pure function of the frame. Each blob rides a closed
 * loop whose period is exactly the clip length, so the whole thing loops
 * seamlessly — drop it on a feed and it repeats without a seam. */

export const APP_BG = "#f8f9fc";

type Blob = {
  color: string;
  /** diameter, as a fraction of frame width */
  size: number;
  /** rest position, as a fraction of frame width / height */
  x: number;
  y: number;
  /** travel, as a fraction of frame width / height */
  ax: number;
  ay: number;
  /** phase offsets, in turns — what keeps the six from moving as one */
  p: number;
  q: number;
};

/* Where each blob rests and how far it wanders. Colour is applied separately
 * so the same choreography can wear either palette. */
const PATHS: Omit<Blob, "color">[] = [
  { size: 0.95, x: -0.12, y: -0.06, ax: 0.26, ay: 0.12, p: 0.0, q: 0.15 },
  { size: 0.84, x: 0.7, y: -0.05, ax: -0.3, ay: 0.15, p: 0.3, q: 0.62 },
  { size: 0.9, x: 0.06, y: 0.64, ax: 0.28, ay: -0.18, p: 0.55, q: 0.2 },
  { size: 0.78, x: 0.5, y: 0.74, ax: -0.24, ay: -0.16, p: 0.8, q: 0.44 },
  { size: 0.68, x: 0.32, y: 0.28, ax: 0.22, ay: 0.2, p: 0.18, q: 0.9 },
  { size: 0.74, x: -0.08, y: 0.32, ax: 0.32, ay: -0.14, p: 0.66, q: 0.34 },
];

/* Two palettes. `ambient` is the page backdrop's own hues (195-225, barely
 * there). `voice` is the vivid set the composer's glow picks from in voice
 * mode — worn full-frame it turns the whole page into that glow. */
const PALETTES = {
  ambient: ["179 196 230", "199 212 238", "203 213 245", "185 220 233", "213 201 236", "192 205 231"],
  voice: ["168 85 247", "59 130 246", "45 212 191", "236 72 153", "251 146 60", "129 140 248"],
} as const;

const TAU = Math.PI * 2;

export const Blobs: React.FC<{
  strength?: number;
  palette?: keyof typeof PALETTES;
}> = ({ strength, palette = "ambient" }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  /* One full turn across the composition — so frame 0 and the last frame land
   * in the same place. The 2nd/3rd harmonics complete whole cycles too, so
   * they add wander without breaking the loop. */
  const t = (frame / durationInFrames) * TAU;
  const colors = PALETTES[palette];
  const op = strength ?? (palette === "voice" ? 0.46 : 0.52);

  return (
    <AbsoluteFill style={{ backgroundColor: APP_BG, overflow: "hidden" }}>
      {PATHS.map((path, i) => {
        const b: Blob = { ...path, color: colors[i % colors.length] };
        const a = t + b.p * TAU;
        const c = t + b.q * TAU;
        const dx = b.ax * width * (0.72 * Math.sin(a) + 0.28 * Math.sin(2 * a));
        const dy = b.ay * height * (0.72 * Math.cos(c) + 0.28 * Math.cos(3 * c));
        const scale = 1 + 0.16 * Math.sin(a + c);
        const d = b.size * width;

        return (
          <span
            key={i}
            style={{
              position: "absolute",
              display: "block",
              left: b.x * width,
              top: b.y * height,
              width: d,
              height: d,
              borderRadius: "50%",
              opacity: op,
              /* Space-separated channels, so the transparent stop must use the
               * slash-alpha form — `rgba(168 85 247, 0)` mixes the two syntaxes
               * and Chrome throws the whole gradient away. */
              background: `radial-gradient(closest-side, rgb(${b.color}) 0%, rgb(${b.color} / 0) 100%)`,
              transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
