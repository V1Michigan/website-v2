"use client"

import { forwardRef } from "react"
import React from "react"
import ProjectCard from "./project-card"
import type { Project } from "@/types/project"
import { Badge } from "@/components/ui/badge"

interface ProjectSectionProps {
  name: string
  projects: Project[]
  onProjectClick: (project: Project) => void
}

const ProjectSection = forwardRef<HTMLDivElement, ProjectSectionProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ name, projects, onProjectClick, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className="pt-4 mb-12 scroll-mt-32">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif text-gray-800">{name} ▪ {projects.length} Project{projects.length !== 1 ? "s" : ""}</h2>
            {/* <Badge variant="secondary" className="bg-red-500"> */}
            {/*   {projects.length} project{projects.length !== 1 ? "s" : ""} */}
            {/* </Badge> */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              imageSrc={project.imageSrc}
              onClick={() => onProjectClick(project)}
            />
          ))}
        </div>
      </div>
    )
  }
)

ProjectSection.displayName = "ProjectSection"

export default ProjectSection
