import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Rating + completion state for static step pages (platform/public/steps/*).
// Same-origin fetches carry the Supabase session cookie, so the static pages
// authenticate through this route without holding any keys themselves.

const STEP_SLUG = /^[a-z0-9-]{1,64}$/

export async function GET(request: NextRequest) {
  const step = request.nextUrl.searchParams.get('step') ?? ''
  if (!STEP_SLUG.test(step)) {
    return NextResponse.json({ error: 'invalid step' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ authenticated: false })
  }

  const { data, error } = await supabase
    .from('step_feedback')
    .select('rating, completed')
    .eq('user_id', user.id)
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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
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

  const { error } = await supabase.from('step_feedback').upsert(
    {
      user_id: user.id,
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
