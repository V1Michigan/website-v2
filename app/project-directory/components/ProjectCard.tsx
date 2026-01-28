import Image from "next/image"
import type { Project } from "@/types/project"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

// VC Fund badge colors
const vcFundColors = {
  "Y Combinator": "bg-orange-500 text-white",
  "Techstars": "bg-blue-500 text-white", 
  "General Catalyst": "bg-green-500 text-white",
  "Sequoia Capital": "bg-red-500 text-white",
}

// Get cohort display name (remove "Product Studio Cohort" suffix)
const getCohortDisplayName = (cohortName: string) => {
  return cohortName.replace(" Product Studio Cohort", "")
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const hasVCFunding = project.sectionType === "funding"
  const hasCohort = project.sectionType === "cohort"
  
  const vcBadgeColor = vcFundColors[project.sectionName as keyof typeof vcFundColors] || "bg-gray-500 text-white"

  return (
    <div 
      className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md hover:border-gray-300"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Company Logo/Image */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={project.imageSrc}
            alt={project.companyName}
            fill
            className="object-cover"
          />
        </div>

        {/* Project Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-instrument text-lg font-semibold text-gray-900 group-hover:text-gray-700">
            {project.companyName}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-700">
            {project.title}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {project.description}
          </p>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {hasVCFunding && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${vcBadgeColor}`}>
                {project.sectionName}
              </span>
            )}
            {hasCohort && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-0.5 text-xs font-medium text-white">
                {getCohortDisplayName(project.sectionName)}
              </span>
            )}
          </div>

          {/* Category Tags */}
          {project.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {project.categories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                >
                  {category}
                </span>
              ))}
              {project.categories.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500">
                  +{project.categories.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Investors Preview */}
          {project.investors && project.investors.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-600">Investors:</span>
                <div className="flex flex-wrap gap-1">
                  {project.investors.slice(0, 3).map((investor) => (
                    investor.website ? (
                      <a
                        key={investor.id}
                        href={investor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        {investor.name}
                        <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span
                        key={investor.id}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                      >
                        {investor.name}
                      </span>
                    )
                  ))}
                  {project.investors.length > 3 && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      +{project.investors.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Founders Preview */}
          {project.founders.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.founders.slice(0, 2).map((founder) => (
                  <div
                    key={founder.id}
                    className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-gray-100"
                  >
                    <Image
                      src={founder.imageSrc}
                      alt={founder.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {project.founders.length === 1 
                  ? project.founders[0].name 
                  : `${project.founders[0].name} +${project.founders.length - 1}`
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}