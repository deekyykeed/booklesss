import React from "react";
import { Composition } from "remotion";
import { DemoVertical } from "./compositions/DemoVertical";
import { DemoWide } from "./compositions/DemoWide";
import { FPS, TOTAL, defaultDemoProps, demoSchema } from "./schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 9:16 — Instagram/TikTok/WhatsApp status. Matches the still carousels. */}
      <Composition
        id="DemoVertical"
        component={DemoVertical}
        durationInFrames={TOTAL}
        fps={FPS}
        width={1080}
        height={1920}
        schema={demoSchema}
        defaultProps={defaultDemoProps}
      />

      {/* 16:9 — website hero, YouTube, pitch decks. */}
      <Composition
        id="DemoWide"
        component={DemoWide}
        durationInFrames={TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
        schema={demoSchema}
        defaultProps={defaultDemoProps}
      />
    </>
  );
};
