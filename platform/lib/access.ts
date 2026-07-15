import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

// The single access-policy decision for step content (BUILD_PLAN §4).
// Two payment rails unlock the same door:
//   - a Clerk Billing subscription (any plan in MEMBER_PLANS)
//   - a manual course_access grant (mobile-money payers, inserted by owner)
//
// Returns:
//   'ok'     — render the step
//   'locked' — signed-in but unpaid → show the teaser + pricing CTA
//   'hidden' — pretend it doesn't exist (drafts handled by RLS; internal
//              steps for non-owners)

// Plan slugs that grant member access. Decoupled from marketing names so the
// Clerk plans can be renamed without a code change — override with the
// CLERK_MEMBER_PLANS env var (comma-separated slugs). Defaults to the tier
// slugs `basic` (single-course tier) and `pro` (all-access tier). Whatever
// you pick here MUST match the plan slugs created in Clerk Billing.
const MEMBER_PLANS = (process.env.CLERK_MEMBER_PLANS || 'basic,pro')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export type StepAccessLevel = 'public' | 'members' | 'internal'
export type StepAccessResult = 'ok' | 'locked' | 'hidden'

export async function isOwner(userId: string): Promise<boolean> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.publicMetadata?.role === 'owner'
  } catch {
    return false
  }
}

export async function canReadStep(
  access: StepAccessLevel,
  courseCode: string
): Promise<StepAccessResult> {
  if (access === 'public') return 'ok'

  let userId: string | null = null
  let has: ((params: { plan: string }) => boolean) | null = null
  try {
    const a = await auth()
    userId = a.userId
    has = (params: { plan: string }) => a.has(params)
  } catch {
    // Clerk unconfigured (fail-soft deploy) — treat as signed out.
  }
  if (!userId) return access === 'internal' ? 'hidden' : 'locked'

  if (access === 'internal') {
    return (await isOwner(userId)) ? 'ok' : 'hidden'
  }

  // Rail 1: Clerk Billing subscription — any of the configured member plans.
  try {
    if (has && MEMBER_PLANS.some((plan) => has!({ plan }))) return 'ok'
  } catch {
    // Billing not enabled on the instance — fall through to grants.
  }

  // Rail 2: manual grant (course_access row, RLS-scoped to this user).
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('course_access')
      .select('course_code')
      .eq('user_id', userId)
      .eq('course_code', courseCode)
      .maybeSingle()
    if (data) return 'ok'
  } catch {
    // Supabase unreachable — err on locked, never on open.
  }

  // The owner reads everything (their own product).
  if (await isOwner(userId)) return 'ok'

  return 'locked'
}
