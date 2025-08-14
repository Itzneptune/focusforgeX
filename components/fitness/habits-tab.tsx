"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Calendar, CheckCircle, Circle, Flame } from "lucide-react"

interface HabitsTabProps {
  onPointsEarned: (points: number) => void
}

interface Habit {
  id: string
  name: string
  description: string
  points: number
  streak: number
  completedToday: boolean
  completedDates: string[]
}

export function HabitsTab({ onPointsEarned }: HabitsTabProps) {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "morning-cycling",
      name: "Morning Cycling",
      description: "30-minute cycling session in the morning",
      points: 30,
      streak: 0,
      completedToday: false,
      completedDates: [],
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    points: "20",
  })

  useEffect(() => {
    const saved = localStorage.getItem("focusforge-habits")
    if (saved) {
      const loadedHabits = JSON.parse(saved)
      // Check if today's completion status needs to be reset
      const today = new Date().toDateString()
      const updatedHabits = loadedHabits.map((habit: Habit) => {
        const lastCompleted = habit.completedDates[habit.completedDates.length - 1]
        const completedToday = lastCompleted === today
        return { ...habit, completedToday }
      })
      setHabits(updatedHabits)
    }
  }, [])

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits)
    localStorage.setItem("focusforge-habits", JSON.stringify(newHabits))
  }

  const toggleHabit = (habitId: string) => {
    const today = new Date().toDateString()
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        if (habit.completedToday) {
          // Uncomplete habit
          return {
            ...habit,
            completedToday: false,
            completedDates: habit.completedDates.filter((date) => date !== today),
            streak: Math.max(0, habit.streak - 1),
          }
        } else {
          // Complete habit
          onPointsEarned(habit.points)
          return {
            ...habit,
            completedToday: true,
            completedDates: [...habit.completedDates, today],
            streak: habit.streak + 1,
          }
        }
      }
      return habit
    })
    saveHabits(updatedHabits)
  }

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      points: Number.parseInt(formData.points),
      streak: 0,
      completedToday: false,
      completedDates: [],
    }

    saveHabits([...habits, newHabit])
    setFormData({ name: "", description: "", points: "20" })
    setShowForm(false)
  }

  const deleteHabit = (habitId: string) => {
    saveHabits(habits.filter((habit) => habit.id !== habitId))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Daily Habits</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Habit
        </button>
      </div>

      {showForm && (
        <form onSubmit={addHabit} className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Habit Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Evening workout"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="30-minute workout session"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Points per completion</label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="20"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Add Habit
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

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No habits added yet</p>
            <p className="text-sm mt-1">Create habits to build consistency!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`p-1 rounded-full transition-colors ${
                      habit.completedToday ? "text-green-500 hover:text-green-400" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {habit.completedToday ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <div>
                    <h4
                      className={`font-medium ${habit.completedToday ? "text-green-400 line-through" : "text-white"}`}
                    >
                      {habit.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{habit.description}</p>
                  </div>
                </div>
                <button onClick={() => deleteHabit(habit.id)} className="text-red-400 hover:text-red-300 text-sm">
                  Delete
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-4 h-4" />
                    <span>{habit.streak} day streak</span>
                  </div>
                  <div className="text-gray-400">+{habit.points} points</div>
                </div>
                <div className="text-gray-400">{habit.completedDates.length} times completed</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
