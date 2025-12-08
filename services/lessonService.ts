import { supabase } from '@/lib/supabase';

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_by: 'ai_generated' | 'user_manual';
  source_pdf_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Step {
  id: string;
  lesson_id: string;
  title: string;
  order_index: number;
  content: string | null;
  original_content: string | null;
  references: Array<{
    pdf_id: string;
    page_number: number;
    excerpt: string;
  }>;
  created_by: 'ai_generated' | 'user_manual';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonWithSteps extends Lesson {
  steps: Step[];
}

/**
 * Create a lesson
 */
export async function createLesson(
  courseId: string,
  title: string,
  description: string | null,
  orderIndex: number,
  sourcePdfIds: string[] = []
): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      course_id: courseId,
      title,
      description,
      order_index: orderIndex,
      source_pdf_ids: sourcePdfIds,
      created_by: 'ai_generated',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a step
 */
export async function createStep(
  lessonId: string,
  title: string,
  orderIndex: number,
  content: string | null,
  originalContent: string | null,
  references: Step['references'] = []
): Promise<Step> {
  const { data, error } = await supabase
    .from('steps')
    .insert({
      lesson_id: lessonId,
      title,
      order_index: orderIndex,
      content,
      original_content: originalContent,
      references,
      created_by: 'ai_generated',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all lessons for a course
 */
export async function getLessons(courseId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get lessons with their steps
 */
export async function getLessonsWithSteps(courseId: string): Promise<LessonWithSteps[]> {
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (lessonsError) throw lessonsError;

  // Get steps for all lessons
  const lessonsWithSteps = await Promise.all(
    (lessons || []).map(async (lesson) => {
      const { data: steps, error: stepsError } = await supabase
        .from('steps')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('order_index', { ascending: true });

      if (stepsError) throw stepsError;

      return {
        ...lesson,
        steps: steps || [],
      };
    })
  );

  return lessonsWithSteps;
}

/**
 * Get steps for a lesson
 */
export async function getSteps(lessonId: string): Promise<Step[]> {
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true});

  if (error) throw error;
  return data || [];
}

/**
 * Get a single step
 */
export async function getStep(stepId: string): Promise<Step | null> {
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('id', stepId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Toggle step completion
 */
export async function toggleStepCompletion(stepId: string): Promise<void> {
  // First get current state
  const { data: step } = await supabase
    .from('steps')
    .select('completed')
    .eq('id', stepId)
    .single();

  if (!step) throw new Error('Step not found');

  // Toggle completion
  const { error } = await supabase
    .from('steps')
    .update({ completed: !step.completed })
    .eq('id', stepId);

  if (error) throw error;
}

/**
 * Update step content
 */
export async function updateStepContent(
  stepId: string,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from('steps')
    .update({ content })
    .eq('id', stepId);

  if (error) throw error;
}

/**
 * Delete all lessons and steps for a course (used when regenerating outline)
 */
export async function deleteCourseLessons(courseId: string): Promise<void> {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('course_id', courseId);

  if (error) throw error;
}
