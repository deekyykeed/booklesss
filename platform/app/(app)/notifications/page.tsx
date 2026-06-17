import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/queries'
import NotificationsContent from '@/components/NotificationsContent'

export default async function NotificationsPage() {
  const user = await getUser()
  if (!user) redirect('/login')
  return <NotificationsContent userId={user.id} />
}
