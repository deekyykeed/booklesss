import type { Metadata } from "next";
import Link from "next/link";
import { COURSES } from "@/lib/courses";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { LandingSignIn, ToApp } from "@/components/landing/landing-bits";

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
 * pieces are the sign-in button and the redirect that sends people who
 * already live here past the door (landing-bits).
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
 * anchored to the viewport corners with vmin-ish sizes rather than the card's
 * fixed px, so the colour sits where the card put it at any screen size. */
const WASH =
  "radial-gradient(70rem 40rem at 92% -4%, rgba(139,124,255,.30), transparent 60%)," +
  "radial-gradient(56rem 36rem at -6% 60%, rgba(96,166,255,.24), transparent 62%)," +
  "radial-gradient(50rem 30rem at 62% 108%, rgba(255,176,124,.18), transparent 60%)," +
  "linear-gradient(#FCFCFD,#F2F3F6)";

const EYE = "#6C4CF0";

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: WASH }}>
      <ToApp />

      {/* Header: the wordmark, and the one action a visitor might already
          know they want. */}
      <header className="mx-auto flex w-full max-w-[960px] items-center justify-between px-5 py-5">
        <span className="font-display text-[20px] font-bold leading-none tracking-tight text-ink">Bklsss</span>
        <LandingSignIn className="squircle h-9 rounded-full border border-[#d4d4d4] bg-white px-4 text-[13.5px] font-medium text-ink transition-colors hover:bg-[#fafafa]">
          Sign in
        </LandingSignIn>
      </header>

      <main className="mx-auto w-full max-w-[960px] px-5">
        {/* ---- the pitch ---- */}
        <section className="pb-16 pt-14 md:pt-24">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: EYE }}>
            Study notes
          </p>
          <h1 className="mt-3 max-w-[640px] font-display text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-ink md:text-[56px]">
            Booklesss
          </h1>
          <p className="mt-4 max-w-[560px] font-display text-[22px] font-medium leading-[1.3] tracking-[-0.01em] text-ink md:text-[26px]">
            Your whole course, rewritten as steps you can actually read.
          </p>
          <p className="mt-4 max-w-[560px] text-[16px] leading-7 text-ink-2">
            University study notes, broken into short steps for your phone. Read a section, answer
            its checkpoints, and watch the studying add up on your dashboard — day streaks, time
            put in, how much of the course is covered. An account carries all of it to any device
            you sign in on.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/home"
              className="squircle inline-flex h-12 items-center rounded-xl bg-ink px-6 text-[15.5px] font-medium text-white transition-opacity hover:opacity-85"
            >
              Start reading
            </Link>
            <span className="text-[13.5px] text-muted">The first step is free — no sign-up to read it.</span>
          </div>
        </section>

        {/* ---- how it works ---- */}
        <section className="grid gap-4 border-t border-[rgba(30,30,29,0.10)] py-14 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Read in steps",
              body: "Each lesson is a short step — one sitting, not one hundred pages. Tap a term you don't know and it explains itself in place.",
            },
            {
              n: "02",
              title: "Answer checkpoints",
              body: "Every section ends with a checkpoint: say it landed, or save it for later. Honest ticks, not scrolled-past pages.",
            },
            {
              n: "03",
              title: "Watch it add up",
              body: "Your dashboard turns the ticks into streaks, hours and coverage — proof to yourself that the studying is happening.",
            },
          ].map((s) => (
            <div key={s.n} className="squircle rounded-2xl border border-[rgba(30,30,29,0.10)] bg-white/70 p-5">
              <p className="text-[12px] font-semibold tracking-[0.1em]" style={{ color: EYE }}>
                {s.n}
              </p>
              <h2 className="mt-2 font-display text-[18px] font-semibold text-ink">{s.title}</h2>
              <p className="mt-1.5 text-[14px] leading-6 text-ink-2">{s.body}</p>
            </div>
          ))}
        </section>

        {/* ---- what's on it ---- */}
        <section className="border-t border-[rgba(30,30,29,0.10)] py-14">
          <h2 className="font-display text-[24px] font-semibold tracking-[-0.01em] text-ink">The courses</h2>
          <p className="mt-2 max-w-[560px] text-[15px] leading-7 text-ink-2">
            Full courses, written start to finish — every step in reading order, priced in
            kwacha when you&rsquo;re ready for more than the free step.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {COURSES.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="squircle group rounded-2xl border border-[rgba(30,30,29,0.10)] bg-white/70 p-5 transition-colors hover:bg-white"
              >
                <h3 className="font-display text-[18px] font-semibold text-ink">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-[13.5px] leading-6 text-muted">{c.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ---- footer: the links Google's review reads, and everyone else
                deserves ---- */}
        <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[rgba(30,30,29,0.10)] py-8 text-[13px] text-muted">
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
