"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Plus, Trophy, Target, Play, Pause, Square, Clock, BookOpen, Calculator, Brain } from "lucide-react"

interface IPMATTabProps {
  onPointsEarned: (points: number) => void
  onHoursUpdated?: (hours: number) => void
}

type IPMATTopic =
  | "Quantitative Aptitude"
  | "Verbal Ability"
  | "Logical Reasoning"
  | "Data Interpretation"
  | "General Knowledge"

interface StudyPlan {
  id: string
  topic: string
  targetHours: number
  completedHours: number
  priority: "high" | "medium" | "low"
  deadline?: string
}

interface MockTest {
  id: string
  testName: string
  score: number
  totalMarks: number
  date: string
  timeSpent: number
  sections: {
    quantitative: number
    verbal: number
  }
}

interface StudySession {
  id: string
  topic: string
  duration: number
  type: "study" | "practice" | "mock_test" | "timer"
  date: string
  notes?: string
  points: number
}

export function IPMATTab({ onPointsEarned, onHoursUpdated }: IPMATTabProps) {
  // Timer states
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0) // in seconds
  const [selectedTopic, setSelectedTopic] = useState<IPMATTopic>("Quantitative Aptitude")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([
    { id: "1", topic: "Quantitative Aptitude", targetHours: 100, completedHours: 0, priority: "high" },
    { id: "2", topic: "Verbal Ability", targetHours: 80, completedHours: 0, priority: "high" },
    { id: "3", topic: "Logical Reasoning", targetHours: 60, completedHours: 0, priority: "medium" },
    { id: "4", topic: "Data Interpretation", targetHours: 40, completedHours: 0, priority: "medium" },
    { id: "5", topic: "General Knowledge", targetHours: 30, completedHours: 0, priority: "low" },
  ])
  const [mockTests, setMockTests] = useState<MockTest[]>([])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<"study" | "mock">("study")
  const [formData, setFormData] = useState({
    topic: "",
    duration: "",
    type: "study" as "study" | "practice" | "mock_test",
    notes: "",
    // Mock test specific
    testName: "",
    score: "",
    totalMarks: "",
    quantitativeScore: "",
    verbalScore: "",
  })

  const topics: { name: IPMATTopic; icon: any; color: string; bgColor: string }[] = [
    { name: "Quantitative Aptitude", icon: Calculator, color: "text-blue-400", bgColor: "bg-blue-500" },
    { name: "Verbal Ability", icon: BookOpen, color: "text-green-400", bgColor: "bg-green-500" },
    { name: "Logical Reasoning", icon: Brain, color: "text-purple-400", bgColor: "bg-purple-500" },
    { name: "Data Interpretation", icon: Trophy, color: "text-yellow-400", bgColor: "bg-yellow-500" },
    { name: "General Knowledge", icon: Target, color: "text-pink-400", bgColor: "bg-pink-500" },
  ]

  useEffect(() => {
    const savedPlan = localStorage.getItem("focusforge-ipmat-plan")
    const savedTests = localStorage.getItem("focusforge-ipmat-tests")
    const savedSessions = localStorage.getItem("focusforge-ipmat-sessions")

    if (savedPlan) setStudyPlan(JSON.parse(savedPlan))
    if (savedTests) setMockTests(JSON.parse(savedTests))
    if (savedSessions) setSessions(JSON.parse(savedSessions))
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const stopTimer = () => {
    if (time > 0) {
      const minutes = Math.floor(time / 60)
      const points = minutes * 3 // 3 points per minute for IPMAT study
      const hours = time / 3600

      const newSession: StudySession = {
        id: Date.now().toString(),
        topic: selectedTopic,
        duration: time,
        type: "timer",
        date: new Date().toISOString(),
        points,
      }

      const updatedPlan = studyPlan.map((plan) =>
        plan.topic === selectedTopic ? { ...plan, completedHours: plan.completedHours + hours } : plan,
      )

      const updatedSessions = [newSession, ...sessions]
      saveData(updatedPlan, mockTests, updatedSessions)
      onPointsEarned(points)
      if (onHoursUpdated) onHoursUpdated(hours)
    }

    setIsRunning(false)
    setTime(0)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(0)
  }

  const saveData = (newPlan: StudyPlan[], newTests: MockTest[], newSessions: StudySession[]) => {
    setStudyPlan(newPlan)
    setMockTests(newTests)
    setSessions(newSessions)
    localStorage.setItem("focusforge-ipmat-plan", JSON.stringify(newPlan))
    localStorage.setItem("focusforge-ipmat-tests", JSON.stringify(newTests))
    localStorage.setItem("focusforge-ipmat-sessions", JSON.stringify(newSessions))
  }

  const handleStudySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const duration = Number.parseInt(formData.duration)

    if (!formData.topic || !duration) return

    const points = duration * 3 // 3 points per minute for IPMAT study

    const newSession: StudySession = {
      id: Date.now().toString(),
      topic: formData.topic,
      duration: duration * 60, // Convert to seconds for consistency
      type: formData.type,
      date: new Date().toISOString(),
      notes: formData.notes,
      points,
    }

    const updatedPlan = studyPlan.map((plan) =>
      plan.topic === formData.topic ? { ...plan, completedHours: plan.completedHours + duration / 60 } : plan,
    )

    saveData(updatedPlan, mockTests, [newSession, ...sessions])
    onPointsEarned(points)
    setFormData({ ...formData, topic: "", duration: "", notes: "" })
    setShowForm(false)
  }

  const handleMockTestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const score = Number.parseInt(formData.score)
    const totalMarks = Number.parseInt(formData.totalMarks)
    const duration = Number.parseInt(formData.duration)

    if (!formData.testName || !score || !totalMarks || !duration) return

    const percentage = (score / totalMarks) * 100
    const points = Math.round(percentage * 2) // 2 points per percentage point

    const newMockTest: MockTest = {
      id: Date.now().toString(),
      testName: formData.testName,
      score,
      totalMarks,
      date: new Date().toISOString(),
      timeSpent: duration,
      sections: {
        quantitative: Number.parseInt(formData.quantitativeScore) || 0,
        verbal: Number.parseInt(formData.verbalScore) || 0,
      },
    }

    saveData(studyPlan, [newMockTest, ...mockTests], sessions)
    onPointsEarned(points)
    setFormData({
      ...formData,
      testName: "",
      score: "",
      totalMarks: "",
      duration: "",
      quantitativeScore: "",
      verbalScore: "",
    })
    setShowForm(false)
  }

  const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0)
  const totalPoints = sessions.reduce((sum, session) => sum + session.points, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">IPMAT Self-Study</h3>
        <div className="text-sm text-gray-400">Integrated Program in Management</div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {Math.floor(totalStudyTime / 3600)}h {Math.floor((totalStudyTime % 3600) / 60)}m
          </div>
          <div className="text-xs text-gray-400">Total Study Time</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{mockTests.length}</div>
          <div className="text-xs text-gray-400">Mock Tests Taken</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {mockTests.length > 0
              ? Math.round(
                  mockTests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0) / mockTests.length,
                )
              : 0}
            %
          </div>
          <div className="text-xs text-gray-400">Avg Mock Score</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {Math.round(
              (studyPlan.reduce((sum, p) => sum + p.completedHours, 0) /
                studyPlan.reduce((sum, p) => sum + p.targetHours, 0)) *
                100,
            )}
            %
          </div>
          <div className="text-xs text-gray-400">Overall Progress</div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="text-center space-y-4">
          <h4 className="text-white font-medium mb-4">Study Timer</h4>

          {/* Topic Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {topics.map((topic) => {
              const Icon = topic.icon
              return (
                <button
                  key={topic.name}
                  onClick={() => setSelectedTopic(topic.name)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                    selectedTopic === topic.name
                      ? `${topic.bgColor} text-white shadow-lg`
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                  disabled={isRunning}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium text-center leading-tight">{topic.name}</span>
                </button>
              )
            })}
          </div>

          {/* Timer Display */}
          <div className="text-5xl font-mono font-bold text-white mb-4">{formatTime(time)}</div>

          {/* Current Topic */}
          <div className="text-lg text-gray-300 mb-6">
            Studying: <span className="text-red-400 font-semibold">{selectedTopic}</span>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="w-5 h-5" />
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            )}

            <button
              onClick={stopTimer}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors border border-gray-600"
              disabled={time === 0}
            >
              <Square className="w-5 h-5" />
              Stop & Save
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors border border-gray-600"
              disabled={time === 0}
            >
              Reset
            </button>
          </div>

          {/* Points Preview */}
          {time > 0 && (
            <div className="text-sm text-gray-400 mt-4">
              Current session will earn:{" "}
              <span className="text-red-400 font-semibold">{Math.floor(time / 60) * 3} points</span>
            </div>
          )}
        </div>
      </div>

      {/* Manual Logging Options */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setFormType("study")
            setShowForm(!showForm)
          }}
          className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors border border-gray-700"
        >
          <Plus className="w-4 h-4" />
          Manual Log
        </button>
        <button
          onClick={() => {
            setFormType("mock")
            setShowForm(!showForm)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors border border-gray-700"
        >
          <Trophy className="w-4 h-4" />
          Mock Test
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          {formType === "study" ? (
            <form onSubmit={handleStudySubmit} className="space-y-4">
              <h4 className="text-white font-medium">Log Study Session</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Topic</option>
                    {studyPlan.map((plan) => (
                      <option key={plan.id} value={plan.topic}>
                        {plan.topic}
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
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
                    placeholder="90"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Session Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "study" | "practice" })}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
                >
                  <option value="study">Study</option>
                  <option value="practice">Practice</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
                  placeholder="Covered probability problems"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Save Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMockTestSubmit} className="space-y-4">
              <h4 className="text-white font-medium">Log Mock Test</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Test Name</label>
                  <input
                    type="text"
                    value={formData.testName}
                    onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
                    placeholder="IPMAT Mock Test 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
                    placeholder="120"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Score</label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
                    placeholder="85"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
                    placeholder="100"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Mock Test
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Study Plan Progress */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Study Plan Progress</h4>
        {studyPlan.map((plan) => (
          <div key={plan.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target
                  className={`w-4 h-4 ${
                    plan.priority === "high"
                      ? "text-red-400"
                      : plan.priority === "medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                />
                <span className="text-white font-medium">{plan.topic}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    plan.priority === "high"
                      ? "bg-red-500/20 text-red-400"
                      : plan.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {plan.priority}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {Math.round(plan.completedHours)}h / {plan.targetHours}h
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((plan.completedHours / plan.targetHours) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Mock Tests */}
      {mockTests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Recent Mock Tests</h4>
          {mockTests.slice(0, 3).map((test) => (
            <div key={test.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">{test.testName}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(test.date).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Score</div>
                  <div className="text-white font-semibold">
                    {test.score}/{test.totalMarks} ({Math.round((test.score / test.totalMarks) * 100)}%)
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Time</div>
                  <div className="text-white font-semibold">{test.timeSpent}m</div>
                </div>
                <div>
                  <div className="text-gray-400">Points Earned</div>
                  <div className="text-red-400 font-semibold">+{Math.round((test.score / test.totalMarks) * 200)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
