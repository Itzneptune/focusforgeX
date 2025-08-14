"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, DollarSign, BookOpen, AlertCircle, Clock } from "lucide-react"

interface AccountancyTabProps {
  onPointsEarned: (points: number) => void
}

interface Topic {
  id: string
  name: string
  chapter: string
  completed: boolean
  practiceProblems: number
  mistakeCount: number
  lastStudied?: string
}

interface StudySession {
  id: string
  topic: string
  duration: number
  type: "theory" | "practice" | "revision"
  problemsSolved: number
  mistakes: number
  date: string
  notes?: string
}

export function AccountancyTab({ onPointsEarned }: AccountancyTabProps) {
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: "1",
      name: "Introduction to Accounting",
      chapter: "Accounting Fundamentals",
      completed: false,
      practiceProblems: 0,
      mistakeCount: 0,
    },
    {
      id: "2",
      name: "Theory Base of Accounting",
      chapter: "Accounting Fundamentals",
      completed: false,
      practiceProblems: 0,
      mistakeCount: 0,
    },
    {
      id: "3",
      name: "Recording of Transactions I",
      chapter: "Recording Transactions",
      completed: false,
      practiceProblems: 0,
      mistakeCount: 0,
    },
    {
      id: "4",
      name: "Recording of Transactions II",
      chapter: "Recording Transactions",
      completed: false,
      practiceProblems: 0,
      mistakeCount: 0,
    },
    {
      id: "5",
      name: "Bank Reconciliation Statement",
      chapter: "Bank Reconciliation",
      completed: false,
      practiceProblems: 0,
      mistakeCount: 0,
    },
    {
      id: "6",
      name: "Trial Balance and Rectification of Errors",
      chapter: "Trial Balance",
      completed: false,
      practiceProblems: 0,
      mistakeCount: 0,
    },
  ])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    topic: "",
    duration: "",
    type: "theory" as "theory" | "practice" | "revision",
    problemsSolved: "",
    mistakes: "",
    notes: "",
  })

  useEffect(() => {
    const savedTopics = localStorage.getItem("focusforge-accountancy-topics")
    const savedSessions = localStorage.getItem("focusforge-accountancy-sessions")

    if (savedTopics) {
      setTopics(JSON.parse(savedTopics))
    }
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  const saveData = (newTopics: Topic[], newSessions: StudySession[]) => {
    setTopics(newTopics)
    setSessions(newSessions)
    localStorage.setItem("focusforge-accountancy-topics", JSON.stringify(newTopics))
    localStorage.setItem("focusforge-accountancy-sessions", JSON.stringify(newSessions))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const duration = Number.parseInt(formData.duration)
    const problemsSolved = Number.parseInt(formData.problemsSolved) || 0
    const mistakes = Number.parseInt(formData.mistakes) || 0

    if (!formData.topic || !duration) return

    let points = 0
    if (formData.type === "theory") points = duration * 2
    else if (formData.type === "practice")
      points = problemsSolved * 5 - mistakes * 2 // 5 points per problem, -2 for mistakes
    else if (formData.type === "revision") points = duration * 3

    const newSession: StudySession = {
      id: Date.now().toString(),
      topic: formData.topic,
      duration,
      type: formData.type,
      problemsSolved,
      mistakes,
      date: new Date().toISOString(),
      notes: formData.notes,
    }

    const updatedTopics = topics.map((topic) => {
      if (topic.name === formData.topic) {
        return {
          ...topic,
          lastStudied: new Date().toISOString(),
          practiceProblems: topic.practiceProblems + problemsSolved,
          mistakeCount: topic.mistakeCount + mistakes,
          completed: topic.practiceProblems + problemsSolved >= 10, // Mark as completed after 10 problems
        }
      }
      return topic
    })

    saveData(updatedTopics, [newSession, ...sessions])
    onPointsEarned(Math.max(points, 0)) // Ensure points are not negative
    setFormData({ topic: "", duration: "", type: "theory", problemsSolved: "", mistakes: "", notes: "" })
    setShowForm(false)
  }

  const groupedTopics = topics.reduce(
    (acc, topic) => {
      if (!acc[topic.chapter]) {
        acc[topic.chapter] = []
      }
      acc[topic.chapter].push(topic)
      return acc
    },
    {} as Record<string, Topic[]>,
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Accountancy</h3>
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
          <div className="text-lg font-bold text-white">{topics.filter((t) => t.completed).length}</div>
          <div className="text-xs text-gray-400">Completed Topics</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{topics.reduce((sum, t) => sum + t.practiceProblems, 0)}</div>
          <div className="text-xs text-gray-400">Problems Solved</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{topics.reduce((sum, t) => sum + t.mistakeCount, 0)}</div>
          <div className="text-xs text-gray-400">Total Mistakes</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {topics.reduce((sum, t) => sum + t.practiceProblems, 0) > 0
              ? Math.round(
                  ((topics.reduce((sum, t) => sum + t.practiceProblems, 0) -
                    topics.reduce((sum, t) => sum + t.mistakeCount, 0)) /
                    topics.reduce((sum, t) => sum + t.practiceProblems, 0)) *
                    100,
                )
              : 0}
            %
          </div>
          <div className="text-xs text-gray-400">Accuracy Rate</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                required
              >
                <option value="">Select Topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.name}>
                    {topic.name}
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
                placeholder="45"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Session Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "theory" | "practice" | "revision" })
                }
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="theory">Theory</option>
                <option value="practice">Practice</option>
                <option value="revision">Revision</option>
              </select>
            </div>
            {formData.type === "practice" && (
              <>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Problems Solved</label>
                  <input
                    type="number"
                    value={formData.problemsSolved}
                    onChange={(e) => setFormData({ ...formData, problemsSolved: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Mistakes</label>
                  <input
                    type="number"
                    value={formData.mistakes}
                    onChange={(e) => setFormData({ ...formData, mistakes: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                    placeholder="1"
                  />
                </div>
              </>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Practiced journal entries for cash transactions"
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

      {/* Topics by Chapter */}
      <div className="space-y-4">
        {Object.entries(groupedTopics).map(([chapter, chapterTopics]) => (
          <div key={chapter} className="space-y-3">
            <h4 className="text-white font-medium">{chapter}</h4>
            {chapterTopics.map((topic) => (
              <div key={topic.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <DollarSign className={`w-4 h-4 ${topic.completed ? "text-green-500" : "text-blue-500"}`} />
                    <div>
                      <h5 className={`font-medium ${topic.completed ? "text-green-400" : "text-white"}`}>
                        {topic.name}
                      </h5>
                      {topic.lastStudied && (
                        <p className="text-gray-400 text-sm">
                          Last studied: {new Date(topic.lastStudied).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-white">{topic.practiceProblems} problems</div>
                    {topic.mistakeCount > 0 && (
                      <div className="flex items-center gap-1 text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        {topic.mistakeCount} mistakes
                      </div>
                    )}
                  </div>
                </div>
                {topic.practiceProblems > 0 && (
                  <div className="text-xs text-gray-400">
                    Accuracy:{" "}
                    {Math.round(((topic.practiceProblems - topic.mistakeCount) / topic.practiceProblems) * 100)}%
                  </div>
                )}
              </div>
            ))}
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
                      session.type === "theory"
                        ? "bg-blue-500/20 text-blue-400"
                        : session.type === "practice"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
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
                  {session.problemsSolved > 0 && (
                    <div className="text-green-400">{session.problemsSolved} problems</div>
                  )}
                  {session.mistakes > 0 && (
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      {session.mistakes} mistakes
                    </div>
                  )}
                </div>
                <div className="text-red-500">
                  +
                  {session.type === "theory"
                    ? session.duration * 2
                    : session.type === "practice"
                      ? Math.max(session.problemsSolved * 5 - session.mistakes * 2, 0)
                      : session.duration * 3}{" "}
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
