import type React from "react"
import "./globals.css"
import { Inter, Playfair_Display } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata = {
  title: "V1 @ Michigan - Student Entrepreneurship",
  description:
    "V1 is the premier student-run entrepreneurship organization at Michigan dedicated to empowering builders and innovators of tomorrow.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, playfair.variable)}>
        {children}
      </body>
    </html>
  )
}


import './globals.css'