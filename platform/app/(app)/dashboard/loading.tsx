export default function DashboardLoading() {
  return (
    <div style={{ padding: '36px 48px', maxWidth: 960 }}>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <div className="skeleton" style={{ width: 280, height: 36, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: 160, height: 16 }} />
      </div>

      {/* Chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 36 }}>
        <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 20 }} />
        <div className="skeleton" style={{ width: 70, height: 28, borderRadius: 20 }} />
      </div>

      {/* Section label */}
      <div className="skeleton" style={{ width: 120, height: 11, marginBottom: 10 }} />

      {/* Hero card */}
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 16, overflow: 'hidden',
        display: 'flex', marginBottom: 40,
      }}>
        <div style={{ width: 5, background: '#e5e7eb', flexShrink: 0 }} />
        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div className="skeleton" style={{ width: 40, height: 10, marginBottom: 10 }} />
            <div className="skeleton" style={{ width: 200, height: 24, marginBottom: 10 }} />
            <div className="skeleton" style={{ width: 160, height: 13 }} />
          </div>
          <div className="skeleton" style={{ width: 130, height: 44, borderRadius: 12, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  )
}
