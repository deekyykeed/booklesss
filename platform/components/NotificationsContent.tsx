'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ActivityItem = {
  id: string
  type: 'bookmark' | 'enroll'
  title: string
  subtitle: string
  href: string
  date: string
  accentColor: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function NotificationsContent({ userId }: { userId: string }) {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [{ data: bookmarks }, { data: enrollments }] = await Promise.all([
        supabase
          .from('bookmarks')
          .select('saved_at, step_id, steps(id, title, slug, lessons(slug, courses(name, slug, accent_color)))')
          .eq('user_id', userId)
          .order('saved_at', { ascending: false })
          .limit(20),
        supabase
          .from('enrollments')
          .select('created_at, courses(id, slug, name, accent_color)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      ])

      const activity: ActivityItem[] = []

      for (const b of bookmarks ?? []) {
        const step = (Array.isArray(b.steps) ? b.steps[0] : b.steps) as unknown as {
          id: string; title: string; slug: string
          lessons: { slug: string; courses: { name: string; slug: string; accent_color: string } | null } | null
        } | null
        if (!step) continue
        const lesson = Array.isArray(step.lessons) ? step.lessons[0] : step.lessons
        const course = lesson ? (Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses) : null
        if (!lesson || !course) continue
        activity.push({
          id: `bm-${b.step_id}`,
          type: 'bookmark',
          title: `Saved "${step.title}"`,
          subtitle: course.name,
          href: `/courses/${course.slug}/${lesson.slug}?step=${step.slug}`,
          date: b.saved_at as string,
          accentColor: course.accent_color,
        })
      }

      for (const e of enrollments ?? []) {
        const course = (Array.isArray(e.courses) ? e.courses[0] : e.courses) as {
          id: string; slug: string; name: string; accent_color: string
        } | null
        if (!course) continue
        activity.push({
          id: `enr-${course.id}`,
          type: 'enroll',
          title: `Enrolled in ${course.name}`,
          subtitle: 'Go to course',
          href: `/courses/${course.slug}`,
          date: e.created_at as string,
          accentColor: course.accent_color,
        })
      }

      activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setItems(activity)
      setLoading(false)
    }
    load()
  }, [userId])

  return (
    <div style={{ padding: '40px 52px', maxWidth: 640, boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
          fontSize: 28, fontWeight: 700, color: '#0a0a0a',
          margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Activity
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0, fontFamily: 'var(--font-poppins), sans-serif' }}>
          Your recent study history.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 10 }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: 14, padding: '52px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
          <p style={{
            color: '#9ca3af', fontSize: 14, margin: 0,
            fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            No activity yet. Start reading and bookmarking to see your history here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map(item => (
            <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: 10, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                borderLeft: `3px solid ${item.accentColor}`,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: item.accentColor + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 16,
                }}>
                  {item.type === 'bookmark' ? '🔖' : '🎓'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500, color: '#1a1a1a',
                    fontFamily: 'var(--font-poppins), sans-serif',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'var(--font-poppins), sans-serif' }}>
                    {item.subtitle}
                  </div>
                </div>
                <div style={{
                  fontSize: 11, color: '#b0b0b0', flexShrink: 0,
                  fontFamily: 'var(--font-poppins), sans-serif',
                }}>
                  {timeAgo(item.date)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
