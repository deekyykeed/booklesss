'use client'

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-parastoo)', fontSize: 20, fontWeight: 700, color: '#0F1F35', margin: '0 0 8px' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px', maxWidth: 400 }}>
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '10px 24px',
          background: '#0F1F35',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
