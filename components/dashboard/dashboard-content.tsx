"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, BookOpen, Dumbbell, TrendingUp, Award, LogOut } from "lucide-react"
import type { User } from "@/lib/database"
import { signOutAction } from "@/lib/actions"
import StudyTracker from "./study-tracker"
import FitnessTracker from "./fitness-tracker"

interface DashboardContentProps {
  user: User
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const levelProgress = (user.total_points % 1000) / 10 // Progress to next level as percentage

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.full_name || user.username}!</h1>
          <p className="text-muted-foreground">Ready to forge your focus today?</p>
        </div>
        <form action={signOutAction}>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </form>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{user.total_points}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{user.study_points}</p>
                <p className="text-sm text-muted-foreground">Study Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{user.fitness_points}</p>
                <p className="text-sm text-muted-foreground">Fitness Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{user.current_streak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-emerald-500" />
            <span>Level Progress</span>
          </CardTitle>
          <CardDescription>
            Level {user.level} • {user.total_points % 1000}/1000 points to next level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {user.level}</span>
              <span>Level {user.level + 1}</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Activity Tracking */}
      <Tabs defaultValue="study" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="study" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Study Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="fitness" className="flex items-center space-x-2">
            <Dumbbell className="h-4 w-4" />
            <span>Fitness Tracker</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="study">
          <StudyTracker user={user} />
        </TabsContent>

        <TabsContent value="fitness">
          <FitnessTracker user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
