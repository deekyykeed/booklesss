import type { ReactNode } from 'react'

// Branded card shell for the auth pages — the sign-in surface the step gate
// redirects to. Booklesss cream mark + Parastoo wordmark over a clean white
// card, in the Supabase auth-block layout (brand → title → description →
// fields → footer).
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="w-full max-w-[400px]">
      {/* Brand */}
      <div className="mb-6 flex items-center justify-center gap-2.5">
        <span
          className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/[0.06] bg-[#FFFEF2]"
          style={{ ['--sq' as string]: '' }}
        >
          <span
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{ backgroundImage: 'url(/grain.png)', backgroundSize: '120px' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/booklesss-mark-black.png"
            alt="Booklesss"
            className="relative z-10 h-[22px] w-[22px] object-contain"
          />
        </span>
        <span
          className="text-[22px] font-bold text-[#0F1F35]"
          style={{ fontFamily: 'var(--font-parastoo)' }}
        >
          Booklesss
        </span>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border border-[#ececec] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]"
        style={{ ['corner-shape' as string]: 'superellipse(2)' }}
      >
        <div className="mb-6 text-center">
          <h1
            className="m-0 text-[19px] font-bold text-[#0F1F35]"
            style={{ fontFamily: 'var(--font-parastoo)' }}
          >
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-1.5 max-w-[300px] text-[13px] leading-snug text-[#9ca3af]">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>

      {footer && (
        <p className="mt-5 text-center text-[13px] text-[#9ca3af]">{footer}</p>
      )}
    </div>
  )
}

// Shared field + control classes so login and reset match exactly.
export const fieldLabel =
  'mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-[#6b7280]'

export const fieldInput =
  'w-full rounded-lg border border-[#e5e7eb] bg-white px-3.5 py-2.5 text-[14px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#cbd0d6] focus:border-[#0F1F35] focus:ring-2 focus:ring-[#0F1F35]/10'

export const primaryButton =
  'mt-1 w-full rounded-lg bg-[#0F1F35] px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-[#1a3050] disabled:cursor-not-allowed disabled:bg-[#374151]'
