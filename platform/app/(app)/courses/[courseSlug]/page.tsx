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
            margin: 0,
          }}
        >
          {course.name}
        </h1>
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
            type Step = { id: string; slug: string; title: string; order_index: number }
            const steps: Step[] = Array.isArray(lesson.steps) ? lesson.steps : []
            const sorted = [...steps].sort((a, b) => a.order_index - b.order_index)

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
                      borderLeft: `4px solid ${course.accent_color}`,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-parastoo)',
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#0F1F35',
                          marginBottom: 2,
                        }}
                      >
                        {lesson.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        {sorted.length} step{sorted.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <span style={{ color: course.accent_color, fontWeight: 700, fontSize: 14 }}>→</span>
                  </div>
                </Link>

                {sorted.length > 0 && (
                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '8px 0' }}>
                    {sorted.map((step) => (
                      <Link
                        key={step.id}
                        href={`/courses/${courseSlug}/${lesson.slug}?step=${step.slug}`}
                        style={{
                          display: 'block',
                          padding: '5px 18px 5px 40px',
                          fontSize: 12,
                          color: '#6b7280',
                          textDecoration: 'none',
                        }}
                      >
                        · {step.title}
                      </Link>
                    ))}
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
