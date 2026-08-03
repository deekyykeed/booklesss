import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { LandingSignUp, ToApp } from "@/components/landing/landing-bits";

/* ------------------------------------------------------------------ *
 * The front door. A real landing page, not the app.
 *
 * "/" was the student dashboard until 2026-08-03, when Google's OAuth review
 * rejected the branding twice: the home page has to be a static URL that
 * names the app, fully describes what it does, links the privacy policy, and
 * is readable without signing in — none of which a dashboard is. The owner's
 * call: "it might just need to be a proper application website landing page"
 * — so this is that, and the dashboard lives at /home.
 *
 * SERVER-RENDERED ON PURPOSE. The whole pitch is in the static HTML, because
 * the reviewer that failed us may never run JavaScript. The only client
 * pieces are the sign-up button and the redirect that sends people who
 * already live here past the door (landing-bits).
 *
 * ONE ACTION, AND IT IS SIGN UP (owner, 2026-08-03: "the only link i expect
 * there is signing up — nothing to the course or whatever"). The course grid
 * and the "Start reading" link into /home are gone. What remains that is
 * still a link:
 *   - privacy, terms and contact in the footer. These are NOT decoration and
 *     must not be tidied away: Google's OAuth review requires a home page
 *     that links its privacy policy, and removing them is what failed the
 *     review in the first place.
 * There is deliberately no "Sign in" beside the sign-up button — the sheet
 * carries its own "Already have an account?" toggle, so a returning reader is
 * one tap in without the front door offering two doors.
 *
 * THE SCREENSHOTS ARE THE REAL APP, with its real courses, shot at the phone
 * viewport by `scripts/cap-landing.mjs`. Not the social captures: those are
 * relabelled to an invented curriculum so no post names a school, and putting
 * invented courses on the product's own front door would be claiming a
 * catalogue that does not exist. The progress in them is seeded demo data and
 * is kept plausible — a month in, nothing finished.
 *
 * It wears the poster's dress (lib/og.tsx, itself lifted from the social
 * posters): the same gradient washes, the same purple eyebrow, the "Bklsss"
 * wordmark in the header with the full name in the headline — which also
 * settles Google's "app name does not match" complaint, since the consent
 * screen says Booklesss.
 * ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  description:
    "Booklesss is a course reader: university study notes rewritten as short steps you read on your phone, with checkpoints that track your studying.",
  alternates: { canonical: "/" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" }),
};

/* The poster's washes (lib/og.tsx CANVAS), applied to a page that scrolls:
 * anchored to the viewport corners with rem-ish sizes rather than the card's
 * fixed px, so the colour sits where the card put it at any screen size. */
const WASH =
  "radial-gradient(70rem 40rem at 92% -4%, rgba(139,124,255,.30), transparent 60%)," +
  "radial-gradient(56rem 36rem at -6% 60%, rgba(96,166,255,.24), transparent 62%)," +
  "radial-gradient(50rem 30rem at 62% 108%, rgba(255,176,124,.18), transparent 60%)," +
  "linear-gradient(#FCFCFD,#F2F3F6)";

const EYE = "#6C4CF0";
const RULE = "rgba(30,30,29,0.10)";

/* True pixel sizes, so next/image serves a right-sized srcset instead of
 * shipping a 1206px-wide PNG to a phone that draws it at 280. Three shots come
 * off a 402x874 viewport at dsf 3; the drawer comes off a 320-wide one (see
 * scripts/cap-landing.mjs for why), so it is NOT the same aspect and sharing
 * one constant between them would letterbox it inside the bezel. */
const SHOTS = {
  reader: { src: "/landing/reader.png", w: 1206, h: 2622 },
  practice: { src: "/landing/practice.png", w: 1206, h: 2622 },
  dashboard: { src: "/landing/dashboard.png", w: 1206, h: 2622 },
  contents: { src: "/landing/contents.png", w: 960, h: 2340 },
} as const;

type ShotName = keyof typeof SHOTS;

/** A screenshot in a phone bezel. The house rule for the social posters is
 *  "no device mockups" — that holds there, where the frame is 9:16 and IS a
 *  phone. Here the page is a wide document and a bare tall rectangle floating
 *  in it reads as a cropped image rather than as a screen, so the bezel is
 *  doing real work: it says "this is what it looks like on your phone". */
function Phone({ shot, alt, priority = false }: { shot: ShotName; alt: string; priority?: boolean }) {
  const s = SHOTS[shot];
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div className="squircle overflow-hidden rounded-[2.25rem] border-[7px] border-[#1b1b1f] bg-[#1b1b1f] shadow-[0_2px_6px_rgba(20,20,40,.06),0_28px_60px_-24px_rgba(20,20,50,.28)]">
        <Image
          src={s.src}
          alt={alt}
          width={s.w}
          height={s.h}
          priority={priority}
          sizes="(max-width: 768px) 70vw, 280px"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

/** One alternating row: a claim, and the screen that proves it. */
function Feature({
  n,
  title,
  body,
  shot,
  alt,
  flip = false,
}: {
  n: string;
  title: string;
  body: string;
  shot: ShotName;
  alt: string;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:gap-14 md:py-20">
      <div className={flip ? "md:order-2" : undefined}>
        <p className="text-[12px] font-semibold tracking-[0.14em]" style={{ color: EYE }}>
          {n}
        </p>
        <h2 className="mt-3 max-w-[420px] font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[34px]">
          {title}
        </h2>
        <p className="mt-3 max-w-[440px] text-[16px] leading-7 text-ink-2">{body}</p>
      </div>
      <div className={flip ? "md:order-1" : undefined}>
        <Phone shot={shot} alt={alt} />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: WASH }}>
      <ToApp />

      {/* Header: the wordmark, and nothing to click. The one action on this
          page is the sign-up button, and it should not have to compete with a
          nav that goes nowhere. */}
      <header className="mx-auto flex w-full max-w-[1040px] items-center justify-between px-5 py-6">
        <span className="font-display text-[20px] font-bold leading-none tracking-tight text-ink">Bklsss</span>
        <LandingSignUp className="squircle h-10 rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-85">
          Sign up
        </LandingSignUp>
      </header>

      <main className="mx-auto w-full max-w-[1040px] px-5">
        {/* ---- the pitch ---- */}
        <section className="grid items-center gap-12 pb-8 pt-10 md:grid-cols-2 md:gap-10 md:pb-16 md:pt-20">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: EYE }}>
              Study notes
            </p>
            <h1 className="mt-3 font-display text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-ink md:text-[64px]">
              Booklesss
            </h1>
            <p className="mt-4 max-w-[480px] font-display text-[23px] font-medium leading-[1.25] tracking-[-0.01em] text-ink md:text-[28px]">
              Your whole course, rewritten as steps you can actually read.
            </p>
            <p className="mt-5 max-w-[460px] text-[16px] leading-7 text-ink-2">
              University study notes, broken into short steps for your phone. Read a section, say how
              it landed, and watch the studying add up — day streaks, time put in, how much of the
              course you have covered.
            </p>

            <div className="mt-8">
              <LandingSignUp className="squircle inline-flex h-13 items-center rounded-2xl bg-ink px-7 text-[16px] font-medium text-white transition-opacity hover:opacity-85">
                Create your account
              </LandingSignUp>
              <p className="mt-3 text-[13.5px] text-muted">
                Free to start. Your progress follows you to any device you sign in on.
              </p>
            </div>
          </div>

          <Phone shot="reader" alt="A step open in the Booklesss reader on a phone" priority />
        </section>

        {/* ---- what it actually is, one screen at a time ---- */}
        <section className="divide-y" style={{ borderColor: RULE }}>
          <div className="border-t" style={{ borderColor: RULE }}>
            <Feature
              n="01"
              title="Read it in steps, not chapters"
              body="Every lesson is one sitting — the idea first, then what it means in practice. Tap a term you don't know and it explains itself in place, without losing your spot."
              shot="practice"
              alt="A lesson's key ideas and a worked example, further down the same step"
              flip
            />
          </div>

          <div className="border-t" style={{ borderColor: RULE }}>
            <Feature
              n="02"
              title="The whole course, in order"
              body="No hunting through a folder of PDFs for the right one. Everything is laid out in reading order, and what you have finished is ticked off as you go."
              shot="contents"
              alt="The course contents drawer, showing lessons with completed steps ticked"
            />
          </div>

          <div className="border-t" style={{ borderColor: RULE }}>
            <Feature
              n="03"
              title="Proof the studying happened"
              body="Each section ends with an honest answer — got it, almost, not yet. Those answers turn into a streak, hours read and how much of the course is covered."
              shot="dashboard"
              alt="The dashboard, showing streak, coverage and time studied this week"
              flip
            />
          </div>
        </section>

        {/* ---- the close: the same single action ---- */}
        <section className="border-t py-16 text-center md:py-24" style={{ borderColor: RULE }}>
          <h2 className="mx-auto max-w-[520px] font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[40px]">
            Start with one step tonight.
          </h2>
          <p className="mx-auto mt-4 max-w-[420px] text-[16px] leading-7 text-ink-2">
            Make an account and pick up where you left off, on whatever you happen to be holding.
          </p>
          <LandingSignUp className="squircle mt-8 inline-flex h-13 items-center rounded-2xl bg-ink px-7 text-[16px] font-medium text-white transition-opacity hover:opacity-85">
            Create your account
          </LandingSignUp>
        </section>

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
