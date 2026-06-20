'use client'
import Link from 'next/link'
import { MagnifyingGlassLinear, BellLinear } from './icons/solar'

interface NavbarProps {
  userName: string
  onSearchOpen?: () => void
}

export default function Navbar({ userName, onSearchOpen }: NavbarProps) {
  const initial = userName.charAt(0).toUpperCase()
  return (
    <header className="desktop-navbar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '48px',
      padding: '0 16px',
      background: '#111111',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      flexShrink: 0,
    }}>
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: '15px',
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '-0.01em',
        }}>
          Booklesss
        </span>
      </div>

      {/* Right: Search + Bell + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={onSearchOpen}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            height: '32px', padding: '0 10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', cursor: 'pointer',
            color: '#707070', fontSize: '12px',
            fontFamily: 'var(--font-poppins), Inter, sans-serif',
            outline: 'none',
          }}
        >
          <MagnifyingGlassLinear size={14} />
          <span>Search...</span>
          <span style={{
            padding: '2px 5px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.02em',
          }}>⌘K</span>
        </button>

        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px', cursor: 'pointer',
          color: '#707070', outline: 'none',
        }}>
          <BellLinear size={16} />
        </button>

        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700,
            color: 'rgba(255,255,255,0.75)',
            fontFamily: 'var(--font-poppins), sans-serif',
            cursor: 'pointer',
          }}>
            {initial}
          </div>
        </Link>
      </div>
    </header>
  )
}
