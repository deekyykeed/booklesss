import type { Metadata, Viewport } from "next";
import { Inter, Familjen_Grotesk, Rubik, Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import { RegisterSW } from "@/components/RegisterSW";
import { DesktopGate } from "@/components/DesktopGate";
import { IdentityAssignment } from "@/components/identity/IdentityAssignment";
import { AccountSignal } from "@/components/auth/AccountSignal";
import { AuthGate } from "@/components/auth/AuthGate";
import { SettingsSheet } from "@/components/identity/SettingsSheet";
import { openGraph, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// App chrome and headings use Familjen Grotesk (via --font-display); a STEP
// TITLE uses Bricolage Grotesque (via --font-title) since 2026-08-08 — see the
// note above the Bricolage registration below. The Ernon face is still in
// src/fonts/ if it's ever wanted back — re-register it with next/font/local
// and put --font-ernon at the front of --font-display.

// Self-hosted at build time by next/font — no Google round-trip, no CLS.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
  display: "swap",
});

/* Two faces inside a step, and the split matters (owner, 2026-08-02).
 *
 *   READING is Aptos. The prose, the callouts, the cards, the cells of a
 *   table — anything a student is actually reading a sentence of. It was
 *   briefly swapped wholesale for Satoshi; that was too far.
 *
 *   CONTAINERS are Satoshi. The chrome inside a step that frames or annotates
 *   rather than reads: the source chips, the tap-to-define popup, the section
 *   note menu, the comprehension check dialog, a table's column headings.
 *
 * Both are self-hosted. Aptos at least ships with Office; Satoshi is on no
 * device by default, so a CDN link would make the one font a course is read in
 * a hard dependency on someone else's uptime. */
const aptos = localFont({
  src: [
    { path: "../fonts/aptos.woff2", weight: "400", style: "normal" },
    { path: "../fonts/aptos-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/aptos-bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/aptos-bold-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-aptos",
  display: "swap",
});

// Satoshi (Fontshare / Indian Type Foundry, ITF Free Font Licence). Five faces:
// the container chrome sets labels at medium and semibold, and a synthesised
// weight on a 12px uppercase heading is exactly where it shows.
// Source TTFs live in _dev/fonts/; run scripts/subset-fonts.py after any
// content change that could introduce a new character.
const satoshi = localFont({
  src: [
    { path: "../fonts/satoshi.woff2", weight: "400", style: "normal" },
    { path: "../fonts/satoshi-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/satoshi-medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/satoshi-bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/satoshi-bold-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

/* ---- THREE FACES THAT EXIST FOR THE FRONT DOOR AND NOWHERE ELSE ----
 *
 * Measured off the owner's Framer design for "/" (Booklesss RESERVE, read
 * 2026-08-06). Every other surface in the app is Inter / Familjen Grotesk /
 * Aptos / Satoshi and should stay that way — if one of these starts appearing
 * inside the app, that is a decision to make on purpose, not by reaching for
 * whatever is already registered.
 *
 * They cost nothing on the routes that don't use them: next/font emits a
 * @font-face per family and a browser downloads a face only when something
 * rendered actually asks for it. The landing page is the only thing that does.
 *
 * BURBANK WAS ALREADY HERE. It drew the logo until the mark became an icon,
 * and the file never left src/fonts/ — the design brings it back for the same
 * job, so this is a re-registration rather than a new dependency. */
const burbank = localFont({
  src: [{ path: "../fonts/burbank.woff2", weight: "700", style: "normal" }],
  variable: "--font-burbank",
  display: "swap",
});

/* Rubik at 400 and 500, Bricolage at 800. Both are variable families upstream;
   naming the weights takes static instances instead, which is smaller than
   shipping an axis for two stops.
   The 500 is the hero subtitle (owner, 2026-08-06: "increase the opacity and
   weight of the subtitle text"). It is a real cut, not a synthesised bold —
   which matters at 16px over a photograph, where faux-bold thickens strokes
   unevenly and reads as blur rather than weight. 400 stays for the trust
   line. */
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-rubik",
  display: "swap",
});

/* BRICOLAGE IS NO LONGER FRONT-DOOR-ONLY (owner, 2026-08-08: "i want to move
 * away from familjen font titles i want to use bricolage grotesk"). It draws
 * the step <h1> in the reader now, through `--font-title` in globals.css.
 *
 * That is a deliberate widening of the palette, which the note above and
 * .claude/CLAUDE.md both say is a decision rather than a convenience — so it is
 * a decision, and it is scoped: the title of a step, and nothing else. The app
 * chrome (header, sidebars, dashboard, settings, pickers) stays on Familjen via
 * `--font-display`, and swapping THAT would be a second decision.
 *
 * 600 is new and is what the title wears. 800 is the landing page's hero and is
 * untouched. Two static instances rather than the variable axis, for the same
 * reason Rubik takes two: naming the weights is smaller than shipping an axis
 * for two stops. The 600 file is fetched on reader routes now, where before no
 * route but "/" asked for any Bricolage at all — a real cost, and the point of
 * writing it down. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

/* The origin every piece of metadata is made absolute against — og:image,
 * og:url, canonical. A crawler arrives with no origin to resolve a relative
 * path against, so this has to be a real host.
 *
 * It reads Vercel's own answer for what this project's production domain is,
 * rather than hard-coding booklesss.app, because those two are not the same
 * thing until the DNS is pointed. Before then the production host is
 * booklesss.vercel.app, and a card advertising an image at booklesss.app would
 * fetch nothing — the preview would come back with no picture, which is
 * exactly the failure this work exists to fix. Adding the domain in Vercel
 * changes this value on the next deploy with nothing to edit here.
 *
 * Server-only: this file is a server component, and the constant in
 * lib/site.ts stays the canonical brand host for anything the browser reads. */
const metadataOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(metadataOrigin),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  /* Inherited by any page that doesn't declare its own openGraph. Pages that
   * do declare one replace this wholesale rather than merging into it, so they
   * all build theirs with openGraph() from lib/site.ts. */
  openGraph: openGraph({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
  /* X and LinkedIn read this; WhatsApp ignores it and uses og:* alone. Naming
   * no image lets it fall back to the same opengraph-image each route
   * generates, so there is one card to maintain rather than two. */
  twitter: { card: "summary_large_image" },
  // iOS ignores the web manifest's icons and reads its own link, which
  // src/app/apple-icon.png supplies on its own — as favicon.ico and icon.svg
  // beside it do for the tab. Naming any of them in an `icons` field here
  // would take over from the file convention and drop the rest.
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
};

/* themeColor paints the phone's browser chrome to match the app rather than
 * leaving a white bar above a canvas-grey page — same value as the manifest's.
 *
 * interactiveWidget is what stops the on-screen keyboard covering whatever a
 * student is typing into: by default the keyboard slides over the page and the
 * viewport units don't notice, so a centred dialog sized in dvh stays where it
 * was, half of it now behind the keys. "resizes-content" shrinks the viewport
 * instead, so dvh means what it says and anything capped by it scrolls its own
 * content up. */
export const viewport: Viewport = { themeColor: "#f5f5f5", interactiveWidget: "resizes-content" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const document = (
    <html
      lang="en"
      className={`${inter.variable} ${familjen.variable} ${aptos.variable} ${satoshi.variable} ${burbank.variable} ${rubik.variable} ${bricolage.variable} h-full`}
    >
      <head>
        {/* Sets data-motion before first paint, so a reader who asked for a
            still page doesn't watch six blobs start drifting and then stop a
            moment later when React hydrates. Inline and tiny for that reason:
            anything imported would arrive too late to be worth running. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("booklesss:motion:v1")==="reduced")document.documentElement.dataset.motion="reduced"}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full bg-canvas text-ink">
        {children}
        {/* Gives a first-time device an avatar and its name. Renders nothing —
            nobody is asked. Mounted here rather than per-layout so a route
            added later can't quietly land a reader with no identity. */}
        <IdentityAssignment />
        <SettingsSheet />
        {/* THERE IS NO AUTH PROVIDER (2026-08-05). Clerk needed one wrapping the
            tree, which is why this file used to return two different documents
            and why AccountSignal and the gate had to live inside one branch of
            it. Supabase's client is a module singleton — see
            lib/supabase/browser — so both of these are ordinary components,
            mounted once, that no-op on a build with no keys.

            AccountSignal publishes "is anybody signed in" and who they are to
            lib/account, which is what the checkpoint row and the next-step link
            gate on. AuthGate turns every requireAccount() ask — a checkpoint
            answer, the next-step gate, the landing card — into the sheet, over
            whatever page raised it. */}
        <AccountSignal />
        <AuthGate />
        {/* Booklesss is a phone app — a wide viewport gets sent to its phone.
            Mounted at the root for the same reason as the identity assignment. */}
        <DesktopGate />
        <RegisterSW />
      </body>
    </html>
  );

  return document;
}
