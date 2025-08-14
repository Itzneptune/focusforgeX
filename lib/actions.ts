"use server"

import { signIn, signUp, setAuthCookie, clearAuthCookie } from "./auth"
import { createStudySession, createFitnessSession } from "./database"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const { user, token } = await signIn(email, password)
    setAuthCookie(token)
    return { success: true, user }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login failed" }
  }
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  try {
    const { user, token } = await signUp(email, password, name || undefined)
    setAuthCookie(token)
    return { success: true, user }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Sign up failed" }
  }
}

export async function signOutAction() {
  clearAuthCookie()
  redirect("/auth/login")
}

export async function logStudySessionAction(userId: string, subject: string, durationMinutes: number, topic?: string) {
  try {
    await createStudySession(userId, subject, durationMinutes, topic)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to log study session" }
  }
}

export async function logFitnessSessionAction(
  userId: string,
  activityType: string,
  durationMinutes?: number,
  activityName?: string,
  distanceKm?: number,
  weightKg?: number,
  sets?: number,
  reps?: number,
) {
  try {
    await createFitnessSession(userId, activityType, durationMinutes, activityName, distanceKm, weightKg, sets, reps)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to log fitness session" }
  }
}
