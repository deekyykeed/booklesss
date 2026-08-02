"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, resolveAvatar, type AvatarId } from "./avatars";
import { AvatarGrid, CoursePicker, SchoolPicker, SETTINGS_EVENT } from "./pickers";
import { MynaIcon } from "@/components/icons/myna";
import { coursesForSchool } from "@/lib/courses";
import { clearIdentity, saveIdentity, useIdentity } from "@/lib/identity";
import { useMotion } from "@/lib/motion";
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
 * Laid out against Claude's own settings dialog (owner's reference, 2026-08-02),
 * which is worth naming because three of its choices are what changed here:
 *
 *   1. Section headings are BIG and sentence case ("Profile", "Reading"), not
 *      tiny uppercase eyebrows. An eyebrow is a label on a form; a heading is a
 *      place in a document, and a settings panel is read by scanning for the
 *      place, not by reading the labels.
 *   2. A row is a title with a grey sentence under it, not a bare label. The
 *      sentence is where a setting says what it costs you, which is the only
 *      thing that makes it answerable.
 *   3. The header is a band in its own colour with the tabs inside it, so the
 *      thing that stays put while you scroll looks like it stays put.
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
 *
 * What is deliberately NOT here, because the reference has it and this app has
 * nothing to put behind it: Appearance (there is no dark theme — one would be
 * a real piece of work, not a switch), Voice, and Notifications (no push, no
 * email, no account to send either to). A settings panel of switches that do
 * nothing is worse than a short one.
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
  const { pref: motion, hydrated: motionReady, setPref: setMotion } = useMotion();

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
    /* Tapping the dimmed area closes it, which is what everyone tries first;
       the X and Escape were the only ways out. `target === currentTarget` so a
       drag that starts inside the panel and releases over the backdrop, or a
       tap on any child, doesn't count as tapping outside. */
    <div
      className="fixed inset-0 z-[100] grid items-start justify-items-center overflow-y-auto bg-black/25 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="squircle flex max-h-[92dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-[24px] border border-[#e7e7e6] bg-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_24px_48px_-12px_rgba(0,0,0,0.18)]">
        {/* The header is its own band, a shade warmer than the panel, with the
            tabs inside it and one rule along the bottom. Only the panel under
            it scrolls, and the colour change is what makes that legible: a
            white bar over a white sheet reads as page, not as chrome. */}
        <div className="shrink-0 border-b border-[#ececeb] bg-[#fbfbfa] px-5 pb-3.5 pt-5">
          <div className="flex items-center justify-between gap-3">
            <h2 id="settings-title" className="font-display text-[24px] font-medium tracking-[-0.02em] text-ink">
              Settings
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close settings"
              className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-[#efefed]"
            >
              <MynaIcon name="x" size={20} strokeWidth={1.6} />
            </button>
          </div>

          <div className="mt-3.5 flex gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                className={
                  "squircle rounded-xl px-3.5 py-1.5 text-[15px] transition-colors " +
                  (tab === t ? "bg-[#eeeeec] font-semibold text-ink" : "text-muted hover:text-ink")
                }
              >
                {TAB_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          {tab === "general" && (
            <>
              <Heading>Profile</Heading>

              <Row
                label="Picture"
                onClick={() => setSection(section === "avatar" ? null : "avatar")}
                expanded={section === "avatar"}
                control={<Avatar id={identity.avatar} size={34} />}
              />
              {section === "avatar" && (
                <Panel>
                  <AvatarGrid value={resolveAvatar(identity.avatar)} onChange={(id) => save({ avatar: id })} />
                </Panel>
              )}

              {/* The one control that isn't a row opening a list — a name is
                  typed, so the field is the row. */}
              <Row
                label="Your name"
                control={
                  <input
                    value={draftName ?? identity.name}
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={commitName}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    maxLength={40}
                    aria-label="Your name"
                    className="squircle h-11 w-[170px] rounded-xl border border-[#e0e0dd] bg-white px-3.5 text-[16px] text-ink outline-none transition-colors focus:border-ink"
                  />
                }
              />

              <Heading>Study</Heading>

              <Row
                label="University"
                note="Decides which courses you get to choose from."
                onClick={() => setSection(section === "school" ? null : "school")}
                expanded={section === "school"}
                control={<Value>{schoolValue}</Value>}
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
                note="Your dashboard shows these and nothing else. One has to stay."
                onClick={() => setSection(section === "courses" ? null : "courses")}
                expanded={section === "courses"}
                control={
                  <Value>
                    {identity.courses.length} of {offered.length}
                  </Value>
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
                </Panel>
              )}

              <Heading>Reading</Heading>

              <Row
                label="Motion"
                note="The colours behind the page drift constantly. Reduced holds them still."
                stack
                control={
                  <Segmented
                    value={motionReady ? motion : "system"}
                    onChange={setMotion}
                    options={[
                      { id: "system", label: "System" },
                      { id: "reduced", label: "Reduced" },
                    ]}
                    label="Motion"
                  />
                }
              />
            </>
          )}

          {tab === "plan" && (
            <>
              <Heading>Plan</Heading>
              <Row label="Current plan" control={<Value>{plan?.name ?? "None"}</Value>} />
              <Row
                label={plan ? "Time left" : "Ends"}
                note={
                  plan
                    ? "The ring around your picture fills as the month runs down, and turns red in the last three days."
                    : "Nothing is counting yet. When a plan is on this device, the ring around your picture fills as its month runs down."
                }
                control={<Value>{plan ? planLabel(plan).split(" — ")[1] : "—"}</Value>}
              />
            </>
          )}

          {tab === "privacy" && (
            <>
              <Heading>What this device knows</Heading>
              <p className="text-[15px] leading-[26px] text-muted">
                Your name, picture, university, courses and everything you’ve read are kept in this
                browser and nowhere else. There is no account, no email address and no password —
                which also means clearing your browser data clears all of it, and another device
                starts from nothing.
              </p>

              <Heading>Start over</Heading>
              <p className="mb-3 text-[15px] leading-[26px] text-muted">
                Erases your details and every section you’ve marked, then starts the app fresh.
                {confirmWipe ? " This can’t be undone." : ""}
              </p>
              <button
                type="button"
                onClick={forget}
                className={
                  "squircle w-full rounded-xl border px-3.5 py-3 text-left text-[15px] font-medium transition-colors " +
                  (confirmWipe
                    ? "border-danger bg-white text-danger"
                    : "border-[#e0e0dd] bg-white text-ink hover:bg-[#fafafa]")
                }
              >
                {confirmWipe ? "Tap again to erase everything" : "Forget this device"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** A place in the panel. Big and sentence case: this is what someone scans for
 *  when they open settings knowing roughly what they came to change. */
function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-1 mt-7 text-[19px] font-semibold tracking-[-0.01em] text-ink">{children}</h3>;
}

/** The right-hand side of a row when it only reports a value. */
function Value({ children }: { children: React.ReactNode }) {
  return <span className="text-[16px] text-ink">{children}</span>;
}

/**
 * One setting: what it is on the left, the control on the right.
 *
 * `note` is the grey sentence under the title, and it is the point of this
 * shape — "Motion" alone is a word, "the colours behind the page drift
 * constantly" is a thing you can have an opinion about. Rows that open onto a
 * picker are buttons and carry a caret; rows holding their own control are not,
 * because a button wrapping an input eats the input's taps.
 *
 * `stack` puts the control on its own line under the text. Side by side is
 * right for a short value ("ZCAS", "2 of 3"); it is wrong for a control wide
 * enough to squeeze the note into a column four words across, which is what a
 * two-option segmented does on a 390px phone. The reference dialog has this
 * exact problem on its own Motion row, so it is not a rule worth copying.
 */
function Row({
  label,
  note,
  control,
  onClick,
  expanded,
  stack,
}: {
  label: string;
  note?: string;
  control: React.ReactNode;
  onClick?: () => void;
  expanded?: boolean;
  stack?: boolean;
}) {
  const text = (
    <span className="min-w-0 flex-1">
      <span className="block text-[16px] text-ink">{label}</span>
      {note && <span className="mt-0.5 block text-[14px] leading-[22px] text-muted">{note}</span>}
    </span>
  );

  const right = (
    <span className="flex shrink-0 items-center gap-2">
      {control}
      {onClick && (
        <span className={"shrink-0 text-muted transition-transform " + (expanded ? "rotate-180" : "")}>
          <MynaIcon name="chevron-down" size={16} />
        </span>
      )}
    </span>
  );

  const body = stack ? (
    <span className="flex w-full flex-col gap-3">
      {text}
      <span className="flex justify-start">{right}</span>
    </span>
  ) : (
    <>
      {text}
      {right}
    </>
  );

  const className = "flex w-full items-center justify-between gap-4 border-b border-[#ececeb] py-4 text-left";

  return onClick ? (
    <button type="button" onClick={onClick} aria-expanded={expanded} className={className}>
      {body}
    </button>
  ) : (
    <div className={className}>{body}</div>
  );
}

/** Two or three mutually exclusive choices, shown at once. A white pill rides
 *  over a grey track, so the chosen one reads as raised rather than tinted. */
function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="squircle flex rounded-xl bg-[#f0f0ee] p-[3px]">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={
              "squircle rounded-[9px] px-3 py-1.5 text-[15px] transition-colors " +
              (on ? "bg-white font-medium text-ink shadow-chip" : "text-muted hover:text-ink")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** The list a row opens onto, indented under it. */
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-[#ececeb] py-3">{children}</div>;
}
