/* What the home agent is told before anyone says a word to it.
 *
 * THIS IS THE OTHER AGENT SURFACE, and it is deliberately not lib/session.ts.
 * A session brief is a script: a named lesson group, its beats in order, the
 * line to pin at each. This one has no script at all — it is the box at the
 * bottom of the home screen, and a student taps it because something is on
 * their mind, not because they have chosen a topic to be walked through.
 *
 * CLIENT-SAFE, WHICH THE SESSION BRIEF IS NOT. lib/session.ts throws if it is
 * imported in a browser, because it reads the whole of course-data.json to get
 * the prose — putting that in the bundle is what splitting the data exists to
 * stop. This file reads only the NAV (titles, units, slugs), which every client
 * component in the reader already imports, so it costs nothing new and can be
 * built where the student's own record lives: their name, their courses and
 * where they left off are on the device, and shipping them to the server to
 * have a prompt written and shipped back would be a round trip for a string.
 *
 * WHAT IT DOES NOT SAY, and both are house rules rather than taste:
 *   · no course codes and no school names, ever (memory index);
 *   · no exam vocabulary — the paper, marks, revision, "what comes up"
 *     (step-skill C-12), and no narrating the app's own furniture (S-13).
 * The session prompt carries the same two prohibitions verbatim at the bottom.
 * They are repeated rather than shared because a prompt is read top to bottom
 * by a model that will follow the last thing it was told, and a NEVER block
 * imported from elsewhere is one refactor away from being dropped silently.
 */

import { COURSES } from "./courses";
import { labelFor } from "./course";

/** Everything the agent is allowed to know about who it is talking to. */
export type AskContext = {
  /** First name, if the student gave one. Never the assigned avatar's name. */
  name?: string;
  /** Slugs from the student's own record — what they said they are taking. */
  courses: string[];
  /** The step they last had open, as a plain title. */
  last?: string | null;
  /** Days studied this week, for a partner that can react to the week. */
  studyDays?: number;
};

/* The library, as a few lines the model can point at.
 *
 * Units only, never steps. Four courses' worth of step titles is about three
 * hundred lines, which buys a longer prompt on every single call for the
 * ability to name a step the student is not looking at. The unit is the level
 * a person actually talks in — "the working capital stuff", not "step 4.2". */
function shelf(slugs: string[]): string {
  const mine = new Set(slugs);
  const lines: string[] = [];

  for (const c of COURSES) {
    const units = c.displayUnitIds.map((id) => labelFor(id)).filter(Boolean);
    const mark = mine.has(c.slug) ? "  [they are taking this]" : "";
    lines.push("- " + c.title + mark + (units.length ? ": " + units.join("; ") : ""));
  }
  return lines.join("\n");
}

/** The system prompt, for both the voice call and the typed conversation. */
export function askPrompt(ctx: AskContext, mode: "voice" | "text"): string {
  const who: string[] = [];
  if (ctx.name) who.push("Their name is " + ctx.name + ". Use it once, early, and then stop.");
  if (ctx.last) who.push('The last thing they had open was "' + ctx.last + '".');
  if (ctx.studyDays !== undefined) {
    who.push(
      ctx.studyDays > 0
        ? "They have studied on " + ctx.studyDays + (ctx.studyDays === 1 ? " day" : " days") + " this week."
        : "They have not studied yet this week.",
    );
  }

  /* The two modalities differ in exactly one place — how long a turn is — and
   * nowhere else. A typed answer that reads like a transcript of speech is as
   * wrong as a spoken answer that reads out a bulleted list. */
  const voice = [
    "HOW TO TALK",
    "- This is a voice call. Short turns: two or three sentences, then stop and let them react.",
    "- Plain spoken English. Say numbers as words. Never read out punctuation, markdown, headings or list markers.",
    "- If they go quiet, ask a small question rather than filling the silence.",
    "- Never monologue. If something needs four sentences, give two and ask whether to keep going.",
  ];
  const text = [
    "HOW TO WRITE",
    "- This is a typed conversation. Answer in a short paragraph, or a few lines where a list genuinely helps.",
    "- No markdown headings, no bold, no tables. Plain sentences and, at most, short dashed lines.",
    "- Never longer than about six lines. If the answer is bigger than that, give the core of it and offer to go deeper.",
  ];

  return [
    "You are a study partner for a university student in Zambia, sitting on the home screen of their course app. " +
      "They have opened you to ask something. You are not running a lesson and you have no script.",
    "",
    ...(mode === "voice" ? voice : text),
    "",
    "WHO YOU ARE TALKING TO",
    ...(who.length ? who.map((l) => "- " + l) : ["- You know nothing about them yet. Ask, rather than assume."]),
    "",
    "WHAT THEY ARE STUDYING",
    "These are the courses this app carries, and the areas inside each. Answer from the subject itself — this list is " +
      "so you can tell where a question sits and suggest what to look at next, by name.",
    shelf(ctx.courses),
    "",
    "WHAT TO DO",
    "- Answer the question they actually asked. Teach the idea; do not summarise a topic at them.",
    "- Money is kwacha, and examples use companies a student here knows.",
    "- If a question is outside these subjects, answer it briefly and honestly, then come back.",
    "- If you do not know a figure, say so. Never invent one.",
    "- If they are lost, take the idea again more slowly with a different example rather than repeating yourself.",
    "",
    "WHAT TO PUT ON THEIR SCREEN",
    "- You have a tool called show_point. Calling it pins one line to their screen, where it stays.",
    "- This is NOT a transcript. Pin only what is worth writing down: a definition, a rule, a formula, a distinction people get wrong.",
    "- Pin as you land the idea, never at the end in a batch. Keep it under about twenty words and make it stand alone.",
    "- Most exchanges deserve no pin at all. One or two in a conversation is right.",
    "",
    "NEVER",
    '- Never mention exams, past papers, syllabuses, marks, revision or "what comes up". You teach the subject; the paper is not the reason.',
    "- Never describe this app, its buttons, its steps, its checkpoints or its notes. They are looking at the screen; you are not narrating it.",
    "- Never name a school, a university or a course code.",
  ].join("\n");
}

/** The line the agent opens a VOICE call with, before the student speaks. */
export function askFirstMessage(ctx: AskContext): string {
  return ctx.name ? "Hey " + ctx.name + " — what's on your mind?" : "Hey — what are we looking at?";
}

/* The placeholder in the box itself.
 *
 * It rotates per visit rather than sitting still, because the box's whole job
 * is to look like something you can talk to, and one fixed sentence reads as a
 * label. Chosen with the same rule the greetings use: never claim to know
 * something about them that this device has not been told. */
const OPENERS = [
  "Ask anything about your courses",
  "Stuck on something? Ask.",
  "What do you want to go over?",
  "Ask me to explain something",
];

export function askOpener(seed: number): string {
  return OPENERS[Math.abs(seed) % OPENERS.length];
}
