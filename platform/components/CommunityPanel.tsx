'use client'

import { useState } from 'react'

type Tab = 'info' | 'community' | 'files' | 'members'

interface PanelStep {
  slug: string
  title: string
  stepNumber: string
}

interface CommunityPanelProps {
  lessonTitle: string
  courseName: string
  school: string
  accentColor: string
  steps: PanelStep[]
}

const MEMBERS = [
  { initials: 'CM', name: 'Chanda M.', year: 'Year 3', school: 'ZCAS' },
  { initials: 'MK', name: 'Mwila K.', year: 'Year 4', school: 'ZCAS' },
  { initials: 'BN', name: 'Bupe N.', year: 'Year 3', school: 'ZCAS' },
  { initials: 'TC', name: 'Temwa C.', year: 'Year 2', school: 'UNZA' },
]

const HEAT_DATA = Array.from({ length: 35 }, () => Math.floor(Math.random() * 4))

export default function CommunityPanel({ lessonTitle, courseName, school, accentColor, steps }: CommunityPanelProps) {
  const [tab, setTab] = useState<Tab>('info')

  return (
    <aside
      style={{
        width: 304,
        minWidth: 304,
        background: '#fff',
        borderLeft: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 0',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#111',
            marginBottom: 12,
          }}
        >
          {lessonTitle}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {(['info', 'community', 'files', 'members'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '6px 0',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.03em',
                textTransform: 'capitalize',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: tab === t ? '#0F1F35' : '#9ca3af',
                borderBottom: tab === t ? `2px solid ${accentColor}` : '2px solid transparent',
                transition: 'color 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {tab === 'info' && <InfoTab courseName={courseName} school={school} accentColor={accentColor} steps={steps} />}
        {tab === 'community' && <CommunityTab />}
        {tab === 'files' && <FilesTab />}
        {tab === 'members' && <MembersTab />}
      </div>
    </aside>
  )
}

function InfoTab({ courseName, school, accentColor, steps }: { courseName: string; school: string; accentColor: string; steps: PanelStep[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <SectionLabel>Channel</SectionLabel>
        <MetaRow label="Created by" value="Deeky M." />
        <MetaRow label="Course" value={courseName} />
        <MetaRow label="School" value={school} />
        <MetaRow
          label="Status"
          value={
            <span
              style={{
                background: '#dcfce7',
                color: '#166534',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 10,
                letterSpacing: '0.04em',
              }}
            >
              ACTIVE
            </span>
          }
        />
      </div>

      {steps.length > 0 && (
        <div>
          <SectionLabel>Linked Steps</SectionLabel>
          {steps.map((s) => (
            <StepLink key={s.slug} label={`Step ${s.stepNumber} · ${s.title}`} accentColor={accentColor} />
          ))}
        </div>
      )}

      <div>
        <SectionLabel>Activity (last 5 weeks)</SectionLabel>
        <ActivityHeatmap />
      </div>
    </div>
  )
}

function CommunityTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        {
          initials: 'CM',
          name: 'Chanda M.',
          time: '2h ago',
          msg: "Porter’s Five Forces — the threat of new entrants section in Step 3.1 is so clear. First Quantum example hit different.",
        },
        {
          initials: 'MK',
          name: 'Mwila K.',
          time: '1h ago',
          msg: 'Agreed. The Zambeef example for competitive rivalry made it click for me.',
        },
        {
          initials: 'BN',
          name: 'Bupe N.',
          time: '45m ago',
          msg: 'Discussion Q2 — posting my answer tomorrow. Anyone else doing the NotebookLM audio first?',
        },
      ].map((m, i) => (
        <div key={i} style={{ display: 'flex', gap: 8 }}>
          <Avatar initials={m.initials} size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
                marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>
                {m.name}
              </span>
              <span style={{ fontSize: 10, color: '#9ca3af' }}>{m.time}</span>
            </div>
            <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
              {m.msg}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function FilesTab() {
  const files = [
    { name: 'Step 3.1 — Competitive Strategy.pdf', size: '1.2 MB', date: 'Jun 10' },
    { name: 'Step 3.2 — Porter\'s Five Forces.pdf', size: '980 KB', date: 'Jun 11' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {files.map((f, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: '#f9fafb',
            borderRadius: 8,
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: '#fee2e2',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PdfIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#111',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {f.name}
            </div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>
              {f.size} · {f.date}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MembersTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {MEMBERS.map((m) => (
        <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={m.initials} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{m.name}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{m.school}</div>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#4b5563',
              background: '#f3f4f6',
              padding: '2px 8px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
            }}
          >
            {m.year}
          </span>
        </div>
      ))}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#9ca3af',
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}

function MetaRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 0',
        borderBottom: '1px solid #f9fafb',
      }}
    >
      <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#111', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function StepLink({ label, accentColor }: { label: string; accentColor: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 0',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 3,
          height: 16,
          background: accentColor,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 12, color: '#111', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function ActivityHeatmap() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
      {HEAT_DATA.map((level, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            background:
              level === 0
                ? '#f0f0f0'
                : level === 1
                ? '#bbf7d0'
                : level === 2
                ? '#4ade80'
                : '#16a34a',
          }}
        />
      ))}
    </div>
  )
}

function Avatar({ initials, size }: { initials: string; size: number }) {
  const colors: Record<string, string> = {
    CM: '#DC2626',
    MK: '#10B981',
    BN: '#F59E0B',
    TC: '#6366f1',
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: colors[initials] || '#6b7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 2h7l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
        stroke="#DC2626"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 2v3h3" stroke="#DC2626" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  )
}
