'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cacheGet, cacheSet } from '@/lib/client-cache'

type Lesson = { id: string; slug: string; title: string; order_index: number }
type Course = {
  id: string; slug: string; name: string; school: string
  accent_color: string; cover_color: string; lessons: Lesson[]
}
type BookmarkStep = {
  id: string; slug: string; title: string
  lessons: { slug: string; courses: { name: string; slug: string; accent_color: string } | null } | null
}
type Bookmark = { saved_at: string; steps: BookmarkStep | null }

type DashboardData = {
  displayName: string
  enrolledCourses: Course[]
  bookmarks: Bookmark[]
  totalSaved: number
}

function isDark(hex: string) {
  const h = hex.replace('#', '')
  if (h.length !== 6) return true
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
}

function unwrap<T>(val: T | T[] | null | undefined): T | null {
  if (!val) return null
  return Array.isArray(val) ? (val[0] ?? null) : val
}

export default function DashboardContent({ userId, email }: { userId: string; email: string }) {
  const cacheKey = `dashboard-${userId}`
  const [data, setData] = useState<DashboardData | null>(() => cacheGet<DashboardData>(cacheKey))
  const [loading, setLoading] = useState(!data)

  useEffect(() => {
    if (data) return
    const supabase = createClient()
    async function load() {
      const [
        { data: profile },
        { data: enrollmentRows },
        { data: recentBookmarkRows },
        { count: savedCount },
      ] = await Promise.all([
        supabase.from('profiles').select('display_name').eq('id', userId).single(),
        supabase
          .from('enrollments')
          .select('courses(id, slug, name, school, accent_color, cover_color, lessons(id, slug, title, order_index))')
          .eq('user_id', userId),
        supabase
          .from('bookmarks')
          .select('saved_at, steps(id, slug, title, lessons(slug, courses(name, slug, accent_color)))')
          .eq('user_id', userId)
          .order('saved_at', { ascending: false })
          .limit(3),
        supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      ])

      const rawName = (profile as { display_name?: string } | null)?.display_name
        ?? email.split('@')[0] ?? 'Student'
      const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

      const enrolledCourses: Course[] = (
        (enrollmentRows ?? []) as { courses: Course | Course[] | null }[]
      )
        .map(r => unwrap(r.courses))
        .filter(Boolean) as Course[]

      enrolledCourses.forEach(c => {
        c.lessons = [...(c.lessons ?? [])].sort((a, b) => a.order_index - b.order_index)
      })

      const result: DashboardData = {
        displayName,
        enrolledCourses,
        bookmarks: (recentBookmarkRows ?? []) as unknown as Bookmark[],
        totalSaved: savedCount ?? 0,
      }
      cacheSet(cacheKey, result)
      setData(result)
      setLoading(false)
    }
    load()
  }, [userId])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  if (loading || !data) {
    return (
      <div style={{ padding: '40px 48px', maxWidth: 860 }}>
        <div style={{ marginBottom: 32 }}>
          <div className="skeleton" style={{ width: 160, height: 11, marginBottom: 10, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 280, height: 34, marginBottom: 0, borderRadius: 6 }} />
        </div>
        <div className="skeleton" style={{ width: '100%', height: 176, borderRadius: 16, marginBottom: 32 }} />
        <div className="skeleton" style={{ width: 80, height: 11, marginBottom: 12, borderRadius: 4 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />
          ))}
        </div>
      </div>
    )
  }

  const { displayName, enrolledCourses, bookmarks, totalSaved } = data
  const heroCourse = enrolledCourses[0] ?? null

  // Determine "continue" from most recent bookmark
  const lastStep = unwrap(bookmarks[0]?.steps)
  const lastLesson = lastStep ? unwrap(lastStep.lessons) : null
  const lastCourse = lastLesson ? unwrap(lastLesson.courses) : null

  const continueHref =
    lastStep && lastLesson && lastCourse
      ? `/courses/${lastCourse.slug}/${lastLesson.slug}?step=${lastStep.slug}`
      : heroCourse?.lessons[0]
        ? `/courses/${heroCourse.slug}/${heroCourse.lessons[0].slug}`
        : '/library'

  const continueTitle =
    lastStep?.title ?? heroCourse?.lessons[0]?.title ?? 'Start reading'

  const continueMeta =
    lastCourse?.name ?? (heroCourse
      ? `${heroCourse.school} · ${heroCourse.name}`
      : '')

  const dark = heroCourse ? isDark(heroCourse.cover_color) : true

  return (
    <div style={{ padding: '40px 48px', maxWidth: 860, boxSizing: 'border-box' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          margin: '0 0 6px',
          fontSize: 11, fontWeight: 600, color: '#b0b0b0',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          fontFamily: 'var(--font-poppins), sans-serif',
        }}>
          {todayStr}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
          fontSize: 30, fontWeight: 700, color: '#0a0a0a',
          margin: 0, letterSpacing: '-0.025em', lineHeight: 1.2,
        }}>
          {greeting}, {displayName}.
        </h1>
      </div>

      {enrolledCourses.length > 0 && heroCourse ? (
        <>
          {/* Continue card */}
          <section style={{ marginBottom: 32 }}>
            <Label>Continue</Label>
            <Link href={continueHref} style={{ textDecoration: 'none', display: 'block', marginTop: 10 }}>
              <div style={{
                borderRadius: 16, overflow: 'hidden',
                background: heroCourse.cover_color,
                boxShadow: '0 2px 20px rgba(0,0,0,0.09)',
              }}>
                <div style={{ padding: '28px 32px 32px' }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
                    color: heroCourse.accent_color, textTransform: 'uppercase',
                    marginBottom: 8, fontFamily: 'var(--font-poppins), sans-serif',
                  }}>
                    {continueMeta}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
                    fontSize: 22, fontWeight: 700, lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    color: dark ? '#ffffff' : '#0a0a0a',
                    marginBottom: 24, maxWidth: 460,
                  }}>
                    {continueTitle}
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '10px 22px',
                    background: heroCourse.accent_color,
                    color: '#fff', borderRadius: 10,
                    fontSize: 13, fontWeight: 600,
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}>
                    Continue reading →
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* Lesson list */}
          {heroCourse.lessons.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <Label>{heroCourse.name}</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 10 }}>
                {heroCourse.lessons.map((lesson, i) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${heroCourse.slug}/${lesson.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '13px 16px',
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 10,
                    }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: heroCourse.accent_color + '1a',
                        color: heroCourse.accent_color,
                        fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontFamily: 'var(--font-poppins), sans-serif',
                      }}>
                        {i + 1}
                      </div>
                      <span style={{
                        flex: 1, fontSize: 13, fontWeight: 500, color: '#1a1a1a',
                        fontFamily: 'var(--font-poppins), sans-serif',
                      }}>
                        {lesson.title}
                      </span>
                      <span style={{ color: '#c8c8c8', fontSize: 14 }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Other enrolled courses */}
          {enrolledCourses.length > 1 && (
            <section style={{ marginBottom: 32 }}>
              <Label>Also enrolled</Label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: 10, marginTop: 10,
              }}>
                {enrolledCourses.slice(1).map(course => (
                  <Link key={course.id} href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 12, overflow: 'hidden',
                    }}>
                      <div style={{ height: 4, background: course.accent_color }} />
                      <div style={{ padding: '14px 16px 16px' }}>
                        <div style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.07em',
                          color: course.accent_color, textTransform: 'uppercase',
                          marginBottom: 4, fontFamily: 'var(--font-poppins), sans-serif',
                        }}>
                          {course.school}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
                          fontWeight: 700, fontSize: 14, color: '#0a0a0a',
                          lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 12,
                        }}>
                          {course.name}
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 600, color: course.accent_color,
                          fontFamily: 'var(--font-poppins), sans-serif',
                        }}>
                          Open →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Recently saved */}
          {bookmarks.length > 0 && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <Label noMargin>Saved</Label>
                {totalSaved > 3 && (
                  <Link href="/saved" style={{
                    fontSize: 12, color: '#9ca3af', textDecoration: 'none',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}>
                    View all {totalSaved} →
                  </Link>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {bookmarks.map((bookmark, i) => {
                  const step = unwrap(bookmark.steps)
                  if (!step) return null
                  const lesson = unwrap(step.lessons)
                  const course = lesson ? unwrap(lesson.courses) : null
                  if (!lesson || !course) return null
                  return (
                    <Link
                      key={i}
                      href={`/courses/${course.slug}/${lesson.slug}?step=${step.slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={{
                        background: '#fff',
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderLeft: `3px solid ${course.accent_color}`,
                        borderRadius: 10, padding: '11px 14px',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                            color: course.accent_color, textTransform: 'uppercase',
                            marginBottom: 2, fontFamily: 'var(--font-poppins), sans-serif',
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
                          fontSize: 11, color: '#c8c8c8', whiteSpace: 'nowrap',
                          flexShrink: 0, fontFamily: 'var(--font-poppins), sans-serif',
                        }}>
                          {new Date(bookmark.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Empty state */
        <div style={{
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 16, padding: '56px 40px',
          maxWidth: 440, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
            fontSize: 20, fontWeight: 700, color: '#0a0a0a',
            marginBottom: 10, letterSpacing: '-0.01em',
          }}>
            Find your first course
          </div>
          <p style={{
            color: '#9ca3af', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6,
            fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            Booklesss has study notes for ZCAS and UNZA. Browse the library to get started.
          </p>
          <Link href="/library" style={{
            display: 'inline-block', padding: '11px 24px',
            background: '#0a0a0a', color: '#fff', borderRadius: 10,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            Browse library
          </Link>
        </div>
      )}
    </div>
  )
}

function Label({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
      textTransform: 'uppercase', color: 'rgba(0,0,0,0.28)',
      fontFamily: 'var(--font-poppins), sans-serif',
      marginBottom: noMargin ? 0 : 10,
    }}>
      {children}
    </div>
  )
}
