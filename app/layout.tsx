import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "600", "700"],
})

export const metadata: Metadata = {
  title: "FocusForge - Forge Your Fitness & Study Mastery",
  description: "Track your fitness and study progress with FocusForge",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#000000",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-black text-white font-light overflow-x-hidden">{children}</body>
    </html>
  )
}
