'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
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
        <Sidebar courses={courses} userName={userName} onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}
