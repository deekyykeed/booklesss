import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

// Signup metadata (university, year) — one row per student, Clerk-keyed.
// Same fail-soft contract as the other data routes.

const UNIVERSITIES = ['ZCAS', 'UNZA'] as const

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
)

export async function GET() {
  if (!configured) return NextResponse.json({ authenticated: false })
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ authenticated: false })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, university, year_of_study')
    .eq('id', userId)
    .maybeSingle()
  if (error) return NextResponse.json({ error: 'lookup failed' }, { status: 500 })
  return NextResponse.json({ authenticated: true, profile: data ?? null })
}

export async function POST(request: NextRequest) {
  if (!configured) return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const university =
    typeof body?.university === 'string' &&
    (UNIVERSITIES as readonly string[]).includes(body.university)
      ? body.university
      : null
  const year = body?.year_of_study == null ? null : Number(body.year_of_study)
  if (year !== null && (!Number.isInteger(year) || year < 1 || year > 7)) {
    return NextResponse.json({ error: 'invalid year' }, { status: 400 })
  }
  const displayName =
    typeof body?.display_name === 'string' && body.display_name.trim()
      ? body.display_name.trim().slice(0, 80)
      : null

  const supabase = await createClient()
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      ...(displayName !== null && { display_name: displayName }),
      ...(university !== null && { university }),
      ...(year !== null && { year_of_study: year }),
    },
    { onConflict: 'id' }
  )
  if (error) return NextResponse.json({ error: 'save failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
