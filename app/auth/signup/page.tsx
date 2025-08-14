import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/auth/signup-form"

export default async function SignUpPage() {
  // Check if user is already logged in
  const user = await getCurrentUser()
  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <SignUpForm />
    </div>
  )
}
