"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Plus, CheckCircle } from "lucide-react"
import { logStudySessionAction } from "@/lib/actions"
import type { User } from "@/lib/database"

interface StudyTrackerProps {
  user: User
}

const studySubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
  "Geography",
  "Economics",
  "Psychology",
  "Philosophy",
  "Art",
  "Music",
  "Language Learning",
  "Other",
]

export default function StudyTracker({ user }: StudyTrackerProps) {
  const [isLogging, setIsLogging] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !duration) return

    setIsLogging(true)
    try {
      const result = await logStudySessionAction(user.id, subject, Number.parseInt(duration), notes || undefined)

      if (result.success) {
        setSuccess(true)
        setSubject("")
        setDuration("")
        setNotes("")
        setShowForm(false)

        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Failed to log study session:", error)
    } finally {
      setIsLogging(false)
    }
  }

  const pointsForDuration = duration ? Number.parseInt(duration) * 3 : 0

  return (
    <div className="space-y-4">
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg text-sm animate-slide-up flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>Study session logged successfully! +{pointsForDuration} points earned.</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span>Study Tracker</span>
            </div>
            <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Log Session
            </Button>
          </CardTitle>
          <CardDescription>Track your study sessions and earn points for your dedication</CardDescription>
        </CardHeader>

        {showForm && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {studySubjects.map((subj) => (
                        <SelectItem key={subj} value={subj}>
                          {subj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
                  <Input
                    type="number"
                    placeholder="60"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="480"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Notes (optional)</label>
                <Textarea
                  placeholder="What did you study? Any key insights?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {duration && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>You'll earn {pointsForDuration} points for this session</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={isLogging || !subject || !duration}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLogging ? "Logging..." : "Log Study Session"}
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
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {user.study_points} Study Points
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-2xl font-bold text-blue-400">{Math.floor(user.study_points / 3)}</p>
                <p className="text-sm text-muted-foreground">Minutes Studied</p>
              </div>
              <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-2xl font-bold text-emerald-400">{user.current_streak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Keep studying to maintain your streak and climb the leaderboard!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
