"use client"

import { useEffect, useState } from "react"

export function SplashScreen() {
  const [showLogo, setShowLogo] = useState(false)
  const [showTagline, setShowTagline] = useState(false)

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 300)
    const taglineTimer = setTimeout(() => setShowTagline(true), 800)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(taglineTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1
          className={`text-5xl md:text-7xl font-bold text-red-500 mb-6 transition-all duration-700 ${
            showLogo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          FocusForge
        </h1>

        <p
          className={`text-lg md:text-xl text-white font-light transition-all duration-700 delay-300 ${
            showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Forge Your Fitness & Study Mastery
        </p>
      </div>

      {/* Loading indicator */}
      <div className="mt-12">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}
