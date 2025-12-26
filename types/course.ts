import { WritingStyleId } from '@/constants/WritingStyles';

export interface CourseFormData {
  name: string;
  description: string;
  writingStyle: WritingStyleId | null;
  pdfs: PDFFile[];
}

export interface PDFFile {
  id: string;
  name: string;
  size: number;
  uri: string;
  type: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  writingStyle: WritingStyleId;
  pdfCount: number;
  createdAt: string;
  updatedAt: string;
}
