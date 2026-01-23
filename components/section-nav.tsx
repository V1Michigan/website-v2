"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SectionNavProps {
  sections: Array<{
    name: string
    count: number
    type: "funding" | "cohort"
  }>
  activeSection: string | null
  filterSection: string | null
  onFilterChange: (section: string | null) => void
  onScrollToSection: (section: string) => void
}

export default function SectionNav({
  sections,
  activeSection,
  filterSection,
  onFilterChange,
  onScrollToSection,
}: SectionNavProps) {
  const handleSectionClick = (sectionName: string) => {
    if (filterSection === sectionName) {
      onFilterChange(null)
    } else {
      onFilterChange(sectionName)
    }
  }

  const handleAllClick = () => {
    onFilterChange(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Group sections by type
  const fundingSections = sections.filter(s => s.type === 'funding')
  const cohortSections = sections.filter(s => s.type === 'cohort')

  // Create shorter display names for cohorts
  const getDisplayName = (sectionName: string, type: string) => {
    if (type === 'cohort') {
      // Convert "Winter 2026 Product Studio Cohort" to "W26 Cohort"
      const match = sectionName.match(/(\w+)\s+(\d{4})\s+Product Studio Cohort/)
      if (match) {
        const [_, season, year] = match
        const seasonShort = season === 'Winter' ? 'W' : season === 'Fall' ? 'F' : season
        const yearShort = year.slice(-2) // Get last 2 digits
        return `${seasonShort}${yearShort} Cohort`
      }
    }
    return sectionName
  }

  return (
    <div className="bg-[#FAF7F2] border-b border-gray-200 py-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAllClick}
            className={`flex-shrink-0 ${filterSection === null
                ? "bg-[#E9B872] text-gray-800 hover:bg-[#E5AD5F]"
                : ""
              }`}
          >
            All
          </Button>

          {/* Funding sections */}
          {fundingSections.map((section) => (
            <Button
              key={section.name}
              variant={filterSection === section.name ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSectionClick(section.name)}
              className={`flex-shrink-0 ${filterSection === section.name
                ? "bg-[#E9B872] text-gray-800 hover:bg-[#E5AD5F]"
                : ""
                }`}
            >
              {getDisplayName(section.name, section.type)}
              <Badge
                variant="secondary"
                className={`ml-2 !hover:bg-inherit transition-none ${filterSection === section.name
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
              >
                {section.count}
              </Badge>
            </Button>
          ))}

          {/* Separator */}
          {cohortSections.length > 0 && (
            <div className="flex-shrink-0 w-px h-6 bg-gray-300 mx-2"></div>
          )}

          {/* Cohort sections */}
          {cohortSections.map((section) => (
            <Button
              key={section.name}
              variant={filterSection === section.name ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSectionClick(section.name)}
              className={`flex-shrink-0 ${filterSection === section.name
                ? "bg-[#E9B872] text-gray-800 hover:bg-[#E5AD5F]"
                : ""
                }`}
            >
              {getDisplayName(section.name, section.type)}
              <Badge
                variant="secondary"
                className={`ml-2 !hover:bg-inherit transition-none ${filterSection === section.name
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
              >
                {section.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}