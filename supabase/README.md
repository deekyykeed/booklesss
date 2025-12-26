# Supabase Setup Guide

Follow these steps to set up your Supabase backend for the Booklesss study app.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click "New Project"
3. Enter project details:
   - **Name**: booklesss (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

## Step 2: Run Database Schema

1. In your Supabase project, go to the **SQL Editor**
2. Click "New query"
3. Copy the contents of `schema.sql` in this folder
4. Paste into the SQL Editor
5. Click "Run" to execute

This will create all necessary tables, indexes, and security policies.

## Step 3: Set Up Storage

1. Follow the instructions in `storage-setup.md` to:
   - Create the `course-pdfs` storage bucket
   - Set up storage policies for file access

## Step 4: Get Your API Keys

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long JWT token)

## Step 5: Update Environment Variables

1. Open `.env` in the root of your project
2. Replace the placeholder values:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

## Step 6: Get Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Go to API Keys section
4. Click "Create Key"
5. Copy the key
6. Add it to your `.env` file:
   ```
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

## Step 7: Enable Authentication (Optional)

If you want user authentication:

1. Go to **Authentication** → **Providers**
2. Enable your preferred provider (Email, Google, Apple, etc.)
3. Configure the settings

For now, the app can work without authentication by using Supabase's anon key, but you'll need to modify the RLS policies.

## Verification

To verify your setup:

1. Run your app: `npm start`
2. Try creating a course
3. Check your Supabase dashboard:
   - **Table Editor** → `courses` should show your new course
   - **Storage** → `course-pdfs` should show uploaded PDFs

## Troubleshooting

**"Missing Supabase environment variables" error:**
- Make sure `.env` file exists in project root
- Verify variable names start with `EXPO_PUBLIC_`
- Restart the Metro bundler after changing `.env`

**"Row Level Security policy violation" error:**
- Check that RLS policies were created correctly
- Verify user authentication is working
- For testing without auth, you may need to temporarily disable RLS

**PDF upload fails:**
- Verify storage bucket exists and is named `course-pdfs`
- Check storage policies are set up correctly
- Ensure file size is under bucket limit (default 50MB)

## Database Schema Overview

- **courses**: Main course records with name, description, writing style
- **course_pdfs**: PDF files metadata and extracted text
- **lessons**: Course outline lessons (AI-generated or manual)
- **steps**: Individual learning steps within lessons
- **outline_adaptations**: History of outline changes

All tables have Row Level Security enabled to ensure users can only access their own data.
