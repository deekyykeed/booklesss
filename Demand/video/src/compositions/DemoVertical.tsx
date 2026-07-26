import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Paper } from "../components/Paper";
import { TitleCard } from "../components/TitleCard";
import { DeviceFrame, Screen } from "../components/DeviceFrame";
import { Caption, Subcaption } from "../components/Caption";
import { Wordmark } from "../components/Wordmark";
import { C } from "../brand";
import { INTRO, OUTRO, SCREEN, TRANSITION, type DemoProps } from "../schema";

/* The middle scene: the recording itself, in a phone body, drifting slowly
 * upward so a static capture still reads as motion. */
const ScreenScene: React.FC<{ src: string; caption: string; subcaption: string }> = ({
  src,
  caption,
  subcaption,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [10, -10]);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.035]);

  return (
    <Paper>
      <AbsoluteFill
        style={{
          padding: "110px 80px 90px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          <Caption text={caption} size={56} />
          <Subcaption text={subcaption} delay={6} size={30} />
        </div>

        <div style={{ transform: `translateY(${drift}px) scale(${zoom})` }}>
          <DeviceFrame variant="phone" style={{ width: 620, height: 1120 }}>
            <Screen src={src || undefined} />
          </DeviceFrame>
        </div>

        <Wordmark size={38} />
      </AbsoluteFill>
    </Paper>
  );
};

export const DemoVertical: React.FC<DemoProps> = ({
  eyebrow,
  headline,
  sub,
  screenSrc,
  caption,
  subcaption,
  ctaHeadline,
  ctaSub,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO}>
          <TitleCard eyebrow={eyebrow} headline={headline} sub={sub} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCREEN}>
          <ScreenScene src={screenSrc} caption={caption} subcaption={subcaption} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={OUTRO}>
          <TitleCard headline={ctaHeadline} sub={ctaSub} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
