"use client"

import { useState } from "react"
import { TrendingUp, Target, Award, Clock } from "lucide-react"

interface AnalyticsData {
  totalPoints: number
  currentStreak: number
  longestStreak: number
  totalWorkouts: number
  totalStudyHours: number
  weeklyProgress: number[]
  monthlyGoals: {
    fitness: { current: number; target: number }
    study: { current: number; target: number }
  }
}

export function AnalyticsTracker() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPoints: 1250,
    currentStreak: 7,
    longestStreak: 15,
    totalWorkouts: 23,
    totalStudyHours: 45,
    weeklyProgress: [20, 35, 45, 30, 50, 40, 60],
    monthlyGoals: {
      fitness: { current: 12, target: 20 },
      study: { current: 35, target: 50 },
    },
  })

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "red",
  }: {
    icon: any
    title: string
    value: string | number
    subtitle?: string
    color?: string
  }) => (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <Icon size={20} className={`text-${color}-500`} />
        <span className="text-gray-400 text-sm font-medium">{title}</span>
      </div>
      <div className="text-white text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-gray-500 text-xs mt-1">{subtitle}</div>}
    </div>
  )

  const ProgressChart = () => (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Weekly Progress</h3>
        <div className="flex gap-2">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timeRange === range ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-2 h-32">
        {analytics.weeklyProgress.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-red-600 rounded-t transition-all duration-300 hover:bg-red-500"
              style={{ height: `${(value / 60) * 100}%` }}
            />
            <span className="text-gray-500 text-xs mt-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const GoalProgress = ({
    title,
    current,
    target,
    color = "red",
  }: {
    title: string
    current: number
    target: number
    color?: string
  }) => {
    const percentage = Math.min((current / target) * 100, 100)

    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">{title}</span>
          <span className="text-gray-400 text-sm">
            {current}/{target}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-gray-500 text-xs mt-1">{Math.round(percentage)}% complete</div>
      </div>
    )
  }

  const RecentAchievements = () => (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
      <h3 className="text-white font-semibold mb-4">Recent Achievements</h3>
      <div className="space-y-3">
        {[
          { title: "7-Day Streak", desc: "Consistent daily activity", icon: "🔥" },
          { title: "First 5K Run", desc: "Completed in 25:30", icon: "🏃" },
          { title: "Study Marathon", desc: "4 hours of IPMAT prep", icon: "📚" },
          { title: "Weight Goal", desc: "Lost 2kg this month", icon: "⚖️" },
        ].map((achievement, index) => (
          <div key={index} className="flex items-center gap-3 p-2 bg-gray-800 rounded">
            <span className="text-xl">{achievement.icon}</span>
            <div>
              <div className="text-white text-sm font-medium">{achievement.title}</div>
              <div className="text-gray-400 text-xs">{achievement.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics & History</h2>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Export Data
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Award}
          title="Total Points"
          value={analytics.totalPoints.toLocaleString()}
          subtitle="All time"
        />
        <StatCard
          icon={TrendingUp}
          title="Current Streak"
          value={`${analytics.currentStreak} days`}
          subtitle={`Best: ${analytics.longestStreak} days`}
        />
        <StatCard icon={Target} title="Workouts" value={analytics.totalWorkouts} subtitle="This month" />
        <StatCard icon={Clock} title="Study Hours" value={`${analytics.totalStudyHours}h`} subtitle="This month" />
      </div>

      {/* Progress Chart */}
      <ProgressChart />

      {/* Monthly Goals */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Monthly Goals</h3>
        <GoalProgress
          title="Fitness Sessions"
          current={analytics.monthlyGoals.fitness.current}
          target={analytics.monthlyGoals.fitness.target}
        />
        <GoalProgress
          title="Study Hours"
          current={analytics.monthlyGoals.study.current}
          target={analytics.monthlyGoals.study.target}
          color="blue"
        />
      </div>

      {/* Recent Achievements */}
      <RecentAchievements />

      {/* Activity History */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <h3 className="text-white font-semibold mb-4">Activity History</h3>
        <div className="space-y-3">
          {[
            { date: "Today", activity: "Morning Cycling", points: 50, type: "fitness" },
            { date: "Today", activity: "IPMAT Study Session", points: 80, type: "study" },
            { date: "Yesterday", activity: "Gym Workout", points: 75, type: "fitness" },
            { date: "Yesterday", activity: "Mathematics Chapter", points: 60, type: "study" },
            { date: "2 days ago", activity: "Business Studies", points: 45, type: "study" },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
              <div>
                <div className="text-white text-sm font-medium">{item.activity}</div>
                <div className="text-gray-400 text-xs">{item.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.type === "fitness" ? "bg-red-500" : "bg-blue-500"}`} />
                <span className="text-red-500 font-bold text-sm">+{item.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
