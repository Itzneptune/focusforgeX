import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginForm from "@/components/auth/login-form"

export default async function LoginPage() {
  // Check if user is already logged in
  const user = await getCurrentUser()
  if (user) {
    redirect("/dashboard")
  }

  return <LoginForm />
}
