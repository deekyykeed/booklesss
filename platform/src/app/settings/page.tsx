import type { Metadata } from "next";
import { ReferenceSettings } from "@/components/settings/ReferenceSettings";

export const metadata: Metadata = {
  title: "Settings · Booklesss",
  robots: { index: false, follow: false },
};

/* A replica of the settings dialog the owner sent, on its own route — the same
 * arrangement as `/workspace`: something to look at and judge, not a decision
 * about the app. The reader's own settings are still the sheet behind the
 * profile picture (components/identity/SettingsSheet.tsx).
 *
 * Bare, with no app chrome around it, so nothing of ours is in the frame while
 * it is being compared against the original. */
export default function SettingsPage() {
  return <ReferenceSettings />;
}
