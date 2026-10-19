"use client";

import { useDeferredValue, useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { HugeIcon } from "@/components/icons/huge";
import { COURSES as REAL } from "@/lib/courses";
import { CATEGORIES, CategoryFilter, CategoryMark } from "./CategoryBar";
import { FolderCard } from "./FolderCard";
import { Button } from "./primitives";

/* The marketplace's first page (owner, 2026-10-18: "build out the first page
 * of the marketplace — I want to see what I'm dealing with on desktop and
 * mobile"). Built from the kit and nothing else: the soft tile material, the
 * glass button, Happy Files as the course folder (a course IS a folder), the
 * category selector. Covers are simple placeholders until the videos make
 * their own (owner: "just use simple placeholders").
 *
 * THE FOLDERS ARE THE REAL COURSES (owner, 2026-10-18: "the folders are
 * supposed to be actual real courses — Corporate Finance and so on"), read
 * from lib/courses, so a course added there appears here with nothing to
 * touch. Each is the folder card (FolderCard, real size) with the
 * course's own name and counts. The creators row is still placeholder. */

type Course = {
  id: string;
  title: string;
  subtitle: string;
  cat: string;
  units: number;
  steps: number;
  checks: number;
  mins: number;
  /** Not a real course yet: it has no page to open. */
  placeholder?: boolean;
};

/* PLACEHOLDER COURSES (owner, 2026-10-19: "add a bunch more courses so I
 * can properly filter them"). Enough of them, spread across every
 * category, for the filter popup to mean something. None of these has a
 * page — Start and Open do nothing on them — and every number is made up.
 * Delete rows here as real courses replace them. */
const PLACEHOLDERS: Course[] = [
  // finance
  { id: "ph-financial-management", title: "Financial Management", subtitle: "Capital structure, dividends and the cost of money.", cat: "finance", units: 7, steps: 34, checks: 34, mins: 170 },
  { id: "ph-investment-analysis", title: "Investment Analysis", subtitle: "Reading a company before you put money in it.", cat: "finance", units: 5, steps: 22, checks: 22, mins: 110 },
  { id: "ph-personal-finance", title: "Personal Finance", subtitle: "Budgets, savings and debt on a kwacha salary.", cat: "finance", units: 4, steps: 16, checks: 16, mins: 80 },
  // accounting
  { id: "ph-financial-accounting", title: "Financial Accounting", subtitle: "From the first journal entry to a full set of statements.", cat: "accounting", units: 8, steps: 40, checks: 40, mins: 200 },
  { id: "ph-management-accounting", title: "Management Accounting", subtitle: "Costing, budgeting and the numbers managers run on.", cat: "accounting", units: 6, steps: 28, checks: 28, mins: 140 },
  { id: "ph-auditing", title: "Auditing", subtitle: "How an auditor decides whether the books can be trusted.", cat: "accounting", units: 5, steps: 24, checks: 24, mins: 120 },
  { id: "ph-taxation", title: "Taxation", subtitle: "Income tax, VAT and PAYE the way ZRA applies them.", cat: "accounting", units: 6, steps: 30, checks: 30, mins: 150 },
  // economics
  { id: "ph-microeconomics", title: "Microeconomics", subtitle: "Prices, markets and the choices behind them.", cat: "economics", units: 6, steps: 30, checks: 30, mins: 150 },
  { id: "ph-macroeconomics", title: "Macroeconomics", subtitle: "Inflation, the kwacha, interest rates and growth.", cat: "economics", units: 6, steps: 28, checks: 28, mins: 140 },
  { id: "ph-development-economics", title: "Development Economics", subtitle: "Why some economies grow and others stall.", cat: "economics", units: 5, steps: 20, checks: 20, mins: 100 },
  // business
  { id: "ph-marketing-principles", title: "Marketing Principles", subtitle: "Customers, positioning and the four Ps in practice.", cat: "business", units: 5, steps: 24, checks: 24, mins: 120 },
  { id: "ph-operations-management", title: "Operations Management", subtitle: "Getting things made and delivered without waste.", cat: "business", units: 6, steps: 26, checks: 26, mins: 130 },
  { id: "ph-human-resource-management", title: "Human Resource Management", subtitle: "Hiring, paying, developing and keeping people.", cat: "business", units: 5, steps: 22, checks: 22, mins: 110 },
  { id: "ph-business-communication", title: "Business Communication", subtitle: "Emails, reports and meetings that get a decision.", cat: "business", units: 4, steps: 14, checks: 14, mins: 70 },
  // tech
  { id: "ph-intro-to-programming", title: "Introduction to Programming", subtitle: "Variables, loops and your first working program.", cat: "tech", units: 6, steps: 32, checks: 32, mins: 160 },
  { id: "ph-data-analysis-excel", title: "Data Analysis with Excel", subtitle: "Pivot tables, lookups and charts that answer questions.", cat: "tech", units: 4, steps: 18, checks: 18, mins: 90 },
  { id: "ph-information-systems", title: "Management Information Systems", subtitle: "How businesses run on software, and what breaks.", cat: "tech", units: 5, steps: 20, checks: 20, mins: 100 },
  // design
  { id: "ph-visual-design", title: "Introduction to Visual Design", subtitle: "Type, colour, space and why a layout feels right.", cat: "design", units: 4, steps: 18, checks: 18, mins: 90 },
  { id: "ph-ux-fundamentals", title: "UX Fundamentals", subtitle: "Designing for the person on the other side of the screen.", cat: "design", units: 5, steps: 22, checks: 22, mins: 110 },
  // science
  { id: "ph-business-statistics", title: "Business Statistics", subtitle: "Averages, probability and tests you can defend.", cat: "science", units: 6, steps: 28, checks: 28, mins: 140 },
  { id: "ph-quantitative-methods", title: "Quantitative Methods", subtitle: "The maths behind forecasts, loans and decisions.", cat: "science", units: 5, steps: 24, checks: 24, mins: 120 },
  // law
  { id: "ph-business-law", title: "Business Law", subtitle: "Contracts, companies and what a signature commits you to.", cat: "law", units: 6, steps: 26, checks: 26, mins: 130 },
  { id: "ph-commercial-law", title: "Commercial Law", subtitle: "Sale of goods, agency and negotiable instruments.", cat: "law", units: 5, steps: 22, checks: 22, mins: 110 },
  // health
  { id: "ph-health-economics", title: "Health Economics", subtitle: "Paying for care when there is never enough money.", cat: "health", units: 4, steps: 16, checks: 16, mins: 80 },
  { id: "ph-public-health", title: "Public Health Basics", subtitle: "Disease, prevention and the numbers that track them.", cat: "health", units: 5, steps: 20, checks: 20, mins: 100 },
  // startups
  { id: "ph-entrepreneurship", title: "Entrepreneurship", subtitle: "From an idea to a business that pays its own rent.", cat: "startups", units: 5, steps: 22, checks: 22, mins: 110 },
  { id: "ph-business-plan", title: "Writing a Business Plan", subtitle: "The plan a bank or an investor will actually read.", cat: "startups", units: 3, steps: 12, checks: 12, mins: 60 },
  // writing
  { id: "ph-academic-writing", title: "Academic Writing", subtitle: "Essays and reports that argue instead of describe.", cat: "writing", units: 4, steps: 16, checks: 16, mins: 80 },
  { id: "ph-research-methods", title: "Research Methods", subtitle: "Asking a question the data can answer.", cat: "writing", units: 5, steps: 22, checks: 22, mins: 110 },
];

/* Which category chip each real course answers to. A course missing here
 * still shows under All. */
const CATEGORY_OF: Record<string, string> = {
  economics: "economics",
  "corporate-finance": "finance",
  "strategic-management": "business",
  "treasury-management": "finance",
};

/* A step is one concept and one checkpoint, about five minutes to read. */
const MINS_PER_STEP = 5;

/* The real courses first, then the placeholders. */
const COURSES: Course[] = [
  ...REAL.map((c) => ({
    id: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    cat: CATEGORY_OF[c.slug] ?? "all",
    units: c.displayUnitIds.length,
    steps: c.lessonIds.length,
    checks: c.totalCheckpoints,
    mins: c.lessonIds.length * MINS_PER_STEP,
  })),
  ...PLACEHOLDERS.map((c) => ({ ...c, placeholder: true })),
];

const counts: Record<string, number> = COURSES.reduce(
  (n, c) => ({ ...n, [c.cat]: (n[c.cat] ?? 0) + 1 }),
  { all: COURSES.length } as Record<string, number>,
);

const PAGE = 8;

const CREATORS = ["Chanda Mwila", "Kondwani Mulenga", "Natasha Phiri", "Bwalya Zulu", "Luyando Sakala", "Musonda Kabwe"];

const hueOf = (cat: string) => CATEGORIES.find((c) => c.id === cat)?.hue ?? "#5c68fe";
const catOf = (cat: string) => CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0];
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("");

function greeting(h: number) {
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/* A placeholder cover: the category's hue as a soft wash and its mark. */
function Cover({ c, big }: { c: Course; big?: boolean }) {
  const cat = catOf(c.cat);
  return (
    <span className="kit-mk-cover" style={{ "--hue": cat.hue } as CSSProperties} aria-hidden>
      <span className="kit-mk-cover-mark">
        <CategoryMark c={cat} look="bold" size={big ? 44 : 28} />
      </span>
      <span className="kit-mk-cover-play">
        <HugeIcon name="play" size={big ? 22 : 16} strokeWidth={1.75} />
      </span>
    </span>
  );
}

export function MarketHome({ onMenu, name = "Deeky" }: { onMenu?: () => void; name?: string }) {
  const router = useRouter();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const hour = useMemo(() => new Date().getHours(), []);
  // Typing stays instant; the grid catches up a beat later.
  const dq = useDeferredValue(q);

  const shown = useMemo(() => {
    const t = dq.trim().toLowerCase();
    return COURSES.filter(
      (c) =>
        (cat === "all" || c.cat === cat) &&
        (!t || c.title.toLowerCase().includes(t) || c.subtitle.toLowerCase().includes(t)),
    );
  }, [cat, dq]);
  /* A page of cards at a time (owner, 2026-10-19: "showing all the courses
   * at once may slow it down too much … I don't expect people to scroll
   * much since we have filters"). Every card is an SVG surface with blurred
   * layers and a glass button, so 33 at once was the page's real cost. A new
   * filter or search starts back at one page. */
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => setLimit(PAGE), [cat, dq]);
  const page = shown.slice(0, limit);
  const catLabel = catOf(cat).label;
  // A placeholder has no page, so opening it goes nowhere.
  const open = (id: string) => {
    if (!COURSES.find((c) => c.id === id)?.placeholder) router.push(`/${id}`);
  };

  return (
    <div className="kit-mk">
      <header className="kit-mk-top">
        {onMenu && (
          <span className="kit-mk-menu">
            <Button variant="soft" size="sm" icon="menu" iconOnly label="Open menu" onClick={onMenu} />
          </span>
        )}
        <div className="kit-mk-hello">
          <h1>
            {greeting(hour)}, {name}
          </h1>
          <p>What do you want to learn today?</p>
        </div>
        <label className="kit-mk-search">
          <HugeIcon name="search" size={18} strokeWidth={1.75} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses" aria-label="Search courses" />
        </label>
        <span className="kit-mk-me">
          <Button variant="soft" size="md" icon="user" iconOnly label="Your account" />
        </span>
      </header>

      <section className="kit-mk-section">
        <header>
          {/* The Filters button already names the category, so the heading
              stays "Courses" — a long category made it wrap three deep. */}
          <h3>{q ? `Results for “${q}”` : "Courses"}</h3>
          <span>
            {shown.length} {shown.length === 1 ? "course" : "courses"}
          </span>
          <CategoryFilter value={cat} onChange={setCat} counts={counts} />
        </header>
        {shown.length === 0 ? (
          <p className="kit-mk-empty">No {catLabel.toLowerCase()} course yet. Make the first one in Studio.</p>
        ) : (
          <ul className="kit-mk-grid">
            {page.map((c) => (
              <li key={c.id}>
                <FolderCard
                    title={c.title}
                    description={c.subtitle}
                    eyebrow={catOf(c.cat).id === "all" ? "COURSE" : catOf(c.cat).label.toUpperCase()}
                    /* The three numbers that decide a pick (owner, 2026-10-19):
                       how many lessons, how long, how many quick checks. Units
                       went — a count of folders tells a student nothing. */
                    stats={[
                      { icon: "video", n: c.steps, label: "lessons" },
                      { icon: "clock-1", n: Math.max(1, Math.round(c.mins / 60)), unit: "h", label: "hours" },
                      { icon: "task-done", n: c.checks, label: "quick checks" },
                    ]}
                    actions={[
                      { label: "Open", onPick: () => open(c.id) },
                      { label: saved[c.id] ? "Unsave" : "Save", onPick: () => setSaved((s) => ({ ...s, [c.id]: !s[c.id] })) },
                      { label: "Share" },
                    ]}
                    onOpen={() => open(c.id)}
                />
              </li>
            ))}
          </ul>
        )}
        {shown.length > limit && (
          <div className="kit-mk-more">
            <Button variant="soft" size="md" icon="chevron-down" onClick={() => setLimit((n) => n + PAGE)}>
              See more
            </Button>
          </div>
        )}
      </section>

      <section className="kit-mk-section">
        <header>
          <h3>Creators to follow</h3>
        </header>
        <ul className="kit-mk-rail kit-mk-creators">
          {CREATORS.map((n, i) => (
            <li key={n}>
              <span className="kit-mk-creator">
                <span className="kit-mk-avatar kit-mk-avatar--lg" style={{ "--hue": CATEGORIES[(i % 11) + 1].hue } as CSSProperties} aria-hidden>
                  {initials(n)}
                </span>
                <strong>{n}</strong>
                <small>Creator</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
