export default function LessonLoading() {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, padding: '40px 48px' }}>
        <div className="skeleton" style={{ height: 100, borderRadius: 0, marginBottom: 40 }} />
        <div className="skeleton" style={{ width: '100%', height: 300, borderRadius: 10 }} />
      </div>
      <div style={{ width: 304, minWidth: 304, borderLeft: '1px solid #e5e7eb', padding: 16 }}>
        <div className="skeleton" style={{ height: 20, marginBottom: 20 }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
      </div>
    </div>
  )
}
