"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LESSON, breadcrumbFor, lessonIdForSlug } from "@/lib/course";

// URL-driven breadcrumb, e.g. "/ Microeconomics / Supply & demand / The law of demand".
// Lives in the persistent layout, so it updates on client-side navigation.
export function LessonBreadcrumb() {
  const pathname = usePathname();
  const id =
    !pathname || pathname === "/"
      ? DEFAULT_LESSON
      : lessonIdForSlug(pathname.replace(/^\/+/, "").split("/")) ?? DEFAULT_LESSON;

  const crumbs = breadcrumbFor(id);

  return (
    <nav className="flex min-w-0 items-center gap-2.5 overflow-hidden">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2.5">
          <span className="select-none text-[#d0d0d0]">/</span>
          <span
            className={
              "whitespace-nowrap text-sm " + (i === crumbs.length - 1 ? "text-ink" : "text-muted")
            }
          >
            {c}
          </span>
        </span>
      ))}
    </nav>
  );
}
