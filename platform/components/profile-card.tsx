'use client'

import { useEffect, useState } from 'react'

// One-time profile capture on the steps index: university + year, skippable.
// Shows only for signed-in students without a profile row; disappears after
// save or skip (skip remembered per device).

export function ProfileCard() {
  const [visible, setVisible] = useState(false)
  const [university, setUniversity] = useState('')
  const [year, setYear] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('booklesss-profile-skip')) return
    fetch('/api/profile', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.authenticated && !d.profile?.university) setVisible(true)
      })
      .catch(() => {})
  }, [])

  if (!visible) return null

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/profile', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          university: university || undefined,
          year_of_study: year ? Number(year) : undefined,
        }),
      })
    } catch {}
    setVisible(false)
  }

  function skip() {
    try { localStorage.setItem('booklesss-profile-skip', '1') } catch {}
    setVisible(false)
  }

  return (
    <form
      onSubmit={save}
      className="mb-8 rounded-2xl border border-[#eadfce] bg-[#fdf6e9] p-5"
    >
      <p className="m-0 mb-3 text-[14px] font-semibold text-[#121212]">
        Quick one — where do you study?
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          required
          className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[14px] text-[#1a1a1a]"
        >
          <option value="">University…</option>
          <option value="ZCAS">ZCAS</option>
          <option value="UNZA">UNZA</option>
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[14px] text-[#1a1a1a]"
        >
          <option value="">Year…</option>
          {[1, 2, 3, 4, 5].map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#0F1F35] px-4 py-2 text-[13px] font-bold text-white disabled:bg-[#374151]"
        >
          {saving ? '…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={skip}
          className="text-[13px] text-[#94A3B8] underline underline-offset-2"
        >
          Skip
        </button>
      </div>
    </form>
  )
}
