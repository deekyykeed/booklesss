'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type SearchResult = {
  id: string
  type: 'course' | 'lesson' | 'step'
  title: string
  subtitle: string
  href: string
  accentColor: string
}

const TYPE_LABEL: Record<string, string> = { course: 'Course', lesson: 'Lesson', step: 'Step' }

const ICONS: Record<string, React.ReactNode> = {
  course: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  ),
  lesson: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M7 12h10M7 8h6" />
    </svg>
  ),
  step: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
}

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [allData, setAllData] = useState<SearchResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch all content once on first open
  useEffect(() => {
    if (!open || allData !== null) return
    setLoading(true)
    const supabase = createClient()
    async function fetchAll() {
      const [{ data: courses }, { data: lessons }, { data: steps }] = await Promise.all([
        supabase.from('courses').select('id, slug, name, school, accent_color').order('name'),
        supabase.from('lessons').select('id, slug, title, courses(slug, name, accent_color)').order('title'),
        supabase.from('steps').select('id, slug, title, lessons(slug, courses(slug, name, accent_color))').order('title'),
      ])

      const data: SearchResult[] = []

      for (const c of courses ?? []) {
        data.push({
          id: `course-${c.id}`,
          type: 'course',
          title: c.name,
          subtitle: c.school,
          href: `/courses/${c.slug}`,
          accentColor: c.accent_color,
        })
      }

      for (const l of lessons ?? []) {
        const course = (Array.isArray(l.courses) ? l.courses[0] : l.courses) as {
          slug: string; name: string; accent_color: string
        } | null
        if (!course) continue
        data.push({
          id: `lesson-${l.id}`,
          type: 'lesson',
          title: l.title,
          subtitle: course.name,
          href: `/courses/${course.slug}/${l.slug}`,
          accentColor: course.accent_color,
        })
      }

      for (const s of steps ?? []) {
        const lesson = (Array.isArray(s.lessons) ? s.lessons[0] : s.lessons) as unknown as {
          slug: string; courses: { slug: string; name: string; accent_color: string } | null
        } | null
        if (!lesson) continue
        const course = Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses
        if (!course) continue
        data.push({
          id: `step-${s.id}`,
          type: 'step',
          title: s.title,
          subtitle: course.name,
          href: `/courses/${course.slug}/${lesson.slug}?step=${s.slug}`,
          accentColor: course.accent_color,
        })
      }

      setAllData(data)
      setResults(data.slice(0, 8))
      setLoading(false)
    }
    fetchAll()
  }, [open, allData])

  // Filter on query change
  useEffect(() => {
    if (!allData) return
    const q = query.trim().toLowerCase()
    if (!q) {
      setResults(allData.slice(0, 8))
    } else {
      setResults(
        allData
          .filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.subtitle.toLowerCase().includes(q)
          )
          .slice(0, 12)
      )
    }
    setFocusedIndex(0)
  }, [query, allData])

  // Focus input when opened, reset query when closed
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30)
    } else {
      setQuery('')
      setFocusedIndex(0)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && results[focusedIndex]) {
        window.location.href = results[focusedIndex].href
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, results, focusedIndex])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560, margin: '0 16px',
          background: '#fff', borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px', borderBottom: '1px solid #f3f4f6',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, lessons, steps…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 15, color: '#0a0a0a', background: 'transparent',
              fontFamily: 'var(--font-poppins), sans-serif',
            }}
          />
          <kbd style={{
            fontSize: 10, color: '#9ca3af', background: '#f3f4f6',
            border: '1px solid #e5e7eb', borderRadius: 4,
            padding: '2px 6px', fontFamily: 'monospace',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '6px' }}>
          {loading ? (
            <div style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div style={{
              padding: '36px 16px', textAlign: 'center',
              color: '#9ca3af', fontSize: 14,
              fontFamily: 'var(--font-poppins), sans-serif',
            }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((result, idx) => (
              <Link
                key={result.id}
                href={result.href}
                onClick={onClose}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 8,
                  background: idx === focusedIndex ? '#f9fafb' : 'transparent',
                  transition: 'background 0.1s ease',
                }}
                  onMouseEnter={() => setFocusedIndex(idx)}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: result.accentColor + '18',
                    color: result.accentColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {ICONS[result.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 500, color: '#0a0a0a',
                      fontFamily: 'var(--font-poppins), sans-serif',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {result.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'var(--font-poppins), sans-serif' }}>
                      {result.subtitle}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: result.accentColor,
                    background: result.accentColor + '12', borderRadius: 4,
                    padding: '2px 7px', flexShrink: 0,
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}>
                    {TYPE_LABEL[result.type]}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        {!loading && results.length > 0 && (
          <div style={{
            padding: '9px 18px', borderTop: '1px solid #f3f4f6',
            display: 'flex', gap: 12,
          }}>
            <span style={{ fontSize: 10, color: '#c0c0c0', fontFamily: 'var(--font-poppins), sans-serif' }}>
              ↑↓ navigate · ↵ open · ESC close
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
