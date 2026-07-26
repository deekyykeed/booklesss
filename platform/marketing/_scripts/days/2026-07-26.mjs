/* 2026-07-26 — morning only. Everything in frame is the app as it stands today,
 * captured this morning (7-ai-crops.mjs): the top bar, the STEP panel, and the
 * AI composer at the bottom of it — including voice mode lit up.
 *
 * The tutor has no backend yet, and the app says so in its own hint text
 * ("AI tutor — coming soon"), which is left visible in the crops. So the slot
 * is written as build-in-public: here is the thing being built, not here is a
 * thing that works. Nothing claims an answer comes back. */

export const title = "the AI layer, in progress";

export const note = `Morning only today. One carousel, all of it shot from the **current** build —
the top bar, the STEP panel, and the AI composer that now lives at the bottom
of it, voice mode included. 9:16, light, un-boxed superzooms, Google
search-bar CTA to close. Post in order (\`01 → 06\`).

> The tutor isn't wired to a backend yet and the app's own "coming soon" hint
> is left in the shots — the copy is build-in-public, and never says an answer
> comes back. No prices, no deadlines, no invite links.`;

export const slots = ({ cover, bleed, strip, searchCTA, crops }) => ({
  morning: {
    time: "~08:00",
    postTitle: "The tutor, being built into the page",
    caption: `Building the AI layer into Booklesss in the open 🛠️ It doesn't answer yet —
this is the part that's finished: a panel for the step you're on, a box to ask
in, and a voice mode that lights up as you talk. Answers next.
Search **booklesss** (three s's) on Google — we're the first result. 👇
#buildinpublic #edtech #ai #designengineering #studytok`,
    slides: [
      cover({
        eyebrow: "The AI layer · in progress",
        title: "Ask the page<br>a question.",
        sub: "We're building the tutor into the reader. Here's what's on screen today.",
        subTop: 1010,
      }),
      strip({
        ...crops.topbar,
        title: "You always know<br>where you are.",
        sub: "Subject, section, step &mdash; across the top of every page.",
      }),
      bleed({
        ...crops.panel,
        title: "A panel for the<br>step you're on.",
        sub: "Contents up top. What you ask sits underneath it.",
      }),
      strip({
        ...crops.composer,
        title: "The box sits next<br>to the words.",
        sub: "Ask where you got stuck &mdash; not in another tab. Answers are being wired now.",
      }),
      strip({
        ...crops.voice,
        title: "Or say it<br>out loud.",
        sub: "Voice mode lights up as you speak.",
      }),
      searchCTA(),
    ],
  },
});
