import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Login gate (re-enabled 2026-07-15): every step now requires a Supabase
// session. A visitor without one is redirected to the sign-in page with a
// ?next back to the step they opened, so a Slack link resumes on that exact
// step after they authenticate. (The gate was removed 2026-07-12 when steps
// were public + Slack membership was the paywall; this restores it.)
//
// Next 16: this is the `proxy` convention (formerly `middleware`), Node.js
// runtime. The matcher covers public/ assets, so it also gates the static
// step HTML in public/steps/*.
//
// Fail-soft: until the Supabase env vars are set, gating is a no-op. We must
// never take the live steps offline just because auth isn't configured yet —
// the same reason /api/step-feedback fail-softs.
const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bare domain → steps index (marketing lives on booklesss.framer.ai).
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/steps', request.url))
  }

  // Gate the step surfaces. No-op until Supabase is configured.
  if (!supabaseConfigured) return NextResponse.next({ request })

  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('next', pathname + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Root redirect + the step index + every step page (incl. static
  // public/steps/*.html, which the matcher also covers).
  matcher: ['/', '/steps', '/steps/:path*'],
}
