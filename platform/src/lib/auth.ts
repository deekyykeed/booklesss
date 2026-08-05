/* Whether accounts are configured for this environment.
 *
 * The reader is a static site that has always worked signed-out, and it must
 * keep working when nobody has set keys yet — a fresh clone, a preview build,
 * or CI. So every auth touchpoint is gated on this flag: no keys, no provider,
 * no session refresh, no auth UI, and the app falls back to exactly the
 * behaviour it had before accounts existed.
 *
 * This replaced `lib/clerk.ts` on 2026-08-05 and keeps its exact contract, so
 * that every `clerkEnabled &&` guard in the app became `authEnabled &&` and
 * nothing else about those files had to change.
 *
 * WHY BOTH KEYS. Clerk needed only a publishable key here because its secret
 * was middleware's business. Supabase's anon key is the whole client — it is
 * what signs a student in AND what reads their row back under RLS — so a build
 * carrying a URL and no key is not a half-configured app, it is one that would
 * throw on the first `createBrowserClient`.
 *
 * NEXT_PUBLIC_* is inlined at build time, so this is safe to read from both
 * server and client components. */
export const authEnabled =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* Where the standalone auth pages live. Both still exist — a link in an email,
 * a bookmark, a student typing it — but they are no longer the main way in:
 * every gate calls `requireAccount()` and gets the sheet over the page they
 * were already on (components/auth/AuthGate). See lib/onboarding. */
export const SIGN_IN_URL = "/sign-in";
export const SIGN_UP_URL = "/sign-up";

/* The key pair, read once. Exported rather than re-read at each call site so
 * that a missing key is a single obvious failure rather than four different
 * ones, and so `authEnabled` and the clients can never disagree about what
 * "configured" means. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
