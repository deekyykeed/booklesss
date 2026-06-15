import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUser, getProfile, getEnrollments } from '@/lib/supabase/queries'

type RawLesson = { id: string; slug: string; title: string; order_index: number }
type RawCourse = {
  id: string
  slug: string
  name: string
  school: string
  accent_color: string
  cover_color: string
  lessons: RawLesson[]
}
type BookmarkStep = {
  id: string
  slug: string
  title: string
  lessons: { slug: string; courses: { name: string; slug: string; accent_color: string } | null } | null
}
type RawBookmark = { saved_at: string; steps: BookmarkStep | BookmarkStep[] | null }

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const [profile, enrollmentRows, { data: recentBookmarkRows }, { count: savedCount }] = await Promise.all([
    getProfile(user.id),
    getEnrollments(user.id),
    supabase
      .from('bookmarks')
      .select('saved_at, steps(id, slug, title, lessons(slug, courses(name, slug, accent_color)))')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false })
      .limit(3),
    supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const enrolledCourses: RawCourse[] = (enrollmentRows ?? [])
    .map((r: { courses: RawCourse | RawCourse[] | null }) =>
      Array.isArray(r.courses) ? r.courses[0] : r.courses
    )
    .filter(Boolean) as RawCourse[]

  enrolledCourses.forEach((c) => {
    c.lessons = [...(c.lessons ?? [])].sort((a, b) => a.order_index - b.order_index)
  })

  const bookmarks = (recentBookmarkRows ?? []) as unknown as RawBookmark[]
  const totalSaved = savedCount ?? 0
  const heroCourse = enrolledCourses[0] ?? null

  const rawName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Student'
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div style={{ padding: '36px 48px', maxWidth: 960, boxSizing: 'border-box' }}>

      {/* ── Greeting ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 28,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
            fontSize: 30, fontWeight: 700, color: '#0a0a0a',
            margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            {greeting}, {displayName}.
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
            {enrolledCourses.length > 0
              ? `You${'’'}re in ${enrolledCourses.length} course${enrolledCourses.length !== 1 ? 's' : ''}.`
              : 'Browse the library to enrol in your first course.'}
          </p>
        </div>
        <span style={{
          fontSize: 13, color: '#9ca3af', flexShrink: 0,
          marginLeft: 24, paddingTop: 4, whiteSpace: 'nowrap',
        }}>
          {todayStr}
        </span>
      </div>

      {enrolledCourses.length > 0 ? (
        <>
          {/* ── Stats chips ── */}
          {totalSaved > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
              <Chip>{enrolledCourses.length} Course{enrolledCourses.length !== 1 ? 's' : ''}</Chip>
              <Chip>{totalSaved} Saved</Chip>
            </div>
          )}

          {/* ── Continue Learning hero ── */}
          {heroCourse && (
            <section style={{ marginBottom: 40 }}>
              <Label>Continue Learning</Label>
              <Link
                href={`/courses/${heroCourse.slug}`}
                style={{ textDecoration: 'none', display: 'block', marginTop: 10 }}
              >
                <div style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'stretch',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ width: 5, background: heroCourse.accent_color, flexShrink: 0 }} />
                  <div style={{
                    flex: 1, padding: '24px 28px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 24,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                        color: heroCourse.accent_color, textTransform: 'uppercase', marginBottom: 6,
                      }}>
                        {heroCourse.school}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
                        fontSize: 22, fontWeight: 700, color: '#0a0a0a',
                        marginBottom: 8, lineHeight: 1.2, letterSpacing: '-0.01em',
                      }}>
                        {heroCourse.name}
                      </div>
                      <div style={{ fontSize: 13, color: '#9ca3af' }}>
                        {heroCourse.lessons.length} lesson{heroCourse.lessons.length !== 1 ? 's' : ''}
                        {heroCourse.lessons[0] && (
                          <> · Start with <em style={{ fontStyle: 'normal', color: '#6b7280' }}>{heroCourse.lessons[0].title}</em></>
                        )}
                      </div>
                    </div>
                    <div style={{
                      padding: '11px 24px',
                      background: heroCourse.accent_color,
                      color: '#fff', borderRadius: 12,
                      fontSize: 14, fontWeight: 600, flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}>
                      Open Course →
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* ── Lessons list ── */}
          {heroCourse && heroCourse.lessons.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <Label>Lessons</Label>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {heroCourse.lessons.map((lesson, i) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${heroCourse.slug}/${lesson.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px',
                      background: '#fff', border: '1px solid #e5e7eb',
                      borderRadius: 10,
                      transition: 'border-color 0.15s',
                    }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: heroCourse.accent_color + '20',
                        color: heroCourse.accent_color,
                        fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', flex: 1 }}>
                        {lesson.title}
                      </div>
                      <span style={{ color: '#d1d5db', fontSize: 14 }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── My Courses grid ── */}
          {enrolledCourses.length > 1 && (
            <section style={{ marginBottom: 40 }}>
              <Label>My Courses</Label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 14, marginTop: 10,
              }}>
                {enrolledCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      background: '#fff', border: '1px solid #e5e7eb',
                      borderRadius: 14, overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      height: '100%',
                    }}>
                      <div style={{ height: 5, background: course.accent_color }} />
                      <div style={{ padding: '16px 18px 18px' }}>
                        <div style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                          color: course.accent_color, textTransform: 'uppercase', marginBottom: 4,
                        }}>
                          {course.school}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
                          fontWeight: 700, fontSize: 15, color: '#0a0a0a',
                          marginBottom: 6, lineHeight: 1.3, letterSpacing: '-0.01em',
                        }}>
                          {course.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>
                          {course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''}
                        </div>
                        <div style={{
                          display: 'inline-block', padding: '7px 16px',
                          background: course.accent_color, color: '#fff',
                          borderRadius: 8, fontSize: 12, fontWeight: 600,
                        }}>
                          Continue →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Recently Saved ── */}
          {bookmarks.length > 0 && (
            <section>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', marginBottom: 10,
              }}>
                <Label>Recently Saved</Label>
                <Link href="/saved" style={{
                  fontSize: 12, color: '#6b7280', textDecoration: 'none', fontWeight: 500,
                }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bookmarks.map((bookmark, i) => {
                  const step = Array.isArray(bookmark.steps) ? bookmark.steps[0] : bookmark.steps
                  if (!step) return null
                  const lesson = Array.isArray(step.lessons) ? step.lessons[0] : step.lessons
                  const course = lesson
                    ? (Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses)
                    : null
                  if (!lesson || !course) return null
                  const href = `/courses/${course.slug}/${lesson.slug}`
                  const savedDate = new Date(bookmark.saved_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short',
                  })
                  return (
                    <Link key={i} href={href} style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: '#fff', border: '1px solid #e5e7eb',
                        borderRadius: 10, padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        borderLeft: `4px solid ${course.accent_color}`,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                            color: course.accent_color, textTransform: 'uppercase', marginBottom: 2,
                          }}>
                            {course.name}
                          </div>
                          <div style={{
                            fontSize: 13, fontWeight: 600, color: '#1a1a1a',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {step.title}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {savedDate}
                        </div>
                        <span style={{ color: course.accent_color, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                          →
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </>
      ) : (
        /* ── Empty state ── */
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: 16, padding: '56px 40px',
          textAlign: 'center', maxWidth: 500,
        }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>📚</div>
          <div style={{
            fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
            fontSize: 18, fontWeight: 700, color: '#0a0a0a', marginBottom: 8,
          }}>
            Find your first course
          </div>
          <p style={{
            color: '#6b7280', fontSize: 14,
            margin: '0 0 24px', lineHeight: 1.6,
          }}>
            Booklesss has study notes for ZCAS and UNZA. Browse the library and enrol to get started.
          </p>
          <Link href="/library" style={{
            display: 'inline-block', padding: '10px 24px',
            background: '#0a0a0a', color: '#fff',
            borderRadius: 10, fontSize: 14, fontWeight: 600,
            textDecoration: 'none',
          }}>
            Browse Library
          </Link>
        </div>
      )}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: '#6b7280',
    }}>
      {children}
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '5px 12px',
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 20,
      fontSize: 12, fontWeight: 500, color: '#374151',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>
      {children}
    </div>
  )
}
