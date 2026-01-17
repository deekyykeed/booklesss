# Implementation Plan: Complete Core Learning Experience

## Overview
This plan completes the core learning workflow for Bookless: course creation with PDF upload → AI outline generation → content generation, plus enhanced study features (search & highlighting).

---

## 🎯 Phase 1: Complete Course Creation Workflow

### Current State Analysis
- ✅ **CreateCourseModal** exists with 3-step UI (Info → Style → PDFs)
- ✅ **PDF upload** works locally (DocumentPicker)
- ✅ **outlineService.ts** has outline generation with Claude
- ✅ **pdfService.ts** has upload/storage functions
- ⚠️ **Home screen** has no integration with CreateCourseModal
- ⚠️ **No orchestration** to tie upload → extraction → outline → content together
- ⚠️ **PDF extraction** is mocked (intentionally, per user preference)
- ⚠️ **Step content generation** only has basic shell in outlineService

### Implementation Tasks

#### 1.1 Wire Up Course Creation Button (Home Screen)
**File:** `app/(tabs)/index.tsx`

**Changes:**
- Add state for `CreateCourseModal` visibility
- Import `CreateCourseModal` component
- Wire up the floating "+" button (`handleAddPress`) to open modal
- Create `handleCourseCreate` function to handle modal completion
- Replace mock courses array with real data from Supabase
- Add loading state while fetching courses
- Add pull-to-refresh functionality

**Flow:**
```
User clicks + button
→ Modal opens
→ User fills form
→ User clicks "Create Course"
→ handleCourseCreate executes workflow
→ Modal closes
→ Courses list refreshes
```

#### 1.2 Create Course Orchestration Service
**New File:** `services/courseWorkflowService.ts`

**Purpose:** Orchestrate the full course creation pipeline

**Functions:**
```typescript
createCourseWithPDFs(formData: CourseFormData): Promise<Course>
  ↓
  1. Create course record (draft status)
  2. Upload all PDFs to Supabase Storage
  3. Create PDF records in database
  4. Extract text from PDFs (mock for now)
  5. Generate course outline with AI
  6. Update course status to 'ready'
  7. Return created course

processCourseCreation(courseId: string): Promise<void>
  ↓
  Background job to handle:
  - PDF text extraction
  - Outline generation
  - Initial content generation
```

**Error Handling:**
- If any step fails, update course status to 'failed'
- Store error details for debugging
- Allow retry mechanism

#### 1.3 Implement Step Content Generation
**File:** `services/outlineService.ts` (extend existing)

**New Function:**
```typescript
async generateAllStepContent(courseId: string, writingStyle: WritingStyleId): Promise<void>
```

**Process:**
1. Fetch all steps for course (that don't have content yet)
2. For each step:
   - Find relevant PDF excerpts based on step title/topics
   - Generate content using Claude with writing style
   - Add source references (PDF ID, page numbers)
   - Update step record with content
3. Mark course as fully ready

**Alternative Function (For Later):**
```typescript
async generateSingleStepContent(stepId: string): Promise<void>
```
- Generate content on-demand when user opens a step
- Useful for large courses to avoid long initial wait

#### 1.4 Add Progress Feedback UI
**Enhancement:** Show user what's happening during course creation

**Approach:**
- Add a processing screen/modal that shows:
  - "Uploading PDFs..." (with count)
  - "Extracting text..." (with progress)
  - "Generating course outline..." (with AI animation)
  - "Creating lessons and steps..."
- Use course `status` field to track state
- Allow user to close and check back later
- Show processing status on course card if not ready

---

## 🔍 Phase 2: Enhanced Study Experience - Search

### Implementation Tasks

#### 2.1 Create Database Search Infrastructure
**New File:** `services/searchService.ts`

**Functions:**
```typescript
// Search across course content
searchCourseContent(query: string, courseId?: string): Promise<SearchResult[]>
  → Searches: lesson titles, step titles, step content
  → Returns: ranked results with context snippets

// Search source PDFs
searchPDFContent(query: string, courseId?: string): Promise<PDFSearchResult[]>
  → Searches: extracted_text in course_pdfs table
  → Returns: PDF filename, page estimate, excerpt

// Search highlights (Phase 3 dependency)
searchHighlights(query: string): Promise<HighlightSearchResult[]>
  → Searches: user's highlighted text and notes
  → Returns: highlight with context and course info
```

**Search Result Types:**
```typescript
interface SearchResult {
  type: 'lesson' | 'step' | 'pdf' | 'highlight';
  id: string;
  title: string;
  excerpt: string; // Snippet with matched text
  courseName: string;
  courseId: string;
  url: string; // Deep link to content
}
```

#### 2.2 Build Search UI
**File:** `app/(tabs)/search.tsx`

**Features:**
- Search input with debouncing (300ms)
- Filter chips: "All", "Courses", "PDFs", "Highlights"
- Recent searches history
- Search results grouped by type
- Tap result → navigate to content
- Empty state with suggestions
- Loading state while searching

**UI Components to Create:**
- `SearchBar` component (reusable)
- `SearchResultCard` component
- `SearchFilterChips` component

#### 2.3 Add In-Course Search
**File:** `app/course/[id].tsx`

**Feature:**
- Add search icon to course detail header
- Opens in-course search (scoped to current course only)
- Search lessons & steps within course
- Quick navigation to matched steps

---

## ✨ Phase 3: Highlighting System

### Database Changes

#### 3.1 Create Highlights Table
**File:** `supabase/migrations/add_highlights.sql`

```sql
CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE NOT NULL,

  -- Text selection info
  selected_text TEXT NOT NULL,
  selection_start INTEGER NOT NULL,
  selection_end INTEGER NOT NULL,

  -- Highlight metadata
  color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'purple')),
  note TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_highlights_user_id ON highlights(user_id);
CREATE INDEX idx_highlights_step_id ON highlights(step_id);

-- RLS policies
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own highlights"
  ON highlights FOR ALL
  USING (auth.uid() = user_id);
```

### Implementation Tasks

#### 3.2 Create Highlighting Service
**New File:** `services/highlightService.ts`

```typescript
// Create a highlight
createHighlight(stepId: string, text: string, start: number, end: number, color: string): Promise<Highlight>

// Get highlights for a step
getStepHighlights(stepId: string): Promise<Highlight[]>

// Get all user highlights (for collection view)
getAllHighlights(): Promise<HighlightWithContext[]>

// Update highlight (color or note)
updateHighlight(id: string, updates: Partial<Highlight>): Promise<void>

// Delete highlight
deleteHighlight(id: string): Promise<void>

// Search highlights
searchHighlights(query: string): Promise<Highlight[]>
```

#### 3.3 Add Text Selection to Step Viewer
**File:** `app/step/[id].tsx`

**Changes:**
1. Make step content text selectable
2. Add custom selection menu (appears on text selection):
   - Color picker (5 colors)
   - "Add Note" button
   - "Cancel" button
3. Render highlights within content:
   - Wrap highlighted text in colored backgrounds
   - Show note icon if highlight has note
   - Tap highlight → view/edit note
4. Store highlights in database on creation

**Technical Approach:**
- Use React Native's `Text` component `selectable` prop
- Track selection with `onSelectionChange`
- Calculate start/end positions in text
- Render highlights as inline components

**Libraries to Consider:**
- `react-native-text-input-highlight` (if needed for advanced cases)
- Custom solution using Text positioning

#### 3.4 Create Highlights Collection View
**File:** `app/(tabs)/highlights.tsx`

**Replace placeholder with:**
- List of all user highlights across all courses
- Group by course or by date
- Sort options: Recent, By Course, By Color
- Each highlight card shows:
  - Highlighted text
  - Course name → Lesson → Step
  - Color indicator
  - Note (if present)
  - Tap → navigate to step
- Search bar at top
- Filter by color
- "Export All" button (future enhancement)

**Components:**
- `HighlightCard` component
- `HighlightFilters` component

#### 3.5 Add Note-Taking to Highlights
**File:** `app/step/[id].tsx` (enhancement)

**Features:**
- When creating highlight, show note input modal
- User can add/edit notes on existing highlights
- Notes appear in highlight tooltip/modal
- Notes searchable in search feature

---

## 📊 Phase 4: Testing & Polish

### 4.1 End-to-End Testing Checklist

**Course Creation Flow:**
- [ ] Click + button opens modal
- [ ] Fill in course info → Next works
- [ ] Select writing style → Next works
- [ ] Upload PDFs (test 1, 5, 20 PDFs)
- [ ] Click "Create Course" → Processing starts
- [ ] Course appears in list with "processing" status
- [ ] After processing, course shows "ready" status
- [ ] Open course → lessons and steps appear
- [ ] Open step → content displays

**Search Flow:**
- [ ] Search returns results from lessons/steps
- [ ] Search returns results from PDFs
- [ ] Search returns results from highlights
- [ ] Filter chips work correctly
- [ ] Tapping result navigates to correct location
- [ ] In-course search works
- [ ] Recent searches saved

**Highlighting Flow:**
- [ ] Select text in step → highlight menu appears
- [ ] Choose color → highlight saved
- [ ] Highlight appears in text with correct color
- [ ] Add note to highlight
- [ ] View note on highlighted text
- [ ] Edit note
- [ ] Delete highlight
- [ ] Highlights tab shows all highlights
- [ ] Search finds highlighted text

### 4.2 Error Handling

**Add error handling for:**
- PDF upload failures (network, size limits)
- AI generation failures (API errors, rate limits)
- Database write failures
- Missing content scenarios

**User-Facing Errors:**
- Toast notifications for temporary errors
- Inline error states for critical failures
- Retry mechanisms where appropriate
- Clear error messages

### 4.3 Performance Optimizations

**Implement:**
- Pagination for course list (if > 20 courses)
- Lazy loading for step content
- Debounced search queries
- Optimistic UI updates for highlights
- Cache course data locally
- Background sync for processing status

### 4.4 UX Polish

**Enhancements:**
- Loading skeletons during data fetches
- Empty states with helpful CTAs
- Success animations (confetti on course creation?)
- Haptic feedback on key interactions
- Pull-to-refresh on course list
- Smooth transitions between screens

---

## 🎯 Implementation Order (Recommended)

### Sprint 1: Complete Course Creation (3-5 days)
1. Wire up home screen + button → modal
2. Implement `courseWorkflowService.ts`
3. Connect modal completion → workflow
4. Add progress UI
5. Test end-to-end flow

### Sprint 2: Step Content Generation (2-3 days)
6. Implement `generateAllStepContent()`
7. Add background job for content generation
8. Handle empty content states in UI
9. Test content appears after generation

### Sprint 3: Search Functionality (3-4 days)
10. Create `searchService.ts`
11. Build search UI in search tab
12. Add in-course search
13. Test all search types

### Sprint 4: Highlighting System (4-6 days)
14. Create database migration for highlights
15. Implement `highlightService.ts`
16. Add text selection + highlighting to step viewer
17. Build highlights collection view
18. Add note-taking
19. Test highlighting flow

### Sprint 5: Polish & Testing (2-3 days)
20. End-to-end testing
21. Error handling
22. Performance optimization
23. UX polish

**Total Estimated Time:** 14-21 days (2-3 weeks)

---

## 🔧 Technical Considerations

### AI Content Generation Strategy
**Current:** Claude for all AI generation (outline + content)
- Claude excels at educational content
- Better adherence to writing styles
- More consistent output quality

**Implementation:**
```typescript
// In outlineService.ts
import { generateContent } from '@/lib/claude';

async function generateStepContent(stepTitle: string, pdfExcerpts: string[], writingStyle: WritingStyleId) {
  const prompt = buildStepPrompt(stepTitle, pdfExcerpts, writingStyle);
  return await generateContent(prompt);
}
```

### Highlighting Technical Challenges
**Challenge 1:** Text selection in React Native is limited
**Solution:** Use `selectable` Text + manual position tracking

**Challenge 2:** Rendering highlights inline
**Solution:** Parse content, inject highlight components at correct positions

**Challenge 3:** Note UI on mobile
**Solution:** Modal-based note editor with rich text support (optional)

### Search Performance
**Challenge:** Full-text search across large datasets
**Solutions:**
- Use PostgreSQL `to_tsvector` for full-text search in Supabase
- Index lesson titles, step titles, content
- Implement result ranking by relevance
- Limit results (top 50)
- Add pagination for large result sets

**Example Query:**
```sql
SELECT * FROM steps
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', $query)
ORDER BY ts_rank(to_tsvector('english', content), to_tsquery('english', $query)) DESC
LIMIT 50;
```

---

## 🚀 Post-MVP Enhancements (Future)

1. **Real PDF Text Extraction**
   - Supabase Edge Function with `pdf-parse`
   - OCR for scanned PDFs (Google Cloud Vision)

2. **Collaborative Features**
   - Share courses with other users
   - Shared highlights and notes
   - Discussion threads on steps

3. **Advanced Study Features**
   - Spaced repetition flashcards
   - Quiz generation from content
   - Study streaks and gamification

4. **Export & Sharing**
   - Export highlights to Markdown/PDF
   - Share individual lessons
   - Print-friendly formats

5. **Offline Support**
   - Download courses for offline study
   - Sync highlights when back online
   - Offline search

---

## ✅ Success Criteria

**Phase 1 Complete:**
- User can create course from home screen
- PDFs upload successfully
- AI generates structured outline
- Course appears with lessons & steps
- Step content is generated

**Phase 2 Complete:**
- User can search across all courses
- Search returns relevant results
- Search works for content, PDFs, highlights
- In-course search works

**Phase 3 Complete:**
- User can select and highlight text
- Highlights persist and display correctly
- Notes can be added to highlights
- Highlights tab shows all highlights
- Highlights are searchable

**Overall Success:**
- Complete end-to-end learning workflow
- Core study features functional
- Stable and performant
- Ready for user testing

---

## 📝 Files to Create

**New Files:**
1. `services/courseWorkflowService.ts` - Orchestration
2. `services/searchService.ts` - Search functionality
3. `services/highlightService.ts` - Highlighting
4. `components/SearchBar.tsx` - Reusable search
5. `components/SearchResultCard.tsx` - Search results
6. `components/HighlightCard.tsx` - Highlight display
7. `components/ProcessingModal.tsx` - Course creation progress
8. `supabase/migrations/add_highlights.sql` - Highlights table
9. `types/search.ts` - Search type definitions
10. `types/highlight.ts` - Highlight type definitions

**Files to Modify:**
1. `app/(tabs)/index.tsx` - Add modal integration
2. `app/(tabs)/search.tsx` - Build search UI
3. `app/(tabs)/highlights.tsx` - Build highlights view
4. `app/step/[id].tsx` - Add highlighting
5. `app/course/[id].tsx` - Add in-course search
6. `services/outlineService.ts` - Extend content generation
7. `components/CreateCourseModal.tsx` - Minor tweaks (optional)

---

## 🎨 Design Considerations

### Course Creation Progress
- Use existing modal pattern for consistency
- Show step-by-step progress indicators
- Allow background processing (user can close modal)
- Show notification when course ready

### Search UI
- Prominent search bar (same style as existing inputs)
- Group results by type (courses, PDFs, highlights)
- Show match context (snippet with highlighted query)
- Recent searches for quick access

### Highlighting
- Use subtle background colors (pastel shades)
- Note indicator: small icon next to highlighted text
- Modal for note editing (consistent with app modals)
- Highlights tab: card-based layout (similar to course cards)

---

## 🔐 Security & Privacy

**Highlights:**
- User-scoped only (RLS policies)
- No sharing by default
- Delete cascade on user/step deletion

**Search:**
- Only search user's own content
- No cross-user search
- Sanitize search queries

**Course Creation:**
- Validate PDF file types
- Limit file sizes (enforce in UI + backend)
- Rate limit AI generation requests
- User owns all generated content

---

## Dependencies & Prerequisites

**Existing:**
- ✅ Supabase configured
- ✅ Auth working (anonymous)
- ✅ Claude API key set
- ✅ File upload permissions

**Needed:**
- Run highlights migration (new table)
- Ensure storage bucket `course-pdfs` exists
- Verify RLS policies active
- Test API rate limits

---

## Risk Assessment

**High Risk:**
- AI generation failures → Mitigation: retry logic, fallback messages
- Large PDF processing → Mitigation: file size limits, streaming

**Medium Risk:**
- Highlighting performance on long content → Mitigation: virtualization, pagination
- Search performance → Mitigation: DB indexing, result limits

**Low Risk:**
- Modal state management → Standard React patterns
- UI polish → Iterative improvement

---

## Next Steps After Approval

1. Review and approve this plan
2. Clarify any questions or concerns
3. Begin Sprint 1: Course Creation
4. Implement in order listed
5. Test each phase before moving to next
6. Iterate based on testing feedback

