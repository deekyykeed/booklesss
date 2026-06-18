'use client'

import Link from 'next/link'

interface PanelStep {
  slug: string
  title: string
  stepNumber: string
  href: string
  active?: boolean
}

interface CommunityPanelProps {
  lessonTitle: string
  courseName: string
  school: string
  accentColor: string
  steps: PanelStep[]
}

export default function CommunityPanel({ lessonTitle, accentColor, steps }: CommunityPanelProps) {
  return (
    <aside
      style={{
        width: 288,
        minWidth: 288,
        background: '#fff',
        borderLeft: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '18px 16px 14px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            marginBottom: 5,
          }}
        >
          In this lesson
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#111',
            lineHeight: 1.35,
          }}
        >
          {lessonTitle}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {steps.map((s) => (
          <Link
            key={s.slug}
            href={s.href}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0' }}
          >
            <div
              style={{
                width: 3,
                minHeight: 16,
                marginTop: 2,
                background: s.active ? accentColor : '#e5e7eb',
                borderRadius: 2,
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: s.active ? '#111' : '#6b7280',
                fontWeight: s.active ? 700 : 400,
                lineHeight: 1.45,
              }}
            >
              <span style={{ color: s.active ? accentColor : '#9ca3af', fontWeight: 700, marginRight: 4 }}>
                {s.stepNumber}
              </span>
              {s.title}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
