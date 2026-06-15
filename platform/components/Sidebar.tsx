'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavItem from './NavItem'
import {
  HomeGradient, HomeRemix,
  LibraryGradient, LibraryRemix,
  BookmarkGradient, BookmarkRemix,
  SearchRemix,
} from './icons/streamline'

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
  onClose?: () => void
}

export default function Sidebar({ courses, userName, onClose }: SidebarProps) {
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
        background: '#f8f8f6',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        borderRight: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {/* Mobile close button */}
      {onClose && (
        <div className="sidebar-close-row">
          <button onClick={onClose} className="sidebar-close-btn" aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="#0F1F35" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Nav section */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Header: brand + search */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              flex: 1,
              fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: '#000000',
              letterSpacing: 0,
              lineHeight: '20px',
            }}
          >
            Booklesss
          </span>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-label="Search"
          >
            <SearchRemix size={20} />
          </button>
        </div>

        {/* Primary nav items */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <NavItem href="/dashboard" label="Dashboard" active={pathname === '/dashboard'} iconActive={<HomeGradient />} iconInactive={<HomeRemix />} />
          <NavItem href="/library" label="Library" active={pathname === '/library'} iconActive={<LibraryGradient />} iconInactive={<LibraryRemix />} />
          <NavItem href="/saved" label="Saved" active={pathname === '/saved'} iconActive={<BookmarkGradient />} iconInactive={<BookmarkRemix />} />
        </div>

        {/* My Courses */}
        {courses.length > 0 && (
          <div style={{ width: '100%' }}>
            <div
              style={{
                padding: '4px 6px 6px', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.07em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase',
                fontFamily: 'var(--font-poppins), sans-serif',
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
                      padding: '6px 8px', background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left', borderRadius: 8,
                    }}
                  >
                    <ChevronIcon open={isOpen} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: course.accentColor, flexShrink: 0 }} />
                    <span style={{ color: 'rgba(0,0,0,0.7)', fontSize: 13, fontWeight: 500, flex: 1, fontFamily: 'var(--font-poppins), sans-serif' }}>
                      {course.name}
                    </span>
                    <span style={{ fontSize: 9, color: 'rgba(0,0,0,0.28)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {course.school}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ paddingLeft: 22 }}>
                      {course.lessons.map((lesson) => {
                        const href = `/courses/${course.slug}/${lesson.slug}`
                        const active = pathname === href
                        return (
                          <Link
                            key={lesson.slug}
                            href={href}
                            style={{
                              display: 'block', padding: '4px 10px', fontSize: 12,
                              color: active ? '#0F1F35' : 'rgba(0,0,0,0.45)',
                              background: active ? 'rgba(0,0,0,0.06)' : 'transparent',
                              textDecoration: 'none', borderRadius: 6, margin: '1px 0',
                              fontFamily: 'var(--font-poppins), sans-serif',
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
          </div>
        )}

        {courses.length === 0 && (
          <div style={{ width: '100%', color: 'rgba(0,0,0,0.3)', fontSize: 12, fontFamily: 'var(--font-poppins), sans-serif' }}>
            No courses yet —{' '}
            <Link href="/library" style={{ color: '#0F1F35', textDecoration: 'underline' }}>
              browse library
            </Link>
          </div>
        )}
      </div>

      {/* User footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#374151', flexShrink: 0, position: 'relative',
            fontFamily: 'var(--font-poppins), sans-serif',
          }}
        >
          {initial}
          <span style={{ position: 'absolute', bottom: 1, right: 1, width: 8, height: 8, borderRadius: '50%', background: '#22c55e', border: '1.5px solid #f5f5f5' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#1a1a1a', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-poppins), sans-serif' }}>
            {userName}
          </div>
          <div style={{ color: 'rgba(0,0,0,0.35)', fontSize: 11, fontFamily: 'var(--font-poppins), sans-serif' }}>Student</div>
        </div>
      </div>
    </aside>
  )
}


function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.15s ease', color: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
      <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
