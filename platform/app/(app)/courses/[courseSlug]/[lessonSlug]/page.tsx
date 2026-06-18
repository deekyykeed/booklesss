import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LessonContent, { LessonStep } from '@/components/LessonContent'
import CommunityPanel from '@/components/CommunityPanel'
import BookmarkButton from '@/components/BookmarkButton'
export default async function LessonPage(props: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const { courseSlug, lessonSlug } = await props.params
  const { step: stepSlug } = await props.searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('courses')
    .select('id, name, school, accent_color, cover_color')
    .eq('slug', courseSlug)
    .single()

  if (!course) notFound()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, slug, title, order_index')
    .eq('course_id', course.id)
    .eq('slug', lessonSlug)
    .single()

  if (!lesson) notFound()

  const { data: steps } = await supabase
    .from('steps')
    .select('id, slug, title, order_index, content')
    .eq('lesson_id', lesson.id)
    .order('order_index')

  const allSteps = steps ?? []
  const selectedStep = stepSlug
    ? (allSteps.find((s) => s.slug === stepSlug) ?? allSteps[0])
    : allSteps[0]

  if (!selectedStep) notFound()

  // Check if user has bookmarked this step
  const { data: bookmark } = await supabase
    .from('bookmarks')
    .select('step_id')
    .eq('user_id', user.id)
    .eq('step_id', selectedStep.id)
    .single()

  const isBookmarked = !!bookmark

  type RawContent = {
    sections?: { eyebrow: string; heading: string; body: string; callout?: { label: string; body: string } }[]
    discussionQuestions?: string[]
    keyTerms?: { term: string; definition: string }[]
    learningOutcomes?: string[]
  }

  const raw = (selectedStep.content ?? {}) as RawContent
  const stepNumber = `${lesson.order_index}.${selectedStep.order_index}`

  const step: LessonStep = {
    stepNumber,
    title: selectedStep.title,
    course: course.name,
    school: course.school,
    accentColor: course.accent_color,
    coverColor: course.cover_color,
    sections: raw.sections ?? [],
    discussionQuestions: raw.discussionQuestions ?? [],
    keyTerms: raw.keyTerms ?? [],
    learningOutcomes: raw.learningOutcomes ?? [],
  }

  const panelSteps = allSteps.map((s, i) => ({
    slug: s.slug,
    title: s.title,
    stepNumber: `${lesson.order_index}.${i + 1}`,
    href: `/courses/${courseSlug}/${lessonSlug}?step=${s.slug}`,
    active: s.slug === selectedStep.slug,
  }))

  const currentIndex = allSteps.findIndex((s) => s.slug === selectedStep.slug)
  const prevStep = currentIndex > 0 ? allSteps[currentIndex - 1] : null
  const nextStep = currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <LessonContent step={step} />

        {/* Step navigation */}
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '0 48px 72px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e5e7eb',
              paddingTop: 24,
              gap: 12,
            }}
          >
            {prevStep ? (
              <Link
                href={`/courses/${courseSlug}/${lessonSlug}?step=${prevStep.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '12px 16px',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  textDecoration: 'none',
                  flex: 1,
                  maxWidth: 280,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  ← Previous
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F1F35', lineHeight: 1.3 }}>
                  {prevStep.title}
                </span>
              </Link>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            {nextStep ? (
              <Link
                href={`/courses/${courseSlug}/${lessonSlug}?step=${nextStep.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  padding: '12px 16px',
                  background: course.accent_color,
                  borderRadius: 8,
                  textDecoration: 'none',
                  flex: 1,
                  maxWidth: 280,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Next →
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3, textAlign: 'right' }}>
                  {nextStep.title}
                </span>
              </Link>
            ) : (
              <Link
                href={`/courses/${courseSlug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  padding: '12px 16px',
                  background: '#0F1F35',
                  borderRadius: 8,
                  textDecoration: 'none',
                  flex: 1,
                  maxWidth: 280,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Done ✓
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                  Back to {course.name}
                </span>
              </Link>
            )}
          </div>
        </div>

        <div style={{ position: 'fixed', bottom: 28, right: 340, zIndex: 50 }}>
          <BookmarkButton stepId={selectedStep.id} userId={user.id} initialBookmarked={isBookmarked} accentColor={course.accent_color} />
        </div>
      </div>
      <CommunityPanel
        lessonTitle={`${String(lesson.order_index).padStart(2, '0')} · ${lesson.title}`}
        courseName={course.name}
        school={course.school}
        accentColor={course.accent_color}
        steps={panelSteps}
      />
    </div>
  )
}
