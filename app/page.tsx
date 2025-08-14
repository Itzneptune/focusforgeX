import { getCurrentUser } from "@/lib/auth"
import { getUserStats } from "@/lib/database"
import { redirect } from "next/navigation"
import { Dashboard } from "@/components/dashboard"

export default async function Home() {
  // Get the current user (middleware ensures they're authenticated)
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user stats for the dashboard
  const userStats = await getUserStats(user.id)

  return <Dashboard user={user} userStats={userStats} />
}
