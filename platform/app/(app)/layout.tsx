import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, university')
    .eq('id', user.id)
    .single()

  const { data: enrollmentRows } = await supabase
    .from('enrollments')
    .select('courses(id, slug, name, school, accent_color, lessons(slug, title, order_index))')
    .eq('user_id', user.id)

  type RawLesson = { slug: string; title: string; order_index: number }
  type RawCourse = { id: string; slug: string; name: string; school: string; accent_color: string; lessons: RawLesson[] }

  const courses: RawCourse[] = (enrollmentRows ?? [])
    .map((r: { courses: RawCourse | RawCourse[] | null }) =>
      Array.isArray(r.courses) ? r.courses[0] : r.courses
    )
    .filter(Boolean) as RawCourse[]

  const sidebarCourses = courses.map((c) => ({
    slug: c.slug,
    name: c.name,
    school: c.school,
    accentColor: c.accent_color,
    lessons: [...(c.lessons ?? [])].sort((a, b) => a.order_index - b.order_index),
  }))

  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Student'

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#F5F5F5' }}>
      <Sidebar courses={sidebarCourses} userName={displayName} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
