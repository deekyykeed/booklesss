'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const GLOSSARY: Record<string, string> = {
  'competitive advantage':
    'A condition giving a firm superiority over rivals — through cost leadership, differentiation, or focus. Source of above-average returns.',
  'porter\'s five forces':
    'Framework for industry analysis: threat of new entrants, bargaining power of suppliers/buyers, threat of substitutes, and competitive rivalry.',
  'cost leadership':
    'Generic strategy of being the lowest-cost producer in an industry. Achieved through scale, efficiency, or tight cost control.',
  differentiation:
    'Generic strategy of offering products/services perceived as unique across the industry, commanding a price premium.',
  'focus strategy':
    'Generic strategy targeting a narrow market segment with either cost leadership or differentiation applied within that niche.',
  'bargaining power':
    'Degree of control a buyer or supplier can exercise over pricing and terms in a transaction.',
  'switching costs':
    'Costs — financial, time, or psychological — incurred when a customer changes from one supplier to another.',
  'economies of scale':
    'Cost advantages that arise as output increases, spreading fixed costs over more units.',
  'value chain':
    'Sequence of activities that creates and delivers a product or service. Developed by Michael Porter; splits into primary and support activities.',
  'strategic group':
    'Cluster of firms within an industry pursuing similar strategies with similar resources.',
  'first mover advantage':
    'Competitive edge gained by being first to enter a market — brand loyalty, patents, resource acquisition.',
  'vertical integration':
    'Expansion into upstream (supplier) or downstream (distributor) activities in the supply chain.',
  'market share':
    'Proportion of total sales in a market captured by a company, usually measured by revenue or volume.',
  zanaco:
    'Zambia National Commercial Bank — the country\'s largest bank by assets. Listed on LUSDEF.',
  zambeef:
    'Zambeef Products PLC — one of Zambia\'s largest agri-business companies; integrated beef, dairy, and retail operations.',
  zesco:
    'Zambia Electricity Supply Corporation — state-owned power utility responsible for generation, transmission, and distribution.',
  'first quantum':
    'First Quantum Minerals — major copper mining company with significant operations in Zambia (Kansanshi, Sentinel mines).',
  'strategic management':
    'Continuous process of setting objectives, analysing competitive environment, evaluating internal resources, and implementing and monitoring strategies.',
  'mission statement':
    'Formal declaration of an organisation\'s purpose and primary objectives. Guides strategic direction.',
  'swot analysis':
    'Framework examining internal Strengths and Weaknesses, and external Opportunities and Threats.',
  'pestle analysis':
    'Environmental scanning tool: Political, Economic, Social, Technological, Legal, Environmental factors.',
  'generic strategies':
    'Porter\'s three bases for competitive advantage: cost leadership, differentiation, and focus.',
  'resource-based view':
    'Strategic perspective that competitive advantage stems from a firm\'s unique, valuable, and hard-to-imitate internal resources and capabilities.',
  'core competence':
    'Unique bundle of skills and technologies that provide a firm\'s competitive edge and are difficult for rivals to replicate.',
  'strategic alliance':
    'Cooperative arrangement between two or more firms to pursue shared strategic goals while remaining independent.',
}

interface TooltipState {
  term: string
  definition: string
  x: number
  y: number
  above: boolean
}

interface TermTooltipProps {
  containerRef: React.RefObject<HTMLElement | null>
}

export default function TermTooltip({ containerRef }: TermTooltipProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const lookup = useCallback((text: string, rect: DOMRect) => {
    const cleaned = text.trim().toLowerCase().replace(/[^a-z0-9\s']/g, '')
    const match = GLOSSARY[cleaned] ?? null
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
  }, [])

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
          color: '#DC2626',
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
