# Supabase Storage Setup

## Create Storage Bucket for PDFs

1. Go to your Supabase project: https://app.supabase.com/project/_/storage/buckets
2. Click "New bucket"
3. Enter the following details:
   - **Name**: `course-pdfs`
   - **Public**: Unchecked (private bucket)
   - **File size limit**: 50 MB (or adjust as needed)
   - **Allowed MIME types**: `application/pdf`

4. Click "Create bucket"

## Set Up Storage Policies

After creating the bucket, set up the following policies:

### Policy 1: Users can upload PDFs to their own courses

```sql
CREATE POLICY "Users can upload PDFs to their courses"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 2: Users can view their own PDFs

```sql
CREATE POLICY "Users can view their own PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 3: Users can delete their own PDFs

```sql
CREATE POLICY "Users can delete their own PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Folder Structure

PDFs will be organized as:
```
course-pdfs/
  └── {user_id}/
      └── {course_id}/
          ├── {pdf_id}_filename.pdf
          ├── {pdf_id}_filename2.pdf
          └── ...
```

This structure ensures:
- Easy access control per user
- Organized by course
- Unique file names using PDF IDs
