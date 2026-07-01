import Link from 'next/link'
import { redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createStaticClient } from '@supabase/supabase-js'
import EnrollButton from '@/components/EnrollButton'

const getAllCourses = unstable_cache(
  async () => {
    const supabase = createStaticClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase
      .from('courses')
      .select('id, slug, name, school, accent_color, cover_color')
      .order('name')
    return data ?? []
  },
  ['all-courses'],
  { revalidate: 3600, tags: ['courses'] }
)

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [allCourses, { data: enrollmentRows }] = await Promise.all([
    getAllCourses(),
    supabase.from('enrollments').select('course_id').eq('user_id', user.id),
  ])

  const enrolledIds = new Set((enrollmentRows ?? []).map((e: { course_id: string }) => e.course_id))

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900 }}>
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
          Course Library
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
          All available Booklesss courses — enrol to add them to your sidebar.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: 16,
        }}
      >
        {(allCourses ?? []).map((course) => {
          const enrolled = enrolledIds.has(course.id)
          return (
            <div
              key={course.id}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: course.cover_color,
                  height: 6,
                  borderBottom: `3px solid ${course.accent_color}`,
                }}
              />
              <div style={{ padding: '16px 18px 18px' }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: course.accent_color,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {course.school}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-parastoo)',
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#0F1F35',
                    marginBottom: 14,
                    lineHeight: 1.3,
                  }}
                >
                  {course.name}
                </div>

                {enrolled ? (
                  <Link
                    href={`/courses/${course.slug}`}
                    style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      background: course.accent_color,
                      color: '#fff',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Continue →
                  </Link>
                ) : (
                  <EnrollButton courseId={course.id} userId={user.id} accentColor={course.accent_color} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
