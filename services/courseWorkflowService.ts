/**
 * Course Workflow Service
 *
 * Orchestrates the complete course creation workflow:
 * 1. Create course record
 * 2. Upload PDFs to storage
 * 3. Extract text from PDFs
 * 4. Generate course outline with AI
 * 5. Generate content for steps
 */

import { CourseFormData } from '@/types/course';
import { createCourse, updateCourseStatus, type Course } from './courseService';
import { uploadPDF, createPDFRecord, getCoursePDFs } from './pdfService';
import { extractTextFromPDF } from './pdfExtraction';
import { generateCourseOutline } from './outlineService';

export interface CourseCreationProgress {
  stage: 'uploading' | 'extracting' | 'generating_outline' | 'generating_content' | 'complete' | 'failed';
  progress: number; // 0-100
  message: string;
  error?: string;
}

/**
 * Create a course with PDFs and trigger background processing
 */
export async function createCourseWithPDFs(
  formData: CourseFormData,
  onProgress?: (progress: CourseCreationProgress) => void
): Promise<Course> {
  try {
    // Validate input
    if (!formData.name.trim()) {
      throw new Error('Course name is required');
    }
    if (!formData.writingStyle) {
      throw new Error('Writing style is required');
    }
    if (formData.pdfs.length === 0) {
      throw new Error('At least one PDF is required');
    }

    // Stage 1: Create course record
    onProgress?.({
      stage: 'uploading',
      progress: 5,
      message: 'Creating course...',
    });

    const course = await createCourse({
      name: formData.name,
      description: formData.description,
      writing_style: formData.writingStyle,
    });

    console.log('[Workflow] Course created:', course.id);

    // Stage 2: Upload PDFs
    onProgress?.({
      stage: 'uploading',
      progress: 10,
      message: `Uploading ${formData.pdfs.length} PDF${formData.pdfs.length > 1 ? 's' : ''}...`,
    });

    const totalPDFs = formData.pdfs.length;
    const uploadedPDFs = [];

    for (let i = 0; i < formData.pdfs.length; i++) {
      const pdf = formData.pdfs[i];
      const progressPercent = 10 + Math.floor((i / totalPDFs) * 30);

      onProgress?.({
        stage: 'uploading',
        progress: progressPercent,
        message: `Uploading ${pdf.name}...`,
      });

      try {
        // Upload to Supabase Storage
        const fileUrl = await uploadPDF(course.id, pdf.uri, pdf.name);

        // Create database record
        const pdfRecord = await createPDFRecord(
          course.id,
          pdf.name,
          fileUrl,
          pdf.size
        );

        uploadedPDFs.push(pdfRecord);
        console.log('[Workflow] Uploaded PDF:', pdf.name);
      } catch (error) {
        console.error('[Workflow] Failed to upload PDF:', pdf.name, error);
        throw new Error(`Failed to upload ${pdf.name}`);
      }
    }

    // Stage 3: Extract text from PDFs
    onProgress?.({
      stage: 'extracting',
      progress: 45,
      message: 'Extracting text from PDFs...',
    });

    await updateCourseStatus(course.id, 'processing');

    for (let i = 0; i < uploadedPDFs.length; i++) {
      const pdf = uploadedPDFs[i];
      const progressPercent = 45 + Math.floor((i / uploadedPDFs.length) * 20);

      onProgress?.({
        stage: 'extracting',
        progress: progressPercent,
        message: `Processing ${pdf.filename}...`,
      });

      try {
        await extractTextFromPDF(pdf);
        console.log('[Workflow] Extracted text from:', pdf.filename);
      } catch (error) {
        console.error('[Workflow] Failed to extract text:', pdf.filename, error);
        // Continue with other PDFs even if one fails
      }
    }

    // Stage 4: Generate course outline
    onProgress?.({
      stage: 'generating_outline',
      progress: 70,
      message: 'Generating course outline with AI...',
    });

    await generateCourseOutline(course.id, formData.writingStyle);

    console.log('[Workflow] Outline generated');

    // Stage 5: Mark as complete
    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Course created successfully!',
    });

    console.log('[Workflow] Course creation complete:', course.id);

    return course;
  } catch (error) {
    console.error('[Workflow] Course creation failed:', error);

    onProgress?.({
      stage: 'failed',
      progress: 0,
      message: 'Course creation failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}

/**
 * Process course creation in the background
 * This can be called after initial creation to handle long-running tasks
 */
export async function processCourseInBackground(
  courseId: string,
  writingStyle: string
): Promise<void> {
  try {
    console.log('[Workflow] Starting background processing for:', courseId);

    // Get all PDFs for the course
    const pdfs = await getCoursePDFs(courseId);

    if (pdfs.length === 0) {
      throw new Error('No PDFs found for course');
    }

    // Extract text from any pending PDFs
    const pendingPDFs = pdfs.filter((pdf) => pdf.processing_status === 'pending');

    for (const pdf of pendingPDFs) {
      try {
        await extractTextFromPDF(pdf);
      } catch (error) {
        console.error('[Workflow] Background extraction failed:', pdf.filename, error);
      }
    }

    // Generate outline if not already done
    const completedPDFs = pdfs.filter((pdf) => pdf.processing_status === 'completed');

    if (completedPDFs.length > 0) {
      await generateCourseOutline(courseId, writingStyle as any);
    }

    console.log('[Workflow] Background processing complete:', courseId);
  } catch (error) {
    console.error('[Workflow] Background processing failed:', error);
    await updateCourseStatus(courseId, 'failed');
    throw error;
  }
}

/**
 * Retry failed course creation
 */
export async function retryCourseCreation(courseId: string): Promise<void> {
  try {
    console.log('[Workflow] Retrying course creation:', courseId);

    // Reset status to processing
    await updateCourseStatus(courseId, 'processing');

    // Get course to retrieve writing style
    const { getCourse } = await import('./courseService');
    const course = await getCourse(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    // Retry background processing
    await processCourseInBackground(courseId, course.writing_style);
  } catch (error) {
    console.error('[Workflow] Retry failed:', error);
    await updateCourseStatus(courseId, 'failed');
    throw error;
  }
}
