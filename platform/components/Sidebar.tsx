'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarLesson {
  slug: string
  title: string
  order_index: number
}

interface SidebarCourse {
  slug: string
  name: string
  school: string
  accentColor: string
  lessons: SidebarLesson[]
}

interface SidebarProps {
  courses: SidebarCourse[]
  userName: string
}

export default function Sidebar({ courses, userName }: SidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(courses.map((c, i) => [c.slug, i === 0]))
  )

  const toggle = (slug: string) =>
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }))

  const initial = userName.charAt(0).toUpperCase()

  return (
    <aside
      style={{
        width: 272,
        minWidth: 272,
        background: '#0F1F35',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Workspace header */}
      <div style={{ padding: '18px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28, height: 28, background: '#DC2626', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0,
            }}
          >B</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>
            Booklesss
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <NavLink href="/dashboard" icon={<HomeIcon />} label="Dashboard" active={pathname === '/dashboard'} />
        <NavLink href="/library" icon={<LibraryIcon />} label="Library" active={pathname === '/library'} />
        <NavLink href="/saved" icon={<SavedIcon />} label="Saved Items" active={pathname === '/saved'} />

        {courses.length > 0 && (
          <>
            <div
              style={{
                padding: '16px 16px 4px', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
              }}
            >
              My Courses
            </div>

            {courses.map((course) => {
              const isOpen = expanded[course.slug]
              return (
                <div key={course.slug}>
                  <button
                    onClick={() => toggle(course.slug)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '5px 16px', background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <ChevronIcon open={isOpen} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: course.accentColor, flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5, fontWeight: 500, flex: 1 }}>
                      {course.name}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.04em' }}>
                      {course.school}
                    </span>
                  </button>

                  {isOpen && (
                    <div>
                      {course.lessons.map((lesson) => {
                        const href = `/courses/${course.slug}/${lesson.slug}`
                        const active = pathname === href
                        return (
                          <Link
                            key={lesson.slug}
                            href={href}
                            style={{
                              display: 'block', padding: '4px 16px 4px 40px', fontSize: 13,
                              color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                              background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                              textDecoration: 'none', borderRadius: 4, margin: '1px 8px',
                            }}
                          >
                            # {lesson.title}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}

        {courses.length === 0 && (
          <div style={{ padding: '16px', color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
            No courses yet —{' '}
            <Link href="/library" style={{ color: '#DC2626', textDecoration: 'none' }}>
              browse library
            </Link>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: '50%', background: '#DC2626',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0, position: 'relative',
          }}
        >
          {initial}
          <span style={{ position: 'absolute', bottom: 1, right: 1, width: 8, height: 8, borderRadius: '50%', background: '#22c55e', border: '1.5px solid #0F1F35' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userName}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Student</div>
        </div>
      </div>
    </aside>
  )
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '5px 16px',
        textDecoration: 'none', borderRadius: 4, margin: '1px 8px',
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
      }}
    >
      <span style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{icon}</span>
      <span style={{ color: active ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: 13.5 }}>{label}</span>
    </Link>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: open ? 'rotate(90deg)' : 'rotate(0)',
        transition: 'transform 0.15s ease',
        color: 'rgba(255,255,255,0.4)',
        flexShrink: 0,
      }}
    >
      <path
        d="M4 2.5l4 3.5-4 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 6.5L8 2l6 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 15V9h4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LibraryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3h3v10H2zM6.5 3h3v10h-3zM11 3h3v10h-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SavedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2h10a1 1 0 0 1 1 1v10.5l-6-3-6 3V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
