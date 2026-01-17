import { WRITING_STYLES, WritingStyleId } from '@/constants/WritingStyles';
import { generateContent } from '@/lib/claude';
import { updateCourseStatus } from './courseService';
import {
  createLesson,
  createStep,
  deleteCourseLessons
} from './lessonService';
import { getAllExtractedText } from './pdfService';

interface OutlineLesson {
  title: string;
  description: string;
  order: number;
  steps: OutlineStep[];
  sourcePdfIds?: string[];
}

interface OutlineStep {
  title: string;
  order: number;
  keyTopics: string[];
  content?: string;
}

interface GeneratedOutline {
  lessons: OutlineLesson[];
}

/**
 * Generate course outline using Claude AI
 */
export async function generateCourseOutline(
  courseId: string,
  writingStyle: WritingStyleId
): Promise<void> {
  try {
    console.log('[Outline] Starting outline generation for course:', courseId);

    // Update course status
    await updateCourseStatus(courseId, 'processing');

    // Get all extracted text from PDFs
    const pdfTexts = await getAllExtractedText(courseId);

    if (pdfTexts.length === 0) {
      throw new Error('No PDFs with extracted text found for this course');
    }

    console.log(`[Outline] Found ${pdfTexts.length} PDFs with text`);

    // Combine all PDF text
    const combinedText = pdfTexts.join('\n\n---\n\n');

    // Get writing style prompt
    const stylePrompt = WRITING_STYLES[writingStyle].prompt;

    // Create the AI prompt
    const prompt = `You are an expert educational content organizer. Analyze the following course materials and create a structured learning outline.

Course Materials:
${combinedText.substring(0, 50000)}${combinedText.length > 50000 ? '...(truncated)' : ''}

Instructions:
1. Organize the content into 4-8 main lessons (major topics)
2. Each lesson should have 3-7 steps (subtopics or learning objectives)
3. Create clear, descriptive titles for lessons and steps
4. Provide a brief description for each lesson
5. Identify 2-4 key topics covered in each step

Writing Style: ${WRITING_STYLES[writingStyle].name}
${stylePrompt}

Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{
  "lessons": [
    {
      "title": "Lesson Title",
      "description": "Brief lesson description",
      "order": 1,
      "steps": [
        {
          "title": "Step Title",
          "order": 1,
          "keyTopics": ["topic1", "topic2", "topic3"]
        }
      ]
    }
  ]
}`;

    console.log('[Outline] Sending prompt to Claude...');

    // Call Claude AI
    const text = await generateContent(prompt);

    console.log('[Outline] Received response from Claude');

    // Parse JSON response
    let outline: GeneratedOutline;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      outline = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('[Outline] Failed to parse AI response:', text);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate outline structure
    if (!outline.lessons || !Array.isArray(outline.lessons)) {
      throw new Error('Invalid outline structure: missing lessons array');
    }

    console.log(`[Outline] Generated ${outline.lessons.length} lessons`);

    // Delete existing lessons (if regenerating)
    await deleteCourseLessons(courseId);

    // Create lessons and steps in database
    for (const lessonData of outline.lessons) {
      // Create lesson
      const lesson = await createLesson(
        courseId,
        lessonData.title,
        lessonData.description || null,
        lessonData.order,
        lessonData.sourcePdfIds || []
      );

      console.log(`[Outline] Created lesson: ${lesson.title}`);

      // Create steps for this lesson
      for (const stepData of lessonData.steps) {
        await createStep(
          lesson.id,
          stepData.title,
          stepData.order,
          null, // content will be generated separately
          null, // original_content
          [] // references
        );
      }

      console.log(`[Outline] Created ${lessonData.steps.length} steps for lesson`);
    }

    // Update course status to ready
    await updateCourseStatus(courseId, 'ready');

    console.log('[Outline] Outline generation complete!');
  } catch (error) {
    console.error('[Outline] Error generating outline:', error);
    await updateCourseStatus(courseId, 'failed');
    throw error;
  }
}

/**
 * Generate content for a specific step using Claude AI
 *
 * @param stepTitle - The title of the step
 * @param pdfExcerpts - Relevant text excerpts from PDFs
 * @param writingStyle - The writing style to use
 */
export async function generateStepContent(
  stepTitle: string,
  pdfExcerpts: string,
  writingStyle: WritingStyleId
): Promise<string> {
  const stylePrompt = WRITING_STYLES[writingStyle].prompt;

  const prompt = `You are an expert educational content writer. Create comprehensive learning content for this step in a study course.

Step Title: ${stepTitle}

Source Material:
${pdfExcerpts}

Writing Style: ${WRITING_STYLES[writingStyle].name}
${stylePrompt}

Instructions:
- Create clear, educational content that teaches this topic
- Use the source material as the foundation
- Maintain all key information and facts
- Structure with headings, bullet points, and paragraphs as appropriate
- Make it engaging and easy to understand
- Keep it focused on the step title's topic
- Length: 300-800 words

Generated Content:`;

  return await generateContent(prompt);
}

/**
 * Regenerate the entire course outline
 */
export async function regenerateOutline(
  courseId: string,
  writingStyle: WritingStyleId
): Promise<void> {
  console.log('[Outline] Regenerating outline for course:', courseId);

  // Record adaptation
  // TODO: Add to outline_adaptations table

  // Generate new outline
  await generateCourseOutline(courseId, writingStyle);
}
