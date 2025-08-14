"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Clock, MapPin, Zap } from "lucide-react"

interface RunningCyclingTabProps {
  onPointsEarned: (points: number) => void
}

interface Activity {
  id: string
  type: "running" | "cycling"
  date: string
  distance: number
  time: number
  pace: number
  notes?: string
}

export function RunningCyclingTab({ onPointsEarned }: RunningCyclingTabProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "running" as "running" | "cycling",
    distance: "",
    time: "",
    notes: "",
  })

  useEffect(() => {
    const saved = localStorage.getItem("focusforge-running-cycling")
    if (saved) {
      setActivities(JSON.parse(saved))
    }
  }, [])

  const saveActivities = (newActivities: Activity[]) => {
    setActivities(newActivities)
    localStorage.setItem("focusforge-running-cycling", JSON.stringify(newActivities))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const distance = Number.parseFloat(formData.distance)
    const time = Number.parseFloat(formData.time)

    if (!distance || !time) return

    const pace = time / distance // minutes per km
    const points = Math.round(distance * 10) // 10 points per km

    const newActivity: Activity = {
      id: Date.now().toString(),
      type: formData.type,
      date: new Date().toISOString(),
      distance,
      time,
      pace,
      notes: formData.notes,
    }

    saveActivities([newActivity, ...activities])
    onPointsEarned(points)
    setFormData({ type: "running", distance: "", time: "", notes: "" })
    setShowForm(false)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace)
    const seconds = Math.round((pace - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}/km`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Running & Cycling</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Activity
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Activity Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "running" | "cycling" })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="5.0"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Time (minutes)</label>
              <input
                type="number"
                step="0.1"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="30"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Morning run in the park"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Save Activity
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Recent Activities */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activities logged yet</p>
            <p className="text-sm mt-1">Start tracking your runs and rides!</p>
          </div>
        ) : (
          activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${activity.type === "running" ? "bg-blue-500" : "bg-green-500"}`}
                  />
                  <span className="text-white font-medium capitalize">{activity.type}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  {activity.distance} km
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-4 h-4" />
                  {formatTime(activity.time)}
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Zap className="w-4 h-4" />
                  {formatPace(activity.pace)}
                </div>
              </div>
              {activity.notes && <p className="text-gray-400 text-sm mt-2">{activity.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
