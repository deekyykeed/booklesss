'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, fieldLabel, fieldInput, primaryButton } from '@/components/auth-shell'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function safeNext(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/steps'
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
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            safeNext(searchParams.get('next'))
          )}`,
        },
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
        const next = searchParams.get('next')
        if (next && next.startsWith('/') && !next.startsWith('//')) {
          // may point at a static file (e.g. /steps/*.html), so navigate fully
          window.location.assign(next)
        } else {
          router.push('/steps')
          router.refresh()
        }
      }
    }
  }

  const title =
    mode === 'forgot'
      ? 'Reset your password'
      : mode === 'signup'
        ? 'Create your account'
        : 'Sign in to Booklesss'
  const description =
    mode === 'forgot'
      ? "Enter your email and we'll send you a reset link."
      : 'Smarter notes for Zambian university students.'

  return (
    <AuthShell
      title={title}
      description={description}
      footer={
        mode === 'signin' ? (
          <>
            New here?{' '}
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
              className="font-semibold text-[#0F1F35] underline underline-offset-2"
            >
              Create an account
            </button>
          </>
        ) : mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setMessage(null) }}
              className="font-semibold text-[#0F1F35] underline underline-offset-2"
            >
              Sign in
            </button>
          </>
        ) : null
      }
    >
      {confirmationFailed && (
        <p className="mb-4 text-center text-[13px] text-[#dc2626]">
          That confirmation link is invalid or expired — try signing up again.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className={fieldLabel}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@university.ac.zm"
            className={fieldInput}
          />
        </div>

        {mode !== 'forgot' && (
          <div>
            <div className="flex items-center justify-between">
              <label className={fieldLabel}>Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(null); setMessage(null) }}
                  className="mb-1.5 text-[12px] text-[#6b7280] underline underline-offset-2"
                >
                  Forgot?
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={fieldInput}
            />
          </div>
        )}

        {error && <p className="m-0 text-[13px] text-[#dc2626]">{error}</p>}
        {message && <p className="m-0 text-[13px] text-[#059669]">{message}</p>}

        <button type="submit" disabled={loading} className={primaryButton}>
          {loading
            ? '…'
            : mode === 'signin'
              ? 'Sign in'
              : mode === 'signup'
                ? 'Create account'
                : 'Send reset link'}
        </button>

        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setMessage(null) }}
            className="mt-1 text-[12px] text-[#6b7280]"
          >
            ← Back to sign in
          </button>
        )}
      </form>
    </AuthShell>
  )
}
