'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cacheGet, cacheSet } from '@/lib/client-cache'

type Lesson = { id: string; slug: string; title: string; order_index: number }
type Course = { id: string; slug: string; name: string; school: string; accent_color: string; cover_color: string; lessons: Lesson[] }
type BookmarkStep = { id: string; slug: string; title: string; lessons: { slug: string; courses: { name: string; slug: string; accent_color: string } | null } | null }
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
        supabase.from('enrollments').select('courses(id, slug, name, school, accent_color, cover_color, lessons(id, slug, title, order_index))').eq('user_id', userId),
        supabase.from('bookmarks').select('saved_at, steps(id, slug, title, lessons(slug, courses(name, slug, accent_color)))').eq('user_id', userId).order('saved_at', { ascending: false }).limit(4),
        supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      ])

      const rawName = (profile as { display_name?: string } | null)?.display_name ?? email.split('@')[0] ?? 'Student'
      const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

      const enrolledCourses: Course[] = ((enrollmentRows ?? []) as { courses: Course | Course[] | null }[])
        .map(r => Array.isArray(r.courses) ? r.courses[0] : r.courses)
        .filter(Boolean) as Course[]
      enrolledCourses.forEach(c => { c.lessons = [...(c.lessons ?? [])].sort((a, b) => a.order_index - b.order_index) })

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

  if (loading || !data) return <DashboardSkeleton />

  const { displayName, enrolledCourses, bookmarks, totalSaved } = data
  const initial = displayName.charAt(0).toUpperCase()
  const totalLessons = enrolledCourses.reduce((sum, c) => sum + (c.lessons?.length ?? 0), 0)

  return (
    <div className="dashboard-layout">

      {/* ── Left: main content ── */}
      <div className="dashboard-main">

        {/* Welcome header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            margin: '0 0 6px',
            fontFamily: 'Inter, var(--font-poppins), sans-serif',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'rgb(163, 163, 163)',
          }}>
            {todayStr}
          </p>
          <h1 style={{
            margin: '0 0 20px',
            fontFamily: 'Inter, var(--font-poppins), sans-serif',
            fontSize: 24, fontWeight: 700, color: 'rgb(23, 23, 23)',
            letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            {greeting}, {displayName}.
          </h1>
        </div>

        {/* Stats row: Profile + 2 gradient metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 10 }}>

          {/* Profile card */}
          <div style={{
            background: '#fff',
            border: '0.67px solid rgb(223, 223, 223)',
            borderRadius: 14,
            padding: '16px 12px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgb(237, 237, 237)',
              border: '2.5px solid rgb(212, 212, 212)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: 'rgb(23, 23, 23)',
              fontFamily: 'Inter, sans-serif', marginBottom: 4,
            }}>
              {initial}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 14, fontWeight: 600, color: 'rgb(23, 23, 23)', lineHeight: 1.3 }}>
                {displayName}
              </div>
              <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 11, color: 'rgb(163, 163, 163)', marginTop: 2 }}>
                Student
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              <StatPill icon="📚" value={enrolledCourses.length} label="courses" />
              <StatPill icon="🔖" value={totalSaved} label="saved" />
            </div>
          </div>

          {/* Gradient card 1: Courses */}
          <div style={{
            background: 'linear-gradient(135deg, #ff9a6c 0%, #ff6b6b 50%, #ee4444 100%)',
            borderRadius: 14, padding: '16px 14px 14px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 140,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>
              📖
            </div>
            <div>
              <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {enrolledCourses.length}
              </div>
              <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                Active Course{enrolledCourses.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Gradient card 2: Lessons */}
          <div style={{
            background: 'linear-gradient(135deg, #43e8d8 0%, #2dd4bf 40%, #3b82f6 100%)',
            borderRadius: 14, padding: '16px 14px 14px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 140,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>
              ✓
            </div>
            <div>
              <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {totalLessons}
              </div>
              <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                Total Lessons
              </div>
            </div>
          </div>
        </div>

        {/* Slack banner — "trackers connected" equivalent */}
        <div style={{
          background: '#fff',
          border: '0.67px solid rgb(223, 223, 223)',
          borderRadius: 16, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          <div>
            <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 14, fontWeight: 600, color: 'rgb(23, 23, 23)' }}>
              Study channels connected
            </div>
            <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 12, color: 'rgb(163, 163, 163)', marginTop: 2 }}>
              {enrolledCourses.length > 0 ? `${enrolledCourses.length} active course${enrolledCourses.length !== 1 ? 's' : ''} on Slack` : 'No channels yet'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {enrolledCourses.slice(0, 3).map((c, i) => (
              <div key={c.id} style={{
                width: 32, height: 32, borderRadius: 8,
                background: c.accent_color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                color: isDark(c.accent_color) ? '#fff' : '#000',
                fontFamily: 'Inter, sans-serif',
              }}>
                {c.name.charAt(0)}
              </div>
            ))}
            {enrolledCourses.length === 0 && (
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgb(237,237,237)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                💬
              </div>
            )}
            <div style={{ fontSize: 18, color: 'rgb(163,163,163)', marginLeft: 2 }}>···</div>
          </div>
        </div>

        {/* Continue Learning */}
        {enrolledCourses.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 16, fontWeight: 600, color: 'rgb(23, 23, 23)' }}>
                Continue Learning
              </span>
              <Link href="/library" style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 12, color: 'rgb(163,163,163)', textDecoration: 'none' }}>
                Browse library →
              </Link>
            </div>

            {enrolledCourses.map((course) => (
              <div key={course.id} style={{ marginBottom: 8 }}>
                <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff',
                    border: '0.67px solid rgb(223, 223, 223)',
                    borderRadius: 12, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'border-color 0.12s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgb(190,190,190)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgb(223,223,223)')}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: course.accent_color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                      color: isDark(course.accent_color) ? '#fff' : '#000',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {course.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 13, fontWeight: 600, color: 'rgb(23, 23, 23)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {course.name}
                      </div>
                      <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 11, color: 'rgb(163, 163, 163)' }}>
                        {course.school} · {course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <span style={{ color: 'rgb(163,163,163)', fontSize: 14, flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {enrolledCourses.length === 0 && (
          <div style={{
            background: '#fff', border: '0.67px solid rgb(223,223,223)',
            borderRadius: 16, padding: '48px 36px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
            <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 16, fontWeight: 600, color: 'rgb(23,23,23)', marginBottom: 8 }}>
              Find your first course
            </div>
            <p style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 13, color: 'rgb(163,163,163)', margin: '0 0 20px', lineHeight: 1.6 }}>
              Study notes for ZCAS and UNZA courses. Browse the library and enrol to get started.
            </p>
            <Link href="/library" style={{
              display: 'inline-block', padding: '10px 24px',
              background: 'rgb(23,23,23)', color: '#fff', borderRadius: 10,
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
              fontFamily: 'Inter, var(--font-poppins), sans-serif',
            }}>
              Browse Library
            </Link>
          </div>
        )}
      </div>

      {/* ── Right panel ── */}
      <div className="dashboard-right-panel">

        {/* Enrolled Courses */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 15, fontWeight: 600, color: 'rgb(23, 23, 23)' }}>
              My Courses
            </span>
            <span style={{ fontSize: 16 }}>📖</span>
          </div>

          {enrolledCourses.length === 0 ? (
            <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 13, color: 'rgb(163,163,163)', padding: '8px 0' }}>
              No courses yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {enrolledCourses.map((course, i) => (
                <div key={course.id}>
                  <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                      padding: '12px 0',
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      <div style={{ paddingTop: 2 }}>
                        <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 11, fontWeight: 500, color: 'rgb(163,163,163)', marginBottom: 2 }}>
                          {course.school}
                        </div>
                        <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 13, fontWeight: 600, color: 'rgb(23,23,23)', lineHeight: 1.3, marginBottom: 2 }}>
                          {course.name}
                        </div>
                        <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 11, color: 'rgb(163,163,163)' }}>
                          {course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <span style={{ marginLeft: 'auto', color: 'rgb(163,163,163)', fontSize: 13, flexShrink: 0, paddingTop: 2 }}>↗</span>
                    </div>
                  </Link>
                  {i < enrolledCourses.length - 1 && (
                    <div style={{ height: '0.67px', background: 'rgb(223,223,223)' }} />
                  )}
                </div>
              ))}
            </div>
          )}

          <Link href="/library" style={{
            display: 'flex', alignItems: 'center', gap: 4, marginTop: 8,
            fontFamily: 'Inter, var(--font-poppins), sans-serif',
            fontSize: 12, color: 'rgb(112,112,112)', textDecoration: 'none', fontWeight: 500,
          }}>
            See all courses <span style={{ fontSize: 13 }}>›</span>
          </Link>
        </div>

        {/* Course Progress — "Developed areas" equivalent */}
        {enrolledCourses.length > 0 && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 15, fontWeight: 600, color: 'rgb(23,23,23)', marginBottom: 2 }}>
                Course Lessons
              </div>
              <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 11, color: 'rgb(163,163,163)' }}>
                Lessons per course
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {enrolledCourses.map((course) => {
                const max = Math.max(...enrolledCourses.map(c => c.lessons.length), 1)
                const pct = Math.round((course.lessons.length / max) * 100)
                return (
                  <div key={course.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 13, fontWeight: 500, color: 'rgb(23,23,23)' }}>
                        {course.name.length > 22 ? course.name.slice(0, 20) + '…' : course.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 12, fontWeight: 600, color: 'rgb(82,82,82)' }}>
                          {course.lessons.length}
                        </span>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: course.accent_color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9,
                        }}>
                          {pct >= 50 ? '↑' : '↓'}
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 6, background: 'rgb(237,237,237)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: course.accent_color,
                        borderRadius: 99,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recently Saved */}
        {bookmarks.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 15, fontWeight: 600, color: 'rgb(23,23,23)', marginBottom: 14 }}>
              Recently Saved
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bookmarks.slice(0, 3).map((bookmark, i) => {
                const step = Array.isArray(bookmark.steps) ? (bookmark.steps as BookmarkStep[])[0] : bookmark.steps
                if (!step) return null
                const lesson = Array.isArray(step.lessons) ? step.lessons[0] : step.lessons
                const course = lesson ? (Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses) : null
                if (!lesson || !course) return null
                return (
                  <Link key={i} href={`/courses/${course.slug}/${lesson.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '10px 12px',
                      background: '#fff',
                      border: '0.67px solid rgb(223,223,223)',
                      borderLeft: `3px solid ${course.accent_color}`,
                      borderRadius: 8,
                    }}>
                      <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', color: course.accent_color, textTransform: 'uppercase', marginBottom: 3 }}>
                        {course.name}
                      </div>
                      <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 12, fontWeight: 500, color: 'rgb(23,23,23)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {step.title}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatPill({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 12, fontWeight: 700, color: 'rgb(23,23,23)', display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ fontSize: 11 }}>{icon}</span>
        {value}
      </div>
      <div style={{ fontFamily: 'Inter, var(--font-poppins), sans-serif', fontSize: 10, color: 'rgb(163,163,163)' }}>
        {label}
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '32px 32px 40px' }}>
        <div className="skeleton" style={{ width: 160, height: 10, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: 280, height: 32, marginBottom: 28 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 148, borderRadius: 16 }} />)}
        </div>
        <div className="skeleton" style={{ height: 56, borderRadius: 16, marginBottom: 24 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />)}
        </div>
      </div>
      <div style={{ width: 288, borderLeft: '0.67px solid rgb(223,223,223)', padding: '32px 24px' }}>
        <div className="skeleton" style={{ width: 100, height: 16, marginBottom: 20 }} />
        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8, marginBottom: 8 }} />)}
      </div>
    </div>
  )
}
