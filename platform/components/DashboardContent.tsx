'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cacheGet, cacheSet } from '@/lib/client-cache'
import {
  CaseMinimalisticLinear,
  FolderFilesLinear,
  CourseUpLinear,
} from './icons/solar'

type Lesson = { id: string; slug: string; title: string; order_index: number }
type Course = {
  id: string
  slug: string
  name: string
  school: string
  accent_color: string
  cover_color: string
  lessons: Lesson[]
}

const SHADOW = '0px 0.6021873017743928px 0.6021873017743928px -1.25px rgba(0,0,0,0.18), 0px 2.288533303243457px 2.288533303243457px -2.5px rgba(0,0,0,0.16), 0px 10px 10px -3.75px rgba(0,0,0,0.06)'
const SHADOW_HOVER = '0px 1px 2px -1px rgba(0,0,0,0.22), 0px 4px 8px -2.5px rgba(0,0,0,0.14), 0px 18px 22px -3.75px rgba(0,0,0,0.08)'
const BORDER = '1px solid rgb(218, 218, 217)'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getFirstName(email: string) {
  const raw = email.split('@')[0].replace(/[._-]/g, ' ').trim().split(' ')[0]
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

export default function DashboardContent({ userId, email }: { userId: string; email: string }) {
  const cacheKey = `dashboard-v5-${userId}`
  const [courses, setCourses] = useState<Course[] | null>(() => cacheGet<Course[]>(cacheKey))
  const [loading, setLoading] = useState(!courses)

  useEffect(() => {
    if (courses) return
    const supabase = createClient()
    async function load() {
      const { data: enrollmentRows } = await supabase
        .from('enrollments')
        .select('courses(id, slug, name, school, accent_color, cover_color, lessons(id, slug, title, order_index))')
        .eq('user_id', userId)

      const enrolled: Course[] = ((enrollmentRows ?? []) as { courses: Course | Course[] | null }[])
        .map(r => (Array.isArray(r.courses) ? r.courses[0] : r.courses))
        .filter(Boolean) as Course[]

      enrolled.forEach(c => {
        c.lessons = [...(c.lessons ?? [])].sort((a, b) => a.order_index - b.order_index)
      })

      cacheSet(cacheKey, enrolled)
      setCourses(enrolled)
      setLoading(false)
    }
    load()
  }, [userId])

  if (loading || !courses) return <Skeleton />

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0)
  const uniqueSchools = new Set(courses.map(c => c.school)).size
  const firstName = getFirstName(email)

  return (
    <div style={{
      background: 'rgb(252, 252, 252)',
      padding: '32px 32px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 32,
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
    }}>

      {/* ── Welcome ───────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-familjen), "Familjen Grotesk", Inter, sans-serif',
            fontWeight: 500,
            fontSize: 24,
            letterSpacing: '-0.6px',
            lineHeight: '1.2em',
            color: 'rgb(23, 23, 23)',
            userSelect: 'none',
          }}>
            {getGreeting()}, {firstName}
          </h1>
          <p style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 13,
            lineHeight: '1em',
            color: 'rgb(155, 153, 147)',
            userSelect: 'none',
          }}>
            {courses.length === 0
              ? 'Browse the library and enrol in your first course.'
              : `Enrolled in ${courses.length} course${courses.length !== 1 ? 's' : ''} across ${uniqueSchools} school${uniqueSchools !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          lineHeight: '1em',
          color: 'rgb(185, 183, 177)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          paddingTop: 5,
        }}>
          {formatDate()}
        </span>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 10,
        width: '100%',
        flexWrap: 'wrap',
      }}>
        <StatCard
          value={courses.length}
          label={courses.length === 1 ? 'course' : 'courses'}
          icon={<CourseUpLinear size={16} />}
        />
        <StatCard
          value={totalLessons}
          label={totalLessons === 1 ? 'lesson' : 'lessons'}
          icon={<FolderFilesLinear size={16} />}
        />
        <StatCard
          value={uniqueSchools}
          label={uniqueSchools === 1 ? 'school' : 'schools'}
          icon={<CaseMinimalisticLinear size={16} />}
        />
        <ProgressCard />
      </div>

      {/* ── Your Courses ──────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-familjen), "Familjen Grotesk", Inter, sans-serif',
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: '-0.2px',
            lineHeight: '1em',
            color: 'rgb(112, 110, 105)',
            userSelect: 'none',
          }}>
            Your Courses
          </span>
          <Link href="/library" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: 'rgb(155, 153, 147)',
              userSelect: 'none',
              transition: 'color 0.1s ease',
            }}>
              Browse Library →
            </span>
          </Link>
        </div>

        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
            width: '100%',
          }}>
            {courses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </div>

    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <div className="course-card" style={{
      border: BORDER,
      boxShadow: SHADOW,
      background: 'rgb(255, 255, 255)',
      width: 118,
      height: 94,
      padding: '13px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ color: 'rgb(200, 198, 192)' }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        <span style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: '-0.5px',
          lineHeight: '1em',
          color: 'rgb(23, 23, 23)',
          userSelect: 'none',
        }}>
          {value}
        </span>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          lineHeight: '1.1em',
          paddingBottom: 1,
          color: 'rgb(155, 153, 147)',
          userSelect: 'none',
        }}>
          {label}
        </span>
      </div>
    </div>
  )
}

// ── Progress card ─────────────────────────────────────────────────────────────
function ProgressCard() {
  return (
    <div className="course-card" style={{
      border: BORDER,
      boxShadow: SHADOW,
      background: 'rgb(255, 255, 255)',
      flex: 1,
      minWidth: 160,
      height: 94,
      padding: '13px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    }}>
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        lineHeight: '1em',
        color: 'rgb(155, 153, 147)',
        userSelect: 'none',
      }}>
        Progress
      </span>
      <div style={{ width: '100%' }}>
        <span style={{
          display: 'block',
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          color: 'rgb(200, 198, 192)',
          userSelect: 'none',
          marginBottom: 7,
        }}>
          Tracking coming soon
        </span>
        <div className="course-card" style={{
          background: 'rgb(243, 243, 241)',
          height: 5,
          width: '100%',
        }} />
      </div>
    </div>
  )
}

// ── Course card ───────────────────────────────────────────────────────────────
function CourseCard({ course }: { course: Course }) {
  const accent = course.accent_color || 'rgb(112, 110, 105)'

  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="course-card"
        style={{
          background: 'rgb(255, 255, 255)',
          border: BORDER,
          boxShadow: SHADOW,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = SHADOW_HOVER
          el.style.borderColor = 'rgb(200, 200, 198)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = SHADOW
          el.style.borderColor = 'rgb(218, 218, 217)'
        }}
      >
        {/* Accent top bar */}
        <div style={{ height: 3, width: '100%', background: accent, borderRadius: '24px 24px 0 0', flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          background: 'linear-gradient(160deg, rgb(252, 252, 252) 0%, rgb(246, 246, 244) 100%)',
          padding: '13px 16px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{ color: accent }}>
            <FolderFilesLinear size={20} />
          </div>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: 'rgb(155, 153, 147)',
            background: 'rgb(240, 239, 236)',
            padding: '2px 8px',
            borderRadius: 99,
            userSelect: 'none',
            lineHeight: '16px',
          }}>
            {course.school}
          </span>
        </div>

        {/* Body */}
        <div style={{
          borderTop: BORDER,
          padding: '13px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{
            fontFamily: 'var(--font-instrument), "Instrument Sans", Inter, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            lineHeight: '1.35em',
            color: 'rgb(11, 11, 11)',
            userSelect: 'none',
          }}>
            {course.name}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 12,
            lineHeight: '1em',
            color: 'rgb(185, 183, 177)',
            userSelect: 'none',
          }}>
            {course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="course-card" style={{
      border: BORDER,
      boxShadow: SHADOW,
      background: 'rgb(255, 255, 255)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 12,
      maxWidth: 380,
    }}>
      <div style={{ color: 'rgb(200, 198, 192)' }}>
        <FolderFilesLinear size={20} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", Inter, sans-serif',
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: '-0.3px',
          lineHeight: '1em',
          color: 'rgb(23, 23, 23)',
          userSelect: 'none',
        }}>
          No courses yet
        </span>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          lineHeight: '1.5em',
          color: 'rgb(155, 153, 147)',
          userSelect: 'none',
        }}>
          Find a course in the library and enrol to get started.
        </span>
      </div>
      <Link href="/library" style={{ textDecoration: 'none' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: '1em',
          color: 'rgb(82, 82, 82)',
          background: 'rgb(243, 243, 241)',
          border: BORDER,
          borderRadius: 99,
          padding: '7px 14px',
          userSelect: 'none',
          display: 'inline-block',
          cursor: 'pointer',
        }}>
          Browse Library →
        </div>
      </Link>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ padding: '32px 32px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ width: 220, height: 29, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: 260, height: 13, borderRadius: 4, opacity: 0.6 }} />
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[118, 118, 118].map((w, i) => (
          <div key={i} className="course-card skeleton" style={{ width: w, height: 94, border: BORDER }} />
        ))}
        <div className="course-card skeleton" style={{ flex: 1, minWidth: 160, height: 94, border: BORDER }} />
      </div>
      <div>
        <div className="skeleton" style={{ width: 90, height: 14, borderRadius: 4 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {[1, 2].map(i => (
          <div key={i} className="course-card" style={{ border: BORDER, overflow: 'hidden' }}>
            <div className="skeleton" style={{ height: 3, borderRadius: 0 }} />
            <div className="skeleton" style={{ height: 48, borderRadius: 0 }} />
            <div className="skeleton" style={{ height: 84, borderRadius: 0, marginTop: 1, opacity: 0.45 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
