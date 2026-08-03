import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OG_DIMENSIONS, SITE_HOST, SITE_NAME } from "./site";

/* ------------------------------------------------------------------ *
 * The link preview card — one template, drawn for every course and every step.
 *
 * 1200×630 because that is the size that gets a full-width banner in WhatsApp
 * rather than the small square thumbnail beside the text, and it is equally
 * the size Facebook, LinkedIn and X want (1.91:1). Anything under 300px wide
 * or over 600KB gets dropped by WhatsApp silently, so the design is flat on
 * purpose: solid fills, one hairline, no gradient and no photograph. A card
 * like this encodes to well under 100KB.
 *
 * It is a template rather than four hand-made images so that seeding a course
 * stays a content change. A new course appears at /<slug> with a correct
 * preview and nobody has to open a design tool.
 * ------------------------------------------------------------------ */

/* Two faces, and they do the two jobs the social posters split them into: the
 * title is DISPLAY and everything around it is chrome.
 *
 * Familjen Grotesk is the app's display face, and it took a conversion to get
 * here. next/font/google serves it as woff2 and Satori reads only ttf/otf/woff,
 * so `assets/FamiljenGrotesk-Medium.ttf` is the latin subset the app already
 * ships, instanced at wght 500 and re-flavoured to a plain TTF:
 *
 *   python3 -c "from fontTools.ttLib import TTFont; from fontTools.varLib \
 *     import instancer; f=TTFont('Demand/social/_source/fonts/familjen-grotesk.woff2'); \
 *     instancer.instantiateVariableFont(f,{'wght':500},inplace=True); \
 *     f.flavor=None; f.save('platform/assets/FamiljenGrotesk-Medium.ttf')"
 *
 * INSTANCED, not handed over as a variable font — Satori's variable-axis
 * support does not reliably apply a wght, so a variable file renders at its
 * default 400 whatever the CSS asks for. Pinning the axis in the file is what
 * makes the weight survive.
 *
 * Satoshi stays for the eyebrow, subtitle and footer: those frame the title
 * rather than being it, which is the owner's content/container rule (2026-08-02)
 * applied to a card instead of a step. Same TTFs _dev/fonts/ holds for the PDF
 * scripts, copied into platform/assets/ so the build never reaches outside its
 * own root — Vercel builds from platform/, and a file above it may not be there. */
const FONT_DIR = join(process.cwd(), "assets");

async function faces() {
  const [bold, medium, display] = await Promise.all([
    readFile(join(FONT_DIR, "Satoshi-Bold.ttf")),
    readFile(join(FONT_DIR, "Satoshi-Medium.ttf")),
    readFile(join(FONT_DIR, "FamiljenGrotesk-Medium.ttf")),
  ]);
  return [
    { name: "Satoshi", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Satoshi", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Display", data: display, weight: 500 as const, style: "normal" as const },
  ];
}

/* ---- SIZED FOR THE THUMBNAIL, NOT FOR THE FILE ---------------------- *
 *
 * The card is 1200×630 and WhatsApp draws it at roughly HALF that in a chat —
 * about 600px across on a phone. Everything on it therefore has to survive a
 * 50% reduction, which the first version did not: at 28px the subtitle came out
 * around 14px on the device and could not be read at all.
 *
 * The other half of the same lesson is that WhatsApp prints its OWN title,
 * description and domain in the bubble UNDER the image. Anything the card
 * repeats is said twice, in a place where it is smaller and harder to read the
 * second time. So the card carries the title, and the caption carries the prose
 * — the subtitle came off entirely on 2026-08-03 and that is what paid for the
 * bigger type everywhere else.
 *
 * The fit, with the subtitle gone:
 *
 *   630 − 2×64 padding                     = 502 of content
 *   − 56 wordmark − 38 footer − ~40 gaps   = 368
 *   − 50 eyebrow and its margin            = 318 for the title
 *
 * One line at any size the length picks, two under ~100, three under ~62.
 * Familjen Grotesk at 500 averages about 0.46 of its point size per character
 * at these widths; CHAR_W only has to be right enough to catch the wrap.
 * --------------------------------------------------------------------- */
const CONTENT_W = 1056;
const CHAR_W = 0.46;

function titleSize(title: string) {
  const base = title.length <= 18 ? 118 : title.length <= 30 ? 100 : title.length <= 44 ? 82 : 66;
  const lines = Math.ceil(title.length / Math.floor(CONTENT_W / (CHAR_W * base)));
  if (lines >= 3) return Math.min(base, 62);
  if (lines === 2) return Math.min(base, 100);
  return base;
}

function clamp(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const word = cut.lastIndexOf(" ");
  return `${cut.slice(0, word > 0 ? word : max).replace(/[,;:]$/, "")}…`;
}

/* Palette and background are lifted straight off the social posters
 * (`prog-post.mjs`), so a link preview and a carousel slide are recognisably
 * the same object. Un-boxed, like the posts: the old version sat a white panel
 * with a hairline border inside a grey canvas, which is a card inside a card
 * once WhatsApp draws its own bubble round it. */
const INK = "#0D0D0F";
const MUTED = "#5F5F68";
const EYE = "#6C4CF0";

/* The poster's four layers, re-sized for a 1200×630 landscape instead of a
 * 1080×1920 portrait — the radii are in px, so carrying them across unchanged
 * would put the purple wash off the top of a card a third the height. */
const CANVAS =
  "radial-gradient(1100px 620px at 92% 4%, rgba(139,124,255,.30), transparent 60%)," +
  "radial-gradient(900px 560px at -6% 88%, rgba(96,166,255,.24), transparent 62%)," +
  "radial-gradient(820px 460px at 62% 108%, rgba(255,176,124,.18), transparent 60%)," +
  "linear-gradient(#FCFCFD,#F2F3F6)";

/* THE LOGO IS THE WORD (owner's call, 2026-08-03) — no glyph beside it. Same
 * decision as the posts, and the same reason: the mark is too small at this
 * scale to read as a shape, so it arrived as a speck ahead of the word. The
 * footer still carries the real host, so the abbreviation never has to be
 * decoded by a stranger — "Bklsss" and "booklesss.app" are on the same card. */
const WORDMARK = "Bklsss";

/* WHAT THE THING ACTUALLY IS (owner's call, 2026-08-03).
 *
 * The first card said the brand, the course and the step, and nowhere did it
 * say what any of that was — a stranger in a WhatsApp group had no way to tell
 * a set of study notes from a blog, a shop or a podcast. This line is the only
 * words on the card that are the same on every card, which is exactly why it
 * can carry the category: everything else is the specific thing being shared. */
const KIND = "Study notes";

export async function shareCard({
  eyebrow,
  title,
}: {
  /** Small caps line above the title: the course a step belongs to. */
  eyebrow?: string;
  title: string;
}) {
  const fonts = await faces();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundImage: CANVAS,
          fontFamily: "Satoshi",
        }}
      >
        {/* The logo — the word, on its own. 40px here against 31px on a
            1080-wide poster: the card is a third the height, so the same
            optical weight needs more points.

            Suppressed on the brand card, where the title is already the name.
            "Bklsss" stacked over "Booklesss" is the same word spelled two ways
            on one card, which reads as a typo rather than as a lockup — and
            there the 92px title is doing the logo's job anyway. An empty span
            rather than nothing, so `space-between` still has three children to
            distribute and the title does not jump to the top of the card. */}
        <span
          style={{
            fontFamily: "Display",
            fontSize: 52,
            fontWeight: 700,
            color: INK,
            letterSpacing: -1.6,
          }}
        >
          {title === SITE_NAME ? "" : WORDMARK}
        </span>

        {/* The thing being shared — an eyebrow and the title, and that is all.
            The prose that used to sit under it is WhatsApp's job now. */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}>
          {eyebrow ? (
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: EYE,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {clamp(eyebrow, 40)}
            </span>
          ) : null}
          <span
            style={{
              fontFamily: "Display",
              fontSize: titleSize(title),
              fontWeight: 500,
              color: INK,
              lineHeight: 1.02,
              letterSpacing: -2.6,
            }}
          >
            {clamp(title, 62)}
          </span>
        </div>

        {/* Footer — what it is, then where it is.
         *
         * The step / course counter that used to sit on the right came off on
         * 2026-08-03 (owner's call). It was the only number on the card and it
         * aged badly: a count is true on the day the card is built and a course
         * grows, so a cached preview would go on claiming "21 steps" long after
         * there were more.
         *
         * "Study notes" leads and takes the ink, because it is the one thing on
         * the card a stranger does not already know — the host is repeated by
         * WhatsApp's own bubble two lines below, so it can afford to be the
         * quieter half. */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 32 }}>
          <span style={{ fontWeight: 700, color: INK }}>{KIND}</span>
          <span style={{ fontWeight: 500, color: MUTED, padding: "0 14px" }}>·</span>
          <span style={{ fontWeight: 500, color: MUTED }}>{SITE_HOST}</span>
        </div>
      </div>
    ),
    { ...OG_DIMENSIONS, fonts },
  );
}
