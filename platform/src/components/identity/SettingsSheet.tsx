"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, resolveAvatar, type AvatarId } from "./avatars";
import { AvatarPicker } from "./AvatarPicker";
import { CoursePicker, SchoolPicker, SETTINGS_EVENT } from "./pickers";
import { HugeIcon } from "@/components/icons/huge";
import { clearFreeStep, useSignedIn } from "@/lib/account";
import { browserClient } from "@/lib/supabase/browser";
import { coursesForSchool } from "@/lib/courses";
import { clearIdentity, saveIdentity, useIdentity } from "@/lib/identity";
import { useMotion } from "@/lib/motion";
import { clearProgress } from "@/lib/progress";
import { planLabel, usePlan } from "@/lib/plan";
import { OTHER_SCHOOL, schoolById, type SchoolChoice } from "@/lib/schools";

/* ------------------------------------------------------------------ *
 * Settings — what tapping the profile picture opens.
 *
 * Built to a measured spec of Claude's own settings dialog (owner, 2026-08-02,
 * read off its computed styles). Every number below is that spec, not a
 * judgement, so treat them as fixed unless a newer measurement replaces them:
 *
 *   dialog     12px radius, white, max-width 671px, 16px from the viewport,
 *              layered shadow (a 1px border-like ring plus two soft drops)
 *              rather than a border
 *   base       14px / 20px, sans, INK
 *   h2         22px / 28px, weight 580
 *   tabs       14px / 20px, weight 500, padding 0 12px. Active is INK, inactive
 *              is MUTED. No pill, no underline — colour is the whole signal.
 *   h3         15px / 20px, weight 580
 *   labels     14px / 20px, weight 400, 12px vertical padding
 *   inputs     14px / weight 400, radius 8px, background rgba(255,255,255,.5),
 *              padding 0 12px (single line) or 8px 12px (textarea)
 *   helpers    14px / weight 400, MUTED — the same grey as an inactive tab
 *   toggles    36×20, 2px padding, pill, track ACCENT when on
 *
 * Three colours do all of it: INK for anything primary, MUTED for anything
 * de-emphasised, ACCENT only for a toggle that is on.
 *
 * Two places the spec is honoured rather than followed to the letter:
 *   - The typeface is Anthropic Sans, which we don't have. The app's own sans
 *     (Inter, via --font-sans) sits in the same slot in the same fallback
 *     stack, so it takes the spec's place.
 *   - "No visible border stroke" on the inputs is literally true, but a
 *     half-transparent white field on a white panel is invisible, and the
 *     reference clearly draws an edge. It is a 1px inset ring instead — the
 *     same trick the spec describes for the dialog's own border.
 *
 * Nothing here has a Save button. Every change is written the moment it's made
 * (see save()), because all of it is one localStorage record — there is no
 * request to fail, nothing to roll back, and a Save button on a sheet with an
 * X in the corner is a trap for anyone who taps the X.
 *
 * THE NAME AND THE PICTURE ARE NOT SETTINGS (owner, 2026-08-02). They are
 * assigned on the first visit and neither can be changed — see lib/identity.
 * Profile reports them instead of offering them, because a reader who has
 * never been asked their name still deserves to be told what they are called
 * before they meet it in a greeting. The picker rows that used to be here (an
 * avatar grid and a name field) went with the first-visit form.
 * ------------------------------------------------------------------ */

/** The reference palette, kept local: these are that dialog's colours, not
 *  Booklesss tokens, and they should not leak into the rest of the app. */
const INK = "rgb(11,11,11)";
const MUTED = "rgb(137,135,129)";
/** Only ever a toggle that is on. Nothing in this app is boolean yet. */
const ACCENT = "rgb(42,120,214)";
/** Stands in for the spec's "no border" on fields the eye still needs to find. */
const RING = "inset 0 0 0 1px rgba(11,11,11,0.10)";

const TABS = ["general", "plan", "privacy"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABEL: Record<Tab, string> = {
  general: "General",
  plan: "Plan",
  privacy: "Privacy",
};

/** Which row of General is expanded. Only one at a time — this is a phone. */
type Open = "you" | "school" | "courses" | null;

export function SettingsSheet() {
  const { identity } = useIdentity();
  const plan = usePlan();
  /* Whether there is an account to sign out OF — see the Account section below.
     Null ("not heard yet") draws no row, like everywhere else: offering to sign
     out somebody whose session hasn't resolved is the same mistake as offering
     to sign in somebody who already has. */
  const signedIn = useSignedIn();
  const { pref: motion, hydrated: motionReady, setPref: setMotion } = useMotion();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("general");
  const [section, setSection] = useState<Open>(null);
  // No schoolQuery: the university list lost its search field (2026-08-04).
  const [courseQuery, setCourseQuery] = useState("");
  const [confirmWipe, setConfirmWipe] = useState(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const at = (e as CustomEvent<{ tab?: Tab; step?: Open }>).detail;
      setTab(at?.tab && TABS.includes(at.tab) ? at.tab : "general");
      /* The home page's Change button asks for courses by name — open that row
         rather than making them find it. */
      setSection(at?.step === "courses" ? "courses" : null);
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
  const save = (
    patch: Partial<{
      name: string;
      avatar: AvatarId;
      nameChosen: boolean;
      school: SchoolChoice | null;
      schoolName: string;
      courses: string[];
    }>,
  ) =>
    saveIdentity({
      name: patch.name ?? identity.name,
      avatar: patch.avatar ?? resolveAvatar(identity.avatar),
      ...(patch.nameChosen === undefined ? {} : { nameChosen: patch.nameChosen }),
      school: patch.school !== undefined ? patch.school : identity.school,
      schoolName: patch.schoolName ?? identity.schoolName ?? "",
      courses: patch.courses ?? identity.courses,
    });

  const pickSchool = (id: SchoolChoice) => {
    /* Courses belong to a school: keeping a ZCAS pick after a switch to UNZA
       would leave someone enrolled in a course their school doesn't teach. */
    const keep = new Set(coursesForSchool(id).map((c) => c.slug));
    save({ school: id, courses: identity.courses.filter((s) => keep.has(s)) });
    // The university list has no search to clear any more; the course one does,
    // and switching school changes which courses are on offer under it.
    setCourseQuery("");
  };

  /* Untick the last course and you are back to the whole library, which is
     where everybody starts — enrolledCourses() has always read an empty list
     that way. It used to be blocked here, because empty meant "never answered"
     and saving one reopened the first-visit form. Nothing is asked now, so
     empty is just the default, and a reader is allowed to return to it. */
  const toggleCourse = (slug: string) =>
    save({
      courses: identity.courses.includes(slug)
        ? identity.courses.filter((s) => s !== slug)
        : [...identity.courses, slug],
    });

  /* Signing out leaves the device exactly as it was — the face, the name, the
     courses and everything read stay in this browser. That is deliberate and it
     is not the same control as "Start over" below: this is "not me right now",
     that is "not me at all". Progress is namespaced per account
     (reader/ProgressScope), so what a signed-out reader sees afterwards is
     their own anonymous progress, not the account's. */
  const signOut = async () => {
    await browserClient()?.auth.signOut();
    /* Reload rather than re-render, for the same reason `forget` does: half the
       stores on this page were populated for somebody who is no longer here. */
    window.location.href = "/";
  };

  const forget = async () => {
    if (!confirmWipe) {
      setConfirmWipe(true);
      return;
    }
    /* SIGN OUT FIRST, and this ordering is load-bearing. Clearing the device
       while a session is live doesn't start anybody over: AccountSignal is
       still mounted, still holds that session, and the moment the freshly blank
       record hydrates it reads `students.identity` back off the account and
       adopts every answer we just erased. The wipe would appear to work and
       then quietly undo itself — and worse, would then be pushed back UP by
       syncProfile as though the student had re-answered.
       Awaited, not fired and forgotten: the reload below must not race it. */
    await browserClient()?.auth.signOut();
    clearProgress();
    clearIdentity();
    /* Somebody new gets a first step to claim again, too. */
    clearFreeStep();
    /* Reload rather than re-render: every store on the page is now holding
       something that no longer exists, and a fresh page is the honest way to
       start over as somebody new. */
    window.location.href = "/";
  };

  // "Other" to match the row they picked (2026-08-04) — a Settings value that
  // names the choice differently from the control is two names for one answer.
  const schoolValue = school === OTHER_SCHOOL ? identity.schoolName || "Other" : schoolById(school)?.name ?? "Not set";

  return (
    /* Tapping the dimmed area closes it, which is what everyone tries first;
       the X and Escape were the only ways out. `target === currentTarget` so a
       drag that starts inside the panel and releases over the backdrop, or a
       tap on any child, doesn't count as tapping outside.

       p-4 is the spec's 16px inset from the viewport. */
    <div
      className="fixed inset-0 z-[100] grid items-start justify-items-center overflow-y-auto bg-black/25 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* 12px radius, white, max-width 671, and a layered shadow standing in
          for a border: a 1px ring plus two soft drops. No `squircle` here —
          the reference draws a plain rounded rectangle. */}
      <div
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-[12px] bg-white"
        style={{
          maxWidth: 671,
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          lineHeight: "20px",
          color: INK,
          boxShadow:
            "0 0 0 1px rgba(11,11,11,0.06), 0 8px 24px -8px rgba(0,0,0,0.10), 0 24px 48px -12px rgba(0,0,0,0.16)",
        }}
      >
        {/* Title and tabs stay put; only the panel under them scrolls. */}
        <div className="shrink-0 px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <h2
              id="settings-title"
              style={{ fontSize: 22, fontWeight: 580, lineHeight: "28px", color: INK }}
            >
              Settings
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close settings"
              className="grid h-7 w-7 place-items-center rounded-[8px] bg-transparent transition-colors hover:bg-[rgba(11,11,11,0.05)]"
              style={{ color: INK }}
            >
              <HugeIcon name="x" size={18} strokeWidth={1.6} />
            </button>
          </div>

          {/* Tabs scroll sideways rather than wrapping: the reference carries a
              dozen of them on one line, and three that reflow onto two rows
              would move the panel under them every time one is added. */}
          <div role="tablist" className="no-scrollbar mt-3 flex overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className="shrink-0 bg-transparent transition-colors"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  padding: "0 12px",
                  color: tab === t ? INK : MUTED,
                }}
              >
                {TAB_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-1">
          {tab === "general" && (
            <>
              <Heading>Profile</Heading>

              {/* OFFERED, NOT JUST REPORTED. This row was read-only, on the
                  reasoning that both were assigned on the first visit and
                  neither was ever asked for — so its whole job was to be the
                  one place a reader could find out what they were called.

                  Onboarding asks for both now, which makes read-only actively
                  wrong: the name and face were a CHOICE, and the only way to
                  revise a choice was "forget this device", which throws away
                  every section you have marked to change a picture. It is also
                  the one repair for a record that ended up with a name nobody
                  typed — see the merge bug in lib/identity, which handed six
                  accounts the Astronaut they had just replaced. */}
              <Row
                label="Name and face"
                note="What your classmates see. Change either whenever you like."
                onClick={() => setSection(section === "you" ? null : "you")}
                expanded={section === "you"}
                control={
                  <span className="flex items-center gap-2">
                    <Avatar id={identity.avatar} size={28} />
                    <Value>{identity.name}</Value>
                  </span>
                }
              />
              {section === "you" && (
                <Panel>
                  <input
                    type="text"
                    autoComplete="name"
                    autoCapitalize="words"
                    value={identity.name}
                    /* Saved on every keystroke, like every other control in this
                       sheet — there is no Save button anywhere here and adding
                       one for a single field would be a second way to commit.
                       An empty box is not written: `name` is never empty by
                       contract (lib/identity treats a record without one as no
                       record at all), so a half-deleted name would erase the
                       reader mid-edit. */
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v.trim()) save({ name: v, nameChosen: true });
                    }}
                    aria-label="Your name"
                    maxLength={40}
                    className={
                      "squircle mb-3 h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink " +
                      "outline-none transition-colors placeholder:text-placeholder focus:border-ink"
                    }
                  />
                  <AvatarPicker
                    value={resolveAvatar(identity.avatar)}
                    onPick={(id) => save({ avatar: id, nameChosen: true })}
                  />
                </Panel>
              )}

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
                    onPick={pickSchool}
                    onName={(v) => save({ schoolName: v })}
                  />
                </Panel>
              )}

              <Row
                label="Courses"
                note="Pick some and your dashboard shows those and nothing else. Pick none and it shows everything."
                onClick={() => setSection(section === "courses" ? null : "courses")}
                expanded={section === "courses"}
                control={
                  <Value>
                    {identity.courses.length ? `${identity.courses.length} of ${offered.length}` : "All"}
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
              {/* "Given to this device, not asked for" was true of everybody
                  when this was written and is now true of only half of them —
                  a reader who never made an account. Onboarding asks for the
                  name and the face, and telling somebody we assigned the one
                  they typed reads as the app not knowing what it did. */}
              <Note>
                Your name and picture are yours if you chose them, and given to this device if you
                never did. They, your university, your courses and everything you’ve read are kept
                in this browser — and on your account, if you made one, which is what carries them
                to a second phone. Clearing your browser data clears this device’s copy.
              </Note>

              {/* THE ONLY WAY OUT OF AN ACCOUNT (2026-08-05). Clerk's user menu
                  carried a Sign out row and went with Clerk; without this there
                  is no sign-out anywhere in the app, and "Start over" — which
                  erases the record — would be the only thing resembling one.
                  Signed out, the row isn't drawn: an app that offers to sign
                  out somebody who never signed in is an app that doesn't know
                  who is holding it. */}
              {signedIn && (
                <>
                  <Heading>Account</Heading>
                  <Note>
                    Your courses, your progress and your notes stay on your account. Sign in again on
                    any phone to pick them up.
                  </Note>
                  <button
                    type="button"
                    onClick={signOut}
                    className="mt-3 w-full rounded-[8px] border-0 px-3 py-2.5 text-left transition-colors"
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: INK,
                      background: "rgba(255,255,255,0.5)",
                      boxShadow: RING,
                    }}
                  >
                    Sign out
                  </button>
                </>
              )}

              <Heading>Start over</Heading>
              <Note>
                Erases everything above and every section you’ve marked. You’ll come back as
                somebody else — a new name and picture are given out on the next visit.
                {confirmWipe ? " This can’t be undone." : ""}
              </Note>
              <button
                type="button"
                onClick={forget}
                className="mt-3 w-full rounded-[8px] border-0 px-3 py-2.5 text-left transition-colors"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: confirmWipe ? "var(--color-danger)" : INK,
                  background: "rgba(255,255,255,0.5)",
                  boxShadow: confirmWipe ? "inset 0 0 0 1px var(--color-danger)" : RING,
                }}
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

/** Section heading. 15px / 580 / 20px, per the spec. */
function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1 mt-5" style={{ fontSize: 15, fontWeight: 580, lineHeight: "20px", color: INK }}>
      {children}
    </h3>
  );
}

/** Helper text: the same grey as an inactive tab, which is the spec's one rule
 *  about secondary text — it is all the same grey, everywhere. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: MUTED }}>{children}</p>
  );
}

/** The right-hand side of a row when it only reports a value. */
function Value({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 14, fontWeight: 400, color: INK }}>{children}</span>;
}

/**
 * One setting: what it is on the left, the control on the right. 14px regular
 * label, 12px of padding above and below, per the spec.
 *
 * Rows that open onto a picker are buttons and carry a caret; rows holding
 * their own control are not, because a button wrapping an input eats the
 * input's taps.
 *
 * `stack` puts the control on its own line under the text. Side by side is
 * right for a short value ("ZCAS", "2 of 3"); it is wrong for a control wide
 * enough to squeeze the note into a column four words across, which is what a
 * two-option segmented does on a 390px phone. The reference has this exact
 * problem on its own Motion row, so it is not worth copying.
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
      <span className="block" style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: INK }}>
        {label}
      </span>
      {note && (
        <span className="mt-0.5 block" style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: MUTED }}>
          {note}
        </span>
      )}
    </span>
  );

  const right = (
    <span className="flex shrink-0 items-center gap-2">
      {control}
      {onClick && (
        <span className={"shrink-0 transition-transform " + (expanded ? "rotate-180" : "")} style={{ color: MUTED }}>
          <HugeIcon name="chevron-down" size={16} />
        </span>
      )}
    </span>
  );

  const body = stack ? (
    <span className="flex w-full flex-col gap-2.5">
      {text}
      <span className="flex justify-start">{right}</span>
    </span>
  ) : (
    <>
      {text}
      {right}
    </>
  );

  const className = "flex w-full items-center justify-between gap-4 py-3 text-left";

  return onClick ? (
    <button type="button" onClick={onClick} aria-expanded={expanded} className={className}>
      {body}
    </button>
  ) : (
    <div className={className}>{body}</div>
  );
}

/**
 * Two or three mutually exclusive choices, shown at once.
 *
 * The spec measures toggles (36×20, pill, ACCENT when on) but not this, because
 * the reference's only boolean rows are notifications — and this app has no
 * push, no email and no account to send either to, so it has no boolean row to
 * put a toggle on. Motion is a three-state idea collapsed to two (follow the
 * device, or hold still here), which is a segmented, not a switch. Built in the
 * same palette: INK for the choice made, MUTED for the one not.
 */
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
    <div
      role="radiogroup"
      aria-label={label}
      className="flex rounded-[8px] p-[2px]"
      style={{ background: "rgba(11,11,11,0.05)" }}
    >
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className="rounded-[6px] border-0 px-3 py-1.5 transition-colors"
            style={{
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
              color: on ? INK : MUTED,
              background: on ? "rgb(255,255,255)" : "transparent",
              boxShadow: on ? "0 1px 2px rgba(11,11,11,0.10)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * A boolean, to the spec's measurements: 36×20, 2px padding, pill, ACCENT track
 * when on. Nothing in the app is boolean yet — it is here so the first thing
 * that is (a notification, once there is an account to send one to) doesn't
 * get a switch invented for it on the day.
 */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="shrink-0 rounded-full border-0 transition-colors"
      style={{
        width: 36,
        height: 20,
        padding: 2,
        background: on ? ACCENT : "rgba(11,11,11,0.18)",
      }}
    >
      <span
        className="block rounded-full bg-white transition-transform"
        style={{ width: 16, height: 16, transform: on ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

/** The list a row opens onto, indented under it. */
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="pb-3">{children}</div>;
}
