import { auth, clerkClient } from '@clerk/nextjs/server'

// The single access-policy decision for step content.
//
// Access model (owner decision, 2026-07-16): being SIGNED IN is the only gate
// for course content. Anyone with an account who has the step's link can read
// it — no plan, no paywall, no free-trial check. Distribution is by the link
// posted in Slack; proxy.ts (the sign-in gate) is what actually enforces it.
//
//   public   → anyone (even signed out, per RLS)
//   members  → any signed-in user (no plan required)
//   internal → the owner only (ops docs like the revenue model)
//
// Returns:
//   'ok'     — render the step
//   'locked' → not signed in on a members step. Unreachable in normal traffic:
//              the middleware redirects signed-out visitors to sign-in first.
//   'hidden' → pretend it doesn't exist (internal steps for non-owners).

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
  _courseCode: string
): Promise<StepAccessResult> {
  if (access === 'public') return 'ok'

  let userId: string | null = null
  try {
    userId = (await auth()).userId
  } catch {
    // Clerk unconfigured (fail-soft deploy) — treat as signed out.
  }
  if (!userId) return access === 'internal' ? 'hidden' : 'locked'

  // Ops docs stay owner-only.
  if (access === 'internal') return (await isOwner(userId)) ? 'ok' : 'hidden'

  // members: any signed-in user reads it. No plan, no paywall.
  return 'ok'
}
