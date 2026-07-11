import manifest from '@/public/steps/manifest.json'

// Minimal signed-in index of published steps. Slack is the primary router —
// this page exists so `/` has somewhere to land and students can bookmark it.

type StepEntry = {
  slug: string
  title: string
  eyebrow: string
  course: string
  course_chip: string
  minutes: number
}

export default function StepsIndex() {
  const steps = manifest as StepEntry[]
  const courses = [...new Set(steps.map((s) => s.course))]

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 96px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
        <img src="/booklesss-mark-black.png" alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
        <span style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 22, color: '#0F1F35' }}>
          Booklesss
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-parastoo)', fontWeight: 700, fontSize: 30, color: '#121212', margin: '0 0 6px' }}>
        Your steps
      </h1>
      <p style={{ color: '#71717A', fontSize: 15, margin: '0 0 36px' }}>
        Every step posted in your Slack channels lives here too.
      </p>

      {courses.map((course) => (
        <section key={course} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c5613f', margin: '0 0 12px' }}>
            {course}
          </h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {steps.filter((s) => s.course === course).map((s) => (
              <a
                key={s.slug}
                href={`/steps/${s.slug}.html`}
                style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16,
                  padding: '14px 18px', background: '#f0efeb',
                  border: '1px solid #e8e8e8', borderRadius: 16,
                  textDecoration: 'none', color: '#121212',
                }}
              >
                <span>
                  <span style={{ display: 'block', fontSize: 11, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                    {s.eyebrow}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</span>
                </span>
                <span style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>~{s.minutes} min</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
