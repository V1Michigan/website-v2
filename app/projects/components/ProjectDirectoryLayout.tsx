import { useMemo } from "react"
import FilterPanel from "./FilterPanel"
import ProjectList from "./ProjectList"
import type { Project } from "@/types/project"

interface ProjectDirectoryLayoutProps {
  projects: Project[]
  filters: {
    searchQuery: string
    fundingSources: string[]
    cohorts: string[]
    categories: string[]
  }
  filterOptions: {
    fundingSources: string[]
    cohorts: string[]
    categories: string[]
  }
  onSearchChange: (_query: string) => void
  onToggleFunding: (_source: string) => void
  onToggleCohort: (_cohort: string) => void
  onToggleCategory: (_category: string) => void
  onProjectClick: (_project: Project) => void
  onClearFilters: () => void
  isLoading?: boolean
}

export default function ProjectDirectoryLayout({
  projects,
  filters,
  filterOptions,
  onSearchChange,
  onToggleFunding,
  onToggleCohort,
  onToggleCategory,
  onProjectClick,
  onClearFilters,
  isLoading = false,
}: ProjectDirectoryLayoutProps) {
  const hasActiveFilters = useMemo(
    () =>
      filters.searchQuery !== "" ||
      filters.fundingSources.length > 0 ||
      filters.cohorts.length > 0 ||
      filters.categories.length > 0,
    [filters.searchQuery, filters.fundingSources.length, filters.cohorts.length, filters.categories.length]
  )

  return (
    <div>
      <div className="mb-6 rounded-lg border border-gray-300 bg-white">
        <FilterPanel
          filters={filters}
          filterOptions={filterOptions}
          onSearchChange={onSearchChange}
          onToggleFunding={onToggleFunding}
          onToggleCohort={onToggleCohort}
          onToggleCategory={onToggleCategory}
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
          isLoading={isLoading}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{projects.length}</span> projects
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
        </div>
      ) : (
        <ProjectList projects={projects} onProjectClick={onProjectClick} />
      )}
    </div>
  )
}
