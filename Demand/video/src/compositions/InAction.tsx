import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Blobs } from "../components/Blobs";
import { LiveComposer, speechEnvelope } from "../components/LiveComposer";
import { Caption, Scrim, Statement, UI } from "../components/Overlay";
import { SidebarDemo } from "./SidebarDemo";
import { Book, Chat, Flip, Mic } from "../icons";
import { ACTION, CENTERED_W, CENTERED_X, FRAME_W } from "../safe";
import { PANEL_W } from "../nav-tree";
import { Screen, ScrollShot } from "../components/Screen";

/* ------------------------------------------------------------------ *
 * Booklesss — "in action". 1080x1920, 55.0s.
 *
 * The difference from the first demo: this one MOVES. Rather than panning a
 * camera over still captures, the interactive parts are rebuilt live and
 * actually run —
 *   · the course nav: the selector rides between steps, folders open and shut
 *   · the lesson: flick-scrolled, with real deceleration
 *   · the composer: types a question a character at a time, then sends it
 *   · voice mode: the glow tracks a speech-shaped loudness signal
 *
 * Everything is laid out inside the social safe area (src/safe.ts) — clear of
 * the account header, the like/comment/share rail and the caption block — so
 * nothing important sits under the platform's own furniture.
 *
 * Copy keeps the honest framing: the tutor is in preview, so it says we're
 * building it, never that it answers.
 * ------------------------------------------------------------------ */

const T = 8; // quick cuts — "active and quick"

const D = {
  hook: 120,
  nav: 285,
  scroll: 255,
  askIntro: 120,
  typing: 315,
  voice: 300,
  finish: 130,
  cta: 181,
} as const;

export const IN_ACTION_DURATION =
  Object.values(D).reduce((a, b) => a + b, 0) - T * 7; // 1706 - 56 = 1650 = 55.0s

const fadeT = { presentation: fade(), timing: linearTiming({ durationInFrames: T }) };
const slideUp = {
  presentation: slide({ direction: "from-bottom" as const }),
  timing: linearTiming({ durationInFrames: T }),
};
const slideLeft = {
  presentation: slide({ direction: "from-right" as const }),
  timing: linearTiming({ durationInFrames: T }),
};

/** The soft app surface every live beat sits on. */
const Surface: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: UI.bg }}>
    <Blobs palette="ambient" strength={0.34} />
    {children}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ *
 * Beat 2 — the course nav, live. The panel is placed in the action box
 * so the selector never travels under the platform's right-hand rail.
 * ------------------------------------------------------------------ */
const NavBeat: React.FC = () => (
  <Surface>
    {/* Centred in the frame, not in the stage — the panel is narrow enough
        that its right edge still clears the platform's action rail. */}
    <SidebarDemo
      chrome={false}
      panel={{ x: (FRAME_W - PANEL_W * 2.42) / 2, y: ACTION.y, h: ACTION.h, scale: 2.42 }}
    />
    <Caption
      safe
      side="top"
      headline="Tap straight to the step."
      sub="The whole course, in the order it makes sense."
    />
  </Surface>
);

/* ------------------------------------------------------------------ *
 * Beat 3 — reading. Three thumb flicks down a real lesson.
 * ------------------------------------------------------------------ */
const ScrollBeat: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: UI.bg }}>
    {/* Zoom stays near 1: the capture is 1206 wide against a 1080 frame, so
        anything higher crops the body column and slices words at both edges. */}
    <ScrollShot
      shot="reader"
      zoom={1.06}
      stops={[
        { at: 0, y: 0 },
        { at: 42, y: 190 },
        { at: 112, y: 380 },
        { at: 182, y: 560 },
      ]}
    />
    <Scrim side="top" extent={42} />
    <Caption
      safe
      side="top"
      headline="Then just read."
      sub="Plain language, real examples — no lecture slides to decode."
    />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ *
 * Beats 5 & 6 — the composer, running. Anchored to the bottom of the
 * action box, which keeps it clear of the caption bar underneath.
 * ------------------------------------------------------------------ */
/* The real lesson behind the composer, knocked back so it reads as context
 * rather than content — the composer is what the viewer should be watching. */
const PageBehind: React.FC = () => (
  <>
    <AbsoluteFill style={{ opacity: 0.5 }}>
      <Screen
        shot="lessonTop"
        dur={320}
        from={{ scale: 1.04, y: -30 }}
        to={{ scale: 1.09, y: -80 }}
        focus={{ y: 0 }}
      />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${UI.bg}cc 0%, ${UI.bg}f2 52%, ${UI.bg} 78%)` }} />
  </>
);

const ComposerStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: CENTERED_X,
      width: CENTERED_W,
      top: ACTION.y,
      height: ACTION.h,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      paddingBottom: 40,
    }}
  >
    {children}
  </div>
);

const TypingBeat: React.FC = () => (
  <Surface>
    <PageBehind />
    <ComposerStage>
      <LiveComposer
        width={CENTERED_W}
        s={1.32}
        mode={{
          kind: "typing",
          text: "Explain the law of demand with a local example",
          startAt: 26,
          cps: 19,
          sendAt: 196,
        }}
      />
    </ComposerStage>
    <Caption
      safe
      side="top"
      headline="Stuck? Ask the step."
      sub="In your own words, without leaving the page."
    />
  </Surface>
);

/** A level meter under the composer, so the voice beat reads as listening. */
const VoiceBars: React.FC<{ startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, (frame - startAt) / fps);
  const on = spring({ frame: frame - startAt, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        height: 60,
        marginTop: 30,
        opacity: on,
      }}
    >
      {Array.from({ length: 21 }, (_, i) => {
        /* Each bar samples the envelope a little later than its neighbour, so
         * the level appears to travel across the meter instead of pulsing as
         * one block. */
        const lag = i * 0.028;
        const v = Math.max(
          0,
          Math.min(1, (Math.sin(t * 7 + i) * 0.18 + 0.82) * speechEnvelope(t - lag)),
        );
        return (
          <span
            key={i}
            style={{
              width: 7,
              height: 8 + v * 52,
              borderRadius: 999,
              background: UI.ink,
              opacity: 0.18 + v * 0.62,
            }}
          />
        );
      })}
    </div>
  );
};

const VoiceBeat: React.FC = () => (
  <Surface>
    <PageBehind />
    <ComposerStage>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 44 }}>
        <Mic size={96} line={UI.ink} duo="#d6c9ec" />
      </div>
      <LiveComposer width={CENTERED_W} s={1.32} mode={{ kind: "voice", startAt: 18 }} />
      <VoiceBars startAt={18} />
    </ComposerStage>
    <Caption
      safe
      side="top"
      headline="Or just say it."
      sub="The glow follows your voice. Answers are in preview — we're building that now."
    />
  </Surface>
);

/* ------------------------------------------------------------------ */

const ICON = { size: 108, line: UI.ink, duo: "#c3cdea" };

export const InAction: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: UI.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.hook}>
        <Surface>
          <Statement
            safe
            icon={<Book {...ICON} />}
            headline="Your whole course."
            sub="One place, in order, on your phone."
          />
        </Surface>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      <TransitionSeries.Sequence durationInFrames={D.nav}>
        <NavBeat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...slideLeft} />

      <TransitionSeries.Sequence durationInFrames={D.scroll}>
        <ScrollBeat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      <TransitionSeries.Sequence durationInFrames={D.askIntro}>
        <Surface>
          <Statement
            safe
            icon={<Chat {...ICON} />}
            eyebrow="And when it doesn't land"
            headline="Ask the page itself."
          />
        </Surface>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...slideUp} />

      <TransitionSeries.Sequence durationInFrames={D.typing}>
        <TypingBeat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      <TransitionSeries.Sequence durationInFrames={D.voice}>
        <VoiceBeat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      <TransitionSeries.Sequence durationInFrames={D.finish}>
        <Surface>
          <Statement
            safe
            icon={<Flip {...ICON} />}
            headline="A course you can actually finish."
          />
        </Surface>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      <TransitionSeries.Sequence durationInFrames={D.cta}>
        <Surface>
          <Statement
            safe
            mark
            headline="Search Booklesss on Google."
            sub="Three S's at the end."
          />
        </Surface>
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
