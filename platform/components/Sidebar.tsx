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
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {/* Workspace header */}
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28, height: 28, background: '#FFFEF2', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative', flexShrink: 0,
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/grain.png)', backgroundSize: '120px', opacity: 0.5 }} />
            <img src="/booklesss-mark-black.png" alt="B" style={{ width: 16, height: 16, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
          </div>
          <span style={{ color: '#0F1F35', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>
            Booklesss
          </span>
        </Link>
      </div>

      {/* Nav section — flex col, gap 16px, matches Framer spec */}
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
        {/* Search bar */}
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '10px',
            background: '#ffffff',
            overflow: 'visible',
            gap: 10,
            borderRadius: 16,
            border: '2px solid #e6e6e6',
          }}
        >
          <SearchIcon />
          <span
            style={{
              flex: 1,
              width: '1px',
              fontFamily: 'var(--font-poppins), sans-serif',
              fontWeight: 400,
              color: '#52555d',
              fontSize: 14,
              letterSpacing: 0,
              lineHeight: 1.2,
            }}
          >
            Search
          </span>
          <LayoutPanelIcon />
        </div>

        {/* Primary nav items */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <NavItem href="/dashboard" label="Dashboard" active={pathname === '/dashboard'}
            iconActive={<GridFillIcon />} iconInactive={<GridLineIcon />} />
          <NavItem href="/library" label="Library" active={pathname === '/library'}
            iconActive={<BookFillIcon />} iconInactive={<BookLineIcon />} />
          <NavItem href="/saved" label="Saved" active={pathname === '/saved'}
            iconActive={<BookmarkFillIcon />} iconInactive={<BookmarkLineIcon />} />
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

function NavItem({ href, label, active, iconActive, iconInactive }: {
  href: string; label: string; active: boolean;
  iconActive: React.ReactNode; iconInactive: React.ReactNode
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
      <div
        style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14,
          padding: '12px 14px', borderRadius: 14, width: '100%', boxSizing: 'border-box',
          background: active ? 'rgba(0,0,0,0.07)' : 'transparent',
          transition: 'background 0.12s ease',
        }}
      >
        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {active ? iconActive : iconInactive}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-poppins), sans-serif',
            fontSize: 18,
            fontWeight: active ? 600 : 400,
            color: active ? '#1a1a1a' : '#52555d',
            lineHeight: 1.2,
          }}
        >
          {label}
        </span>
      </div>
    </Link>
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

/* ── MingCute icons via Streamline ── */

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style={{ flexShrink: 0 }}>
      <g fill="none" fillRule="evenodd">
        <path d="M24 0v24H0V0h24Z" />
        <path fill="#52555d" d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2ZM4 10.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z" />
      </g>
    </svg>
  )
}

function LayoutPanelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style={{ flexShrink: 0 }}>
      <g fill="none" fillRule="nonzero">
        <path d="M24 0v24H0V0h24Z" />
        <path fill="#52555d" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8 5H5v14h3V5Zm11 0h-9v14h9V5Zm-4.793 4.172 2.121 2.12a1 1 0 0 1 0 1.415l-2.12 2.121a1 1 0 1 1-1.415-1.414L14.207 12l-1.414-1.414a1 1 0 0 1 1.414-1.414Z" />
      </g>
    </svg>
  )
}

function GridFillIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <g fill="none" fillRule="evenodd">
        <path d="M24 0v24H0V0h24Z" />
        <path fill="#1a1a1a" d="M19 11a2 2 0 0 1 1.995 1.85L21 13v6a2 2 0 0 1-1.85 1.995L19 21h-4a2 2 0 0 1-1.995-1.85L13 19v-6a2 2 0 0 1 1.85-1.995L15 11h4ZM9 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4ZM9 3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4Zm10 0a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4Z" />
      </g>
    </svg>
  )
}

function GridLineIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <g fill="none" fillRule="evenodd">
        <path d="M24 0v24H0V0h24Z" />
        <path fill="#52555d" d="M19 11a2 2 0 0 1 1.995 1.85L21 13v6a2 2 0 0 1-1.85 1.995L19 21h-4a2 2 0 0 1-1.995-1.85L13 19v-6a2 2 0 0 1 1.85-1.995L15 11h4ZM9 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4Zm10-2h-4v6h4v-6ZM9 17H5v2h4v-2ZM9 3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4Zm0 2H5v6h4V5Zm10-2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4Zm0 2h-4v2h4V5Z" />
      </g>
    </svg>
  )
}

function BookFillIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <g fill="none" fillRule="evenodd">
        <path d="M24 0v24H0V0h24Z" />
        <path fill="#1a1a1a" d="M4 5a3 3 0 0 1 3-3h11a2 2 0 0 1 2 2v12.99c0 .168-.038.322-.113.472l-.545 1.09a1 1 0 0 0 0 .895l.543 1.088A1 1 0 0 1 19 22H7a3 3 0 0 1-3-3V5Zm3 13h10.408a3 3 0 0 0 0 2H7a1 1 0 1 1 0-2Zm3-11a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2h-4Z" />
      </g>
    </svg>
  )
}

function BookLineIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <g fill="none" fillRule="nonzero">
        <path d="M24 0v24H0V0h24Z" />
        <path fill="#52555d" d="M18 2a2 2 0 0 1 2 2v12.99c0 .168-.038.322-.113.472l-.545 1.09a1 1 0 0 0 0 .895l.543 1.088A1 1 0 0 1 19 22H7a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h11Zm-.592 16H7a1 1 0 0 0-.117 1.993L7 20h10.408a3.001 3.001 0 0 1-.068-1.782l.068-.218ZM18 4H7a1 1 0 0 0-.993.883L6 5v11.17c.25-.088.516-.144.791-.163L7 16h11V4Zm-4 3a1 1 0 0 1 .117 1.993L14 9h-4a1 1 0 0 1-.117-1.993L10 7h4Z" />
      </g>
    </svg>
  )
}

function BookmarkFillIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <g fill="none" fillRule="nonzero">
        <path d="M24 0v24H0V0h24Z" />
        <path fill="#1a1a1a" d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v16.028c0 1.22-1.38 1.93-2.372 1.221L12 18.229l-5.628 4.02c-.993.71-2.372 0-2.372-1.22V5Z" />
      </g>
    </svg>
  )
}

function BookmarkLineIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <g fill="none" fillRule="evenodd">
        <path d="M24 0v24H0V0h24Z" />
        <path fill="#52555d" d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v16.028c0 1.22-1.38 1.93-2.372 1.221L12 18.229l-5.628 4.02c-.993.71-2.372 0-2.372-1.22V5Zm3-1a1 1 0 0 0-1 1v15.057l5.128-3.663a1.5 1.5 0 0 1 1.744 0L18 20.057V5a1 1 0 0 0-1-1H7Z" />
      </g>
    </svg>
  )
}
