'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import SearchOverlay from './SearchOverlay'

export default function AppShell({
  userName,
  children,
}: {
  userName: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored === 'true') setCollapsed(true)
  }, [])

  const toggleCollapse = () => {
    setCollapsed(c => {
      const next = !c
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="app-shell">
      {/* Framer navbar — sticky, always visible at all screen sizes */}
      <Navbar userName={userName} onSearchOpen={() => setSearchOpen(true)} onMenuOpen={() => setOpen(true)} />

      {/* Below navbar: sidebar + main */}
      <div className="content-row">
        {/* Desktop sidebar — hidden on mobile via CSS */}
        <div className="sidebar-desktop">
          <Sidebar
            userName={userName}
            onClose={() => setOpen(false)}
            onSearchOpen={() => setSearchOpen(true)}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />
        </div>

        {/* Main content */}
        <div className="main-content">
          {children}
        </div>
      </div>

      {/* Mobile sidebar — fixed overlay covering full screen including navbar */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.25)', zIndex: 998,
              backdropFilter: 'blur(1px)',
            }}
          />
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: 288, zIndex: 999,
            overflowY: 'auto',
            boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
          }}>
            <Sidebar
              userName={userName}
              onClose={() => setOpen(false)}
              onSearchOpen={() => setSearchOpen(true)}
              collapsed={false}
              onToggleCollapse={toggleCollapse}
            />
          </div>
        </>
      )}

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
