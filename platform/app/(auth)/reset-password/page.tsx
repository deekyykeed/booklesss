'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, fieldLabel, fieldInput, primaryButton } from '@/components/auth-shell'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/steps')
    router.refresh()
  }

  return (
    <AuthShell
      title="Set a new password"
      description="Choose a new password for your account."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className={fieldLabel}>New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={fieldInput}
          />
        </div>
        <div>
          <label className={fieldLabel}>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="••••••••"
            className={fieldInput}
          />
        </div>

        {error && <p className="m-0 text-[13px] text-[#dc2626]">{error}</p>}

        <button type="submit" disabled={loading} className={primaryButton}>
          {loading ? '…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  )
}
