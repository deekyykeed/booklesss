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

function isDark(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length !== 6) return true
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
}

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
    <div style={{ padding: '40px 52px', maxWidth: 880, boxSizing: 'border-box' }}>

      {/* ── Greeting ── */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          margin: '0 0 8px', fontSize: 11, fontWeight: 600,
          color: '#b0b0b0', letterSpacing: '0.07em', textTransform: 'uppercase',
          fontFamily: 'var(--font-poppins), sans-serif',
        }}>
          {todayStr}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
          fontSize: 32, fontWeight: 700, color: '#0a0a0a',
          margin: '0 0 14px', letterSpacing: '-0.025em', lineHeight: 1.15,
        }}>
          {greeting}, {displayName}.
        </h1>
        {enrolledCourses.length > 0 ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Chip>{enrolledCourses.length} Course{enrolledCourses.length !== 1 ? 's' : ''}</Chip>
            {totalSaved > 0 && <Chip>{totalSaved} Saved</Chip>}
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
            Browse the library to enrol in your first course.
          </p>
        )}
      </div>

      {enrolledCourses.length > 0 ? (
        <>
          {/* ── Continue Learning hero ── */}
          {heroCourse && (
            <section style={{ marginBottom: 36 }}>
              <SectionLabel>Continue Learning</SectionLabel>
              <Link
                href={`/courses/${heroCourse.slug}`}
                style={{ textDecoration: 'none', display: 'block', marginTop: 12 }}
              >
                <div style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: heroCourse.cover_color,
                  boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
                }}>
                  <div style={{ padding: '32px 36px 36px' }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                      color: heroCourse.accent_color, textTransform: 'uppercase', marginBottom: 10,
                      fontFamily: 'var(--font-poppins), sans-serif',
                    }}>
                      {heroCourse.school}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
                      fontSize: 28, fontWeight: 700, lineHeight: 1.15,
                      letterSpacing: '-0.02em', marginBottom: 8,
                      color: isDark(heroCourse.cover_color) ? '#ffffff' : '#0a0a0a',
                    }}>
                      {heroCourse.name}
                    </div>
                    <div style={{
                      fontSize: 13, marginBottom: 28,
                      color: isDark(heroCourse.cover_color)
                        ? 'rgba(255,255,255,0.5)'
                        : 'rgba(0,0,0,0.45)',
                      fontFamily: 'var(--font-poppins), sans-serif',
                    }}>
                      {heroCourse.lessons.length} lesson{heroCourse.lessons.length !== 1 ? 's' : ''}
                      {heroCourse.lessons[0] && (
                        <> · Start with <em style={{ fontStyle: 'normal', opacity: 0.85 }}>{heroCourse.lessons[0].title}</em></>
                      )}
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '11px 24px',
                      background: heroCourse.accent_color,
                      color: '#fff', borderRadius: 12,
                      fontSize: 14, fontWeight: 600,
                      fontFamily: 'var(--font-poppins), sans-serif',
                    }}>
                      Open Course →
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* ── Lessons ── */}
          {heroCourse && heroCourse.lessons.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <SectionLabel>Lessons</SectionLabel>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {heroCourse.lessons.map((lesson, i) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${heroCourse.slug}/${lesson.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '13px 18px',
                      background: '#fff',
                      border: '1px solid #efefef',
                      borderRadius: 12,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: heroCourse.accent_color + '18',
                        color: heroCourse.accent_color,
                        fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontFamily: 'var(--font-poppins), sans-serif',
                      }}>
                        {i + 1}
                      </div>
                      <div style={{
                        fontSize: 14, fontWeight: 500, color: '#1a1a1a', flex: 1,
                        fontFamily: 'var(--font-poppins), sans-serif',
                      }}>
                        {lesson.title}
                      </div>
                      <span style={{ color: heroCourse.accent_color, fontSize: 15, fontWeight: 500 }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Also enrolled ── */}
          {enrolledCourses.length > 1 && (
            <section style={{ marginBottom: 36 }}>
              <SectionLabel>Also Enrolled</SectionLabel>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: 12, marginTop: 12,
              }}>
                {enrolledCourses.slice(1).map((course) => (
                  <Link key={course.id} href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#fff', border: '1px solid #efefef',
                      borderRadius: 16, overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{ height: 4, background: course.accent_color }} />
                      <div style={{ padding: '16px 18px 20px' }}>
                        <div style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.07em',
                          color: course.accent_color, textTransform: 'uppercase', marginBottom: 4,
                          fontFamily: 'var(--font-poppins), sans-serif',
                        }}>
                          {course.school}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
                          fontWeight: 700, fontSize: 15, color: '#0a0a0a',
                          marginBottom: 14, lineHeight: 1.3, letterSpacing: '-0.01em',
                        }}>
                          {course.name}
                        </div>
                        <div style={{
                          display: 'inline-flex', padding: '7px 14px',
                          background: course.accent_color, color: '#fff',
                          borderRadius: 8, fontSize: 12, fontWeight: 600,
                          fontFamily: 'var(--font-poppins), sans-serif',
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
                alignItems: 'baseline', marginBottom: 12,
              }}>
                <SectionLabel>Recently Saved</SectionLabel>
                <Link href="/saved" style={{
                  fontSize: 12, color: '#9ca3af', textDecoration: 'none',
                  fontWeight: 500, fontFamily: 'var(--font-poppins), sans-serif',
                }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                        background: '#fff',
                        border: '1px solid #efefef',
                        borderLeft: `3px solid ${course.accent_color}`,
                        borderRadius: 10,
                        padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                            color: course.accent_color, textTransform: 'uppercase', marginBottom: 2,
                            fontFamily: 'var(--font-poppins), sans-serif',
                          }}>
                            {course.name}
                          </div>
                          <div style={{
                            fontSize: 13, fontWeight: 500, color: '#1a1a1a',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            fontFamily: 'var(--font-poppins), sans-serif',
                          }}>
                            {step.title}
                          </div>
                        </div>
                        <div style={{
                          fontSize: 11, color: '#b0b0b0', whiteSpace: 'nowrap', flexShrink: 0,
                          fontFamily: 'var(--font-poppins), sans-serif',
                        }}>
                          {savedDate}
                        </div>
                        <span style={{ color: course.accent_color, fontWeight: 600, fontSize: 14, flexShrink: 0 }}>→</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </>
      ) : (
        <div style={{
          background: '#fff', border: '1px solid #efefef',
          borderRadius: 20, padding: '64px 48px',
          textAlign: 'center', maxWidth: 480,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📚</div>
          <div style={{
            fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
            fontSize: 22, fontWeight: 700, color: '#0a0a0a', marginBottom: 10,
          }}>
            Find your first course
          </div>
          <p style={{
            color: '#9ca3af', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6,
            fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            Booklesss has study notes for ZCAS and UNZA. Browse the library and enrol to get started.
          </p>
          <Link href="/library" style={{
            display: 'inline-block', padding: '12px 28px',
            background: '#0a0a0a', color: '#fff',
            borderRadius: 12, fontSize: 14, fontWeight: 600,
            textDecoration: 'none', fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            Browse Library
          </Link>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: 'rgba(0,0,0,0.28)',
      fontFamily: 'var(--font-poppins), sans-serif',
    }}>
      {children}
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '5px 14px',
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 20,
      fontSize: 13, fontWeight: 500, color: '#374151',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      fontFamily: 'var(--font-poppins), sans-serif',
    }}>
      {children}
    </div>
  )
}
