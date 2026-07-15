import { cache } from 'react'
import type { Metadata } from 'next'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import shell from './shell-parts.json'
import './step.css'

// Step pages, served from the database (public.steps) instead of static HTML.
// The middleware (proxy.ts) guarantees a Clerk session before this renders;
// RLS on the steps table is the backstop (published rows only). The reading
// experience — tap-define, tickable outcomes, rate/complete — lives in
// /step-client.js, parameterized by window.__STEP__.

type StepRow = {
  slug: string
  title: string
  description: string | null
  body_html: string
  access: 'public' | 'members' | 'internal'
  glossary: Record<string, string>
  brand: Record<string, unknown>
  extra_js: string | null
}

async function isOwner(userId: string): Promise<boolean> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.publicMetadata?.role === 'owner'
  } catch {
    return false
  }
}

// cache() dedupes the row fetch between generateMetadata and the page render.
const getStep = cache(async (slug: string): Promise<StepRow | null> => {
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('steps')
    .select('slug, title, description, body_html, access, glossary, brand, extra_js')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return (data as StepRow) ?? null
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

  // Internal steps (business docs like the revenue model) are owner-only.
  if (step.access === 'internal') {
    let userId: string | null = null
    try {
      ;({ userId } = await auth())
    } catch {
      // Clerk unconfigured — nobody is owner.
    }
    if (!userId || !(await isOwner(userId))) notFound()
  }

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
