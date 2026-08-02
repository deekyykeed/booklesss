"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { shareTargetFor } from "@/lib/share-target";
import { shareUrl } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * The header's share control — one button, for whatever page you're on.
 *
 * It replaced a "Feedback" button that had no handler on it (owner,
 * 2026-08-02). Sharing is the thing a student actually does from this app: the
 * course reaches the next student through a WhatsApp group, not a search
 * result, so the way to put a link in one belongs in the chrome that is on
 * every page rather than on a surface you have to go and find.
 *
 * On a phone this opens the native share sheet, with WhatsApp one tap away and
 * the preview card already attached to the link. Where there is no share sheet
 * — every desktop browser except Safari and Edge — it copies the URL and says
 * so in the button itself, so the word is the whole feedback and there is no
 * toast to build.
 *
 * Only `title` and `url` go to the sheet. WhatsApp puts a `text` field in
 * front of the link, which pushes the URL down the message and reads like a
 * forwarded advert; the preview card already says what the page is.
 * ------------------------------------------------------------------ */

const NO_SUBSCRIBE = () => () => {};
const hasShareSheet = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

export function ShareControl({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const target = useMemo(() => shareTargetFor(pathname ?? "/"), [pathname]);

  /* Whether this device has a share sheet is a fact about the browser, not
   * state this component owns — so it is read the way the rest of the app
   * reads localStorage (identity.tsx, progress.tsx): a store whose server
   * snapshot is "no" and which swaps to the truth on hydration, with no
   * mismatch and no effect writing state. The capability never changes, so
   * nothing subscribes. */
  const canShare = useSyncExternalStore(NO_SUBSCRIBE, hasShareSheet, () => false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const onClick = async () => {
    const url = shareUrl(target.path);

    if (canShare) {
      try {
        await navigator.share({ title: target.title, url });
        return;
      } catch {
        /* Dismissing the sheet rejects with AbortError, which is not an error
         * any reader needs to hear about — and a sheet that failed to open at
         * all should still leave them holding the link. Both fall through to
         * the copy below. */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard refused (an insecure origin, or a browser that asks first).
      // Nothing useful left to try, and throwing here would be an unhandled
      // rejection on a button press.
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? "Link copied" : target.label}
      title={copied ? "Link copied" : target.label}
      className={"text-xs text-ink-2 transition-colors hover:text-ink " + className}
    >
      {copied ? "Copied" : "Share"}
    </button>
  );
}
