"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock, Plus, CheckCircle, Flame } from "lucide-react"
import { logFitnessSessionAction } from "@/lib/actions"
import type { User } from "@/lib/database"

interface FitnessTrackerProps {
  user: User
}

const fitnessActivities = [
  "Running",
  "Cycling",
  "Swimming",
  "Weight Training",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Basketball",
  "Football",
  "Tennis",
  "Hiking",
  "Dancing",
  "Boxing",
  "Martial Arts",
  "Calisthenics",
  "Other",
]

export default function FitnessTracker({ user }: FitnessTrackerProps) {
  const [isLogging, setIsLogging] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [activityType, setActivityType] = useState("")
  const [duration, setDuration] = useState("")
  const [calories, setCalories] = useState("")
  const [notes, setNotes] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityType || !duration) return

    setIsLogging(true)
    try {
      const result = await logFitnessSessionAction(
        user.id,
        activityType,
        Number.parseInt(duration),
        calories ? Number.parseInt(calories) : undefined,
        notes || undefined,
      )

      if (result.success) {
        setSuccess(true)
        setActivityType("")
        setDuration("")
        setCalories("")
        setNotes("")
        setShowForm(false)

        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Failed to log fitness session:", error)
    } finally {
      setIsLogging(false)
    }
  }

  const pointsForSession =
    duration && calories
      ? Math.floor(Number.parseInt(duration) * 2 + Number.parseInt(calories) * 0.1)
      : duration
        ? Number.parseInt(duration) * 2
        : 0

  return (
    <div className="space-y-4">
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg text-sm animate-slide-up flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>Fitness session logged successfully! +{pointsForSession} points earned.</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-5 w-5 text-orange-500" />
              <span>Fitness Tracker</span>
            </div>
            <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Log Workout
            </Button>
          </CardTitle>
          <CardDescription>Track your workouts and earn points for staying active</CardDescription>
        </CardHeader>

        {showForm && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Activity</label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {fitnessActivities.map((activity) => (
                        <SelectItem key={activity} value={activity}>
                          {activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Calories Burned (optional)</label>
                <Input
                  type="number"
                  placeholder="200"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  min="1"
                  max="2000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Notes (optional)</label>
                <Textarea
                  placeholder="How did the workout feel? Any personal records?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {duration && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>You'll earn {pointsForSession} points for this session</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={isLogging || !activityType || !duration}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isLogging ? "Logging..." : "Log Workout"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}

        <CardContent className={showForm ? "border-t" : ""}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Quick Stats</h4>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                {user.fitness_points} Fitness Points
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <p className="text-2xl font-bold text-orange-400">{Math.floor(user.fitness_points / 2)}</p>
                <p className="text-sm text-muted-foreground">Minutes Active</p>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-center space-x-1">
                  <Flame className="h-5 w-5 text-red-400" />
                  <p className="text-2xl font-bold text-red-400">{user.current_streak}</p>
                </div>
                <p className="text-sm text-muted-foreground">Active Streak</p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Stay consistent with your workouts to dominate the leaderboard!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
