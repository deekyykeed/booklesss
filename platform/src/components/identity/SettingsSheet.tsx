"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, resolveAvatar, type AvatarId } from "./avatars";
import { AvatarGrid, CoursePicker, SchoolPicker, SETTINGS_EVENT } from "./pickers";
import { MynaIcon } from "@/components/icons/myna";
import { coursesForSchool } from "@/lib/courses";
import { clearIdentity, saveIdentity, useIdentity } from "@/lib/identity";
import { clearProgress } from "@/lib/progress";
import { planLabel, usePlan } from "@/lib/plan";
import { OTHER_SCHOOL, schoolById, type SchoolChoice } from "@/lib/schools";

/* ------------------------------------------------------------------ *
 * Settings — what tapping the profile picture opens.
 *
 * The first visit asks its questions as a wizard, one screen at a time, and
 * that is the right shape for a form somebody is filling in once. Coming back
 * to change one answer is the opposite job: you know which thing you want, and
 * everything else should stay out of the way. So this is a settings sheet —
 * tabs across the top, one row per answer, each row opening onto the same
 * picker the wizard used.
 *
 * Nothing here has a Save button. Every change is written the moment it's made
 * (see save()), because all of it is one localStorage record — there is no
 * request to fail, nothing to roll back, and a Save button on a sheet with an
 * X in the corner is a trap for anyone who taps the X.
 *
 * The name field is the one exception: it commits on blur rather than on every
 * keystroke, because an empty name is how the app decides nobody has
 * introduced themselves — saving mid-backspace would reopen the wizard over
 * the top of this sheet.
 * ------------------------------------------------------------------ */

const TABS = ["general", "plan", "privacy"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABEL: Record<Tab, string> = {
  general: "General",
  plan: "Plan",
  privacy: "Privacy",
};

/** Which row of General is expanded. Only one at a time — this is a phone. */
type Open = "avatar" | "school" | "courses" | null;

export function SettingsSheet() {
  const { identity } = useIdentity();
  const plan = usePlan();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("general");
  const [section, setSection] = useState<Open>(null);
  /* Only the name is held here, and only while it's being typed. */
  const [draftName, setDraftName] = useState<string | null>(null);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
  const [confirmWipe, setConfirmWipe] = useState(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const at = (e as CustomEvent<{ tab?: Tab; step?: Open }>).detail;
      setTab(at?.tab && TABS.includes(at.tab) ? at.tab : "general");
      /* The home page's Change button asks for courses by name — open that row
         rather than making them find it. */
      setSection(at?.step === "courses" ? "courses" : null);
      setDraftName(null);
      setConfirmWipe(false);
      setOpen(true);
    };
    window.addEventListener(SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(SETTINGS_EVENT, onOpen);
  }, []);

  /* A sheet over the page shouldn't leave the page scrolling behind it. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Escape closes it, the way every other dialog on a keyboard does. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const school = identity?.school ?? null;
  const offered = useMemo(() => coursesForSchool(school), [school]);

  if (!open || !identity) return null;

  /* One writer for the whole sheet: take what's stored, lay the change over
     it, save. Every control below is a one-line call to this. */
  const save = (patch: Partial<{ name: string; avatar: AvatarId; school: SchoolChoice | null; schoolName: string; courses: string[] }>) =>
    saveIdentity({
      name: patch.name ?? identity.name,
      avatar: patch.avatar ?? resolveAvatar(identity.avatar),
      school: patch.school !== undefined ? patch.school : identity.school,
      schoolName: patch.schoolName ?? identity.schoolName ?? "",
      courses: patch.courses ?? identity.courses,
    });

  const pickSchool = (id: SchoolChoice) => {
    /* Courses belong to a school: keeping a ZCAS pick after a switch to UNZA
       would leave someone enrolled in a course their school doesn't teach. */
    const keep = new Set(coursesForSchool(id).map((c) => c.slug));
    save({ school: id, courses: identity.courses.filter((s) => keep.has(s)) });
    setSchoolQuery("");
    setCourseQuery("");
  };

  const toggleCourse = (slug: string) => {
    const next = identity.courses.includes(slug)
      ? identity.courses.filter((s) => s !== slug)
      : [...identity.courses, slug];
    /* The last course can't be given up here. An empty list is how the app
       reads "never asked", so saving one would reopen the wizard. */
    if (next.length) save({ courses: next });
  };

  const commitName = () => {
    const v = (draftName ?? "").trim();
    if (v && v !== identity.name) save({ name: v });
    setDraftName(null);
  };

  const forget = () => {
    if (!confirmWipe) {
      setConfirmWipe(true);
      return;
    }
    clearProgress();
    clearIdentity();
    /* Reload rather than re-render: every store on the page is now holding
       something that no longer exists, and a fresh page is the honest way to
       land back on the first-visit form. */
    window.location.href = "/";
  };

  const schoolValue = school === OTHER_SCHOOL ? identity.schoolName || "Another university" : schoolById(school)?.name ?? "Not set";

  return (
    <div
      className="fixed inset-0 z-[100] grid items-start justify-items-center overflow-y-auto bg-black/25 p-4 backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="squircle flex max-h-[92dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-3xl border border-[#e7e7e6] bg-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_24px_48px_-12px_rgba(0,0,0,0.18)]">
        {/* Title and tabs stay put; only the panel under them scrolls. */}
        <div className="shrink-0 px-5 pt-5">
          <div className="flex items-center justify-between gap-3">
            <h2 id="settings-title" className="font-display text-[20px] font-medium tracking-[-0.02em] text-ink">
              Settings
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close settings"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-[#f4f4f3] hover:text-ink"
            >
              <MynaIcon name="x" size={18} />
            </button>
          </div>

          <div className="mt-3 flex gap-1 border-b border-[#ececeb] pb-3">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                className={
                  "squircle rounded-xl px-3 py-1.5 text-[14px] font-medium transition-colors " +
                  (tab === t ? "bg-active text-ink" : "text-muted hover:text-ink")
                }
              >
                {TAB_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          {tab === "general" && (
            <>
              <Heading>Profile</Heading>

              <Row
                label="Picture"
                onClick={() => setSection(section === "avatar" ? null : "avatar")}
                expanded={section === "avatar"}
                value={<Avatar id={identity.avatar} size={28} />}
              />
              {section === "avatar" && (
                <Panel>
                  <AvatarGrid value={resolveAvatar(identity.avatar)} onChange={(id) => save({ avatar: id })} />
                </Panel>
              )}

              {/* The one control that isn't a row opening a list — a name is
                  typed, so the field is the row. */}
              <div className="flex items-center justify-between gap-4 border-b border-[#ececeb] py-3">
                <span className="shrink-0 text-[14px] text-ink-2">Your name</span>
                <input
                  value={draftName ?? identity.name}
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={commitName}
                  onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                  maxLength={40}
                  aria-label="Your name"
                  className="squircle h-10 w-[58%] rounded-xl border border-[#e7e7e6] bg-white px-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                />
              </div>

              <Heading>Study</Heading>

              <Row
                label="University"
                onClick={() => setSection(section === "school" ? null : "school")}
                expanded={section === "school"}
                value={<span className="text-[15px] text-ink">{schoolValue}</span>}
              />
              {section === "school" && (
                <Panel>
                  <SchoolPicker
                    school={school}
                    schoolName={identity.schoolName ?? ""}
                    query={schoolQuery}
                    onQuery={setSchoolQuery}
                    onPick={pickSchool}
                    onName={(v) => save({ schoolName: v })}
                  />
                </Panel>
              )}

              <Row
                label="Courses"
                onClick={() => setSection(section === "courses" ? null : "courses")}
                expanded={section === "courses"}
                value={
                  <span className="text-[15px] text-ink">
                    {identity.courses.length} of {offered.length}
                  </span>
                }
              />
              {section === "courses" && (
                <Panel>
                  <CoursePicker
                    offered={offered}
                    courses={identity.courses}
                    query={courseQuery}
                    onQuery={setCourseQuery}
                    onToggle={toggleCourse}
                    note={
                      school === OTHER_SCHOOL
                        ? `We’re not at ${identity.schoolName || "your university"} yet — here’s everything we have.`
                        : undefined
                    }
                  />
                  <p className="mt-2 text-[13px] leading-5 text-muted">
                    Your dashboard shows these and nothing else. One has to stay.
                  </p>
                </Panel>
              )}
            </>
          )}

          {tab === "plan" && (
            <>
              <Heading>Plan</Heading>
              <Row label="Current plan" value={<span className="text-[15px] text-ink">{plan?.name ?? "None"}</span>} />
              <Row
                label={plan ? "Time left" : "Ends"}
                value={<span className="text-[15px] text-ink">{plan ? planLabel(plan).split(" — ")[1] : "—"}</span>}
              />
              <p className="mt-3 text-[13px] leading-5 text-muted">
                {plan
                  ? "The ring around your picture fills as the month runs down, and turns red in the last three days."
                  : "Nothing is counting yet. When a plan is on this device, the ring around your picture fills as its month runs down."}
              </p>
            </>
          )}

          {tab === "privacy" && (
            <>
              <Heading>What this device knows</Heading>
              <p className="text-[13.5px] leading-6 text-muted">
                Your name, picture, university, courses and everything you’ve read are kept in this
                browser and nowhere else. There is no account, no email address and no password —
                which also means clearing your browser data clears all of it, and another device
                starts from nothing.
              </p>

              <Heading>Start over</Heading>
              <button
                type="button"
                onClick={forget}
                className={
                  "squircle w-full rounded-xl border px-3.5 py-3 text-left text-[15px] font-medium transition-colors " +
                  (confirmWipe
                    ? "border-danger bg-white text-danger"
                    : "border-[#e7e7e6] bg-white text-ink hover:bg-[#fafafa]")
                }
              >
                {confirmWipe ? "Tap again to erase everything" : "Forget this device"}
              </button>
              <p className="mt-2 text-[13px] leading-5 text-muted">
                Erases your details and every section you’ve marked, then starts the app fresh.
                {confirmWipe ? " This can’t be undone." : ""}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** A section title inside a tab. */
function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-1 mt-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-card-dim">{children}</h3>;
}

/** One setting: what it is on the left, what it says on the right. Rows that
 *  open onto a picker are buttons and carry a caret; rows that only report
 *  something are not. */
function Row({
  label,
  value,
  onClick,
  expanded,
}: {
  label: string;
  value: React.ReactNode;
  onClick?: () => void;
  expanded?: boolean;
}) {
  const body = (
    <>
      <span className="shrink-0 text-[14px] text-ink-2">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{value}</span>
        {onClick && (
          <span className={"shrink-0 text-muted transition-transform " + (expanded ? "rotate-180" : "")}>
            <MynaIcon name="chevron-down" size={16} />
          </span>
        )}
      </span>
    </>
  );

  const className = "flex w-full items-center justify-between gap-4 border-b border-[#ececeb] py-3.5 text-left";

  return onClick ? (
    <button type="button" onClick={onClick} aria-expanded={expanded} className={className + " transition-colors hover:text-ink"}>
      {body}
    </button>
  ) : (
    <div className={className}>{body}</div>
  );
}

/** The list a row opens onto, indented under it. */
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-[#ececeb] py-3">{children}</div>;
}
