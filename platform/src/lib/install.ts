"use client";

import { useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------ *
 * "Add to home screen", as a hook.
 *
 * Two platforms, two completely different stories:
 *   - Chrome/Android fires `beforeinstallprompt`, which must be preventDefault'd
 *     or Chrome shows its own mini-infobar and never fires the event again.
 *     Holding the event is what lets us put install behind our own button.
 *   - iOS Safari fires nothing and has no API at all. The only route is Share →
 *     Add to Home Screen, so all we can do is say so.
 *
 * KNOWN DUPLICATION: components/home/OfflineTools.tsx still carries its own
 * copy of this logic, tangled up with its offline-save code. This hook was
 * pulled out for the onboarding sheet rather than by refactoring that file,
 * because it works and it was not what was being changed. Move OfflineTools
 * onto this the next time it is opened for another reason.
 * ------------------------------------------------------------------ */

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  // iPadOS 13+ reports itself as a Mac; the touch points give it away.
  return /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export function useInstall() {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(true); // assume yes until checked
  const [ios, setIos] = useState(false);

  useEffect(() => {
    /* Read on the next frame rather than in the effect body. Both of these
       are DOM reads that cannot run on the server, so they can't be lazy
       useState initialisers either without risking a hydration mismatch —
       and setting state synchronously in an effect is what the lint rule
       forbids. A frame's delay is invisible for something that only decides
       whether an install button appears. */
    const first = requestAnimationFrame(() => {
      setInstalled(isStandalone());
      setIos(isIos());
    });

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    // One prompt per event, so drop it whichever way they answered.
    setEvent(null);
  }, [event]);

  return {
    /** A real install prompt is available (Chrome/Android). */
    canInstall: !installed && !!event,
    /** iOS: no API, so the sheet has to spell out Share → Add to Home Screen. */
    showIosHelp: !installed && ios && !event,
    installed,
    install,
  };
}
