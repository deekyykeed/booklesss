import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ExamsPage(props: { params: Promise<{ courseSlug: string }> }) {
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

  const { data: exams } = await supabase
    .from('exams')
    .select('id, title, year, session, pdf_url')
    .eq('course_id', course.id)
    .order('year', { ascending: false })

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
          {course.name} — Past Papers
        </h1>
        <Link
          href={`/courses/${courseSlug}`}
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
        >
          ← Back to course
        </Link>
      </div>

      {/* Exam list */}
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
          Exam Papers
        </div>

        {(exams ?? []).length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: 14 }}>No past papers for this course yet — check back soon.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(exams ?? []).map((exam) => (
            <div
              key={exam.id}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
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
                  {exam.title}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                  {exam.session} {exam.year}
                </div>
              </div>
              {exam.pdf_url ? (
                <a
                  href={exam.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 14px',
                    background: course.accent_color,
                    color: '#fff',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                >
                  View PDF
                </a>
              ) : (
                <span style={{ fontSize: 11, color: '#c0c0c0', fontWeight: 600, flexShrink: 0 }}>
                  PDF coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
