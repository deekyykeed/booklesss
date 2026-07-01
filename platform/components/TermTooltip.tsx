'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

interface TooltipState {
  term: string
  definition: string
  x: number
  y: number
  above: boolean
}

interface TermTooltipProps {
  containerRef: React.RefObject<HTMLElement | null>
  keyTerms: { term: string; definition: string }[]
  accentColor?: string
}

export default function TermTooltip({ containerRef, keyTerms, accentColor = '#DC2626' }: TermTooltipProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Glossary is scoped to the current step's own key terms — keeps tooltips
  // relevant per-course instead of a single global dictionary.
  const glossary = useMemo(() => {
    const map: Record<string, string> = {}
    for (const { term, definition } of keyTerms) {
      map[term.trim().toLowerCase()] = definition
    }
    return map
  }, [keyTerms])

  const lookup = useCallback((text: string, rect: DOMRect) => {
    const cleaned = text.trim().toLowerCase().replace(/[^a-z0-9\s']/g, '')
    const match = glossary[cleaned] ?? null
    if (!match) {
      setTooltip(null)
      return
    }
    const viewportH = window.innerHeight
    const above = rect.top > viewportH / 2
    setTooltip({
      term: text.trim(),
      definition: match,
      x: Math.min(rect.left + rect.width / 2, window.innerWidth - 280),
      y: above ? rect.top + window.scrollY - 8 : rect.bottom + window.scrollY + 8,
      above,
    })
  }, [glossary])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onMouseUp = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) return
      const text = sel.toString()
      if (text.length < 3 || text.length > 60) return
      const range = sel.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      lookup(text, rect)
    }

    const onDblClick = (e: MouseEvent) => {
      const sel = window.getSelection()
      if (!sel) return
      const text = sel.toString()
      const range = sel.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      lookup(text, rect)
    }

    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('dblclick', onDblClick)
    return () => {
      el.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('dblclick', onDblClick)
    }
  }, [containerRef, lookup])

  useEffect(() => {
    const dismiss = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltip(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTooltip(null)
    }
    document.addEventListener('mousedown', dismiss)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  if (!tooltip) return null

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'absolute',
        left: tooltip.x,
        top: tooltip.y,
        transform: tooltip.above
          ? 'translate(-50%, -100%)'
          : 'translate(-50%, 0)',
        zIndex: 1000,
        width: 280,
        background: '#0F1F35',
        color: '#fff',
        borderRadius: 8,
        padding: '12px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: accentColor,
          marginBottom: 4,
        }}
      >
        Term
      </div>
      <div
        style={{
          fontFamily: 'var(--font-parastoo)',
          fontWeight: 700,
          fontSize: 13,
          color: '#fff',
          marginBottom: 6,
          textTransform: 'capitalize',
        }}
      >
        {tooltip.term}
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
        {tooltip.definition}
      </p>
      {tooltip.above && (
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 10,
            height: 6,
            background: '#0F1F35',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
        />
      )}
      {!tooltip.above && (
        <div
          style={{
            position: 'absolute',
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 10,
            height: 6,
            background: '#0F1F35',
            clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
          }}
        />
      )}
    </div>
  )
}
