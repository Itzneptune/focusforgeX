"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import type { User } from "@/lib/database"

interface LeaderboardProps {
  users: User[]
  currentUser: User
}

export default function Leaderboard({ users, currentUser }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30"
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30"
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30"
      default:
        return "bg-card border-border"
    }
  }

  const currentUserRank = users.findIndex((user) => user.id === currentUser.id) + 1

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-emerald-500" />
          <span>Leaderboard</span>
        </CardTitle>
        <CardDescription>Top performers this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Rank */}
        {currentUserRank > 3 && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary">#{currentUserRank}</Badge>
                <div>
                  <p className="font-medium text-foreground">Your Rank</p>
                  <p className="text-sm text-muted-foreground">{currentUser.total_points} points</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Level {currentUser.level}</p>
                <p className="text-xs text-muted-foreground">{currentUser.current_streak} streak</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Users */}
        <div className="space-y-3">
          {users.slice(0, 10).map((user, index) => {
            const rank = index + 1
            const isCurrentUser = user.id === currentUser.id

            return (
              <div
                key={user.id}
                className={`p-4 rounded-lg transition-all duration-200 ${getRankColor(rank)} ${
                  isCurrentUser ? "ring-2 ring-emerald-500/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(rank)}
                      <Badge variant={rank <= 3 ? "default" : "secondary"}>#{rank}</Badge>
                    </div>

                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-700">
                        {(user.full_name || user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium text-foreground">
                        {user.full_name || user.username}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Level {user.level} • {user.current_streak} streak
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-foreground">{user.total_points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>

                {rank <= 3 && (
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>Study: {user.study_points}</span>
                    <span>Fitness: {user.fitness_points}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
