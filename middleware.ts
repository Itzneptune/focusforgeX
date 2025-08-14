import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/signup"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If token exists, verify it
  if (token) {
    const payload = verifyToken(token)

    // If token is invalid and trying to access protected route, redirect to login
    if (!payload && !isPublicRoute) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }

    // If valid token and trying to access auth pages, redirect to home
    if (payload && isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
