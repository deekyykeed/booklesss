'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeGradient, HomeRemix,
  LibraryGradient, LibraryRemix,
  BookmarkGradient, BookmarkRemix,
  BellGradient, BellRemix,
} from './icons/streamline'

const INACTIVE_COLOR = 'rgba(255,255,255,0.38)'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    active: (p: string) => p === '/dashboard',
    ActiveIcon: () => <HomeGradient size={20} />,
    InactiveIcon: () => <HomeRemix size={20} color={INACTIVE_COLOR} />,
  },
  {
    href: '/library',
    label: 'Library',
    active: (p: string) => p.startsWith('/library'),
    ActiveIcon: () => <LibraryGradient size={20} />,
    InactiveIcon: () => <LibraryRemix size={20} color={INACTIVE_COLOR} />,
  },
  {
    href: '/saved',
    label: 'Saved',
    active: (p: string) => p.startsWith('/saved'),
    ActiveIcon: () => <BookmarkGradient size={20} />,
    InactiveIcon: () => <BookmarkRemix size={20} color={INACTIVE_COLOR} />,
  },
  {
    href: '/notifications',
    label: 'Notifications',
    active: (p: string) => p.startsWith('/notifications'),
    ActiveIcon: () => <BellGradient size={20} />,
    InactiveIcon: () => <BellRemix size={20} color={INACTIVE_COLOR} />,
  },
]

const RAIL_BG  = '#0e111e'
const TEAL     = '#0c756f'

export default function IconRail() {
  const pathname = usePathname()

  return (
    <div className="icon-rail" style={{
      width: 64,
      minWidth: 64,
      height: '100vh',
      background: RAIL_BG,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 20,
      flexShrink: 0,
    }}>
      {/* Brand mark */}
      <div style={{
        marginBottom: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
          fontWeight: 900,
          fontSize: 22,
          color: TEAL,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          userSelect: 'none',
        }}>
          b
        </span>
      </div>

      {/* Nav icons — bare icon, no container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ href, label, active, ActiveIcon, InactiveIcon }) => {
          const isActive = active(pathname)
          return (
            <Link
              key={href}
              href={href}
              title={label}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              {isActive ? <ActiveIcon /> : <InactiveIcon />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
