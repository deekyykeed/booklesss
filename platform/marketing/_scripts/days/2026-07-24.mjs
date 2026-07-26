/* 2026-07-24 — launch day. Kept so the day stays reproducible; the images that
 * shipped are in posts/2026-07-24/. */

export const title = "launch day";

export const note = `Three carousels, all about **Booklesss the platform** — a home for *every*
course, never one subject. 9:16, all light, un-boxed **superzoom** shots (a
specific area of the UI, never the whole app), ending on the Google search-bar
CTA. Post each folder's images in order (\`01 → 05\`).

> All light for now — dark-background posts wait until the app has a real dark
> mode (a light screenshot on a dark canvas doesn't sit right).`;

export const slots = ({ cover, bleed, promise, searchCTA, crops }) => ({
  morning: {
    time: "~08:00",
    postTitle: "Meet Booklesss — every course, one place",
    caption: `Meet Booklesss 📚 — every course you'll ever take, in one place. Computer
science, maths, history, design… clear lessons, instant navigation, and no
textbook required.
Search **booklesss** (three s's) on Google — we're the first result. 👇
#learning #edtech #studytok #buildinpublic #onlinelearning`,
    slides: [
      cover({ eyebrow: "Introducing", title: "Meet<br>Booklesss.", sub: "Every course you'll ever take &mdash; in one place, without the textbook." }),
      bleed({ ...crops.subjects, title: "Every subject,<br>one place.", sub: "Whatever you're learning next, it lives here." }),
      bleed({ ...crops.active, title: "Never lose<br>your place.", sub: "It always knows where you are." }),
      promise({ title: "Learn anything,<br>without the textbook.", line: "Clear. Fast. Free to start." }),
      searchCTA(),
    ],
  },
  afternoon: {
    time: "~13:00",
    postTitle: "Ditch the textbook",
    caption: `You don't need a $200 textbook to learn something new. Booklesss teaches any
subject in plain English — free, fast, and actually nice to read.
Search **booklesss** (three s's) on Google, or comment "link". 👇
#studytok #edtech #college #onlinelearning #selftaught`,
    slides: [
      cover({ eyebrow: "A new way to learn", title: "Ditch the<br>textbook.", sub: "Booklesss teaches any subject in plain English. Free.", subTop: 1010 }),
      bleed({ ...crops.lessons, title: "A clear path<br>through anything.", sub: "Start here. Move on when it clicks." }),
      bleed({ ...crops.subjects, title: "One home for<br>everything.", sub: "Maths, code, history, design &mdash; all in here." }),
      promise({ title: "No textbooks.<br>No limits.", line: "Just open it and learn." }),
      searchCTA(),
    ],
  },
  evening: {
    time: "~19:00",
    postTitle: "We rebuilt the textbook (as software)",
    caption: `We rebuilt the textbook as software — one instant app for every subject, fast
and quiet, obsessive about the details.
Search **booklesss** (three s's) on Google. 👇
#buildinpublic #designengineering #edtech #nextjs #indiehackers`,
    slides: [
      cover({ eyebrow: "For people who like good software", title: "We rebuilt<br>the textbook.", sub: "One home for everything you learn &mdash; fast, quiet, and a little obsessive.", subTop: 1010 }),
      bleed({ ...crops.toc, title: "See the shape<br>of every lesson.", sub: "Overview, key ideas, practice, summary." }),
      bleed({ ...crops.active, title: "A 3px detail<br>we sweated.", sub: "It rides with you, frame-perfect." }),
      promise({ title: "Booklesss.", line: "Learn anything without the textbook." }),
      searchCTA(),
    ],
  },
});
