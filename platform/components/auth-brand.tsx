// Booklesss brand mark shown above Clerk's <SignIn/> / <SignUp/> card, plus a
// graceful fallback for when Clerk isn't configured yet (fail-soft, so the
// route never crashes an unconfigured deploy).

export function AuthBrand() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/[0.06] bg-[#FFFEF2]">
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
  )
}

export function AuthUnavailable() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f4ef] px-4 text-center">
      <p className="max-w-[320px] text-[14px] text-[#6b7280]">
        Sign-in isn’t available yet — this deploy hasn’t been connected to Clerk.
        Check back shortly.
      </p>
    </div>
  )
}
