import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

// Fail-soft: only mount Clerk when its publishable key is present, so a deploy
// without Clerk env still builds and serves (same pattern as the Supabase
// fail-soft). Auth is dormant until the keys are set.
const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

const aptos = localFont({
  src: [
    { path: '../public/fonts/Aptos.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Aptos-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../public/fonts/Aptos-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/Aptos-Bold-Italic.ttf', weight: '700', style: 'italic' },
  ],
  variable: '--font-aptos',
  display: 'swap',
})

const parastoo = localFont({
  src: [
    { path: '../public/fonts/Parastoo.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Parastoo-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-parastoo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Booklesss',
  description: 'Smarter notes for Zambian university students.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tree = (
    <html lang="en" className={`${aptos.variable} ${parastoo.variable}`}>
      <body>{children}<Analytics /></body>
    </html>
  )
  // Clerk carries the whole identity surface (sign-in/up, the UserButton
  // account menu, the profile/settings modal, billing) — this appearance is
  // the house skin for all of it. The look: Clerk's own "metallic" neutrals
  // (graphite ink, warm-silver surfaces) over the Booklesss canvas, and a
  // heavy backdrop blur behind every modal.
  //
  // Do NOT set appearance.cssLayerName here. It moves ALL of Clerk's styles
  // into a cascade layer, and globals.css has unlayered rules (* and body) —
  // unlayered always beats layered, so it silently overrode Clerk's own
  // component styles and rendered the sign-in widget blank on production
  // (regression fixed 2026-07-15). cssLayerName is only needed when passing
  // Tailwind utility *class strings* to elements; ours are CSS objects, so
  // Clerk stays unlayered (as it was when auth worked).
  return hasClerk ? (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#18181b',
          colorForeground: '#18181b',
          colorBackground: '#fbfbf9',
          borderRadius: '0.6rem',
          fontFamily: 'var(--font-aptos), system-ui, sans-serif',
        },
        elements: {
          // The Clerk-web-app treatment the owner asked for: popups float on
          // a blurred, dimmed page. These elements render only for the
          // UserButton popover and modals (never on the signed-out sign-in
          // card), so they can't affect the auth pages.
          modalBackdrop: {
            background: 'rgba(20, 20, 22, 0.32)',
            backdropFilter: 'blur(16px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
          },
          // Metallic card: white highlight rolling into warm silver + sheen.
          userButtonPopoverCard: {
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0) 18%), linear-gradient(180deg, #fbfbf9, #f1f0ec)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.9), 0 24px 60px -24px rgba(24,24,27,0.35), 0 4px 16px -8px rgba(24,24,27,0.12)',
            border: '1px solid rgba(24, 24, 27, 0.09)',
          },
        },
      }}
    >
      {tree}
    </ClerkProvider>
  ) : (
    tree
  )
}
