import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canReadStep } from '@/lib/access'
import { StepChrome, type NavStep } from '@/components/step-chrome'
import shell from './shell-parts.json'
import './step.css'
import './chrome.css'

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
  course_chip: string | null
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
      .select('slug, course_code, title, description, body_html, course_chip, access, glossary, brand, extra_js')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    return (data as StepRow) ?? null
  } catch {
    return null
  }
})

// Sibling steps of the same course, for the chapter navigation in the
// Contents panel. Fail-soft like getStep: any error → empty nav, the page
// still renders. Locked members-steps are listed too — following the link
// shows the teaser, which is the upsell working as intended.
const getCourseNav = cache(async (courseCode: string): Promise<NavStep[]> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('steps')
      .select('slug, title, lesson, step_label, minutes')
      .eq('course_code', courseCode)
      .eq('status', 'published')
      .neq('access', 'internal')
      .order('lesson')
      .order('step_label')
    return (data as NavStep[]) ?? []
  } catch {
    return []
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
  // 'locked' = a members step reached while signed out. The middleware
  // normally redirects first; this is the belt-and-suspenders fallback.
  // No paywall — being signed in is the only requirement.
  if (verdict === 'locked') redirect('/sign-in')

  const stepData = JSON.stringify({
    slug: step.slug,
    brand: step.brand ?? {},
    glossary: step.glossary ?? {},
  })
  const nav = await getCourseNav(step.course_code)

  return (
    <StepChrome
      hasClerk={Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)}
      courseChip={step.course_chip}
      current={step.slug}
      nav={nav}
    >
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
    </StepChrome>
  )
}
