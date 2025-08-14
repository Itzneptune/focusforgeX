interface Activity {
  id: string
  type: "fitness" | "study"
  title: string
  description: string
  points: number
  completed: boolean
  timestamp: string
}

interface ActivitySummaryProps {
  activities: Activity[]
}

export function ActivitySummary({ activities }: ActivitySummaryProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today's Summary</h3>
        <div className="text-center py-8 text-gray-400">
          <p>No activities logged today</p>
          <p className="text-sm mt-2">Start tracking to see your progress here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Today's Summary</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className={`w-2 h-2 rounded-full ${activity.completed ? "bg-green-500" : "bg-gray-500"}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">{activity.title}</h4>
                <span className="text-red-500 text-sm font-semibold">+{activity.points}</span>
              </div>
              <p className="text-gray-400 text-sm">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
