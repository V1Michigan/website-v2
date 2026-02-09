"use client";

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectModal from "@/components/project-modal"
import ProjectDirectoryLayout from "./components/ProjectDirectoryLayout"
import type { Project } from "@/types/project"

export default function ProjectDirectoryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filterOptions, setFilterOptions] = useState<{
    fundingSources: string[]
    cohorts: string[]
    categories: string[]
  }>({ fundingSources: [], cohorts: [], categories: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get current filters from URL
  const filters = {
    searchQuery: searchParams?.get("search") || "",
    fundingSources: searchParams?.getAll("funding") || [],
    cohorts: searchParams?.getAll("cohort") || [],
    categories: searchParams?.getAll("category") || [],
  }

  const hasActiveFilters = 
    filters.searchQuery !== "" ||
    filters.fundingSources.length > 0 ||
    filters.cohorts.length > 0 ||
    filters.categories.length > 0

  // Fetch projects when filters change
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters.searchQuery) params.set("search", filters.searchQuery)
        filters.fundingSources.forEach(f => params.append("funding", f))
        filters.cohorts.forEach(c => params.append("cohort", c))
        filters.categories.forEach(c => params.append("category", c))
        
        const response = await fetch(`/api/projects?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        
        const data = await response.json()
        setProjects(data.projects || [])
        setFilterOptions(data.filterOptions || { fundingSources: [], cohorts: [], categories: [] })
      } catch (error) {
        console.error("Failed to fetch projects:", error)
        setError("Unable to load projects. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [searchParams])

  // Update URL when filters change
  const updateFilters = (updates: {
    searchQuery?: string
    fundingSources?: string[]
    cohorts?: string[]
    categories?: string[]
  }) => {
    const params = new URLSearchParams(searchParams?.toString() || "")

    if (updates.searchQuery !== undefined) {
      if (updates.searchQuery) {
        params.set("search", updates.searchQuery)
      } else {
        params.delete("search")
      }
    }

    if (updates.fundingSources !== undefined) {
      params.delete("funding")
      updates.fundingSources.forEach(f => params.append("funding", f))
    }

    if (updates.cohorts !== undefined) {
      params.delete("cohort")
      updates.cohorts.forEach(c => params.append("cohort", c))
    }

    if (updates.categories !== undefined) {
      params.delete("category")
      updates.categories.forEach(c => params.append("category", c))
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const setSearchQuery = (query: string) => {
    updateFilters({ searchQuery: query })
  }

  const toggleFundingSource = (source: string) => {
    const current = filters.fundingSources
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source]
    updateFilters({ fundingSources: updated })
  }

  const toggleCohort = (cohort: string) => {
    const current = filters.cohorts
    const updated = current.includes(cohort)
      ? current.filter((c) => c !== cohort)
      : [...current, cohort]
    updateFilters({ cohorts: updated })
  }

  const toggleCategory = (category: string) => {
    const current = filters.categories
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category]
    updateFilters({ categories: updated })
  }

  const clearAllFilters = () => {
    router.push("/project-directory", { scroll: false })
  }

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />

      <main className="mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-instrument text-4xl font-bold text-[#444]">Project Directory</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-700">
            A curated showcase of innovative startups and products built by founders and teams from V1 ecosystem.
          </p>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600">Error</h3>
              <p className="mt-1 text-sm text-gray-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          /* Main Layout */
          <ProjectDirectoryLayout
            projects={projects}
            filters={filters}
            filterOptions={filterOptions}
            onSearchChange={setSearchQuery}
            onToggleFunding={toggleFundingSource}
            onToggleCohort={toggleCohort}
            onToggleCategory={toggleCategory}
            onClearAll={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
            onProjectClick={openProjectModal}
          />
        )}
      </main>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeProjectModal} />

      <Footer />
    </div>
  )
}
