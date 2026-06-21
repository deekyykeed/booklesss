import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/lib/supabase/queries'
import AppShell from '@/components/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = await getProfile(user.id)
  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Student'

  return (
    <AppShell userName={displayName}>
      <main style={{ flex: 1, width: '100%', height: '100%', overflowY: 'auto', minHeight: 0 }}>
        {children}
      </main>
    </AppShell>
  )
}
