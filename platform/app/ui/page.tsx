'use client'

import { useState } from 'react'

// ─── Design tokens ───────────────────────────────────────────────────────────

const COURSES = [
  { name: 'Strategic Management', school: 'ZCAS', cover: '#0F1F35', accent: '#DC2626' },
  { name: 'Treasury Management', school: 'ZCAS', cover: '#0B1D3A', accent: '#10B981' },
  { name: 'Corporate Finance', school: 'ZCAS', cover: '#FFFEF2', accent: '#2FB99A' },
  { name: 'Business Administration', school: 'UNZA', cover: '#1C2526', accent: '#F59E0B' },
]

// ─── Primitives ───────────────────────────────────────────────────────────────

function Btn({
  children,
  variant = 'primary',
  size = 'md',
  accent,
  disabled,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  accent?: string
  disabled?: boolean
}) {
  const pad = size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 28px' : '9px 20px'
  const fs = size === 'sm' ? 11 : size === 'lg' ? 15 : 13

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: pad,
    fontSize: fs,
    fontWeight: 700,
    borderRadius: 8,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s',
    fontFamily: 'var(--font-aptos)',
    letterSpacing: '0.01em',
  }

  const styles: Record<string, React.CSSProperties> = {
    primary: { ...base, background: accent ?? '#0F1F35', color: '#fff' },
    secondary: { ...base, background: 'transparent', color: accent ?? '#0F1F35', border: `1.5px solid ${accent ?? '#0F1F35'}` },
    ghost: { ...base, background: 'transparent', color: '#6b7280', border: '1.5px solid #e5e7eb' },
    danger: { ...base, background: '#DC2626', color: '#fff' },
  }

  return <button style={styles[variant]} disabled={disabled}>{children}</button>
}

function Badge({
  children,
  color,
  bg,
}: {
  children: React.ReactNode
  color?: string
  bg?: string
}) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        background: bg ?? '#f3f4f6',
        color: color ?? '#374151',
        fontFamily: 'var(--font-aptos)',
      }}
    >
      {children}
    </span>
  )
}

function Input({
  label,
  placeholder,
  type = 'text',
}: {
  label: string
  placeholder?: string
  type?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', fontFamily: 'var(--font-aptos)' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        style={{
          padding: '10px 14px',
          fontSize: 14,
          fontFamily: 'var(--font-aptos)',
          border: '1.5px solid #e5e7eb',
          borderRadius: 8,
          outline: 'none',
          color: '#111',
          background: '#fff',
          width: '100%',
        }}
      />
    </div>
  )
}

function CourseCard({ name, school, cover, accent }: { name: string; school: string; cover: string; accent: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          height: 72,
          background: cover,
          borderBottom: `3px solid ${accent}`,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '10px 14px',
        }}
      >
        <Badge color={accent} bg={`${accent}22`}>{school}</Badge>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 14, color: '#0F1F35', marginBottom: 10 }}>
          {name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>4 lessons · 12 steps</span>
          <Btn variant="secondary" size="sm" accent={accent}>Continue →</Btn>
        </div>
      </div>
    </div>
  )
}

function StepRow({ accent }: { accent: string }) {
  const [saved, setSaved] = useState(false)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderLeft: `4px solid ${accent}`,
        borderRadius: 10,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
          Strategic Management
        </div>
        <div style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 14, color: '#0F1F35' }}>
          Step 3.1 — Competitive Strategy
        </div>
      </div>
      <button
        onClick={() => setSaved(!saved)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
          background: saved ? accent : '#fff',
          color: saved ? '#fff' : '#6b7280',
          border: `1.5px solid ${saved ? accent : '#d1d5db'}`,
          borderRadius: 20, fontSize: 11, fontWeight: 700,
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        {saved ? '✓ Saved' : '+ Save'}
      </button>
    </div>
  )
}

function Avatar({ initials, size = 36, color }: { initials: string; size?: number; color: string }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: color, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: size * 0.36,
        fontWeight: 700, color: '#fff', flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
      </div>
      {children}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function UIPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header */}
      <div
        style={{
          background: '#0F1F35',
          padding: '16px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-parastoo)', fontSize: 20, fontWeight: 700, color: '#DC2626' }}>B</span>
        <span style={{ fontFamily: 'var(--font-parastoo)', fontSize: 16, fontWeight: 700, color: '#fff' }}>Booklesss</span>
        <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4b6080', background: '#1a2e48', padding: '2px 8px', borderRadius: 4 }}>
          UI Kit
        </span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '56px 48px' }}>

        {/* Colors */}
        <Section title="Color Palette">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              { label: 'Navy', value: '#0F1F35' },
              { label: 'SM Red', value: '#DC2626' },
              { label: 'TM Emerald', value: '#10B981' },
              { label: 'CF Jade', value: '#2FB99A' },
              { label: 'BBA Amber', value: '#F59E0B' },
            ].map(({ label, value }) => (
              <div key={value}>
                <div style={{ height: 56, borderRadius: 8, background: value, marginBottom: 6, border: '1px solid rgba(0,0,0,0.06)' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{label}</div>
                <div style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace' }}>{value}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>Parastoo Bold — Display / Headings</div>
              <div style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 32, color: '#0F1F35', lineHeight: 1.2 }}>
                Strategic Management
              </div>
            </div>
            <div style={{ height: 1, background: '#f0f0f0' }} />
            <div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>Aptos Regular — Body</div>
              <div style={{ fontFamily: 'var(--font-aptos)', fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
                Porter's Five Forces is a model that identifies and analyses five competitive forces that shape every industry. Understanding this framework helps you diagnose competitive intensity and develop defensible strategy.
              </div>
            </div>
            <div style={{ height: 1, background: '#f0f0f0' }} />
            <div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>Aptos Bold — Labels / Eyebrows</div>
              <div style={{ fontFamily: 'var(--font-aptos)', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#DC2626' }}>
                Competitive Strategy
              </div>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 12 }}>Variants</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Btn variant="primary">Primary</Btn>
                <Btn variant="secondary">Secondary</Btn>
                <Btn variant="ghost">Ghost</Btn>
                <Btn variant="danger">Danger</Btn>
                <Btn variant="primary" disabled>Disabled</Btn>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 12 }}>Sizes</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                <Btn size="sm">Small</Btn>
                <Btn size="md">Medium</Btn>
                <Btn size="lg">Large</Btn>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 12 }}>Course Accents</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {COURSES.map((c) => (
                  <Btn key={c.name} variant="primary" accent={c.accent}>{c.school}</Btn>
                ))}
                {COURSES.map((c) => (
                  <Btn key={`${c.name}-s`} variant="secondary" accent={c.accent}>{c.school}</Btn>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges & Pills">
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Badge>Default</Badge>
            <Badge color="#166534" bg="#dcfce7">Active</Badge>
            <Badge color="#991b1b" bg="#fee2e2">Error</Badge>
            <Badge color="#92400e" bg="#fef3c7">Draft</Badge>
            {COURSES.map((c) => (
              <Badge key={c.name} color={c.accent} bg={`${c.accent}22`}>{c.school}</Badge>
            ))}
            <Badge color="#0F1F35" bg="#e0e7ef">Year 3</Badge>
            <Badge color="#6b7280" bg="#f3f4f6">ZCAS</Badge>
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Form Inputs">
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Email address" placeholder="you@example.com" type="email" />
            <Input label="Password" placeholder="••••••••" type="password" />
            <Input label="Full name" placeholder="Chanda Mwila" />
            <Input label="University" placeholder="ZCAS / UNZA" />
          </div>
        </Section>

        {/* Cards */}
        <Section title="Course Cards">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {COURSES.map((c) => (
              <CourseCard key={c.name} {...c} />
            ))}
          </div>
        </Section>

        {/* Step rows */}
        <Section title="Step Row (Saved / Bookmark)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COURSES.map((c) => (
              <StepRow key={c.name} accent={c.accent} />
            ))}
          </div>
        </Section>

        {/* Avatars */}
        <Section title="Avatars">
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <Avatar initials="CM" size={48} color="#DC2626" />
              <Avatar initials="MK" size={48} color="#10B981" />
              <Avatar initials="BN" size={48} color="#F59E0B" />
              <Avatar initials="TC" size={48} color="#6366f1" />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Avatar initials="DM" size={32} color="#0F1F35" />
              <Avatar initials="CM" size={32} color="#DC2626" />
              <Avatar initials="MK" size={24} color="#10B981" />
              <Avatar initials="BN" size={24} color="#F59E0B" />
            </div>
          </div>
        </Section>

      </div>
    </div>
  )
}
