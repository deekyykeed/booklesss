'use client'

import { useEffect, useState } from 'react'

// "Study profile" page mounted inside Clerk's UserProfile modal (via
// <UserButton.UserProfilePage> in step-chrome.tsx). Unlike ProfileCard —
// the one-time capture on the steps index — this is the editable settings
// view: it loads the current row from /api/profile and saves changes back.

export function StudyProfileSettings() {
  const [university, setUniversity] = useState('')
  const [year, setYear] = useState('')
  const [state, setState] = useState<'loading' | 'ready' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    fetch('/api/profile', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.profile?.university) setUniversity(d.profile.university)
        if (d?.profile?.year_of_study) setYear(String(d.profile.year_of_study))
        setState('ready')
      })
      .catch(() => setState('ready'))
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setState('saving')
    try {
      const r = await fetch('/api/profile', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          university: university || undefined,
          year_of_study: year ? Number(year) : undefined,
        }),
      })
      setState(r.ok ? 'saved' : 'error')
    } catch {
      setState('error')
    }
  }

  const field =
    'w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#1a1a1a]'

  return (
    <div>
      <h1 className="m-0 mb-1 text-[17px] font-bold text-[#18181b]">Study profile</h1>
      <p className="m-0 mb-5 text-[13px] leading-relaxed text-[#6b6459]">
        Where you study and your year — it helps us match steps to your exact
        course and semester.
      </p>
      {state === 'loading' ? (
        <p className="text-[13px] text-[#a89f8c]">Loading…</p>
      ) : (
        <form onSubmit={save} className="grid max-w-[320px] gap-3">
          <label className="grid gap-1 text-[12px] font-semibold text-[#6b6459]">
            University
            <select value={university} onChange={(e) => setUniversity(e.target.value)} className={field}>
              <option value="">Choose…</option>
              <option value="ZCAS">ZCAS</option>
              <option value="UNZA">UNZA</option>
            </select>
          </label>
          <label className="grid gap-1 text-[12px] font-semibold text-[#6b6459]">
            Year of study
            <select value={year} onChange={(e) => setYear(e.target.value)} className={field}>
              <option value="">Choose…</option>
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </label>
          <div className="mt-1 flex items-center gap-3">
            <button
              type="submit"
              disabled={state === 'saving'}
              className="rounded-lg bg-[#18181b] px-4 py-2 text-[13px] font-bold text-white disabled:opacity-60"
            >
              {state === 'saving' ? 'Saving…' : 'Save'}
            </button>
            {state === 'saved' && <span className="text-[12px] font-semibold text-[#0E5F4C]">Saved ✓</span>}
            {state === 'error' && <span className="text-[12px] font-semibold text-[#b91c1c]">Couldn&rsquo;t save — try again</span>}
          </div>
        </form>
      )}
    </div>
  )
}
