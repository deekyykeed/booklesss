import { supabase } from '@/lib/supabase';
import { ensureAuthenticated } from '@/lib/auth';

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

export interface Highlight {
  id: string;
  user_id: string;
  step_id: string;
  selected_text: string;
  selection_start: number;
  selection_end: number;
  color: HighlightColor;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface HighlightWithContext extends Highlight {
  step_title: string;
  lesson_title: string;
  course_name: string;
  course_id: string;
}

/**
 * Create a new highlight
 */
export async function createHighlight(
  stepId: string,
  selectedText: string,
  start: number,
  end: number,
  color: HighlightColor = 'yellow',
  note?: string
): Promise<Highlight> {
  const userId = await ensureAuthenticated();

  const { data, error } = await supabase
    .from('highlights')
    .insert({
      user_id: userId,
      step_id: stepId,
      selected_text: selectedText,
      selection_start: start,
      selection_end: end,
      color,
      note: note || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all highlights for a step
 */
export async function getStepHighlights(stepId: string): Promise<Highlight[]> {
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('step_id', stepId)
    .order('selection_start', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get all user highlights with context (course, lesson, step info)
 */
export async function getAllHighlights(): Promise<HighlightWithContext[]> {
  const { data, error } = await supabase
    .from('highlights')
    .select(
      `
      *,
      steps:step_id (
        title,
        lesson:lesson_id (
          title,
          course:course_id (
            id,
            name
          )
        )
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform nested structure to flat interface
  return (data || []).map((h: any) => ({
    ...h,
    step_title: h.steps?.title || '',
    lesson_title: h.steps?.lesson?.title || '',
    course_name: h.steps?.lesson?.course?.name || '',
    course_id: h.steps?.lesson?.course?.id || '',
  }));
}

/**
 * Update highlight color or note
 */
export async function updateHighlight(
  id: string,
  updates: { color?: HighlightColor; note?: string }
): Promise<void> {
  const { error } = await supabase
    .from('highlights')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete a highlight
 */
export async function deleteHighlight(id: string): Promise<void> {
  const { error } = await supabase.from('highlights').delete().eq('id', id);

  if (error) throw error;
}

/**
 * Search highlights by text or note content
 */
export async function searchHighlights(
  query: string
): Promise<HighlightWithContext[]> {
  const { data, error } = await supabase
    .from('highlights')
    .select(
      `
      *,
      steps:step_id (
        title,
        lesson:lesson_id (
          title,
          course:course_id (
            id,
            name
          )
        )
      )
    `
    )
    .or(`selected_text.ilike.%${query}%,note.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((h: any) => ({
    ...h,
    step_title: h.steps?.title || '',
    lesson_title: h.steps?.lesson?.title || '',
    course_name: h.steps?.lesson?.course?.name || '',
    course_id: h.steps?.lesson?.course?.id || '',
  }));
}
