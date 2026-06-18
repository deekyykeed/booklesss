import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type CourseRef = { slug: string; name: string; school: string; accent_color: string; cover_color: string }

interface Exam {
  id: string
  title: string
  year: number
  session: string
  pdf_url: string | null
  courses: CourseRef | CourseRef[] | null
}

export default async function ExamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: exams } = await supabase
    .from('exams')
    .select('id, title, year, session, pdf_url, courses(slug, name, school, accent_color, cover_color)')
    .order('year', { ascending: false })
    .order('session')

  const allExams = (exams ?? []) as unknown as Exam[]

  type CourseGroup = {
    courseName: string
    school: string
    accentColor: string
    coverColor: string
    slug: string
    papers: Exam[]
  }
  const byCourse: Record<string, CourseGroup> = {}
  for (const exam of allExams) {
    const courseRaw = exam.courses
    if (!courseRaw) continue
    const course: CourseRef = Array.isArray(courseRaw) ? courseRaw[0] : courseRaw
    if (!course) continue
    const key = course.slug
    if (!byCourse[key]) {
      byCourse[key] = {
        courseName: course.name,
        school: course.school,
        accentColor: course.accent_color,
        coverColor: course.cover_color,
        slug: key,
        papers: [],
      }
    }
    byCourse[key].papers.push(exam)
  }

  const groups = Object.values(byCourse)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 48px 80px' }}>
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            marginBottom: 6,
            fontFamily: 'var(--font-parastoo)',
          }}
        >
          Study Resources
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-parastoo)',
            fontSize: 26,
            fontWeight: 700,
            color: '#0F1F35',
            margin: '0 0 8px',
          }}
        >
          Past Exam Papers
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          Practice with real exam questions from previous sittings. PDFs will be added as they become available.
        </p>
      </div>

      {groups.length === 0 && (
        <div
          style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: 14,
            border: '1px dashed #e5e7eb',
            borderRadius: 10,
          }}
        >
          No exam papers available yet — check back soon.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {groups.map((group) => (
          <div key={group.slug}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: `2px solid ${group.accentColor}`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: group.accentColor,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-parastoo)',
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#0F1F35',
                }}
              >
                {group.courseName}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#9ca3af',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {group.school}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.papers.map((paper) => (
                <div
                  key={paper.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 16px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    borderLeft: `4px solid ${group.accentColor}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#0F1F35',
                        marginBottom: 3,
                      }}
                    >
                      {paper.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                      {paper.year} · {paper.session}
                    </div>
                  </div>
                  {paper.pdf_url ? (
                    <a
                      href={paper.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 16px',
                        background: group.accentColor,
                        color: '#fff',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                        flexShrink: 0,
                      }}
                    >
                      Open PDF
                    </a>
                  ) : (
                    <span
                      style={{
                        padding: '6px 16px',
                        background: '#f3f4f6',
                        color: '#9ca3af',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      Coming Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
