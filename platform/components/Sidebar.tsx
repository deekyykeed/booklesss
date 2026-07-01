'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  HomeLinear,
  BookLinear,
  CalendarLinear,
  BookmarkLinear,
  BellLinear,
  SidebarMinimalisticLinear,
} from './icons/solar'

const PRIMARY_NAV = [
  { href: '/dashboard', label: 'Dashboard', exact: true, Icon: () => <HomeLinear size={20} /> },
  { href: '/library', label: 'Library', exact: false, Icon: () => <BookLinear size={20} /> },
  { href: '/calendar', label: 'Calendar', exact: false, Icon: () => <CalendarLinear size={20} /> },
  { href: '/saved', label: 'Saved', exact: false, Icon: () => <BookmarkLinear size={20} /> },
  { href: '/notifications', label: 'Notifications', exact: false, Icon: () => <BellLinear size={20} /> },
]

interface SidebarProps {
  userName: string
  onClose?: () => void
  onSearchOpen?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({
  userName,
  onClose,
  onSearchOpen,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const initial = userName.charAt(0).toUpperCase()

  useEffect(() => {
    PRIMARY_NAV.forEach(({ href }) => router.prefetch(href))
  }, [router])

  const touchStartX = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX < -50 && onClose) onClose()
  }

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      onClose?.()
    } else {
      onToggleCollapse?.()
    }
  }

  // From Framer nodes: expanded = 208px, collapsed = 48px
  const sidebarWidth = collapsed ? 48 : 208

  return (
    <aside
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        // Framer node: fill: "rgb(252, 252, 252)"
        background: 'rgb(252, 252, 252)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        // Framer node: borderRight: "0.67px", borderColor: "rgb(223,223,223)"
        borderRight: '0.67px solid rgb(223, 223, 223)',
        transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1), min-width 0.2s cubic-bezier(0.4,0,0.2,1)',
      }}>

      {/* Framer node: padding: "8px", gap: "2px" */}
      <div style={{
        flex: 1,
        overflowY: collapsed ? 'hidden' : 'auto',
        overflowX: 'hidden',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        // Framer: stackDistribution: "space-between" → we use a spacer below
        justifyContent: 'space-between',
      }}>

        {/* Top: nav items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

          {/* Nav items */}
          {PRIMARY_NAV.map(({ href, label, exact, Icon }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                title={collapsed ? label : undefined}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '8px',
                  padding: collapsed ? '6px' : '6px 8px',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  background: active ? 'rgb(237, 237, 237)' : 'transparent',
                  transition: 'background 0.12s ease',
                  width: collapsed ? 32 : '100%',
                  height: 32,
                  boxSizing: 'border-box',
                }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgb(237, 237, 237)'
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    display: 'flex',
                    color: active ? 'rgb(23, 23, 23)' : 'rgb(112, 112, 112)',
                  }}>
                    <Icon />
                  </span>
                  {!collapsed && (
                    <span style={{
                      flex: 1,
                      fontFamily: 'var(--font-poppins), "Inter", sans-serif',
                      fontSize: 14,
                      fontWeight: active ? 500 : 400,
                      lineHeight: '20px',
                      color: active ? 'rgb(23, 23, 23)' : 'rgb(112, 112, 112)',
                      whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}

        </div>

        {/* Bottom section — user avatar + toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

          {/* User footer */}
          <Link
            href="/profile"
            onClick={onClose}
            title={collapsed ? userName : undefined}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '8px',
              padding: collapsed ? '6px' : '6px 8px',
              borderRadius: 6,
              width: collapsed ? 32 : '100%',
              height: 32,
              boxSizing: 'border-box',
              background: 'transparent',
              transition: 'background 0.12s ease',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgb(237, 237, 237)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#374151', flexShrink: 0,
                position: 'relative', fontFamily: 'var(--font-poppins), sans-serif',
              }}>
                {initial}
                <span style={{
                  position: 'absolute', bottom: 0, right: 0, width: 6, height: 6,
                  borderRadius: '50%', background: '#22c55e', border: '1.5px solid rgb(252, 252, 252)',
                }} />
              </div>
              {!collapsed && (
                <span style={{
                  flex: 1,
                  fontFamily: 'var(--font-poppins), sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  color: 'rgb(112, 112, 112)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {userName}
                </span>
              )}
            </div>
          </Link>

          {/* Toggle button at bottom — matches Framer bottom toggle icon */}
          <button
            onClick={handleToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              padding: '6px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'rgb(112, 112, 112)',
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgb(237, 237, 237)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <SidebarMinimalisticLinear size={20} />
          </button>
        </div>
      </div>
    </aside>
  )
}

