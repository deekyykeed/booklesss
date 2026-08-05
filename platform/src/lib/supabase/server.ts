import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { authEnabled, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/auth";

/* ------------------------------------------------------------------ *
 * The server's view of who is signed in.
 *
 * This is what replaced Clerk's `auth()` on 2026-08-05. Same job, same three
 * call sites: the onboarding page's server gate, /api/profile and
 * /api/curriculum.
 *
 * `server-only` for the same reason supabase-admin has it — but note the
 * difference between the two files. This one uses the ANON key and reads the
 * caller's own session, so it is bound by RLS and can only ever see what that
 * student is allowed to see. `admin()` uses the service role and is bound by
 * nothing. Reach for this one by default; reach for admin() only where a route
 * has already established who the caller is and needs to write past RLS.
 * ------------------------------------------------------------------ */

/** A Supabase client carrying the caller's session, or null when unconfigured.
 *
 *  The cookie methods follow @supabase/ssr's contract: `getAll` always works,
 *  and `setAll` is allowed to throw. It throws in Server Components, where
 *  Next forbids writing cookies during render — and that is fine rather than
 *  broken, because `proxy.ts` has already refreshed the session for this
 *  request and written the fresh cookies onto the response. The catch is the
 *  documented shape, not a swallowed bug. */
export async function serverClient(): Promise<SupabaseClient | null> {
  if (!authEnabled) return null;
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          /* A Server Component render. proxy.ts already refreshed it. */
        }
      },
    },
  });
}

/**
 * The signed-in student, or null.
 *
 * `getUser()`, NEVER `getSession()`. This is the one rule of Supabase auth on a
 * server that is worth writing down: `getSession()` reads the JWT straight out
 * of the cookie and returns whatever it says, and a cookie is a thing the
 * browser hands us — it can be edited. `getUser()` calls the auth server and
 * has the token verified, which is the difference between "this request claims
 * to be Deeky" and "this request is Deeky".
 *
 * Everything downstream of this — the id written onto a `students` row, the
 * gate on /onboarding — is the answer to "whose data is this", so it has to be
 * the verified one. It costs a network hop per request; that is the price of
 * the guarantee, and it is why this is called once per route rather than
 * threaded through helpers that might each call it again.
 */
export async function currentUser(): Promise<User | null> {
  const sb = await serverClient();
  if (!sb) return null;
  const { data, error } = await sb.auth.getUser();
  return error ? null : data.user;
}

/** Just the id, for the routes that only need to know whose row to write.
 *  Mirrors the shape of Clerk's `const { userId } = await auth()` so the call
 *  sites read the same as they did. */
export async function currentUserId(): Promise<string | null> {
  return (await currentUser())?.id ?? null;
}
