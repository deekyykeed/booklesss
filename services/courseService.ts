import { WritingStyleId } from '@/constants/WritingStyles';
import { ensureAuthenticated } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export interface Course {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  writing_style: WritingStyleId;
  status: 'draft' | 'processing' | 'ready' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface CreateCourseData {
  name: string;
  description?: string;
  writing_style: WritingStyleId;
}

/**
 * Create a new course
 */
export async function createCourse(data: CreateCourseData): Promise<Course> {
  // Ensure user is authenticated and get user ID
  const userId = await ensureAuthenticated();

  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      user_id: userId,
      name: data.name,
      description: data.description || null,
      writing_style: data.writing_style,
      status: 'draft',
    })
    .select()
    .single();

  if (error) throw error;
  return course;
}

/**
 * Get all courses for the current user
 */
export async function getCourses(): Promise<Course[]> {
  // Ensure user is authenticated
  await ensureAuthenticated();
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get a single course by ID
 */
export async function getCourse(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a course
 */
export async function updateCourse(
  id: string,
  updates: Partial<CreateCourseData>
): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update course status
 */
export async function updateCourseStatus(
  id: string,
  status: Course['status']
): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete a course (will cascade delete all related data)
 */
export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get course with PDF count
 */
export async function getCourseWithStats(id: string) {
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (courseError) throw courseError;

  const { count: pdfCount } = await supabase
    .from('course_pdfs')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', id);

  const { count: lessonCount } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', id);

  return {
    ...course,
    pdfCount: pdfCount || 0,
    lessonCount: lessonCount || 0,
  };
}
