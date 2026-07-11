import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    return NextResponse.redirect(new URL(user ? '/dashboard' : '/login', request.url))
  }

  if (pathname.startsWith('/login') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // API routes return 401 JSON instead of redirecting — static step pages
  // read that to decide when to send the student to /login themselves.
  if (!pathname.startsWith('/login') && !pathname.startsWith('/api/') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|steps/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
