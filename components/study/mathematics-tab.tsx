"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, BookOpen, CheckCircle, Clock, Trophy } from "lucide-react"

interface MathematicsTabProps {
  onPointsEarned: (points: number) => void
}

interface Chapter {
  id: string
  name: string
  completed: boolean
  revisionCount: number
  lastStudied?: string
  testScore?: number
}

interface StudySession {
  id: string
  chapter: string
  duration: number
  type: "study" | "revision" | "test"
  score?: number
  date: string
  notes?: string
}

export function MathematicsTab({ onPointsEarned }: MathematicsTabProps) {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", name: "Sets and Functions", completed: false, revisionCount: 0 },
    { id: "2", name: "Algebra", completed: false, revisionCount: 0 },
    { id: "3", name: "Coordinate Geometry", completed: false, revisionCount: 0 },
    { id: "4", name: "Calculus", completed: false, revisionCount: 0 },
    { id: "5", name: "Mathematical Reasoning", completed: false, revisionCount: 0 },
    { id: "6", name: "Statistics and Probability", completed: false, revisionCount: 0 },
  ])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    chapter: "",
    duration: "",
    type: "study" as "study" | "revision" | "test",
    score: "",
    notes: "",
  })

  useEffect(() => {
    const savedChapters = localStorage.getItem("focusforge-mathematics-chapters")
    const savedSessions = localStorage.getItem("focusforge-mathematics-sessions")

    if (savedChapters) {
      setChapters(JSON.parse(savedChapters))
    }
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  const saveData = (newChapters: Chapter[], newSessions: StudySession[]) => {
    setChapters(newChapters)
    setSessions(newSessions)
    localStorage.setItem("focusforge-mathematics-chapters", JSON.stringify(newChapters))
    localStorage.setItem("focusforge-mathematics-sessions", JSON.stringify(newSessions))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const duration = Number.parseInt(formData.duration)

    if (!formData.chapter || !duration) return

    let points = 0
    if (formData.type === "study")
      points = duration * 2 // 2 points per minute
    else if (formData.type === "revision")
      points = duration * 3 // 3 points per minute for revision
    else if (formData.type === "test") points = Number.parseInt(formData.score || "0") * 5 // 5 points per score point

    const newSession: StudySession = {
      id: Date.now().toString(),
      chapter: formData.chapter,
      duration,
      type: formData.type,
      score: formData.score ? Number.parseInt(formData.score) : undefined,
      date: new Date().toISOString(),
      notes: formData.notes,
    }

    const updatedChapters = chapters.map((chapter) => {
      if (chapter.name === formData.chapter) {
        const updates: Partial<Chapter> = {
          lastStudied: new Date().toISOString(),
        }
        if (formData.type === "revision") {
          updates.revisionCount = chapter.revisionCount + 1
        }
        if (formData.type === "test" && formData.score) {
          updates.testScore = Number.parseInt(formData.score)
          updates.completed = Number.parseInt(formData.score) >= 70 // Mark as completed if score >= 70%
        }
        return { ...chapter, ...updates }
      }
      return chapter
    })

    saveData(updatedChapters, [newSession, ...sessions])
    onPointsEarned(points)
    setFormData({ chapter: "", duration: "", type: "study", score: "", notes: "" })
    setShowForm(false)
  }

  const toggleChapterCompletion = (chapterId: string) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === chapterId ? { ...chapter, completed: !chapter.completed } : chapter,
    )
    saveData(updatedChapters, sessions)
    if (!chapters.find((c) => c.id === chapterId)?.completed) {
      onPointsEarned(50) // 50 points for completing a chapter
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Class 11 Applied Mathematics</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Session
        </button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{chapters.filter((c) => c.completed).length}</div>
          <div className="text-xs text-gray-400">Completed Chapters</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{chapters.reduce((sum, c) => sum + c.revisionCount, 0)}</div>
          <div className="text-xs text-gray-400">Total Revisions</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{sessions.reduce((sum, s) => sum + s.duration, 0)}m</div>
          <div className="text-xs text-gray-400">Total Study Time</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {Math.round((chapters.filter((c) => c.completed).length / chapters.length) * 100)}%
          </div>
          <div className="text-xs text-gray-400">Progress</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Chapter</label>
              <select
                value={formData.chapter}
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                required
              >
                <option value="">Select Chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.name}>
                    {chapter.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="60"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Session Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "study" | "revision" | "test" })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="study">Study</option>
                <option value="revision">Revision</option>
                <option value="test">Test</option>
              </select>
            </div>
            {formData.type === "test" && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Test Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                  placeholder="85"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Covered integration techniques"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Save Session
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

      {/* Chapters List */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Chapters</h4>
        {chapters.map((chapter) => (
          <div key={chapter.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleChapterCompletion(chapter.id)}
                  className={`p-1 rounded-full transition-colors ${
                    chapter.completed ? "text-green-500 hover:text-green-400" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {chapter.completed ? <CheckCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                </button>
                <div>
                  <h5 className={`font-medium ${chapter.completed ? "text-green-400 line-through" : "text-white"}`}>
                    {chapter.name}
                  </h5>
                  {chapter.lastStudied && (
                    <p className="text-gray-400 text-sm">
                      Last studied: {new Date(chapter.lastStudied).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right text-sm">
                {chapter.revisionCount > 0 && <div className="text-blue-400">{chapter.revisionCount} revisions</div>}
                {chapter.testScore && <div className="text-green-400">{chapter.testScore}% test score</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Recent Sessions</h4>
          {sessions.slice(0, 5).map((session) => (
            <div key={session.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-white font-medium">{session.chapter}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      session.type === "study"
                        ? "bg-blue-500/20 text-blue-400"
                        : session.type === "revision"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {session.type}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-300">
                    <Clock className="w-3 h-3" />
                    {session.duration}m
                  </div>
                  {session.score && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Trophy className="w-3 h-3" />
                      {session.score}%
                    </div>
                  )}
                </div>
                <div className="text-red-500">
                  +
                  {session.type === "test"
                    ? (session.score || 0) * 5
                    : session.duration * (session.type === "revision" ? 3 : 2)}{" "}
                  points
                </div>
              </div>
              {session.notes && <p className="text-gray-400 text-sm mt-2">{session.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
