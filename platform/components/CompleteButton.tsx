'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cacheInvalidate } from '@/lib/client-cache'

interface CompleteButtonProps {
  stepId: string
  userId: string
  initialCompleted: boolean
  accentColor: string
  onToggle?: (completed: boolean) => void
}

export default function CompleteButton({ stepId, userId, initialCompleted, accentColor, onToggle }: CompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    if (completed) {
      const { error } = await supabase.from('step_completions').delete().eq('user_id', userId).eq('step_id', stepId)
      if (!error) {
        setCompleted(false)
        onToggle?.(false)
      }
    } else {
      const { error } = await supabase.from('step_completions').insert({ user_id: userId, step_id: stepId })
      if (!error) {
        setCompleted(true)
        onToggle?.(true)
      }
    }
    cacheInvalidate(`dashboard-v5-${userId}`)
    cacheInvalidate(`dashboard-v5-${userId}-completed`)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={completed ? 'Mark as not done' : 'Mark this step complete'}
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
      {completed ? 'Completed' : 'Mark complete'}
    </button>
  )
}

function CheckIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill={filled ? 'currentColor' : 'none'} />
      <path d="M5.5 8.2l1.8 1.8L10.5 6.5" stroke={filled ? '#fff' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
