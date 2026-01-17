# Booklesss Study App - Setup Guide

Complete guide to set up and run your AI-powered study app.

## 🎯 What You're Building

An intelligent study app that:
1. Takes multiple PDF course materials (up to 20 per course)
2. Automatically generates a structured course outline with lessons and steps
3. Rewrites content in your preferred learning style
4. Tracks your study progress
5. Maintains references to original source materials

**Powered by:**
- **Supabase** for backend (database + file storage)
- **Anthropic Claude** for AI content generation

---

## 📋 Prerequisites

- Node.js 18+ installed
- Expo Go app on your phone (iOS or Android) OR simulator/emulator
- Supabase account (free tier works great)
- Anthropic API key (get from console.anthropic.com)

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Supabase client
- Anthropic Claude SDK
- Expo Document Picker
- File System utilities

### Step 2: Set Up Supabase

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details and wait for setup

2. **Run the database schema:**
   - Open your Supabase dashboard
   - Go to **SQL Editor** → **New query**
   - Copy/paste contents from `supabase/schema.sql`
   - Click **Run**

3. **Set up storage:**
   - Follow instructions in `supabase/storage-setup.md`
   - Create the `course-pdfs` bucket
   - Set up storage policies

4. **Get your API keys:**
   - Go to **Project Settings** → **API**
   - Copy:
     - Project URL
     - anon public key

### Step 3: Get Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Go to API Keys section
4. Click "Create Key"
5. Copy the generated key

### Step 4: Configure Environment Variables

1. Open `.env` file in project root
2. Replace placeholders with your actual keys:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
EXPO_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

### Step 5: Run the App

```bash
npm start
```

Then:
- **Phone**: Scan QR code with Expo Go app
- **iOS Simulator**: Press `i`
- **Android Emulator**: Press `a`
- **Web**: Press `w`

---

## 📱 How to Use the App

### Creating Your First Course

1. **Tap "Create Your First Course"**

2. **Step 1: Course Info**
   - Enter course name (e.g., "Biology 101")
   - Add optional description
   - Tap **Next**

3. **Step 2: Choose Writing Style**
   - Select how you want content rewritten:
     - ⚡ **Concise** - Brief bullet points
     - 📚 **Detailed** - Comprehensive explanations
     - 🎈 **Simple (ELI5)** - Easy to understand
     - 💬 **Casual** - Conversational tone
     - 🎓 **Formal** - Academic language
     - 📊 **Visual** - Structured with tables/charts
   - Tap **Next**

4. **Step 3: Upload PDFs**
   - Tap "Select PDFs"
   - Choose up to 20 PDF files
   - Review selected files
   - Tap **Create Course**

5. **Processing** (automatic)
   - PDFs are uploaded to secure storage
   - Text is extracted from each PDF
   - AI generates course outline with lessons and steps
   - Content is rewritten in your chosen style
   - Takes 2-5 minutes depending on PDF count

6. **Study!**
   - View generated course outline
   - Explore lessons and steps
   - Mark steps as complete
   - Track your progress

---

## 🏗️ Architecture Overview

### Database Schema

```
courses
├── id, name, description
├── writing_style
├── status (draft/processing/ready/failed)
└── created_at, updated_at

course_pdfs
├── id, course_id
├── filename, file_url, file_size
├── extracted_text, page_count
├── processing_status
└── upload_date, processed_at

lessons
├── id, course_id
├── title, description
├── order_index
└── source_pdf_ids[]

steps
├── id, lesson_id
├── title, content, original_content
├── order_index, completed
├── references[] (pdf_id, page_number, excerpt)
└── created_at, updated_at
```

### File Structure

```
app/
├── (tabs)/
│   └── index.tsx              # Home screen with courses list
├── course/
│   └── [id].tsx              # Course detail with outline
└── step/
    └── [id].tsx              # Step study view

components/
├── CreateCourseModal.tsx     # 3-step course creation
├── CourseInfoStep.tsx        # Step 1: Name & description
├── WritingStyleStep.tsx      # Step 2: Style selection
├── PDFUploadStep.tsx         # Step 3: PDF uploads
└── LessonCard.tsx           # Lesson with expandable steps

services/
├── courseService.ts          # Course CRUD operations
├── pdfService.ts            # PDF upload & management
├── lessonService.ts         # Lessons & steps operations
├── outlineService.ts        # AI outline generation
└── pdfExtraction.ts         # PDF text extraction

lib/
├── supabase.ts              # Supabase client config
└── claude.ts                # Claude AI client config

supabase/
├── schema.sql               # Database schema
├── storage-setup.md         # Storage configuration
└── README.md                # Supabase setup guide
```

---

## 🔧 Configuration & Customization

### Changing AI Model

Currently using **Claude 3.5 Sonnet** for high-quality content generation.

To use a different model, edit `lib/claude.ts`:

```typescript
// Claude 3.5 Sonnet (default, high quality)
model: 'claude-3-5-sonnet-20241022'

// Claude 3 Opus (highest quality, more expensive)
model: 'claude-3-opus-20240229'

// Claude 3 Haiku (faster, more cost-effective)
model: 'claude-3-haiku-20240307'
```

### Adding More Writing Styles

Edit `constants/WritingStyles.ts`:

```typescript
export const WRITING_STYLES = {
  // ... existing styles

  technical: {
    id: 'technical',
    name: 'Technical',
    description: 'Precise technical language with code examples',
    emoji: '⚙️',
    prompt: 'Use precise technical terminology. Include code examples where relevant.',
  },
};
```

### Customizing Outline Generation

Edit prompts in `services/outlineService.ts`:
- Number of lessons: Change "4-8" to your preferred range
- Steps per lesson: Change "3-7" to your preferred range
- Add specific instructions for your domain

---

## 🧪 Testing

### Test with Sample Course

1. Find or create a few PDF files (3-5 pages each)
2. Create a test course: "Test Course 101"
3. Choose "Concise" writing style
4. Upload PDFs
5. Wait for processing
6. Verify:
   - Course shows as "Ready"
   - Lessons are generated
   - Steps have content
   - Can mark steps complete

### Common Issues

**"Missing Supabase environment variables"**
- Verify `.env` file exists
- Check variable names start with `EXPO_PUBLIC_`
- Restart Metro bundler: Stop server, run `npm start`

**"Row Level Security policy violation"**
- Verify RLS policies were created (check `schema.sql` was run completely)
- For testing without auth, you may need to modify RLS policies

**PDF Upload Fails**
- Check storage bucket exists: `course-pdfs`
- Verify storage policies are set up
- Ensure PDFs are under 50MB (or adjust bucket limit)

**Outline Generation Takes Forever**
- Check Claude API key is valid (EXPO_PUBLIC_ANTHROPIC_API_KEY)
- Verify you haven't hit rate limits
- Check console for error logs

**No Content in Steps**
- Content generation is currently a placeholder
- See `services/pdfExtraction.ts` for implementation options
- For production, implement actual PDF text extraction

---

## 🚀 Next Steps & Enhancements

### Immediate (MVP Complete)

✅ 3-step course creation
✅ PDF upload and storage
✅ AI outline generation
✅ Lessons and steps UI
✅ Progress tracking

### Phase 2 (Production Ready)

- [ ] **Real PDF text extraction**
  - Implement with pdf-parse or cloud service
  - See implementation guide in `services/pdfExtraction.ts`

- [ ] **User authentication**
  - Enable Supabase Auth providers
  - Add login/signup screens

- [ ] **Step content generation**
  - Currently uses mock content
  - Implement AI rewriting for each step

- [ ] **Adaptive outline system**
  - Add/remove PDFs after course creation
  - Regenerate outline with changes

### Phase 3 (Advanced Features)

- [ ] **Flashcard generation**
  - AI creates flashcards from content
  - Spaced repetition system

- [ ] **Quiz generation**
  - Multiple choice questions
  - Progress testing

- [ ] **Notes & highlights**
  - User annotations
  - Personal notes on steps

- [ ] **Study reminders**
  - Push notifications
  - Study streak tracking

- [ ] **Collaboration**
  - Share courses with study groups
  - Collaborative notes

---

## 📊 Cost Estimates

### Supabase (Free Tier)
- Database: 500MB (plenty for MVP)
- Storage: 1GB (enough for ~200 PDFs)
- Bandwidth: 5GB/month

### Anthropic Claude
**Per Course (20 PDFs, ~500 pages total):**
- Claude 3.5 Sonnet: Pricing based on tokens used
- Claude 3 Haiku: Most cost-effective
- Claude 3 Opus: Highest quality, more expensive

*Check [Anthropic Pricing](https://www.anthropic.com/pricing) for current rates*

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic Claude Documentation](https://docs.anthropic.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

---

## 🆘 Support

Having issues? Check:
1. This guide thoroughly
2. `supabase/README.md` for backend setup
3. Console logs for error messages
4. Supabase dashboard for database/storage issues

---

## 🎉 You're Ready!

You now have a complete AI-powered study app that can:
- Generate structured course outlines from PDFs
- Rewrite content in personalized learning styles
- Track study progress
- Maintain source references

Happy studying! 📚✨
