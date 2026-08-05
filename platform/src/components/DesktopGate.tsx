"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_HOST } from "@/lib/site";

/* Booklesss is a phone app. Anything that isn't a phone gets this instead.
 *
 * HARDENED 2026-08-03 on the owner's call. It used to block above 1024px and
 * offer a "Continue on this computer" button that was remembered forever. Both
 * were too soft:
 *
 *   - 1024 lets EVERY TABLET through. An iPad is 768 portrait and 1024
 *     landscape, so the one class of device the gate most needed to catch
 *     walked straight past it.
 *   - The escape button meant anyone could opt into a layout that, in the
 *     owner's words, "will not look good and it will look very scrappy". While
 *     the app is still being built there is nothing on the other side of that
 *     button worth showing.
 *
 * SO THE TEST IS NOW THE SHORTER SIDE OF THE VIEWPORT, not the width.
 * `(min-width: N) and (min-height: N)` is true only when BOTH dimensions
 * exceed N, which is the same as saying the shorter side does. That one
 * expression gets the orientation problem right for free:
 *
 *   phone portrait    430 x 932   -> height passes, let in
 *   phone landscape   932 x 430   -> height passes, let in  (rotating is fine)
 *   iPad portrait     768 x 1024  -> both exceed, blocked
 *   iPad landscape    1024 x 768  -> both exceed, blocked
 *
 * Testing width alone cannot do this: any threshold low enough to catch an
 * iPad portrait also catches a phone held sideways.
 *
 * Still no user-agent sniffing. Tablets, desktop-mode browsers and Windows
 * touch laptops all lie about what they are; the viewport does not.
 *
 * THE WAY THROUGH IS NO LONGER A BUTTON. The owner writes and checks content
 * on a desktop, so an escape has to exist — but it is now a URL nobody
 * stumbles onto (`?desktop=1`), not a control offered to every visitor. */

/* Deliberately a new key: anyone who pressed the old "Continue" button had
 * their pass stored under the previous name, and those passes should not
 * survive a decision to stop letting people through. */
const PASSED = "booklesss-desktop-pass-2";
/** Grants the pass on this device. Not linked from anywhere; for the owner. */
const PASS_PARAM = "desktop";

/** Largest shorter-side, in px, still treated as a phone. A large foldable
 *  opened flat is the only real device this turns away. */
const PHONE_MAX_SHORT_SIDE = 600;

/** The design scratchpads are desktop surfaces on purpose: /workspace replicates
 *  a wide project nav, and /settings is the reference settings dialog at its own
 *  671px. Sending either of them to a phone defeats the only reason they exist,
 *  which is to be compared against the shot they came from. */
/* /privacy, /terms and "/" are here because Google's OAuth reviewers read
 * them on a desktop — the first verification attempt failed with "your home
 * page does not explain the purpose of your app", and its purpose was behind
 * a "use your phone" wall. The home page carries the landing intro now (see
 * HomeView), so it must be readable anywhere; READING a course stays
 * phone-only, so every other route keeps the gate. /sign-in and /sign-up pass
 * through because somebody who followed a link to one on a laptop should be
 * able to finish rather than meet a wall mid-sign-up. (They used to be here
 * for a narrower reason — Clerk routed its OAuth callback under /sign-in's
 * catch-all — which stopped applying when those routes were flattened on
 * 2026-08-05. The exemption is still right; only the reason changed.) */
const SKIP = ["/workspace", "/settings", "/privacy", "/terms", "/sign-in", "/sign-up"];

/** Exact paths that skip the gate — "/" can't go in SKIP, whose prefix rule
 *  would exempt every route in the app. */
const SKIP_EXACT = ["/"];

export function DesktopGate() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const skip =
    SKIP_EXACT.includes(pathname) || SKIP.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (skip) return;

    // `?desktop=1` grants the pass and stores it, so the owner does it once
    // per machine rather than on every navigation.
    if (new URLSearchParams(window.location.search).get(PASS_PARAM) === "1") {
      localStorage.setItem(PASSED, "1");
      return;
    }
    if (localStorage.getItem(PASSED) === "1") return;

    /* Both dimensions over the limit means the SHORTER side is over it, which
       is the only orientation-proof way to ask "is this a phone". A desktop-
       installed PWA is caught by this too, and should be: installing it
       doesn't make a 1400px window look any better. */
    const mq = window.matchMedia(
      `(min-width: ${PHONE_MAX_SHORT_SIDE + 1}px) and (min-height: ${PHONE_MAX_SHORT_SIDE + 1}px)`,
    );
    const apply = () => setShow(mq.matches);
    apply();
    // Someone resizing a window down to phone size should be let straight in,
    // and rotating a phone should never trip it.
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
    // `skip` is in here so navigating from a scratchpad back into the app
    // re-arms the gate rather than leaving it off for the rest of the session.
  }, [skip]);

  if (skip || !show) return null;

  return (
    <div className="desktop-gate">
      <div className="desktop-gate-card">
        <p className="desktop-gate-kicker">Bklsss</p>
        <h1 className="desktop-gate-title">Made for your phone</h1>
        <p className="desktop-gate-body">
          Your notes live in your pocket — installed to your home screen, and readable with no
          connection. Scan this to open it on your phone, then add it to your home screen.
        </p>

        {/* Static file, generated by scripts/gen-qr.mjs — no QR library reaches
            the browser, and phones never download any of this. */}
        <img
          src="/install-qr.svg"
          alt={`QR code linking to ${SITE_HOST}`}
          className="desktop-gate-qr"
          width={188}
          height={188}
        />

        <p className="desktop-gate-url">{SITE_HOST}</p>

        {/* Where "Continue on this computer" used to be. It is a statement
            now rather than a control: there is no bigger-screen layout to
            continue to, and offering the choice implied there was. */}
        <p className="desktop-gate-note">Phones only for now, while we build.</p>
      </div>
    </div>
  );
}
