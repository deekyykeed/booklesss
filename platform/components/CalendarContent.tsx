'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type CourseLesson = {
  key: string
  lessonSlug: string
  lessonTitle: string
  courseSlug: string
  courseName: string
  accentColor: string
  stepCount: number
}

type ActivityDay = { date: string; count: number }

export default function CalendarContent({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true)
  const [activityDays, setActivityDays] = useState<ActivityDay[]>([])
  const [lessons, setLessons] = useState<CourseLesson[]>([])
  const [selectedMonth, setSelectedMonth] = useState(() => new Date())

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [{ data: bookmarks }, { data: enrollmentRows }] = await Promise.all([
        supabase.from('bookmarks').select('saved_at').eq('user_id', userId).order('saved_at'),
        supabase
          .from('enrollments')
          .select('courses(slug, name, accent_color, lessons(slug, title, order_index, steps(id)))')
          .eq('user_id', userId),
      ])

      const dayMap: Record<string, number> = {}
      for (const b of bookmarks ?? []) {
        const day = (b.saved_at as string).slice(0, 10)
        dayMap[day] = (dayMap[day] ?? 0) + 1
      }
      setActivityDays(Object.entries(dayMap).map(([date, count]) => ({ date, count })))

      type RawCourse = {
        slug: string
        name: string
        accent_color: string
        lessons: { slug: string; title: string; order_index: number; steps: { id: string }[] }[]
      }
      const allLessons: CourseLesson[] = []
      for (const row of enrollmentRows ?? []) {
        const course = (Array.isArray(row.courses) ? row.courses[0] : row.courses) as RawCourse | null
        if (!course) continue
        const sorted = [...(course.lessons ?? [])].sort((a, b) => a.order_index - b.order_index)
        for (const lesson of sorted) {
          allLessons.push({
            key: `${course.slug}-${lesson.slug}`,
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
            courseSlug: course.slug,
            courseName: course.name,
            accentColor: course.accent_color,
            stepCount: Array.isArray(lesson.steps) ? lesson.steps.length : 0,
          })
        }
      }
      setLessons(allLessons)
      setLoading(false)
    }
    load()
  }, [userId])

  const dayMap = new Map(activityDays.map(d => [d.date, d.count]))
  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth()
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().slice(0, 10)

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthLabel = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const totalActiveDays = activityDays.length

  return (
    <div style={{ padding: '40px 52px', maxWidth: 940, boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
          fontSize: 28, fontWeight: 700, color: '#0a0a0a',
          margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Calendar
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0, fontFamily: 'var(--font-poppins), sans-serif' }}>
          Your study activity and course roadmap.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[220, 180, 140].map((h, i) => (
            <div key={i} className="skeleton" style={{ height: h, borderRadius: 14 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* Left: Calendar */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
              {/* Month nav */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
              }}>
                <button
                  onClick={() => setSelectedMonth(new Date(year, month - 1, 1))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 6, fontSize: 18, color: '#6b7280', lineHeight: 1 }}
                >
                  ‹
                </button>
                <span style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif', fontWeight: 700, fontSize: 15, color: '#0a0a0a' }}>
                  {monthLabel}
                </span>
                <button
                  onClick={() => setSelectedMonth(new Date(year, month + 1, 1))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 6, fontSize: 18, color: '#6b7280', lineHeight: 1 }}
                >
                  ›
                </button>
              </div>

              {/* Day-of-week headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '12px 16px 4px', gap: 2 }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} style={{
                    textAlign: 'center', fontSize: 10, fontWeight: 700,
                    color: 'rgba(0,0,0,0.28)', letterSpacing: '0.04em',
                    paddingBottom: 8, fontFamily: 'var(--font-poppins), sans-serif',
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 16px 16px', gap: 2 }}>
                {cells.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} />
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const count = dayMap.get(dateStr) ?? 0
                  const isToday = dateStr === today

                  return (
                    <div
                      key={day}
                      title={count > 0 ? `${count} item${count > 1 ? 's' : ''} saved` : undefined}
                      style={{
                        aspectRatio: '1', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 3,
                        borderRadius: 8,
                        background: isToday ? '#0F1F35' : count > 0 ? '#10B98108' : 'transparent',
                        cursor: count > 0 ? 'default' : 'default',
                      }}
                    >
                      <span style={{
                        fontSize: 13, lineHeight: 1,
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? '#fff' : '#1a1a1a',
                        fontFamily: 'var(--font-poppins), sans-serif',
                      }}>
                        {day}
                      </span>
                      {count > 0 && (
                        <div style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: isToday ? 'rgba(255,255,255,0.7)' : '#10B981',
                        }} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div style={{ padding: '10px 20px 14px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'var(--font-poppins), sans-serif' }}>
                  {totalActiveDays} active study day{totalActiveDays !== 1 ? 's' : ''} total
                </span>
              </div>
            </div>

            {/* Streak / stats row */}
            {totalActiveDays > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                <StatCard label="Active Days" value={totalActiveDays} />
                <StatCard label="Items Saved" value={activityDays.reduce((s, d) => s + d.count, 0)} />
              </div>
            )}
          </div>

          {/* Right: Course Roadmap */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.28)', marginBottom: 12,
              fontFamily: 'var(--font-poppins), sans-serif',
            }}>
              Course Roadmap
            </div>

            {lessons.length === 0 ? (
              <div style={{
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: 12, padding: '28px 20px', textAlign: 'center',
              }}>
                <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 14px', fontFamily: 'var(--font-poppins), sans-serif' }}>
                  Enrol in a course to see your roadmap.
                </p>
                <Link href="/library" style={{
                  display: 'inline-block', padding: '8px 18px',
                  background: '#0F1F35', color: '#fff', borderRadius: 7,
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  fontFamily: 'var(--font-poppins), sans-serif',
                }}>
                  Browse Library
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {lessons.map((lesson, i) => (
                  <Link
                    key={lesson.key}
                    href={`/courses/${lesson.courseSlug}/${lesson.lessonSlug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      background: '#fff', border: '1px solid #e5e7eb',
                      borderRadius: 10, padding: '10px 12px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      borderLeft: `3px solid ${lesson.accentColor}`,
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: lesson.accentColor + '18',
                        color: lesson.accentColor, fontSize: 9, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontFamily: 'var(--font-poppins), sans-serif',
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 9, fontWeight: 700, color: lesson.accentColor,
                          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1,
                          fontFamily: 'var(--font-poppins), sans-serif',
                        }}>
                          {lesson.courseName}
                        </div>
                        <div style={{
                          fontSize: 12, fontWeight: 500, color: '#1a1a1a',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          fontFamily: 'var(--font-poppins), sans-serif',
                        }}>
                          {lesson.lessonTitle}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap',
                        flexShrink: 0, fontFamily: 'var(--font-poppins), sans-serif',
                      }}>
                        {lesson.stepCount}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: 12, padding: '16px 18px',
    }}>
      <div style={{
        fontSize: 24, fontWeight: 700, color: '#0a0a0a',
        fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
        letterSpacing: '-0.02em', marginBottom: 2,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'var(--font-poppins), sans-serif' }}>
        {label}
      </div>
    </div>
  )
}
