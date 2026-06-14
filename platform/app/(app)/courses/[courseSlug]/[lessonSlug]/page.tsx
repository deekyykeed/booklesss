import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LessonContent, { LessonStep } from '@/components/LessonContent'
import CommunityPanel from '@/components/CommunityPanel'
import BookmarkButton from '@/components/BookmarkButton'
import type { PageProps } from '@/.next/types/app/layout'

export default async function LessonPage(props: PageProps<'/courses/[courseSlug]/[lessonSlug]'>) {
  const { courseSlug, lessonSlug } = await props.params
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

  const firstStep = (steps ?? [])[0]
  if (!firstStep) notFound()

  // Check if user has bookmarked this step
  const { data: bookmark } = await supabase
    .from('bookmarks')
    .select('step_id')
    .eq('user_id', user.id)
    .eq('step_id', firstStep.id)
    .single()

  const isBookmarked = !!bookmark

  type RawContent = {
    sections?: { eyebrow: string; heading: string; body: string; callout?: { label: string; body: string } }[]
    discussionQuestions?: string[]
    keyTerms?: { term: string; definition: string }[]
    learningOutcomes?: string[]
  }

  const raw = (firstStep.content ?? {}) as RawContent
  const stepNumber = `${lesson.order_index}.${firstStep.order_index}`

  const step: LessonStep = {
    stepNumber,
    title: firstStep.title,
    course: course.name,
    school: course.school,
    accentColor: course.accent_color,
    sections: raw.sections ?? [],
    discussionQuestions: raw.discussionQuestions ?? [],
    keyTerms: raw.keyTerms ?? [],
    learningOutcomes: raw.learningOutcomes ?? [],
  }

  const panelSteps = (steps ?? []).map((s, i) => ({
    slug: s.slug,
    title: s.title,
    stepNumber: `${lesson.order_index}.${i + 1}`,
  }))

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <LessonContent step={step} />
        <div style={{ position: 'fixed', bottom: 28, right: 340, zIndex: 50 }}>
          <BookmarkButton stepId={firstStep.id} userId={user.id} initialBookmarked={isBookmarked} accentColor={course.accent_color} />
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
