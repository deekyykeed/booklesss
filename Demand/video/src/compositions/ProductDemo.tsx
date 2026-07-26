import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Screen, type Cam } from "../components/Screen";
import { Caption, Scrim, Statement, UI } from "../components/Overlay";
import type { ShotKey } from "../shots";

/* ------------------------------------------------------------------ *
 * Booklesss — 60 second product demo. 1080x1920.
 *
 * Every app frame is a REAL capture of the reader (see ../shots.ts), shown
 * full-bleed with no device mockup and no card — the treatment the owner
 * settled on for the social progress posts: the screenshot fills the frame,
 * zoomed into the part that matters, with a soft fade only where the headline
 * sits. The camera moves over the still: push-ins, cross-pans, a slow vertical
 * scroll, a little rotateY so shots don't all sit flat-on.
 *
 * Copy rule, carried from prog-post.mjs: the AI tutor is in PREVIEW — no
 * backend yet — so it says "we're building this", never "it answers".
 *
 * Timing: the scene durations below sum to 1900; ten 10-frame transitions
 * overlap, so the composition is exactly 1800 frames = 60.0s at 30fps.
 * ------------------------------------------------------------------ */

const T = 10; // transition length, frames

type BeatDef = {
  dur: number;
  shot: ShotKey;
  from: Cam;
  to: Cam;
  focus?: { x?: number; y?: number };
  ease?: boolean;
  side: "top" | "bottom";
  headline: string;
  sub?: string;
};

/** One app beat: the moving shot, the fade under the type, the type. */
const Beat: React.FC<BeatDef> = ({ dur, shot, from, to, focus, ease, side, headline, sub }) => (
  <AbsoluteFill style={{ backgroundColor: UI.bg }}>
    <Screen shot={shot} dur={dur} from={from} to={to} focus={focus} ease={ease} />
    <Scrim side={side} extent={side === "top" ? 44 : 42} />
    <Caption side={side} headline={headline} sub={sub} />
  </AbsoluteFill>
);

const D = {
  open: 165,
  scatter: 160,
  lesson: 190,
  nav: 185,
  read: 195,
  ask: 140,
  typed: 180,
  voice: 190,
  finish: 155,
  contents: 160,
  cta: 180,
} as const;

export const PRODUCT_DEMO_DURATION =
  Object.values(D).reduce((a, b) => a + b, 0) - T * 10; // 1900 - 100 = 1800

const fadeT = { presentation: fade(), timing: linearTiming({ durationInFrames: T }) };
const slideUp = {
  presentation: slide({ direction: "from-bottom" as const }),
  timing: linearTiming({ durationInFrames: T }),
};
const slideLeft = {
  presentation: slide({ direction: "from-right" as const }),
  timing: linearTiming({ durationInFrames: T }),
};

export const ProductDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: UI.bg }}>
    <TransitionSeries>
      {/* 1 — cold open */}
      <TransitionSeries.Sequence durationInFrames={D.open}>
        <Statement mark headline="Studying, made easy." sub="This is Booklesss." />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      {/* 2 — the problem, kept light */}
      <TransitionSeries.Sequence durationInFrames={D.scatter}>
        <Statement
          eyebrow="Right now"
          headline="A group chat, a slide deck, and three PDFs."
          sub="Somewhere in there is your course."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      {/* 3 — the reveal: top of a real lesson */}
      <TransitionSeries.Sequence durationInFrames={D.lesson}>
        <Beat
          dur={D.lesson}
          shot="lessonTop"
          from={{ scale: 1.14, ry: -9, x: 26 }}
          to={{ scale: 1.0, ry: 0, x: 0 }}
          focus={{ y: 0 }}
          ease
          /* Bottom, so the app's own kicker and lesson title stay readable —
             this is the reveal shot, the real title is the point. */
          side="bottom"
          headline="Instead: one place."
          sub="Written to be read, not slides dumped in a folder."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...slideLeft} />

      {/* 4 — the course tree */}
      <TransitionSeries.Sequence durationInFrames={D.nav}>
        <Beat
          dur={D.nav}
          shot="nav"
          from={{ scale: 1.16, x: 70, ry: 7 }}
          to={{ scale: 1.06, x: -46, ry: -2 }}
          focus={{ y: 0 }}
          side="bottom"
          headline="The whole course, in order."
          sub="Every lesson, every step — one tap away."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      {/* 5 — reading. The camera scrolls the page. */}
      <TransitionSeries.Sequence durationInFrames={D.read}>
        <Beat
          dur={D.read}
          shot="reader"
          from={{ scale: 1.07, y: 150 }}
          to={{ scale: 1.07, y: -320 }}
          focus={{ y: 0 }}
          side="top"
          headline="Made to actually read."
          sub="Real examples, in plain language, in the order they make sense."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...slideUp} />

      {/* 6-8 — the tutor. In preview: "building this", never "it answers". */}
      <TransitionSeries.Sequence durationInFrames={D.ask}>
        <Beat
          dur={D.ask}
          shot="bandRest"
          /* bandRest is 1206 wide against a 1080 frame, so it is already
             cropped 240px a side by the cover fit — extra scale eats the
             composer's send button. Stay close to 1. */
          from={{ scale: 1.06, rx: 7, y: -215 }}
          to={{ scale: 1.14, rx: 0, y: -290 }}
          focus={{ y: 1 }}
          ease
          side="top"
          headline="Stuck on a line?"
          sub="Ask the step itself — no new tab, no new app."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...slideLeft} />

      <TransitionSeries.Sequence durationInFrames={D.typed}>
        <Beat
          dur={D.typed}
          shot="typedFull"
          /* Full-screen shots already cover the frame width exactly, so any
             scale above ~1.2 starts slicing the question box. Keep it modest
             and win the closeness back with the upward offset. */
          from={{ scale: 1.2, y: -380, ry: 5 }}
          to={{ scale: 1.12, y: -320, ry: 0 }}
          focus={{ y: 1 }}
          ease
          side="top"
          headline="Ask in your own words."
          sub="In preview — we're building this part now."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      <TransitionSeries.Sequence durationInFrames={D.voice}>
        <Beat
          dur={D.voice}
          shot="bandVoice"
          from={{ scale: 1.12, ry: -6, y: -262 }}
          to={{ scale: 1.03, ry: 3, y: -222 }}
          focus={{ y: 1 }}
          side="top"
          headline="Or say it out loud."
          sub="Voice mode, also in preview — the glow follows your voice."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      {/* 9 — the point */}
      <TransitionSeries.Sequence durationInFrames={D.finish}>
        <Statement
          headline="A course you can actually finish."
          sub="Not a folder you keep meaning to open."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      {/* 10 — contents */}
      <TransitionSeries.Sequence durationInFrames={D.contents}>
        <Beat
          dur={D.contents}
          shot="onThisPage"
          from={{ scale: 1.16, ry: -7, x: -34 }}
          to={{ scale: 1.26, ry: 0, x: 12 }}
          /* Bias right: the contents panel is on that edge, and a centred crop
             slices the body column into unreadable word-fragments. */
          focus={{ x: 0.92, y: 0 }}
          ease
          side="bottom"
          headline="Jump to any part of a step."
          sub="Contents always to hand."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT} />

      {/* 11 — CTA. The student-facing one: the search, not a link. */}
      <TransitionSeries.Sequence durationInFrames={D.cta}>
        <Statement mark headline="Search Booklesss on Google." sub="Three S's at the end." />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
