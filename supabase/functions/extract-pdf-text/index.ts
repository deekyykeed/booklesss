import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import pdf from 'npm:pdf-parse@1.1.1'

serve(async (req) => {
  try {
    // Parse request body
    const { pdfUrl, pdfId } = await req.json()

    if (!pdfUrl || !pdfId) {
      return new Response(
        JSON.stringify({ error: 'Missing pdfUrl or pdfId parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[PDF Extraction] Starting extraction for PDF ID: ${pdfId}`)

    // Create Supabase client with service role key for database access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update status to processing
    await supabaseClient
      .from('course_pdfs')
      .update({ processing_status: 'processing' })
      .eq('id', pdfId)

    console.log(`[PDF Extraction] Downloading PDF from: ${pdfUrl}`)

    // Download PDF from storage
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    console.log(`[PDF Extraction] PDF downloaded, size: ${arrayBuffer.byteLength} bytes`)

    // Extract text using pdf-parse
    console.log(`[PDF Extraction] Extracting text...`)
    const data = await pdf(Buffer.from(arrayBuffer))

    console.log(`[PDF Extraction] Extracted ${data.numpages} pages, ${data.text.length} characters`)

    // Update database record with extracted text
    const { error: updateError } = await supabaseClient
      .from('course_pdfs')
      .update({
        extracted_text: data.text,
        page_count: data.numpages,
        processing_status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', pdfId)

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    console.log(`[PDF Extraction] Successfully completed for PDF ID: ${pdfId}`)

    return new Response(
      JSON.stringify({
        success: true,
        text: data.text,
        pages: data.numpages,
        pdfId: pdfId
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('[PDF Extraction] Error:', error)

    // Try to update status to failed
    try {
      const { pdfId } = await req.json()
      if (pdfId) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        await supabaseClient
          .from('course_pdfs')
          .update({ processing_status: 'failed' })
          .eq('id', pdfId)
      }
    } catch (statusUpdateError) {
      console.error('[PDF Extraction] Failed to update status:', statusUpdateError)
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
