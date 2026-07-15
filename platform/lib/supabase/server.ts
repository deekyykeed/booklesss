import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

// Supabase data client authenticated as the current Clerk user.
//
// Clerk is configured as a Supabase third-party auth provider, so Supabase
// accepts the Clerk session token and RLS reads the Clerk user id from the
// JWT `sub` claim (policies use `auth.jwt()->>'sub'`). No Supabase auth
// cookies — Clerk owns identity; Supabase only stores per-student data.
//
// If the Clerk instance exposes the integration via a named JWT template
// (the older setup) rather than the native one, set CLERK_SUPABASE_JWT_TEMPLATE
// and it is passed to getToken().
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        try {
          const { getToken } = await auth()
          const template = process.env.CLERK_SUPABASE_JWT_TEMPLATE
          return (template ? await getToken({ template }) : await getToken()) ?? null
        } catch {
          // Clerk unconfigured (fail-soft deploy) — query as anon; RLS then
          // only exposes public rows.
          return null
        }
      },
    }
  )
}
