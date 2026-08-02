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

/* Satoshi, because the card is a container, not a reading: it frames a title
 * the way a source chip or the define popup frames a sentence (the owner's
 * font rule, 2026-08-02). Familjen Grotesk — the app's display face — comes
 * from next/font/google as woff2, and Satori reads only ttf/otf/woff, so the
 * display face isn't available here without vendoring a second copy of it.
 *
 * These are the same TTFs _dev/fonts/ holds for the PDF scripts, copied into
 * platform/assets/ so the build never reaches outside its own root — Vercel
 * builds from platform/, and a file above it may not be there at all. */
const FONT_DIR = join(process.cwd(), "assets");

async function faces() {
  const [bold, medium] = await Promise.all([
    readFile(join(FONT_DIR, "Satoshi-Bold.ttf")),
    readFile(join(FONT_DIR, "Satoshi-Medium.ttf")),
  ]);
  return [
    { name: "Satoshi", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Satoshi", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

/* The mark, inlined rather than fetched. An <img> pointed at our own /icon.svg
 * would mean the build making an HTTP request to a server that isn't running
 * yet; reading the file and handing Satori a data URI has neither the network
 * nor the ordering problem. */
async function markDataUri() {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/* ---- fitting the title ---------------------------------------------- *
 *
 * The card is a fixed 630px and the type inside it isn't, so a long title
 * pushes the footer off the bottom — "Foreign exchange risk management" did
 * exactly that, clipping booklesss.app against the panel's edge. Since a new
 * step can be named anything, the fit is computed rather than tuned:
 *
 *   630 − 2×48 outer − 2×56 panel padding      = 422 of content
 *   − 52 wordmark − 63 footer − 24 gap          = 283
 *   − 45 eyebrow − 96 two lines of subtitle     = 142 for the title
 *
 * A title is therefore allowed 142px: one line at any size the length picks,
 * or two lines only if each is under ~67px. Satoshi Bold averages a shade
 * over half its point size per character at these widths, which is what
 * CHAR_W is; it only has to be right enough to catch the wrap.
 * --------------------------------------------------------------------- */
const CONTENT_W = 976;
const CHAR_W = 0.52;

function titleSize(title: string) {
  const base = title.length <= 18 ? 88 : title.length <= 30 ? 74 : title.length <= 44 ? 60 : 50;
  const lines = Math.ceil(title.length / Math.floor(CONTENT_W / (CHAR_W * base)));
  if (lines >= 3) return Math.min(base, 44);
  if (lines === 2) return Math.min(base, 66);
  return base;
}

function clamp(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const word = cut.lastIndexOf(" ");
  return `${cut.slice(0, word > 0 ? word : max).replace(/[,;:]$/, "")}…`;
}

const INK = "#171717";
const MUTED = "#707070";
const LINE = "#dfdfdf";
const CANVAS = "#f5f5f5";

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
  const [fonts, mark] = await Promise.all([faces(), markDataUri()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          background: CANVAS,
          fontFamily: "Satoshi",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#ffffff",
            border: `1px solid ${LINE}`,
            borderRadius: 32,
            padding: 56,
          }}
        >
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={52} height={52} alt="" style={{ borderRadius: 12 }} />
            <span style={{ fontSize: 30, fontWeight: 700, color: INK, letterSpacing: -0.4 }}>
              {SITE_NAME}
            </span>
          </div>

          {/* The thing being shared. The bottom margin is what keeps a
              two-line subtitle off the footer rule: space-between pins the
              footer, so a taller middle would otherwise grow into it. */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
            {eyebrow ? (
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: MUTED,
                  letterSpacing: 2.4,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {clamp(eyebrow, 46)}
              </span>
            ) : null}
            <span
              style={{
                fontSize: titleSize(title),
                fontWeight: 700,
                color: INK,
                lineHeight: 1.05,
                letterSpacing: -1.5,
              }}
            >
              {clamp(title, 62)}
            </span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: MUTED,
                lineHeight: 1.3,
                marginTop: 18,
              }}
            >
              {clamp(subtitle, 118)}
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `1px solid ${LINE}`,
              paddingTop: 28,
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 700, color: INK }}>{SITE_HOST}</span>
            {meta ? <span style={{ fontSize: 26, fontWeight: 500, color: MUTED }}>{meta}</span> : null}
          </div>
        </div>
      </div>
    ),
    { ...OG_DIMENSIONS, fonts },
  );
}
