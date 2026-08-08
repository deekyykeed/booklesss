/* Logo variants — a set of 9:16 posters that are nothing but the logo.
 *
 *   node _scripts/logo-variants.mjs            # -> today's folder, 6-logo/
 *   DAY=2026-08-04 node _scripts/logo-variants.mjs
 *
 * NO COPY ON ANY SLIDE (owner, 2026-08-03: "i dont add text like this anymore
 * — dont add any text"). Not a headline, not an eyebrow, not the corner stamp,
 * not a CTA. The whole post is the mark. The call to action lives in the
 * caption, which is the one place text still belongs.
 *
 * This is deliberately NOT a `prog-post.mjs` config. That file renders posts
 * about the product, and every slide type it owns carries either copy or the
 * corner wordmark. These are brand plates: one object, one ground, no chrome.
 *
 * The word is set two ways on purpose. "Bklsss" is the logo, and "Booklesss" is
 * the name — a reader who has only ever seen the abbreviation needs the long
 * form somewhere or the two never connect. Both are Familjen Grotesk Bold, the
 * same face `Brand/build_brand.py` draws the shipped files from.
 *
 * THE SAFE BOX STILL APPLIES to anything meant to be read: x 96–848, y
 * 300–1400, because the feed draws its own furniture over the rest. Each plate
 * declares `safe: true` and is measured, exactly as `prog-post.mjs` measures
 * its text. The macro plates opt out with `safe: false` — a letterform enlarged
 * past the frame is texture rather than a word, so there is nothing to keep
 * clear of a share button, and cropping it to the safe box would just make it
 * a small letter in a big empty frame.
 */
import { chromium, POSTS, PLATFORM, FAMILJEN_DATA, dayFolder } from "./paths.mjs";
import fs from "fs";
import path from "path";

const DAY = process.env.DAY || new Date().toLocaleDateString("en-CA");
const SLOT = process.env.SLOT || "6-logo";
/* A slot takes FOUR plates, not sixteen. Naming them here writes exactly those
 * four, numbered 01–04 in the order given, so a posting slot is built rather
 * than filled and then weeded by hand.
 *
 *   PICK=20-disc-light,21-disc-cut,22-disc-macro,23-disc-knockout \
 *     SLOT=4-evening node _scripts/logo-variants.mjs
 *
 * With no PICK the script does what it always did — every plate, under its own
 * name — which is how the reserve was built on 3 Aug. */
const PICK = (process.env.PICK || "").split(",").map((s) => s.trim()).filter(Boolean);
const FAMILJEN = FAMILJEN_DATA();

/* Burbank Big Condensed — the face the front door's mark is drawn in, vendored
 * in the app since it drew the logo. It is here because 2026-08-06 shipped a
 * NEW brand object in it: the ◯B disc, now with the 1px ring the owner asked
 * for so it can sit on a white surface without reading as a hole. A plate of
 * it has to be the real letterform, not Familjen standing in. */
const BURBANK =
  "data:font/woff2;base64," +
  fs.readFileSync(path.join(PLATFORM, "src/fonts/burbank.woff2")).toString("base64");

const INK = "#0D0D0F";       // the poster black
const TILE = "#0b0b0b";      // the app's solid black, what the icon tile wears
const PAPER = "#FFFFFF";
const PURPLE = "#6C4CF0";    // the eyebrow purple, the only brand hue
const CREAM = "#FFFDE8";     // the paper every course cover is printed on

const SAFE = { top: 300, bottom: 1400, left: 96, right: 232 };

/* The brand gradient, lifted off prog-post.mjs so a plate and a carousel slide
 * sit on the same ground. */
const GRADIENT =
  `radial-gradient(1200px 900px at 88% 6%, rgba(139,124,255,.28), transparent 62%),` +
  `radial-gradient(1000px 820px at -8% 84%, rgba(96,166,255,.24), transparent 64%),` +
  `radial-gradient(900px 700px at 62% 104%, rgba(255,176,124,.20), transparent 62%),` +
  `linear-gradient(#FCFCFD,#F2F3F6)`;

const CSS = `
@font-face{font-family:FG;src:url(${FAMILJEN}) format('woff2');font-weight:400 700;font-display:block}
@font-face{font-family:BB;src:url(${BURBANK}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:FG,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
/* Centred on the SAFE box, not the frame: the right rail eats 232px and the
   left margin 96, so the readable centre is x=472. Centring on 540 pushes
   everything towards the share buttons. */
.safebox{position:absolute;left:${SAFE.left}px;top:${SAFE.top}px;
  width:${1080 - SAFE.left - SAFE.right}px;height:${SAFE.bottom - SAFE.top}px;
  display:flex;align-items:center;justify-content:center}
.w{font-weight:700;letter-spacing:-.031em;line-height:.82;white-space:nowrap}
.tile{display:flex;align-items:center;justify-content:center}
`;

/* Each plate is { name, bg, html, safe }. `bg` is a CSS background shorthand. */
const word = (t, o = {}) =>
  `<span class="w" style="font-size:${o.size}px;color:${o.color};` +
  `letter-spacing:${o.track ?? -0.031}em;${o.extra || ""}">${t}</span>`;

/* ---- the ◯B disc, shipped 2026-08-06 on the front door -------------- *
 *
 * Every ratio is the app's, read off page.tsx rather than eyeballed: on a 50px
 * disc the B is 40, its line box is the disc's own height, the underline is
 * 5px thick and offset 10 — so 0.8, 1.0, 0.1 and 0.2 of whatever size a plate
 * asks for. The clipping is the design and not an accident: the underline runs
 * past the bottom of the circle, and what survives is a solid bar with its ends
 * cut by the curve.
 *
 * THE RING SCALES WITH EVERYTHING ELSE. The owner asked for "a 1px black
 * border" and 1px is what ships, at 50px. A plate drawing it 12× larger keeps
 * it at 1/50th, because that is what scaling a logo means — a vector mark's
 * stroke grows with the mark. Holding it at a literal 1px would make it
 * invisible here and would be a different object, not a truer one. */
const disc = ({ size, bg = TILE, fg = PAPER, ring = "#000", shadow = "" }) =>
  `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};
    border:${(size / 50).toFixed(2)}px solid ${ring};overflow:hidden;
    display:grid;place-items:center;${shadow}">
    <span style="font-family:BB,system-ui,sans-serif;font-size:${size * 0.8}px;
      line-height:${size}px;color:${fg};text-decoration:underline;text-decoration-style:solid;
      text-decoration-thickness:${size * 0.1}px;text-underline-offset:${size * 0.2}px">B</span>
  </div>`;

/** The name, in the face the front door sets it in. */
const burbank = (t, { size, color, track = -0.03 }) =>
  `<span style="font-family:BB,system-ui,sans-serif;font-size:${size}px;color:${color};
    letter-spacing:${track}em;line-height:1.2;white-space:nowrap">${t}</span>`;

const PLATES = [
  // ---- the logo, plainly, on each of the three grounds it is allowed ----
  { name: "01-mark-light", bg: GRADIENT, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: INK })}</div>` },

  { name: "02-mark-dark", bg: TILE, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: PAPER })}</div>` },

  { name: "03-mark-cream", bg: CREAM, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: INK })}</div>` },

  { name: "04-mark-purple", bg: PURPLE, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: PAPER })}</div>` },

  // ---- the name in full, so the abbreviation has something to attach to ----
  { name: "05-name-light", bg: GRADIENT, safe: true,
    html: `<div class="safebox">${word("Booklesss", { size: 150, color: INK })}</div>` },

  { name: "06-name-dark", bg: TILE, safe: true,
    html: `<div class="safebox">${word("Booklesss", { size: 150, color: PAPER })}</div>` },

  /* The two forms on one plate, stacked and optically matched: the short word
     set larger so both occupy the same measure, which is the whole point —
     they are the same object at two lengths, not two logos. */
  { name: "07-both", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><div style="display:flex;flex-direction:column;gap:44px;align-items:flex-start">
      ${word("Booklesss", { size: 132, color: INK })}
      ${word("Bklsss", { size: 208, color: INK })}
    </div></div>` },

  // ---- the app icon, as it ships ----
  { name: "08-icon", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><div class="tile" style="width:700px;height:700px;background:${TILE};
      box-shadow:0 3px 6px rgba(24,24,45,.07),0 22px 44px rgba(24,24,45,.12)">
      ${word("Bklsss", { size: 168, color: PAPER, track: -0.06 })}</div></div>` },

  { name: "09-icon-round", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><div class="tile" style="width:700px;height:700px;background:${TILE};
      border-radius:158px;box-shadow:0 3px 6px rgba(24,24,45,.07),0 22px 44px rgba(24,24,45,.12)">
      ${word("Bklsss", { size: 150, color: PAPER, track: -0.06 })}</div></div>` },

  /* Outline. The wordmark reduced to its own edge — the shape is familiar
     enough by now to survive losing its fill, and it is the one treatment that
     shows the letterforms rather than the word. */
  { name: "10-outline", bg: GRADIENT, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: "transparent",
      extra: `-webkit-text-stroke:3px ${INK}` })}</div>` },

  /* Macro. Enlarged past the frame on purpose — at this scale it is texture,
     not a word, so the safe box does not apply (see the header note). The
     letters are placed by translate rather than by cropping an image, so the
     curve stays vector-sharp at any output size. */
  { name: "11-macro-b", bg: CREAM, safe: false,
    html: `<div class="frame"><span class="w" style="font-size:2400px;color:${INK};
      transform:translate(-2%,4%)">B</span></div>` },

  { name: "12-macro-sss", bg: TILE, safe: false,
    html: `<div class="frame"><span class="w" style="font-size:1500px;color:${PAPER};
      letter-spacing:-.06em;transform:translate(0,2%)">sss</span></div>` },

  /* Bleed. The word wider than the frame, cropped by it — legible because the
     eye completes a familiar shape, and the first and last letters are the
     ones it can most afford to lose. */
  { name: "13-bleed", bg: GRADIENT, safe: false,
    html: `<div class="frame">${word("Bklsss", { size: 460, color: INK })}</div>` },

  /* Vertical. One letter per line, tight — the only arrangement here that is
     not the logo's own lockup, and it reads as a spine or a banner rather than
     as a signature. */
  { name: "14-vertical", bg: TILE, safe: true,
    html: `<div class="safebox"><div style="display:flex;flex-direction:column;align-items:center;line-height:.86">
      ${["B", "k", "l", "s", "s", "s"].map((c) =>
        `<span class="w" style="font-size:168px;color:${PAPER}">${c}</span>`).join("")}
    </div></div>` },

  /* Repeat. The mark as a field rather than a signature — low contrast so it
     reads as paper the brand is printed on. */
  { name: "15-field", bg: GRADIENT, safe: false,
    html: `<div class="frame"><div style="display:flex;flex-direction:column;gap:36px;transform:rotate(-8deg) scale(1.5)">
      ${Array.from({ length: 11 }, (_, i) =>
        `<span class="w" style="font-size:108px;color:${INK};opacity:${i % 2 ? 0.1 : 0.16};
          margin-left:${(i % 3) * 90 - 90}px">Bklsss Bklsss Bklsss</span>`).join("")}
    </div></div>` },

  /* Knockout. The word cut out of a solid field so the gradient shows through
     it — the mark as an aperture. `background-clip:text` on the ground itself,
     which is why the ground is a layer here rather than the body's background. */
  { name: "16-knockout", bg: TILE, safe: true,
    html: `<div class="safebox"><span class="w" style="font-size:232px;
      background:${GRADIENT};-webkit-background-clip:text;background-clip:text;color:transparent">Bklsss</span></div>` },

  /* ================================================================== *
   * THE ◯B DISC — new on 2026-08-06, and the reason there are plates at
   * all today. The sixteen above are spent (eight on 4 Aug, eight on 5
   * Aug); these are not the reserve being stretched, they are a mark that
   * shipped this morning.
   *
   * FOUR DIFFERENT IDEAS, not one idea on four grounds — the rule the 5
   * Aug midday slot broke and the evening slot got right. Say what each
   * is for: the mark as it ships, the mark taken apart, the letterform
   * past the frame, the mark as a surface.
   * ================================================================== */

  /* 1 — as it ships. On the light ground, which is the one place the new
     ring does anything: black on black is invisible on the front door and
     an edge is the whole point everywhere else. */
  { name: "20-disc-light", bg: GRADIENT, safe: true,
    html: `<div class="safebox">${disc({
      size: 620,
      shadow: "box-shadow:0 3px 6px rgba(24,24,45,.07),0 22px 44px rgba(24,24,45,.12)",
    })}</div>` },

  /* 2 — the cut. The same letter twice: on the left as it is drawn, with
     its underline running on past the foot; on the right after the circle
     has taken the ends off it. The mark's one real idea, shown rather than
     described. */
  { name: "21-disc-cut", bg: CREAM, safe: true,
    html: `<div class="safebox"><div style="display:flex;align-items:center;gap:60px">
      <div style="width:330px;height:330px;display:grid;place-items:center">
        <span style="font-family:BB,system-ui,sans-serif;font-size:264px;line-height:330px;
          color:${INK};text-decoration:underline;text-decoration-thickness:33px;
          text-underline-offset:66px">B</span>
      </div>
      ${disc({ size: 330, bg: INK, fg: CREAM, ring: INK })}
    </div></div>` },

  /* 3 — the letterform past the frame. Burbank's B and the bar under it,
     enlarged until it is texture rather than a letter, so the safe box
     does not apply. Not 11-macro-b in another face: that one has no bar,
     and the bar is what makes this mark this mark. */
  { name: "22-disc-macro", bg: TILE, safe: false,
    html: `<div class="frame"><span style="font-family:BB,system-ui,sans-serif;font-size:2000px;
      line-height:0.86;color:${PAPER};text-decoration:underline;text-decoration-thickness:200px;
      text-underline-offset:400px;transform:translate(-1%,-6%)">B</span></div>` },

  /* 4 — the mark as a surface. Rows of discs at low contrast, so it reads
     as paper the brand is printed on rather than as a signature. */
  { name: "23-disc-field", bg: GRADIENT, safe: false,
    html: `<div class="frame"><div style="display:flex;flex-direction:column;gap:52px;
      transform:rotate(-8deg) scale(1.35)">
      ${Array.from({ length: 9 }, (_, r) =>
        `<div style="display:flex;gap:52px;margin-left:${(r % 2) * 92 - 46}px;opacity:${r % 2 ? 0.14 : 0.2}">
          ${Array.from({ length: 8 }, () => disc({ size: 138, bg: INK, fg: "#F2F3F6", ring: INK })).join("")}
        </div>`).join("")}
    </div></div>` },

  /* ================================================================== *
   * THE NAME, IN THE FRONT DOOR'S OWN FACE. "Booklesss" is set in Burbank
   * on "/" and in Familjen everywhere else, which makes this a different
   * object from plates 05–07 rather than the same one re-photographed.
   * ================================================================== */

  /* 1 — the lockup, exactly as the front door stacks it. */
  { name: "24-lockup", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><div style="display:flex;flex-direction:column;align-items:center;gap:34px">
      ${disc({ size: 400, shadow: "box-shadow:0 4px 8px rgba(24,24,45,.07),0 22px 42px rgba(24,24,45,.12)" })}
      ${burbank("Booklesss", { size: 176, color: INK })}
    </div></div>` },

  /* 2 — the word wider than the frame. Burbank is a condensed face, so it
     crops differently from 13-bleed: the verticals keep their rhythm and
     the eye completes the word off the ends. */
  { name: "25-name-bleed", bg: TILE, safe: false,
    html: `<div class="frame">${burbank("Booklesss", { size: 440, color: PAPER })}</div>` },

  /* 3 — the word as an aperture, the ground showing through it. */
  { name: "26-name-knock", bg: TILE, safe: true,
    html: `<div class="safebox"><span style="font-family:BB,system-ui,sans-serif;font-size:196px;
      letter-spacing:-.03em;line-height:1.2;white-space:nowrap;background:${GRADIENT};
      -webkit-background-clip:text;background-clip:text;color:transparent">Booklesss</span></div>` },

  /* 4 — laid on its side. The same two parts as 24, in a row instead of a
     stack — the arrangement a header needs and the front door does not. */
  { name: "27-lockup-row", bg: CREAM, safe: true,
    html: `<div class="safebox"><div style="display:flex;align-items:center;gap:44px">
      ${disc({ size: 200, bg: INK, fg: CREAM, ring: INK })}
      ${burbank("Booklesss", { size: 136, color: INK })}
    </div></div>` },

  /* ================================================================== *
   * THE DISC AS THE APP ICON — built 2026-08-07, the day `c5982ed` made
   * it the real favicon, apple-icon and PWA manifest icon rather than a
   * thing that only lived on the front door.
   *
   * FOUR IDEAS, NOT FOUR GROUNDS — the 5 Aug lesson. Say what each one is
   * FOR before it earns a slot: it survives every size it is asked for /
   * it works cut out of the ground as well as printed on it / here is how
   * it is built / it is big enough to be a surface. Two of those needing
   * the same sentence would mean one of them is padding.
   * ================================================================== */

  /* 1 — every size it actually ships at, in one picture. 512 is the PWA
     icon, 180 the apple-icon, then the two favicons, and 16 is the one in
     a browser tab. Bottom-aligned so the ladder is the subject rather
     than a row of circles. The claim the day earned: a mark that is a
     letter and a bar, not a drawing, is still legible at 16px. */
  { name: "28-icon-sizes", bg: GRADIENT, safe: true,
    /* THE RATIOS ARE THE SHIPPED ONES; the absolute sizes are not, and
       cannot be. 512+180+64+32+16 plus four gaps is 988px against a safe
       box 752 wide, so the ladder is scaled by a single constant and the
       32 : 11.25 : 4 : 2 : 1 relationship — which is the whole claim —
       survives intact. Widening the safe area would be the bug. */
    html: `<div class="safebox"><div style="display:flex;align-items:flex-end;gap:40px">
      ${[512, 180, 64, 32, 16].map((s) =>
        disc({ size: s * 0.72, shadow: s >= 180
          ? "box-shadow:0 3px 6px rgba(24,24,45,.07),0 20px 40px rgba(24,24,45,.12)" : "" })).join("")}
    </div></div>` },

  /* 2 — cut out of the ground rather than printed on it. The ink fills the
     frame and the disc is the hole, so the gradient underneath is what
     draws the mark. 26-name-knock does this to the WORD; the disc has
     never been asked to hold up as an aperture, and an app icon is
     punched out of a home screen for a living. */
  /* `safe: false` because the INK fills the frame by design — the checker
     measures `.safebox`'s child and there isn't one. The mark itself is
     hand-placed at x 142–802, y 520–1180, which is inside the safe box on
     every edge; the thing crossing it is the ground, which is the plate.
     `overflow:hidden` on the inner circle is NOT optional: the underline
     runs past the foot of the circle by design and the shipped mark clips
     it, so a plate that lets the bar escape is drawing a different logo.
     It escaped on the first render, because this aperture is built from a
     bordered div rather than from disc(), which has the clip baked in. */
  { name: "29-icon-aperture", bg: GRADIENT, safe: false,
    html: `<div class="frame"><div style="position:absolute;inset:0;background:${TILE};
      -webkit-mask:radial-gradient(circle 330px at 472px 850px,transparent 99%,#000 100%);
      mask:radial-gradient(circle 330px at 472px 850px,transparent 99%,#000 100%)"></div>
      <div style="position:absolute;left:142px;top:520px;width:660px;height:660px;
        border-radius:50%;border:13px solid ${TILE};overflow:hidden;
        display:grid;place-items:center">
        <span style="font-family:BB,system-ui,sans-serif;font-size:528px;line-height:660px;
          color:${TILE};text-decoration:underline;text-decoration-thickness:66px;
          text-underline-offset:132px">B</span>
      </div></div>` },

  /* 3 — how it is made, left to right: the ring on its own, the letter
     dropped in with its underline still running past the foot, then the
     circle closed so the curve takes the ends off the bar. 21-disc-cut
     shows the BEFORE and AFTER of that crop as two objects; this shows
     the three moves as one sentence, which is a different thing to say. */
  { name: "30-icon-build", bg: CREAM, safe: true,
    html: `<div class="safebox"><div style="display:flex;align-items:center;gap:40px">
      <div style="width:220px;height:220px;border-radius:50%;border:4.4px solid ${INK}"></div>
      <div style="width:220px;height:220px;border-radius:50%;border:4.4px solid ${INK};
        display:grid;place-items:center">
        <span style="font-family:BB,system-ui,sans-serif;font-size:176px;line-height:220px;
          color:${INK};text-decoration:underline;text-decoration-thickness:22px;
          text-underline-offset:44px">B</span>
      </div>
      ${disc({ size: 220, bg: INK, fg: CREAM, ring: INK })}
    </div></div>` },

  /* 4 — big enough to be a surface. Anchored in the top-left and bled off
     two edges, so what is left in frame is the curve and the bar rather
     than a logo sitting in the middle of a poster. Not 22-disc-macro,
     which is the bare letterform as texture with no circle in it at all —
     the circle and its crop are the whole subject here. */
  { name: "31-icon-corner", bg: GRADIENT, safe: false,
    html: `<div class="frame"><div style="position:absolute;left:-420px;top:-300px">
      ${disc({ size: 1680, bg: INK, fg: "#F2F3F6", ring: INK })}
    </div></div>` },

  /* ================================================================== *
   * "Bklsss" — THE APP'S OWN WORDMARK, which is a different object from
   * plates 05–07 and 24–27. Those are "Booklesss", the full name, set in
   * Familjen and then in Burbank. This is the five-letter stamp the app
   * header wears and the one every poster in this account is signed with,
   * bottom-left of slide one. It has never had a plate.
   * ================================================================== */

  /* THE FOUR BELOW ARE WHAT WAS LEFT AFTER CHECKING THE SIXTEEN ABOVE.
     Three obvious wordmark ideas were built on 2026-08-07 and thrown away
     before they went out, because the reserve had already had them:
     "Bklsss" repeated as a field is 15-field, the word cut out of a solid
     ground is 16-knockout, and the word plain on the gradient is
     01-mark-light. Sixteen plates is enough to have used up a five-letter
     wordmark's easy angles — check the list before writing a new one. */

  /* 1 — tracked out until it stops being a word and becomes a rule. The
     letters span the whole safe box with air between them, which is the
     one setting where the three s's read as a rhythm rather than as a
     spelling. Nothing else in the set uses letter-spacing as the subject. */
  { name: "36-bk-rule", bg: GRADIENT, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 118, color: INK, track: 0.30 })}</div>` },

  /* 2 — cut by the frame from below, so only the tops of the letters
     survive. 13-bleed runs the word off the SIDES and keeps every letter
     whole; cutting it horizontally asks the opposite question — whether
     the mark is still itself when half of it is gone. It is, because the
     ascenders and the double-s carry the whole silhouette. */
  { name: "37-bk-half", bg: TILE, safe: false,
    html: `<div class="frame"><div style="position:absolute;left:-40px;top:700px;
      height:300px;overflow:hidden;display:flex;align-items:flex-start">
      ${word("Bklsss", { size: 420, color: PAPER })}
    </div></div>` },

  /* 3 — on its side, as one line rather than as a stack. 14-vertical sets
     a letter per row, which reads as a banner and loses the word; rotating
     the lockup itself keeps the letterforms in their real relationship and
     turns the mark into a spine — the arrangement a page edge takes. */
  { name: "39-bk-spine", bg: CREAM, safe: false,
    html: `<div class="frame"><div style="transform:rotate(-90deg)">
      ${word("Bklsss", { size: 300, color: INK })}
    </div></div>` },

  /* 4 — the two marks together, which they have never been. The disc
     shipped on 6 Aug and 24/27 pair it with "Booklesss" set in Burbank —
     the NAME. This is the disc beside the LOGO, matched on cap height, so
     the poster stamp and the app icon are shown to be one system rather
     than two things the brand happens to own. */
  { name: "40-bk-lockup", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><div style="display:flex;align-items:center;gap:44px">
      ${disc({ size: 205, shadow: "box-shadow:0 3px 6px rgba(24,24,45,.07),0 20px 40px rgba(24,24,45,.12)" })}
      ${word("Bklsss", { size: 182, color: INK })}
    </div></div>` },

  /* ================================================================== *
   * 2026-08-08 — three more, each asking a question the forty above
   * have not. Checked against the list before writing (the 8-07 lesson:
   * four "new" plates were thrown away for being the reserve under new
   * names).
   * ================================================================== */

  /* 1 — the derivation. 07-both stacks the two forms as two words; nobody
     has shown WHERE the short one comes from. One word, with the letters
     the contraction drops still standing in it as ghosts — the name and
     the logo turn out to be the same object, and the eye does the cut. */
  { name: "41-derivation", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><span class="w" style="font-size:150px">
      ${["B", "o", "o", "k", "l", "e", "s", "s", "s"].map((c) =>
        `<span style="color:${INK};opacity:${"ooe".includes(c) ? 0.13 : 1}">${c}</span>`).join("")}
    </span></div>` },

  /* 2 — the construction. 30-icon-build takes the DISC apart; the word has
     never shown its skeleton. Cap line, x line and baseline drawn through
     the mark in the brand purple, the way a type specimen is ruled. The
     offsets are Familjen's metrics at line-height .82, checked against the
     render rather than trusted. */
  { name: "42-anatomy", bg: CREAM, safe: true,
    html: `<div class="safebox"><div style="position:relative;display:inline-block">
      ${word("Bklsss", { size: 200, color: INK })}
      ${[
        /* Measured, not estimated: canvas actualBoundingBoxAscent for "B" and
           "s" against an inline baseline probe, at this exact size and
           line-height. The eyeballed first cut was 8px out on every rule. */
        ["cap", 32], // top of B
        ["x", 59],   // top of the s's
        ["base", 162], // the baseline
      ].map(([, y]) =>
        `<div style="position:absolute;left:-64px;right:-64px;top:${y}px;height:2px;background:${PURPLE};opacity:.55"></div>`).join("")}
    </div></div>` },

  /* 3 — the two scales. The wordmark lives at 31px in a poster corner and
     nowhere else; 38-bk-stamp showed that size alone and died as an empty
     frame. This is the same claim with the frame given a second layer: the
     word at its true corner size, in its true corner, over itself as a
     ghost the size of the poster. The signature and the field, one frame. */
  { name: "43-echo", bg: TILE, safe: false,
    html: `<div class="frame">${word("Bklsss", { size: 430, color: PAPER, extra: "opacity:.09" })}</div>
      <div style="position:absolute;left:96px;top:320px">${word("Bklsss", { size: 31, color: PAPER })}</div>` },
];

const CHOSEN = PICK.length
  ? PICK.map((n) => {
      const p = PLATES.find((x) => x.name === n);
      if (!p) throw new Error(`no plate called "${n}" (${PLATES.map((x) => x.name).join(", ")})`);
      return p;
    })
  : PLATES;

const OUT = path.join(POSTS, dayFolder(DAY).rel, SLOT);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });

for (const [i, p] of CHOSEN.entries()) {
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>` +
      `<body style="background:${p.bg}">${p.html}</body></html>`,
    { waitUntil: "load" },
  );
  await page.evaluate(() => document.fonts.ready);

  /* Same check prog-post.mjs runs on its copy, for the same reason: a mark
     under the share rail is a mark nobody sees. Only the plates that claim to
     be readable are measured — see the header note on the macro ones. */
  if (p.safe) {
    const spill = await page.evaluate((safe) => {
      const el = document.querySelector(".safebox > *");
      const r = el.getBoundingClientRect();
      const bad = [];
      if (r.top < safe.top) bad.push(`${Math.ceil(safe.top - r.top)}px above the top`);
      if (r.bottom > safe.bottom) bad.push(`${Math.ceil(r.bottom - safe.bottom)}px below the bottom`);
      if (r.left < safe.left) bad.push(`${Math.ceil(safe.left - r.left)}px past the left`);
      if (r.right > 1080 - safe.right) bad.push(`${Math.ceil(r.right - (1080 - safe.right))}px under the right rail`);
      return bad;
    }, SAFE);
    if (spill.length) {
      throw new Error(
        `plate "${p.name}" leaves the safe area — ${spill.join(", ")}\n` +
          `Drop its font-size. Do not widen the safe area.`,
      );
    }
  }

  /* A picked set is a POSTING ORDER, so it is numbered rather than named —
     the folder is swiped in file order and 01–04 is what carries that. Without
     PICK nothing changes: every plate keeps its own name, which is what the
     reserve folder is for. */
  const file = PICK.length ? `0${i + 1}-${p.name.replace(/^\d+-/, "")}.png` : `${p.name}.png`;
  await page.screenshot({ path: path.join(OUT, file) });
  console.log("  " + file);
}

await browser.close();
console.log(`done -> ${OUT} (${CHOSEN.length} plates)`);
