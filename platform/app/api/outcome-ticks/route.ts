import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Which outcome checkboxes ("What you should now be able to do") a student
// has ticked, per step. Stored as an array of outcome indices. Same-origin
// fetches from the static step pages (platform/public/steps/*) carry the
// Supabase session cookie, so the pages authenticate through this route
// without holding any keys themselves — mirrors /api/step-feedback.

const STEP_SLUG = /^[a-z0-9-]{1,64}$/
const MAX_TICKS = 40 // no step has this many outcomes; a sane upper bound

// Supabase may be unconfigured (no env vars). Without this guard
// createClient() throws and every step page 500s, since the static pages
// call GET on load.
const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Coerce untrusted input into a clean, de-duped, sorted array of small
// non-negative integers — or null if it isn't shaped like that.
function cleanTicks(raw: unknown): number[] | null {
  if (!Array.isArray(raw)) return null
  const out: number[] = []
  for (const v of raw) {
    const n = Number(v)
    if (!Number.isInteger(n) || n < 0 || n > 255) return null
    if (!out.includes(n)) out.push(n)
  }
  if (out.length > MAX_TICKS) return null
  return out.sort((a, b) => a - b)
}

export async function GET(request: NextRequest) {
  const step = request.nextUrl.searchParams.get('step') ?? ''
  if (!STEP_SLUG.test(step)) {
    return NextResponse.json({ error: 'invalid step' }, { status: 400 })
  }

  if (!supabaseConfigured) {
    return NextResponse.json({ authenticated: false })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ authenticated: false })
  }

  const { data, error } = await supabase
    .from('outcome_ticks')
    .select('ticked')
    .eq('user_id', user.id)
    .eq('step_slug', step)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'lookup failed' }, { status: 500 })
  }

  return NextResponse.json({ authenticated: true, ticked: data?.ticked ?? [] })
}

export async function POST(request: NextRequest) {
  if (!supabaseConfigured) {
    return NextResponse.json({ error: 'ticks unavailable' }, { status: 503 })
  }

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

  const ticked = cleanTicks(body?.ticked)
  if (ticked === null) {
    return NextResponse.json({ error: 'invalid ticks' }, { status: 400 })
  }

  const { error } = await supabase.from('outcome_ticks').upsert(
    {
      user_id: user.id,
      step_slug: step,
      ticked,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,step_slug' }
  )

  if (error) {
    return NextResponse.json({ error: 'save failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
