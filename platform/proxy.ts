import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

const MARKETING_URL = 'https://booklesss.framer.ai'

function safeNext(value: string | null): string | null {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : null
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname, search } = request.nextUrl

  if (pathname === '/') {
    return NextResponse.redirect(
      user ? new URL('/steps', request.url) : new URL(MARKETING_URL)
    )
  }

  if (pathname.startsWith('/login') && user) {
    const next = safeNext(request.nextUrl.searchParams.get('next'))
    return NextResponse.redirect(new URL(next ?? '/steps', request.url))
  }

  // API routes return 401 JSON instead of redirecting — static step pages
  // read that to decide when to send the student to /login themselves.
  if (!pathname.startsWith('/login') && !pathname.startsWith('/api/') && !user) {
    // Preserve the deep link: a step URL shared in Slack must survive the
    // login roundtrip and land the student back on that exact step.
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
