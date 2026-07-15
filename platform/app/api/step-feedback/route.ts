import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

// Rating + completion state for static step pages (platform/public/steps/*).
// Identity comes from Clerk (auth().userId); the Supabase client carries the
// Clerk token so RLS keys rows to that user. Static pages authenticate through
// this route via the same-origin Clerk session cookie.

const STEP_SLUG = /^[a-z0-9-]{1,64}$/

// Needs both Clerk (identity) and Supabase (storage). Without them the route
// fail-softs so the static pages, which call GET on load, never 500.
const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
)

export async function GET(request: NextRequest) {
  const step = request.nextUrl.searchParams.get('step') ?? ''
  if (!STEP_SLUG.test(step)) {
    return NextResponse.json({ error: 'invalid step' }, { status: 400 })
  }

  if (!configured) {
    return NextResponse.json({ authenticated: false })
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ authenticated: false })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('step_feedback')
    .select('rating, completed')
    .eq('user_id', userId)
    .eq('step_slug', step)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'lookup failed' }, { status: 500 })
  }

  return NextResponse.json({
    authenticated: true,
    rating: data?.rating ?? 0,
    completed: data?.completed ?? false,
  })
}

export async function POST(request: NextRequest) {
  if (!configured) {
    return NextResponse.json({ error: 'feedback unavailable' }, { status: 503 })
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const step = typeof body?.step === 'string' ? body.step : ''
  if (!STEP_SLUG.test(step)) {
    return NextResponse.json({ error: 'invalid step' }, { status: 400 })
  }

  const rating = body.rating == null ? null : Number(body.rating)
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: 'invalid rating' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('step_feedback').upsert(
    {
      user_id: userId,
      step_slug: step,
      rating,
      completed: Boolean(body.completed),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,step_slug' }
  )

  if (error) {
    return NextResponse.json({ error: 'save failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
