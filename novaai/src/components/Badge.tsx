import type { ReactNode } from 'react'

/** Left-accent glass badge with a mono uppercase label. */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white backdrop-blur-md">
      {children}
    </span>
  )
}
