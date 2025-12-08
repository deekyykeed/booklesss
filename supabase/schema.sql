-- Supabase Database Schema for Booklesss Study App
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  writing_style TEXT NOT NULL CHECK (writing_style IN ('concise', 'detailed', 'simple', 'casual', 'formal', 'visual')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'ready', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course PDFs table
CREATE TABLE IF NOT EXISTS course_pdfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  page_count INTEGER,
  extracted_text TEXT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_by TEXT DEFAULT 'ai_generated' CHECK (created_by IN ('ai_generated', 'user_manual')),
  source_pdf_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Steps table
CREATE TABLE IF NOT EXISTS steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  content TEXT,
  original_content TEXT,
  references JSONB DEFAULT '[]',
  created_by TEXT DEFAULT 'ai_generated' CHECK (created_by IN ('ai_generated', 'user_manual')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outline adaptations table (tracks changes to course outline)
CREATE TABLE IF NOT EXISTS outline_adaptations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('pdf_added', 'pdf_removed', 'manual_edit', 'regenerated')),
  details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_course_pdfs_course_id ON course_pdfs(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_steps_lesson_id ON steps(lesson_id);
CREATE INDEX IF NOT EXISTS idx_outline_adaptations_course_id ON outline_adaptations(course_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_steps_updated_at BEFORE UPDATE ON steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE outline_adaptations ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Users can view their own courses"
  ON courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses"
  ON courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses"
  ON courses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses"
  ON courses FOR DELETE
  USING (auth.uid() = user_id);

-- Course PDFs policies
CREATE POLICY "Users can view PDFs from their courses"
  ON course_pdfs FOR SELECT
  USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert PDFs to their courses"
  ON course_pdfs FOR INSERT
  WITH CHECK (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

CREATE POLICY "Users can update PDFs in their courses"
  ON course_pdfs FOR UPDATE
  USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete PDFs from their courses"
  ON course_pdfs FOR DELETE
  USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

-- Lessons policies
CREATE POLICY "Users can view lessons from their courses"
  ON lessons FOR SELECT
  USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert lessons to their courses"
  ON lessons FOR INSERT
  WITH CHECK (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

CREATE POLICY "Users can update lessons in their courses"
  ON lessons FOR UPDATE
  USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete lessons from their courses"
  ON lessons FOR DELETE
  USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

-- Steps policies
CREATE POLICY "Users can view steps from their courses"
  ON steps FOR SELECT
  USING (lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN courses c ON l.course_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert steps to their courses"
  ON steps FOR INSERT
  WITH CHECK (lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN courses c ON l.course_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can update steps in their courses"
  ON steps FOR UPDATE
  USING (lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN courses c ON l.course_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete steps from their courses"
  ON steps FOR DELETE
  USING (lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN courses c ON l.course_id = c.id
    WHERE c.user_id = auth.uid()
  ));

-- Outline adaptations policies
CREATE POLICY "Users can view adaptations for their courses"
  ON outline_adaptations FOR SELECT
  USING (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert adaptations for their courses"
  ON outline_adaptations FOR INSERT
  WITH CHECK (course_id IN (SELECT id FROM courses WHERE user_id = auth.uid()));
