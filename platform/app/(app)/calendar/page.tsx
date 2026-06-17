import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/queries'
import CalendarContent from '@/components/CalendarContent'

export default async function CalendarPage() {
  const user = await getUser()
  if (!user) redirect('/login')
  return <CalendarContent userId={user.id} />
}
