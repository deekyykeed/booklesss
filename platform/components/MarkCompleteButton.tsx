'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface MarkCompleteButtonProps {
  stepId: string
  userId: string
  initialCompleted: boolean
  accentColor: string
}

export default function MarkCompleteButton({ stepId, userId, initialCompleted, accentColor }: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    if (completed) {
      await supabase.from('step_completions').delete().eq('user_id', userId).eq('step_id', stepId)
      setCompleted(false)
    } else {
      await supabase.from('step_completions').insert({ user_id: userId, step_id: stepId })
      setCompleted(true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={completed ? 'Mark as incomplete' : 'Mark as complete'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        background: completed ? accentColor : '#fff',
        color: completed ? '#fff' : '#6b7280',
        border: `1.5px solid ${completed ? accentColor : '#d1d5db'}`,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        transition: 'all 0.15s',
        opacity: loading ? 0.7 : 1,
      }}
    >
      <CheckIcon filled={completed} />
      {completed ? 'Completed' : 'Mark Complete'}
    </button>
  )
}

function CheckIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      {filled ? (
        <>
          <circle cx="8" cy="8" r="7" fill="rgba(255,255,255,0.25)" />
          <path d="M5 8.5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  )
}
