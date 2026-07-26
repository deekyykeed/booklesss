/* 2026-07-26 — three things you can only show, not say: search, the runnable
 * playground, and the shape every lesson shares. Same house style as launch
 * day: light, un-boxed superzooms, Google search-bar CTA to close. */

export const title = "show the app";

export const note = `Launch day said what Booklesss *is*. Today shows what it **does** — one slot
per thing you can only understand by seeing it: search, the runnable code
panel, and the shape every lesson shares. 9:16, all light, un-boxed
**superzoom** shots, ending on the Google search-bar CTA. Post each folder's
images in order (\`01 → 05\`).

> Copy stays on the product, never on the economics content. No prices, no
> deadlines, no invite links — the CTA is the Google search bar, same as
> launch day.`;

export const slots = ({ cover, bleed, promise, searchCTA, crops }) => ({
  // Search — the fastest "oh, that's nice" in the app.
  morning: {
    time: "~08:00",
    postTitle: "Find any lesson in a second",
    caption: `One box, everything in it 🔎 — courses, lessons and docs all come back from the
same search. No folders to dig through, no tab you left open somewhere.
Search **booklesss** (three s's) on Google — we're the first result. 👇
#studytok #edtech #learning #onlinelearning #buildinpublic`,
    slides: [
      cover({
        eyebrow: "Built for speed",
        title: "Find it in<br>a second.",
        sub: "Every course, every lesson, one keystroke away.",
      }),
      bleed({
        ...crops.command,
        title: "One box for<br>everything.",
        sub: "Courses, lessons, docs &mdash; they all come back here.",
      }),
      bleed({
        ...crops.active,
        title: "Land exactly<br>where you left.",
        sub: "It remembers the lesson you were on.",
      }),
      promise({
        title: "No folders.<br>No open tabs.",
        line: "Type two letters, land on the page.",
      }),
      searchCTA(),
    ],
  },
  // The playground — the thing no PDF or textbook can do.
  afternoon: {
    time: "~13:00",
    postTitle: "Read it, then run it",
    caption: `Reading about it is one thing — running it is another 🧪 A lesson can carry a
real editor: change a number, hit Run, watch the answer move. JavaScript and
Python, nothing to install.
Search **booklesss** (three s's) on Google, or comment "link". 👇
#learntocode #studytok #edtech #javascript #python`,
    slides: [
      cover({
        eyebrow: "Read it, then run it",
        title: "Try it right<br>here.",
        sub: "Change a number, hit Run, watch the answer move.",
        subTop: 1010,
      }),
      bleed({
        ...crops.playground,
        title: "Code that runs<br>in the lesson.",
        sub: "JavaScript or Python. Nothing to install.",
      }),
      bleed({
        ...crops.reader,
        title: "Plain language<br>first.",
        sub: "The idea in a paragraph, then the practice.",
      }),
      promise({
        title: "Learning you<br>can poke at.",
        line: "Open it, break it, run it again.",
      }),
      searchCTA(),
    ],
  },
  // Craft — for the build-in-public crowd. Structure as the feature.
  evening: {
    time: "~19:00",
    postTitle: "Every lesson, the same shape",
    caption: `The best thing about Booklesss is the boring thing: every lesson has the same
four sections, so you always know where you are and what's left. Learn the
layout once, use it on every subject.
Search **booklesss** (three s's) on Google. 👇
#buildinpublic #designengineering #edtech #ux #indiehackers`,
    slides: [
      cover({
        eyebrow: "Same shape, every time",
        title: "Every lesson,<br>one shape.",
        sub: "Overview, key ideas, in practice, summary &mdash; in that order, every time.",
        subTop: 1010,
      }),
      bleed({
        ...crops.toc,
        title: "See the whole<br>lesson at once.",
        sub: "Four sections, and a line that follows you down.",
      }),
      bleed({
        ...crops.subjects,
        title: "One shelf for<br>every subject.",
        sub: "The next course slots in beside the last.",
      }),
      promise({
        title: "Consistency is<br>the feature.",
        line: "Learn the layout once. Use it everywhere.",
      }),
      searchCTA(),
    ],
  },
});
