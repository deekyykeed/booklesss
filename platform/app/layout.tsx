import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

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

const parkinsans = localFont({
  src: '../public/fonts/parkinsans-v3-latin-700.ttf',
  weight: '700',
  variable: '--font-parkinsans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Booklesss',
  description: 'Smarter notes for Zambian university students.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${aptos.variable} ${parastoo.variable} ${parkinsans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
