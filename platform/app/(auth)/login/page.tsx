'use client'

import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export default function LoginPage() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  return (
    <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#FFFEF2', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative', flexShrink: 0,
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/grain.png)', backgroundSize: '120px', opacity: 0.5,
            }} />
            <img src="/booklesss-mark-black.png" alt="B" style={{ width: 22, height: 22, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 22, color: '#0F1F35' }}>
            Booklesss
          </span>
        </div>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
          Smarter notes for Zambian university students
        </p>
      </div>

      {supabase && (
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0F1F35',
                  brandAccent: '#1e3a5f',
                  brandButtonText: '#ffffff',
                  defaultButtonBackground: '#f5f5f5',
                  defaultButtonBackgroundHover: '#ebebeb',
                  defaultButtonBorder: 'transparent',
                  defaultButtonText: '#1a1a1a',
                  dividerBackground: '#e5e7eb',
                  inputBackground: '#ffffff',
                  inputBorder: '#e5e7eb',
                  inputBorderHover: '#9ca3af',
                  inputBorderFocus: '#0F1F35',
                  inputText: '#1a1a1a',
                  inputPlaceholder: '#b0b0b0',
                  messageText: '#dc2626',
                  messageBackground: '#fef2f2',
                  messageBorder: '#fecaca',
                  anchorTextColor: '#0F1F35',
                  anchorTextHoverColor: '#1e3a5f',
                },
                fonts: {
                  bodyFontFamily: `var(--font-poppins), system-ui, sans-serif`,
                  buttonFontFamily: `var(--font-poppins), system-ui, sans-serif`,
                  inputFontFamily: `var(--font-poppins), system-ui, sans-serif`,
                  labelFontFamily: `var(--font-poppins), system-ui, sans-serif`,
                },
                fontSizes: {
                  baseBodySize: '14px',
                  baseInputSize: '14px',
                  baseLabelSize: '12px',
                  baseButtonSize: '14px',
                },
                space: {
                  spaceSmall: '6px',
                  spaceMedium: '12px',
                  spaceLarge: '16px',
                  labelBottomMargin: '6px',
                  anchorBottomMargin: '4px',
                  emailInputSpacing: '4px',
                  socialAuthSpacing: '4px',
                  buttonPadding: '10px 16px',
                  inputPadding: '10px 14px',
                },
                borderWidths: { buttonBorderWidth: '0px', inputBorderWidth: '1px' },
                radii: {
                  borderRadiusButton: '8px',
                  buttonBorderRadius: '8px',
                  inputBorderRadius: '8px',
                },
              },
            },
            style: {
              button: { fontWeight: '700', letterSpacing: '0.01em' },
              label: { fontWeight: '600', color: '#6b7280', letterSpacing: '0.02em' },
              input: { boxShadow: 'none' },
              anchor: { fontWeight: '500' },
              container: { gap: '14px' },
              divider: { margin: '4px 0' },
            },
          }}
          providers={[]}
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          view="sign_in"
          showLinks
        />
      )}
    </div>
  )
}
