import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  // Get the current user (middleware ensures they're authenticated)
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  redirect("/dashboard")
}
