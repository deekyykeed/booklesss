import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { openGraph, SITE_NAME } from "@/lib/site";
import { ToApp } from "@/components/landing/landing-bits";
import { Reveal } from "@/components/site/Reveal";

/* ------------------------------------------------------------------ *
 * The front door, rebuilt for the pivot (owner, 2026-09-29): "Booklesss is
 * now for general AI education to help people run their business with AI."
 *
 * The look is carried over from the video-hero site the owner specified the
 * same day (website/ at the repo root): a fullscreen looping film, glass
 * controls, Instrument Serif display type over Inter, a deep navy page. It is
 * scoped under `.site` in globals.css, like `.cui` is for /dashboard, so none
 * of its tokens reach the app and none of the app's reach it.
 *
 * WHAT THIS REPLACED: the one-screen student landing drawn in Framer
 * ("Booklesss RESERVE", 2026-08-06) — photo hero, trusted-faces row, member
 * count. It is in git; TrustedFaces and MemberCount went with it.
 *
 * STILL A SERVER COMPONENT, and still readable with no JavaScript: Google's
 * OAuth branding review rejected this app twice for a home page that did not
 * name the product, say what it does, or link the privacy policy without JS.
 * All three are in the static HTML now (the footer carries /privacy), which
 * is what turning Google sign-in back on was waiting for.
 *
 * ⚠️ NOTHING HERE STATES A FACT ABOUT THE BUSINESS THAT ISN'T TRUE: no price,
 * no learner count, no testimonials, no location claim. Add those only once
 * the owner has given the real ones.
 * ------------------------------------------------------------------ */

const DESCRIPTION =
  "Short, practical lessons that show business owners how to use AI on the work they already do.";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — AI for the business you already run` },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: openGraph({ title: SITE_NAME, description: DESCRIPTION, path: "/" }),
};

export const viewport: Viewport = { themeColor: "#002a43" };

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

/** Where every "start" button goes. One constant, because the destination is
 *  the open question: /sign-up today still runs the student onboarding
 *  (university, programme, year), which a shop owner has no answers to. */
const START_HREF = "/sign-up";

const NAV = [
  { label: "How it works", href: "#how" },
  { label: "What you'll learn", href: "#learn" },
  { label: "A lesson", href: "#lesson" },
  { label: "Questions", href: "#faq" },
];

const TOOLS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Microsoft Copilot",
  "Canva",
  "Google Sheets",
  "WhatsApp Business",
];

const STEPS = [
  {
    title: "Pick the job",
    body: "Start from the work, not the tool: pricing a quote, chasing an invoice, answering the same customer question for the fortieth time.",
  },
  {
    title: "Read one short step",
    body: "One idea, one worked example, about five minutes. Written for a phone, so it fits between customers.",
  },
  {
    title: "Try it on your own business",
    body: "Every step ends with something to do: a prompt to run on your own numbers, your own messages, your own stock list.",
  },
  {
    title: "Check the answer",
    body: "AI is confident and sometimes wrong. You learn what to verify, what never to paste in, and when to do it yourself.",
  },
];

/* Bento, not three equal columns: wide/narrow, then narrow/wide, then again,
 * so the eye zig-zags down the grid instead of reading a table. */
const TRACKS = [
  {
    kicker: "Sales & marketing",
    title: "Get noticed without hiring an agency",
    body: "Product descriptions, a week of social posts in one sitting, a price list customers can actually read, follow-ups that don't sound like a robot wrote them.",
    wide: true,
  },
  {
    kicker: "Money & admin",
    title: "Less time on paperwork",
    body: "Quotes, invoices, a cash-flow sheet from a pile of receipts, and a plain-English read of a contract before you sign it.",
  },
  {
    kicker: "Customer service",
    title: "Answer faster, in your voice",
    body: "WhatsApp replies, a list of answers to what everyone asks, and a calm first draft when a customer is angry.",
  },
  {
    kicker: "Your own assistant",
    title: "An AI that already knows your business",
    body: "Set one up with your prices, products and tone, so you stop explaining the business from scratch every time you open a chat.",
    wide: true,
  },
  {
    kicker: "Operations",
    title: "Run the week, not the chaos",
    body: "Stock lists, staff rosters, supplier emails, and step-by-step procedures a new hire can follow on day one.",
    wide: true,
  },
  {
    kicker: "Judgement",
    title: "Know when not to trust it",
    body: "What never to share, how to catch a made-up fact, and which answers a person should give.",
  },
];

const AUDIENCE = [
  {
    who: "Shop owners and traders",
    line: "Orders, stock and customers coming in on WhatsApp all day.",
  },
  {
    who: "Freelancers and consultants",
    line: "Proposals, invoices and follow-ups, done in the gaps between client work.",
  },
  {
    who: "Small teams",
    line: "A handful of people who each lose an hour a day to the same admin.",
  },
  {
    who: "Managers told to “use AI”",
    line: "With no one to show them where to start or what it is actually good for.",
  },
];

const FAQ = [
  {
    q: "Do I need to know anything about AI?",
    a: "No. The first steps assume you have never opened one. If you can send a WhatsApp message, you can do this.",
  },
  {
    q: "Do I have to pay for an AI tool?",
    a: "Most lessons work on the free versions of ChatGPT, Claude or Gemini. Where a paid feature genuinely helps, the lesson says so and shows the free way round it.",
  },
  {
    q: "Is it safe to put my business information into AI?",
    a: "Some of it. A whole lesson covers what never to paste in — customer ID numbers, passwords, bank details — and how to get the same result without it.",
  },
  {
    q: "How long does it take?",
    a: "Each step is about five minutes, and each one is useful on its own. Do one today and use it this afternoon.",
  },
  {
    q: "Can I learn on my phone?",
    a: "That is how it is built. Every lesson reads on a phone first, so it fits in a queue, on a bus or behind the counter.",
  },
];

const serif = "font-[family-name:var(--font-instrument)]";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="site-eyebrow">{children}</p>;
}

export default function Home() {
  return (
    <div className="site">
      <ToApp />

      {/* ---- hero ---------------------------------------------------- */}
      <header className="relative flex min-h-dvh flex-col overflow-hidden">
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />

        <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
          <Link href="/" className={`${serif} text-3xl tracking-tight text-[var(--s-fg)]`}>
            Booklesss
          </Link>
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="site-link text-sm">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <Link href={START_HREF} className="liquid-glass site-press rounded-full px-6 py-2.5 text-sm text-[var(--s-fg)]">
            Start learning
          </Link>
        </nav>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-16 pb-32 text-center">
          <p className="site-eyebrow animate-fade-rise">AI for the business you already run</p>
          <h1
            className={`${serif} animate-fade-rise mt-6 max-w-6xl text-5xl leading-[0.95] font-normal tracking-[-2.46px] text-[var(--s-fg)] sm:text-7xl md:text-8xl`}
          >
            Run your business <em className="not-italic text-[var(--s-muted)]">with AI,</em> not{" "}
            <em className="not-italic text-[var(--s-muted)]">around it.</em>
          </h1>
          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-[var(--s-muted)] sm:text-lg">
            Short, practical lessons that show owners and small teams how to use AI on real work —
            quotes, stock, customer messages, the books. Five minutes a step, on your phone. No
            coding, no jargon.
          </p>
          <div className="animate-fade-rise-delay-2 mt-12 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
            <Link
              href={START_HREF}
              className="liquid-glass site-press rounded-full px-14 py-5 text-base text-[var(--s-fg)]"
            >
              Start learning
            </Link>
            <a href="#lesson" className="site-link text-base">
              See a lesson first →
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ---- tools strip ------------------------------------------- */}
        <section aria-label="Tools covered" className="site-rule px-6 py-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 md:flex-row md:justify-between">
            <p className="text-sm text-[var(--s-muted)]">Works with tools you can open today</p>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {TOOLS.map((t) => (
                <li key={t} className={`${serif} text-xl text-[var(--s-fg)]/80`}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- statement --------------------------------------------- */}
        <section className="px-6 py-28 md:py-40">
          <Reveal className="mx-auto max-w-5xl">
            <p
              className={`${serif} text-4xl leading-[1.05] tracking-[-1px] text-[var(--s-fg)] sm:text-5xl md:text-6xl`}
            >
              Everyone says AI will change business.{" "}
              <em className="not-italic text-[var(--s-muted)]">
                Almost nobody shows you what to type on Monday morning.
              </em>
            </p>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-[var(--s-muted)]">
              Booklesss is that Monday morning. Every lesson starts from a job you already do, gives
              you the exact words to hand the AI, and tells you what to check before you trust the
              answer.
            </p>
          </Reveal>
        </section>

        {/* ---- how it works ------------------------------------------ */}
        <section id="how" className="site-rule scroll-mt-8 px-6 py-28 md:py-36">
          <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <Reveal className="md:sticky md:top-16 md:self-start">
              <Eyebrow>How it works</Eyebrow>
              <h2 className={`${serif} mt-5 text-4xl leading-[1] tracking-[-1px] sm:text-6xl`}>
                Learn it on a job, <em className="not-italic text-[var(--s-muted)]">not in theory.</em>
              </h2>
            </Reveal>
            <ol className="grid gap-4">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 80} className="site-panel rounded-3xl p-7 sm:p-9">
                  <div className="flex items-baseline gap-5">
                    <span className={`${serif} text-2xl text-[var(--s-muted)]`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-[var(--s-fg)]">{s.title}</h3>
                      <p className="mt-2 leading-relaxed text-[var(--s-muted)]">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- tracks ------------------------------------------------ */}
        <section id="learn" className="site-rule scroll-mt-8 px-6 py-28 md:py-36">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <Eyebrow>What you&apos;ll learn</Eyebrow>
              <h2 className={`${serif} mt-5 text-4xl leading-[1] tracking-[-1px] sm:text-6xl`}>
                Six parts of the business, <em className="not-italic text-[var(--s-muted)]">one skill.</em>
              </h2>
            </Reveal>
            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
              {TRACKS.map((t, i) => (
                <Reveal
                  key={t.kicker}
                  delay={(i % 2) * 80}
                  className={`site-panel flex min-w-0 flex-col justify-between rounded-3xl p-8 sm:p-10 ${
                    t.wide ? "md:col-span-2" : ""
                  }`}
                >
                  <p className="text-xs tracking-[0.18em] text-[var(--s-muted)] uppercase">{t.kicker}</p>
                  <div className="mt-12">
                    <h3 className={`${serif} text-3xl leading-[1.05] text-[var(--s-fg)] sm:text-4xl`}>
                      {t.title}
                    </h3>
                    <p className="mt-4 max-w-xl leading-relaxed text-[var(--s-muted)]">{t.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- a lesson ---------------------------------------------- */}
        <section id="lesson" className="site-rule scroll-mt-8 px-6 py-28 md:py-36">
          <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2 md:gap-20">
            <Reveal>
              <Eyebrow>A lesson, start to finish</Eyebrow>
              <h2 className={`${serif} mt-5 text-4xl leading-[1] tracking-[-1px] sm:text-6xl`}>
                A week of orders, <em className="not-italic text-[var(--s-muted)]">counted in a minute.</em>
              </h2>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-[var(--s-muted)]">
                This is the shape of every step: the mess you already have, the words to give the
                AI, what comes back, and the one check that tells you whether to trust it.
              </p>
              <Link href={START_HREF} className="site-link mt-10 inline-block text-base">
                Start with this one →
              </Link>
            </Reveal>

            <Reveal delay={120} className="site-panel rounded-[2rem] p-3">
              <div className="site-card rounded-[1.6rem] p-6 sm:p-8">
                <p className="text-xs tracking-[0.18em] text-[var(--s-muted)] uppercase">Step · Operations</p>
                <h3 className={`${serif} mt-3 text-3xl leading-[1.05] text-[var(--s-fg)]`}>
                  Turn a week of WhatsApp orders into a stock list
                </h3>

                <div className="mt-7 grid gap-5 text-[15px] leading-relaxed">
                  <div>
                    <p className="site-label">You paste in</p>
                    <div className="site-well mt-2 rounded-2xl p-4 text-[var(--s-fg)]/85">
                      <p>Mrs Banda: 2 × 25kg mealie meal, 1 × cooking oil 2L</p>
                      <p>Chola: sugar 2kg ×3 pls, and the oil</p>
                      <p>Mr Phiri: same as last week</p>
                      <p className="mt-1 text-[var(--s-muted)]">…and 21 more messages this week</p>
                    </div>
                  </div>
                  <div>
                    <p className="site-label">You ask</p>
                    <p className="mt-2 text-[var(--s-fg)]">
                      “List every product ordered this week with the total quantity of each, largest
                      first. Flag any order you can&apos;t read.”
                    </p>
                  </div>
                  <div>
                    <p className="site-label">You get</p>
                    <table className="mt-2 w-full text-left">
                      <tbody className="text-[var(--s-fg)]">
                        <tr className="site-row">
                          <td className="py-2">Mealie meal, 25kg</td>
                          <td className="py-2 text-right whitespace-nowrap">14 bags</td>
                        </tr>
                        <tr className="site-row">
                          <td className="py-2">Cooking oil, 2L</td>
                          <td className="py-2 text-right whitespace-nowrap">9</td>
                        </tr>
                        <tr className="site-row">
                          <td className="py-2">Sugar, 2kg</td>
                          <td className="py-2 text-right whitespace-nowrap">6</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-2 text-[var(--s-muted)]">
                      1 unclear — “same as last week” (Mr Phiri)
                    </p>
                  </div>
                  <div className="site-well rounded-2xl p-4">
                    <p className="site-label">Check before you trust it</p>
                    <p className="mt-1 text-[var(--s-fg)]">
                      Add up one product yourself. If it matches, the rest usually does.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- who it's for ------------------------------------------ */}
        <section className="site-rule px-6 py-28 md:py-36">
          <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <Reveal>
              <Eyebrow>Who it&apos;s for</Eyebrow>
              <h2 className={`${serif} mt-5 text-4xl leading-[1] tracking-[-1px] sm:text-6xl`}>
                People who run things, <em className="not-italic text-[var(--s-muted)]">not people who code.</em>
              </h2>
            </Reveal>
            <ul>
              {AUDIENCE.map((a, i) => (
                <Reveal as="li" key={a.who} delay={i * 60} className="site-row py-7 first:pt-0">
                  <p className={`${serif} text-3xl text-[var(--s-fg)]`}>{a.who}</p>
                  <p className="mt-2 leading-relaxed text-[var(--s-muted)]">{a.line}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- FAQ --------------------------------------------------- */}
        <section id="faq" className="site-rule scroll-mt-8 px-6 py-28 md:py-36">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Eyebrow>Questions</Eyebrow>
              <h2 className={`${serif} mt-5 text-4xl leading-[1] tracking-[-1px] sm:text-6xl`}>
                Before you start.
              </h2>
            </Reveal>
            <div className="mt-12">
              {FAQ.map((f) => (
                <details key={f.q} className="site-faq site-row group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg text-[var(--s-fg)]">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-2xl leading-none text-[var(--s-muted)] transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="-mt-2 pb-7 leading-relaxed text-[var(--s-muted)]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---- closing CTA ------------------------------------------- */}
        <section className="site-rule px-6 py-32 text-center md:py-44">
          <Reveal className="mx-auto flex max-w-4xl flex-col items-center">
            <h2
              className={`${serif} text-5xl leading-[0.95] tracking-[-2px] text-[var(--s-fg)] sm:text-7xl md:text-8xl`}
            >
              Monday morning, <em className="not-italic text-[var(--s-muted)]">sorted.</em>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--s-muted)]">
              Pick one job you did by hand last week. By the end of the first step, you&apos;ll
              have done it with AI.
            </p>
            <Link
              href={START_HREF}
              className="liquid-glass site-press mt-12 rounded-full px-14 py-5 text-base text-[var(--s-fg)]"
            >
              Start learning
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="site-rule px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm text-[var(--s-muted)] md:flex-row">
          <p>
            <span className={`${serif} mr-3 text-xl text-[var(--s-fg)]`}>Booklesss</span>
            Practical AI lessons for people who run businesses.
          </p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href="/privacy" className="site-link">
              Privacy
            </Link>
            <Link href="/terms" className="site-link">
              Terms
            </Link>
            <Link href="/sign-in" className="site-link">
              Sign in
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
