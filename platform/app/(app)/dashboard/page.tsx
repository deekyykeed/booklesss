import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/queries'
import DashboardContent from '@/components/DashboardContent'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')
  return <DashboardContent userId={user.id} email={user.email ?? ''} />
}
