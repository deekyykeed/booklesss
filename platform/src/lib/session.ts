/* What the agent is given before it opens its mouth — SERVER ONLY.
 *
 * lib/session-nav.ts lists the sessions and is client-safe. This file is the
 * other half: it reads the prose out of course-data.json and turns one lesson
 * group into a BRIEF — the beats to walk, the line to pin at each, and the
 * system prompt wrapping both.
 *
 * The guard below is the same one lesson-content.ts carries and for the same
 * reason: importing this from a client component would put the whole course
 * back in the browser bundle, which is what splitting the data exists to stop.
 */
import type { Block, Lesson } from "./course";
import { labelFor, pathForId } from "./course";
import { lessonContent } from "./lesson-content";
import { plain } from "./emphasis";
import { sessionRef, type SessionRef } from "./session-nav";

if (typeof window !== "undefined") {
  throw new Error(
    "session.ts is server-only — build the brief on the server and pass it " +
      "down as a prop, the way the reader route passes a lesson.",
  );
}

/** What kind of thing a pinned line is, which is what draws its mark. */
export type PinKind = "key" | "warning" | "example" | "formula" | "point";

export type Beat = {
  stepId: string;
  stepTitle: string;
  stepPath: string;
  sectionId: string;
  heading: string;
  /** Plain prose for the agent to teach from — inline marks stripped. */
  teach: string;
  /** The one line worth leaving on screen when this beat is done. */
  pin: string;
  pinKind: PinKind;
};

export type SessionBrief = SessionRef & {
  courseTitle: string;
  beats: Beat[];
  /** The steps behind the call, for "read this properly". */
  steps: { id: string; title: string; path: string }[];
};

/* ------------------------------------------------------------------ *
 * Turning blocks into something speakable.
 * ------------------------------------------------------------------ */

/** A block as one line of plain prose, or "" for anything not worth saying. */
function speak(b: Block): string {
  switch (b.type) {
    case "p":
    case "h2":
    case "callout":
      return plain(b.text);
    case "ul":
      return b.items.map((i) => "- " + plain(i)).join("\n");
    case "formula":
      return plain(b.text) + (b.where?.length ? " (where " + b.where.map(plain).join("; ") + ")" : "");
    case "table": {
      /* A table read aloud is unbearable, but its SHAPE is teachable — the
       * agent is told what the working contains and told to walk it in words
       * rather than recite cells. */
      const cols = b.columns.map((c) => c.label).join(" | ");
      const rows = b.rows.slice(0, 6).map((r) => r.join(" | ")).join("\n");
      return "[a working, columns: " + cols + "]\n" + rows + (b.total ? "\n" + b.total.join(" | ") : "");
    }
    case "cards":
      return b.cards
        .map((c) => "- " + c.title + (c.lead ? " — " + c.lead : "") + ": " + plain(c.text))
        .join("\n");
    case "playground":
      return "";
  }
}

/* The line that stays on screen when a beat ends.
 *
 * PREFERENCE ORDER, and the fallback is the point of it. Only a minority of
 * sections carry an authored callout — Treasury has 16 across 60 sections,
 * economics has one across 69 — so a pin that could only come from a callout
 * would leave most beats with nothing on screen, which is the entire feature.
 *
 *   1. a callout — authored precisely to be the sentence that survives;
 *   2. a formula — the thing a finance student is here to be able to write;
 *   3. the first real sentence of the section, which always exists.
 *
 * The agent may also pin its own line mid-call via the show_point tool; this
 * is the floor, not the ceiling. */
function pinFor(blocks: Block[]): { pin: string; kind: PinKind } {
  const callout = blocks.find((b) => b.type === "callout");
  if (callout && callout.type === "callout") {
    /* `exam` is a withdrawn callout kind (RULES.md E-10) that four callouts in
     * Corporate Finance and Strategic Management still carry, so it is folded
     * into `key` rather than drawn. It could not be shown as itself in any
     * case: the agent is forbidden the exam vocabulary entirely (C-12), and a
     * card labelled "In the exam" above a voice that never says the word would
     * be the contradiction that rule exists to prevent. */
    const raw = callout.kind ?? "key";
    return { pin: plain(callout.text), kind: raw === "exam" ? "key" : raw };
  }
  const formula = blocks.find((b) => b.type === "formula");
  if (formula && formula.type === "formula") return { pin: plain(formula.text), kind: "formula" };

  const para = blocks.find((b) => b.type === "p");
  if (para && para.type === "p") {
    const text = plain(para.text);
    /* First sentence only. A pinned card is a card, not a paragraph — and the
     * opening sentence of a rule-governed step is written to carry the claim. */
    const cut = text.match(/^.*?[.?!](?=\s|$)/)?.[0] ?? text;
    return { pin: cut.length > 180 ? cut.slice(0, 177).trimEnd() + "…" : cut, kind: "point" };
  }
  return { pin: "", kind: "point" };
}

function beatsFor(stepId: string, lesson: Lesson): Beat[] {
  const stepPath = pathForId(stepId);
  return lesson.sections.map((s) => {
    const { pin, kind } = pinFor(s.blocks);
    return {
      stepId,
      stepTitle: lesson.title,
      stepPath,
      sectionId: s.id,
      heading: s.heading,
      teach: s.blocks.map(speak).filter(Boolean).join("\n\n"),
      pin,
      pinKind: kind,
    };
  });
}

/** The full brief for one session, or null when the id isn't a session. */
export function sessionBrief(id: string): SessionBrief | null {
  const ref = sessionRef(id);
  if (!ref) return null;

  const beats: Beat[] = [];
  const steps: SessionBrief["steps"] = [];
  for (const stepId of ref.stepIds) {
    const lesson = lessonContent(stepId);
    if (!lesson) continue;
    steps.push({ id: stepId, title: lesson.title, path: pathForId(stepId) });
    beats.push(...beatsFor(stepId, lesson));
  }

  /* The course's own label, walked up from the session's path root. It is the
   * subject the agent is teaching, and the agent is never told the school or
   * the course code — see the standing rule; a student hears neither. */
  const rootId = ref.path.replace(/^\/study\//, "").split("/")[0];
  return { ...ref, courseTitle: labelFor(rootId), beats, steps };
}

/* ------------------------------------------------------------------ *
 * The system prompt.
 * ------------------------------------------------------------------ */

/* Sent as a client override at startSession, which means ONE agent serves
 * every session in every course: adding a session is authoring content, never
 * touching the ElevenLabs dashboard. scripts/setup-elevenlabs.mjs turns the
 * override permission on when it creates the agent.
 *
 * KNOWN TRADE-OFF, accepted: an override travels through the browser, so a
 * determined student could edit the brief before it is sent and make the tutor
 * talk about something else. The agent holds no tools that touch data and no
 * secrets — the worst outcome is a student wasting their own call — and the
 * alternative (an agent per session) is 48 dashboard objects that go stale the
 * moment a step is rewritten.
 *
 * The two standing content rules apply to speech exactly as they do to a page:
 * C-12, no exam vocabulary, and S-13, no Booklesss mechanics. A voice saying
 * "this comes up in the exam" breaks the first; one saying "tap the checkpoint
 * below" breaks the second and describes a screen the student isn't looking at.
 */
export function agentPrompt(brief: SessionBrief): string {
  const beats = brief.beats
    .map((b, i) => {
      const head = "### Beat " + (i + 1) + " — " + b.heading;
      const pin = b.pin ? "\nPIN WHEN DONE: " + b.pin : "";
      return head + "\n" + b.teach + pin;
    })
    .join("\n\n");

  return [
    'You are a study partner talking a student through "' +
      brief.title +
      '", part of ' +
      brief.courseTitle +
      ". This is a voice call, not a lecture and not a reading.",
    "",
    "HOW TO TALK",
    "- Short turns. Two or three sentences, then stop and let them react. Never monologue.",
    "- Plain spoken English. Say numbers as words. Never read out punctuation, markdown, headings or list markers.",
    "- You are Zambian-context aware: money is kwacha, and examples use companies a student here knows.",
    "- If they go quiet, ask a small question rather than filling the silence.",
    "- If they ask something off-topic, answer briefly and steer back.",
    "- If they say they are lost, stop and take the last idea again more slowly with a different example.",
    "",
    "WHAT TO PUT ON THEIR SCREEN",
    "- You have a tool called show_point. Calling it pins a line to the student's screen, where it stays for the rest of the call.",
    "- This is NOT a transcript. Pin only what is worth writing down: a definition, a rule, a formula, a distinction people get wrong.",
    "- Pin as you land the idea — not before you have explained it, and not at the end in a batch.",
    '- Each beat below carries a "PIN WHEN DONE" line. Use that wording when you reach it. Pin your own line instead if the conversation produced a better one.',
    "- Roughly one pin per beat. Two if a beat genuinely holds two rules. Never more.",
    "- Keep every pin under about twenty words and make it stand alone. They will read it back with the call over.",
    "",
    "THE MATERIAL, IN ORDER",
    "Walk these beats in order. Each is one idea. Check they have it before moving on.",
    "",
    beats,
    "",
    "WHEN THE MATERIAL IS DONE",
    "Ask them to say the main idea back in their own words. Correct it warmly if it is off. Then tell them the call is done and they can look over what is on their screen.",
    "",
    "NEVER",
    '- Never mention exams, past papers, syllabuses, marks, revision or "what comes up". You teach the subject; the paper is not the reason.',
    "- Never describe this app, its buttons, its steps, its checkpoints or its notes. The student is looking at the screen; you are not narrating it.",
    "- Never name a school, a university or a course code.",
    "- Never claim a figure you were not given above. If you do not know it, say so.",
  ].join("\n");
}

/** The agent's opening line — spoken before the student says anything. */
export function firstMessage(brief: SessionBrief): string {
  const n = brief.beats.length;
  return (
    "Alright — " +
    brief.title +
    ". We have about " +
    brief.minutes +
    " minutes and " +
    n +
    (n === 1 ? " idea" : " ideas") +
    " to get through. Ready when you are."
  );
}
