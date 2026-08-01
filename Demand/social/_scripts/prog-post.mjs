/* Progress posts — build-in-public carousels about real features, shot from the
 * live app (mobile). 9:16, light. FULL-BLEED: the app screenshot fills the frame
 * (no cards / no boxes), zoomed into the part that matters, with a soft fade only
 * where the headline sits so the text stays readable. Honest framing: the AI
 * tutor is in preview, so the copy says "building this", not "it answers".
 *
 *   node _scripts/prog-post.mjs                 # POST=aitutor -> afternoon
 *   POST=reading node _scripts/prog-post.mjs    # -> evening
 *
 * Shots come from _source/feature-capture/ (run cap-feature.mjs first, dev up). */
import { chromium, POSTS, SOURCE, INTER_DATA, FAMILJEN_DATA, dayFolder } from "./paths.mjs";
import fs from "fs";
import path from "path";

const DAY = process.env.DAY || new Date().toLocaleDateString("en-CA");
const POST = process.env.POST || "aitutor";

/* Shots are read on demand, not all up front: each day's capture script writes
 * only the shots that day's posts need, so eagerly loading every name would
 * make an older post fail because a newer one hasn't been captured. */
const CAP = path.join(SOURCE, "feature-capture");
const img = (f) => "data:image/png;base64," + fs.readFileSync(path.join(CAP, f)).toString("base64");

const INTER = INTER_DATA();
const FAMILJEN = FAMILJEN_DATA();

/* ---------------------------------------------------------------- *
 * THE SAFE AREA — the hard boundary every word has to live inside.
 *
 * The frame is 1080x1920, but the reader never sees all of it: the app
 * draws its own furniture on top. Measured against Reels and TikTok at
 * 9:16, the covered regions are
 *
 *   top     the account header and progress bars      ~ 0 -  300
 *   right   the like / comment / share / avatar rail  ~ 880 - 1080
 *   bottom  the caption, handle and audio strip       ~ 1400 - 1920
 *
 * The right rail is the one that kept catching us out: at the old
 * 150px margin every sub-heading ran to x=930, which is underneath the
 * share button. The text was there — it just could not be read.
 *
 * These margins are deliberately pessimistic. Losing 80px of line
 * length costs a wrap; losing a sentence under a button costs the post.
 * ---------------------------------------------------------------- */
const SAFE = {
  top: 300,
  bottom: 1400, // nothing may extend past this y
  left: 96,
  right: 232, // margin from the right edge -> text ends at x=848
};
const SAFE_W = 1080 - SAFE.left - SAFE.right;

const INK = "#0D0D0F", SUB = "#5F5F68", EYE = "#6C4CF0", BG = "#F6F6F9";

const LOGO = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none">
<path d="M3.46484 20.5359c1.46447 1.4645 3.82149 1.4645 8.53556 1.4645 4.714 0 7.071 0 8.5355 -1.4645 1.4645 -1.4645 1.4645 -3.8215 1.4645 -8.5355 0 -4.71407 0 -7.07109 -1.4645 -8.53556L3.46484 20.5359Z" fill="#737374"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355L20.5355 3.46447C19.0711 2 16.714 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447Z" fill="#000000"/></svg>`;

const GOOGLE_G = `<svg viewBox="0 0 48 48" width="54" height="54" xmlns="http://www.w3.org/2000/svg">
<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
const LENS = `<svg width="46" height="46" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#4285F4" stroke-width="2"/><path d="m20 20-3.2-3.2" stroke="#4285F4" stroke-width="2" stroke-linecap="round"/></svg>`;

const GRAIN = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter><rect width="220" height="220" filter="url(#n)" opacity="0.5"/></svg>`);

const CSS = `
@font-face{font-family:PSans;src:url(${INTER}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:PDisplay;src:url(${FAMILJEN}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:PSans,system-ui,sans-serif;position:relative;-webkit-font-smoothing:antialiased;background:${BG}}
.gradient{position:absolute;inset:0;z-index:0;background:
  radial-gradient(1000px 780px at 92% 2%, rgba(139,124,255,.30), transparent 60%),
  radial-gradient(820px 700px at -8% 64%, rgba(96,166,255,.24), transparent 62%),
  radial-gradient(760px 560px at 62% 104%, rgba(255,176,124,.18), transparent 60%),
  linear-gradient(#FCFCFD,#F2F3F6)}
.grain{position:absolute;inset:0;z-index:6;pointer-events:none;background-image:url("${GRAIN}");background-size:220px 220px;opacity:.26;mix-blend-mode:overlay}
.layer{position:absolute;inset:0;z-index:4}
/* The focal UI is lifted into the social safe box (clear of the top ~260px, the
   bottom ~460px, and the right button rail). The shot bleeds off the sides; it
   dissolves into the light at the top (under the headline) and at the bottom
   (leaving the caption zone clear). No card, no border. */
.shot{position:absolute;z-index:1;width:1120px}
/* Image-only slide: the crop fills the frame exactly. A 9:16 source at 1080
   wide is 1920 tall, so there is no edge to hide and nothing to align. */
.plain-shot{position:absolute;inset:0;z-index:1;width:1080px;height:1920px;object-fit:cover;object-position:top center}
.fade-top{position:absolute;top:0;left:0;right:0;z-index:2;background:linear-gradient(to bottom,
  ${BG} 0%, ${BG} 80%, rgba(246,246,249,0) 100%)}
.fade-bot{position:absolute;bottom:0;left:0;right:0;z-index:2;background:linear-gradient(to top,
  ${BG} 0%, ${BG} 30%, rgba(246,246,249,0) 100%)}
.wm{position:absolute;left:${SAFE.left}px;top:${SAFE.top + 16}px;display:flex;align-items:center;gap:13px;z-index:7;color:${INK}}
.wm span{font-size:27px;font-weight:600;letter-spacing:-.022em}
.eyebrow{font-size:24px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${EYE}}
h1{font-family:PDisplay,PSans,sans-serif;font-weight:500;letter-spacing:-.035em;color:${INK}}
.sub{letter-spacing:-.008em;color:${SUB}}
`;

const wordmark = `<div class="wm">${LOGO(32)}<span>Bklsss</span></div>`;

// text-only slide (cover / closer) — sits on the brand gradient
const cover = (o) => ({ bg: "gradient", html: `<div class="layer">
  <div class="eyebrow safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:560px">${o.eyebrow}</div>
  <h1 class="safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:612px;font-size:${o.size || 104}px;line-height:1.0">${o.title}</h1>
  <p class="sub safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:${o.subTop || 1010}px;font-size:38px;line-height:1.42">${o.sub}</p>
</div>` });

// app shot lifted into the safe zone, dissolving at top (under the headline) and
// bottom (clearing the caption zone). `top` places the shot so the focal UI lands
// around the vertical centre.
//
// fadeTop/fadeBot are per-slide because how much room a shot needs depends on
// what is in it: a composer is one small object and can sit in the middle, but a
// seven-row table is 800px tall and the default fades eat its last rows. Widen
// the window for those, and keep the default where the focal UI is compact.
/* `shotLeft` is how far the shot hangs off the left edge. The frame is 1080 and
 * the shot is 1120, so the default -40 bleeds it equally either side — right for
 * a whole-screen shot, where the edges are chrome nobody needs.
 *
 * It has to be 0 for a tight macro. Those crops are already framed to the pixel
 * by the capture script, and a further 40px shaved off the left takes the first
 * letter of every line with it — which is what turned "first-year" into
 * "irst-year" in an otherwise finished slide. */
const feature = (o) => ({
  bg: "shot",
  img: o.img,
  top: o.top ?? -520,
  shotLeft: o.shotLeft ?? -40,
  fadeTop: o.fadeTop ?? 1000,
  fadeBot: o.fadeBot ?? 560,
  html: `<div class="layer">
  <h1 class="safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:${o.h1 || 360}px;font-size:${o.size || 96}px;line-height:1.02">${o.title}</h1>
  <p class="sub safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:${o.subTop || 640}px;font-size:${o.subSize || 39}px;line-height:1.4">${o.sub || ""}</p>
</div>`,
});

/* An app shot with NOTHING on it (owner's call, 2026-08-01).
 *
 * A `feature()` slide is a shot with a headline over it, so the top of the
 * image dissolves into the background and the framing only has to be right
 * where the copy isn't. This is the other thing: the crop IS the slide. The
 * shot fills the frame edge to edge — 1080 wide, and a 9:16 source is then
 * exactly 1920 tall — with no fade, no wordmark and no text, because every one
 * of those is something drawn over the app rather than the app.
 *
 * Which means all the honesty rules land on the capture instead: what is in
 * the crop is the whole post. There is no `top` to nudge and nothing to hide a
 * bad edge behind, so a shot that arrives cut off is re-captured, not re-laid
 * out here. */
const plain = (o) => ({ bg: "plain", img: o.img, html: "" });

// closing Google search CTA — DM (never comment), trimmed, bigger sub
const searchCTA = () => ({ bg: "gradient", wordmark: true, html: `<div class="layer">
  <h1 class="safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:470px;font-size:100px;line-height:1.0">Search<br>booklesss.</h1>
  <p class="sub safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:760px;font-size:38px;line-height:1.35">Three s&rsquo;s. We&rsquo;re the first result on Google.</p>
  <div class="safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:890px;height:132px;background:#fff;border:1px solid #e6e6ea;border-radius:66px;box-shadow:0 2px 4px rgba(20,20,40,.05),0 18px 40px -14px rgba(20,20,50,.22);display:flex;align-items:center;gap:24px;padding:0 40px">
    <span style="display:flex;flex-shrink:0">${GOOGLE_G}</span>
    <span style="font-size:46px;color:#3c4043;letter-spacing:-.01em">bookle<b style="font-weight:800;color:#202124">sss</b><span style="display:inline-block;width:3px;height:45px;background:#4285F4;margin-left:4px;vertical-align:-8px"></span></span>
    <span style="margin-left:auto;display:flex;flex-shrink:0">${LENS}</span>
  </div>
  <p class="sub safe" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:1100px;font-size:40px;line-height:1.35;color:${INK}">Or DM me <b>&ldquo;link&rdquo;</b>. &#128071;</p>
</div>` });

/* ---- posts ----
 * Each entry is a thunk so only the selected post's shots are read off disk. */
const CONFIGS = {
  aitutor: () => ({
    slot: "afternoon",
    slides: [
      cover({ eyebrow: "Building in public", title: "An AI tutor,<br>in your notes.", sub: "A look at what we&rsquo;re wiring into the reader right now." }),
      feature({ img: img("af-page.png"), title: "It lives right<br>in the page.", sub: "No new tab &mdash; it knows the exact step you&rsquo;re on.", top: -700 }),
      feature({ img: img("af-voice.png"), title: "Ask, or just<br>talk to it.", sub: "Voice mode &mdash; speak, and the whole thing lights up.", top: -640 }),
      feature({ img: img("af-typed.png"), title: "Or type it<br>out.", sub: "Ask about the exact step, in your own words.", top: -640 }),
      cover({ eyebrow: "In the works", title: "Coming to<br>Booklesss soon.", sub: "The AI tutor + voice mode &mdash; we&rsquo;re building it now. First look.", subTop: 1020 }),
      searchCTA(),
    ],
  }),
  reading: () => ({
    slot: "evening",
    slides: [
      cover({ eyebrow: "Building in public", title: "Your whole<br>course, sorted.", sub: "Every subject in one place &mdash; and actually nice to read." }),
      feature({ img: img("ev-nav.png"), title: "Every subject,<br>one tap away.", sub: "Jump anywhere in the course, instantly.", top: -220 }),
      feature({ img: img("ev-reader.png"), title: "Made for<br>reading.", sub: "Plain English, clean pages, nothing in the way.", top: -240 }),
      cover({ eyebrow: "In the works", title: "More, every<br>week.", sub: "We&rsquo;re building Booklesss in the open. Follow along.", subTop: 1020 }),
      searchCTA(),
    ],
  }),

  /* 2026-07-27 — the app stopped being a one-course app. */
  courses: () => ({
    slot: "afternoon",
    slides: [
      cover({ eyebrow: "Building in public", title: "A second course<br>just landed.", sub: "Corporate Finance is live on Booklesss &mdash; and adding the next one is now just writing it." }),
      feature({ img: img("cf-dash.png"), title: "Two courses,<br>one place.", sub: "Side by side, each with how far you&rsquo;ve actually got.", top: -180 }),
      feature({ img: img("cf-home.png"), title: "Every course<br>gets a home.", sub: "Where you are, and the one obvious thing to do next.", top: 820 }),
      feature({ img: img("cf-nav.png"), title: "Real ZCAS<br>material.", sub: "BAC4301 investment appraisal &mdash; free cash flows, NPV, IRR.", top: 800, fadeBot: 460 }),
      feature({ img: img("cf-search.png"), title: "One search,<br>every course.", sub: "Type a word, land on the section that explains it.", top: 740, fadeBot: 460 }),
      cover({ eyebrow: "In the works", title: "More courses,<br>every week.", sub: "We&rsquo;re building Booklesss in the open. Follow along.", subTop: 1020 }),
      searchCTA(),
    ],
  }),

  /* 2026-07-27 evening — what the new course's writing actually looks like. */
  finance: () => ({
    slot: "evening",
    slides: [
      cover({ eyebrow: "Building in public", title: "Finance notes that<br>show the working.", sub: "We rewrote Corporate Finance so the maths explains itself.", subTop: 1010 }),
      feature({ img: img("cf-formula.png"), title: "Every formula,<br>in plain English.", sub: "What each letter means, right under it.", top: 300 }),
      /* A whole discounting table plus its total is taller than the default
       * window, so this slide trades some of the bottom fade for the last rows
       * — the ZMW1,967 answer is the point of the shot. */
      feature({ img: img("cf-table.png"), title: "Worked in<br>kwacha.", sub: "Real ZMW numbers, down to the answer.", top: 300, fadeBot: 330 }),
      feature({ img: img("cf-check.png"), title: "Then it checks<br>you got it.", sub: "A question at the end of each section. The tick has to be earned.", top: 580, fadeBot: 340 }),
      cover({ eyebrow: "In the works", title: "Cost of capital<br>is next.", sub: "One step at a time, written from the real ZCAS lectures.", subTop: 1020 }),
      searchCTA(),
    ],
  }),

  /* 2026-07-28 — the dashboard rebuilt around measuring the studying. */
  measured: () => ({
    slot: "afternoon",
    slides: [
      cover({ eyebrow: "Building in public", title: "Your studying,<br>now measured.", sub: "The dashboard got rebuilt around one question: how much did you actually read?", subTop: 1010 }),
      feature({ img: img("d-week.png"), title: "A week of<br>real minutes.", sub: "Time read per day, with a momentum line through it.", top: 800, fadeBot: 380 }),
      /* No screenshot for this one on purpose — the rule is the feature, and it
       * is the most honest thing we shipped all day. */
      cover({ eyebrow: "How it counts", title: "Only while<br>you're reading.", sub: "Tab hidden, or nothing moves for a minute, and the clock stops. It would rather undercount than flatter you.", subTop: 990 }),
      feature({ img: img("d-tiles.png"), title: "Four numbers,<br>each with a trend.", sub: "Streak, days, checkpoints, steps — and how each moved on last week.", top: 630, fadeBot: 400 }),
      feature({ img: img("d-courses.png"), title: "Both courses,<br>redesigned.", sub: "One card each, the spine showing where in the course the work landed.", top: 527, fadeBot: 400 }),
      cover({ eyebrow: "In the works", title: "The next card,<br>drawn by hand.", sub: "We built seven candidate designs, threw them all out, and started again.", subTop: 1010 }),
      searchCTA(),
    ],
  }),

  /* 2026-07-28 evening — a day spent taking things off the reading page. */
  quieter: () => ({
    slot: "evening",
    slides: [
      cover({ eyebrow: "Building in public", title: "The reader<br>got quieter.", sub: "A whole day of taking things off the page you actually read on." }),
      feature({ img: img("r-read.png"), title: "Bigger type,<br>lighter weight.", sub: "Base text up to 18px. Long passages stopped fighting back.", top: -60 }),
      feature({ img: img("r-index.png"), title: "A course home<br>that reads.", sub: "What the course is and where you left off — written out, not a wall of tiles.", top: 340, fadeBot: 400 }),
      feature({ img: img("r-nav.png"), title: "One sidebar,<br>one job.", sub: "The steps, their rings, and a way back. Nothing else.", top: 800, fadeBot: 460 }),
      cover({ eyebrow: "In the works", title: "Less of it,<br>every week.", sub: "We&rsquo;re building Booklesss in the open. Follow along.", subTop: 1020 }),
      searchCTA(),
    ],
  }),

  /* ------------------------------------------------------------------ *
   * 2026-07-30 — five slots.
   *
   * One day of commits, five posts. The day's shipping was all one thing —
   * the home page rebuilt around measuring the studying — so these are five
   * ANGLES on it, not five announcements. Each slot has one sentence it is
   * trying to prove, and its own shots; where a slot had nothing new to show
   * it gets a written slide instead of a recycled crop.
   *
   * Not one of them names a course or a school. The screenshots carry a
   * neutral two-subject curriculum (see neutralize.mjs) and the copy stays on
   * the product, because Booklesss is not one syllabus.
   * ------------------------------------------------------------------ */

  /* 1 — the chart we deleted.
   *
   * This slot was built twice. The first version was a tour of the study chart;
   * between capturing it and rendering it the chart was rebuilt, then reverted,
   * then dropped from the page altogether. Rather than post a tour of a screen
   * that no longer exists, the deletion became the story — which is the more
   * honest build-in-public post anyway. */
  "w-chart": () => ({
    slot: "1-morning",
    slides: [
      cover({ eyebrow: "Building in public", title: "We deleted<br>the chart.", sub: "Built it, rebuilt it four times, then took it off the page completely. Today, in one day." }),
      feature({ img: img("w-score-all.png"), shotLeft: 0, title: "One number<br>took its place.", sub: "Out of 100, with how far it moved on last week.", top: 566 }),
      feature({ img: img("w-tiles.png"), title: "And it leads<br>the page now.", sub: "The first thing you see is where you stand, not a graph you have to read.", top: 500, fadeTop: 1020, fadeBot: 440 }),
      cover({ eyebrow: "What we learnt", title: "A chart is not<br>an answer.", sub: "It looked impressive and told you nothing you could act on. A score you can compare to last week does more work than seven days of lines.", subTop: 960 }),
      searchCTA(),
    ],
  }),

  /* 2 — the four tiles. */
  "w-tiles": () => ({
    slot: "2-midday",
    slides: [
      cover({ eyebrow: "Building in public", title: "Three numbers,<br>that earn it.", sub: "A tile has to earn its place by changing what you do next. Three that did." }),
      feature({ img: img("w-tile-first.png"), shotLeft: 0, title: "How much<br>sticks first time.", sub: "Not how many you got right eventually. How many you got right first try.", top: 566 }),
      feature({ img: img("w-tile-stale.png"), shotLeft: 0, title: "What is<br>slipping away.", sub: "Steps you finished a while ago and have not looked at since.", top: 566 }),
      feature({ img: img("w-tile-weak.png"), shotLeft: 0, title: "And the one<br>to go back to.", sub: "It names your weakest step, so the next move is never a guess.", top: 566 }),
      cover({ eyebrow: "In the works", title: "Fewer numbers,<br>not more.", sub: "A dashboard earns a tile by changing a decision. Everything else came off.", subTop: 1000 }),
      searchCTA(),
    ],
  }),

  /* 3 — the course card, which took the whole day and about fifteen attempts. */
  "w-card": () => ({
    slot: "3-afternoon",
    slides: [
      cover({ eyebrow: "Building in public", title: "One card<br>per subject.", sub: "We redesigned this card about fifteen times today. Here is where it landed." }),
      feature({ img: img("w-cards.png"), title: "Everything you<br>are studying.", sub: "Side by side, each with how far you have actually got.", top: 515, fadeBot: 440 }),
      feature({ img: img("w-score.png"), shotLeft: 0, title: "The score sits<br>on the title line.", sub: "No badge, no container. It reads as part of the name.", top: -160, fadeBot: 430 }),
      feature({ img: img("w-resume.png"), shotLeft: 0, title: "The button is<br>the progress bar.", sub: "Its fill is how far in you are, and it names the exact step you stopped on.", top: -120, fadeBot: 430 }),
      cover({ eyebrow: "What it took", title: "Seven designs,<br>all binned.", sub: "We built them, looked at them, threw them out, and drew the whole thing again by hand.", subTop: 990 }),
      searchCTA(),
    ],
  }),

  /* 4 — the reading page itself. */
  "w-read": () => ({
    slot: "4-evening",
    slides: [
      cover({ eyebrow: "Building in public", title: "The part you<br>actually read.", sub: "All the measuring is in service of one thing: the page in front of you." }),
      feature({ img: img("w-read.png"), title: "Plain English,<br>short sections.", sub: "The big idea first, then the details. Nothing padded to fill a page.", top: 500, fadeBot: 430 }),
      feature({ img: img("w-nav.png"), title: "Everything,<br>one tap away.", sub: "The whole subject in a list, with a ring on each step showing what you have cleared.", top: 300, fadeTop: 1020, fadeBot: 430 }),
      cover({ eyebrow: "In the works", title: "More of it,<br>every week.", sub: "We&rsquo;re building Booklesss in the open. Follow along.", subTop: 1010 }),
      searchCTA(),
    ],
  }),

  /* 5 — the closer. Deliberately the least feature-y of the five: a day this
   * uniform cannot carry five product announcements, so the last slot is about
   * how the thing is built rather than what was added. */
  "w-live": () => ({
    slot: "5-night",
    slides: [
      cover({ eyebrow: "Building in public", title: "You are not<br>reading alone.", sub: "Every card shows how many other people are in that subject right now." }),
      feature({ img: img("w-live.png"), shotLeft: 0, title: "A live count,<br>on every subject.", sub: "Not a follower number. Just who is actually in there with you tonight.", top: 30, fadeBot: 430 }),
      cover({ eyebrow: "In the works", title: "Built in public,<br>every day.", sub: "Five posts a day, all of it shot from the real thing. Nothing here is a mockup.", subTop: 1000 }),
      searchCTA(),
    ],
  }),

  /* ------------------------------------------------------------------ *
   * 2026-07-31 — five slots.
   *
   * The day the tick became a question. The multiple-choice quiz at the end of
   * each section was deleted outright (CheckQuiz.tsx, 217 lines, gone) and
   * replaced by a three-way self-rating; that one row was then redrawn seven
   * times between 17:36 and 19:40. Overnight the dashboard tiles were rebuilt
   * around effort, each with its own fortnight chart, and at 05:04 this morning
   * the performance score was re-derived so that finishing a course can no
   * longer cost you points.
   *
   * So: two real features and one design log, cut into five angles. Each slot
   * has one sentence it has to prove and its own shots — no crop appears twice.
   *
   * Not one of them names a course or a school.
   * ------------------------------------------------------------------ */

  /* 1 — the question that replaced the tick. The day's headline: the biggest
   * student-visible change, and the one every other slot hangs off. */
  "f-answer": () => ({
    slot: "1-morning",
    slides: [
      cover({ eyebrow: "Building in public", title: "The tick became<br>a question.", sub: "We took the quiz off the end of every section today. One question replaced it." }),
      /* Two rows, both fully clear — the headline claims a pattern, so one
       * crisp row and one ghost would not prove it. They sit 191 source px
       * apart (532 in frame), which is what sets `top` and forces fadeBot down
       * from the default: the second row has to land above 1520. */
      feature({ img: img("f-check.png"), title: "Every section<br>ends the same way.", sub: "Did that land? Three answers, one tap, and you carry on.", top: 39, fadeBot: 400 }),
      /* Framed so the paragraph above the row sits entirely in the solid part of
       * the top fade. At the earlier `top` it landed mid-gradient and read as a
       * half-erased sentence rather than as a dissolve. */
      feature({ img: img("f-answered.png"), title: "Got it. Almost.<br>Not yet.", sub: "Press the one that is true. Press it again to take it back.", top: 67, fadeBot: 430 }),
      cover({ eyebrow: "What we learnt", title: "A tick only proved<br>you scrolled.", sub: "Marking a section done never said whether any of it landed. The same one tap now returns something worth keeping.", subTop: 980 }),
      searchCTA(),
    ],
  }),

  /* 2 — what the answer is for. Not a second announcement of the same button:
   * this slot is about the consequence, and its shots are the step's closing
   * panel and the nav tree, neither of which appears in the morning post. */
  "f-report": () => ({
    slot: "2-midday",
    slides: [
      cover({ eyebrow: "Building in public", title: "The answer had<br>to be worth it.", sub: "So the end of a step now reports what you said, not just that you got there." }),
      feature({ img: img("f-closer.png"), title: "It counts what<br>didn&rsquo;t land.", sub: "Every section answered — and the ones you&rsquo;d want another pass at.", top: 123 }),
      feature({ img: img("f-nav.png"), title: "The tick is<br>still there.", sub: "Cleared steps stay marked. Answering one is what marks it.", top: 72, fadeTop: 1020, fadeBot: 430 }),
      cover({ eyebrow: "In the works", title: "Then it feeds<br>the numbers.", sub: "What you said about each section is what the dashboard reads. That part shipped today too.", subTop: 1000 }),
      searchCTA(),
    ],
  }),

  /* 3 — the score, rebuilt at five in the morning. The honest version of the
   * story is that the old one was broken in a specific way (it read velocity,
   * so clearing the last section of a course starved it), and the fix is a
   * weighting anyone can check. */
  "f-score": () => ({
    slot: "3-afternoon",
    slides: [
      cover({ eyebrow: "Building in public", title: "We rebuilt the<br>score. Again.", sub: "The old one quietly punished you for finishing. Two thirds of the new one is effort." }),
      /* Low enough that the tile's own label clears the gradient. A stat whose
       * heading is half-dissolved is a number without a name. */
      feature({ img: img("f-perf.png"), shotLeft: 0, title: "Sixty-five parts<br>effort.", sub: "Thirty-five progress. Turn up, put the time in, the number moves.", top: 354, fadeBot: 430 }),
      /* The two card titles sit 222 source px apart — 619 in frame — which is
       * wider than the clear window, so one of them was always going to
       * dissolve. The first is the one that has to be crisp; the second showing
       * through underneath is what says there is more than one. */
      feature({ img: img("f-cards.png"), title: "Same sum, per<br>subject.", sub: "Each scored on its own days, its own minutes, its own sections.", top: 264, fadeBot: 380 }),
      cover({ eyebrow: "How it counts", title: "Five days a week,<br>two hours.", sub: "That is full marks on effort. Not every day and not all night — a bar a real week clears.", subTop: 1000 }),
      searchCTA(),
    ],
  }),

  /* 4 — the tiles. Where slot 3 explains one number, this one is about the row
   * it sits in and what each of the other three is for. */
  "f-tiles": () => ({
    slot: "4-evening",
    slides: [
      cover({ eyebrow: "Building in public", title: "Four numbers,<br>four charts.", sub: "Every tile on the dashboard got its own fortnight of history today." }),
      /* The four-tile block is 265 source px tall — 738 in frame — and the
       * default clear window is only 690, so the tile labels were dissolving.
       * Widening it at both ends (fadeTop 900, fadeBot 380) buys 820px, and the
       * sub moves up to 600 to stay inside the smaller solid zone the narrower
       * top fade leaves (0.8 x 900 = 720). */
      feature({ img: img("f-tiles.png"), title: "Three of four<br>measure effort.", sub: "Only one counts how much is finished, at a quarter of the weight.", top: 465, fadeTop: 900, fadeBot: 380, subTop: 600 }),
      feature({ img: img("f-streak.png"), shotLeft: 0, title: "The purest one<br>is the streak.", sub: "It moves when you turn up. It never asks whether you understood it.", top: 274, fadeBot: 430 }),
      cover({ eyebrow: "In the works", title: "A tile earns<br>its place.", sub: "Or it comes off. Most of what was on this dashboard a week ago has already gone.", subTop: 1000 }),
      searchCTA(),
    ],
  }),

  /* 5 — the design log, and deliberately the softest of the five. One shot,
   * because the six versions it describes were deleted as they were replaced
   * and photographing them is not possible; the rest is written. That is the
   * honest way to run this slot — a recycled crop from the morning post would
   * read as padding and say nothing new. */
  "f-versions": () => ({
    slot: "5-night",
    slides: [
      cover({ eyebrow: "Building in public", title: "One button,<br>seven versions.", sub: "All of them tonight. This is the one that survived." }),
      feature({ img: img("f-almost.png"), title: "Worst to best,<br>left to right.", sub: "So the thumbs-up lands where your eye finishes the row.", top: -79, fadeBot: 430 }),
      cover({ eyebrow: "What it took", title: "Five answers,<br>then three.", sub: "A five-step scale. Then labels. Then pills. Then icons that meant something. Then back to three — because a middle option only helps if it means one thing.", subTop: 940 }),
      searchCTA(),
    ],
  }),

  /* ------------------------------------------------------------------ *
   * 2026-08-01 — five slots, and not a word on any of them.
   *
   * Owner's call: today the posts are the app. No headline, no sub, no
   * wordmark — an area of the interface enlarged to fill the frame, and the
   * search CTA at the end of each carousel. Everything a copy slide would have
   * said now lives in the caption in PLAN.md, where it can be read by someone
   * who is already looking at the screenshot.
   *
   * The consequence is that the crop carries the whole post, so these configs
   * are deliberately thin: no `top`, no fades, nothing to tune here. A slide
   * that reads badly is a capture problem and gets fixed in cap-0801.mjs.
   *
   * Five slots, five parts of the app, no shot used twice.
   * ------------------------------------------------------------------ */

  /* 1 — the page you actually read on. */
  "a-read": () => ({
    slot: "1-morning",
    slides: [
      plain({ img: img("a-read-top.png") }),
      plain({ img: img("a-list.png") }),
      plain({ img: img("a-read-mid.png") }),
      plain({ img: img("a-summary.png") }),
      searchCTA(),
    ],
  }),

  /* 2 — what a section asks you at the end of it, and what finishing looks
   * like. Three states of the same feature, each on a different part of the
   * step: unanswered, answered, and the panel that closes the step. */
  "a-answer": () => ({
    slot: "2-midday",
    slides: [
      plain({ img: img("a-check.png") }),
      plain({ img: img("a-answered.png") }),
      plain({ img: img("a-closer.png") }),
      searchCTA(),
    ],
  }),

  /* 3 — the home page: where you stand, in four numbers and two cards. */
  "a-home": () => ({
    slot: "3-afternoon",
    slides: [
      plain({ img: img("a-home-top.png") }),
      plain({ img: img("a-tiles.png") }),
      plain({ img: img("a-tiles-in.png") }),
      plain({ img: img("a-cards.png") }),
      searchCTA(),
    ],
  }),

  /* 4 — the course around the step: its own page, its steps in reading order,
   * and the drawer that gets you anywhere in it. */
  "a-course": () => ({
    slot: "4-evening",
    slides: [
      plain({ img: img("a-course-top.png") }),
      plain({ img: img("a-course-list.png") }),
      plain({ img: img("a-nav.png") }),
      searchCTA(),
    ],
  }),

  /* 5 — the first thing the app asks anybody. Shot on a device that has never
   * answered it, so the form is real rather than re-opened from settings. The
   * university step is not photographed: every option on it is a real school. */
  "a-who": () => ({
    slot: "5-night",
    slides: [
      plain({ img: img("a-who.png") }),
      plain({ img: img("a-who-named.png") }),
      plain({ img: img("a-courses.png") }),
      searchCTA(),
    ],
  }),
};

const cfg = CONFIGS[POST]?.();
if (!cfg) throw new Error(`unknown POST "${POST}" (${Object.keys(CONFIGS).join(" | ")})`);
const OUT = path.join(POSTS, dayFolder(DAY).rel, cfg.slot);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ---- render ---- */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
for (let i = 0; i < cfg.slides.length; i++) {
  const s = cfg.slides[i];
  const base =
    s.bg === "plain"
      ? `<img class="plain-shot" src="${s.img}">`
      : s.bg === "shot"
        ? `<img class="shot" src="${s.img}" style="top:${s.top}px;left:${s.shotLeft}px">
         <div class="fade-top" style="height:${s.fadeTop}px"></div>
         <div class="fade-bot" style="height:${s.fadeBot}px"></div>`
        : `<div class="gradient"></div>`;
  /* A plain slide is the app and nothing else — no wordmark stamped on it, and
   * no grain, which on a screenshot reads as a dirty screen rather than as
   * texture. The CTA that closes the carousel keeps both. */
  const dressing = s.bg === "plain" ? "" : `${wordmark}<div class="grain"></div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${base}${s.html}${dressing}</body></html>`;
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);

  /* The safe area is checked, not trusted. Every `.safe` block is measured
   * after layout — after the real font has loaded and the text has wrapped —
   * and anything crossing the boundary fails the render instead of being
   * written out. A margin in a stylesheet only describes where a box starts;
   * this is what catches the third line that wrapped into the caption, or the
   * long word that pushed a heading under the share button. */
  const over = await page.evaluate((safe) => {
    const bad = [];
    document.querySelectorAll(".safe").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const txt = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 46);
      const push = (edge, by) => bad.push(`${edge} by ${Math.ceil(by)}px — "${txt}"`);
      if (r.top < safe.top) push("above the top", safe.top - r.top);
      if (r.bottom > safe.bottom) push("below the bottom", r.bottom - safe.bottom);
      if (r.left < safe.left) push("past the left", safe.left - r.left);
      if (r.right > 1080 - safe.right) push("under the right rail", r.right - (1080 - safe.right));
      /* The box is constrained by `left`/`right`, so ordinary text wraps inside
       * it and the rect alone would report everything as fine. Content wider
       * than its own box is text with no wrap point — one long word, a URL —
       * spilling out over the rail while the box stays put. */
      if (el.scrollWidth > el.clientWidth + 1) push("overflowing its box", el.scrollWidth - el.clientWidth);
    });
    return bad;
  }, SAFE);

  if (over.length) {
    throw new Error(
      `slide ${i + 1} of "${POST}" breaks the safe area:\n  ` +
        over.join("\n  ") +
        `\nShorten the line, drop the font size, or move it up — do not widen the safe area.`,
    );
  }

  /* The safe area only knows the frame's edges. On a shot slide there is a
   * second boundary: the point where the top fade stops being solid and the
   * screenshot starts showing through. Text crossing it lands on top of the
   * app's own words — which is how a sub-heading ended up sitting across a
   * card's title, both perfectly inside the safe area and unreadable. */
  if (s.bg === "shot") {
    const solidTo = Math.round(s.fadeTop * 0.8);
    const clash = await page.evaluate((limit) => {
      const bad = [];
      document.querySelectorAll(".safe").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.height && r.bottom > limit)
          bad.push(
            `${Math.ceil(r.bottom - limit)}px into the shot — "${(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 46)}"`,
          );
      });
      return bad;
    }, solidTo);
    if (clash.length) {
      throw new Error(
        `slide ${i + 1} of "${POST}" runs text over the screenshot (solid until ${solidTo}px):\n  ` +
          clash.join("\n  ") +
          `\nShorten the sub, or raise fadeTop so the shot stays covered behind it.`,
      );
    }
  }

  await page.screenshot({ path: path.join(OUT, `${String(i + 1).padStart(2, "0")}.png`) });
}
await browser.close();
console.log("done ->", OUT, `(${cfg.slides.length} slides)`);
