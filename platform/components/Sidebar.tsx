'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  WidgetAddLinear, WidgetAddDuotone,
  WinRarLinear, WinRarDuotone,
  FolderFilesLinear, FolderFilesDuotone,
  LetterLinear, LetterDuotone,
  CalendarLinear, CalendarDuotone,
  SidebarMinimalisticLinear,
} from './icons/solar'

const PRIMARY_NAV = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    exact: true,
    Inactive: () => <WidgetAddLinear size={20} />,
    Active: () => <WidgetAddDuotone size={20} />,
  },
  {
    href: '/library',
    label: 'Library',
    exact: false,
    Inactive: () => <WinRarLinear size={20} />,
    Active: () => <WinRarDuotone size={20} />,
  },
  {
    href: '/saved',
    label: 'Files',
    exact: false,
    Inactive: () => <FolderFilesLinear size={20} />,
    Active: () => <FolderFilesDuotone size={20} />,
  },
  {
    href: '/notifications',
    label: 'Inbox',
    exact: false,
    Inactive: () => <LetterLinear size={20} />,
    Active: () => <LetterDuotone size={20} />,
  },
  {
    href: '/calendar',
    label: 'Calendar',
    exact: false,
    Inactive: () => <CalendarLinear size={20} />,
    Active: () => <CalendarDuotone size={20} />,
  },
]

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
  onSearchOpen?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({
  courses,
  userName,
  onClose,
  onSearchOpen,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(courses.map((c, i) => [c.slug, i === 0]))
  )

  const toggle = (slug: string) =>
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }))

  const initial = userName.charAt(0).toUpperCase()

  useEffect(() => {
    PRIMARY_NAV.forEach(({ href }) => router.prefetch(href))
  }, [router])

  const touchStartX = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX < -50 && onClose) onClose()
  }

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      onClose?.()
    } else {
      onToggleCollapse?.()
    }
  }

  // From Framer nodes: expanded = 208px, collapsed = 48px
  const sidebarWidth = collapsed ? 48 : 208

  return (
    <aside
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        // Framer node: fill: "rgb(252, 252, 252)"
        background: 'rgb(252, 252, 252)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        // Framer node: borderRight: "0.67px", borderColor: "rgb(223,223,223)"
        borderRight: '0.67px solid rgb(223, 223, 223)',
        transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1), min-width 0.2s cubic-bezier(0.4,0,0.2,1)',
      }}>

      {/* Framer node: padding: "8px", gap: "2px" */}
      <div style={{
        flex: 1,
        overflowY: collapsed ? 'hidden' : 'auto',
        overflowX: 'hidden',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        // Framer: stackDistribution: "space-between" → we use a spacer below
        justifyContent: 'space-between',
      }}>

        {/* Top: nav items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

          {/* Booklesss wordmark — only when expanded */}
          {!collapsed && (
            <div style={{
              padding: '6px 8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: 15,
                color: 'rgb(23, 23, 23)',
                letterSpacing: '-0.01em',
              }}>
                Booklesss
              </span>
            </div>
          )}

          {/* Nav items — Framer: padding "6px 8px", gap "8px", radius "6px", squircle "50%" */}
          {PRIMARY_NAV.map(({ href, label, exact, Inactive, Active }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                title={collapsed ? label : undefined}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '8px',
                  // Framer expanded: padding "6px 8px"; collapsed: "6px" all sides (32px square)
                  padding: collapsed ? '6px' : '6px 8px',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  // Framer: active fill "rgb(237, 237, 237)", inactive no fill
                  background: active ? 'rgb(237, 237, 237)' : 'transparent',
                  transition: 'background 0.12s ease',
                  width: collapsed ? 32 : '100%',
                  height: 32,
                  boxSizing: 'border-box',
                }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgb(237, 237, 237)'
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    display: 'flex',
                    // Framer: icon has drop-shadow
                    color: active ? 'rgb(23, 23, 23)' : 'rgb(112, 112, 112)',
                    filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.25))',
                    WebkitFilter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.25))',
                  }}>
                    {active ? <Active /> : <Inactive />}
                  </span>
                  {!collapsed && (
                    // Framer: active fontWeight 500 rgb(23,23,23), inactive 400 rgb(112,112,112)
                    <span style={{
                      flex: 1,
                      fontFamily: 'var(--font-poppins), "Inter", sans-serif',
                      fontSize: 14,
                      fontWeight: active ? 500 : 400,
                      lineHeight: '20px',
                      color: active ? 'rgb(23, 23, 23)' : 'rgb(112, 112, 112)',
                      whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}

          {/* My Courses accordion — only when expanded */}
          {!collapsed && courses.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{
                padding: '4px 8px 6px',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                color: 'rgba(0,0,0,0.28)', textTransform: 'uppercase',
                fontFamily: 'var(--font-poppins), sans-serif',
              }}>
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
                        cursor: 'pointer', textAlign: 'left', borderRadius: 6,
                        height: 32,
                      }}
                    >
                      <ChevronIcon open={isOpen} />
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: course.accentColor, flexShrink: 0,
                      }} />
                      <span style={{
                        color: 'rgb(112, 112, 112)', fontSize: 13, fontWeight: 400,
                        flex: 1, fontFamily: 'var(--font-poppins), sans-serif',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {course.name}
                      </span>
                      <span style={{
                        fontSize: 9, color: 'rgba(0,0,0,0.28)', fontWeight: 600,
                        letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0,
                      }}>
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
                              onClick={onClose}
                              style={{
                                display: 'block', padding: '4px 10px', fontSize: 12,
                                color: active ? 'rgb(23, 23, 23)' : 'rgba(0,0,0,0.45)',
                                background: active ? 'rgb(237, 237, 237)' : 'transparent',
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

          {!collapsed && courses.length === 0 && (
            <div style={{
              color: 'rgba(0,0,0,0.3)', fontSize: 12,
              fontFamily: 'var(--font-poppins), sans-serif', padding: '0 8px', marginTop: 8,
            }}>
              No courses yet —{' '}
              <Link href="/library" onClick={onClose} style={{ color: 'rgb(23, 23, 23)', textDecoration: 'underline' }}>
                browse library
              </Link>
            </div>
          )}
        </div>

        {/* Bottom section — user avatar + toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

          {/* User footer */}
          <Link
            href="/profile"
            onClick={onClose}
            title={collapsed ? userName : undefined}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '8px',
              padding: collapsed ? '6px' : '6px 8px',
              borderRadius: 6,
              width: collapsed ? 32 : '100%',
              height: 32,
              boxSizing: 'border-box',
              background: 'transparent',
              transition: 'background 0.12s ease',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgb(237, 237, 237)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#374151', flexShrink: 0,
                position: 'relative', fontFamily: 'var(--font-poppins), sans-serif',
              }}>
                {initial}
                <span style={{
                  position: 'absolute', bottom: 0, right: 0, width: 6, height: 6,
                  borderRadius: '50%', background: '#22c55e', border: '1.5px solid rgb(252, 252, 252)',
                }} />
              </div>
              {!collapsed && (
                <span style={{
                  flex: 1,
                  fontFamily: 'var(--font-poppins), sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  color: 'rgb(112, 112, 112)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {userName}
                </span>
              )}
            </div>
          </Link>

          {/* Toggle button at bottom — matches Framer bottom toggle icon */}
          <button
            onClick={handleToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              padding: '6px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'rgb(112, 112, 112)',
              transition: 'background 0.12s ease',
              filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.25))',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgb(237, 237, 237)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <SidebarMinimalisticLinear size={20} />
          </button>
        </div>
      </div>
    </aside>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="11" height="11" viewBox="0 0 12 12" fill="none"
      style={{
        transform: open ? 'rotate(90deg)' : 'rotate(0)',
        transition: 'transform 0.15s ease',
        color: 'rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}
    >
      <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
