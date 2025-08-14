"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Scale, TrendingUp, TrendingDown } from "lucide-react"

interface WeightTabProps {
  onPointsEarned: (points: number) => void
}

interface WeightEntry {
  id: string
  date: string
  weight: number
  bodyFat?: number
  notes?: string
  photo?: string
}

export function WeightTab({ onPointsEarned }: WeightTabProps) {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    notes: "",
  })

  useEffect(() => {
    const saved = localStorage.getItem("focusforge-weight")
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  const saveEntries = (newEntries: WeightEntry[]) => {
    setEntries(newEntries)
    localStorage.setItem("focusforge-weight", JSON.stringify(newEntries))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const weight = Number.parseFloat(formData.weight)

    if (!weight) return

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight,
      bodyFat: formData.bodyFat ? Number.parseFloat(formData.bodyFat) : undefined,
      notes: formData.notes,
    }

    saveEntries([newEntry, ...entries])
    onPointsEarned(10) // 10 points for logging weight
    setFormData({ weight: "", bodyFat: "", notes: "" })
    setShowForm(false)
  }

  const getWeightTrend = () => {
    if (entries.length < 2) return null
    const latest = entries[0].weight
    const previous = entries[1].weight
    return latest - previous
  }

  const trend = getWeightTrend()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Weight Tracking</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Weight
        </button>
      </div>

      {/* Current Stats */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <Scale className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{entries[0].weight} kg</div>
            <div className="text-xs text-gray-400">Current Weight</div>
          </div>
          {trend !== null && (
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              {trend > 0 ? (
                <TrendingUp className="w-5 h-5 text-red-500 mx-auto mb-1" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-500 mx-auto mb-1" />
              )}
              <div className={`text-lg font-bold ${trend > 0 ? "text-red-500" : "text-green-500"}`}>
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)} kg
              </div>
              <div className="text-xs text-gray-400">vs Last Entry</div>
            </div>
          )}
          {entries[0].bodyFat && (
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{entries[0].bodyFat}%</div>
              <div className="text-xs text-gray-400">Body Fat</div>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="70.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Body Fat % (optional)</label>
              <input
                type="number"
                step="0.1"
                value={formData.bodyFat}
                onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="15.0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Morning weight, after workout"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Save Entry
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

      {/* Weight History */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Scale className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No weight entries yet</p>
            <p className="text-sm mt-1">Start tracking your weight progress!</p>
          </div>
        ) : (
          entries.slice(0, 10).map((entry) => (
            <div key={entry.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-500" />
                  <span className="text-white font-medium">{entry.weight} kg</span>
                  {entry.bodyFat && <span className="text-gray-400 text-sm">({entry.bodyFat}% BF)</span>}
                </div>
                <span className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              {entry.notes && <p className="text-gray-400 text-sm">{entry.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
