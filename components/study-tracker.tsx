"use client"

import { useState, useEffect } from "react"
import { BookOpen, Calculator, Building, Brain, Monitor, Trophy, Clock } from "lucide-react"
import { MathematicsTab } from "@/components/study/mathematics-tab"
import { IPMATTab } from "@/components/study/ipmat-tab"
import { SchoolStudiesTab } from "@/components/study/school-studies-tab"
import { AIMLTab } from "@/components/study/ai-ml-tab"
import { MSOfficeTab } from "@/components/study/ms-office-tab"
import { Target } from "lucide-react"

const tabs = [
  { id: "mathematics", label: "Mathematics", icon: Calculator },
  { id: "ipmat", label: "IPMAT", icon: BookOpen },
  { id: "school", label: "School Studies", icon: Building },
  { id: "aiml", label: "AI & ML", icon: Brain },
  { id: "msoffice", label: "MS Office", icon: Monitor },
]

export function StudyTracker() {
  const [activeTab, setActiveTab] = useState("mathematics")
  const [studyData, setStudyData] = useState({
    todayPoints: 0,
    totalHours: 0,
    weeklyGoal: 25,
    hoursThisWeek: 0,
  })

  useEffect(() => {
    // Load study data from localStorage
    const savedData = localStorage.getItem("focusforge-study")
    if (savedData) {
      setStudyData(JSON.parse(savedData))
    }
  }, [])

  const updateStudyData = (newData: Partial<typeof studyData>) => {
    const updated = { ...studyData, ...newData }
    setStudyData(updated)
    localStorage.setItem("focusforge-study", JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <Trophy className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{studyData.todayPoints}</div>
          <div className="text-xs text-gray-400">Today's Points</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{studyData.totalHours}h</div>
          <div className="text-xs text-gray-400">Total Hours</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <Target className="w-5 h-5 text-gray-300 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {studyData.hoursThisWeek}/{studyData.weeklyGoal}h
          </div>
          <div className="text-xs text-gray-400">Weekly Goal</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <BookOpen className="w-5 h-5 text-gray-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {Math.round((studyData.hoursThisWeek / studyData.weeklyGoal) * 100)}%
          </div>
          <div className="text-xs text-gray-400">Progress</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-1">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-1">
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
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        {activeTab === "mathematics" && (
          <MathematicsTab
            onPointsEarned={(points) => updateStudyData({ todayPoints: studyData.todayPoints + points })}
          />
        )}
        {activeTab === "ipmat" && (
          <IPMATTab onPointsEarned={(points) => updateStudyData({ todayPoints: studyData.todayPoints + points })} />
        )}
        {activeTab === "school" && (
          <SchoolStudiesTab
            onPointsEarned={(points) => updateStudyData({ todayPoints: studyData.todayPoints + points })}
            onHoursUpdated={(hours) =>
              updateStudyData({
                totalHours: studyData.totalHours + hours,
                hoursThisWeek: studyData.hoursThisWeek + hours,
              })
            }
          />
        )}
        {activeTab === "aiml" && (
          <AIMLTab
            onPointsEarned={(points) => updateStudyData({ todayPoints: studyData.todayPoints + points })}
            onHoursUpdated={(hours) =>
              updateStudyData({
                totalHours: studyData.totalHours + hours,
                hoursThisWeek: studyData.hoursThisWeek + hours,
              })
            }
          />
        )}
        {activeTab === "msoffice" && (
          <MSOfficeTab onPointsEarned={(points) => updateStudyData({ todayPoints: studyData.todayPoints + points })} />
        )}
      </div>
    </div>
  )
}
