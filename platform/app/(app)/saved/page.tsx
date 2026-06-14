import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      saved_at,
      steps(
        id, slug, title,
        lessons(
          slug,
          courses(name, slug, accent_color)
        )
      )
    `)
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: 'var(--font-parastoo)',
            fontSize: 26,
            fontWeight: 700,
            color: '#0F1F35',
            margin: '0 0 6px',
          }}
        >
          Saved Items
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
          Steps you have bookmarked for later.
        </p>
      </div>

      {(bookmarks ?? []).length === 0 ? (
        <div
          style={{
            padding: '48px 32px',
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
            No saved items yet. Bookmark a step while reading to find it here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(bookmarks ?? []).map((bookmark, i) => {
            type Step = { id: string; slug: string; title: string; lessons: { slug: string; courses: { name: string; slug: string; accent_color: string } | null } | null }
            const step = (Array.isArray(bookmark.steps) ? bookmark.steps[0] : bookmark.steps) as unknown as Step | null
            if (!step) return null
            const lesson = Array.isArray(step.lessons) ? step.lessons[0] : step.lessons
            const course = lesson ? (Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses) : null
            if (!lesson || !course) return null

            const href = `/courses/${course.slug}/${lesson.slug}`
            const savedDate = new Date(bookmark.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

            return (
              <Link
                key={i}
                href={href}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    borderLeft: `4px solid ${course.accent_color}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: course.accent_color,
                        textTransform: 'uppercase',
                        marginBottom: 2,
                      }}
                    >
                      {course.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-parastoo)',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#0F1F35',
                      }}
                    >
                      {step.title}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    Saved {savedDate}
                  </div>
                  <span style={{ color: course.accent_color, fontWeight: 700 }}>→</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
