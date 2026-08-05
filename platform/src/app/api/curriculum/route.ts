import { authEnabled } from "@/lib/auth";
import { currentUserId } from "@/lib/supabase/server";
import { admin } from "@/lib/supabase-admin";

/* ------------------------------------------------------------------ *
 * What to offer a student whose university publishes nothing.
 *
 * Two questions, one route:
 *
 *   ?university=cbu&programme=bachelor of accountancy&year=2
 *       — what students who already said they are on this programme listed.
 *         The first one types eight courses into an empty box; the second is
 *         offered those eight back and corrects them; by the fifth the list is
 *         better than anything on the university's website. This is the whole
 *         mechanism by which a campus we have no data for gets one.
 *
 *   ?q=finan
 *       — the 600-odd course titles the pipeline already knows, from every
 *         university, as a typeahead. Useful on day one, before any student
 *         has reported anything, and it is what makes a typed course land on
 *         the SAME slug as a scraped one instead of beside it.
 *
 * TITLES ONLY. `pipeline_subjects` is internal because it carries course codes
 * and school names — this selects neither, and the titles it does return are
 * already shipped to every reader in programme-index.json.
 *
 * Suggestions are a nicety, not a dependency: every failure here answers with
 * an empty list, and the student types their courses exactly as they would
 * have anyway.
 * ------------------------------------------------------------------ */

export async function GET(req: Request) {
  const empty = Response.json({ suggested: [], known: [] });
  if (!authEnabled) return empty;
  const sb = admin();
  if (!sb) return empty;

  /* Signed-in only, though it reads nothing personal: these are the internal
     pipeline tables, and an open route over them is an open route over the
     course backlog. Verified against the auth server — see lib/supabase/server. */
  const userId = await currentUserId();
  if (!userId) return Response.json({ suggested: [], known: [] }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();

  if (q.length >= 2) {
    const res = await sb
      .from("pipeline_subjects")
      .select("title")
      .eq("kind", "course")
      .ilike("title", `%${q.replace(/[%_]/g, "")}%`)
      .order("programme_count", { ascending: false })
      .limit(8);
    return Response.json({ suggested: [], known: (res.data ?? []).map((r) => r.title as string) });
  }

  const university = (url.searchParams.get("university") || "").trim();
  const programme = (url.searchParams.get("programme") || "").trim().toLowerCase();
  if (!programme) return empty;

  let sel = sb
    .from("reported_curriculum")
    .select("title, students, year")
    .eq("programme", programme)
    .order("students", { ascending: false })
    .limit(30);
  /* A student at a campus we carry is matched on its id; one at a campus we
     don't is matched on the name they typed, which is the only handle those
     students share. */
  sel = university && university !== "other"
    ? sel.eq("university_id", university)
    : sel.eq("university_other", university.toLowerCase());

  const res = await sel;
  if (res.error) {
    console.error("curriculum: read", res.error.message);
    return empty;
  }

  const year = Number(url.searchParams.get("year"));
  const rows = res.data ?? [];
  /* Their own year first where anyone has said which year a course is in, but
     never ONLY their year — a course reported without one is not evidence
     against it being theirs. */
  const ranked = Number.isFinite(year)
    ? [...rows].sort((a, b) => (a.year === year ? 0 : 1) - (b.year === year ? 0 : 1))
    : rows;

  return Response.json({
    suggested: ranked.map((r) => ({ title: r.title as string, students: r.students as number })),
    known: [],
  });
}
