-- ============================================================
-- Booklesss — lesson & step skeleton seed
-- Run in Supabase SQL Editor AFTER schema.sql.
--
-- Populates the full lesson/step map (titles, slugs, order) for all four
-- active courses so course pages show the complete syllabus even where a
-- step's content hasn't been written yet. `content` is left null for
-- unbuilt steps — the lesson page renders a "Coming Soon" placeholder for
-- those (see components/LessonContent.tsx).
--
-- Safe to re-run: each course's lessons/steps are wiped and reinserted
-- before content is seeded by the companion seed_content_*.sql files, so
-- there's no risk of duplicate/orphaned rows from partial prior seeding
-- (e.g. the hand-seeded SM Step 3.1 from an earlier session). No student
-- data depends on step ids yet — enrollments/bookmarks cascade-delete is
-- an accepted tradeoff pre-launch.
-- ============================================================

-- ── Strategic Management (ZCAS) — 3 lessons, 7 steps ────────────────────
do $$
declare v_course_id uuid;
begin
  select id into v_course_id from courses where slug = 'strategic-management';

  delete from steps where lesson_id in (select id from lessons where course_id = v_course_id);
  delete from lessons where course_id = v_course_id;

  insert into lessons (course_id, slug, title, order_index) values
    (v_course_id, 'foundations', 'Foundations', 1),
    (v_course_id, 'environment',  'Environment', 2),
    (v_course_id, 'strategy',     'Strategy',    3);

  insert into steps (lesson_id, slug, title, order_index) values
    ((select id from lessons where course_id = v_course_id and slug = 'foundations'), 'intro-to-strategy',      'Introduction to Corporate Strategy',                      1),
    ((select id from lessons where course_id = v_course_id and slug = 'foundations'), 'mission-and-vision',     'Vision, Mission & Objectives',                            2),
    ((select id from lessons where course_id = v_course_id and slug = 'environment'), 'external-environment',   'The External Environment',                                1),
    ((select id from lessons where course_id = v_course_id and slug = 'environment'), 'internal-environment',   'The Internal Environment',                                2),
    ((select id from lessons where course_id = v_course_id and slug = 'strategy'),    'corporate-strategy',     'Corporate Strategy',                                      1),
    ((select id from lessons where course_id = v_course_id and slug = 'strategy'),    'competitive-strategy',   'Competitive Strategy',                                    2),
    ((select id from lessons where course_id = v_course_id and slug = 'strategy'),    'strategy-implementation','Strategy Implementation',                                 3);
end $$;

-- ── Treasury Management BBF4302 (ZCAS) — 5 lessons, 10 steps ────────────
do $$
declare v_course_id uuid;
begin
  select id into v_course_id from courses where slug = 'treasury-management';

  delete from steps where lesson_id in (select id from lessons where course_id = v_course_id);
  delete from lessons where course_id = v_course_id;

  insert into lessons (course_id, slug, title, order_index) values
    (v_course_id, 'operations',      'Operations',                 1),
    (v_course_id, 'working-capital', 'Working Capital & Liquidity',2),
    (v_course_id, 'risk',            'Risk',                       3),
    (v_course_id, 'investment',      'Investment',                 4),
    (v_course_id, 'systems',         'Systems & Clearing',         5);

  insert into steps (lesson_id, slug, title, order_index) values
    ((select id from lessons where course_id = v_course_id and slug = 'operations'),      'introduction',           'Introduction to Treasury Management',            1),
    ((select id from lessons where course_id = v_course_id and slug = 'working-capital'), 'working-capital',        'Working Capital & Liquidity Management',         1),
    ((select id from lessons where course_id = v_course_id and slug = 'working-capital'), 'inventory-management',   'Inventory Management, EOQ & Creditor Management',2),
    ((select id from lessons where course_id = v_course_id and slug = 'working-capital'), 'cash-management',        'Cash Management & Cash Flow Forecasting',        3),
    ((select id from lessons where course_id = v_course_id and slug = 'risk'),            'interest-rate-risk',     'Interest Rate Risk Management',                  1),
    ((select id from lessons where course_id = v_course_id and slug = 'risk'),            'fx-risk',                'Foreign Exchange Risk Management',               2),
    ((select id from lessons where course_id = v_course_id and slug = 'investment'),      'debt-management',        'Debt Management',                                1),
    ((select id from lessons where course_id = v_course_id and slug = 'investment'),      'investment-management',  'Investment Management',                          2),
    ((select id from lessons where course_id = v_course_id and slug = 'systems'),         'clearing-settlement',    'Clearing & Settlement Systems',                  1),
    ((select id from lessons where course_id = v_course_id and slug = 'systems'),         'treasury-systems',       'Treasury Management Systems',                    2);
end $$;

-- ── Corporate Finance BAC4301 (ZCAS) — 5 lessons, 10 steps ──────────────
-- Only 1.1 / 1.2 are built to v2 standard today; the rest are skeleton rows
-- (content = null) until they're rebuilt via step-skill.
do $$
declare v_course_id uuid;
begin
  select id into v_course_id from courses where slug = 'corporate-finance';

  delete from steps where lesson_id in (select id from lessons where course_id = v_course_id);
  delete from lessons where course_id = v_course_id;

  insert into lessons (course_id, slug, title, order_index) values
    (v_course_id, 'investment',      'Investment Appraisal',          1),
    (v_course_id, 'cost-of-capital', 'Cost of Capital & Structure',   2),
    (v_course_id, 'ma-valuation',    'Valuation & M&A',               3),
    (v_course_id, 'risk',            'Interest Rate & Currency Risk', 4),
    (v_course_id, 'dividends',       'Dividend Policy',               5);

  insert into steps (lesson_id, slug, title, order_index) values
    ((select id from lessons where course_id = v_course_id and slug = 'investment'),      'investment-fundamentals', 'Investment Fundamentals',              1),
    ((select id from lessons where course_id = v_course_id and slug = 'investment'),      'advanced-investment',     'Advanced Investment Appraisal',        2),
    ((select id from lessons where course_id = v_course_id and slug = 'investment'),      'international-projects',  'International Project Appraisal',      3),
    ((select id from lessons where course_id = v_course_id and slug = 'cost-of-capital'), 'cost-of-capital',         'Cost of Capital Foundations',          1),
    ((select id from lessons where course_id = v_course_id and slug = 'cost-of-capital'), 'capital-structure',       'Capital Structure Decisions',          2),
    ((select id from lessons where course_id = v_course_id and slug = 'ma-valuation'),    'company-valuation',       'Company Valuation',                    1),
    ((select id from lessons where course_id = v_course_id and slug = 'ma-valuation'),    'mergers-acquisitions',    'Mergers & Acquisitions',               2),
    ((select id from lessons where course_id = v_course_id and slug = 'risk'),            'interest-rate-risk',      'Interest Rate Risk Management',        1),
    ((select id from lessons where course_id = v_course_id and slug = 'risk'),            'currency-risk',           'Currency Risk Management',             2),
    ((select id from lessons where course_id = v_course_id and slug = 'dividends'),       'dividend-policy',         'Dividend Policy',                      1);
end $$;

-- ── BBA 1110 (UNZA) — 8 lessons, 9 steps ─────────────────────────────────
-- Only 1.1 is built; the rest are skeleton rows (content = null).
do $$
declare v_course_id uuid;
begin
  select id into v_course_id from courses where slug = 'bba-1110';

  delete from steps where lesson_id in (select id from lessons where course_id = v_course_id);
  delete from lessons where course_id = v_course_id;

  insert into lessons (course_id, slug, title, order_index) values
    (v_course_id, 'foundations',      'Foundations',                     1),
    (v_course_id, 'environment',      'The Business Environment',        2),
    (v_course_id, 'management',       'Management Functions',            3),
    (v_course_id, 'production',       'Production & Operations',         4),
    (v_course_id, 'marketing',        'Marketing',                       5),
    (v_course_id, 'finance',          'Finance',                         6),
    (v_course_id, 'human-resources',  'Human Resources',                 7),
    (v_course_id, 'change',           'Change Management',               8);

  insert into steps (lesson_id, slug, title, order_index) values
    ((select id from lessons where course_id = v_course_id and slug = 'foundations'),     'intro-to-business',      'Introduction to Business Administration', 1),
    ((select id from lessons where course_id = v_course_id and slug = 'foundations'),     'design-and-structure',   'Design & Structure of Organisations',     2),
    ((select id from lessons where course_id = v_course_id and slug = 'environment'),     'impact-of-environment',  'The Impact of the Environment',           1),
    ((select id from lessons where course_id = v_course_id and slug = 'management'),      'management-functions',  'Management Functions & Processes',        1),
    ((select id from lessons where course_id = v_course_id and slug = 'production'),      'production',             'Production',                              1),
    ((select id from lessons where course_id = v_course_id and slug = 'marketing'),       'marketing',              'Marketing',                               1),
    ((select id from lessons where course_id = v_course_id and slug = 'finance'),         'finance',                'Finance',                                 1),
    ((select id from lessons where course_id = v_course_id and slug = 'human-resources'), 'human-resources',        'Human Resources',                         1),
    ((select id from lessons where course_id = v_course_id and slug = 'change'),          'change-management',      'Change & the Management of Change',       1);
end $$;
