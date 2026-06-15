import { cache } from 'react'
import { createClient } from './server'

// React cache() deduplicates these within a single server request — layout and
// page both call getUser() but Supabase only runs it once per navigation.

export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('display_name, university')
    .eq('id', userId)
    .single()
  return data
})

export const getEnrollments = cache(async (userId: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select('courses(id, slug, name, school, accent_color, cover_color, lessons(id, slug, title, order_index))')
    .eq('user_id', userId)
  return data ?? []
})
