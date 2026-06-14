export type School = 'ZCAS' | 'UNZA'

export type CourseSlug =
  | 'strategic-management'
  | 'treasury-management'
  | 'corporate-finance'
  | 'bba-1110'

export interface Course {
  id: string
  slug: CourseSlug
  name: string
  school: School
  coverColor: string
  accentColor: string
}

export interface Lesson {
  id: string
  courseId: string
  slug: string
  title: string
  orderIndex: number
}

export interface Step {
  id: string
  lessonId: string
  slug: string
  title: string
  orderIndex: number
  pdfUrl: string | null
  content: StepContent | null
}

export interface StepContent {
  sections: Section[]
  keyTerms: KeyTerm[]
  discussionQuestions: string[]
  learningOutcomes: string[]
}

export interface Section {
  eyebrow: string
  heading: string
  body: string
}

export interface KeyTerm {
  term: string
  definition: string
}

export interface GlossaryEntry {
  id: string
  term: string
  definition: string
  courseId: string | null
}

export interface Profile {
  id: string
  displayName: string | null
  university: School | null
  yearOfStudy: number | null
}

export interface Enrollment {
  userId: string
  courseId: string
  enrolledAt: string
}
