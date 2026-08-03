import type { Metadata } from "next";
import { getMyReferralCode } from "@/lib/referral";

/* ------------------------------------------------------------------ *
 * The site's identity on the open web.
 *
 * Everything a link preview needs is absolute — a messaging app fetches the
 * page cold, with no origin to resolve `/treasury-management` against — so one
 * host is declared here, `metadataBase` in the root layout is built from it,
 * and every other URL in the app's metadata stays relative and gets resolved.
 * Changing domain is this file.
 *
 * WhatsApp is the surface this was built for, and it reads exactly four tags:
 * og:title, og:description, og:url and og:image. Its constraints (Meta's
 * "Link Previews" doc, plus the Sharing best-practices page) are what the
 * numbers below and in og.tsx are set to:
 *
 *   - the <head> must land inside the first 300KB of HTML
 *   - og:description is shown to about 80 characters, so the first 80 have to
 *     carry the whole line — hence SHARE_DESCRIPTION_MAX
 *   - the image must be under 600KB, at least 300px wide, no narrower in ratio
 *     than 4:1; 1200×630 is what earns the big banner preview rather than the
 *     small square thumbnail
 *   - jpg / png / webp only. An SVG og:image renders as no image at all.
 * ------------------------------------------------------------------ */

export const SITE_HOST = "booklesss.app";
export const SITE_URL = `https://${SITE_HOST}`;
export const SITE_NAME = "Booklesss";

/**
 * What a shared link says when nothing more specific is known.
 *
 * Leads with the category (owner's call, 2026-08-03). The line used to open
 * "Your whole course…", which describes the shape of the thing without ever
 * saying what it is — a stranger meeting this cold in a WhatsApp group could
 * not tell notes from a timetable app. 58 characters, so it survives the ~80
 * WhatsApp shows. The card carries the same word; see KIND in lib/og.tsx.
 */
export const SITE_DESCRIPTION = "Study notes for your whole course, in order, on your phone.";

/** WhatsApp truncates the description at roughly this many characters. */
export const SHARE_DESCRIPTION_MAX = 80;

/**
 * Trim prose down to something that survives a preview card.
 *
 * Cuts at a sentence end where there is one within budget, because half a
 * sentence with an ellipsis reads like a broken page — and a step's opening
 * sentence is usually the whole description anyway. Falls back to a word
 * boundary.
 */
export function shareText(text: string, max = SHARE_DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const head = clean.slice(0, max + 1);
  const sentence = Math.max(head.lastIndexOf(". "), head.lastIndexOf("? "), head.lastIndexOf("! "));
  if (sentence > max * 0.5) return clean.slice(0, sentence + 1);

  const word = head.lastIndexOf(" ");
  return `${clean.slice(0, word > 0 ? word : max).replace(/[,;:—-]$/, "")}…`;
}

/**
 * The absolute URL to hand someone, for a page's route path.
 *
 * Reads the host the reader is actually on rather than hard-coding SITE_URL,
 * so a link shared from a preview deploy, or from booklesss.vercel.app before
 * the domain's DNS has propagated, is a link that opens. Only localhost falls
 * back to the canonical host — nobody wants to be sent http://localhost:3000.
 *
 * REFERRALS ARE EMITTED HERE — the seam this comment used to reserve
 * (2026-08-02, "when accounts land, append the code here"). Accounts landed
 * 2026-08-03: a signed-in student's links carry `?r=<their-code>`, published
 * into lib/account by AccountSignal because this is a plain function with no
 * React above it. Signed out, links stay clean — a referral has to point at
 * a person. Capture and attribution live in lib/referral.
 */
export function shareUrl(path: string): string {
  if (typeof window === "undefined") return `${SITE_URL}${path}`;
  const { origin } = window.location;
  const local = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(origin);
  const base = `${local ? SITE_URL : origin}${path === "/" ? "" : path}`;
  const code = getMyReferralCode();
  return code ? `${base}?r=${code}` : base;
}

/** The path segment the brand card sits at: /og/home.png */
export const OG_HOME_SLUG = "home";

/** Every card is drawn at this size — see lib/og.tsx for why. */
export const OG_DIMENSIONS = { width: 1200, height: 630 };

/**
 * The preview image for a page, as an explicit og:image entry.
 *
 * Width, height and type are spelled out rather than left to be discovered:
 * Meta's sharing guide asks for them so the image "loads properly the first
 * time it's shared" — the crawler otherwise has to fetch and decode the file
 * before it can lay the card out, and a preview that misses that race is the
 * one a group actually sees.
 *
 * @param path the page's route path ("/" or "/treasury-management" or a step)
 */
export function ogImage(path: string, alt: string) {
  const stem = path === "/" ? `/${OG_HOME_SLUG}` : path;
  return {
    url: `/og${stem}.png`,
    ...OG_DIMENSIONS,
    type: "image/png",
    alt,
  };
}

/**
 * A complete Open Graph block for one page.
 *
 * Complete is the point: Next REPLACES a parent's `openGraph` wholesale when a
 * child defines one, rather than merging field by field. A page that set only
 * a title here would silently drop siteName, type and locale from the root
 * layout. Every caller goes through this so that can't happen.
 *
 * The card comes from app/og/[...slug]/route.tsx, named here by ogImage() —
 * the file convention can't be used, see that file's header.
 */
export function openGraph({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Route path, leading slash. Resolved against metadataBase. */
  path: string;
}): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: path,
    title,
    description,
    images: [ogImage(path, title)],
  };
}
