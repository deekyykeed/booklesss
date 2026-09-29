import { ChevronRight } from './icons'
import { Badge } from './Badge'
import { Reveal } from './Reveal'

const PORTRAIT =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260728_050334_5b076e26-0ce7-4898-b432-d764190e448f.png&w=1280&q=85'

const SERVICES = ['AI Automation', 'AI Integration', 'AI Agent Development']

export function SectionOne() {
  return (
    <section className="flex min-h-screen flex-col justify-between px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16">
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <ul className="flex flex-col gap-2">
          {SERVICES.map((s, i) => (
            <Reveal
              as="li"
              key={s}
              delay={150 + i * 120}
              className="text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md"
            >
              / {s}
            </Reveal>
          ))}
        </ul>
        <Reveal delay={300} className="max-w-xs sm:text-right">
          <p className="text-lg leading-relaxed text-white drop-shadow-md sm:text-xl">
            We design automation that brings clarity, precision, and efficiency to the way your company
            operates.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal delay={150} className="mb-5">
            <Badge>We Automate 100+ Businesses</Badge>
          </Reveal>
          <Reveal delay={280}>
            <h1 className="text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
              Clear. Precise.
              <br />
              Automated.
            </h1>
          </Reveal>
        </div>

        <Reveal delay={420}>
          <div className="flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md">
            <img src={PORTRAIT} alt="Mitha, co-founder of NovaAI" className="h-24 w-20 rounded-lg object-cover" />
            <div className="flex flex-col gap-1.5 pr-2">
              <p className="text-sm font-medium text-white">Talk with Mitha</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/60">Co-founder of NovaAI</p>
              <a
                href="#"
                className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition-colors duration-300 hover:bg-white/85"
              >
                Book 15-mins call
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
