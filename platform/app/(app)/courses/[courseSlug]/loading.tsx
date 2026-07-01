export default function CourseLoading() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 0 60px' }}>
      <div className="skeleton" style={{ height: 110, borderRadius: 0 }} />
      <div style={{ padding: '32px 48px' }}>
        <div className="skeleton" style={{ width: 100, height: 14, marginBottom: 14 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
