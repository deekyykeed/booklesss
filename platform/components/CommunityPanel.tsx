'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Tab = 'info' | 'community' | 'files' | 'members'

interface PanelStep {
  slug: string
  title: string
  stepNumber: string
  href: string
  active?: boolean
}

interface CommunityPanelProps {
  lessonTitle: string
  courseId: string
  lessonId: string
  courseName: string
  school: string
  accentColor: string
  userId: string
  steps: PanelStep[]
}

export default function CommunityPanel({ lessonTitle, courseId, lessonId, courseName, school, accentColor, userId, steps }: CommunityPanelProps) {
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
        {tab === 'info' && <InfoTab courseId={courseId} courseName={courseName} school={school} accentColor={accentColor} steps={steps} />}
        {tab === 'community' && <CommunityTab lessonId={lessonId} userId={userId} accentColor={accentColor} />}
        {tab === 'files' && <FilesTab lessonId={lessonId} userId={userId} accentColor={accentColor} />}
        {tab === 'members' && <MembersTab courseId={courseId} />}
      </div>
    </aside>
  )
}

function InfoTab({ courseId, courseName, school, accentColor, steps }: { courseId: string; courseName: string; school: string; accentColor: string; steps: PanelStep[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <SectionLabel>Channel</SectionLabel>
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
            <StepLink
              key={s.slug}
              label={`Step ${s.stepNumber} · ${s.title}`}
              accentColor={accentColor}
              href={s.href}
              active={s.active}
            />
          ))}
        </div>
      )}

      <div>
        <SectionLabel>Activity (last 5 weeks)</SectionLabel>
        <ActivityHeatmap courseId={courseId} />
      </div>
    </div>
  )
}

type Message = { id: string; body: string; created_at: string; user_id: string; profiles: { display_name: string | null } | null }

function CommunityTab({ lessonId, userId, accentColor }: { lessonId: string; userId: string; accentColor: string }) {
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('lesson_messages')
      .select('id, body, created_at, user_id, profiles(display_name)')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true })
      .limit(100)
    setMessages(((data ?? []) as unknown) as Message[])
  }

  useEffect(() => {
    load()
  }, [lessonId])

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setPosting(true)
    const supabase = createClient()
    const { error } = await supabase.from('lesson_messages').insert({ lesson_id: lessonId, user_id: userId, body: body.trim() })
    setPosting(false)
    if (!error) {
      setBody('')
      load()
    }
  }

  if (!messages) return <TabSkeleton />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {messages.length === 0 && (
        <p style={{ fontSize: 12.5, color: '#9ca3af', margin: 0 }}>
          No messages yet — be the first to start the discussion.
        </p>
      )}
      {messages.map((m) => {
        const name = m.profiles?.display_name || 'Student'
        return (
          <div key={m.id} style={{ display: 'flex', gap: 8 }}>
            <Avatar initials={initialsFor(name)} size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>{name}</span>
                <span style={{ fontSize: 10, color: '#9ca3af' }}>{timeAgo(m.created_at)}</span>
              </div>
              <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}>
                {m.body}
              </p>
            </div>
          </div>
        )
      })}

      <form onSubmit={handlePost} style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Post a message…"
          maxLength={2000}
          style={{
            flex: 1, padding: '8px 10px', fontSize: 12,
            border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={posting || !body.trim()}
          style={{
            padding: '8px 12px', fontSize: 12, fontWeight: 700,
            background: accentColor, color: '#fff', border: 'none', borderRadius: 8,
            cursor: posting || !body.trim() ? 'not-allowed' : 'pointer',
            opacity: posting || !body.trim() ? 0.6 : 1,
          }}
        >
          Post
        </button>
      </form>
    </div>
  )
}

type FileRow = { id: string; title: string; url: string; created_at: string; profiles: { display_name: string | null } | null }

function FilesTab({ lessonId, userId, accentColor }: { lessonId: string; userId: string; accentColor: string }) {
  const [files, setFiles] = useState<FileRow[] | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('lesson_files')
      .select('id, title, url, created_at, profiles(display_name)')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })
    setFiles(((data ?? []) as unknown) as FileRow[])
  }

  useEffect(() => {
    load()
  }, [lessonId])

  async function handleShare(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !url.trim()) return
    try {
      new URL(url.trim())
    } catch {
      setError('Enter a valid link (including https://).')
      return
    }
    setPosting(true)
    const supabase = createClient()
    const { error: insertError } = await supabase
      .from('lesson_files')
      .insert({ lesson_id: lessonId, user_id: userId, title: title.trim(), url: url.trim() })
    setPosting(false)
    if (insertError) {
      setError('Could not share that link — try again.')
      return
    }
    setTitle('')
    setUrl('')
    load()
  }

  if (!files) return <TabSkeleton />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {files.length === 0 && (
        <p style={{ fontSize: 12.5, color: '#9ca3af', margin: 0 }}>
          No shared resources yet — add a link below.
        </p>
      )}
      {files.map((f) => (
        <a
          key={f.id}
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: '#f9fafb',
            borderRadius: 8,
            border: '1px solid #f0f0f0',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 32, height: 32, background: '#fee2e2', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <LinkIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {f.title}
            </div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>
              {f.profiles?.display_name || 'Student'} · {timeAgo(f.created_at)}
            </div>
          </div>
        </a>
      ))}

      <form onSubmit={handleShare} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resource title"
          maxLength={200}
          style={{ padding: '8px 10px', fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none' }}
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          style={{ padding: '8px 10px', fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none' }}
        />
        {error && <p style={{ fontSize: 11, color: '#dc2626', margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={posting || !title.trim() || !url.trim()}
          style={{
            padding: '8px 12px', fontSize: 12, fontWeight: 700,
            background: accentColor, color: '#fff', border: 'none', borderRadius: 8,
            cursor: posting ? 'not-allowed' : 'pointer',
            opacity: posting || !title.trim() || !url.trim() ? 0.6 : 1,
          }}
        >
          Share link
        </button>
      </form>
    </div>
  )
}

type RosterMember = { id: string; display_name: string | null; university: string | null }

function MembersTab({ courseId }: { courseId: string }) {
  const [members, setMembers] = useState<RosterMember[] | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.rpc('course_roster', { p_course_id: courseId }).then(({ data }) => {
      setMembers((data ?? []) as RosterMember[])
    })
  }, [courseId])

  if (!members) return <TabSkeleton />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {members.length === 0 && (
        <p style={{ fontSize: 12.5, color: '#9ca3af', margin: 0 }}>No other students enrolled yet.</p>
      )}
      {members.map((m) => {
        const name = m.display_name || 'Student'
        return (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials={initialsFor(name)} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{name}</div>
            </div>
            {m.university && (
              <span
                style={{
                  fontSize: 10, fontWeight: 600, color: '#4b5563', background: '#f3f4f6',
                  padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap',
                }}
              >
                {m.university}
              </span>
            )}
          </div>
        )
      })}
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

function StepLink({ label, accentColor, href, active }: { label: string; accentColor: string; href: string; active?: boolean }) {
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}
    >
      <div
        style={{
          width: 3,
          height: 16,
          background: active ? accentColor : '#e5e7eb',
          borderRadius: 2,
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
      />
      <span style={{ fontSize: 12, color: active ? '#111' : '#6b7280', fontWeight: active ? 700 : 500 }}>
        {label}
      </span>
    </Link>
  )
}

function ActivityHeatmap({ courseId }: { courseId: string }) {
  const [data, setData] = useState<{ day: string; activity_count: number }[] | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.rpc('course_activity_heatmap', { p_course_id: courseId, p_days: 35 }).then(({ data }) => {
      setData((data ?? []) as { day: string; activity_count: number }[])
    })
  }, [courseId])

  if (!data) {
    return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ width: 10, height: 10, borderRadius: 2 }} />
      ))}
    </div>
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
      {data.map((d) => {
        const level = d.activity_count === 0 ? 0 : d.activity_count === 1 ? 1 : d.activity_count <= 3 ? 2 : 3
        return (
          <div
            key={d.day}
            title={`${d.day}: ${d.activity_count} ${d.activity_count === 1 ? 'activity' : 'activities'}`}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background:
                level === 0 ? '#f0f0f0' : level === 1 ? '#bbf7d0' : level === 2 ? '#4ade80' : '#16a34a',
            }}
          />
        )
      })}
    </div>
  )
}

function TabSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton" style={{ height: 32, borderRadius: 8 }} />
      ))}
    </div>
  )
}

function Avatar({ initials, size }: { initials: string; size: number }) {
  const palette = ['#DC2626', '#10B981', '#F59E0B', '#6366f1', '#0EA5E9', '#EC4899']
  const idx = initials.charCodeAt(0) % palette.length
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: palette[idx],
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

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.5 9.5l3-3M6 5.5l.5-.5a2.5 2.5 0 0 1 3.5 3.5l-.5.5M10 10.5l-.5.5a2.5 2.5 0 0 1-3.5-3.5l.5-.5"
        stroke="#DC2626"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
