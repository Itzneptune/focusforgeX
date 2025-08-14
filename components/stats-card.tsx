"use client"

import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  points: number
  subtitle: string
  buttonText: string
  buttonAction: () => void
  icon: ReactNode
}

export function StatsCard({ title, points, subtitle, buttonText, buttonAction, icon }: StatsCardProps) {
  return (
    <div className="focusforge-card relative overflow-hidden group hover:scale-105 transition-transform duration-200">
      <div className="h-1 bg-red-500 absolute top-0 left-0 right-0"></div>
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-red-500">{icon}</div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-red-500 mb-2">{points}</div>
          <p className="text-sm text-gray-300">{subtitle}</p>
        </div>
        <button onClick={buttonAction} className="focusforge-button-primary w-full">
          {buttonText}
        </button>
      </div>
    </div>
  )
}
