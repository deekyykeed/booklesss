import { courseIndex, DEFAULT_LESSON } from "@/lib/course";
import { LessonReader } from "@/components/reader/LessonReader";

// "/" shows the default lesson, sharing the persistent reader layout.
export default function ReaderHome() {
  const lesson = courseIndex().lessons.get(DEFAULT_LESSON)!;
  return <LessonReader lesson={lesson} />;
}
