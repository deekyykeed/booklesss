export default function SavedLoading() {
  return (
    <div style={{ padding: '36px 48px', maxWidth: 720 }}>
      <div className="skeleton" style={{ width: 140, height: 34, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: 220, height: 14, marginBottom: 36 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }} />
        ))}
      </div>
    </div>
  )
}
