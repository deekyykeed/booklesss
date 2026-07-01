export default function CalendarLoading() {
  return (
    <div style={{ padding: '36px 48px', maxWidth: 720 }}>
      <div className="skeleton" style={{ width: 180, height: 34, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 36 }} />
      <div className="skeleton" style={{ width: '100%', height: 320, borderRadius: 14 }} />
    </div>
  )
}
