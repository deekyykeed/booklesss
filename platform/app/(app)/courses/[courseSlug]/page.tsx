import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CourseOverviewPage(props: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('courses')
    .select('id, slug, name, school, accent_color, cover_color')
    .eq('slug', courseSlug)
    .single()

  if (!course) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, slug, title, order_index, steps(id, slug, title, order_index)')
    .eq('course_id', course.id)
    .order('order_index')

  type Step = { id: string; slug: string; title: string; order_index: number }
  const allStepIds: string[] = (lessons ?? []).flatMap((l) => {
    const steps: Step[] = Array.isArray(l.steps) ? l.steps : []
    return steps.map((s) => s.id)
  })

  let completedSet = new Set<string>()
  if (allStepIds.length > 0) {
    const { data: completions } = await supabase
      .from('step_completions')
      .select('step_id')
      .eq('user_id', user.id)
      .in('step_id', allStepIds)
    completedSet = new Set((completions ?? []).map((c: { step_id: string }) => c.step_id))
  }

  const totalSteps = allStepIds.length
  const completedCount = completedSet.size
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 0 60px' }}>
      {/* Cover */}
      <div
        style={{
          background: course.cover_color,
          padding: '36px 48px 30px',
          borderBottom: `3px solid ${course.accent_color}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: course.accent_color,
            textTransform: 'uppercase',
            marginBottom: 6,
            fontFamily: 'var(--font-parastoo)',
          }}
        >
          {course.school}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-parastoo)',
            fontSize: 26,
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 20px',
          }}
        >
          {course.name}
        </h1>

        {/* Progress bar */}
        {totalSteps > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-poppins)' }}>
                Progress
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-poppins)' }}>
                {completedCount} / {totalSteps} steps
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  background: course.accent_color,
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lesson list */}
      <div style={{ padding: '32px 48px' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#9ca3af',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Lessons
        </div>

        {(lessons ?? []).length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: 14 }}>No lessons yet — check back soon.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(lessons ?? []).map((lesson) => {
            const steps: Step[] = Array.isArray(lesson.steps) ? lesson.steps : []
            const sorted = [...steps].sort((a, b) => a.order_index - b.order_index)
            const lessonCompleted = sorted.filter((s) => completedSet.has(s.id)).length
            const lessonTotal = sorted.length

            return (
              <div
                key={lesson.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <Link
                  href={`/courses/${courseSlug}/${lesson.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-parastoo)',
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#0F1F35',
                          marginBottom: 3,
                        }}
                      >
                        {lesson.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>
                          {lessonTotal} step{lessonTotal !== 1 ? 's' : ''}
                        </div>
                        {lessonTotal > 0 && (
                          <>
                            <span style={{ color: '#e5e7eb' }}>·</span>
                            <div style={{ fontSize: 12, color: lessonCompleted === lessonTotal ? '#16a34a' : '#9ca3af', fontWeight: lessonCompleted > 0 ? 600 : 400 }}>
                              {lessonCompleted === lessonTotal ? '✓ Complete' : `${lessonCompleted}/${lessonTotal} done`}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <span style={{ color: course.accent_color, fontWeight: 700, fontSize: 14 }}>→</span>
                  </div>
                </Link>

                {sorted.length > 0 && (
                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '8px 0' }}>
                    {sorted.map((step) => {
                      const done = completedSet.has(step.id)
                      return (
                        <Link
                          key={step.id}
                          href={`/courses/${courseSlug}/${lesson.slug}?step=${step.slug}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '5px 18px 5px 24px',
                            fontSize: 12,
                            color: '#6b7280',
                            textDecoration: 'none',
                          }}
                        >
                          <span style={{ color: done ? '#16a34a' : '#d1d5db', fontSize: 13, flexShrink: 0 }}>
                            {done ? '✓' : '○'}
                          </span>
                          <span style={{ color: done ? '#374151' : '#6b7280' }}>{step.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
