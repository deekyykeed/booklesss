'use client'

import { UserButton, useUser } from '@clerk/nextjs'

// Visible "you're signed in" checkpoint for the /steps index — the page a
// student lands on after auth. While Clerk loads it shows a neutral checking
// state; once loaded it shows a green confirmation with the account email and
// the Clerk UserButton (avatar → account menu / sign out). Only mounted when
// Clerk is configured (guarded by the server), so useUser always has a
// provider.

export function IndexUserChip() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return (
      <span className="text-[13px] text-[#a89f8c]" aria-live="polite">
        Checking sign-in…
      </span>
    )
  }

  if (!isSignedIn) {
    return (
      <a
        href="/sign-in"
        className="rounded-lg bg-[#18181b] px-4 py-2 text-[13px] font-bold text-white no-underline"
      >
        Sign in
      </a>
    )
  }

  const email = user.primaryEmailAddress?.emailAddress
  const name = user.firstName || email?.split('@')[0]

  return (
    <div className="flex items-center gap-2.5">
      <span className="hidden items-center gap-1.5 rounded-full border border-[#bfe3d4] bg-[#eafaf3] px-3 py-1.5 text-[12px] font-semibold text-[#0E5F4C] sm:inline-flex">
        <span aria-hidden>✓</span>
        Signed in{name ? ` · ${name}` : ''}
      </span>
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
      />
    </div>
  )
}
