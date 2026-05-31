"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  const handleValueChange = (value: string) => {
    if (value === "all") {
      onFilterChange(null)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      onFilterChange(value)
    }
  }

  return (
    <div className="bg-[#FAF7F2] border-b border-gray-200 py-3 md:py-4">
      <div className="mx-auto max-w-6xl px-2 md:px-0">
        <div className="max-w-xs">
          <Select value={filterSection || "all"} onValueChange={handleValueChange}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Filter projects..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>

              {/* Funding sections */}
              {fundingSections.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Funding
                  </div>
                  {fundingSections.map((section) => (
                    <SelectItem key={section.name} value={section.name}>
                      {getDisplayName(section.name, section.type)} ({section.count})
                    </SelectItem>
                  ))}
                </>
              )}

              {/* Cohort sections */}
              {cohortSections.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Cohorts
                  </div>
                  {cohortSections.map((section) => (
                    <SelectItem key={section.name} value={section.name}>
                      {getDisplayName(section.name, section.type)} ({section.count})
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}