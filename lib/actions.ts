"use server"

import { signIn, signUp, setAuthCookie, clearAuthCookie } from "./auth"
import { createStudySession, createFitnessSession } from "./database"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signInAction(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    const { user, token } = await signIn(email, password)
    setAuthCookie(token)

    // Redirect to dashboard after successful login
    redirect("/dashboard")
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login failed" }
  }
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string
  const fullName = formData.get("fullName") as string

  if (!email || !password || !username) {
    return { error: "Email, password, and username are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  try {
    const { user, token } = await signUp(email, password, username, fullName || undefined)
    setAuthCookie(token)

    // Redirect to dashboard after successful signup
    redirect("/dashboard")
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Sign up failed" }
  }
}

export async function signOutAction() {
  clearAuthCookie()
  redirect("/auth/login")
}

export async function logStudySessionAction(userId: number, subject: string, durationMinutes: number, notes?: string) {
  try {
    await createStudySession(userId, subject, durationMinutes, notes)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to log study session" }
  }
}

export async function logFitnessSessionAction(
  userId: number,
  activityType: string,
  durationMinutes?: number,
  caloriesBurned?: number,
  notes?: string,
) {
  try {
    await createFitnessSession(userId, activityType, durationMinutes, caloriesBurned, notes)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to log fitness session" }
  }
}
