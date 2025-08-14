"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Monitor, Clock } from "lucide-react"

interface MSOfficeTabProps {
  onPointsEarned: (points: number) => void
}

interface Skill {
  id: string
  name: string
  application: "word" | "excel" | "powerpoint" | "outlook" | "access"
  level: "beginner" | "intermediate" | "advanced"
  progress: number
  practiceTime: number
}

interface StudySession {
  id: string
  application: "word" | "excel" | "powerpoint" | "outlook" | "access"
  skill: string
  duration: number
  type: "lesson" | "practice" | "project"
  date: string
  notes?: string
}

export function MSOfficeTab({ onPointsEarned }: MSOfficeTabProps) {
  const [skills, setSkills] = useState<Skill[]>([
    // Word
    { id: "1", name: "Document Formatting", application: "word", level: "beginner", progress: 0, practiceTime: 0 },
    { id: "2", name: "Tables and Lists", application: "word", level: "beginner", progress: 0, practiceTime: 0 },
    { id: "3", name: "Mail Merge", application: "word", level: "intermediate", progress: 0, practiceTime: 0 },
    // Excel
    { id: "4", name: "Basic Formulas", application: "excel", level: "beginner", progress: 0, practiceTime: 0 },
    { id: "5", name: "Charts and Graphs", application: "excel", level: "intermediate", progress: 0, practiceTime: 0 },
    { id: "6", name: "Pivot Tables", application: "excel", level: "advanced", progress: 0, practiceTime: 0 },
    // PowerPoint
    { id: "7", name: "Slide Design", application: "powerpoint", level: "beginner", progress: 0, practiceTime: 0 },
    { id: "8", name: "Animations", application: "powerpoint", level: "intermediate", progress: 0, practiceTime: 0 },
    // Outlook
    { id: "9", name: "Email Management", application: "outlook", level: "beginner", progress: 0, practiceTime: 0 },
    {
      id: "10",
      name: "Calendar Scheduling",
      application: "outlook",
      level: "intermediate",
      progress: 0,
      practiceTime: 0,
    },
  ])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    application: "word" as "word" | "excel" | "powerpoint" | "outlook" | "access",
    skill: "",
    duration: "",
    type: "lesson" as "lesson" | "practice" | "project",
    notes: "",
  })

  useEffect(() => {
    const savedSkills = localStorage.getItem("focusforge-msoffice-skills")
    const savedSessions = localStorage.getItem("focusforge-msoffice-sessions")

    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    }
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  const saveData = (newSkills: Skill[], newSessions: StudySession[]) => {
    setSkills(newSkills)
    setSessions(newSessions)
    localStorage.setItem("focusforge-msoffice-skills", JSON.stringify(newSkills))
    localStorage.setItem("focusforge-msoffice-sessions", JSON.stringify(newSessions))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const duration = Number.parseInt(formData.duration)

    if (!formData.skill || !duration) return

    let points = 0
    if (formData.type === "lesson") points = duration * 2
    else if (formData.type === "practice") points = duration * 3
    else if (formData.type === "project") points = duration * 4

    const newSession: StudySession = {
      id: Date.now().toString(),
      application: formData.application,
      skill: formData.skill,
      duration,
      type: formData.type,
      date: new Date().toISOString(),
      notes: formData.notes,
    }

    const updatedSkills = skills.map((skill) => {
      if (skill.name === formData.skill) {
        const newPracticeTime = skill.practiceTime + duration
        const progressIncrease = formData.type === "project" ? 15 : formData.type === "practice" ? 10 : 5
        return {
          ...skill,
          practiceTime: newPracticeTime,
          progress: Math.min(skill.progress + progressIncrease, 100),
        }
      }
      return skill
    })

    saveData(updatedSkills, [newSession, ...sessions])
    onPointsEarned(points)
    setFormData({ application: "word", skill: "", duration: "", type: "lesson", notes: "" })
    setShowForm(false)
  }

  const getSkillsByApplication = (app: string) => skills.filter((skill) => skill.application === app)

  const applicationColors = {
    word: "text-blue-500",
    excel: "text-green-500",
    powerpoint: "text-orange-500",
    outlook: "text-purple-500",
    access: "text-red-500",
  }

  const applicationNames = {
    word: "Word",
    excel: "Excel",
    powerpoint: "PowerPoint",
    outlook: "Outlook",
    access: "Access",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">MS Office Skills</h3>
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
          <div className="text-lg font-bold text-white">
            {Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length)}%
          </div>
          <div className="text-xs text-gray-400">Overall Progress</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{skills.filter((s) => s.progress >= 80).length}</div>
          <div className="text-xs text-gray-400">Skills Mastered</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {Math.round(skills.reduce((sum, s) => sum + s.practiceTime, 0) / 60)}h
          </div>
          <div className="text-xs text-gray-400">Total Practice Time</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{sessions.length}</div>
          <div className="text-xs text-gray-400">Practice Sessions</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Application</label>
              <select
                value={formData.application}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    application: e.target.value as "word" | "excel" | "powerpoint" | "outlook" | "access",
                    skill: "",
                  })
                }
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="word">Microsoft Word</option>
                <option value="excel">Microsoft Excel</option>
                <option value="powerpoint">Microsoft PowerPoint</option>
                <option value="outlook">Microsoft Outlook</option>
                <option value="access">Microsoft Access</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Skill</label>
              <select
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                required
              >
                <option value="">Select Skill</option>
                {getSkillsByApplication(formData.application).map((skill) => (
                  <option key={skill.id} value={skill.name}>
                    {skill.name} ({skill.level})
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
                placeholder="30"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Session Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "lesson" | "practice" | "project" })
                }
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="lesson">Lesson</option>
                <option value="practice">Practice</option>
                <option value="project">Project</option>
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
              placeholder="Practiced creating pivot tables with sales data"
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

      {/* Skills by Application */}
      <div className="space-y-4">
        {Object.entries(applicationNames).map(([app, name]) => {
          const appSkills = getSkillsByApplication(app)
          if (appSkills.length === 0) return null

          return (
            <div key={app} className="space-y-3">
              <h4 className={`font-medium ${applicationColors[app as keyof typeof applicationColors]}`}>
                Microsoft {name}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {appSkills.map((skill) => (
                  <div key={skill.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Monitor className={`w-4 h-4 ${applicationColors[skill.application]}`} />
                        <div>
                          <h5 className="text-white font-medium">{skill.name}</h5>
                          <p className="text-gray-400 text-sm capitalize">{skill.level} level</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-white font-semibold">{skill.progress}%</div>
                        <div className="text-gray-400">{Math.round(skill.practiceTime / 60)}h</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Recent Sessions</h4>
          {sessions.slice(0, 5).map((session) => (
            <div key={session.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className={`w-4 h-4 ${applicationColors[session.application]}`} />
                  <span className="text-white font-medium">{session.skill}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      session.type === "lesson"
                        ? "bg-blue-500/20 text-blue-400"
                        : session.type === "practice"
                          ? "bg-green-500/20 text-green-400"
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
                  <div className="text-gray-400 capitalize">
                    {applicationNames[session.application as keyof typeof applicationNames]}
                  </div>
                </div>
                <div className="text-red-500">
                  +
                  {session.type === "lesson"
                    ? session.duration * 2
                    : session.type === "practice"
                      ? session.duration * 3
                      : session.duration * 4}{" "}
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
