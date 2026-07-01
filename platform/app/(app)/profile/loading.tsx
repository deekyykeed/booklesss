export default function ProfileLoading() {
  return (
    <div style={{ padding: '40px 52px', maxWidth: 520 }}>
      <div className="skeleton" style={{ width: 100, height: 30, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: 220, height: 14, marginBottom: 32 }} />
      <div className="skeleton" style={{ width: 52, height: 52, borderRadius: '50%', marginBottom: 32 }} />
      <div className="skeleton" style={{ width: '100%', height: 44, borderRadius: 8, marginBottom: 20 }} />
      <div className="skeleton" style={{ width: '100%', height: 44, borderRadius: 8, marginBottom: 20 }} />
      <div className="skeleton" style={{ width: '100%', height: 44, borderRadius: 8 }} />
    </div>
  )
}
