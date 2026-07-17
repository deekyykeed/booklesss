'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { StudyProfileSettings } from '@/components/study-profile'

// The course reads like documentation. This chrome is the docs shell around
// every step: a persistent left sidebar that is the whole course tree
// (lessons → steps, the navigation spine), a header with ⌘K search across the
// course, breadcrumbs + prev/next pagination in the reading column, and a
// right rail of reading aids — On this page, Community, AI tutor. On wide
// screens the sidebar and rail are sticky side panes; below that they open as
// full-screen sheets behind a Clerk-style backdrop blur. Styles live in
// app/steps/[slug]/chrome.css (bkc-*).
//
// Clerk carries the identity surface: the UserButton popover is the account
// menu, and its profile modal (Account / Security / Billing when enabled)
// is the settings popup — we add a "Study profile" page to it rather than
// building our own settings UI.

export type NavStep = {
  slug: string
  title: string
  lesson: number | null
  step_label: string | null
  minutes: number | null
}

export type CourseLink = {
  course_code: string
  label: string
  href: string
}

type TocItem = { id: string; label: string; eyebrow: string | null }
type PanelId = 'nav' | 'onpage' | 'tutor' | 'community'

const PANEL_TITLES: Record<PanelId, string> = {
  nav: 'Course',
  onpage: 'On this page',
  tutor: 'AI tutor',
  community: 'Community',
}
const PANEL_ICONS: Record<PanelId, string> = {
  nav: 'ic-book-duo',
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

function BrandMark() {
  return (
    <svg className="bkc-mark" viewBox="-45 -45 303 303" fill="currentColor" aria-hidden="true">
      <g transform="rotate(45 106.5 106.5)">
        <path fillRule="evenodd" d="M0 0H213V213H0Z M36 36H177V177H36Z" />
        <rect x="71" y="71" width="71" height="71" />
      </g>
    </svg>
  )
}

// Small inline glyphs for docs affordances that aren't in the shell sprite.
function SearchGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function MenuGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

export function StepChrome({
  hasClerk,
  courseChip,
  current,
  nav,
  courses = [],
  currentCourse,
  children,
}: {
  hasClerk: boolean
  courseChip: string | null
  current: string
  nav: NavStep[]
  courses?: CourseLink[]
  currentCourse?: string
  children: React.ReactNode
}) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [discussions, setDiscussions] = useState<string[]>([])
  const [open, setOpen] = useState<PanelId | null>(null)
  const [progress, setProgress] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  // Long courses: collapse every lesson except the one holding the current
  // step, like a docs sidebar that auto-opens the active section.
  const [collapsed, setCollapsed] = useState<Set<number>>(() => {
    const cur = nav.find((s) => s.slug === current)?.lesson ?? 0
    const all = [...new Set(nav.map((s) => s.lesson ?? 0))]
    return new Set(all.filter((l) => l > 0 && l !== cur))
  })
  const rootRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const switcherRef = useRef<HTMLDivElement>(null)

  // Theme lives on the document root (set pre-paint by the boot script in
  // layout.tsx, so no flash and no hydration mismatch). The toggle just flips
  // data-theme and persists — no React state, so the button markup is
  // theme-independent and the sun/moon swap is pure CSS.
  const toggleTheme = () => {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      localStorage.setItem('bkc-theme', next)
    } catch {
      // storage blocked (private mode) — theme still applies for this session
    }
  }

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

  // Global ⌘K / Ctrl+K opens the course search palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Overlay hygiene: lock body scroll while a sheet or search is open, close
  // on Escape, and dismiss side sheets if the viewport grows into the pane
  // layout. Focus the search input when the palette opens.
  useEffect(() => {
    const anyOpen = open || searchOpen
    if (!anyOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null)
        setSearchOpen(false)
      }
    }
    const mq = window.matchMedia('(min-width: 1200px)')
    const onMq = () => mq.matches && setOpen(null)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    if (searchOpen) searchInputRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open, searchOpen])

  // Close the course switcher on outside click or Escape.
  useEffect(() => {
    if (!switcherOpen) return
    const onDown = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSwitcherOpen(false)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [switcherOpen])

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(null)
  }

  const toggleLesson = (l: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(l)) next.delete(l)
      else next.add(l)
      return next
    })

  const lessons = [...new Set(nav.map((s) => s.lesson ?? 0))].sort((a, b) => a - b)

  // Reading order: prev/next neighbours and the current step's own metadata,
  // read straight off the course-ordered nav.
  const flatIndex = nav.findIndex((s) => s.slug === current)
  const currentStep = flatIndex >= 0 ? nav[flatIndex] : null
  const prevStep = flatIndex > 0 ? nav[flatIndex - 1] : null
  const nextStep = flatIndex >= 0 && flatIndex < nav.length - 1 ? nav[flatIndex + 1] : null

  // Course search: match on step label, title, and lesson number.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return nav
    return nav.filter((s) => {
      const hay = `${s.step_label ?? ''} ${s.title} ${s.lesson != null ? `lesson ${s.lesson}` : ''}`.toLowerCase()
      return q.split(/\s+/).every((t) => hay.includes(t))
    })
  }, [query, nav])

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      const pick = results[cursor]
      if (pick) window.location.href = `/steps/${pick.slug}`
    }
  }

  // ── Panels ────────────────────────────────────────────────────────────

  const courseName = (courseChip ?? '').split('·')[0].trim() || courseChip || 'Course'
  const otherCourses = courses.filter((c) => c.course_code !== currentCourse)
  const canSwitch = otherCourses.length > 0

  const switcher = (
    <div className="bkc-switcher" ref={switcherRef}>
      {canSwitch ? (
        <button
          type="button"
          className="bkc-switch-btn"
          aria-haspopup="menu"
          aria-expanded={switcherOpen}
          onClick={() => setSwitcherOpen((v) => !v)}
        >
          <span className="bkc-switch-course">{courseName}</span>
          <svg className="bkc-switch-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <span className="bkc-tree-course">{courseName}</span>
      )}
      {nav.length > 0 && (
        <span className="bkc-tree-count">
          {nav.length} step{nav.length === 1 ? '' : 's'}
        </span>
      )}
      {canSwitch && switcherOpen && (
        <div className="bkc-switch-menu" role="menu">
          <p className="bkc-switch-menu-label">Switch course</p>
          {otherCourses.map((c) => (
            <Link
              key={c.course_code}
              href={c.href}
              className="bkc-switch-item"
              role="menuitem"
              onClick={() => setSwitcherOpen(false)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  const navTree = (
    <nav className="bkc-tree" aria-label="Course contents">
      <div className="bkc-tree-head">{switcher}</div>
      {nav.length === 0 ? (
        <p className="bkc-community-note">Course steps will appear here.</p>
      ) : (
        lessons.map((l) => {
          const items = nav.filter((s) => (s.lesson ?? 0) === l)
          const collapsible = l > 0 && lessons.length > 1
          const isOpen = !collapsed.has(l)
          return (
            <div className="bkc-tree-group" key={l}>
              {collapsible && (
                <button
                  type="button"
                  className="bkc-lesson bkc-lesson-btn"
                  aria-expanded={isOpen}
                  onClick={() => toggleLesson(l)}
                >
                  <svg
                    className={`bkc-lesson-caret${isOpen ? ' bkc-open' : ''}`}
                    width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                  >
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Lesson {l}
                </button>
              )}
              {isOpen && (
                <ul className="bkc-tree-list">
                  {items.map((s) => (
                    <li key={s.slug}>
                      <a
                        href={`/steps/${s.slug}`}
                        className={s.slug === current ? 'bkc-current' : undefined}
                        aria-current={s.slug === current ? 'page' : undefined}
                        onClick={() => setOpen(null)}
                      >
                        {s.step_label && (
                          <span className="bkc-steplabel">{s.step_label.replace(/^Step /, '')}</span>
                        )}
                        <span className="bkc-tree-title">{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })
      )}
    </nav>
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
    nav: navTree,
    onpage: onPageCard || (
      <p className="bkc-community-note">This step has no sections yet.</p>
    ),
    tutor: tutorPanel,
    community: communityPanel,
  }

  const mobileButtons: PanelId[] = ['onpage', 'tutor', 'community']

  return (
    <div className="bkc-root" ref={rootRef}>
      <header className="bkc-header">
        <button
          type="button"
          className="bkc-iconbtn bkc-navtoggle"
          aria-label="Course contents"
          aria-pressed={open === 'nav'}
          onClick={() => setOpen(open === 'nav' ? null : 'nav')}
        >
          <MenuGlyph />
        </button>
        <Link className="bkc-brand" href="/steps">
          <BrandMark />
          <span>Booklesss<span className="bkc-dot">.</span></span>
        </Link>
        {courseChip && <span className="bkc-chip">{courseChip}</span>}

        <button
          type="button"
          className="bkc-search"
          aria-label="Search this course"
          onClick={() => setSearchOpen(true)}
        >
          <SearchGlyph />
          <span className="bkc-search-label">Search this course…</span>
          <kbd className="bkc-kbd">⌘K</kbd>
        </button>

        <div className="bkc-actions">
          {mobileButtons.map((id) => (
            <button
              key={id}
              type="button"
              className="bkc-iconbtn bkc-paneline"
              aria-label={PANEL_TITLES[id]}
              aria-pressed={open === id}
              onClick={() => setOpen(open === id ? null : id)}
            >
              <Ic id={PANEL_ICONS[id]} />
            </button>
          ))}
          <button
            type="button"
            className="bkc-iconbtn bkc-themetoggle"
            aria-label="Toggle light or dark theme"
            onClick={toggleTheme}
          >
            <svg className="bkc-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 2.5v2.2M12 19.3v2.2M4.5 4.5l1.6 1.6M17.9 17.9l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.5 19.5l1.6-1.6M17.9 6.1l1.6-1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <svg className="bkc-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </button>
          {hasClerk && (
            <div className="bkc-user">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: '1.9rem',
                      height: '1.9rem',
                      boxShadow:
                        '0 0 0 1px rgba(24,24,27,0.14), inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 3px rgba(24,24,27,0.18)',
                    },
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    href="/steps"
                    label="All my steps"
                    labelIcon={<Ic id="ic-book" size={15} />}
                  />
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

      <div className="bkc-grid">
        <aside className="bkc-pane bkc-left" aria-label="Course contents">
          {navTree}
        </aside>

        <main className="bkc-main">
          <nav className="bkc-crumb" aria-label="Breadcrumb">
            <Link href="/steps">{courseChip ?? 'Steps'}</Link>
            {currentStep?.lesson != null && currentStep.lesson > 0 && (
              <>
                <Chevron />
                <span>Lesson {currentStep.lesson}</span>
              </>
            )}
            {currentStep && (
              <>
                <Chevron />
                <span className="bkc-crumb-cur">
                  {currentStep.step_label ?? currentStep.title}
                </span>
              </>
            )}
          </nav>

          {children}

          {(prevStep || nextStep) && (
            <nav className="bkc-pager" aria-label="Step navigation">
              {prevStep ? (
                <a className="bkc-pager-btn" href={`/steps/${prevStep.slug}`}>
                  <span className="bkc-pager-dir">← Previous</span>
                  <span className="bkc-pager-title">
                    {prevStep.step_label ? `${prevStep.step_label} · ` : ''}
                    {prevStep.title}
                  </span>
                </a>
              ) : (
                <span />
              )}
              {nextStep ? (
                <a className="bkc-pager-btn bkc-pager-next" href={`/steps/${nextStep.slug}`}>
                  <span className="bkc-pager-dir">Next →</span>
                  <span className="bkc-pager-title">
                    {nextStep.step_label ? `${nextStep.step_label} · ` : ''}
                    {nextStep.title}
                  </span>
                </a>
              ) : (
                <span />
              )}
            </nav>
          )}
        </main>

        <aside className="bkc-pane bkc-right" aria-label="Reading aids">
          {onPageCard}
          {communityPanel}
          {tutorPanel}
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
            <Link className="bkc-rail-link" href="/steps">
              <Ic id="ic-book" size={14} /> All courses
            </Link>
          </div>
        </aside>
      </div>

      {open && (
        <div className="bkc-sheet-root" role="dialog" aria-modal="true" aria-label={PANEL_TITLES[open]}>
          <div className="bkc-backdrop" onClick={() => setOpen(null)} />
          <div className="bkc-sheet">
            <div className="bkc-sheet-head">
              <h2>
                {open === 'nav' ? <MenuGlyph /> : <Ic id={PANEL_ICONS[open]} size={16} />} {PANEL_TITLES[open]}
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

      {searchOpen && (
        <div className="bkc-cmdk-root" role="dialog" aria-modal="true" aria-label="Search this course">
          <div className="bkc-backdrop" onClick={() => setSearchOpen(false)} />
          <div className="bkc-cmdk">
            <div className="bkc-cmdk-input">
              <SearchGlyph />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setCursor(0)
                }}
                onKeyDown={onSearchKey}
                placeholder="Search steps in this course…"
                aria-label="Search steps in this course"
              />
              <kbd className="bkc-kbd">esc</kbd>
            </div>
            <ul className="bkc-cmdk-list">
              {results.length > 0 ? (
                results.map((s, i) => (
                  <li key={s.slug}>
                    <a
                      href={`/steps/${s.slug}`}
                      className={i === cursor ? 'bkc-cmdk-active' : undefined}
                      onMouseEnter={() => setCursor(i)}
                    >
                      <span className="bkc-cmdk-label">
                        {s.step_label && <span className="bkc-cmdk-tag">{s.step_label}</span>}
                        <span>{s.title}</span>
                      </span>
                      {s.lesson != null && s.lesson > 0 && (
                        <span className="bkc-cmdk-meta">Lesson {s.lesson}</span>
                      )}
                    </a>
                  </li>
                ))
              ) : (
                <li className="bkc-cmdk-empty">No steps match &ldquo;{query}&rdquo;.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
