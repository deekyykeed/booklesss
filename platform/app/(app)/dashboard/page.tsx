import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Step   = { id: string; slug: string; title: string; order_index: number }
type Lesson = { id: string; slug: string; title: string; order_index: number; steps: Step[] }
type Course = { id: string; slug: string; name: string; school: string; accent_color: string; cover_color: string; lessons: Lesson[] }
type BookmarkStep = { id: string; slug: string; title: string; lessons: { slug: string; courses: { name: string; slug: string; accent_color: string } | null } | null }
type Bookmark = { saved_at: string; steps: BookmarkStep | BookmarkStep[] | null }
type CompletionRow = { step_id: string; completed_at: string }

function isDark(hex: string) {
  const h = hex.replace('#', '')
  if (h.length !== 6) return true
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profileRow },
    { data: enrollmentRows },
    { data: completionRowsRaw },
    { data: recentBookmarkRows },
    { count: savedCount },
  ] = await Promise.all([
    supabase.from('profiles').select('display_name').eq('id', user.id).single(),
    supabase.from('enrollments')
      .select('courses(id, slug, name, school, accent_color, cover_color, lessons(id, slug, title, order_index, steps(id, slug, title, order_index)))')
      .eq('user_id', user.id),
    supabase.from('step_completions').select('step_id, completed_at').eq('user_id', user.id),
    supabase.from('bookmarks')
      .select('saved_at, steps(id, slug, title, lessons(slug, courses(name, slug, accent_color)))')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false })
      .limit(4),
    supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const rawName = (profileRow as { display_name?: string } | null)?.display_name ?? user.email?.split('@')[0] ?? 'Student'
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  const courses: Course[] = ((enrollmentRows ?? []) as { courses: Course | Course[] | null }[])
    .map(r => Array.isArray(r.courses) ? r.courses[0] : r.courses)
    .filter(Boolean) as Course[]

  courses.forEach(c => {
    c.lessons = [...(c.lessons ?? [])].sort((a, b) => a.order_index - b.order_index)
    c.lessons.forEach(l => { l.steps = [...(l.steps ?? [])].sort((a, b) => a.order_index - b.order_index) })
  })

  const completionRows = (completionRowsRaw ?? []) as CompletionRow[]
  const completionMap = new Map<string, string>()
  completionRows.forEach(r => completionMap.set(r.step_id, r.completed_at))
  const completedSet = new Set(completionMap.keys())

  const courseStats = courses.map(course => {
    const allSteps = course.lessons.flatMap(l => l.steps)
    const completed = allSteps.filter(s => completedSet.has(s.id)).length
    const total = allSteps.length
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    const nextStep = allSteps.find(s => !completedSet.has(s.id)) ?? null
    const nextLesson = nextStep ? course.lessons.find(l => l.steps.some(s => s.id === nextStep.id)) ?? null : null
    const lastActivity = allSteps
      .filter(s => completionMap.has(s.id))
      .map(s => completionMap.get(s.id)!)
      .sort().at(-1) ?? null
    const href = nextStep && nextLesson
      ? `/courses/${course.slug}/${nextLesson.slug}?step=${nextStep.slug}`
      : `/courses/${course.slug}`
    return { course, completed, total, pct, nextStep, nextLesson, lastActivity, href }
  })

  courseStats.sort((a, b) => {
    if (a.lastActivity && b.lastActivity) return b.lastActivity.localeCompare(a.lastActivity)
    if (a.lastActivity) return -1
    if (b.lastActivity) return 1
    return 0
  })

  const totalSteps     = courseStats.reduce((s, cs) => s + cs.total, 0)
  const totalCompleted = courseStats.reduce((s, cs) => s + cs.completed, 0)
  const overallPct     = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0
  const bookmarks      = (recentBookmarkRows ?? []) as unknown as Bookmark[]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: '40px 52px 80px', maxWidth: 900, boxSizing: 'border-box' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#b0b0b0', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'var(--font-poppins), sans-serif' }}>
          {todayStr}
        </p>
        <h1 style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif', fontSize: 32, fontWeight: 700, color: '#0a0a0a', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          {greeting}, {displayName}.
        </h1>
      </div>

      {courses.length > 0 ? (
        <>
          {/* ── Stats row ─────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 40 }}>
            <StatCard value={totalCompleted.toString()} sub={`of ${totalSteps} total`} label="Steps Done" />
            <StatCard value={`${overallPct}%`} sub="across all courses" label="Overall Progress" accent />
            <StatCard value={courses.length.toString()} sub={courses.length === 1 ? 'course enrolled' : 'courses enrolled'} label="Enrolled" />
            <StatCard value={(savedCount ?? 0).toString()} sub="bookmarked steps" label="Saved" />
          </div>

          {/* ── Continue Learning ─────────────────────────── */}
          <section style={{ marginBottom: 40 }}>
            <SectionLabel>Continue Learning</SectionLabel>
            <div style={{
              display: 'grid',
              gridTemplateColumns: courseStats.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: 14,
              marginTop: 14,
            }}>
              {courseStats.map(cs => <CourseCard key={cs.course.id} {...cs} />)}
            </div>
          </section>

          {/* ── Recently Saved ────────────────────────────── */}
          {bookmarks.length > 0 && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <SectionLabel>Recently Saved</SectionLabel>
                <Link href="/saved" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none', fontWeight: 500, fontFamily: 'var(--font-poppins), sans-serif' }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {bookmarks.map((bookmark, i) => {
                  const stepRaw = bookmark.steps
                  const step: BookmarkStep | null = Array.isArray(stepRaw) ? stepRaw[0] : stepRaw
                  if (!step) return null
                  const lessonRaw = step.lessons
                  const lesson = Array.isArray(lessonRaw) ? lessonRaw[0] : lessonRaw
                  const courseRaw = lesson?.courses
                  const bCourse = Array.isArray(courseRaw) ? courseRaw[0] : courseRaw
                  if (!lesson || !bCourse) return null
                  return (
                    <Link key={i} href={`/courses/${bCourse.slug}/${lesson.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: '#fff', border: '1px solid #efefef', borderLeft: `3px solid ${bCourse.accent_color}`, borderRadius: 10, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: bCourse.accent_color, textTransform: 'uppercase', marginBottom: 2, fontFamily: 'var(--font-poppins), sans-serif' }}>
                            {bCourse.name}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-poppins), sans-serif' }}>
                            {step.title}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: '#b0b0b0', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'var(--font-poppins), sans-serif' }}>
                          {new Date(bookmark.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                        <span style={{ color: bCourse.accent_color, fontWeight: 600, fontSize: 14, flexShrink: 0 }}>→</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </>
      ) : (
        /* ── Empty state ──────────────────────────────────── */
        <div style={{ background: '#fff', border: '1px solid #efefef', borderRadius: 20, padding: '64px 48px', textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📚</div>
          <div style={{ fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif', fontSize: 22, fontWeight: 700, color: '#0a0a0a', marginBottom: 10 }}>
            Find your first course
          </div>
          <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6, fontFamily: 'var(--font-poppins), sans-serif' }}>
            Booklesss has study notes for ZCAS and UNZA. Browse the library and enrol to get started.
          </p>
          <Link href="/library" style={{ display: 'inline-block', padding: '12px 28px', background: '#0a0a0a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-poppins), sans-serif' }}>
            Browse Library
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ value, sub, label, accent }: { value: string; sub: string; label: string; accent?: boolean }) {
  void label
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${accent ? 'rgba(15,31,53,0.12)' : '#e5e7eb'}`,
      borderRadius: 12,
      padding: '16px 20px',
      boxShadow: accent ? '0 2px 8px rgba(15,31,53,0.07)' : '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em', marginBottom: 2, fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#b0b0b0', fontFamily: 'var(--font-poppins), sans-serif', lineHeight: 1.4 }}>
        {sub}
      </div>
    </div>
  )
}

function CourseCard({ course, completed, total, pct, nextStep, nextLesson, href }: {
  course: Course; completed: number; total: number; pct: number
  nextStep: Step | null; nextLesson: Lesson | null; href: string
  lastActivity: string | null
}) {
  const dark = isDark(course.cover_color)
  const textColor   = dark ? '#ffffff' : '#0a0a0a'
  const subtextColor = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'
  const cta = completed === 0 ? 'Start Here' : pct === 100 ? 'Review Course' : 'Continue'

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

      {/* Course color header */}
      <div style={{ background: course.cover_color, padding: '22px 24px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 15, color: textColor, lineHeight: 1.25, flex: 1 }}>
            {course.name}
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700, color: course.accent_color,
            background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            padding: '3px 8px', borderRadius: 5, letterSpacing: '0.07em',
            textTransform: 'uppercase', flexShrink: 0,
          }}>
            {course.school}
          </span>
        </div>

        {total > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
              <span style={{ fontSize: 12, color: subtextColor, fontFamily: 'var(--font-poppins)' }}>
                {completed} of {total} steps
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: textColor, fontFamily: 'var(--font-poppins)' }}>
                {pct}%
              </span>
            </div>
            <div style={{ background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', borderRadius: 3, height: 5 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: course.accent_color, borderRadius: 3 }} />
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: subtextColor, fontFamily: 'var(--font-poppins)' }}>No content yet</div>
        )}
      </div>

      {/* White body */}
      <div style={{ background: '#fff', padding: '18px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {pct === 100 ? (
          <div style={{ flex: 1, marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#16a34a', marginBottom: 3 }}>
              ✓ All steps complete
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'var(--font-poppins)' }}>
              Review any step to keep it sharp
            </div>
          </div>
        ) : nextStep ? (
          <div style={{ flex: 1, marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 7, fontFamily: 'var(--font-poppins)' }}>
              {completed === 0 ? 'Start with' : 'Next up'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F1F35', marginBottom: 3, lineHeight: 1.3 }}>
              {nextStep.title}
            </div>
            {nextLesson && (
              <div style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'var(--font-poppins)' }}>
                {nextLesson.title}
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: '#9ca3af', fontFamily: 'var(--font-poppins)' }}>
              No steps available yet
            </div>
          </div>
        )}

        <Link href={href} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '9px 18px', background: course.accent_color, color: '#fff',
          borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
          alignSelf: 'flex-start', fontFamily: 'var(--font-poppins)',
        }}>
          {cta} →
        </Link>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.28)', fontFamily: 'var(--font-poppins), sans-serif' }}>
      {children}
    </div>
  )
}
