import { agentPrompt, firstMessage, sessionBrief } from "@/lib/session";
import { allSessions } from "@/lib/session-nav";

/* ------------------------------------------------------------------ *
 * One session's brief, fetched on demand.
 *
 * ⚠️ THIS EXISTS BECAUSE THE VOICE SCREEN RUNS THE SESSION IN PLACE. The
 * /study pages get their brief as props, because each of those routes IS one
 * session and the server knows which before it renders. /session/<course> does
 * not: the student picks one after the page has loaded — that choice is the
 * whole point of the box at the top — so the brief has to be fetchable at the
 * moment they choose.
 *
 * WHY NOT SHIP THEM ALL AS PROPS. Treasury alone has 21 sessions and every
 * brief carries the prose of each section it covers. Serialising all of them
 * would put a course's entire text into the HTML of a screen that is mostly
 * blank on purpose, on Zambian mobile data, to be ready for the one session
 * the student actually picks.
 *
 * WHY NOT MAKE lib/session CLIENT-SAFE. It reads course-data.json, which is
 * 1.1MB for four courses and is the whole reading. That module throws on
 * import from the browser (see its guard) precisely so this cannot happen by
 * accident; this route is the sanctioned door through it, the same shape as
 * lib/lesson-content.
 *
 * ⚠️ THE ID IS A PATH SEGMENT, NOT A QUERY PARAM, AND THAT IS NOT COSMETIC.
 * This was `/api/session/brief?id=…` with `dynamic = "force-static"` and it
 * could never work: a force-static route is rendered once with no request, so
 * `new URL(req.url).searchParams` is empty for every caller and EVERY request
 * answered `{ok:false, reason:"no-id"}` — including one with a perfectly good
 * id on it. It built clean and typechecked clean, and only serving it showed
 * the fault. A segment is part of the route, so it survives prerendering.
 *
 * PUBLIC AND CACHEABLE, DELIBERATELY. A brief is course content, and course
 * content is already public — it is what the reader renders and what the
 * prerendered /study pages embed in their own HTML. There is nothing here a
 * student could not get by opening the step. So no auth, and prerendered per
 * id: the ids come off the same nav tree that generates the /study routes, and
 * what sits behind them cannot change without a redeploy.
 * ------------------------------------------------------------------ */

export const dynamicParams = false;

export function generateStaticParams() {
  return allSessions().map((s) => ({ id: s.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const brief = sessionBrief(id);
  /* A missing brief is a product state, not an error — a session id can go
     stale when a course is restructured, and the screen answers that by
     offering the reading instead. 200 with a reason, like every route here. */
  if (!brief || !brief.beats.length) {
    return Response.json({ ok: false, reason: "unknown" }, { status: 200 });
  }

  return Response.json(
    {
      ok: true,
      id: brief.id,
      title: brief.title,
      kicker: brief.kicker ?? null,
      minutes: brief.minutes,
      beats: brief.beats.length,
      /* The two strings the agent is actually driven by. Built here so one
         agent can serve every session as a per-call client override — adding a
         session stays a matter of authoring content, and a rewritten step
         changes what the agent teaches on the next call with nothing to update
         in anyone's dashboard. */
      prompt: agentPrompt(brief),
      firstMessage: firstMessage(brief),
      steps: brief.steps,
    },
    { status: 200 },
  );
}
