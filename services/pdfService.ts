import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export interface CoursePDF {
  id: string;
  course_id: string;
  filename: string;
  file_url: string;
  file_size: number;
  page_count: number | null;
  extracted_text: string | null;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  upload_date: string;
  processed_at: string | null;
}

/**
 * Upload a PDF file to Supabase Storage
 */
export async function uploadPDF(
  courseId: string,
  fileUri: string,
  filename: string
): Promise<string> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Read file as base64
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to array buffer
    const arrayBuffer = decode(fileBase64);

    // Create unique file path
    const pdfId = crypto.randomUUID();
    const filePath = `${user.id}/${courseId}/${pdfId}_${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('course-pdfs')
      .upload(filePath, arrayBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('course-pdfs')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
}

/**
 * Create a PDF record in the database
 */
export async function createPDFRecord(
  courseId: string,
  filename: string,
  fileUrl: string,
  fileSize: number
): Promise<CoursePDF> {
  const { data, error } = await supabase
    .from('course_pdfs')
    .insert({
      course_id: courseId,
      filename,
      file_url: fileUrl,
      file_size: fileSize,
      processing_status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all PDFs for a course
 */
export async function getCoursePDFs(courseId: string): Promise<CoursePDF[]> {
  const { data, error } = await supabase
    .from('course_pdfs')
    .select('*')
    .eq('course_id', courseId)
    .order('upload_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Update PDF processing status
 */
export async function updatePDFStatus(
  pdfId: string,
  status: CoursePDF['processing_status'],
  extractedText?: string,
  pageCount?: number
): Promise<void> {
  const updates: any = {
    processing_status: status,
  };

  if (extractedText !== undefined) {
    updates.extracted_text = extractedText;
  }

  if (pageCount !== undefined) {
    updates.page_count = pageCount;
  }

  if (status === 'completed') {
    updates.processed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('course_pdfs')
    .update(updates)
    .eq('id', pdfId);

  if (error) throw error;
}

/**
 * Delete a PDF
 */
export async function deletePDF(pdfId: string): Promise<void> {
  // Get PDF record to get file path
  const { data: pdf, error: fetchError } = await supabase
    .from('course_pdfs')
    .select('file_url')
    .eq('id', pdfId)
    .single();

  if (fetchError) throw fetchError;

  // Extract file path from URL
  const url = new URL(pdf.file_url);
  const filePath = url.pathname.split('/course-pdfs/')[1];

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('course-pdfs')
    .remove([filePath]);

  if (storageError) throw storageError;

  // Delete from database
  const { error: dbError } = await supabase
    .from('course_pdfs')
    .delete()
    .eq('id', pdfId);

  if (dbError) throw dbError;
}

/**
 * Get all extracted text from course PDFs
 */
export async function getAllExtractedText(courseId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('course_pdfs')
    .select('extracted_text, filename')
    .eq('course_id', courseId)
    .eq('processing_status', 'completed')
    .order('upload_date', { ascending: true });

  if (error) throw error;

  return data
    .filter((pdf) => pdf.extracted_text)
    .map((pdf) => `[PDF: ${pdf.filename}]\n${pdf.extracted_text}`);
}
