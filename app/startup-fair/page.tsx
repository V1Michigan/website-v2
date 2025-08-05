"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectCard from "@/components/project-card"
import { projects } from "@/data/projects"
import type { Project } from "@/types/project"
import HeroSection from "@/app/startup-fair/hero-section"
import StartupsGrid from "./startups-grid"
import CountdownTimer from "./components/countdown-timer"
import EventSections from "./components/events-sections"
import FAQSection from "./components/faq-section"
import TeamSection from "./components/team-section"

export default function ProjectDirectoryPage() {

  const events = [
  {
    title: "Tech Talks",
    description:
      "Join us for tech talks featuring a variety of leading companies, discussing their latest innovations and industry insights.",
    image: "/tech-talks.png?height=120&width=160&text=Tech+Talks",
  },
  {
    title: "1:1 Recruiter Chats",
    description:
      "Connect directly with recruiters from top companies for personalized career discussions and opportunities.",
    image: "/recruiters.png?height=120&width=160&text=Recruiter+Chats",
  },
  {
    title: "Interactive Activities",
    description: "Participate in hands-on workshops, coding challenges, and collaborative problem-solving sessions.",
    image: "/acts.png?height=120&width=160&text=Activities",
  },
  ]

  const faqs = [
  "What if I already have a job but am interested?",
  "When and where is this?",
  "Who is this designed for?",
  "What is it?",
  "How do I prepare?",
  "Can the company recruit at Startup Fair?",
  "Can anyone attend?",
  ]

  const teamMembers = [
  "/placeholder.svg?height=40&width=40&text=1",
  "/placeholder.svg?height=40&width=40&text=2",
  "/placeholder.svg?height=40&width=40&text=3",
  "/placeholder.svg?height=40&width=40&text=4",
  "/placeholder.svg?height=40&width=40&text=5",
  "/placeholder.svg?height=40&width=40&text=6",
  "/placeholder.svg?height=40&width=40&text=7",
  ]

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <HeroSection />
      <StartupsGrid />

      <div className="max-w-7xl mx-auto bg-white min-h-screen">
      {/* Event Cards Section */}
      <EventSections events={events} />

      {/* Statistics Section */}
      <div className="px-6 py-8">
        <CountdownTimer days={0} hours={0} minutes={0} />
      </div>

      {/* FAQ Section */}
      <div className="px-6 py-4">
        <FAQSection questions={faqs} />
      </div>

      {/* Team Section */}
      <div className="px-6 py-8">
        <TeamSection teamMembers={teamMembers} />
      </div>


    </div>

      <Footer />
    </div>
  )
}
