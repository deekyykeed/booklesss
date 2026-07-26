import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SHOTS, type ShotKey } from "../shots";

/** A flick-scroll over a tall capture: each stop is where the page comes to
 * rest, and the spring between them carries the momentum of a thumb flick. */
export const ScrollShot: React.FC<{
  shot: ShotKey;
  /** frame -> scroll position, in frame pixels from the top */
  stops: { at: number; y: number }[];
  zoom?: number;
  width?: number;
  height?: number;
}> = ({ shot, stops, zoom = 1.3, width = 1080, height = 1920 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { file, w, h } = SHOTS[shot];

  const base = Math.max(width / w, height / h) * zoom;
  const drawW = w * base;
  const drawH = h * base;
  const maxScroll = Math.max(0, drawH - height);

  let i = 0;
  for (let k = 0; k < stops.length; k++) if (frame >= stops[k].at) i = k;
  const to = stops[i];
  const from = stops[Math.max(0, i - 1)];

  /* Heavy mass, no bounce: a scrolled page decelerates, it doesn't spring back. */
  const t = spring({
    frame: frame - to.at,
    fps,
    config: { damping: 200, mass: 1.6 },
  });
  const y = Math.min(maxScroll, interpolate(t, [0, 1], [from.y, to.y]));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(file)}
        style={{
          position: "absolute",
          left: (width - drawW) / 2,
          top: 0,
          width: drawW,
          height: drawH,
          transform: `translate3d(0, ${-y}px, 0)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* A real app capture, full-bleed, under a moving camera.
 *
 * The shot is cover-fitted first — scaled so it always fills the frame — then
 * the camera scale/offset/rotation is applied on top. That ordering is what
 * lets a wide crop (the composer band) and a tall screen (the whole lesson)
 * use the same rig without either one exposing a background edge.
 *
 * `focus` biases the crop: {y: 1} keeps the bottom of a tall screen in frame,
 * which is where the composer lives. */
export type Cam = {
  /** multiplier on top of the cover fit */
  scale?: number;
  /** pan, in frame pixels */
  x?: number;
  y?: number;
  /** degrees */
  ry?: number;
  rx?: number;
  rot?: number;
};

const DEFAULT: Required<Cam> = { scale: 1, x: 0, y: 0, ry: 0, rx: 0, rot: 0 };

export const Screen: React.FC<{
  shot: ShotKey;
  dur: number;
  from: Cam;
  to: Cam;
  focus?: { x?: number; y?: number };
  /** ease the move instead of drifting linearly */
  ease?: boolean;
  width?: number;
  height?: number;
}> = ({ shot, dur, from, to, focus, ease = false, width = 1080, height = 1920 }) => {
  const frame = useCurrentFrame();
  const { file, w, h } = SHOTS[shot];

  const t = interpolate(frame, [0, Math.max(1, dur - 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.inOut(Easing.ease) : Easing.linear,
  });

  const lerp = (k: keyof Cam) => {
    const a = from[k] ?? DEFAULT[k];
    const b = to[k] ?? DEFAULT[k];
    return a + (b - a) * t;
  };

  /* Cover fit: fill on whichever axis is short. */
  const base = Math.max(width / w, height / h);
  const drawW = w * base;
  const drawH = h * base;

  /* Crop bias. focus.y = 1 pins the bottom edge, 0 the top, 0.5 centres. */
  const fx = focus?.x ?? 0.5;
  const fy = focus?.y ?? 0.5;
  const offX = (width - drawW) * fx;
  const offY = (height - drawH) * fy;

  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1800 }}>
      <Img
        src={staticFile(file)}
        style={{
          position: "absolute",
          left: offX,
          top: offY,
          width: drawW,
          height: drawH,
          transformOrigin: "50% 50%",
          transform: [
            `translate3d(${lerp("x")}px, ${lerp("y")}px, 0)`,
            `rotateX(${lerp("rx")}deg)`,
            `rotateY(${lerp("ry")}deg)`,
            `rotate(${lerp("rot")}deg)`,
            `scale(${lerp("scale")})`,
          ].join(" "),
        }}
      />
    </AbsoluteFill>
  );
};
