import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
import { GetAppCard, LandingAuth, ToApp } from "@/components/landing/landing-bits";

/* ------------------------------------------------------------------ *
 * The front door. A real landing page, not the app.
 *
 * "/" was the student dashboard until 2026-08-03, when Google's OAuth review
 * rejected the branding twice: the home page has to be a static URL that
 * names the app, fully describes what it does, links the privacy policy, and
 * is readable without signing in — none of which a dashboard is. The
 * dashboard lives at /home.
 *
 * THE LOOK IS A REFERENCE, SUPPLIED BY THE OWNER (2026-08-03, four phone
 * screenshots of Claude's own mobile login page: "I would like my whole
 * homepage to literally look like this, as simple as could be"). One narrow
 * column on a warm ground: wordmark header, a big display headline, a "Get
 * the app" card, the auth card (Google / OR / email), a "Meet Booklesss"
 * section, then feature sections over hairlines, each with a screenshot in a
 * warm panel. Per the design system's rule on references, the reference is
 * the brief — centred and stacked wins over the usual variance dials — with
 * the app's own faces standing in for the reference's serif.
 *
 * SERVER-RENDERED ON PURPOSE. The pitch — name, purpose, privacy link — is
 * in the static HTML, because the reviewer that failed us may never run
 * JavaScript. The client pieces (landing-bits) are the two cards and the
 * redirect that sends people who already live here past the door.
 *
 * THE SCREENSHOTS ARE THE REAL APP, with its real courses, shot at the phone
 * viewport by `scripts/cap-landing.mjs`. Not the social captures: those are
 * relabelled to an invented curriculum so no post names a school, and putting
 * invented courses on the product's own front door would be claiming a
 * catalogue that does not exist.
 * ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  description:
    "Booklesss is a course reader: university study notes rewritten as short steps you read on your phone, with checkpoints that track your studying.",
  alternates: { canonical: "/" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" }),
};

/* The reference's ground: a warm cream, flat — the poster gradient stayed on
 * the OG card and the socials, where it came from. */
const BG = "#FAF9F5";
const PANEL = "#F0EEE6";
const RULE = "rgba(30,30,29,0.10)";

const SHOTS = {
  reader: { src: "/landing/reader.png", w: 1206, h: 2622 },
  contents: { src: "/landing/contents.png", w: 960, h: 2340 },
  dashboard: { src: "/landing/dashboard.png", w: 1206, h: 2622 },
} as const;

/** A feature: an icon beside a heading, a line of what it means, and the
 *  screen that proves it — cropped in a warm panel, as the reference crops
 *  its product shots, rather than floating in a phone bezel. */
function Feature({
  icon,
  title,
  body,
  shot,
  alt,
}: {
  icon: MynaIconName;
  title: string;
  body: string;
  shot: keyof typeof SHOTS;
  alt: string;
}) {
  const s = SHOTS[shot];
  return (
    <section className="border-t py-12" style={{ borderColor: RULE }}>
      <h3 className="flex items-center gap-3 font-display text-[26px] font-medium leading-tight tracking-[-0.01em] text-ink">
        <MynaIcon name={icon} size={26} className="shrink-0 text-ink-2" />
        {title}
      </h3>
      <p className="mt-4 text-[17px] leading-7 text-ink-2">{body}</p>
      <div
        className="mt-7 h-[380px] overflow-hidden rounded-[20px] px-6 pt-6"
        style={{ backgroundColor: PANEL }}
      >
        <Image
          src={s.src}
          alt={alt}
          width={s.w}
          height={s.h}
          sizes="(max-width: 640px) 90vw, 480px"
          className="h-full w-full rounded-t-[14px] border border-black/5 object-cover object-top shadow-[0_2px_12px_rgba(60,50,30,0.10)]"
        />
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: BG }}>
      <ToApp />

      {/* The wordmark, and nothing beside it. The page's actions live in the
          two cards; a returning reader is caught by ToApp or by the auth
          card's own sign-in toggle inside the modal. */}
      <header className="mx-auto w-full max-w-[560px] px-5 py-6">
        <span className="font-display text-[22px] font-bold leading-none tracking-tight text-ink">
          Booklesss
        </span>
      </header>

      <main className="mx-auto w-full max-w-[560px] px-5 pb-4">
        {/* ---- the headline, as the reference sets it: huge, centred ---- */}
        <h1 className="px-2 pb-10 pt-8 text-center font-display text-[40px] font-medium leading-[1.08] tracking-[-0.02em] text-ink md:text-[52px]">
          Your whole course, in steps you can actually read
        </h1>

        {/* ---- the two cards: install, then Clerk's own sign-up form ---- */}
        <div className="flex flex-col gap-5">
          <GetAppCard />
          <LandingAuth />
        </div>

        {/* ---- what this is (static, for anyone who scrolls — and for the
                reviewer who runs no JavaScript) ---- */}
        <section className="px-2 pb-14 pt-20 text-center">
          <h2 className="font-display text-[34px] font-medium leading-tight tracking-[-0.015em] text-ink">
            Meet Booklesss
          </h2>
          <p className="mx-auto mt-5 max-w-[440px] text-[19px] leading-8 text-ink-2">
            Booklesss is a course reader: university study notes rewritten as short steps you read
            on your phone, with checkpoints that track your studying.
          </p>
        </section>

        <Feature
          icon="book-open"
          title="Read it in steps, not chapters"
          body="Every lesson is one sitting — the idea first, then what it means in practice. Tap a term you don't know and it explains itself in place, without losing your spot."
          shot="reader"
          alt="A step open in the Booklesss reader on a phone"
        />

        <Feature
          icon="clipboard"
          title="The whole course, in order"
          body="No hunting through a folder of PDFs for the right one. Everything is laid out in reading order, and what you have finished is ticked off as you go."
          shot="contents"
          alt="The course contents drawer, showing lessons with completed steps ticked"
        />

        <Feature
          icon="chart-bar-increasing"
          title="Proof the studying happened"
          body="Each section ends with an honest answer — got it, almost, not yet. Those answers turn into a streak, hours read and how much of the course is covered."
          shot="dashboard"
          alt="The dashboard, showing streak, coverage and time studied this week"
        />

        {/* ---- footer ----
            Privacy and terms are load-bearing: Google's OAuth review requires
            the home page to link its privacy policy, and their absence is what
            failed it. Do not remove them to "keep the page to one link". */}
        <footer
          className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t py-8 text-[13px] text-muted"
          style={{ borderColor: RULE }}
        >
          <span className="font-medium text-ink">Booklesss</span>
          <Link href="/privacy" className="transition-colors hover:text-ink">
            Privacy policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-ink">
            Terms of service
          </Link>
          <a href="mailto:deekymvula@gmail.com" className="transition-colors hover:text-ink">
            Contact
          </a>
        </footer>
      </main>
    </div>
  );
}
