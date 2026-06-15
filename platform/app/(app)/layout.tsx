import { redirect } from 'next/navigation'
import { getUser, getProfile, getEnrollments } from '@/lib/supabase/queries'
import AppShell from '@/components/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const [profile, enrollmentRows] = await Promise.all([
    getProfile(user.id),
    getEnrollments(user.id),
  ])

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
    <AppShell courses={sidebarCourses} userName={displayName}>
      <main style={{ flex: 1, width: '100%', height: '100%', overflowY: 'auto', minHeight: 0 }}>
        {children}
      </main>
    </AppShell>
  )
}
