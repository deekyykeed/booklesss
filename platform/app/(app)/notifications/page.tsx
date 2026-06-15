export default function NotificationsPage() {
  return (
    <div style={{ padding: '36px 48px', maxWidth: 720, boxSizing: 'border-box' }}>
      <h1 style={{
        fontFamily: 'var(--font-familjen), "Familjen Grotesk", sans-serif',
        fontSize: 28, fontWeight: 700, color: '#0a0a0a',
        margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2,
      }}>
        Notifications
      </h1>
      <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 36px' }}>
        You&apos;re all caught up.
      </p>

      <div style={{
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 14, padding: '40px 32px',
        textAlign: 'center', color: '#9ca3af', fontSize: 14,
      }}>
        No notifications yet — check back when new steps drop.
      </div>
    </div>
  )
}
