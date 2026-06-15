'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

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
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#f8f8f6', position: 'relative' }}>

      {/* ── Mobile top bar ── */}
      <div className="mobile-topbar">
        <button onClick={() => setOpen(true)} className="hamburger-btn" aria-label="Open menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 5h15M2.5 10h15M2.5 15h15" stroke="#0F1F35" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#0F1F35', letterSpacing: '-0.01em', fontFamily: 'var(--font-poppins), sans-serif' }}>
          Booklesss
        </span>
      </div>

      {/* ── Overlay (mobile) ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 98, backdropFilter: 'blur(1px)' }}
        />
      )}

      {/* ── Sidebar ── */}
      <div className={`sidebar-wrapper${open ? ' sidebar-open' : ''}`}>
        <Sidebar courses={courses} userName={userName} onClose={() => setOpen(false)} />
      </div>

      {/* ── Main content ── */}
      <div className="main-content">
        {children}
      </div>

    </div>
  )
}
