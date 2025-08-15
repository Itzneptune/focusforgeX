import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: number
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  total_points: number
  study_points: number
  fitness_points: number
  current_streak: number
  longest_streak: number
  level: number
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: number
  user_id: number
  subject: string
  duration_minutes: number
  points_earned: number
  session_date: string
  notes?: string
  created_at: string
}

export interface FitnessSession {
  id: number
  user_id: number
  activity_type: string
  duration_minutes?: number
  calories_burned?: number
  points_earned: number
  session_date: string
  notes?: string
  created_at: string
}

export async function createUser(
  email: string,
  passwordHash: string,
  username: string,
  fullName?: string,
): Promise<User> {
  const result = await sql`
    INSERT INTO users (email, password_hash, username, full_name)
    VALUES (${email}, ${passwordHash}, ${username}, ${fullName})
    RETURNING id, email, username, full_name, avatar_url, total_points, study_points, fitness_points, current_streak, longest_streak, level, created_at, updated_at
  `
  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const result = await sql`
    SELECT id, email, username, full_name, avatar_url, total_points, study_points, fitness_points, current_streak, longest_streak, level, password_hash, created_at, updated_at
    FROM users
    WHERE email = ${email}
  `
  return (result[0] as User & { password_hash: string }) || null
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await sql`
    SELECT id, email, username, full_name, avatar_url, total_points, study_points, fitness_points, current_streak, longest_streak, level, created_at, updated_at
    FROM users
    WHERE id = ${id}
  `
  return (result[0] as User) || null
}

export async function getLeaderboard(limit = 10): Promise<User[]> {
  const result = await sql`
    SELECT id, email, username, full_name, avatar_url, total_points, study_points, fitness_points, current_streak, longest_streak, level, created_at, updated_at
    FROM users
    ORDER BY total_points DESC, current_streak DESC
    LIMIT ${limit}
  `
  return result as User[]
}

export async function createStudySession(
  userId: number,
  subject: string,
  durationMinutes: number,
  notes?: string,
): Promise<StudySession> {
  const pointsEarned = Math.floor(durationMinutes * 3) // 3 points per minute

  const result = await sql`
    INSERT INTO study_sessions (user_id, subject, duration_minutes, points_earned, notes)
    VALUES (${userId}, ${subject}, ${durationMinutes}, ${pointsEarned}, ${notes})
    RETURNING *
  `

  // Update user points and streak
  await updateUserPoints(userId, pointsEarned, "study")

  return result[0] as StudySession
}

export async function getStudySessionsByUser(userId: number, limit = 10): Promise<StudySession[]> {
  const result = await sql`
    SELECT * FROM study_sessions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return result as StudySession[]
}

export async function createFitnessSession(
  userId: number,
  activityType: string,
  durationMinutes?: number,
  caloriesBurned?: number,
  notes?: string,
): Promise<FitnessSession> {
  const pointsEarned = Math.floor((durationMinutes || 0) * 2 + (caloriesBurned || 0) * 0.1) // 2 points per minute + 0.1 per calorie

  const result = await sql`
    INSERT INTO fitness_sessions (
      user_id, activity_type, duration_minutes, calories_burned, points_earned, notes
    )
    VALUES (
      ${userId}, ${activityType}, ${durationMinutes}, ${caloriesBurned}, ${pointsEarned}, ${notes}
    )
    RETURNING *
  `

  // Update user points and streak
  await updateUserPoints(userId, pointsEarned, "fitness")

  return result[0] as FitnessSession
}

export async function getFitnessSessionsByUser(userId: number, limit = 10): Promise<FitnessSession[]> {
  const result = await sql`
    SELECT * FROM fitness_sessions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return result as FitnessSession[]
}

async function updateUserPoints(userId: number, pointsEarned: number, type: "study" | "fitness") {
  const today = new Date().toISOString().split("T")[0]

  if (type === "study") {
    await sql`
      UPDATE users 
      SET 
        total_points = total_points + ${pointsEarned},
        study_points = study_points + ${pointsEarned},
        current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        level = FLOOR((total_points + ${pointsEarned}) / 1000) + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `
  } else {
    await sql`
      UPDATE users 
      SET 
        total_points = total_points + ${pointsEarned},
        fitness_points = fitness_points + ${pointsEarned},
        current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        level = FLOOR((total_points + ${pointsEarned}) / 1000) + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `
  }
}
