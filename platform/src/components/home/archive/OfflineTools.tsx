"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { ActionBar } from "@/components/ui/ActionBar";
import { pathForId } from "@/lib/course";
import { enrolledCourses } from "@/lib/courses";
import { useIdentity } from "@/lib/identity";
import { useIsClient } from "@/lib/is-client";
import { loadSearchIndex } from "@/lib/search";

/* The two things a reader can do with the service worker, in one card:
 * install the reader to the home screen, and save every lesson for reading
 * with no connection.
 *
 * Both are deliberately opt-in. Saving every page costs well under a megabyte,
 * but it is still someone's mobile data, and spending it uninvited is exactly
 * the kind of thing that makes a student uninstall an app. */

/** Chrome/Edge/Android only — the spec isn't implemented in Safari at all. */
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED = "booklesss-offline-card-dismissed";
const SAVED = "booklesss-lessons-saved";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS predates the display-mode media query and uses its own flag.
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iOS can install, but only by hand — so it needs telling, not a button. */
function isIos() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPadOS 13+ reports itself as a Mac; the touch points give it away.
  return /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export function OfflineTools() {
  const { identity } = useIdentity();
  /* What "every lesson" means for this student: the courses they're taking. */
  const mine = useMemo(() => enrolledCourses(identity?.courses), [identity?.courses]);

  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);

  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [supported, setSupported] = useState(false);
  const workerRef = useRef<ServiceWorker | null>(null);

  /* FOUR FACTS ABOUT THE DEVICE, READ RATHER THAN COPIED.
   *
   * All four used to be useState defaults corrected by a setState at the top of
   * the effect below — "assume hidden until checked" — which is a cascading
   * render and the thing React's lint rule now refuses outright. It also meant
   * the panel decided whether to draw itself twice on every visit.
   *
   * `isClient` is the gate: on the server all four take the safe default, so
   * the HTML matches the client's first paint, and from that paint onwards they
   * are simply read. Nothing is stored, so nothing can go stale.
   *
   * Three of them still need to CHANGE later — an install completing, a dismiss
   * being tapped, a save finishing — so those keep a nullable override beside
   * them. `null` means "whatever the device says"; anything else is this
   * session's answer and wins. Same shape the identity form uses. */
  const isClient = useIsClient();
  const ios = isClient && isIos();

  const [installedNow, setInstalled] = useState<boolean | null>(null);
  const installed = installedNow ?? (isClient ? isStandalone() : true);

  const [dismissedNow, setDismissed] = useState<boolean | null>(null);
  const dismissed = dismissedNow ?? (isClient ? localStorage.getItem(DISMISSED) === "1" : true);

  /* `undefined` rather than `null` for "not overridden", because null is a real
     answer here — a device that has never saved anything. */
  const [savedAtNow, setSavedAt] = useState<string | null | undefined>(undefined);
  const savedAt = savedAtNow === undefined ? (isClient ? localStorage.getItem(SAVED) : null) : savedAtNow;

  useEffect(() => {
    const onPrompt = (e: Event) => {
      // Without this Chrome shows its own mini-infobar and never fires again.
      e.preventDefault();
      setInstallEvent(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          workerRef.current = reg.active;
          setSupported(!!reg.active);
        })
        .catch(() => {});
    }

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data?.type === "save-all-progress") setProgress({ done: data.done, total: data.total });
      if (data?.type === "save-all-done") {
        setProgress({ done: data.done, total: data.total });
        setSaving(false);
        const stamp = new Date().toLocaleDateString();
        localStorage.setItem(SAVED, stamp);
        setSavedAt(stamp);
      }
    };
    navigator.serviceWorker?.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      navigator.serviceWorker?.removeEventListener("message", onMessage);
    };
  }, []);

  const install = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    // The event is single-use; Chrome fires a fresh one if they decline.
    setInstallEvent(null);
    if (outcome === "accepted") setInstalled(true);
  }, [installEvent]);

  const saveEverything = useCallback(() => {
    const worker = workerRef.current ?? navigator.serviceWorker?.controller;
    if (!worker) return;

    /* Search loads the lesson prose as its own chunk, only when the palette is
     * first opened. A reader who saves for offline without ever having
     * searched would have every page but no index — so pull it now, while
     * there's still a connection. It's a hashed static asset, which the worker
     * caches on sight. */
    loadSearchIndex().catch(() => {});
    /* Every page a reader can reach, not just the lessons — landing on a
     * dashboard that isn't saved would mean opening the app offline to a
     * dead screen with the lessons sitting right there behind it.
     *
     * Their own courses only. This is someone's mobile data, and a course
     * their school doesn't teach isn't a page they will ever open offline. */
    const urls = [
      "/", // the dashboard
      ...mine.map((c) => `/${c.slug}`), // each of their course overviews
      ...mine.flatMap((c) => c.lessonIds.map((id) => pathForId(id))),
      "/offline",
    ];
    setProgress({ done: 0, total: urls.length });
    setSaving(true);
    worker.postMessage({ type: "save-all", urls });
  }, [mine]);

  const dismiss = () => {
    localStorage.setItem(DISMISSED, "1");
    setDismissed(true);
  };

  // Nothing to offer: no worker (so no offline), or they've closed the card.
  if (!supported || dismissed) return null;

  const canInstall = !installed && (!!installEvent || ios);

  return (
    <div className="dash-offline squircle">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="shrink-0 pt-0.5 text-ink-2">
            <HugeIcon name="download" size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-ink">Study without data</p>
            <p className="mt-0.5 text-[13px] leading-5 text-muted">
              {savedAt
                ? `Your lessons were saved to this device on ${savedAt}. They open with no connection.`
                : /* No fixed figure any more: what gets saved is their courses,
                     so the total depends on how many they're taking. */
                  "Save every lesson in your courses to this device and read them with no connection. Well under a megabyte of data."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide"
          className="shrink-0 text-[13px] text-muted transition-colors hover:text-ink"
        >
          &times;
        </button>
      </div>

      {/* ONE BUTTON SHAPE, THE COURSE CARD'S (owner, 2026-08-04: "the exact
          button in the course card should be its own component and ill use it
          throughout all the buttons within the app like the add to homescreen
          and the saveall lessons"). These were two hand-rolled pills with their
          own radius, padding and hover — a third and fourth spelling of a
          control the app already had.

          SIDE BY SIDE, WITH THE INSTALL IN INK (owner, 2026-08-04: "the save
          all lessons and add to home screen need to be side by side, with the
          add to homescreen in black since it's what I ultimately want"). They
          stacked at first on the reasoning that the shape is full-width by
          definition — which was a fact about the course card, where the bar IS
          the card's footer, and not about a pair of controls that belong
          together. Two halves of one row read as a choice; two stacked bars read
          as two unrelated things that happen to be adjacent.

          Installing is the one that matters, so it wears the primary variant.
          Saving lessons is what you do INSIDE the installed app; offering both
          in the same weight left the more valuable one to be found rather than
          taken.

          TWO COLUMNS AT EVERY WIDTH, with no breakpoint under them. There was
          one — `min-[420px]:grid-cols-2` — so that a narrow phone got a single
          column rather than two bars too short to hold "Saving 148 of 200…".
          The reasoning was fine and the number was wrong: 1080px at Android's
          usual 2.625 device pixel ratio is a 411px viewport, so the owner's own
          phone missed the threshold by nine pixels and he reported the same
          request twice (2026-08-04, then again 2026-08-05 with a screenshot of
          them stacked).

          A layout rule that fails on the most common phone in the market is not
          a safeguard, it is a bug with a comment explaining it. The label was
          the actual constraint, so the label is what changed — "148/200" rather
          than "148 of 200" — and the row holds at 320px, narrower than any
          phone still in use.

          SAVING SHOWS ITS PROGRESS IN THE FILL, which is the whole reason this
          shape was worth sharing — the course card uses it for how far through
          a course you are, and this is the same idea about a different number.
          The count stays in the label, because a fill answers "roughly" and
          somebody watching 200 lessons download wants the actual figure. */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {canInstall && (
          <ActionBar
            variant="primary"
            onClick={installEvent ? install : () => setShowIosHelp((v) => !v)}
            /* First in the DOM so it is first to a keyboard and a screen
               reader, which is the order it matters in — the grid does not
               reorder it, it simply sits left. */
          >
            {/* "Install the app", not "Add to home screen" (owner,
                2026-08-05). The old label described the MECHANISM — what the
                browser calls its own menu item — and a student reads it as
                bookmarking. What they get is an app: its own icon, its own
                window, no address bar, and every lesson readable with no
                connection. Say the thing, not the gesture.
                The iOS help line below keeps Apple's exact wording, because
                there it is naming a menu item somebody has to find. */}
            Install the app
          </ActionBar>
        )}
        <ActionBar
          onClick={saveEverything}
          disabled={saving}
          progress={saving && progress.total ? progress.done / progress.total : undefined}
        >
          {saving
            ? /* "148/200", not "148 of 200" — see the note above the grid. Two
                 words of padding is what pushed this bar past half a phone. */
              `Saving ${progress.done}/${progress.total}…`
            : savedAt
              ? "Save again"
              : "Save all lessons"}
        </ActionBar>
      </div>

      {/* Safari has no install API, so the only honest thing is directions. */}
      {showIosHelp && (
        <p className="mt-2.5 text-[13px] leading-5 text-muted">
          In Safari, tap the Share button, then <span className="text-ink">Add to Home Screen</span>.
        </p>
      )}
    </div>
  );
}
