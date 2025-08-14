import { Flame } from "lucide-react"

interface StreakDisplayProps {
  streak: number
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/30">
      <div className="flex items-center justify-center gap-3">
        <Flame className="w-8 h-8 text-orange-500" />
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streak}</div>
          <div className="text-sm text-gray-300">Day Streak</div>
        </div>
        <Flame className="w-8 h-8 text-orange-500" />
      </div>
      {streak > 0 && <p className="text-center text-sm text-gray-300 mt-2">Keep it up! You're on fire!</p>}
      {streak === 0 && <p className="text-center text-sm text-gray-400 mt-2">Start your streak today!</p>}
    </div>
  )
}
