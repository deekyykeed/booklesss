import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canReadStep } from '@/lib/access'
import { AuthBrand } from '@/components/auth-brand'
import shell from './shell-parts.json'
import './step.css'

// Step pages, served from the database (public.steps) instead of static HTML.
// The middleware (proxy.ts) guarantees a Clerk session before this renders;
// RLS on the steps table is the backstop (published rows only) and
// lib/access.ts decides paid access. The reading experience — tap-define,
// tickable outcomes, rate/complete — lives in /step-client.js,
// parameterized by window.__STEP__.

type StepRow = {
  slug: string
  course_code: string
  title: string
  description: string | null
  body_html: string
  access: 'public' | 'members' | 'internal'
  glossary: Record<string, string>
  brand: Record<string, unknown>
  extra_js: string | null
}

// cache() dedupes the row fetch between generateMetadata and the page render.
// Fail-soft: no Supabase env, or any read error, resolves to null → the page
// 404s instead of 500ing. So an unconfigured deploy degrades to "step not
// found", never a server error.
const getStep = cache(async (slug: string): Promise<StepRow | null> => {
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) return null
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('steps')
      .select('slug, course_code, title, description, body_html, access, glossary, brand, extra_js')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    return (data as StepRow) ?? null
  } catch {
    return null
  }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const step = await getStep(slug)
  if (!step) return {}
  return { title: step.title, description: step.description ?? undefined }
}

function LockedTeaser({ step }: { step: StepRow }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f5f4ef] px-6 text-center">
      <AuthBrand />
      <div className="max-w-[440px]">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c5613f]">
          Members only
        </p>
        <h1
          className="m-0 text-[26px] font-bold leading-tight text-[#121212]"
          style={{ fontFamily: 'var(--font-parastoo)' }}
        >
          {step.title}
        </h1>
        {step.description && (
          <p className="mt-3 text-[15px] leading-relaxed text-[#71717A]">
            {step.description}
          </p>
        )}
        <a
          href="/pricing"
          className="mt-7 inline-block rounded-xl bg-[#0F1F35] px-6 py-3 text-[14px] font-bold text-white no-underline transition-colors hover:bg-[#1a3050]"
        >
          Unlock this course
        </a>
        <p className="mt-4 text-[13px] text-[#94A3B8]">
          Paying by mobile money? Message us on WhatsApp — you&rsquo;ll be
          reading in minutes.
        </p>
      </div>
    </div>
  )
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const step = await getStep(slug)
  if (!step) notFound()

  const verdict = await canReadStep(step.access, step.course_code)
  if (verdict === 'hidden') notFound()
  if (verdict === 'locked') return <LockedTeaser step={step} />

  const stepData = JSON.stringify({
    slug: step.slug,
    brand: step.brand ?? {},
    glossary: step.glossary ?? {},
  })

  return (
    <div className="step-shell">
      <div dangerouslySetInnerHTML={{ __html: shell.sprite }} />
      <div dangerouslySetInnerHTML={{ __html: step.body_html }} />
      <div dangerouslySetInnerHTML={{ __html: shell.tip }} />
      <script
        dangerouslySetInnerHTML={{ __html: `window.__STEP__ = ${stepData};` }}
      />
      <script src="/step-client.js" defer />
      {step.extra_js && (
        <script dangerouslySetInnerHTML={{ __html: step.extra_js }} />
      )}
      <div dangerouslySetInnerHTML={{ __html: shell.voice }} />
    </div>
  )
}
