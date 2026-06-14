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
    <div
      style={{
        width: 1200,
        height: 'min-content',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
        padding: 0,
        gap: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 0,
      }}
    >
      <Sidebar courses={sidebarCourses} userName={displayName} />
      {/* Main column — holds top navbar + page content */}
      <div
        style={{
          width: '100%',
          flex: 1,
          height: '1px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          overflow: 'visible',
          padding: 0,
          gap: 20,
          position: 'relative',
          borderRadius: 0,
        }}
      >
        {/* Top nav container */}
        <div
          style={{
            width: '100%',
            height: 'min-content',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'visible',
            padding: 0,
            gap: 16,
            position: 'relative',
            borderRadius: 0,
          }}
        >
          {/* navbar items go here */}
        </div>

        <main style={{ flex: 1, width: '100%', overflowY: 'auto', minHeight: 0 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
