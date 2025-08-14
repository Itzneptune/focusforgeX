"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Square, Brain, Bot, Database, Zap, BarChart3, Clock, Trophy } from "lucide-react"

interface AIMLTabProps {
  onPointsEarned: (points: number) => void
  onHoursUpdated: (hours: number) => void
}

type AIMLTopic = "Machine Learning" | "Deep Learning" | "Data Science" | "AI Ethics" | "Computer Vision" | "NLP"

interface StudySession {
  id: string
  topic: AIMLTopic
  duration: number
  date: string
  points: number
}

export function AIMLTab({ onPointsEarned, onHoursUpdated }: AIMLTabProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0) // in seconds
  const [selectedTopic, setSelectedTopic] = useState<AIMLTopic>("Machine Learning")
  const [sessions, setSessions] = useState<StudySession[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const topics: { name: AIMLTopic; icon: any; color: string; bgColor: string }[] = [
    { name: "Machine Learning", icon: Brain, color: "text-blue-400", bgColor: "bg-blue-500" },
    { name: "Deep Learning", icon: Bot, color: "text-purple-400", bgColor: "bg-purple-500" },
    { name: "Data Science", icon: Database, color: "text-green-400", bgColor: "bg-green-500" },
    { name: "AI Ethics", icon: Zap, color: "text-yellow-400", bgColor: "bg-yellow-500" },
    { name: "Computer Vision", icon: BarChart3, color: "text-pink-400", bgColor: "bg-pink-500" },
    { name: "NLP", icon: Brain, color: "text-cyan-400", bgColor: "bg-cyan-500" },
  ]

  useEffect(() => {
    const savedSessions = localStorage.getItem("focusforge-aiml-sessions")
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
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
      const points = minutes * 4 // 4 points per minute for AI/ML (higher value due to complexity)
      const hours = time / 3600

      const newSession: StudySession = {
        id: Date.now().toString(),
        topic: selectedTopic,
        duration: time,
        date: new Date().toISOString(),
        points,
      }

      const updatedSessions = [newSession, ...sessions]
      setSessions(updatedSessions)
      localStorage.setItem("focusforge-aiml-sessions", JSON.stringify(updatedSessions))

      onPointsEarned(points)
      onHoursUpdated(hours)
    }

    setIsRunning(false)
    setTime(0)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(0)
  }

  const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0)
  const totalPoints = sessions.reduce((sum, session) => sum + session.points, 0)

  const getTopicTime = (topic: AIMLTopic) => {
    return sessions.filter((s) => s.topic === topic).reduce((sum, s) => sum + s.duration, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">AI & Machine Learning</h3>
        <div className="text-sm text-gray-400">Advanced AI Studies</div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {Math.floor(totalStudyTime / 3600)}h {Math.floor((totalStudyTime % 3600) / 60)}m
          </div>
          <div className="text-xs text-gray-400">Total Time</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <Trophy className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{totalPoints}</div>
          <div className="text-xs text-gray-400">Total Points</div>
        </div>
        {topics
          .map((topic) => ({
            ...topic,
            time: getTopicTime(topic.name),
          }))
          .sort((a, b) => b.time - a.time)
          .slice(0, 2)
          .map((topic) => {
            const Icon = topic.icon
            return (
              <div key={topic.name} className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <Icon className={`w-5 h-5 ${topic.color} mx-auto mb-1`} />
                <div className="text-lg font-bold text-white">{Math.floor(topic.time / 60)}m</div>
                <div className="text-xs text-gray-400">{topic.name}</div>
              </div>
            )
          })}
      </div>

      {/* Timer Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="text-center space-y-4">
          {/* Topic Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
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
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium text-center leading-tight">{topic.name}</span>
                </button>
              )
            })}
          </div>

          {/* Timer Display */}
          <div className="text-6xl font-mono font-bold text-white mb-4">{formatTime(time)}</div>

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
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
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
              <span className="text-red-400 font-semibold">{Math.floor(time / 60) * 4} points</span>
              <div className="text-xs text-gray-500 mt-1">4 points per minute (Advanced AI Studies)</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Recent AI/ML Study Sessions</h4>
          <div className="space-y-2">
            {sessions.slice(0, 8).map((session) => {
              const topicConfig = topics.find((t) => t.name === session.topic)
              const Icon = topicConfig?.icon || Brain
              return (
                <div key={session.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${topicConfig?.bgColor || "bg-gray-600"}`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{session.topic}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(session.date).toLocaleDateString()} • {formatTime(session.duration)}
                        </div>
                      </div>
                    </div>
                    <div className="text-red-400 font-semibold">+{session.points} pts</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Learning Resources Hint */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">AI/ML Study Tips</h4>
        <div className="text-sm text-gray-400 space-y-1">
          <p>• Focus on hands-on projects and practical implementations</p>
          <p>• Practice with real datasets and coding exercises</p>
          <p>• Stay updated with latest research papers and trends</p>
          <p>• Build a portfolio of AI/ML projects to showcase your skills</p>
        </div>
      </div>
    </div>
  )
}
