export default function LibraryLoading() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <div className="skeleton" style={{ width: 180, height: 30, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: 280, height: 16 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            <div className="skeleton" style={{ height: 6, borderRadius: 0 }} />
            <div style={{ padding: '16px 18px 18px' }}>
              <div className="skeleton" style={{ width: 40, height: 10, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: '80%', height: 18, marginBottom: 16 }} />
              <div className="skeleton" style={{ width: 80, height: 30, borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
