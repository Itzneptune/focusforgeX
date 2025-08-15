import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/auth/signup-form"

export default async function SignUpPage() {
  // Check if user is already logged in
  const user = await getCurrentUser()
  if (user) {
    redirect("/dashboard")
  }

  return <SignUpForm />
}
