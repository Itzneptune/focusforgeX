"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Target, Trophy } from "lucide-react"

interface CalisthenicsTabProps {
  onPointsEarned: (points: number) => void
}

interface Skill {
  name: string
  currentMax: number
  personalBest: number
  unit: string
}

interface SkillEntry {
  id: string
  skill: string
  reps: number
  date: string
  isPR: boolean
  notes?: string
}

export function CalisthenicsTab({ onPointsEarned }: CalisthenicsTabProps) {
  const [skills, setSkills] = useState<Skill[]>([
    { name: "Pull-ups", currentMax: 0, personalBest: 0, unit: "reps" },
    { name: "Push-ups", currentMax: 0, personalBest: 0, unit: "reps" },
    { name: "Dips", currentMax: 0, personalBest: 0, unit: "reps" },
    { name: "Handstand", currentMax: 0, personalBest: 0, unit: "seconds" },
    { name: "Plank", currentMax: 0, personalBest: 0, unit: "seconds" },
  ])
  const [entries, setEntries] = useState<SkillEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    skill: "Pull-ups",
    reps: "",
    notes: "",
  })

  useEffect(() => {
    const savedSkills = localStorage.getItem("focusforge-calisthenics-skills")
    const savedEntries = localStorage.getItem("focusforge-calisthenics-entries")

    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    }
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const saveData = (newSkills: Skill[], newEntries: SkillEntry[]) => {
    setSkills(newSkills)
    setEntries(newEntries)
    localStorage.setItem("focusforge-calisthenics-skills", JSON.stringify(newSkills))
    localStorage.setItem("focusforge-calisthenics-entries", JSON.stringify(newEntries))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const reps = Number.parseInt(formData.reps)

    if (!reps) return

    const skill = skills.find((s) => s.name === formData.skill)
    if (!skill) return

    const isPR = reps > skill.personalBest
    const points = isPR ? 50 : 20 // 50 points for PR, 20 for regular entry

    const newEntry: SkillEntry = {
      id: Date.now().toString(),
      skill: formData.skill,
      reps,
      date: new Date().toISOString(),
      isPR,
      notes: formData.notes,
    }

    const updatedSkills = skills.map((s) =>
      s.name === formData.skill ? { ...s, currentMax: reps, personalBest: Math.max(s.personalBest, reps) } : s,
    )

    saveData(updatedSkills, [newEntry, ...entries])
    onPointsEarned(points)
    setFormData({ skill: "Pull-ups", reps: "", notes: "" })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Calisthenics Progress</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Progress
        </button>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skills.map((skill) => (
          <div key={skill.name} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">{skill.name}</h4>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-400">Current Max</div>
                <div className="text-white font-semibold">
                  {skill.currentMax} {skill.unit}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Personal Best</div>
                <div className="text-red-500 font-semibold">
                  {skill.personalBest} {skill.unit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Skill</label>
              <select
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                {skills.map((skill) => (
                  <option key={skill.name} value={skill.name}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                {skills.find((s) => s.name === formData.skill)?.unit === "seconds" ? "Duration (seconds)" : "Reps"}
              </label>
              <input
                type="number"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="10"
                required
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
              placeholder="Felt strong today"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Save Progress
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

      {/* Recent Progress */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No progress logged yet</p>
            <p className="text-sm mt-1">Start tracking your calisthenics skills!</p>
          </div>
        ) : (
          entries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-white font-medium">{entry.skill}</span>
                  {entry.isPR && (
                    <div className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded text-xs text-white">
                      <Trophy className="w-3 h-3" />
                      PR!
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {entry.reps} {skills.find((s) => s.name === entry.skill)?.unit}
                </span>
                <span className="text-red-500 text-sm">+{entry.isPR ? 50 : 20} points</span>
              </div>
              {entry.notes && <p className="text-gray-400 text-sm mt-2">{entry.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
