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
  return hasClerk ? (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0F1F35',
          colorForeground: '#0F1F35',
          borderRadius: '0.6rem',
          fontFamily: 'var(--font-aptos), system-ui, sans-serif',
        },
      }}
    >
      {tree}
    </ClerkProvider>
  ) : (
    tree
  )
}
