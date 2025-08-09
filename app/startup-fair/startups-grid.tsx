"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import StartupCard from "../../components/startup-card"

export default function StartupsGrid() {
  const yearsData = [
    {
      year: "FALL 2023",
      stats: {
        startups: "8",
        students: "180+",
      },
      companies: [
        { name: "Stripe", domain: "Payments", image: "/placeholder.svg?height=32&width=32&text=S" },
        { name: "Figma", domain: "Design", image: "/placeholder.svg?height=32&width=32&text=F" },
        { name: "Notion", domain: "Productivity", image: "/placeholder.svg?height=32&width=32&text=N" },
        { name: "Linear", domain: "Project Mgmt", image: "/placeholder.svg?height=32&width=32&text=L" },
        { name: "Vercel", domain: "DevTools", image: "/placeholder.svg?height=32&width=32&text=V" },
        { name: "Supabase", domain: "Database", image: "/placeholder.svg?height=32&width=32&text=Su" },
      ],
      placeholders: [
        { name: "Company", domain: "Description", image: "/placeholder.svg?height=32&width=32&text=?" },
        { name: "Company", domain: "Description", image: "/placeholder.svg?height=32&width=32&text=?" },
      ]
    },
    {
      year: "FALL 2024",
      stats: {
        startups: "10",
        students: "220+",
      },
      companies: [
        { name: "OpenAI", domain: "AI", image: "/placeholder.svg?height=32&width=32&text=O" },
        { name: "Anthropic", domain: "AI Safety", image: "/placeholder.svg?height=32&width=32&text=A" },
        { name: "Perplexity", domain: "AI Search", image: "/placeholder.svg?height=32&width=32&text=P" },
        { name: "Cursor", domain: "AI Coding", image: "/placeholder.svg?height=32&width=32&text=C" },
        { name: "Runway", domain: "AI Video", image: "/placeholder.svg?height=32&width=32&text=R" },
        { name: "Midjourney", domain: "AI Art", image: "/placeholder.svg?height=32&width=32&text=M" },
        { name: "Replicate", domain: "AI Infra", image: "/placeholder.svg?height=32&width=32&text=Re" },
        { name: "Together", domain: "AI Platform", image: "/placeholder.svg?height=32&width=32&text=T" },
      ],
      placeholders: [
        { name: "Company", domain: "Description", image: "/placeholder.svg?height=32&width=32&text=?" },
        { name: "Company", domain: "Description", image: "/placeholder.svg?height=32&width=32&text=?" },
      ]
    },
    {
      year: "FALL 2025",
      stats: {
        startups: "12",
        students: "250+",
      },
      companies: [
        { name: "Ramp", domain: "Fintech", image: "/ramp.png?height=32&width=32&text=R" },
        { name: "Watershed", domain: "ClimateOS", image: "/watershed.png?height=32&width=32&text=W" },
        { name: "Courier Health", domain: "Patient CRM", image: "/courier.png?height=32&width=32&text=CH" },
        { name: "Applied Intuition", domain: "Motion AI", image: "/app-intuition.png?height=32&width=32&text=AI" },
        { name: "Authentic", domain: "Insurance", image: "/authentic.png?height=32&width=32&text=A" },
        { name: "Pylon", domain: "B2B Support", image: "/pylon.png?height=32&width=32&text=P" },
        { name: "Codium", domain: "AI Agents", image: "/codeium.png?height=32&width=32&text=C" },
        { name: "Lumos", domain: "Autonomy", image: "/lumos.png?height=32&width=32&text=L" },
      ],
      placeholders: [
        { name: "Company", domain: "Description", image: "/placeholder.svg?height=32&width=32&text=?" },
        { name: "Company", domain: "Description", image: "/placeholder.svg?height=32&width=32&text=?" },
        { name: "Company", domain: "Description", image: "/placeholder.svg?height=32&width=32&text=?" },
        { name: "Company", domain: "Description", image: "/placeholder.svg?height=32&width=32&text=?" },
      ]
    }
  ]

  const [currentYearIndex, setCurrentYearIndex] = useState(2) // Start with 2025 (index 2)
  const currentYearData = yearsData[currentYearIndex]

  const goToPreviousYear = () => {
    setCurrentYearIndex((prev) => (prev > 0 ? prev - 1 : yearsData.length - 1))
  }

  const goToNextYear = () => {
    setCurrentYearIndex((prev) => (prev < yearsData.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="w-full bg-[#191919] min-h-screen text-white relative overflow-hidden">
      {/* Decorative curved lines */}
      <svg
        className="absolute -top-[15%] left-0"
        width="180"
        height="280"
        viewBox="0 0 180 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="-20" cy="80" r="198" stroke="#E5AC61" strokeWidth="4" strokeDasharray="16 16" />
      </svg>
      <svg
        className="absolute -top-[28%] right-0"
        width="135"
        height="423"
        viewBox="0 0 135 423"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="211.5" cy="211.5" r="210.5" stroke="#E5AC61" strokeWidth="2" />
      </svg>
      <svg
        className="absolute top-[42%] right-0 -translate-y-1/2"
        width="551"
        height="752"
        viewBox="0 0 551 752"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="376" cy="376" r="235" stroke="#E5AC61" strokeWidth="4" strokeDasharray="16 16" />
      </svg>
      <svg
        className="absolute top-[55%] left-0"
        width="584"
        height="762"
        viewBox="0 0 584 762"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="203" cy="381" r="320" stroke="#E5AC61" strokeWidth="2" />
      </svg>
      
      {/* <svg
        className="absolute bottom-0 right-0"
        width="267"
        height="357"
        viewBox="0 0 267 357"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="178.5" cy="178.5" r="176.5" stroke="#E5AC61" strokeWidth="4" strokeDasharray="16 16" />
      </svg> */}

      {/* Header */}
      <div className="max-w-7xl mx-auto text-center pt-8 pb-6 relative z-10">
        <p className="text-sm text-[#FEF9F5] font-inter mb-6">{currentYearData.year}</p>
        {/* Stats Section */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-8 mb-8">
          <button 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            onClick={goToPreviousYear}
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
          <div className="flex items-center justify-center space-x-6 sm:space-x-12">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl text-[#FEF9F5] font-instrument font-light mb-1">{currentYearData.stats.startups}</div>
              <div className="text-xs text-center font-inter font-normal text-[#CEC9C5] leading-normal">Top startups</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl text-[#FEF9F5] font-instrument font-light mb-1">{currentYearData.stats.students}</div>
              <div className="text-xs text-center font-inter font-normal text-[#CEC9C5] leading-normal">Top students</div>
            </div>
          </div>
          <button 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            onClick={goToNextYear}
          >
            <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
      {/* Company Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 transition-all duration-500 ease-in-out">
          {currentYearData.companies.map((company, index) => (
            <StartupCard 
              key={`${currentYearData.year}-${index}`} 
              image={company.image} 
              name={company.name} 
              domain={company.domain} 
            />
          ))}
        </div>
        {/* Placeholder Companies */}
        {currentYearData.placeholders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 transition-all duration-500 ease-in-out">
            {currentYearData.placeholders.map((company, index) => (
              <StartupCard
                key={`${currentYearData.year}-placeholder-${index}`}
                image={company.image}
                name={company.name}
                domain={company.domain}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 via-gray-200/20 to-transparent pointer-events-none z-20"></div>
    </div>
  )
}
