import { ChevronLeft, ChevronRight } from "lucide-react"
import StartupCard from "./components/startup-card"

export default function StartupsGrid() {
  const companies = [
    {
      name: "Ramp",
      domain: "Finance",
      image: "/placeholder.svg?height=32&width=32&text=R",
    },
    {
      name: "Watershed",
      domain: "Climate tech",
      image: "/placeholder.svg?height=32&width=32&text=W",
    },
    {
      name: "Courier Health",
      domain: "Patient Care",
      image: "/placeholder.svg?height=32&width=32&text=CH",
    },
    {
      name: "Applied Intuition",
      domain: "Mobility AI",
      image: "/placeholder.svg?height=32&width=32&text=AI",
    },
    {
      name: "Authentic",
      domain: "Infrastructure",
      image: "/placeholder.svg?height=32&width=32&text=A",
    },
    {
      name: "Pylon",
      domain: "B2B Support",
      image: "/placeholder.svg?height=32&width=32&text=P",
    },
    {
      name: "Codium",
      domain: "AI Agents",
      image: "/placeholder.svg?height=32&width=32&text=C",
    },
    {
      name: "Luma",
      domain: "Autonomy",
      image: "/placeholder.svg?height=32&width=32&text=L",
    },
  ]

  const placeholderCompanies = [
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto bg-gray-900 min-h-screen text-white relative overflow-hidden">
      {/* Decorative curved lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 800">
        {/* Top left curve */}
        <path
          d="M-50 50 Q100 100 150 200 Q200 300 100 400"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="8,8"
          fill="none"
          opacity="0.6"
        />

        {/* Top right curve */}
        <path
          d="M350 0 Q400 100 380 200 Q360 300 420 400"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="8,8"
          fill="none"
          opacity="0.6"
        />

        {/* Middle right curve */}
        <path
          d="M450 300 Q350 350 300 450 Q250 550 350 650"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="8,8"
          fill="none"
          opacity="0.6"
        />

        {/* Bottom left curve */}
        <path
          d="M-20 600 Q80 650 120 750 Q160 850 60 900"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="8,8"
          fill="none"
          opacity="0.6"
        />

        {/* Large circular element */}
        <circle
          cx="320"
          cy="150"
          r="80"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="8,8"
          fill="none"
          opacity="0.4"
        />
      </svg>

      {/* Header */}
      <div className="text-center pt-8 pb-6 relative z-10">
        <p className="text-sm text-gray-400 mb-6">FALL 2024</p>

        {/* Stats Section */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <button className="p-2">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex items-center space-x-12">
            <div className="text-center">
              <div className="text-4xl font-light mb-1">12</div>
              <div className="text-xs text-gray-400">Top startups</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light mb-1">250+</div>
              <div className="text-xs text-gray-400">Top students</div>
            </div>
          </div>

          <button className="p-2">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Company Grid */}
      <div className="px-4 relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {companies.map((company, index) => (
            <StartupCard key={index} image={company.image} name={company.name} domain={company.domain} />
          ))}
        </div>

        {/* Placeholder Companies */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {placeholderCompanies.map((company, index) => (
            <StartupCard
              key={`placeholder-${index}`}
              image={company.image}
              name={company.name}
              domain={company.domain}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
