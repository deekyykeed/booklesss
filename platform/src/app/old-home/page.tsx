import { TopBar } from "@/components/TopBar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, ProgressRing, BlackButton, GhostButton, Pill } from "@/components/StatCard";

// Formerly the home page in Framer; moved to /old-home after the swap.
export default function OldHomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <TopBar orgName="Partnr" />
      <DashboardSidebar />

      <main className="pt-12 md:pl-[var(--sidebar-dash)]">
        <div className="mx-auto max-w-[980px] p-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card
              title="Organization credits"
              valueDim
              value="$0.00"
              action={<BlackButton>Add funds</BlackButton>}
              sub={
                <a href="#" className="text-danger hover:underline">
                  Turn on auto-reload
                </a>
              }
            />

            <Card
              title="Spend this month"
              value="$0.00"
              action={<ProgressRing value={0} />}
              sub="of $500 limit · resets Jul 1"
            />

            <Card
              title="Prompt caching"
              valueDim
              value="—"
              action={<Pill>Not enabled</Pill>}
              sub={
                <div className="flex items-center justify-between gap-3">
                  <span>tokens reused</span>
                  <GhostButton>Set up</GhostButton>
                </div>
              }
            />

            <div className="lg:col-span-3">
              <Card
                title="Token volume"
                valueDim
                value="—"
                sub={
                  <div className="flex items-center justify-between gap-3">
                    <span>No activity in the last 7 days</span>
                    <GhostButton>Try a prompt</GhostButton>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
