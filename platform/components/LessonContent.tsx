'use client'

import { useRef } from 'react'
import TermTooltip from './TermTooltip'

export interface LessonStep {
  stepNumber: string
  title: string
  course: string
  school: string
  accentColor: string
  coverColor: string
  sections: ContentSection[]
  discussionQuestions: string[]
  keyTerms: { term: string; definition: string }[]
  learningOutcomes: string[]
}

interface ContentSection {
  eyebrow: string
  heading: string
  body: string
  callout?: { label: string; body: string }
}

export default function LessonContent({ step }: { step: LessonStep }) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ position: 'relative' }}>
      {/* Cover band */}
      <div
        style={{
          background: step.coverColor,
          padding: '40px 48px 36px',
          borderBottom: `4px solid ${step.accentColor}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: step.accentColor,
            marginBottom: 8,
            fontFamily: 'var(--font-parastoo)',
          }}
        >
          {step.course} · {step.school} · Step {step.stepNumber}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-parastoo)',
            fontWeight: 700,
            fontSize: 28,
            color: '#fff',
            lineHeight: 1.2,
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          {step.title}
        </h1>
      </div>

      {/* Body */}
      <div
        ref={contentRef}
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '40px 48px 80px',
          position: 'relative',
        }}
      >
        {step.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            {/* Eyebrow */}
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: step.accentColor,
                marginBottom: 4,
                fontFamily: 'var(--font-parastoo)',
              }}
            >
              {section.eyebrow}
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-parastoo)',
                fontWeight: 700,
                fontSize: 18,
                color: '#111',
                margin: '0 0 12px',
                lineHeight: 1.3,
              }}
            >
              {section.heading}
            </h2>

            {/* Body */}
            {section.body.split('\n\n').map((para, j) => (
              <p
                key={j}
                style={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: '#374151',
                  margin: '0 0 14px',
                }}
              >
                {para}
              </p>
            ))}

            {/* Callout */}
            {section.callout && (
              <div
                style={{
                  borderLeft: `3px solid ${step.accentColor}`,
                  background: '#f9fafb',
                  padding: '12px 16px',
                  borderRadius: '0 6px 6px 0',
                  marginTop: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: step.accentColor,
                    marginBottom: 4,
                  }}
                >
                  {section.callout.label}
                </div>
                <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>
                  {section.callout.body}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Discussion Questions */}
        <div
          style={{
            background: '#0F1F35',
            borderRadius: 10,
            padding: '24px 28px',
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: step.accentColor,
              marginBottom: 12,
              fontFamily: 'var(--font-parastoo)',
            }}
          >
            Discussion Questions
          </div>
          {step.discussionQuestions.map((q, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < step.discussionQuestions.length - 1 ? 12 : 0 }}>
              <span
                style={{
                  color: step.accentColor,
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                  fontFamily: 'var(--font-parastoo)',
                }}
              >
                Q{i + 1}.
              </span>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>
                {q}
              </p>
            </div>
          ))}
        </div>

        {/* Key Terms */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: step.accentColor,
              marginBottom: 4,
              fontFamily: 'var(--font-parastoo)',
            }}
          >
            Key Terms
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-parastoo)',
              fontWeight: 700,
              fontSize: 18,
              color: '#111',
              margin: '0 0 14px',
            }}
          >
            Glossary
          </h2>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ background: '#0F1F35' }}>
                <th
                  style={{
                    padding: '8px 14px',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.04em',
                    width: '35%',
                    fontFamily: 'var(--font-parastoo)',
                  }}
                >
                  Term
                </th>
                <th
                  style={{
                    padding: '8px 14px',
                    textAlign: 'left',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-parastoo)',
                  }}
                >
                  Definition
                </th>
              </tr>
            </thead>
            <tbody>
              {step.keyTerms.map((kt, i) => (
                <tr
                  key={i}
                  style={{
                    background: i % 2 === 0 ? '#fff' : '#f9fafb',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <td
                    style={{
                      padding: '9px 14px',
                      fontWeight: 600,
                      color: '#111',
                      verticalAlign: 'top',
                    }}
                  >
                    {kt.term}
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      color: '#4b5563',
                      lineHeight: 1.55,
                    }}
                  >
                    {kt.definition}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Learning Outcomes */}
        <div
          style={{
            border: `1px solid ${step.accentColor}`,
            borderRadius: 8,
            padding: '20px 24px',
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: step.accentColor,
              marginBottom: 10,
              fontFamily: 'var(--font-parastoo)',
            }}
          >
            Learning Outcomes
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {step.learningOutcomes.map((lo, i) => (
              <li
                key={i}
                style={{
                  fontSize: 13.5,
                  color: '#374151',
                  lineHeight: 1.65,
                  marginBottom: 4,
                }}
              >
                {lo}
              </li>
            ))}
          </ul>
        </div>

        {/* TermTooltip overlay — positioned relative to this container */}
        <TermTooltip containerRef={contentRef} />
      </div>
    </div>
  )
}
