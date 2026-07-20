'use client'

import { useEffect, useRef, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { StudyProfileSettings } from '@/components/study-profile'

// The step page IS the app, and it is the ONLY page. There is deliberately no
// index, no course tree, no course switcher, no step search and no prev/next
// pager: nothing anywhere offers a way to see all the steps or all the courses.
// A student arrives on one step from a Slack link and reads it. If you are
// about to add a browse surface back, don't — see AGENTS.md.
//
// What remains is the reading column plus a right rail of aids for THIS step —
// On this page, Community, AI tutor — and the theme control. Below 1200px the
// rail collapses into one sheet behind a Clerk-style backdrop blur. Styles live
// in app/steps/[slug]/chrome.css (bkc-*).
//
// Clerk carries the identity surface: the UserButton popover is the account
// menu, and its profile modal (Account / Security / Billing when enabled)
// is the settings popup — we add a "Study profile" page to it rather than
// building our own settings UI.

type TocItem = { id: string; label: string; eyebrow: string | null }
// One 'aids' sheet on mobile keeps the header calm; on desktop these live in
// the right rail. 'onpage' is the individually-addressable on-this-page panel.
type PanelId = 'aids' | 'onpage' | 'tutor' | 'community'

const PANEL_TITLES: Record<PanelId, string> = {
  aids: 'This step',
  onpage: 'On this page',
  tutor: 'AI tutor',
  community: 'Community',
}
const PANEL_ICONS: Record<PanelId, string> = {
  aids: 'ic-doc',
  onpage: 'ic-doc',
  tutor: 'ic-stars-duo',
  community: 'ic-chat',
}

function Ic({ id, size = 18 }: { id: string; size?: number }) {
  return (
    <svg width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <use href={`#${id}`} />
    </svg>
  )
}

function Chevron() {
  return (
    <svg className="bkc-crumb-sep" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function MoonGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}
function SunGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.5 4.5l1.6 1.6M17.9 17.9l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.5 19.5l1.6-1.6M17.9 6.1l1.6-1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
function MonitorGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="12" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 20h6M12 16.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function StepChrome({
  hasClerk,
  courseChip,
  current,
  lesson,
  stepLabel,
  children,
}: {
  hasClerk: boolean
  courseChip: string | null
  current: string
  /** This step's own lesson number / label, off its own row — NOT a course
      listing. Used only to say where you are in the breadcrumb. */
  lesson?: number | null
  stepLabel?: string | null
  children: React.ReactNode
}) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [discussions, setDiscussions] = useState<string[]>([])
  const [open, setOpen] = useState<PanelId | null>(null)
  const [progress, setProgress] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  // Theme lives on the document root (set pre-paint by the boot script in
  // layout.tsx, so no flash and no hydration mismatch). `data-theme` is the
  // resolved light/dark; `data-theme-mode` is the chosen mode incl. 'system'.
  // No React state — the active segment highlights via CSS off data-theme-mode,
  // so the markup is theme-independent and hydration-safe.
  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    const root = document.documentElement
    root.dataset.themeMode = mode
    const resolved =
      mode === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : mode
    root.dataset.theme = resolved
    try {
      if (mode === 'system') localStorage.removeItem('bkc-theme')
      else localStorage.setItem('bkc-theme', mode)
    } catch {
      // storage blocked (private mode) — theme still applies for this session
    }
  }

  // While in 'system' mode, track OS theme changes live (DOM writes only).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (document.documentElement.dataset.themeMode === 'system') {
        document.documentElement.dataset.theme = mq.matches ? 'dark' : 'light'
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Build the on-this-page list from the rendered step sections, and lift the
  // step's embedded discussion questions into the Community panel.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('.step-shell .content > section')
    )
    const items: TocItem[] = []
    sections.forEach((sec, i) => {
      const h2 = sec.querySelector('h2')
      if (!h2) return
      if (!sec.id) sec.id = `sec-${i + 1}`
      items.push({
        id: sec.id,
        label: h2.textContent?.trim() ?? `Section ${i + 1}`,
        eyebrow: sec.querySelector('.eyebrow')?.textContent?.trim() ?? null,
      })
    })
    setToc(items)

    setDiscussions(
      Array.from(root.querySelectorAll<HTMLElement>('.step-shell .discuss p'))
        .map((p) => p.textContent?.trim() ?? '')
        .filter(Boolean)
    )

    if (!('IntersectionObserver' in window) || items.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId((e.target as HTMLElement).id)
        }
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )
    sections.forEach((s) => s.id && io.observe(s))
    return () => io.disconnect()
  }, [current])

  // Reading progress under the header.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Sheet hygiene: lock body scroll while open, close on Escape, and dismiss
  // if the viewport grows into the side-pane layout.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    const paneMq = window.matchMedia('(min-width: 1200px)')
    const onPaneMq = () => paneMq.matches && setOpen(null)
    window.addEventListener('keydown', onKey)
    paneMq.addEventListener('change', onPaneMq)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      paneMq.removeEventListener('change', onPaneMq)
    }
  }, [open])

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(null)
  }

  // ── Panels ────────────────────────────────────────────────────────────

  // Theme control — 3-way segmented (dark / light / system). It used to live at
  // the foot of the course sidebar; with that gone it rides in the reading-aid
  // rail, and in the mobile sheet alongside it.
  const themeRow = (
    <div className="bkc-theme-row">
      <span className="bkc-theme-label">Theme</span>
      <div className="bkc-theme-seg" role="group" aria-label="Theme">
        <button type="button" data-mode="dark" className="bkc-theme-opt" aria-label="Dark" onClick={() => setThemeMode('dark')}>
          <MoonGlyph />
        </button>
        <button type="button" data-mode="light" className="bkc-theme-opt" aria-label="Light" onClick={() => setThemeMode('light')}>
          <SunGlyph />
        </button>
        <button type="button" data-mode="system" className="bkc-theme-opt" aria-label="System" onClick={() => setThemeMode('system')}>
          <MonitorGlyph />
        </button>
      </div>
    </div>
  )

  const onPageCard = toc.length > 0 && (
    <section className="bkc-card">
      <h3 className="bkc-card-label"><Ic id="ic-doc" size={16} /> On this page</h3>
      <ul className="bkc-toc">
        {toc.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={jump(t.id)}
              className={t.id === activeId ? 'bkc-active' : undefined}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )

  const tutorPanel = (
    <section className="bkc-card">
      <h3 className="bkc-card-label"><Ic id="ic-stars-duo" size={16} /> AI tutor</h3>
      <div className="bkc-thread">
        <div className="bkc-bubble">
          <b>Muli bwanji!</b>{' '}I&rsquo;m your Booklesss tutor. Chat — text or
          voice — is on its way. Until then, double-tap any word in the step
          and I&rsquo;ll explain it in place, or tap the orb at the bottom
          right to preview voice mode.
        </div>
      </div>
      <div className="bkc-composer">
        <input type="text" placeholder="Ask about this step…" disabled aria-label="Ask the AI tutor (coming soon)" />
        <button type="button" disabled aria-label="Send (coming soon)">
          <Ic id="ic-open" size={17} />
        </button>
      </div>
      <p className="bkc-soon">Tutor chat lands here soon — tap-define already works on every word.</p>
    </section>
  )

  const communityPanel = (
    <section className="bkc-card">
      <h3 className="bkc-card-label"><Ic id="ic-chat" size={16} /> Community</h3>
      {discussions.length > 0 ? (
        discussions.map((q, i) => (
          <blockquote key={i} className="bkc-discussq">
            <span className="bkc-qtag">Discuss</span>
            {q}
          </blockquote>
        ))
      ) : (
        <p className="bkc-community-note">This step has no discussion prompts.</p>
      )}
      <p className="bkc-community-note">
        Take your answer to this step&rsquo;s Slack channel — that&rsquo;s where
        the class is. In-page comments are on the way.
      </p>
    </section>
  )

  const panels: Record<PanelId, React.ReactNode> = {
    aids: (
      <>
        {onPageCard || (
          <p className="bkc-community-note">This step has no sections yet.</p>
        )}
        {communityPanel}
        {tutorPanel}
        {themeRow}
      </>
    ),
    onpage: onPageCard || (
      <p className="bkc-community-note">This step has no sections yet.</p>
    ),
    tutor: tutorPanel,
    community: communityPanel,
  }

  return (
    <div className="bkc-root" ref={rootRef}>
      <header className="bkc-header">
        {/* The wordmark is not a link. There is nowhere to go. */}
        <span className="bkc-brand">Booklesss</span>
        {courseChip && (
          <span className="bkc-chip">{courseChip.split('·')[0].trim()}</span>
        )}

        <div className="bkc-actions">
          <button
            type="button"
            className="bkc-iconbtn bkc-paneline"
            aria-label="This step: on-this-page, community, tutor"
            aria-pressed={open === 'aids'}
            onClick={() => setOpen(open === 'aids' ? null : 'aids')}
          >
            <Ic id="ic-stars-duo" />
          </button>
          {hasClerk && (
            <div className="bkc-user">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: '2rem',
                      height: '2rem',
                      boxShadow:
                        '0 0 0 1px rgba(24,24,27,0.14), inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 3px rgba(24,24,27,0.18)',
                    },
                  },
                }}
              >
                <UserButton.MenuItems>
                  {/* No "all my steps" — there is no index to link to. */}
                  <UserButton.Link
                    href="/pricing"
                    label="Plans & pricing"
                    labelIcon={<Ic id="ic-medal" size={15} />}
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
                <UserButton.UserProfilePage
                  label="Study profile"
                  url="study"
                  labelIcon={<Ic id="ic-bulb" size={15} />}
                >
                  <StudyProfileSettings />
                </UserButton.UserProfilePage>
              </UserButton>
            </div>
          )}
        </div>
      </header>
      <div className="bkc-progress" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="bkc-shell">
        <div className="bkc-grid">
          <main className="bkc-main">
            {/* Breadcrumb names where you are; every part is static text, not
                a link. It reads this step's own lesson/label, not a course
                listing. */}
            <nav className="bkc-crumb" aria-label="Breadcrumb">
              <span>{courseChip ?? 'Booklesss'}</span>
              {lesson != null && lesson > 0 && (
                <>
                  <Chevron />
                  <span>Lesson {lesson}</span>
                </>
              )}
              {stepLabel && (
                <>
                  <Chevron />
                  <span className="bkc-crumb-cur">{stepLabel}</span>
                </>
              )}
            </nav>

            {children}
          </main>

          <aside className="bkc-pane bkc-right" aria-label="Reading aids">
            {onPageCard}
            {communityPanel}
            {tutorPanel}
            {themeRow}
            <div className="bkc-rail-foot">
              <button
                type="button"
                className="bkc-rail-link"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 19V6M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to top
              </button>
            </div>
          </aside>
        </div>
      </div>

      {open && (
        <div className="bkc-sheet-root" role="dialog" aria-modal="true" aria-label={PANEL_TITLES[open]}>
          <div className="bkc-backdrop" onClick={() => setOpen(null)} />
          <div className="bkc-sheet">
            <div className="bkc-sheet-head">
              <h2>
                <Ic id={PANEL_ICONS[open]} size={16} /> {PANEL_TITLES[open]}
              </h2>
              <button
                type="button"
                className="bkc-iconbtn"
                aria-label="Close"
                onClick={() => setOpen(null)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="bkc-sheet-body">{panels[open]}</div>
          </div>
        </div>
      )}
    </div>
  )
}
