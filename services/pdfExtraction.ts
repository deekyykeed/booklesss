/**
 * PDF Text Extraction Service
 *
 * This service handles extracting text from PDF files.
 *
 * Note: For production, you would want to use a backend service or cloud function
 * to handle PDF text extraction, as React Native doesn't have robust PDF parsing libraries.
 *
 * Options for implementation:
 * 1. Supabase Edge Functions with pdf-parse
 * 2. Cloud Functions (Firebase, AWS Lambda) with pdf-parse or PDFBox
 * 3. Third-party API services (Adobe PDF Services, PDFLayer, etc.)
 */

import { updatePDFStatus, type CoursePDF } from './pdfService';

/**
 * Extract text from a PDF file using Supabase Edge Function
 */
export async function extractTextFromPDF(pdf: CoursePDF): Promise<{
  text: string;
  pageCount: number;
}> {
  console.log('[PDF Extraction] Starting extraction for:', pdf.filename);

  try {
    await updatePDFStatus(pdf.id, 'processing');

    // Get Supabase credentials from environment
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials not found in environment');
    }

    console.log('[PDF Extraction] Calling edge function for:', pdf.filename);

    // Call Supabase Edge Function
    const response = await fetch(
      `${supabaseUrl}/functions/v1/extract-pdf-text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          pdfUrl: pdf.file_url,
          pdfId: pdf.id,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Edge function failed: ${response.statusText}. ${errorData.error || ''}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Unknown error from edge function');
    }

    console.log(
      '[PDF Extraction] Completed for:',
      pdf.filename,
      `(${result.pages} pages, ${result.text.length} characters)`
    );

    return {
      text: result.text,
      pageCount: result.pages,
    };
  } catch (error) {
    console.error('[PDF Extraction] Error:', error);
    await updatePDFStatus(pdf.id, 'failed');
    throw error;
  }
}

/**
 * Process all pending PDFs for a course
 */
export async function processPendingPDFs(pdfs: CoursePDF[]): Promise<void> {
  console.log(`[PDF Extraction] Processing ${pdfs.length} PDFs`);

  const pendingPDFs = pdfs.filter((pdf) => pdf.processing_status === 'pending');

  for (const pdf of pendingPDFs) {
    try {
      await extractTextFromPDF(pdf);
    } catch (error) {
      console.error(`[PDF Extraction] Failed to process ${pdf.filename}:`, error);
      // Continue processing other PDFs even if one fails
    }
  }

  console.log('[PDF Extraction] All PDFs processed');
}

/**
 * Implementation Guide for Production:
 *
 * Option 1: Supabase Edge Function
 * -------------------------------
 * Create a Supabase Edge Function that:
 * 1. Receives PDF URL from storage
 * 2. Downloads the PDF
 * 3. Uses pdf-parse to extract text
 * 4. Returns extracted text and metadata
 *
 * Example Edge Function:
 * ```typescript
 * import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
 * import pdf from 'npm:pdf-parse@1.1.1'
 *
 * serve(async (req) => {
 *   const { pdfUrl } = await req.json()
 *   const response = await fetch(pdfUrl)
 *   const buffer = await response.arrayBuffer()
 *   const data = await pdf(Buffer.from(buffer))
 *
 *   return new Response(JSON.stringify({
 *     text: data.text,
 *     pages: data.numpages
 *   }))
 * })
 * ```
 *
 * Option 2: Third-Party API
 * -------------------------
 * Services like Adobe PDF Services API, PDFLayer, or similar:
 * 1. Upload PDF to service
 * 2. Receive extracted text
 * 3. Store in database
 *
 * Option 3: OCR for Scanned PDFs
 * ------------------------------
 * For scanned PDFs without text layer:
 * 1. Use Google Cloud Vision API
 * 2. AWS Textract
 * 3. Azure Computer Vision
 */
