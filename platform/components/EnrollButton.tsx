'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cacheInvalidate } from '@/lib/client-cache'

interface EnrollButtonProps {
  courseId: string
  userId: string
  accentColor: string
}

export default function EnrollButton({ courseId, userId, accentColor }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleEnroll() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.from('enrollments').insert({ user_id: userId, course_id: courseId })
    setLoading(false)
    if (error) {
      setError('Could not enrol — try again.')
      return
    }
    cacheInvalidate(`dashboard-v5-${userId}`)
    cacheInvalidate(`dashboard-v5-${userId}-completed`)
    router.refresh()
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        style={{
          padding: '6px 14px',
          background: 'transparent',
          color: accentColor,
          border: `1.5px solid ${accentColor}`,
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Enrolling…' : '+ Enrol'}
      </button>
      {error && <p style={{ fontSize: 10.5, color: '#dc2626', margin: '4px 0 0' }}>{error}</p>}
    </div>
  )
}
