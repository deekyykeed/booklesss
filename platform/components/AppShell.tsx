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
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden',
    }}>
      {/* Framer navbar — always visible at all screen sizes */}
      <Navbar userName={userName} onSearchOpen={() => setSearchOpen(true)} onMenuOpen={() => setOpen(true)} />

      {/* Below navbar: sidebar + main */}
      <div style={{
        display: 'flex', flex: 1,
        overflow: 'hidden', backgroundColor: 'rgb(252, 252, 252)', position: 'relative',
      }}>
        {/* Mobile sidebar overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.25)', zIndex: 98,
              backdropFilter: 'blur(1px)',
            }}
          />
        )}

        {/* Sidebar */}
        <div className={`sidebar-wrapper${open ? ' sidebar-open' : ''}`}>
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

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
