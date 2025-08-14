import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  email: string
  name?: string
  created_at: string
}

export interface StudySession {
  id: string
  user_id: string
  subject: string
  topic?: string
  duration_minutes: number
  points_earned: number
  session_date: string
  created_at: string
}

export interface FitnessSession {
  id: string
  user_id: string
  activity_type: string
  activity_name?: string
  duration_minutes?: number
  distance_km?: number
  weight_kg?: number
  sets?: number
  reps?: number
  points_earned: number
  session_date: string
  created_at: string
}

export interface UserStats {
  id: string
  user_id: string
  total_points: number
  study_streak: number
  fitness_streak: number
  last_study_date?: string
  last_fitness_date?: string
  updated_at: string
}

// User functions
export async function createUser(email: string, passwordHash: string, name?: string): Promise<User> {
  const result = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${passwordHash}, ${name})
    RETURNING id, email, name, created_at
  `
  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const result = await sql`
    SELECT id, email, name, password_hash, created_at
    FROM users
    WHERE email = ${email}
  `
  return (result[0] as User & { password_hash: string }) || null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, created_at
    FROM users
    WHERE id = ${id}
  `
  return (result[0] as User) || null
}

// Study session functions
export async function createStudySession(
  userId: string,
  subject: string,
  durationMinutes: number,
  topic?: string,
): Promise<StudySession> {
  const pointsEarned = Math.floor(durationMinutes * 3) // 3 points per minute

  const result = await sql`
    INSERT INTO study_sessions (user_id, subject, topic, duration_minutes, points_earned)
    VALUES (${userId}, ${subject}, ${topic}, ${durationMinutes}, ${pointsEarned})
    RETURNING *
  `

  // Update user stats
  await updateUserStats(userId, pointsEarned, "study")

  return result[0] as StudySession
}

export async function getStudySessionsByUser(userId: string, limit = 10): Promise<StudySession[]> {
  const result = await sql`
    SELECT * FROM study_sessions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return result as StudySession[]
}

// Fitness session functions
export async function createFitnessSession(
  userId: string,
  activityType: string,
  durationMinutes?: number,
  activityName?: string,
  distanceKm?: number,
  weightKg?: number,
  sets?: number,
  reps?: number,
): Promise<FitnessSession> {
  const pointsEarned = Math.floor((durationMinutes || 0) * 2) // 2 points per minute

  const result = await sql`
    INSERT INTO fitness_sessions (
      user_id, activity_type, activity_name, duration_minutes, 
      distance_km, weight_kg, sets, reps, points_earned
    )
    VALUES (
      ${userId}, ${activityType}, ${activityName}, ${durationMinutes},
      ${distanceKm}, ${weightKg}, ${sets}, ${reps}, ${pointsEarned}
    )
    RETURNING *
  `

  // Update user stats
  await updateUserStats(userId, pointsEarned, "fitness")

  return result[0] as FitnessSession
}

export async function getFitnessSessionsByUser(userId: string, limit = 10): Promise<FitnessSession[]> {
  const result = await sql`
    SELECT * FROM fitness_sessions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return result as FitnessSession[]
}

// User stats functions
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const result = await sql`
    SELECT * FROM user_stats
    WHERE user_id = ${userId}
  `

  if (result.length === 0) {
    // Create initial stats if they don't exist
    const newStats = await sql`
      INSERT INTO user_stats (user_id)
      VALUES (${userId})
      RETURNING *
    `
    return newStats[0] as UserStats
  }

  return result[0] as UserStats
}

async function updateUserStats(userId: string, pointsEarned: number, type: "study" | "fitness") {
  const today = new Date().toISOString().split("T")[0]

  if (type === "study") {
    await sql`
      INSERT INTO user_stats (user_id, total_points, study_streak, last_study_date, updated_at)
      VALUES (${userId}, ${pointsEarned}, 1, ${today}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        total_points = user_stats.total_points + ${pointsEarned},
        study_streak = CASE 
          WHEN user_stats.last_study_date = ${today} THEN user_stats.study_streak
          WHEN user_stats.last_study_date = (${today}::date - interval '1 day')::date THEN user_stats.study_streak + 1
          ELSE 1
        END,
        last_study_date = ${today},
        updated_at = NOW()
    `
  } else {
    await sql`
      INSERT INTO user_stats (user_id, total_points, fitness_streak, last_fitness_date, updated_at)
      VALUES (${userId}, ${pointsEarned}, 1, ${today}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        total_points = user_stats.total_points + ${pointsEarned},
        fitness_streak = CASE 
          WHEN user_stats.last_fitness_date = ${today} THEN user_stats.fitness_streak
          WHEN user_stats.last_fitness_date = (${today}::date - interval '1 day')::date THEN user_stats.fitness_streak + 1
          ELSE 1
        END,
        last_fitness_date = ${today},
        updated_at = NOW()
    `
  }
}
