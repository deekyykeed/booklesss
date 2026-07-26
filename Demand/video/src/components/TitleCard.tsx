import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Paper } from "./Paper";
import { Wordmark } from "./Wordmark";
import { C, bodyStack, displayStack } from "../brand";

/* Opening / closing card: eyebrow, headline, one supporting line.
 * Words rise in sequence — no bounce, just a settled ease. */
export const TitleCard: React.FC<{
  eyebrow?: string;
  headline: string;
  sub?: string;
  align?: "center" | "left";
}> = ({ eyebrow, headline, sub, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = width / 1080;

  const rise = (delay: number) => {
    const s = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.6 } });
    return {
      opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [28 * scale, 0])}px)`,
    };
  };

  const words = headline.split(" ");

  return (
    <Paper>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: align === "center" ? "center" : "flex-start",
          textAlign: align,
          padding: `0 ${96 * scale}px`,
        }}
      >
        <div style={{ ...rise(0), marginBottom: 40 * scale }}>
          <Wordmark size={44 * scale} />
        </div>

        {eyebrow ? (
          <div
            style={{
              ...rise(4),
              fontFamily: bodyStack,
              fontSize: 22 * scale,
              fontWeight: 700,
              letterSpacing: 4 * scale,
              textTransform: "uppercase",
              color: C.accent,
              marginBottom: 24 * scale,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <h1
          style={{
            margin: 0,
            fontFamily: displayStack,
            fontSize: 96 * scale,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: -2 * scale,
            color: C.ink,
            display: "flex",
            flexWrap: "wrap",
            gap: `0 ${22 * scale}px`,
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} style={rise(8 + i * 3)}>
              {word}
            </span>
          ))}
        </h1>

        {sub ? (
          <p
            style={{
              ...rise(10 + words.length * 3),
              margin: `${32 * scale}px 0 0`,
              maxWidth: 780 * scale,
              fontFamily: bodyStack,
              fontSize: 34 * scale,
              lineHeight: 1.45,
              color: C.muted,
            }}
          >
            {sub}
          </p>
        ) : null}
      </AbsoluteFill>
    </Paper>
  );
};
