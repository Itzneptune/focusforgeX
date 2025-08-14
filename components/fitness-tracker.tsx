"use client"

import { useState, useEffect } from "react"
import { Bike, Dumbbell, Scale, Target, Calendar, Trophy, Flame } from "lucide-react"
import { RunningCyclingTab } from "@/components/fitness/running-cycling-tab"
import { GymTab } from "@/components/fitness/gym-tab"
import { WeightTab } from "@/components/fitness/weight-tab"
import { CalisthenicsTab } from "@/components/fitness/calisthenics-tab"
import { HabitsTab } from "@/components/fitness/habits-tab"

const tabs = [
  { id: "running", label: "Running/Cycling", icon: Bike },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "weight", label: "Weight", icon: Scale },
  { id: "calisthenics", label: "Calisthenics", icon: Target },
  { id: "habits", label: "Habits", icon: Calendar },
]

export function FitnessTracker() {
  const [activeTab, setActiveTab] = useState("running")
  const [fitnessData, setFitnessData] = useState({
    todayPoints: 0,
    totalWorkouts: 0,
    weeklyGoal: 5,
    completedThisWeek: 0,
  })

  useEffect(() => {
    // Load fitness data from localStorage
    const savedData = localStorage.getItem("focusforge-fitness")
    if (savedData) {
      setFitnessData(JSON.parse(savedData))
    }
  }, [])

  const updateFitnessData = (newData: Partial<typeof fitnessData>) => {
    const updated = { ...fitnessData, ...newData }
    setFitnessData(updated)
    localStorage.setItem("focusforge-fitness", JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <Trophy className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{fitnessData.todayPoints}</div>
          <div className="text-xs text-gray-400">Today's Points</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <Dumbbell className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{fitnessData.totalWorkouts}</div>
          <div className="text-xs text-gray-400">Total Workouts</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {fitnessData.completedThisWeek}/{fitnessData.weeklyGoal}
          </div>
          <div className="text-xs text-gray-400">Weekly Goal</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {Math.round((fitnessData.completedThisWeek / fitnessData.weeklyGoal) * 100)}%
          </div>
          <div className="text-xs text-gray-400">Progress</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900 rounded-lg p-1">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-200 ${
                activeTab === id ? "bg-red-500 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-light text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 rounded-lg p-4">
        {activeTab === "running" && (
          <RunningCyclingTab
            onPointsEarned={(points) => updateFitnessData({ todayPoints: fitnessData.todayPoints + points })}
          />
        )}
        {activeTab === "gym" && (
          <GymTab onPointsEarned={(points) => updateFitnessData({ todayPoints: fitnessData.todayPoints + points })} />
        )}
        {activeTab === "weight" && (
          <WeightTab
            onPointsEarned={(points) => updateFitnessData({ todayPoints: fitnessData.todayPoints + points })}
          />
        )}
        {activeTab === "calisthenics" && (
          <CalisthenicsTab
            onPointsEarned={(points) => updateFitnessData({ todayPoints: fitnessData.todayPoints + points })}
          />
        )}
        {activeTab === "habits" && (
          <HabitsTab
            onPointsEarned={(points) => updateFitnessData({ todayPoints: fitnessData.todayPoints + points })}
          />
        )}
      </div>
    </div>
  )
}
