import React from "react";
import { Composition } from "remotion";
import { DemoVertical } from "./compositions/DemoVertical";
import { DemoWide } from "./compositions/DemoWide";
import { SIDEBAR_DEMO_DURATION, SidebarDemo } from "./compositions/SidebarDemo";
import { ContactSheet } from "./compositions/ContactSheet";
import { PRODUCT_DEMO_DURATION, ProductDemo } from "./compositions/ProductDemo";
import { DemoSheet, SHEET_H, SHEET_W } from "./compositions/DemoSheet";
import { IN_ACTION_DURATION, InAction } from "./compositions/InAction";
import { FPS, TOTAL, defaultDemoProps, demoSchema } from "./schema";
import { Explainer } from "./explainer/Explainer";
import { ExplainerSheet, XSHEET_H, XSHEET_W } from "./explainer/ExplainerSheet";
import { EXPLAINERS } from "./explainers";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Explainers — you on camera cutting full-screen to animation, timed
          to the voice. One composition per script in src/explainers/. */}
      {Object.keys(EXPLAINERS).map((slug) => (
        <Composition
          key={slug}
          id={`Explainer-${slug}`}
          component={Explainer}
          durationInFrames={EXPLAINERS[slug].timeline.duration}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ slug, footage: null as string | null }}
        />
      ))}
      <Composition
        id="ExplainerSheet"
        component={ExplainerSheet}
        durationInFrames={1}
        fps={30}
        width={XSHEET_W}
        height={XSHEET_H}
        defaultProps={{ slug: "present-value" }}
      />
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

      {/* "In action" — the live one: real typing, scrolling and voice glow,
          laid out inside the social safe area. */}
      <Composition
        id="InAction"
        component={InAction}
        durationInFrames={IN_ACTION_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* The 60s product demo — real app captures under a moving camera. */}
      <Composition
        id="ProductDemo"
        component={ProductDemo}
        durationInFrames={PRODUCT_DEMO_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* QA boards — not deliverables. ContactSheet = every capture at once;
          DemoSheet = fifteen moments of the demo as one still. */}
      <Composition
        id="ContactSheet"
        component={ContactSheet}
        durationInFrames={1}
        fps={FPS}
        width={1620}
        height={1400}
      />
      <Composition
        id="DemoSheet"
        component={DemoSheet}
        durationInFrames={IN_ACTION_DURATION}
        fps={FPS}
        width={SHEET_W}
        height={SHEET_H}
      />

      {/* Sidebar motion study — the app's own blob backdrop, the selector
          riding between steps. Loops seamlessly. */}
      <Composition
        id="SidebarDemo"
        component={SidebarDemo}
        durationInFrames={SIDEBAR_DEMO_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
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
