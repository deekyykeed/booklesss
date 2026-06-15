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
    .select('id, name, school, accent_color')
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

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <LessonContent step={step} />
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
