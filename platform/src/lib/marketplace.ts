/* ⚠️ PLACEHOLDER DATA. The marketplace is designed ahead of the video courses
 * it will list, so these rows are the Paper design's own samples — Zambian
 * creators, made-up courses. Nothing here is a real course or a real person,
 * and the page reads this one module and nothing else, so swapping in the
 * real catalogue is this file. */

export type MarketCourse = {
  slug: string;
  title: string;
  creator: string;
  lessons: number;
  minutes: number;
  rating: number;
  access: "free" | "members";
  image: string;
};

export type MarketCollection = {
  name: string;
  tag: string;
  courses: number;
  free: number;
  videos: number;
  quizzes: number;
};

export const FEATURED = {
  title: "Finance 101",
  creator: "Thandiwe Banda",
  lessons: 7,
};

export const COLLECTIONS: MarketCollection[] = [
  { name: "Finance", tag: "NEW", courses: 12, free: 5, videos: 86, quizzes: 31 },
  { name: "Accounting", tag: "POPULAR", courses: 9, free: 4, videos: 64, quizzes: 22 },
];

export const POPULAR: MarketCourse[] = [
  { slug: "cost-accounting-basics", title: "Cost Accounting Basics", creator: "Mutale Phiri", lessons: 6, minutes: 31, rating: 4.8, access: "free", image: "/marketplace/st-c1.jpg" },
  { slug: "microeconomics-made-simple", title: "Microeconomics Made Simple", creator: "Bwalya Mwansa", lessons: 8, minutes: 40, rating: 4.9, access: "free", image: "/marketplace/st-c2.jpg" },
  { slug: "introduction-to-marketing", title: "Introduction to Marketing", creator: "Kondwani Lungu", lessons: 5, minutes: 24, rating: 4.7, access: "members", image: "/marketplace/st-c3.jpg" },
  { slug: "statistics-for-business", title: "Statistics for Business", creator: "Natasha Zulu", lessons: 9, minutes: 46, rating: 4.8, access: "free", image: "/marketplace/st-c4.jpg" },
];
