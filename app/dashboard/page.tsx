import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getLeaderboard } from "@/lib/database"
import DashboardContent from "@/components/dashboard/dashboard-content"
import Leaderboard from "@/components/dashboard/leaderboard"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const leaderboardUsers = await getLeaderboard(10)

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main dashboard content */}
          <div className="lg:col-span-2">
            <DashboardContent user={user} />
          </div>

          {/* Leaderboard sidebar */}
          <div className="lg:col-span-1">
            <Leaderboard users={leaderboardUsers} currentUser={user} />
          </div>
        </div>
      </div>
    </div>
  )
}
