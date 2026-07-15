import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

// Step gate, Clerk edition. Every step requires a Clerk session; signed-out
// visitors are sent to the sign-in page (Clerk appends a return URL, so a
// Slack link resumes on that exact step after auth). Root '/' → '/steps'.
//
// Next 16 `proxy` convention (formerly `middleware`). The matcher covers the
// static public/steps/*.html too.
//
// Fail-soft: with no Clerk keys the gate degrades to just the root redirect,
// so an unconfigured deploy keeps serving steps rather than 500ing — the same
// contract the Supabase gate had.
const hasClerk = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
)

const isStep = createRouteMatcher(['/steps', '/steps/(.*)'])

function rootRedirect(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/steps', request.url))
  }
  return null
}

export default hasClerk
  ? clerkMiddleware(async (auth, request) => {
      const root = rootRedirect(request)
      if (root) return root
      if (isStep(request)) await auth.protect()
    })
  : function proxy(request: NextRequest) {
      return rootRedirect(request) ?? NextResponse.next({ request })
    }

export const config = {
  // Root redirect + step index + every step page (incl. static
  // public/steps/*.html) + API routes (so Clerk auth() has context there).
  matcher: ['/', '/steps', '/steps/:path*', '/api/:path*'],
}
