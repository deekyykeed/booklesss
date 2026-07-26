import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyStack, displayStack } from "../brand";
import { Blobs } from "./Blobs";
import { Mark } from "./Wordmark";
import { FRAME_H, FRAME_W, STAGE } from "../safe";

/* Lay a block out inside the social safe area rather than the whole frame —
 * the platform covers the top, the right rail and the bottom. */
const stagePad = `${STAGE.y}px ${FRAME_W - STAGE.x - STAGE.w}px ${
  FRAME_H - STAGE.y - STAGE.h
}px ${STAGE.x}px`;

/* The reader app's own tokens (platform/src/app/globals.css), not the PDF
 * cream — this is a demo of the app, so it should look like the app. */
export const UI = {
  bg: "#f8f9fc",
  ink: "#171717",
  ink2: "#525252",
  muted: "#707070",
  line: "#dfdfdf",
} as const;

/* A soft fade over the screenshot, only where the caption sits, so the type
 * stays readable without a card or a box over the UI. */
export const Scrim: React.FC<{ side: "top" | "bottom"; extent?: number }> = ({
  side,
  extent = 46,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      /* Solid for the first half of the run, then a long fade out. The first
       * pass fell off too early and the app's own headings ghosted through
       * behind the caption, which reads as a rendering fault rather than a
       * deliberate fade. */
      background:
        side === "top"
          ? `linear-gradient(to bottom, ${UI.bg} 0%, ${UI.bg} ${extent * 0.55}%, ${UI.bg}00 ${extent}%)`
          : `linear-gradient(to top, ${UI.bg} 0%, ${UI.bg} ${extent * 0.55}%, ${UI.bg}00 ${extent}%)`,
    }}
  />
);

/* Caption over a shot: headline plus one supporting line, words rising in
 * sequence. Anchored to whichever edge the scrim is on. */
export const Caption: React.FC<{
  side: "top" | "bottom";
  headline: string;
  sub?: string;
  delay?: number;
  /** pin to the top of the social safe area instead of the frame edge */
  safe?: boolean;
}> = ({ side, headline, sub, delay = 4, safe = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = (d: number) => {
    const s = spring({ frame: frame - d, fps, config: { damping: 200, mass: 0.7 } });
    return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [22, 0])}px)` };
  };

  const words = headline.split(" ");

  return (
    <AbsoluteFill
      style={{
        justifyContent: side === "top" ? "flex-start" : "flex-end",
        padding: safe
          ? stagePad
          : side === "top"
            ? "132px 76px 0"
            : "0 76px 148px",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontFamily: displayStack,
            fontSize: safe ? 64 : 74,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: -1.6,
            color: UI.ink,
            display: "flex",
            flexWrap: "wrap",
            gap: "0 18px",
          }}
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} style={rise(delay + i * 2.5)}>
              {word}
            </span>
          ))}
        </h2>
        {sub ? (
          <p
            style={{
              ...rise(delay + words.length * 2.5 + 2),
              margin: "22px 0 0",
              maxWidth: 800,
              fontFamily: bodyStack,
              fontSize: 32,
              lineHeight: 1.42,
              color: UI.muted,
            }}
          >
            {sub}
          </p>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* A full-frame text beat — the presentation slides between the app shots.
 * Sits on the app's own drifting backdrop, kept faint. */
export const Statement: React.FC<{
  eyebrow?: string;
  headline: string;
  sub?: string;
  mark?: boolean;
  /** lay out inside the social safe area instead of the full frame */
  safe?: boolean;
  /** a Streamline duotone icon, above the type */
  icon?: React.ReactNode;
}> = ({ eyebrow, headline, sub, mark = false, safe = false, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = (d: number) => {
    const s = spring({ frame: frame - d, fps, config: { damping: 200, mass: 0.7 } });
    return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)` };
  };

  const words = headline.split(" ");

  return (
    <AbsoluteFill>
      <Blobs palette="ambient" strength={0.34} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          padding: safe ? stagePad : "0 84px",
        }}
      >
        {icon ? (
          <div style={{ ...rise(0), marginBottom: 34 }}>{icon}</div>
        ) : null}

        {mark ? (
          <div style={{ ...rise(0), marginBottom: 40 }}>
            <Mark size={64} />
          </div>
        ) : null}

        {eyebrow ? (
          <div
            style={{
              ...rise(2),
              fontFamily: bodyStack,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4.4,
              textTransform: "uppercase",
              color: UI.muted,
              marginBottom: 26,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <h1
          style={{
            margin: 0,
            fontFamily: displayStack,
            fontSize: safe ? 82 : 96,
            fontWeight: 700,
            lineHeight: 1.03,
            letterSpacing: -2.4,
            color: UI.ink,
            display: "flex",
            flexWrap: "wrap",
            gap: "0 22px",
          }}
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} style={rise(5 + i * 3)}>
              {word}
            </span>
          ))}
        </h1>

        {sub ? (
          <p
            style={{
              ...rise(9 + words.length * 3),
              margin: "34px 0 0",
              maxWidth: 830,
              fontFamily: bodyStack,
              fontSize: 36,
              lineHeight: 1.44,
              color: UI.ink2,
            }}
          >
            {sub}
          </p>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
