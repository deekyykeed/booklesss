/* ------------------------------------------------------------------ *
 * THE DASHBOARD'S PROJECTS — mock, like everything else in the `.cui`
 * transcription. It lives here rather than inside ProjectsPage because the
 * home screen shows the most recent of them too, and two copies of a list
 * is how the two screens start disagreeing about what "recent" means.
 *
 * Ordered newest first. `recent()` is the only thing the home screen needs
 * to know about that ordering.
 * ------------------------------------------------------------------ */

export type Project = {
  title: string;
  files: number;
  storage: string;
  updated: string;
  /** Only two of the reference's own ten projects carry one. */
  desc?: string;
};

export const PROJECTS: Project[] = [
  { title: "Content", files: 23, storage: "656MB", updated: "2 days ago" },
  { title: "Khadzika Operations", files: 41, storage: "1.2GB", updated: "6 days ago" },
  { title: "Corporate Finance", files: 26, storage: "310MB", updated: "1 week ago" },
  { title: "Strategic Management", files: 8, storage: "94MB", updated: "1 week ago" },
  {
    title: "Dissertation",
    files: 14,
    storage: "48MB",
    updated: "3 weeks ago",
    desc: "An examination of factors influencing the adoption of AI-powered learning technologies among accounting students",
  },
  {
    title: "Booklesss",
    files: 60,
    storage: "2.1GB",
    updated: "1 month ago",
    desc: "An online community of students who want to find ways of making school a lot easier and more engaging. These are people who have recognized that the current system is not working for them.",
  },
  { title: "Career", files: 5, storage: "12MB", updated: "2 months ago" },
  { title: "Farm", files: 3, storage: "8MB", updated: "3 months ago" },
  { title: "IA Course", files: 19, storage: "220MB", updated: "3 months ago" },
  { title: "Innovation & Entrepreneurship", files: 11, storage: "36MB", updated: "4 months ago" },
];

export const recent = (n: number) => PROJECTS.slice(0, n);
