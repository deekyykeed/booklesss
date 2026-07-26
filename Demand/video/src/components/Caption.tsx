import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, bodyStack, displayStack } from "../brand";

/* The line that says what the viewer is looking at. Sits on the cream, not on
 * the screen — the recording stays unobstructed. */
export const Caption: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  align?: "center" | "left";
}> = ({ text, delay = 0, size = 46, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.5 } });

  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [18, 0])}px)`,
        fontFamily: displayStack,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.18,
        letterSpacing: -size * 0.02,
        color: C.ink,
        textAlign: align,
      }}
    >
      {text}
    </div>
  );
};

/* Small grey line under a caption. */
export const Subcaption: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  align?: "center" | "left";
}> = ({ text, delay = 0, size = 28, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.5 } });

  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [14, 0])}px)`,
        fontFamily: bodyStack,
        fontSize: size,
        lineHeight: 1.45,
        color: C.muted,
        textAlign: align,
      }}
    >
      {text}
    </div>
  );
};
