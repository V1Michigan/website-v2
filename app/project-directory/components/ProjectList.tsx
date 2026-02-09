import { useMemo } from "react"
import ProjectCard from "./ProjectCard"
import type { Project } from "@/types/project"

interface ProjectListProps {
  projects: Project[]
  onProjectClick: (_project: Project) => void
}

export default function ProjectList({ projects, onProjectClick }: ProjectListProps) {
  // Sort projects: funding projects first, then cohorts, maintaining existing order logic
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      // If both are same type, sort by section order
      if (a.sectionType === b.sectionType) {
        if (a.sectionType === "funding") {
          // For funding, lower order = higher priority
          return a.sectionOrder - b.sectionOrder
        } else {
          // For cohorts, higher order = more recent
          return b.sectionOrder - a.sectionOrder
        }
      }
      // Funding projects come first
      return a.sectionType === "funding" ? -1 : 1
    })
  }, [projects])

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project)}
        />
      ))}
    </div>
  )
}