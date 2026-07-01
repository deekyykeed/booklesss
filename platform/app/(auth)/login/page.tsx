'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const confirmationFailed = searchParams.get('error') === 'confirmation_failed'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Account created — check your email to confirm, then sign in.')
        setMode('signin')
      }
      setLoading(false)
    } else if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for a password reset link.')
      }
      setLoading(false)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    color: '#1a1a1a',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6,
    letterSpacing: '0.02em',
  }

  return (
    <div style={{ width: '100%', maxWidth: 380, padding: '0 24px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: '#FFFEF2',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/grain.png)',
                backgroundSize: '120px',
                opacity: 0.5,
              }}
            />
            <img src="/booklesss-mark-black.png" alt="B" style={{ width: 22, height: 22, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-parastoo)',
              fontWeight: 700,
              fontSize: 22,
              color: '#0F1F35',
            }}
          >
            Booklesss
          </span>
        </div>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
          Smarter notes for Zambian university students
        </p>
      </div>

      {/* Mode toggle */}
      {mode !== 'forgot' && (
        <div style={{ display: 'flex', background: '#e5e7eb', borderRadius: 8, padding: 3, marginBottom: 24 }}>
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(null); setMessage(null) }}
              style={{
                flex: 1, padding: '7px 0', border: 'none', borderRadius: 6,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                background: mode === m ? '#0F1F35' : 'transparent',
                color: mode === m ? '#fff' : '#9ca3af',
              }}
            >
              {m === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>
      )}

      {mode === 'forgot' && (
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 17, color: '#0F1F35', margin: '0 0 4px' }}>
            Reset your password
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>
      )}

      {confirmationFailed && (
        <p style={{ color: '#dc2626', fontSize: 13, margin: '0 0 14px', textAlign: 'center' }}>
          That confirmation link is invalid or expired — try signing up again.
        </p>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@university.ac.zm"
            style={inputStyle}
          />
        </div>
        {mode !== 'forgot' && (
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>
        )}

        {mode === 'signin' && (
          <button
            type="button"
            onClick={() => { setMode('forgot'); setError(null); setMessage(null) }}
            style={{
              alignSelf: 'flex-end', background: 'none', border: 'none',
              color: '#6b7280', fontSize: 12, cursor: 'pointer', padding: 0,
              textDecoration: 'underline',
            }}
          >
            Forgot password?
          </button>
        )}

        {error && (
          <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{error}</p>
        )}
        {message && (
          <p style={{ color: '#059669', fontSize: 13, margin: 0 }}>{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '11px',
            background: loading ? '#374151' : '#0F1F35',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 4,
            transition: 'background 0.15s',
          }}
        >
          {loading ? '…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
        </button>

        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setMessage(null) }}
            style={{
              background: 'none', border: 'none', color: '#6b7280', fontSize: 12,
              cursor: 'pointer', padding: 0, textAlign: 'center',
            }}
          >
            ← Back to sign in
          </button>
        )}
      </form>
    </div>
  )
}
