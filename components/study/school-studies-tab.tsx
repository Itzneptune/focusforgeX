"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Square, BookOpen, Clock, Trophy, BarChart3, Calculator, Globe, DollarSign } from "lucide-react"

interface SchoolStudiesTabProps {
  onPointsEarned: (points: number) => void
  onHoursUpdated: (hours: number) => void
}

type Subject = "Business Studies" | "Economics" | "Accountancy" | "Mathematics" | "English"

interface StudySession {
  id: string
  subject: Subject
  duration: number
  date: string
  points: number
}

export function SchoolStudiesTab({ onPointsEarned, onHoursUpdated }: SchoolStudiesTabProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0) // in seconds
  const [selectedSubject, setSelectedSubject] = useState<Subject>("Business Studies")
  const [sessions, setSessions] = useState<StudySession[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const subjects: { name: Subject; icon: any; color: string; bgColor: string }[] = [
    { name: "Business Studies", icon: BookOpen, color: "text-blue-400", bgColor: "bg-blue-500" },
    { name: "Economics", icon: BarChart3, color: "text-green-400", bgColor: "bg-green-500" },
    { name: "Accountancy", icon: DollarSign, color: "text-yellow-400", bgColor: "bg-yellow-500" },
    { name: "Mathematics", icon: Calculator, color: "text-purple-400", bgColor: "bg-purple-500" },
    { name: "English", icon: Globe, color: "text-pink-400", bgColor: "bg-pink-500" },
  ]

  useEffect(() => {
    const savedSessions = localStorage.getItem("focusforge-school-sessions")
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
      const points = minutes * 3 // 3 points per minute
      const hours = time / 3600

      const newSession: StudySession = {
        id: Date.now().toString(),
        subject: selectedSubject,
        duration: time,
        date: new Date().toISOString(),
        points,
      }

      const updatedSessions = [newSession, ...sessions]
      setSessions(updatedSessions)
      localStorage.setItem("focusforge-school-sessions", JSON.stringify(updatedSessions))

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

  const getSubjectTime = (subject: Subject) => {
    return sessions.filter((s) => s.subject === subject).reduce((sum, s) => sum + s.duration, 0)
  }

  const getCurrentSubjectConfig = () => {
    return subjects.find((s) => s.name === selectedSubject) || subjects[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">School Studies</h3>
        <div className="text-sm text-gray-400">All School Subjects</div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
        {subjects
          .map((subject) => ({
            ...subject,
            time: getSubjectTime(subject.name),
          }))
          .sort((a, b) => b.time - a.time)
          .slice(0, 3)
          .map((subject) => {
            const Icon = subject.icon
            return (
              <div key={subject.name} className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <Icon className={`w-5 h-5 ${subject.color} mx-auto mb-1`} />
                <div className="text-lg font-bold text-white">{Math.floor(subject.time / 60)}m</div>
                <div className="text-xs text-gray-400">{subject.name}</div>
              </div>
            )
          })}
      </div>

      {/* Timer Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="text-center space-y-4">
          {/* Subject Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <button
                  key={subject.name}
                  onClick={() => setSelectedSubject(subject.name)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                    selectedSubject === subject.name
                      ? `${subject.bgColor} text-white shadow-lg`
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                  disabled={isRunning}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{subject.name}</span>
                </button>
              )
            })}
          </div>

          {/* Timer Display */}
          <div className="text-6xl font-mono font-bold text-white mb-4">{formatTime(time)}</div>

          {/* Current Subject */}
          <div className="text-lg text-gray-300 mb-6">
            Studying: <span className="text-red-400 font-semibold">{selectedSubject}</span>
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
              <span className="text-red-400 font-semibold">{Math.floor(time / 60) * 3} points</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Recent Study Sessions</h4>
          <div className="space-y-2">
            {sessions.slice(0, 10).map((session) => {
              const subjectConfig = subjects.find((s) => s.name === session.subject)
              const Icon = subjectConfig?.icon || BookOpen
              return (
                <div key={session.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${subjectConfig?.bgColor || "bg-gray-600"}`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{session.subject}</div>
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
    </div>
  )
}
