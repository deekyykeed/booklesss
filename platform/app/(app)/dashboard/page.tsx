import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const { data: enrollmentRows } = await supabase
    .from('enrollments')
    .select('courses(id, slug, name, school, accent_color, cover_color, lessons(id))')
    .eq('user_id', user.id)

  type RawCourse = { id: string; slug: string; name: string; school: string; accent_color: string; cover_color: string; lessons: { id: string }[] }
  const enrolledCourses: RawCourse[] = (enrollmentRows ?? [])
    .map((r: { courses: RawCourse | RawCourse[] | null }) =>
      Array.isArray(r.courses) ? r.courses[0] : r.courses
    )
    .filter(Boolean) as RawCourse[]

  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Student'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900 }}>
      {/* Greeting */}
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: 'var(--font-parastoo)',
            fontSize: 28,
            fontWeight: 700,
            color: '#0F1F35',
            margin: '0 0 4px',
          }}
        >
          {greeting}, {displayName}.
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
          {enrolledCourses.length > 0
            ? `You're enrolled in ${enrolledCourses.length} course${enrolledCourses.length > 1 ? 's' : ''}.`
            : 'Browse the library to enrol in a course.'}
        </p>
      </div>

      {enrolledCourses.length > 0 ? (
        <>
          <SectionLabel>My Courses</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
              marginTop: 14,
            }}
          >
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            padding: '48px 32px',
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
          <p style={{ color: '#374151', fontWeight: 600, fontSize: 15, margin: '0 0 6px' }}>
            No courses yet
          </p>
          <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 20px' }}>
            Find your course and start learning.
          </p>
          <Link
            href="/library"
            style={{
              display: 'inline-block',
              padding: '9px 20px',
              background: '#0F1F35',
              color: '#fff',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Browse Library
          </Link>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#9ca3af',
      }}
    >
      {children}
    </div>
  )
}

function CourseCard({
  course,
}: {
  course: { slug: string; name: string; school: string; accent_color: string; cover_color: string; lessons: { id: string }[] }
}) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          overflow: 'hidden',
          transition: 'box-shadow 0.15s',
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
              marginBottom: 10,
              lineHeight: 1.3,
            }}
          >
            {course.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#9ca3af',
              marginBottom: 14,
            }}
          >
            {course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''}
          </div>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: course.accent_color,
              color: '#fff',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Continue →
          </div>
        </div>
      </div>
    </Link>
  )
}
