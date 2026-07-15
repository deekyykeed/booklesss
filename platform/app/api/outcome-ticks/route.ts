import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

// Which outcome checkboxes ("What you should now be able to do") a student has
// ticked, per step, stored as an array of outcome indices. Identity comes from
// Clerk (auth().userId); the Supabase client carries the Clerk token so RLS
// keys rows to that user. Mirrors /api/step-feedback.

const STEP_SLUG = /^[a-z0-9-]{1,64}$/
const MAX_TICKS = 40 // no step has this many outcomes; a sane upper bound

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
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

  if (!configured) {
    return NextResponse.json({ authenticated: false })
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ authenticated: false })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('outcome_ticks')
    .select('ticked')
    .eq('user_id', userId)
    .eq('step_slug', step)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'lookup failed' }, { status: 500 })
  }

  return NextResponse.json({ authenticated: true, ticked: data?.ticked ?? [] })
}

export async function POST(request: NextRequest) {
  if (!configured) {
    return NextResponse.json({ error: 'ticks unavailable' }, { status: 503 })
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

  const ticked = cleanTicks(body?.ticked)
  if (ticked === null) {
    return NextResponse.json({ error: 'invalid ticks' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('outcome_ticks').upsert(
    {
      user_id: userId,
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
