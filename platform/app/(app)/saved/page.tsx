import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/queries'
import SavedContent from '@/components/SavedContent'

export default async function SavedPage() {
  const user = await getUser()
  if (!user) redirect('/login')
  return <SavedContent userId={user.id} />
}
