"use client"

import type React from "react"

import { useState } from "react"
import {
  User,
  Cloud,
  Download,
  Upload,
  Shield,
  Bell,
  Palette,
  Database,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react"

interface UserProfile {
  name: string
  email: string
  joinDate: string
  totalPoints: number
}

export function SettingsTracker() {
  const [activeSection, setActiveSection] = useState("profile")
  const [profile, setProfile] = useState<UserProfile>({
    name: "Focus User",
    email: "user@focusforge.com",
    joinDate: "January 2024",
    totalPoints: 1250,
  })
  const [syncEnabled, setSyncEnabled] = useState(false)
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    studyReminders: true,
    streakAlerts: true,
    weeklyReports: false,
  })

  const SettingCard = ({
    icon: Icon,
    title,
    description,
    children,
  }: {
    icon: any
    title: string
    description: string
    children: React.ReactNode
  }) => (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={20} className="text-red-500" />
        <div>
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )

  const ProfileSection = () => (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">Profile Settings</h3>

      <SettingCard icon={User} title="Personal Information" description="Manage your profile details">
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Member since: {profile.joinDate}</span>
            <span className="text-red-500 font-medium">{profile.totalPoints} points</span>
          </div>
        </div>
      </SettingCard>

      <SettingCard icon={Bell} title="Notifications" description="Configure your notification preferences">
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-white text-sm">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </span>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`w-12 h-6 rounded-full transition-colors ${value ? "bg-red-600" : "bg-gray-700"} relative`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    value ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  )

  const DataSection = () => (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">Data Management</h3>

      <SettingCard icon={Cloud} title="Google Drive Sync" description="Backup your data to Google Drive automatically">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Auto Sync</span>
            <button
              onClick={() => setSyncEnabled(!syncEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                syncEnabled ? "bg-red-600" : "bg-gray-700"
              } relative`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  syncEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {syncEnabled && (
            <div className="text-green-500 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Last synced: 2 minutes ago
            </div>
          )}
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <ExternalLink size={16} />
            Connect Google Drive
          </button>
        </div>
      </SettingCard>

      <SettingCard icon={Database} title="Data Export & Import" description="Backup or restore your FocusForge data">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Download size={16} />
            Export Data
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Upload size={16} />
            Import Data
          </button>
        </div>
        <div className="text-gray-400 text-xs mt-2">
          Export includes all fitness logs, study sessions, and progress data
        </div>
      </SettingCard>

      <SettingCard icon={RefreshCw} title="Data Reset" description="Reset specific data categories">
        <div className="space-y-2">
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            Reset Fitness Data
          </button>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            Reset Study Data
          </button>
          <button className="w-full bg-red-800 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Trash2 size={16} />
            Reset All Data
          </button>
        </div>
      </SettingCard>
    </div>
  )

  const AppSection = () => (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">App Settings</h3>

      <SettingCard icon={Palette} title="Appearance" description="Customize the app's look and feel">
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {["Dark", "Light", "Auto"].map((theme) => (
                <button
                  key={theme}
                  className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                    theme === "Dark" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Accent Color</label>
            <div className="flex gap-2">
              {["bg-red-600", "bg-blue-600", "bg-green-600", "bg-purple-600"].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color} ${
                    color === "bg-red-600" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard icon={Shield} title="Privacy & Security" description="Manage your privacy and security settings">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Analytics Collection</span>
            <button className="w-12 h-6 rounded-full bg-red-600 relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-6" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Crash Reports</span>
            <button className="w-12 h-6 rounded-full bg-red-600 relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-6" />
            </button>
          </div>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            View Privacy Policy
          </button>
        </div>
      </SettingCard>
    </div>
  )

  const sections = [
    { id: "profile", label: "Profile", component: ProfileSection },
    { id: "data", label: "Data", component: DataSection },
    { id: "app", label: "App", component: AppSection },
  ]

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      {/* Section Navigation */}
      <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeSection === id ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active Section Content */}
      <div className="animate-fade-in">{sections.find((s) => s.id === activeSection)?.component()}</div>

      {/* App Info */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
        <div className="text-white font-semibold mb-1">FocusForge</div>
        <div className="text-gray-400 text-sm">Version 1.0.0</div>
        <div className="text-gray-500 text-xs mt-2">Built with ❤️ for productivity enthusiasts</div>
      </div>
    </div>
  )
}
