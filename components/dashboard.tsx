"use client"

import { useState } from "react"
import { Home, Dumbbell, BookOpen, BarChart3, Settings, LogOut } from "lucide-react"
import { FitnessTracker } from "@/components/fitness-tracker"
import { StudyTracker } from "@/components/study-tracker"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { SettingsTracker } from "@/components/settings-tracker"
import { signOutAction } from "@/lib/actions"
import type { User, UserStats } from "@/lib/database"

interface DashboardProps {
  user: User
  userStats: UserStats | null
}

function FitnessContent({ user }: { user: User }) {
  return (
    <div className="animate-fade-in">
      <FitnessTracker user={user} />
    </div>
  )
}

function StudyContent({ user }: { user: User }) {
  return (
    <div className="animate-fade-in">
      <StudyTracker user={user} />
    </div>
  )
}

function AnalyticsContent({ user, userStats }: { user: User; userStats: UserStats | null }) {
  return (
    <div className="animate-fade-in">
      <AnalyticsTracker user={user} userStats={userStats} />
    </div>
  )
}

function SettingsContent({ user }: { user: User }) {
  return (
    <div className="animate-fade-in">
      <SettingsTracker user={user} />
    </div>
  )
}

function HomeContent({ user, userStats }: { user: User; userStats: UserStats | null }) {
  return (
    <div className="animate-fade-in p-6">
      {/* Header with Points */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">FocusForge</h1>
            <p className="text-gray-400 text-sm">Welcome back, {user.name || user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-red-600 px-4 py-2 rounded-full">
              <span className="text-white font-bold">{userStats?.total_points || 0} pts</span>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <div className="text-red-500 text-sm font-medium">Study Streak</div>
          <div className="text-white text-2xl font-bold">{userStats?.study_streak || 0} days</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <div className="text-red-500 text-sm font-medium">Fitness Streak</div>
          <div className="text-white text-2xl font-bold">{userStats?.fitness_streak || 0} days</div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Get Started</h2>
        <div className="grid gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Track Your First Workout</div>
                <div className="text-gray-400 text-sm">Start your fitness journey</div>
              </div>
              <Dumbbell className="text-red-500" size={24} />
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Log Your Study Session</div>
                <div className="text-gray-400 text-sm">Begin tracking your learning</div>
              </div>
              <BookOpen className="text-red-500" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Dashboard({ user, userStats }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("home")

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent user={user} userStats={userStats} />
      case "fitness":
        return <FitnessContent user={user} />
      case "study":
        return <StudyContent user={user} />
      case "analytics":
        return <AnalyticsContent user={user} userStats={userStats} />
      case "settings":
        return <SettingsContent user={user} />
      default:
        return <HomeContent user={user} userStats={userStats} />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="pb-20">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around py-2">
          {[
            { id: "home", icon: Home, label: "Home" },
            { id: "fitness", icon: Dumbbell, label: "Fitness" },
            { id: "study", icon: BookOpen, label: "Study" },
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                activeTab === id ? "text-red-500 bg-red-500/10" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
