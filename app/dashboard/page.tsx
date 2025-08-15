import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/lib/actions"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}!</h1>
            <p className="text-gray-400">Ready to focus and forge ahead?</p>
          </div>
          <form action={signOutAction}>
            <Button
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
            >
              Sign Out
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg border border-red-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Study Tracker</h2>
            <p className="text-gray-400 mb-4">Track your learning progress across different subjects</p>
            <Button className="bg-red-600 hover:bg-red-700">Start Studying</Button>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-red-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Fitness Tracker</h2>
            <p className="text-gray-400 mb-4">Monitor your workouts and physical activities</p>
            <Button className="bg-red-600 hover:bg-red-700">Log Workout</Button>
          </div>
        </div>

        <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-red-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">0</div>
              <div className="text-gray-400">Study Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">0</div>
              <div className="text-gray-400">Workout Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">0</div>
              <div className="text-gray-400">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
