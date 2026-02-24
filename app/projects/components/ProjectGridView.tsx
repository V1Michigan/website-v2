import Image from "next/image"
import type { Project } from "@/types/project"
import { isStartup } from "@/lib/notion"

interface ProjectGridViewProps {
  projects: Project[]
  onProjectClick: (_project: Project) => void
}

export default function ProjectGridView({ projects, onProjectClick }: ProjectGridViewProps) {
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => {
        const projectIsStartup = isStartup(project)
        const primaryInvestor = project.investors?.[0] || null

        return (
          <div
            key={project.id}
            className="group cursor-pointer rounded-lg border border-gray-300 bg-white p-5 transition-all hover:shadow-lg hover:border-gray-400"
            onClick={() => onProjectClick(project)}
          >
            {/* Company Logo */}
            <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={project.imageSrc}
                alt={project.companyName}
                fill
                className="object-cover"
              />
            </div>

            {/* Company Name & Type */}
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-instrument text-base font-semibold text-gray-900 group-hover:text-gray-700">
                  {project.companyName}
                </h3>
                {project.isActive && (
                  <span className="flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                )}
              </div>
              <span className={`mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                projectIsStartup 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {projectIsStartup ? "Startup" : "Project"}
              </span>
            </div>

            {/* Description */}
            <p className="mb-3 line-clamp-3 text-sm text-gray-600">
              {project.description}
            </p>

            {/* Categories */}
            {project.categories.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {project.categories.slice(0, 2).map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                  >
                    {category}
                  </span>
                ))}
                {project.categories.length > 2 && (
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500">
                    +{project.categories.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Primary Investor Badge */}
            {primaryInvestor && (
              <div className="mb-3">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {primaryInvestor.name}
                </span>
              </div>
            )}

            {/* Founders Preview */}
            {project.founders.length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <div className="flex -space-x-2">
                  {project.founders.slice(0, 3).map((founder) => (
                    <div
                      key={founder.id}
                      className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-gray-100"
                    >
                      {founder.imageSrc && (
                        <Image
                          src={founder.imageSrc}
                          alt={founder.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {project.founders.length === 1 
                    ? project.founders[0].name 
                    : `${project.founders.length} ${projectIsStartup ? "founders" : "creators"}`
                  }
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
