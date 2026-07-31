"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { allLessonSlugs } from "@/lib/course";
import { COURSES } from "@/lib/courses";
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
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume hidden until checked
  const [installed, setInstalled] = useState(true);

  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const workerRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED) === "1");
    setSavedAt(localStorage.getItem(SAVED));
    setInstalled(isStandalone());
    setIos(isIos());

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
     * dead screen with the lessons sitting right there behind it. */
    const urls = [
      "/", // the dashboard
      ...COURSES.map((c) => `/${c.slug}`), // each course overview
      ...allLessonSlugs().map((slug) => "/" + slug.join("/")),
      "/offline",
    ];
    setProgress({ done: 0, total: urls.length });
    setSaving(true);
    worker.postMessage({ type: "save-all", urls });
  }, []);

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
            <MynaIcon name="download" size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-ink">Study without data</p>
            <p className="mt-0.5 text-[13px] leading-5 text-muted">
              {savedAt
                ? `All lessons saved to this device on ${savedAt}. They open with no connection.`
                : "Save every lesson to this device and read them with no connection. About 700 KB of data."}
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

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={saveEverything}
          disabled={saving}
          className="rounded-full bg-btn px-3.5 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving
            ? `Saving ${progress.done} of ${progress.total}…`
            : savedAt
              ? "Save again"
              : "Save all lessons"}
        </button>

        {canInstall &&
          (installEvent ? (
            <button
              type="button"
              onClick={install}
              className="rounded-full border border-line-2 bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink-2"
            >
              Add to home screen
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowIosHelp((v) => !v)}
              className="rounded-full border border-line-2 bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink-2"
            >
              Add to home screen
            </button>
          ))}
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
