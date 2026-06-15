export default function SavedLoading() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <div className="skeleton" style={{ width: 140, height: 30, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: 220, height: 16 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 10, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
            borderLeft: '4px solid #e5e7eb',
          }}>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: 80, height: 10, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: '60%', height: 16 }} />
            </div>
            <div className="skeleton" style={{ width: 40, height: 12, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
