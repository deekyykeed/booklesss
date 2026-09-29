import { Hexagon } from 'lucide-react'
import { Reveal } from './Reveal'

const LINKS = [
  { label: 'Projects', href: '#', count: 6 },
  { label: 'About', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact', href: '#' },
]

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-white/15">
      <nav className="flex items-center justify-between px-5 py-4 sm:px-8 md:px-12">
        <Reveal delay={0}>
          <a href="#" className="flex items-center gap-2 text-lg font-medium tracking-tight text-white sm:text-xl">
            <Hexagon size={24} strokeWidth={1.5} />
            novaai
          </a>
        </Reveal>

        <ul className="hidden items-center gap-8 md:flex lg:gap-10">
          {LINKS.map((link, i) => (
            <Reveal as="li" key={link.label} delay={100 + i * 100}>
              <a href={link.href} className="text-sm text-white/85 transition-colors duration-300 hover:text-white">
                {link.label}
                {link.count !== undefined && (
                  <sup className="ml-0.5 font-mono text-[10px] text-white/60">{link.count}</sup>
                )}
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={500}>
          <a
            href="#"
            className="inline-block rounded-md border border-white/20 bg-white/15 px-4 py-2 text-xs text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:px-5 sm:text-sm"
          >
            Get Free Consultation
          </a>
        </Reveal>
      </nav>
    </header>
  )
}
