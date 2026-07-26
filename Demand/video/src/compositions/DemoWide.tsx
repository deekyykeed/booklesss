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

/* 16:9 cut — copy on the left, browser on the right, so the recording keeps
 * its own aspect instead of being cropped into a square. */
const ScreenScene: React.FC<{ src: string; caption: string; subcaption: string }> = ({
  src,
  caption,
  subcaption,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.03]);

  return (
    <Paper>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: "0 110px",
          gap: 80,
        }}
      >
        <div
          style={{
            width: 520,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <Caption text={caption} size={62} align="left" />
          <Subcaption text={subcaption} delay={6} size={30} align="left" />
          <div style={{ marginTop: 26 }}>
            <Wordmark size={34} />
          </div>
        </div>

        <div style={{ flex: 1, transform: `scale(${zoom})` }}>
          <DeviceFrame variant="browser" style={{ width: "100%", height: 700 }}>
            <Screen src={src || undefined} />
          </DeviceFrame>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

export const DemoWide: React.FC<DemoProps> = ({
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
