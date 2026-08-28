import type { Metadata } from "next";
import { SavedTab } from "@/components/home/SavedTab";
import { RequireAccount } from "@/components/auth/RequireAccount";
import { RequireOnboarding } from "@/components/auth/RequireOnboarding";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Saved",
  description: "The sections you kept.",
  alternates: { canonical: "/dashboard/saved" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/dashboard/saved" }),
};

/* Save shipped in August with nowhere to read the saves back. This is that
 * page — the third seat in the home dock, and the one destination on it that
 * needed no new storage: lib/saved already held the records and lib/state-sync
 * already carried them between devices. */
export default function SavedPage() {
  return (
    <>
      <RequireAccount />
      <RequireOnboarding>
        <SavedTab />
      </RequireOnboarding>
    </>
  );
}
