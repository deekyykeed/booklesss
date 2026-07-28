/* Whether Clerk is configured for this environment.
 *
 * The reader is a static site that has always worked signed-out, and it must
 * keep working when nobody has set keys yet — a fresh clone, a preview build,
 * or CI. So every Clerk touchpoint is gated on this flag: no key, no provider,
 * no middleware, no auth UI, and the app falls back to exactly the behaviour
 * it had before Clerk existed.
 *
 * NEXT_PUBLIC_* is inlined at build time, so this is safe to read from both
 * server and client components. */
export const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const SIGN_IN_URL = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
export const SIGN_UP_URL = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up";
