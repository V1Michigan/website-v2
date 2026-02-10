import { useState, useMemo } from "react"
import FilterPanel from "./FilterPanel"
import ProjectList from "./ProjectList"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const hasActiveFilters = useMemo(
    () =>
      filters.searchQuery !== "" ||
      filters.fundingSources.length > 0 ||
      filters.cohorts.length > 0 ||
      filters.categories.length > 0,
    [filters.searchQuery, filters.fundingSources.length, filters.cohorts.length, filters.categories.length]
  )

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:gap-6">
        {/* Filter Panel - Left Side */}
        <div className="w-96 flex-shrink-0">
          <div className="sticky top-8 h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-gray-300 bg-white">
            <div className="flex h-full flex-col">
              <div className="border-b border-gray-300 p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  disabled={!hasActiveFilters || isLoading}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FilterPanel
                  filters={filters}
                  filterOptions={filterOptions}
                  onSearchChange={onSearchChange}
                  onToggleFunding={onToggleFunding}
                  onToggleCohort={onToggleCohort}
                  onToggleCategory={onToggleCategory}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project List - Right Side */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="search"
                placeholder="Search companies..."
                value={filters.searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-instrument text-2xl font-semibold text-gray-900">
              Projects ({projects.length})
            </h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          ) : (
            <ProjectList projects={projects} onProjectClick={onProjectClick} />
          )}
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search companies..."
              value={filters.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFilterOpen(true)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                {filters.fundingSources.length + filters.cohorts.length + filters.categories.length}
              </span>
            )}
          </Button>
        </div>
        {/* Mobile Filter Button */}

        {/* Project Count */}
        <div className="mb-4">
          <h2 className="font-instrument text-xl font-semibold text-gray-900">
            Projects ({projects.length})
          </h2>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <ProjectList projects={projects} onProjectClick={onProjectClick} />
        )}

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Filter Panel Slide-up */}
            <div className="fixed bottom-0 left-0 right-0 flex max-h-[80vh] flex-col rounded-t-lg bg-white">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-300 p-4">
                <h3 className="font-instrument text-lg font-semibold text-gray-900">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  ×
                </Button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto">
                <FilterPanel
                  filters={filters}
                  filterOptions={filterOptions}
                  onSearchChange={onSearchChange}
                  onToggleFunding={onToggleFunding}
                  onToggleCohort={onToggleCohort}
                  onToggleCategory={onToggleCategory}
                  isLoading={isLoading}
                  showSearch={false}
                />
              </div>

              {/* Footer */}
              <div className="border-t border-gray-300 p-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClearFilters()
                    setIsMobileFilterOpen(false)
                  }}
                  disabled={!hasActiveFilters || isLoading}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => setIsMobileFilterOpen(false)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
