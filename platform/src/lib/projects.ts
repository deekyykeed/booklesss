import type { HugeIconName } from "@/components/icons/huge";

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
  /** The file-type discs that peek out of the folder's mouth. */
  badges: [HugeIconName, HugeIconName];
};

export const PROJECTS: Project[] = [
  { title: "Content", files: 23, storage: "656MB", updated: "2 days ago", badges: ["file", "pdf"] },
  { title: "Khadzika Operations", files: 41, storage: "1.2GB", updated: "6 days ago", badges: ["pdf", "file"] },
  { title: "Corporate Finance", files: 26, storage: "310MB", updated: "1 week ago", badges: ["file", "pdf"] },
  { title: "Strategic Management", files: 8, storage: "94MB", updated: "1 week ago", badges: ["pdf", "file"] },
  { title: "Dissertation", files: 14, storage: "48MB", updated: "3 weeks ago", badges: ["file", "pdf"] },
  { title: "Booklesss", files: 60, storage: "2.1GB", updated: "1 month ago", badges: ["pdf", "file"] },
  { title: "Career", files: 5, storage: "12MB", updated: "2 months ago", badges: ["file", "pdf"] },
  { title: "Farm", files: 3, storage: "8MB", updated: "3 months ago", badges: ["pdf", "file"] },
  { title: "IA Course", files: 19, storage: "220MB", updated: "3 months ago", badges: ["file", "pdf"] },
  { title: "Innovation & Entrepreneurship", files: 11, storage: "36MB", updated: "4 months ago", badges: ["pdf", "file"] },
];

export const recent = (n: number) => PROJECTS.slice(0, n);
