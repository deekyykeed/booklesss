'use client'

import { useEffect, useRef, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { StudyProfileSettings } from '@/components/study-profile'

// The step page is the whole app: this chrome layers everything else on top
// of the reading column. Header (wordmark, course chip, panel buttons, Clerk
// UserButton), a reading-progress hairline, and three panels — Contents,
// AI tutor, Community. On wide screens the panels are sticky side panes;
// below 1200px they open as full-screen sheets behind a Clerk-style
// backdrop blur. Styles live in app/steps/[slug]/chrome.css (bkc-*).
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

type TocItem = { id: string; label: string; eyebrow: string | null }
type PanelId = 'contents' | 'tutor' | 'community'

const PANEL_TITLES: Record<PanelId, string> = {
  contents: 'Contents',
  tutor: 'AI tutor',
  community: 'Community',
}
const PANEL_ICONS: Record<PanelId, string> = {
  contents: 'ic-doc',
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

export function StepChrome({
  hasClerk,
  courseChip,
  current,
  nav,
  children,
}: {
  hasClerk: boolean
  courseChip: string | null
  current: string
  nav: NavStep[]
  children: React.ReactNode
}) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [discussions, setDiscussions] = useState<string[]>([])
  const [open, setOpen] = useState<PanelId | null>(null)
  const [progress, setProgress] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

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

  // Sheet hygiene: lock body scroll, close on Escape, and close if the
  // viewport grows into the side-pane layout.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    const mq = window.matchMedia('(min-width: 1200px)')
    const onMq = () => mq.matches && setOpen(null)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(null)
  }

  const lessons = [...new Set(nav.map((s) => s.lesson ?? 0))].sort((a, b) => a - b)

  const contentsPanel = (
    <>
      {toc.length > 0 && (
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
      )}
      {nav.length > 0 && (
        <section className="bkc-card">
          <h3 className="bkc-card-label"><Ic id="ic-book-duo" size={16} /> Course steps</h3>
          {lessons.map((l) => (
            <div key={l}>
              {l > 0 && lessons.length > 1 && <p className="bkc-lesson">Lesson {l}</p>}
              <ul className="bkc-chapters">
                {nav
                  .filter((s) => (s.lesson ?? 0) === l)
                  .map((s) => (
                    <li key={s.slug}>
                      <a
                        href={`/steps/${s.slug}`}
                        className={s.slug === current ? 'bkc-current' : undefined}
                        aria-current={s.slug === current ? 'page' : undefined}
                      >
                        {s.step_label && <span className="bkc-steplabel">{s.step_label.replace(/^Step /, '')}</span>}
                        <span>{s.title}</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </>
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
    contents: contentsPanel,
    tutor: tutorPanel,
    community: communityPanel,
  }

  return (
    <div className="bkc-root" ref={rootRef}>
      <header className="bkc-header">
        <a className="bkc-brand" href="/steps">
          <BrandMark />
          <span>Booklesss<span className="bkc-dot">.</span></span>
        </a>
        {courseChip && <span className="bkc-chip">{courseChip}</span>}
        <div className="bkc-actions">
          {(Object.keys(PANEL_TITLES) as PanelId[]).map((id) => (
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
        <aside className="bkc-pane bkc-left" aria-label="Contents">
          {contentsPanel}
        </aside>
        <main className="bkc-main">{children}</main>
        <aside className="bkc-pane bkc-right" aria-label="Community and AI tutor">
          {communityPanel}
          {tutorPanel}
        </aside>
      </div>

      {open && (
        <div className="bkc-sheet-root" role="dialog" aria-modal="true" aria-label={PANEL_TITLES[open]}>
          <div className="bkc-backdrop" onClick={() => setOpen(null)} />
          <div className="bkc-sheet">
            <div className="bkc-sheet-head">
              <h2><Ic id={PANEL_ICONS[open]} size={16} /> {PANEL_TITLES[open]}</h2>
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
