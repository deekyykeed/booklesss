'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface BookmarkButtonProps {
  stepId: string
  userId: string
  initialBookmarked: boolean
  accentColor: string
}

export default function BookmarkButton({ stepId, userId, initialBookmarked, accentColor }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', userId).eq('step_id', stepId)
      setBookmarked(false)
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, step_id: stepId })
      setBookmarked(true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? 'Remove bookmark' : 'Save this step'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        background: bookmarked ? accentColor : '#fff',
        color: bookmarked ? '#fff' : '#6b7280',
        border: `1.5px solid ${bookmarked ? accentColor : '#d1d5db'}`,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        transition: 'all 0.15s',
        opacity: loading ? 0.7 : 1,
      }}
    >
      <BookmarkIcon filled={bookmarked} />
      {bookmarked ? 'Saved' : 'Save'}
    </button>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill={filled ? 'currentColor' : 'none'}>
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
