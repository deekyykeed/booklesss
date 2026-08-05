import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authEnabled, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/auth";

/* ------------------------------------------------------------------ *
 * Keeping the session alive for the server.
 *
 * A Supabase access token expires in an hour, and the browser client refreshes
 * itself on a timer — but a Server Component CANNOT WRITE COOKIES, so a student
 * who arrives with an expired token and hits a server-rendered page has no way
 * to get a fresh one before that page renders. This runs first, refreshes the
 * token, and writes the new cookies onto the response.
 *
 * This is `proxy.ts`, not `middleware.ts` — Next 16 renamed the convention and
 * warns on the old name. Supabase's docs still say middleware; the file name is
 * the only difference, since both conventions want one exported handler.
 *
 * NOTHING IS GATED HERE, and that is deliberate — see session 44's dead end.
 * Clerk's `createRouteMatcher` was tried in middleware and abandoned: their own
 * guidance is now "protect access as close to the resource as possible", and
 * the same argument applies to us. `/onboarding` checks the session in its own
 * page, the API routes check it in their own handlers, and this file's only job
 * is to make sure the session those checks read is not stale.
 *
 * THE MATCHER IS NARROW ON PURPOSE. The obvious matcher — everything except
 * static files — is what Supabase's quickstart ships, and it would put a
 * round-trip to the auth server in front of every step page in the reader.
 * Those pages are static, work signed-out, and are the ones a student on a
 * Zambian connection opens twenty times a day; paying an auth hop for each is
 * the single most expensive thing this file could do. So it runs only where a
 * server actually reads the session: the dashboard and its neighbours, the
 * onboarding gate, and the API routes.
 *
 * If a new route starts calling `currentUser()`, ADD IT TO THE MATCHER. The
 * failure mode of forgetting is subtle and slow to find — that route works for
 * the first hour of a session and then starts seeing a signed-out student.
 * ------------------------------------------------------------------ */

export async function proxy(request: NextRequest) {
  /* Unconfigured builds get a pass-through, so the reader behaves exactly as it
     did before accounts existed. Same no-op the old Clerk proxy made. */
  if (!authEnabled) return NextResponse.next();

  /* The response has to be built BEFORE the client, and rebuilt whenever
     cookies are written, because @supabase/ssr's contract is that refreshed
     cookies go onto both the request (so anything later in THIS pass sees the
     new session) and the response (so the browser stores it). Returning a
     different response object than the one the cookies were written to is the
     classic silent failure here: the refresh succeeds, nothing persists, and
     the student is signed out again on the next request. */
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  /* `getUser()` and not `getSession()`: verifying the token with the auth
     server is what actually triggers the refresh, and it is the same rule
     lib/supabase/server documents for every other server read. The result is
     deliberately discarded — this file decides nothing, it only refreshes. */
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/settings/:path*",
    "/workspace/:path*",
    "/api/:path*",
  ],
};
