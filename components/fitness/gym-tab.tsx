"use client"

import { useState, useEffect } from "react"
import { Plus, Dumbbell, Trophy, Clock } from "lucide-react"

interface GymTabProps {
  onPointsEarned: (points: number) => void
}

interface Exercise {
  name: string
  sets: number
  reps: number
  weight: number
  restTime?: number
  isPR?: boolean
}

interface Workout {
  id: string
  date: string
  exercises: Exercise[]
  duration: number
  notes?: string
}

export function GymTab({ onPointsEarned }: GymTabProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentWorkout, setCurrentWorkout] = useState<Exercise[]>([])
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    restTime: "",
  })

  useEffect(() => {
    const saved = localStorage.getItem("focusforge-gym")
    if (saved) {
      setWorkouts(JSON.parse(saved))
    }
  }, [])

  const saveWorkouts = (newWorkouts: Workout[]) => {
    setWorkouts(newWorkouts)
    localStorage.setItem("focusforge-gym", JSON.stringify(newWorkouts))
  }

  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) return

    const exercise: Exercise = {
      name: newExercise.name,
      sets: Number.parseInt(newExercise.sets),
      reps: Number.parseInt(newExercise.reps),
      weight: Number.parseFloat(newExercise.weight) || 0,
      restTime: Number.parseInt(newExercise.restTime) || undefined,
    }

    setCurrentWorkout([...currentWorkout, exercise])
    setNewExercise({ name: "", sets: "", reps: "", weight: "", restTime: "" })
  }

  const saveWorkout = () => {
    if (currentWorkout.length === 0) return

    const points = currentWorkout.length * 20 // 20 points per exercise
    const workout: Workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: currentWorkout,
      duration: 60, // Default 60 minutes
    }

    saveWorkouts([workout, ...workouts])
    onPointsEarned(points)
    setCurrentWorkout([])
    setShowForm(false)
  }

  const commonExercises = [
    "Bench Press",
    "Squat",
    "Deadlift",
    "Pull-ups",
    "Push-ups",
    "Shoulder Press",
    "Bicep Curls",
    "Tricep Dips",
    "Lat Pulldown",
    "Rows",
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Gym Workouts</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Workout
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
          <h4 className="text-white font-medium">Current Workout</h4>

          {/* Add Exercise Form */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <input
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none text-sm"
                placeholder="Exercise name"
                list="exercises"
              />
              <datalist id="exercises">
                {commonExercises.map((exercise) => (
                  <option key={exercise} value={exercise} />
                ))}
              </datalist>
            </div>
            <input
              type="number"
              value={newExercise.sets}
              onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none text-sm"
              placeholder="Sets"
            />
            <input
              type="number"
              value={newExercise.reps}
              onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none text-sm"
              placeholder="Reps"
            />
            <input
              type="number"
              step="0.5"
              value={newExercise.weight}
              onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none text-sm"
              placeholder="Weight (kg)"
            />
            <button
              onClick={addExercise}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Add
            </button>
          </div>

          {/* Current Workout Exercises */}
          {currentWorkout.length > 0 && (
            <div className="space-y-2">
              {currentWorkout.map((exercise, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium">{exercise.name}</span>
                    <span className="text-gray-300 ml-2">
                      {exercise.sets} × {exercise.reps} @ {exercise.weight}kg
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentWorkout(currentWorkout.filter((_, i) => i !== index))}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveWorkout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Save Workout
                </button>
                <button
                  onClick={() => {
                    setCurrentWorkout([])
                    setShowForm(false)
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Workouts */}
      <div className="space-y-3">
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No workouts logged yet</p>
            <p className="text-sm mt-1">Start tracking your gym sessions!</p>
          </div>
        ) : (
          workouts.slice(0, 5).map((workout) => (
            <div key={workout.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-blue-500" />
                  <span className="text-white font-medium">Gym Workout</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(workout.date).toLocaleDateString()}</span>
              </div>
              <div className="space-y-1">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="text-sm text-gray-300 flex items-center justify-between">
                    <span>{exercise.name}</span>
                    <span>
                      {exercise.sets} × {exercise.reps} @ {exercise.weight}kg
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {workout.duration}min
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />+{workout.exercises.length * 20} points
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
