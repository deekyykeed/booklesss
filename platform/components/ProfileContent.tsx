'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const UNIVERSITIES = [
  { value: 'ZCAS', label: 'ZCAS — Zambia Centre for Accountancy Studies' },
  { value: 'UNZA', label: 'UNZA — University of Zambia' },
  { value: 'CBU', label: 'CBU — Copperbelt University' },
  { value: 'MU', label: 'MU — Mulungushi University' },
  { value: 'Evelyn Hone', label: 'Evelyn Hone College' },
  { value: 'Other', label: 'Other' },
]

export default function ProfileContent({
  userId,
  email,
  initialDisplayName,
  initialUniversity,
}: {
  userId: string
  email: string
  initialDisplayName: string
  initialUniversity: string
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [university, setUniversity] = useState(initialUniversity)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, display_name: displayName.trim(), university })
    setSaving(false)
    if (error) {
      setError('Could not save your changes — try again.')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    router.refresh()
  }

  async function handleSignOut() {
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError('Could not sign out — try again.')
      return
    }
    router.push('/login')
  }

  const initial = (displayName || email).charAt(0).toUpperCase()

  return (
    <div style={{ padding: '40px 52px', maxWidth: 520, boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
          fontSize: 28, fontWeight: 700, color: '#0a0a0a',
          margin: '0 0 6px', letterSpacing: '-0.02em',
        }}>
          Profile
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0, fontFamily: 'var(--font-poppins), sans-serif' }}>
          Manage your account details.
        </p>
      </div>

      {/* Avatar row */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: '#0F1F35',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, color: '#fff',
          fontFamily: 'var(--font-poppins), sans-serif',
          flexShrink: 0,
        }}>
          {initial}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', fontFamily: 'var(--font-poppins), sans-serif' }}>
            {displayName || email.split('@')[0]}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'var(--font-poppins), sans-serif' }}>
            {email}
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
        <div>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)',
            marginBottom: 7, fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            style={{
              width: '100%', padding: '10px 14px',
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: 8, fontSize: 14,
              color: '#0a0a0a', outline: 'none',
              fontFamily: 'var(--font-poppins), sans-serif',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)',
            marginBottom: 7, fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            University
          </label>
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px',
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: 8, fontSize: 14,
              color: university ? '#0a0a0a' : '#9ca3af', outline: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-poppins), sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select your university</option>
            {UNIVERSITIES.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)',
            marginBottom: 7, fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            Email
          </label>
          <div style={{
            padding: '10px 14px',
            background: '#f9fafb', border: '1px solid #e5e7eb',
            borderRadius: 8, fontSize: 14,
            color: '#9ca3af', fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            {email}
          </div>
          <p style={{ fontSize: 11, color: '#b0b0b0', margin: '6px 0 0', fontFamily: 'var(--font-poppins), sans-serif' }}>
            Email cannot be changed here.
          </p>
        </div>
      </div>

      {error && (
        <p style={{ fontSize: 12.5, color: '#dc2626', margin: '0 0 12px', fontFamily: 'var(--font-poppins), sans-serif' }}>
          {error}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '10px 24px',
            background: saved ? '#10B981' : '#0F1F35',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: saving ? 'default' : 'pointer',
            fontFamily: 'var(--font-poppins), sans-serif',
            transition: 'background 0.2s ease',
          }}
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>

        <button
          onClick={handleSignOut}
          style={{
            padding: '10px 20px',
            background: 'transparent', color: '#ef4444',
            border: '1px solid #fecaca', borderRadius: 8,
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-poppins), sans-serif',
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
