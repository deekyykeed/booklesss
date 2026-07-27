/* Bring a lesson section into view.
 *
 * scrollIntoView walks to the nearest scrollable ancestor, which is exactly
 * what's wanted here: on desktop that's #content-surface (the reader's own
 * scroll container), on mobile it's the document. The sections carry
 * `scroll-mt-24`, so the fixed header doesn't sit on top of the heading.
 *
 * Returns false when the id isn't on the page — the caller decides what that
 * means (usually: scroll to the top instead). */
export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth"): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: "start" });
  return true;
}
