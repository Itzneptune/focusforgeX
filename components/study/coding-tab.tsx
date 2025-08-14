"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Code, BookOpen, Gamepad2, Clock, Trophy } from "lucide-react"

interface CodingTabProps {
  onPointsEarned: (points: number) => void
}

interface Project {
  id: string
  name: string
  type: "web" | "game" | "mobile" | "desktop"
  progress: number
  technologies: string[]
  startDate: string
  lastWorked?: string
}

interface Lesson {
  id: string
  title: string
  category: "programming" | "game_dev" | "web_dev" | "mobile_dev"
  completed: boolean
  duration: number
  date?: string
}

interface CodingSession {
  id: string
  type: "lesson" | "project" | "practice"
  title: string
  duration: number
  linesOfCode?: number
  bugsFixed?: number
  date: string
  notes?: string
}

export function CodingTab({ onPointsEarned }: CodingTabProps) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Personal Portfolio Website",
      type: "web",
      progress: 30,
      technologies: ["HTML", "CSS", "JavaScript"],
      startDate: new Date().toISOString(),
    },
    {
      id: "2",
      name: "2D Platformer Game",
      type: "game",
      progress: 15,
      technologies: ["Unity", "C#"],
      startDate: new Date().toISOString(),
    },
  ])
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: "1", title: "JavaScript Fundamentals", category: "programming", completed: false, duration: 0 },
    { id: "2", title: "HTML & CSS Basics", category: "web_dev", completed: false, duration: 0 },
    { id: "3", title: "Unity Game Engine Intro", category: "game_dev", completed: false, duration: 0 },
    { id: "4", title: "React Components", category: "web_dev", completed: false, duration: 0 },
    { id: "5", title: "C# Programming", category: "programming", completed: false, duration: 0 },
  ])
  const [sessions, setSessions] = useState<CodingSession[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<"lesson" | "project">("lesson")
  const [formData, setFormData] = useState({
    type: "lesson" as "lesson" | "project" | "practice",
    title: "",
    duration: "",
    linesOfCode: "",
    bugsFixed: "",
    notes: "",
    // Project specific
    projectName: "",
    progressIncrease: "",
  })

  useEffect(() => {
    const savedProjects = localStorage.getItem("focusforge-coding-projects")
    const savedLessons = localStorage.getItem("focusforge-coding-lessons")
    const savedSessions = localStorage.getItem("focusforge-coding-sessions")

    if (savedProjects) setProjects(JSON.parse(savedProjects))
    if (savedLessons) setLessons(JSON.parse(savedLessons))
    if (savedSessions) setSessions(JSON.parse(savedSessions))
  }, [])

  const saveData = (newProjects: Project[], newLessons: Lesson[], newSessions: CodingSession[]) => {
    setProjects(newProjects)
    setLessons(newLessons)
    setSessions(newSessions)
    localStorage.setItem("focusforge-coding-projects", JSON.stringify(newProjects))
    localStorage.setItem("focusforge-coding-lessons", JSON.stringify(newLessons))
    localStorage.setItem("focusforge-coding-sessions", JSON.stringify(newSessions))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const duration = Number.parseInt(formData.duration)

    if (!duration) return

    let points = 0
    if (formData.type === "lesson")
      points = duration * 3 // 3 points per minute for lessons
    else if (formData.type === "project")
      points = duration * 4 + (Number.parseInt(formData.linesOfCode) || 0) * 0.5 // 4 points per minute + 0.5 per line of code
    else if (formData.type === "practice") points = duration * 2 + (Number.parseInt(formData.bugsFixed) || 0) * 10 // 2 points per minute + 10 per bug fixed

    const newSession: CodingSession = {
      id: Date.now().toString(),
      type: formData.type,
      title: formData.title,
      duration,
      linesOfCode: formData.linesOfCode ? Number.parseInt(formData.linesOfCode) : undefined,
      bugsFixed: formData.bugsFixed ? Number.parseInt(formData.bugsFixed) : undefined,
      date: new Date().toISOString(),
      notes: formData.notes,
    }

    let updatedProjects = projects
    let updatedLessons = lessons

    if (formData.type === "lesson") {
      updatedLessons = lessons.map((lesson) =>
        lesson.title === formData.title
          ? { ...lesson, completed: true, duration: lesson.duration + duration, date: new Date().toISOString() }
          : lesson,
      )
    } else if (formData.type === "project" && formData.projectName) {
      const progressIncrease = Number.parseInt(formData.progressIncrease) || 5
      updatedProjects = projects.map((project) =>
        project.name === formData.projectName
          ? {
              ...project,
              progress: Math.min(project.progress + progressIncrease, 100),
              lastWorked: new Date().toISOString(),
            }
          : project,
      )
    }

    saveData(updatedProjects, updatedLessons, [newSession, ...sessions])
    onPointsEarned(Math.round(points))
    setFormData({
      type: "lesson",
      title: "",
      duration: "",
      linesOfCode: "",
      bugsFixed: "",
      notes: "",
      projectName: "",
      progressIncrease: "",
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Coding & Game Development</h3>
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
          <div className="text-lg font-bold text-white">{lessons.filter((l) => l.completed).length}</div>
          <div className="text-xs text-gray-400">Lessons Completed</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{projects.length}</div>
          <div className="text-xs text-gray-400">Active Projects</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {sessions.reduce((sum, s) => sum + (s.linesOfCode || 0), 0)}
          </div>
          <div className="text-xs text-gray-400">Lines of Code</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{sessions.reduce((sum, s) => sum + s.duration, 0)}m</div>
          <div className="text-xs text-gray-400">Total Coding Time</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Session Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "lesson" | "project" | "practice" })
                }
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="lesson">Lesson</option>
                <option value="project">Project Work</option>
                <option value="practice">Practice/Debug</option>
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

          {formData.type === "lesson" && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Lesson</label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                required
              >
                <option value="">Select Lesson</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.title}>
                    {lesson.title} {lesson.completed ? "✓" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.type === "project" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Project</label>
                <select
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Progress Increase (%)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.progressIncrease}
                  onChange={(e) => setFormData({ ...formData, progressIncrease: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                  placeholder="5"
                />
              </div>
            </div>
          )}

          {formData.type !== "lesson" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Lines of Code (optional)</label>
                <input
                  type="number"
                  value={formData.linesOfCode}
                  onChange={(e) => setFormData({ ...formData, linesOfCode: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                  placeholder="50"
                />
              </div>
              {formData.type === "practice" && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Bugs Fixed (optional)</label>
                  <input
                    type="number"
                    value={formData.bugsFixed}
                    onChange={(e) => setFormData({ ...formData, bugsFixed: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                    placeholder="3"
                  />
                </div>
              )}
            </div>
          )}

          {formData.type !== "project" && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Title/Description</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Working on responsive design"
                required={formData.type !== "project"}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Learned about flexbox layouts"
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

      {/* Projects */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Active Projects</h4>
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {project.type === "game" ? (
                  <Gamepad2 className="w-5 h-5 text-purple-500" />
                ) : (
                  <Code className="w-5 h-5 text-blue-500" />
                )}
                <div>
                  <h5 className="text-white font-medium">{project.name}</h5>
                  <p className="text-gray-400 text-sm">
                    {project.technologies.join(", ")} • Started {new Date(project.startDate).toLocaleDateString()}
                  </p>
                  {project.lastWorked && (
                    <p className="text-gray-400 text-sm">
                      Last worked: {new Date(project.lastWorked).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{project.progress}%</div>
                <div className="text-xs text-gray-400 capitalize">{project.type}</div>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Learning Progress</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-4 h-4 ${lesson.completed ? "text-green-500" : "text-gray-400"}`} />
                  <div>
                    <h5 className={`font-medium ${lesson.completed ? "text-green-400" : "text-white"}`}>
                      {lesson.title}
                    </h5>
                    <p className="text-gray-400 text-sm capitalize">{lesson.category.replace("_", " ")}</p>
                  </div>
                </div>
                {lesson.completed && (
                  <div className="text-right text-sm">
                    <div className="text-green-400">✓ Complete</div>
                    <div className="text-gray-400">{lesson.duration}m</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Recent Sessions</h4>
          {sessions.slice(0, 5).map((session) => (
            <div key={session.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-500" />
                  <span className="text-white font-medium">{session.title}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      session.type === "lesson"
                        ? "bg-blue-500/20 text-blue-400"
                        : session.type === "project"
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
                  {session.linesOfCode && <div className="text-blue-400">{session.linesOfCode} lines</div>}
                  {session.bugsFixed && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Trophy className="w-3 h-3" />
                      {session.bugsFixed} bugs fixed
                    </div>
                  )}
                </div>
                <div className="text-red-500">
                  +
                  {session.type === "lesson"
                    ? session.duration * 3
                    : session.type === "project"
                      ? session.duration * 4 + (session.linesOfCode || 0) * 0.5
                      : session.duration * 2 + (session.bugsFixed || 0) * 10}{" "}
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
