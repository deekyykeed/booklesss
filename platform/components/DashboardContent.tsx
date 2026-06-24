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

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: 'rgb(255, 255, 255)',
          border: '1px solid rgb(218, 218, 217)',
          borderRadius: 24,
          boxShadow: [
            '0px 0.6px 0.6px -1.25px rgba(0,0,0,0.18)',
            '0px 2.29px 2.29px -2.5px rgba(0,0,0,0.16)',
            '0px 10px 10px -3.75px rgba(0,0,0,0.06)',
          ].join(', '),
          overflow: 'hidden',
          transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = [
            '0px 1px 2px -1px rgba(0,0,0,0.2)',
            '0px 4px 8px -2.5px rgba(0,0,0,0.12)',
            '0px 16px 20px -3.75px rgba(0,0,0,0.07)',
          ].join(', ')
          el.style.borderColor = 'rgb(200, 200, 198)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = [
            '0px 0.6px 0.6px -1.25px rgba(0,0,0,0.18)',
            '0px 2.29px 2.29px -2.5px rgba(0,0,0,0.16)',
            '0px 10px 10px -3.75px rgba(0,0,0,0.06)',
          ].join(', ')
          el.style.borderColor = 'rgb(218, 218, 217)'
        }}
      >
        {/* Header strip */}
        <div style={{
          background: 'linear-gradient(275deg, rgb(243, 243, 243) 0%, rgb(252, 252, 252) 100%)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: course.accent_color,
            boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.25)',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 500,
            color: 'rgb(137, 135, 129)',
            letterSpacing: '0.01em',
          }}>
            {course.school}
          </span>
        </div>

        {/* Body */}
        <div style={{
          borderTop: '1px solid rgb(218, 218, 217)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {/* Course name */}
          <div style={{
            fontFamily: 'var(--font-instrument), "Instrument Sans", Inter, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            lineHeight: '16px',
            color: 'rgb(11, 11, 11)',
          }}>
            {course.name}
          </div>

          {/* Lesson count */}
          <div style={{
            fontFamily: 'var(--font-poppins), Inter, sans-serif',
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '20px',
            color: 'rgb(82, 81, 78)',
          }}>
            {course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''} available
          </div>

          {/* Step count hint */}
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 13,
            lineHeight: '16px',
            color: 'rgb(137, 135, 129)',
          }}>
            Tap to start studying
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
          <div key={i} style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgb(218,218,217)' }}>
            <div className="skeleton" style={{ height: 44, borderRadius: 0 }} />
            <div className="skeleton" style={{ height: 88, borderRadius: 0, marginTop: 1, opacity: 0.5 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
