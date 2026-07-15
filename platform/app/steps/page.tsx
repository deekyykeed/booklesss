import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/profile-card'

// Signed-in index of published steps, read from the database (public.steps),
// with each student's own progress (student_progress view — RLS scopes it to
// their rows). Slack is the primary router — this page exists so `/` has
// somewhere to land and students can bookmark it. Internal (ops) steps never
// appear here; the owner opens them by direct link.

export const dynamic = 'force-dynamic'

type StepRow = {
  slug: string
  title: string
  eyebrow: string | null
  course_chip: string | null
  minutes: number | null
  outcomes: unknown[]
}

type ProgressRow = {
  step_slug: string
  completed: boolean
  outcomes_ticked: number
}

export default async function StepsIndex() {
  let steps: StepRow[] = []
  const progress = new Map<string, ProgressRow>()
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('steps')
      .select('slug, title, eyebrow, course_chip, minutes, outcomes')
      .eq('status', 'published')
      .neq('access', 'internal')
      .order('slug')
    steps = (data as StepRow[]) ?? []

    const { data: prog } = await supabase
      .from('student_progress')
      .select('step_slug, completed, outcomes_ticked')
    for (const p of (prog as ProgressRow[]) ?? []) progress.set(p.step_slug, p)
  } catch {
    // Supabase unconfigured — render the empty state rather than 500.
  }

  const courseName = (s: StepRow) =>
    (s.eyebrow ?? '').split('·')[0].trim() || s.course_chip || 'Course'
  const courses = [...new Set(steps.map(courseName))]

  const chip = (s: StepRow) => {
    const p = progress.get(s.slug)
    const total = Array.isArray(s.outcomes) ? s.outcomes.length : 0
    if (p?.completed) return { text: '✓ Completed', color: '#0E5F4C' }
    if (p && p.outcomes_ticked > 0 && total > 0)
      return { text: `${Math.min(p.outcomes_ticked, total)}/${total} outcomes`, color: '#c5613f' }
    return s.minutes != null ? { text: `~${s.minutes} min`, color: '#94A3B8' } : null
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 96px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/booklesss-mark-black.png" alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
        <span style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 22, color: '#0F1F35' }}>
          Booklesss
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 30, color: '#121212', margin: '0 0 6px' }}>
        Your steps
      </h1>
      <p style={{ color: '#71717A', fontSize: 15, margin: '0 0 28px' }}>
        Every step posted in your Slack channels lives here too.
      </p>

      <ProfileCard />

      {steps.length === 0 && (
        <p style={{ color: '#94A3B8', fontSize: 14 }}>
          No steps published yet — check back soon.
        </p>
      )}

      {courses.map((course) => (
        <section key={course} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c5613f', margin: '0 0 12px' }}>
            {course}
          </h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {steps.filter((s) => courseName(s) === course).map((s) => {
              const c = chip(s)
              return (
                <a
                  key={s.slug}
                  href={`/steps/${s.slug}`}
                  style={{
                    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16,
                    padding: '14px 18px', background: '#f0efeb',
                    border: '1px solid #e8e8e8', borderRadius: 16,
                    textDecoration: 'none', color: '#121212',
                  }}
                >
                  <span>
                    <span style={{ display: 'block', fontSize: 11, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                      {s.eyebrow}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</span>
                  </span>
                  {c && (
                    <span style={{ fontSize: 12, color: c.color, whiteSpace: 'nowrap', fontWeight: c.color === '#94A3B8' ? 400 : 700 }}>
                      {c.text}
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
