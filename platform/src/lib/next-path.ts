/* ------------------------------------------------------------------ *
 * Where to go back to — carried in `?next=`, and never trusted.
 *
 * Onboarding is a PAGE, not an overlay (owner, 2026-08-06), so a student who
 * is sent there has left whatever they were doing. The return trip is what
 * makes that acceptable: finish the questions and you are put back on the page
 * you came from, at the paragraph you were reading — reader/LessonReader saves
 * and restores the scroll offset per lesson, so landing on the right path is
 * the whole of it.
 *
 * A REDIRECT TARGET FROM A URL IS STRANGER INPUT. `?next=` sits in a link
 * anyone can write, and a redirect that honours whatever it finds there is an
 * open redirect — the classic phishing primitive, where booklesss.app/... is
 * the domain a student checks and somebody else's login page is what they get.
 * Cheap to prevent, easy to leave out, so it lives in one function that both
 * the sender and the receiver use.
 *
 * WHAT SURVIVES: a path on this site. One leading slash, no scheme, no host,
 * and not `/onboarding` itself — which would be a loop rather than an exit.
 * Everything else falls back to the dashboard, because a student who has just
 * answered ten questions must land somewhere real whatever the URL said.
 * ------------------------------------------------------------------ */

/** Where a student goes when there is no honest origin to return to. */
export const DEFAULT_NEXT = "/dashboard";

/** A path is a URL's worth of characters at most; anything longer is not a
 *  route on this site, it is somebody probing. */
const MAX = 512;

/**
 * A same-origin path, or the dashboard.
 *
 * The `//` and `/\` checks are the ones worth spelling out: both are read by
 * browsers as protocol-relative URLs, so `//evil.example` is a different SITE
 * despite passing a naive "starts with /" test. Backslash because browsers
 * normalise it to a forward slash before resolving.
 */
export function safeNext(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return DEFAULT_NEXT;
  const v = raw.trim();
  if (!v || v.length > MAX) return DEFAULT_NEXT;
  if (!v.startsWith("/")) return DEFAULT_NEXT;
  if (v.startsWith("//") || v.startsWith("/\\")) return DEFAULT_NEXT;
  // A control character can smuggle a newline into a Location header. Written
  // as a charCode test rather than a regex on purpose: a control-character
  // class written as a regex literal puts real control BYTES in this file,
  // which makes it a binary blob to grep and to every diff that reads it.
  if (v.split("").some((c) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) === 0x7f)) {
    return DEFAULT_NEXT;
  }
  // Coming back to the questions is not an exit from them.
  if (v === "/onboarding" || v.startsWith("/onboarding?") || v.startsWith("/onboarding/")) {
    return DEFAULT_NEXT;
  }
  return v;
}

/**
 * The page to come back to, built from where the caller is standing now.
 *
 * Reads `window.location` rather than taking `usePathname()`, so that callers
 * can use it inside an effect or a click handler without pulling
 * `useSearchParams` into a component — that hook forces a Suspense boundary on
 * any page Next still wants to prerender, which is every reader page.
 *
 * The HASH IS KEPT. On a step it is the section anchor, which is a finer
 * answer to "where were you" than the path alone, and scroll-to-section runs
 * ahead of the saved offset in LessonReader.
 */
export function currentPath(): string {
  if (typeof window === "undefined") return DEFAULT_NEXT;
  const { pathname, search, hash } = window.location;
  return safeNext(pathname + search + hash);
}

/** `/onboarding?next=…`, pointing back at wherever the caller is now. */
export function onboardingHref(from: string = currentPath()): string {
  const next = safeNext(from);
  return next === DEFAULT_NEXT ? "/onboarding" : `/onboarding?next=${encodeURIComponent(next)}`;
}

/** What `finish()` reads on the way out — the validated `?next=`, or the
 *  dashboard. Called from a click handler, so `window` is there. */
export function nextFromQuery(): string {
  if (typeof window === "undefined") return DEFAULT_NEXT;
  return safeNext(new URLSearchParams(window.location.search).get("next"));
}
