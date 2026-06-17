'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import SearchOverlay from './SearchOverlay'
import { SidebarMinimalisticLinear } from './icons/solar'

interface SidebarLesson { slug: string; title: string; order_index: number }
interface SidebarCourse {
  slug: string; name: string; school: string; accentColor: string; lessons: SidebarLesson[]
}

export default function AppShell({
  courses,
  userName,
  children,
}: {
  courses: SidebarCourse[]
  userName: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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
      display: 'flex', width: '100%', height: '100vh',
      overflow: 'hidden', backgroundColor: '#f8f8f6', position: 'relative',
    }}>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button onClick={() => setOpen(true)} className="hamburger-btn" aria-label="Open menu" style={{ color: '#0F1F35' }}>
          <SidebarMinimalisticLinear size={20} />
        </button>
        <span style={{
          fontWeight: 700, fontSize: 15, color: '#0F1F35',
          letterSpacing: '-0.01em',
          fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
        }}>
          Booklesss
        </span>
      </div>

      {/* Mobile overlay */}
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
          courses={courses}
          userName={userName}
          onClose={() => setOpen(false)}
          onSearchOpen={() => setSearchOpen(true)}
        />
      </div>

      {/* Main content */}
      <div className="main-content">
        {children}
      </div>

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
