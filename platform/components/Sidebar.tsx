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
              width: 28, height: 28, background: '#FFFEF2', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative', flexShrink: 0,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/grain.png)', backgroundSize: '120px', opacity: 0.5 }} />
            <img src="/booklesss-mark-black.png" alt="B" style={{ width: 16, height: 16, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
          </div>
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
            <Link href="/library" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'underline' }}>
              browse library
            </Link>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: '50%', background: '#1a2e48',
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
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width="16" height="16">
      <g>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.94c0.001 -0.1388 -0.027 -0.27628 -0.0821 -0.40368 -0.0551 -0.1274 -0.1361 -0.24194 -0.2379 -0.33632L7.00002 0.5 0.820023 6.2c-0.101775 0.09438 -0.182787 0.20892 -0.23788 0.33632S0.499084 6.8012 0.500023 6.94v5.56c0 0.2652 0.105357 0.5196 0.292893 0.7071s0.441894 0.2929 0.707104 0.2929H12.5c0.2652 0 0.5196 -0.1054 0.7071 -0.2929 0.1876 -0.1875 0.2929 -0.4419 0.2929 -0.7071V6.94Z" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7 13.5v-4" strokeWidth="1" />
      </g>
    </svg>
  )
}

function LibraryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width="16" height="16">
      <g>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7 13.5V8.25c0 -0.33152 0.1317 -0.64946 0.36612 -0.88388C7.60054 7.1317 7.91848 7 8.25 7v0c0.33152 0 0.64946 0.1317 0.88388 0.36612 0.23442 0.23442 0.36612 0.55236 0.36612 0.88388V11h2c0.5304 0 1.0391 0.2107 1.4142 0.5858S13.5 12.4696 13.5 13v0.5" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.25739 3.09514C5.01089 1.72345 3.33822 0.812215 1.50977 0.508751 1.38536 0.491132 1.25862 0.500185 1.13798 0.53531 1.01733 0.570434 0.905541 0.630826 0.810029 0.712473 0.712804 0.795633 0.634748 0.898868 0.581232 1.01508c-0.053517 0.1162 -0.081224 0.24263 -0.081216 0.37056v7.13029c-0.001328 0.21897 0.078501 0.43068 0.224081 0.59425 0.145581 0.16357 0.346593 0.26742 0.564233 0.2915 1.42811 0.1937 2.77106 0.75882 3.89996 1.62762" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.25781 5.8584V3.09521" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M11.2264 9.40168c0.2176 -0.02408 0.4186 -0.12793 0.5642 -0.2915s0.2254 -0.37528 0.2241 -0.59425V1.38564c0 -0.12793 -0.0277 -0.25436 -0.0812 -0.37056 -0.0535 -0.116212 -0.1316 -0.219447 -0.2288 -0.302607 -0.0955 -0.081647 -0.2073 -0.142039 -0.328 -0.177163 -0.1206 -0.035125 -0.2473 -0.044178 -0.3718 -0.026559C9.1765 0.812215 7.50383 1.72345 6.25732 3.09514" strokeWidth="1" />
      </g>
    </svg>
  )
}

function SavedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width="16" height="16">
      <g>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m11 13.5 -4 -4 -4 4v-12c0 -0.26522 0.10536 -0.51957 0.29289 -0.707107C3.48043 0.605357 3.73478 0.5 4 0.5h6c0.2652 0 0.5196 0.105357 0.7071 0.292893C10.8946 0.98043 11 1.23478 11 1.5v12Z" strokeWidth="1" />
      </g>
    </svg>
  )
}
