import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/lib/supabase/queries'
import ProfileContent from '@/components/ProfileContent'

export default async function ProfilePage() {
  const user = await getUser()
  if (!user) redirect('/login')
  const profile = await getProfile(user.id)
  return (
    <ProfileContent
      userId={user.id}
      email={user.email ?? ''}
      initialDisplayName={profile?.display_name ?? ''}
      initialUniversity={profile?.university ?? ''}
    />
  )
}
