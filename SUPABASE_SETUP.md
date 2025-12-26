# Supabase Setup Instructions

Follow these steps to properly connect Supabase to your app:

## 1. Enable Anonymous Authentication

The app uses anonymous authentication for automatic user identification. You need to enable it in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Anonymous** in the list of providers
4. **Enable** the Anonymous provider
5. Save the changes

## 2. Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

This creates all necessary tables, indexes, and Row Level Security (RLS) policies.

## 3. Set Up Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Enter:
   - **Name**: `course-pdfs`
   - **Public**: Unchecked (private bucket)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: `application/pdf`
4. Click **Create bucket**

### Storage Policies

After creating the bucket, run these SQL policies in the **SQL Editor**:

```sql
-- Policy 1: Users can upload PDFs to their courses
CREATE POLICY "Users can upload PDFs to their courses"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Users can view their own PDFs
CREATE POLICY "Users can view their own PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Users can delete their own PDFs
CREATE POLICY "Users can delete their own PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 4. Verify Environment Variables

Make sure your `.env` file has the correct values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

To find these values:
1. Go to **Project Settings** → **API**
2. Copy the **Project URL** (for EXPO_PUBLIC_SUPABASE_URL)
3. Copy the **anon public** key (for EXPO_PUBLIC_SUPABASE_ANON_KEY)

## 5. Test the Connection

After setup, restart your development server:

```bash
npm start -- --clear
```

The app will automatically:
- Sign in anonymously when you first use it
- Create courses with the proper user_id
- Respect RLS policies for data access

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that your `.env` file exists and has the correct variable names
- Make sure you've restarted the development server after adding/changing `.env` values

### Error: "User not authenticated"
- Ensure Anonymous authentication is enabled in Supabase
- Check that you've run the database schema SQL

### Error: "new row violates row-level security policy"
- Make sure you've run the complete `schema.sql` file including all RLS policies
- Verify that Anonymous auth is enabled

### PDFs not uploading
- Verify the `course-pdfs` storage bucket exists
- Check that storage policies have been created
- Ensure the bucket is set to private (not public)

