import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

/* `noindex`, like /sign-in and /reset-password: a 404 is not a page anyone
 * should reach from a search, and letting one be indexed is how a dead URL
 * outlives the thing it pointed at. */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ *
 * The 404, and a way out of it.
 *
 * THERE WAS NO not-found.tsx UNTIL 2026-08-10, so every miss fell through to
 * Next's built-in page: "404 | This page could not be found." on a white
 * screen, in a system font, with no link anywhere on it. A dead end in the
 * literal sense — the only exits were the back button and the URL bar (owner:
 * "offer to go to home instead of just staying there").
 *
 * WHO ACTUALLY LANDS HERE, which is what the copy is written for. Not people
 * typing URLs by hand. It is `notFound()` from `(reader)/[...slug]` and
 * `(dashboard)/[course]` — a STEP OR COURSE LINK THAT NO LONGER RESOLVES. Slugs
 * are authored in each step's `.mjs` and a step can move between lessons, so a
 * link shared in a WhatsApp group in March can miss in August. That reader did
 * nothing wrong and is one tap from what they wanted, so the page says so
 * plainly rather than implying they mistyped something.
 *
 * BOTH LINKS ARE LOOP-SAFE, and that is worth checking before adding a third.
 * `/` and `/dashboard` redirect at each other by design — `ToApp` sends a
 * signed-in student off the landing page, `RequireAccount` sends a signed-out
 * one off the dashboard — so each of these self-corrects for whoever taps it:
 * signed out, "my courses" lands on the front door; signed in, "home" lands on
 * the dashboard. Neither can bounce, because each redirect's condition is the
 * other's complement (see the note in landing-bits.tsx, which cost a lost tab
 * to learn). A LINK ADDED HERE MUST BE CHECKED AGAINST BOTH.
 *
 * A SERVER COMPONENT, deliberately. It could read the session and offer one
 * button instead of two, but that would make the app's error page depend on
 * auth resolving — and the moment most likely to produce a 404 is the moment
 * something is already not working. Two static links always render.
 * ------------------------------------------------------------------ */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-3 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
        We can&rsquo;t find that page
      </h1>
      <p className="text-[15px] leading-relaxed text-ink-2">
        The link may be out of date, or the step may have moved. Nothing you&rsquo;ve read or
        saved is affected.
      </p>

      {/* The primary is the app, not the front door: a miss here is usually a
          stale step link, and the person who followed it wants their courses
          rather than the pitch. */}
      <div className="mt-5 flex flex-col gap-3">
        <Button href="/dashboard" variant="primary" size="lg" block arrow>
          Go to my courses
        </Button>
        <Button href="/" variant="secondary" size="lg" block>
          Booklesss home
        </Button>
      </div>
    </main>
  );
}
