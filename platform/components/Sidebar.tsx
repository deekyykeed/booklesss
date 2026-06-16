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
  MagniferLinear,
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
}

export default function Sidebar({ courses, userName, onClose }: SidebarProps) {
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

  return (
    <aside
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        width: 288,
        minWidth: 288,
        background: 'rgb(255, 255, 255)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        borderRight: '1px solid rgba(0,0,0,0.07)',
      }}>

      {/* Scrollable nav area — gap: 22px, padding: 14px matches Framer */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
      }}>

        {/* Header row — gap: 8px, horizontal, center-aligned */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            flex: 1,
            fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: '#000000',
            lineHeight: '20px',
          }}>
            Booklesss
          </span>

          <button className="squircle-btn" style={{ color: '#0a0a0a' }} aria-label="Search">
            <MagniferLinear size={20} />
          </button>

          <button
            className="squircle-btn"
            style={{ color: '#0a0a0a' }}
            aria-label="Toggle sidebar"
            onClick={onClose}
          >
            <SidebarMinimalisticLinear size={20} />
          </button>
        </div>

        {/* Nav items — gap: 2px between items, vertical stack */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          {PRIMARY_NAV.map(({ href, label, exact, Inactive, Active }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href} onClick={onClose} style={{ textDecoration: 'none', display: 'block' }}>
                <div className={active ? 'nav-item nav-item-active' : 'nav-item'} style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px',
                  overflow: 'clip',
                }}>
                  {/* opacity: 0.7 on inactive, no opacity on active — matches Framer */}
                  <span style={{
                    flexShrink: 0,
                    display: 'flex',
                    opacity: active ? 1 : 0.7,
                    color: '#0a0a0a',
                    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))',
                    WebkitFilter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.25))',
                  }}>
                    {active ? <Active /> : <Inactive />}
                  </span>
                  {/* font: Poppins-regular (400) for both states — matches Framer */}
                  <span style={{
                    flex: 1,
                    fontFamily: 'var(--font-poppins), sans-serif',
                    fontSize: 14,
                    fontWeight: 400,
                    color: active ? '#000000' : 'rgba(0,0,0,0.6)',
                  }}>
                    {label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* My Courses accordion */}
        {courses.length > 0 && (
          <div>
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
                      cursor: 'pointer', textAlign: 'left', borderRadius: 8,
                    }}
                  >
                    <ChevronIcon open={isOpen} />
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: course.accentColor, flexShrink: 0,
                    }} />
                    <span style={{
                      color: 'rgba(0,0,0,0.7)', fontSize: 13, fontWeight: 400,
                      flex: 1, fontFamily: 'var(--font-poppins), sans-serif',
                    }}>
                      {course.name}
                    </span>
                    <span style={{
                      fontSize: 9, color: 'rgba(0,0,0,0.28)', fontWeight: 600,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
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
          <div style={{
            color: 'rgba(0,0,0,0.3)', fontSize: 12,
            fontFamily: 'var(--font-poppins), sans-serif', padding: '0 8px',
          }}>
            No courses yet —{' '}
            <Link href="/library" onClick={onClose} style={{ color: '#0F1F35', textDecoration: 'underline' }}>
              browse library
            </Link>
          </div>
        )}
      </div>

      {/* User footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#374151', flexShrink: 0,
          position: 'relative', fontFamily: 'var(--font-poppins), sans-serif',
        }}>
          {initial}
          <span style={{
            position: 'absolute', bottom: 1, right: 1, width: 8, height: 8,
            borderRadius: '50%', background: '#22c55e', border: '1.5px solid #fff',
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: '#1a1a1a', fontSize: 13, fontWeight: 600,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            {userName}
          </div>
          <div style={{ color: 'rgba(0,0,0,0.35)', fontSize: 11, fontFamily: 'var(--font-poppins), sans-serif' }}>
            Student
          </div>
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
