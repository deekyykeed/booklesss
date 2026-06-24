'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cacheGet, cacheSet } from '@/lib/client-cache'

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

export default function DashboardContent({ userId }: { userId: string; email: string }) {
  const cacheKey = `dashboard-v3-${userId}`
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

  return (
    <div style={{ padding: '32px 28px 48px', overflowY: 'auto', height: '100%' }}>
      <h1 style={{
        margin: '0 0 24px',
        fontFamily: 'var(--font-instrument), Inter, sans-serif',
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        color: 'rgb(11, 11, 11)',
      }}>
        My Courses
      </h1>

      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 396px))',
          gap: 16,
        }}>
          {courses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      )}
    </div>
  )
}

const SHADOW = '0px 0.6021873017743928px 0.6021873017743928px -1.25px rgba(0,0,0,0.18), 0px 2.288533303243457px 2.288533303243457px -2.5px rgba(0,0,0,0.16), 0px 10px 10px -3.75px rgba(0,0,0,0.06)'
const SHADOW_HOVER = '0px 1px 2px -1px rgba(0,0,0,0.22), 0px 4px 8px -2.5px rgba(0,0,0,0.14), 0px 18px 22px -3.75px rgba(0,0,0,0.08)'

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      {/*
        Framer node BEYvcSwb8:
          border: 1px solid rgb(218,218,217)
          radius: 24px  squircle: 50%  → CSS corner-shape: superellipse(2)
          overflow: clip
          fill: rgb(255,255,255)
          stackDirection: vertical  stackAlignment: start  gap: 0px
      */}
      <div
        className="course-card"
        style={{
          background: 'rgb(255, 255, 255)',
          border: '1px solid rgb(218, 218, 217)',
          boxShadow: SHADOW,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 0,
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
        {/*
          Header strip — Framer node yFtBZZaE2:
            fill: linear-gradient(135deg, rgb(252,252,252) 0%, rgb(243,243,243) 100%)
            padding: 16px
            stackDirection: horizontal  stackDistribution: start  stackAlignment: center  gap: 10
            overflow: clip  width: 1fr
        */}
        <div style={{
          background: 'linear-gradient(135deg, rgb(252, 252, 252) 0%, rgb(243, 243, 243) 100%)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 10,
          overflow: 'clip',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {/*
            Icon — Framer node nsKkH8QPV:
              fill: SVG image (20×20)
              boxShadow: 0px 1px 2px 0px rgba(0,0,0,0.25)
              no radius/squircle on the icon itself
          */}
          <div style={{
            width: 20,
            height: 20,
            background: course.accent_color,
            boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.25)',
            flexShrink: 0,
          }} />
        </div>

        {/*
          Body — Framer node SvaBGGjZZ:
            borderTop: 1px solid rgb(218,218,217)
            fill: rgb(255,255,255)
            padding: 16px  gap: 16px
            stackDirection: vertical  stackAlignment: start  width: 396px
        */}
        <div style={{
          borderTop: '1px solid rgb(218, 218, 217)',
          background: 'rgb(255, 255, 255)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {/*
            Title — Framer node AjX1qtiEA:
              fontName: Instrument Sans  fontWeight: 600  fontSize: 16px
              lineHeight: 1em  letterSpacing: 0em  textColor: rgb(11,11,11)
          */}
          <div style={{
            fontFamily: 'var(--font-instrument), "Instrument Sans", Inter, sans-serif',
            fontWeight: 600,
            fontSize: 16,
            lineHeight: '1em',
            letterSpacing: '0em',
            color: 'rgb(11, 11, 11)',
            userSelect: 'none',
            width: '100%',
          }}>
            {course.name}
          </div>

          {/*
            Description — Framer node OKzShibIK:
              fontName: Satoshi  fontWeight: 500  fontSize: 14px
              lineHeight: 20px  textTruncation: 2  textColor: rgb(82,81,78)
          */}
          <div style={{
            fontFamily: '"Satoshi", var(--font-poppins), Inter, sans-serif',
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '20px',
            letterSpacing: '0em',
            color: 'rgb(82, 81, 78)',
            userSelect: 'none',
            width: '100%',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {course.school}
          </div>

          {/*
            Date line — Framer node xd8LnRKG_:
              fontName: Inter  fontWeight: 400  fontSize: 13px
              lineHeight: 16px  textColor: rgb(137,135,129)
          */}
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 13,
            lineHeight: '16px',
            letterSpacing: '0em',
            color: 'rgb(137, 135, 129)',
            userSelect: 'none',
            width: '100%',
          }}>
            {course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{
        fontFamily: 'var(--font-instrument), Inter, sans-serif',
        fontSize: 15,
        fontWeight: 500,
        color: 'rgb(82, 81, 78)',
        marginBottom: 8,
      }}>
        No courses yet
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
        color: 'rgb(137, 135, 129)',
        lineHeight: '20px',
        marginBottom: 20,
      }}>
        Browse the library to find and enrol in your first course.
      </div>
      <Link href="/library" style={{
        display: 'inline-block',
        padding: '8px 18px',
        background: 'rgb(11, 11, 11)',
        color: '#fff',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        textDecoration: 'none',
        fontFamily: 'Inter, sans-serif',
      }}>
        Browse Library
      </Link>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ padding: '32px 28px' }}>
      <div className="skeleton" style={{ width: 120, height: 20, borderRadius: 6, marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 396px))', gap: 16 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="course-card" style={{ border: '1px solid rgb(218,218,217)' }}>
            <div className="skeleton" style={{ height: 52, borderRadius: 0 }} />
            <div className="skeleton" style={{ height: 100, borderRadius: 0, marginTop: 1, opacity: 0.5 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
