"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Building, BookOpen, CheckCircle, Clock } from "lucide-react"

interface BusinessStudiesTabProps {
  onPointsEarned: (points: number) => void
}

interface Chapter {
  id: string
  name: string
  completed: boolean
  currentTopic?: string
  progress: number
  lastStudied?: string
}

interface StudySession {
  id: string
  chapter: string
  topic: string
  duration: number
  type: "reading" | "notes" | "revision" | "assignment"
  date: string
  notes?: string
}

export function BusinessStudiesTab({ onPointsEarned }: BusinessStudiesTabProps) {
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: "1",
      name: "Business Services: Insurance",
      completed: false,
      currentTopic: "Types of Insurance",
      progress: 25,
    },
    { id: "2", name: "Social Responsibilities of Business", completed: false, progress: 0 },
    { id: "3", name: "Business Ethics", completed: false, progress: 0 },
    { id: "4", name: "Sources of Business Finance", completed: false, progress: 0 },
    { id: "5", name: "Small Business", completed: false, progress: 0 },
    { id: "6", name: "Internal Trade", completed: false, progress: 0 },
  ])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    chapter: "Business Services: Insurance",
    topic: "",
    duration: "",
    type: "reading" as "reading" | "notes" | "revision" | "assignment",
    notes: "",
  })

  useEffect(() => {
    const savedChapters = localStorage.getItem("focusforge-business-chapters")
    const savedSessions = localStorage.getItem("focusforge-business-sessions")

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
    localStorage.setItem("focusforge-business-chapters", JSON.stringify(newChapters))
    localStorage.setItem("focusforge-business-sessions", JSON.stringify(newSessions))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const duration = Number.parseInt(formData.duration)

    if (!formData.chapter || !formData.topic || !duration) return

    let points = 0
    if (formData.type === "reading") points = duration * 2
    else if (formData.type === "notes") points = duration * 3
    else if (formData.type === "revision") points = duration * 4
    else if (formData.type === "assignment") points = duration * 5

    const newSession: StudySession = {
      id: Date.now().toString(),
      chapter: formData.chapter,
      topic: formData.topic,
      duration,
      type: formData.type,
      date: new Date().toISOString(),
      notes: formData.notes,
    }

    const updatedChapters = chapters.map((chapter) => {
      if (chapter.name === formData.chapter) {
        return {
          ...chapter,
          currentTopic: formData.topic,
          lastStudied: new Date().toISOString(),
          progress: Math.min(chapter.progress + 10, 100), // Increase progress by 10%
          completed: chapter.progress + 10 >= 100,
        }
      }
      return chapter
    })

    saveData(updatedChapters, [newSession, ...sessions])
    onPointsEarned(points)
    setFormData({ ...formData, topic: "", duration: "", notes: "" })
    setShowForm(false)
  }

  const businessTopics = {
    "Business Services: Insurance": [
      "Introduction to Business Services",
      "Types of Insurance",
      "Life Insurance",
      "General Insurance",
      "Insurance Principles",
      "Insurance Documents",
    ],
    "Social Responsibilities of Business": [
      "Concept of Social Responsibility",
      "Responsibility towards Stakeholders",
      "Environmental Protection",
      "Corporate Social Responsibility",
    ],
    "Business Ethics": ["Meaning of Business Ethics", "Elements of Business Ethics", "Benefits of Ethics"],
    "Sources of Business Finance": [
      "Meaning of Business Finance",
      "Classification of Sources",
      "Internal Sources",
      "External Sources",
    ],
    "Small Business": ["Meaning of Small Business", "Role of Small Business", "Problems of Small Business"],
    "Internal Trade": ["Meaning of Internal Trade", "Types of Internal Trade", "Services of Wholesalers"],
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Business Studies</h3>
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
          <div className="text-lg font-bold text-white">
            {Math.round(chapters.reduce((sum, c) => sum + c.progress, 0) / chapters.length)}%
          </div>
          <div className="text-xs text-gray-400">Overall Progress</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{sessions.reduce((sum, s) => sum + s.duration, 0)}m</div>
          <div className="text-xs text-gray-400">Total Study Time</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{sessions.length}</div>
          <div className="text-xs text-gray-400">Study Sessions</div>
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
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.name}>
                    {chapter.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                required
              >
                <option value="">Select Topic</option>
                {businessTopics[formData.chapter as keyof typeof businessTopics]?.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="45"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Session Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "reading" | "notes" | "revision" | "assignment" })
                }
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="reading">Reading</option>
                <option value="notes">Making Notes</option>
                <option value="revision">Revision</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Covered insurance principles and types"
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

      {/* Chapters Progress */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Chapter Progress</h4>
        {chapters.map((chapter) => (
          <div key={chapter.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {chapter.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Building className="w-5 h-5 text-blue-500" />
                )}
                <div>
                  <h5 className={`font-medium ${chapter.completed ? "text-green-400" : "text-white"}`}>
                    {chapter.name}
                  </h5>
                  {chapter.currentTopic && <p className="text-gray-400 text-sm">Current: {chapter.currentTopic}</p>}
                  {chapter.lastStudied && (
                    <p className="text-gray-400 text-sm">
                      Last studied: {new Date(chapter.lastStudied).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{chapter.progress}%</div>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${chapter.progress}%` }}
              />
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
                  <span className="text-white font-medium">{session.topic}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      session.type === "reading"
                        ? "bg-blue-500/20 text-blue-400"
                        : session.type === "notes"
                          ? "bg-green-500/20 text-green-400"
                          : session.type === "revision"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-purple-500/20 text-purple-400"
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
                  <div className="text-gray-400">{session.chapter}</div>
                </div>
                <div className="text-red-500">
                  +
                  {session.type === "reading"
                    ? session.duration * 2
                    : session.type === "notes"
                      ? session.duration * 3
                      : session.type === "revision"
                        ? session.duration * 4
                        : session.duration * 5}{" "}
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
