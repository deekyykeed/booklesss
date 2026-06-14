'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    id: 'sm',
    label: 'Strategic Management',
    school: 'ZCAS',
    accent: '#DC2626',
    slug: 'strategic-management',
    lessons: [
      { slug: '01-foundations',       label: '01 · Foundations of Strategy' },
      { slug: '02-environment',        label: '02 · Business Environment' },
      { slug: '03-competitive-strategy', label: '03 · Competitive Strategy' },
    ],
  },
  {
    id: 'tm',
    label: 'Treasury Management',
    school: 'ZCAS',
    accent: '#10B981',
    slug: 'treasury-management',
    lessons: [
      { slug: '01-operations',    label: '01 · Operations' },
      { slug: '02-working-capital', label: '02 · Working Capital' },
    ],
  },
  {
    id: 'bba',
    label: 'BBA 1110',
    school: 'UNZA',
    accent: '#F59E0B',
    slug: 'bba-1110',
    lessons: [
      { slug: '01-intro-business', label: '01 · Intro to Business' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    sm: true,
    tm: false,
    bba: false,
  })

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

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
      <div
        style={{
          padding: '18px 16px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: '#DC2626',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-parastoo)',
              fontWeight: 700,
              fontSize: 14,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            B
          </div>
          <span
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '-0.01em',
            }}
          >
            Booklesss
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <NavItem icon={<InboxIcon />} label="Inbox" badge={3} />
        <NavItem icon={<DmIcon />} label="Direct Messages" />
        <NavItem icon={<SavedIcon />} label="Saved Items" />

        <div
          style={{
            padding: '16px 16px 4px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
          }}
        >
          Courses
        </div>

        {NAV.map((course) => {
          const isOpen = expanded[course.id]
          return (
            <div key={course.id}>
              <button
                onClick={() => toggle(course.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <ChevronIcon open={isOpen} />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: course.accent,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: 13.5,
                    fontWeight: 500,
                    flex: 1,
                  }}
                >
                  {course.label}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.35)',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
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
                          display: 'block',
                          padding: '4px 16px 4px 40px',
                          fontSize: 13,
                          color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                          background: active
                            ? 'rgba(255,255,255,0.1)'
                            : 'transparent',
                          textDecoration: 'none',
                          borderRadius: 4,
                          margin: '1px 8px',
                        }}
                      >
                        # {lesson.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          D
          <span
            style={{
              position: 'absolute',
              bottom: 1,
              right: 1,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              border: '1.5px solid #0F1F35',
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Deeky M.
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
            Admin
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode
  label: string
  badge?: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 16px',
        cursor: 'pointer',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 13.5,
          flex: 1,
        }}
      >
        {label}
      </span>
      {badge != null && (
        <span
          style={{
            background: '#DC2626',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 10,
            padding: '1px 6px',
          }}
        >
          {badge}
        </span>
      )}
    </div>
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

function InboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1.5 10.5h3l2 2.5 2-2.5h3M1.5 4.5h13M1.5 7.5h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DmIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0zM5 8h.01M8 8h.01M11 8h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SavedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 2h10a1 1 0 0 1 1 1v10.5l-6-3-6 3V3a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
