import Sidebar from '@/components/Sidebar'
import CommunityPanel from '@/components/CommunityPanel'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#F5F5F5' }}>
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
      <CommunityPanel />
    </div>
  )
}
