'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cacheGet, cacheSet } from '@/lib/client-cache'
import {
  CaseMinimalisticLinear,
  FolderFilesLinear,
  ShareCircleLinear,
  CourseUpLinear,
  SettingsLinear,
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

export default function DashboardContent({ userId }: { userId: string; email: string }) {
  const cacheKey = `dashboard-v4-${userId}`
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

  return (
    /*
      Framer node FYfK_675p — Main Content
        fill: rgb(252,252,252)
        padding: 32px 32px 48px 32px
        gap: 28px
        overflow: auto / overflowX: hidden
        stackDirection: vertical  stackAlignment: start
    */
    <div style={{
      background: 'rgb(252, 252, 252)',
      padding: '32px 32px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 28,
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
    }}>

      {/*
        Heading — Framer node OTxfqkcBL
          fontName: Familjen Grotesk  fontWeight: 500  fontSize: 24px
          letterSpacing: -0.6px  lineHeight: 1.2em  textColor: rgb(23,23,23)
          tag: h1
      */}
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
        My Courses
      </h1>

      {/*
        Stats row — Framer node tjBCpf0pk
          stackDirection: horizontal  stackDistribution: space-between  stackAlignment: center  gap: 10
          width: 1fr  height: auto
      */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        flexWrap: 'wrap',
      }}>

        {/*
          Stat card 1 — Framer node u1qe4a_Dj
            135×112px  radius 24px  squircle 50%  padding 12px  gap 12px
            stackDistribution: space-between  stackAlignment: start
            Children: [hidden label] [number row: big-num + unit] [icon 20×20]
        */}
        <div className="course-card" style={{
          border: '1px solid rgb(218, 218, 217)',
          boxShadow: SHADOW,
          background: 'rgb(255, 255, 255)',
          width: 135,
          height: 112,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          {/* hidden label — occupies space so number row is pushed down (Framer: visible:false) */}
          <span style={{ visibility: 'hidden', fontFamily: 'Inter', fontSize: 14, lineHeight: '20px', userSelect: 'none' }}>
            Your courses
          </span>
          {/* number row — stackDistribution:center, stackAlignment:end, gap:2 */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 2, width: '100%', overflow: 'clip' }}>
            <span style={{
              fontFamily: 'var(--font-familjen), "Familjen Grotesk", Inter, sans-serif',
              fontWeight: 500,
              fontSize: 24,
              letterSpacing: '-0.6px',
              lineHeight: '1.2em',
              color: 'rgb(23, 23, 23)',
              userSelect: 'none',
            }}>
              {courses.length}
            </span>
            <span style={{
              fontFamily: '"Satoshi", var(--font-poppins), Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: 'rgb(112, 112, 112)',
              userSelect: 'none',
              flex: 1,
            }}>
              enrolled
            </span>
          </div>
          {/* icon 20×20 */}
          <div style={{ width: 20, height: 20, color: 'rgb(112, 112, 112)', flexShrink: 0 }}>
            <CourseUpLinear size={20} />
          </div>
        </div>

        {/*
          Stat card 2 — Framer node JilpGec4A
            135×112px  radius 24px  squircle 50%  padding 12px  gap 12px
            stackDistribution: space-between
            Children: [label (visible)] [icon 20×20]
        */}
        <div className="course-card" style={{
          border: '1px solid rgb(218, 218, 217)',
          boxShadow: SHADOW,
          background: 'rgb(255, 255, 255)',
          width: 135,
          height: 112,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 14,
            lineHeight: '20px',
            color: 'rgb(112, 112, 112)',
            width: 111,
            userSelect: 'none',
          }}>
            Study Community
          </span>
          <div style={{ width: 20, height: 20, color: 'rgb(112, 112, 112)', flexShrink: 0 }}>
            <ShareCircleLinear size={20} />
          </div>
        </div>

        {/*
          Stat card 3 — Framer node r6ukpCtEA
            200×112px  radius 24px  squircle 50%  padding 12px  gap 12px
            stackDistribution: space-between
            Children: [label (visible)] [progress bar]
            Progress bar outer (W0B5ydwhJ): fill rgb(245,245,245), border, shadow, padding 2px, radius 24px, squircle 50%
            Progress bar inner (UzLfs3tWy): fill rgb(255,255,255), border, shadow, width 56%, height 24px, radius 24px, squircle 50%
        */}
        <div className="course-card" style={{
          border: '1px solid rgb(218, 218, 217)',
          boxShadow: SHADOW,
          background: 'rgb(255, 255, 255)',
          width: 200,
          height: 112,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 14,
            lineHeight: '20px',
            color: 'rgb(112, 112, 112)',
            width: 111,
            userSelect: 'none',
          }}>
            Course progress
          </span>
          {/* outer track */}
          <div className="course-card" style={{
            border: '1px solid rgb(218, 218, 217)',
            boxShadow: SHADOW,
            background: 'rgb(245, 245, 245)',
            padding: 2,
            width: '100%',
            boxSizing: 'border-box',
          }}>
            {/* inner fill bar — 0% placeholder until completion tracking added */}
            {totalLessons > 0 && (
              <div className="course-card" style={{
                border: '1px solid rgb(218, 218, 217)',
                boxShadow: SHADOW,
                background: 'rgb(255, 255, 255)',
                width: `${Math.min(100, Math.round((courses.length / Math.max(1, totalLessons)) * 100 * 5))}%`,
                height: 24,
                minWidth: 28,
              }} />
            )}
          </div>
        </div>

        {/*
          Stat card 4 — Framer node SwBhtyrfH
            135×112px  radius 24px  squircle 50%  padding 12px  gap 12px
            stackDistribution: space-between
            Children: [hidden label] [number row] [icon 20×20]
        */}
        <div className="course-card" style={{
          border: '1px solid rgb(218, 218, 217)',
          boxShadow: SHADOW,
          background: 'rgb(255, 255, 255)',
          width: 135,
          height: 112,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ visibility: 'hidden', fontFamily: 'Inter', fontSize: 14, lineHeight: '20px', userSelect: 'none' }}>
            Available
          </span>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 2, width: '100%', overflow: 'clip' }}>
            <span style={{
              fontFamily: 'var(--font-familjen), "Familjen Grotesk", Inter, sans-serif',
              fontWeight: 500,
              fontSize: 24,
              letterSpacing: '-0.6px',
              lineHeight: '1.2em',
              color: 'rgb(23, 23, 23)',
              userSelect: 'none',
            }}>
              {totalLessons}
            </span>
            <span style={{
              fontFamily: '"Satoshi", var(--font-poppins), Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: 'rgb(112, 112, 112)',
              userSelect: 'none',
              flex: 1,
            }}>
              lessons
            </span>
          </div>
          <div style={{ width: 20, height: 20, color: 'rgb(112, 112, 112)', flexShrink: 0 }}>
            <CaseMinimalisticLinear size={20} />
          </div>
        </div>

        {/*
          Stat card 5 — Framer node q2MbG3KL_
            135×112px  radius 24px  squircle 50%  padding 12px  gap 12px
            stackDistribution: space-between
            Children: [label (visible)] [icon 20×20]
        */}
        <Link href="/settings" style={{ textDecoration: 'none', display: 'block', flexShrink: 0 }}>
          <div className="course-card" style={{
            border: '1px solid rgb(218, 218, 217)',
            boxShadow: SHADOW,
            background: 'rgb(255, 255, 255)',
            width: 135,
            height: 112,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: 'rgb(112, 112, 112)',
              width: 111,
              userSelect: 'none',
            }}>
              Account settings
            </span>
            <div style={{ width: 20, height: 20, color: 'rgb(112, 112, 112)', flexShrink: 0 }}>
              <SettingsLinear size={20} />
            </div>
          </div>
        </Link>

      </div>

      {/* Course cards — BEYvcSwb8 style grid */}
      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 396px))',
          gap: 16,
          width: '100%',
        }}>
          {courses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      )}

    </div>
  )
}

// ── Course card — Framer node BEYvcSwb8 ──────────────────────────────────────
function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      {/*
        border: 1px solid rgb(218,218,217)
        radius: 24px  squircle: 50%  overflow: clip
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
          Header — node yFtBZZaE2
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
          {/* Folder icon — Solar Linear, 20×20, dark */}
          <div style={{ width: 20, height: 20, color: 'rgb(23, 23, 23)', flexShrink: 0 }}>
            <FolderFilesLinear size={20} />
          </div>
        </div>

        {/*
          Body — node SvaBGGjZZ
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
            Title — node AjX1qtiEA
              Instrument Sans  600  16px  lineHeight 1em  rgb(11,11,11)
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
            Description — node OKzShibIK
              Satoshi  500  14px  20px leading  textTruncation:2  rgb(82,81,78)
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
            Date line — node xd8LnRKG_
              Inter  400  13px  16px leading  rgb(137,135,129)
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

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ paddingTop: 8 }}>
      {/*
        MOm84wI6g style — radius 12px (no squircle), padding 16px, gap 16px
          border: 1px solid rgb(218,218,217)  fill: rgb(255,255,255)
          Instrument Sans 500 14px title  Inter 400 14px desc  Inter 400 13px sub
      */}
      <div style={{
        border: '1px solid rgb(218, 218, 217)',
        boxShadow: SHADOW,
        background: 'rgb(255, 255, 255)',
        borderRadius: 12,
        padding: 16,
        gap: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: 396,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: 20, height: 20, color: 'rgb(112, 112, 112)' }}>
          <CaseMinimalisticLinear size={20} />
        </div>
        <div style={{
          fontFamily: 'var(--font-instrument), "Instrument Sans", Inter, sans-serif',
          fontWeight: 500,
          fontSize: 14,
          lineHeight: '1em',
          color: 'rgb(11, 11, 11)',
          userSelect: 'none',
        }}>
          No courses yet
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '20px',
          color: 'rgb(82, 81, 78)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          width: '100%',
        }}>
          Browse the library to find and enrol in your first course.
        </div>
        <Link href="/library" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 13,
            lineHeight: '16px',
            color: 'rgb(137, 135, 129)',
          }}>
            Browse Library →
          </span>
        </Link>
      </div>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ padding: '32px 32px 48px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* heading */}
      <div className="skeleton" style={{ width: 140, height: 29, borderRadius: 6 }} />
      {/* stats row */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[135, 135, 200, 135, 135].map((w, i) => (
          <div key={i} className="course-card skeleton" style={{ width: w, height: 112, border: '1px solid rgb(218,218,217)' }} />
        ))}
      </div>
      {/* card grid */}
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
