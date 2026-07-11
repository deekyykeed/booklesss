import { NextResponse, type NextRequest } from 'next/server'

// Login gate removed (2026-07-12): steps are public unlisted links and Slack
// membership is the paywall. The auth pages, /api/step-feedback, and the
// Supabase schema stay in place, dormant — to re-enable the gate, restore the
// session check + redirect here (see git history) and point the Supabase env
// vars at a live project.
//
// The bare domain lands on the steps index (the app). Marketing lives on its
// own domain (booklesss.framer.ai) — swap the target below to point the root
// back there if that's ever wanted again.

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/steps', request.url))
  }
  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/'],
}
