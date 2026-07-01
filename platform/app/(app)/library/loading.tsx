export default function LibraryLoading() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 900 }}>
      <div className="skeleton" style={{ width: 200, height: 30, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: 320, height: 14, marginBottom: 32 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 10 }} />
        ))}
      </div>
    </div>
  )
}
