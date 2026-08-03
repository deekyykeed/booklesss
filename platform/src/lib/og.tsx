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

/* ---- fitting the title ---------------------------------------------- *
 *
 * The card is a fixed 630px and the type inside it isn't, so a long title
 * pushes the footer off the bottom — "Foreign exchange risk management" did
 * exactly that, clipping booklesss.app against the card's edge. Since a new
 * step can be named anything, the fit is computed rather than tuned:
 *
 *   630 − 2×64 padding                          = 502 of content
 *   − 44 wordmark − 32 footer − 48 gaps         = 378
 *   − 38 eyebrow − 96 two lines of subtitle     = 244 for the title
 *
 * A title is therefore allowed 244px: one line at any size the length picks,
 * two lines under ~78, or three under ~46. Familjen Grotesk at 500 averages
 * about 0.46 of its point size per character at these widths — narrower than
 * the Satoshi this used to be set in, which is why the sizes went up rather
 * than down when the face changed. CHAR_W only has to be right enough to
 * catch the wrap.
 * --------------------------------------------------------------------- */
const CONTENT_W = 1056;
const CHAR_W = 0.46;

function titleSize(title: string) {
  const base = title.length <= 18 ? 92 : title.length <= 30 ? 78 : title.length <= 44 ? 64 : 54;
  const lines = Math.ceil(title.length / Math.floor(CONTENT_W / (CHAR_W * base)));
  if (lines >= 3) return Math.min(base, 46);
  if (lines === 2) return Math.min(base, 78);
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

export async function shareCard({
  eyebrow,
  title,
  subtitle,
  meta,
}: {
  /** Small caps line above the title: the course a step belongs to. */
  eyebrow?: string;
  title: string;
  subtitle: string;
  /** Bottom-right counter — "12 steps". Optional. */
  meta?: string;
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
        <span style={{ fontSize: 40, fontWeight: 700, color: INK, letterSpacing: -1 }}>
          {title === SITE_NAME ? "" : WORDMARK}
        </span>

        {/* The thing being shared. `space-between` pins the footer, so this
            block's own bottom margin is what stops a two-line subtitle from
            growing down into it. */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}>
          {eyebrow ? (
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: EYE,
                letterSpacing: 3.5,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {clamp(eyebrow, 46)}
            </span>
          ) : null}
          <span
            style={{
              fontFamily: "Display",
              fontSize: titleSize(title),
              fontWeight: 500,
              color: INK,
              lineHeight: 1.02,
              letterSpacing: -2.2,
            }}
          >
            {clamp(title, 62)}
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: MUTED,
              lineHeight: 1.35,
              marginTop: 20,
            }}
          >
            {clamp(subtitle, 118)}
          </span>
        </div>

        {/* Footer — no rule above it. A hairline is the kind of furniture the
            un-boxed house style spends its budget avoiding, and at this size
            the gap already separates it. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: INK }}>{SITE_HOST}</span>
          {meta ? <span style={{ fontSize: 26, fontWeight: 500, color: MUTED }}>{meta}</span> : null}
        </div>
      </div>
    ),
    { ...OG_DIMENSIONS, fonts },
  );
}
