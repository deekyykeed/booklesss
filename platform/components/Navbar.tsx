'use client'
import Link from 'next/link'
import { MagnifyingGlassLinear, QuestionCircleLinear, LightbulbMinimalisticLinear, SidebarMinimalisticLinear } from './icons/solar'

interface NavbarProps {
  userName: string
  onSearchOpen?: () => void
  onMenuOpen?: () => void
}

export default function Navbar({ userName, onSearchOpen, onMenuOpen }: NavbarProps) {
  const initial = userName.charAt(0).toUpperCase()
  return (
    <header
      className="top-navbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgb(252, 252, 252)',
        borderBottom: '0.67px solid rgb(223, 223, 223)',
        flexShrink: 0,
        gap: 10,
      }}
    >
      {/* Left: Logo Group — exact Framer structure */}
      {/* Logo Group: gap 12px between diamond and Icon Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Hamburger — mobile only, opens sidebar */}
        <button
          onClick={onMenuOpen}
          className="navbar-hamburger"
          aria-label="Open menu"
          style={{
            display: 'none', // shown via CSS on mobile
            alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, padding: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgb(112, 112, 112)', borderRadius: 6, flexShrink: 0,
          }}
        >
          <SidebarMinimalisticLinear size={20} />
        </button>

        {/* Diamond — 18×18px black rotated square, white inner, black center */}
        <div className="navbar-logo" style={{ width: 18, height: 18, flexShrink: 0, overflow: 'visible' }}>
          <div style={{
            width: 18, height: 18,
            background: 'rgb(0, 0, 0)',
            transform: 'rotate(45deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '60%', height: '60%',
              background: 'rgb(255, 255, 255)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '60%', height: '60%', background: 'rgb(0, 0, 0)' }} />
            </div>
          </div>
        </div>

        {/* Icon Group: gap 8px — Slash + Layers + Partnership Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Icon 1: Slash (16×16px, strokeWidth 2) */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path stroke="rgb(0,0,0)" strokeWidth="2" strokeLinecap="round" d="M17 5 7 19"/>
          </svg>

          {/* Icon 2: Layers Minimalistic (14×14px, strokeWidth 1.5) */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path stroke="rgb(0,0,0)" strokeWidth="1.5" d="M4.979 9.685C2.993 8.891 2 8.494 2 8s.993-.89 2.979-1.685l2.808-1.123C9.773 4.397 10.767 4 12 4s2.227.397 4.213 1.192l2.808 1.123C21.007 7.109 22 7.506 22 8s-.993.89-2.979 1.685l-2.808 1.123C14.227 11.603 13.233 12 12 12s-2.227-.397-4.213-1.191z"/>
            <path stroke="rgb(0,0,0)" strokeLinecap="round" strokeWidth="1.5" d="M22 12s-.993.89-2.979 1.685l-2.808 1.123C14.227 15.604 13.233 16 12 16s-2.227-.397-4.213-1.191L4.98 13.685C2.993 12.891 2 12 2 12m20 4s-.993.89-2.979 1.685l-2.808 1.123C14.227 19.604 13.233 20 12 20s-2.227-.397-4.213-1.191L4.98 17.685C2.993 16.891 2 16 2 16"/>
          </svg>

          {/* Partnership Group: gap 6px — name + FREE tag + selector icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

            {/* Partner Text: Inter 14px, weight 400, rgb(23,23,23), lineHeight 20px */}
            <span style={{
              fontFamily: 'var(--font-poppins), Inter, sans-serif',
              fontSize: 14,
              fontWeight: 400,
              lineHeight: '20px',
              color: 'rgb(23, 23, 23)',
              userSelect: 'none',
            }}>Booklesss</span>

            {/* Feature Tag: white fill, border 0.67px rgb(212,212,212), 3-layer shadow, padding 3px 5.5px, pill */}
            <div style={{
              border: '0.67px solid rgb(212, 212, 212)',
              boxShadow: '0px 0.6px 0.6px -1.25px rgba(0,0,0,0.18), 0px 2.29px 2.29px -2.5px rgba(0,0,0,0.16), 0px 10px 10px -3.75px rgba(0,0,0,0.06)',
              background: 'rgb(255, 255, 255)',
              padding: '3px 5.5px',
              borderRadius: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Feature Text: Inter 9px, weight 500, letterSpacing 0.63px, uppercase, rgb(82,82,82) */}
              <span style={{
                fontFamily: 'var(--font-poppins), Inter, sans-serif',
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.63px',
                lineHeight: '1em',
                textTransform: 'uppercase',
                color: 'rgb(82, 82, 82)',
                userSelect: 'none',
              }}>Free</span>
            </div>

            {/* Feature Icon Group: 28×34px container with selector icon */}
            <div style={{
              width: 28, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 6, flexShrink: 0,
            }}>
              {/* Selector Vertical Line (up/down arrows, 14×14px) */}
              <svg width="14" height="14" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="rgb(0,0,0)" d="m4.907 6.093.593.592.593-.592a.458.458 0 0 1 .648.648l-.917.916a.46.46 0 0 1-.648 0l-.917-.916a.458.458 0 1 1 .648-.648m0-1.186.593-.592.593.592a.458.458 0 0 0 .648-.648l-.917-.916a.46.46 0 0 0-.648 0l-.917.916a.458.458 0 0 0 .648.648"/>
              </svg>
            </div>

          </div>
        </div>
      </div>

      {/* Right: Action Group — Framer: horizontal stack, gap 15px */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>

        {/* Feedback Text — Inter 12px, weight 400, lineHeight 16px, rgb(82,82,82) */}
        <span className="navbar-feedback" style={{
          fontFamily: 'Inter, var(--font-poppins), sans-serif',
          fontSize: 12, fontWeight: 400, lineHeight: '16px',
          color: 'rgb(82, 82, 82)', userSelect: 'none', whiteSpace: 'nowrap',
        }}>Feedback</span>

        {/* Search Bar Group — Framer: horizontal stack, gap 8px */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Search Input — Framer: 150px min-width desktop, icon-only on phone */}
          <button
            onClick={onSearchOpen}
            className="navbar-search-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              height: 32, padding: '8px',
              background: 'rgb(255, 255, 255)',
              border: '0.67px solid rgb(212, 212, 212)',
              borderRadius: 9999,
              boxShadow: '0px 0.6021873017743928px 0.6021873017743928px -1.25px rgba(0,0,0,0.18), 0px 2.288533303243457px 2.288533303243457px -2.5px rgba(0,0,0,0.16), 0px 10px 10px -3.75px rgba(0,0,0,0.06)',
              cursor: 'pointer', outline: 'none', overflow: 'hidden',
              fontFamily: 'Inter, var(--font-poppins), sans-serif',
            }}
          >
            <span style={{ display: 'flex', flexShrink: 0, color: 'rgb(178, 178, 178)' }}>
              <MagnifyingGlassLinear size={16} />
            </span>
            {/* Placeholder Text — Inter 12px, rgb(178,178,178) */}
            <span className="navbar-search-text" style={{
              flex: 1, textAlign: 'left',
              fontFamily: 'Inter, var(--font-poppins), sans-serif',
              fontSize: 12, fontWeight: 400, lineHeight: '16px',
              color: 'rgb(178, 178, 178)',
            }}>Search...</span>
            {/* ⌘K badge — Inter 11px, letterSpacing -0.275px, width 28px, rgb(112,112,112) */}
            <span className="navbar-search-text" style={{
              width: 28, flexShrink: 0, textAlign: 'center',
              fontFamily: 'Inter, var(--font-poppins), sans-serif',
              fontSize: 11, fontWeight: 400, lineHeight: '11px',
              letterSpacing: '-0.275px',
              color: 'rgb(112, 112, 112)',
            }}>Ctrl K</span>
          </button>

          {/* Notification Button — Framer: 32×32px, pill, white fill */}
          <button className="navbar-notification" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, flexShrink: 0,
            background: 'rgb(255, 255, 255)',
            border: '0.67px solid rgb(212, 212, 212)',
            borderRadius: 9999,
            boxShadow: '0px 0.6021873017743928px 0.6021873017743928px -1.25px rgba(0,0,0,0.18), 0px 2.288533303243457px 2.288533303243457px -2.5px rgba(0,0,0,0.16), 0px 10px 10px -3.75px rgba(0,0,0,0.06)',
            cursor: 'pointer', outline: 'none', overflow: 'hidden',
            color: 'rgb(112, 112, 112)',
          }}>
            <QuestionCircleLinear size={16} />
          </button>

          {/* Profile Button — Framer: 32×32px, pill, white fill, person icon */}
          <button style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, flexShrink: 0,
            background: 'rgb(255, 255, 255)',
            border: '0.67px solid rgb(212, 212, 212)',
            borderRadius: 9999,
            boxShadow: '0px 0.6021873017743928px 0.6021873017743928px -1.25px rgba(0,0,0,0.18), 0px 2.288533303243457px 2.288533303243457px -2.5px rgba(0,0,0,0.16), 0px 10px 10px -3.75px rgba(0,0,0,0.06)',
            cursor: 'pointer', outline: 'none', overflow: 'hidden',
            color: 'rgb(112, 112, 112)',
          }}>
            <LightbulbMinimalisticLinear size={16} />
          </button>

          {/* Avatar Image — Framer: 32×32px, pill, border rgba(0,0,0,0.1), initials */}
          <Link href="/profile" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9999,
              background: 'rgb(237, 237, 237)',
              border: '0.67px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0px 0.6021873017743928px 0.6021873017743928px -1.25px rgba(0,0,0,0.18), 0px 2.288533303243457px 2.288533303243457px -2.5px rgba(0,0,0,0.16), 0px 10px 10px -3.75px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              fontFamily: 'Inter, var(--font-poppins), sans-serif',
              fontSize: 12, fontWeight: 600, color: 'rgb(23, 23, 23)',
              cursor: 'pointer',
            }}>
              {initial}
            </div>
          </Link>

        </div>
      </div>
    </header>
  )
}
