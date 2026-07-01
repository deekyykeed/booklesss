export default function DashboardLoading() {
  return (
    <div style={{ padding: '32px 32px 48px' }}>
      <div className="skeleton" style={{ width: 140, height: 29, borderRadius: 6, marginBottom: 28 }} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        {[135, 135, 200, 135, 135].map((w, i) => (
          <div key={i} className="skeleton" style={{ width: w, height: 112, borderRadius: 24 }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 396px))', gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 150, borderRadius: 12 }} />
        ))}
      </div>
    </div>
  )
}
