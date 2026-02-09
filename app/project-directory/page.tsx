"use client";

import { useEffect, useState, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectModal from "@/components/project-modal"
import ProjectDirectoryLayout from "./components/ProjectDirectoryLayout"
import type { Project } from "@/types/project"
import { useProjects } from "@/hooks/useProjects"

export default function ProjectDirectoryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const urlSearchQuery = searchParams?.get("search") || ""
  const [localSearchQuery, setLocalSearchQuery] = useState(urlSearchQuery)

  useEffect(() => {
    setLocalSearchQuery(urlSearchQuery)
  }, [urlSearchQuery])

  const debouncedUpdateURL = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    return (value: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const params = new URLSearchParams(searchParams?.toString() || "")
        if (value.trim()) {
          params.set("search", value.trim())
        } else {
          params.delete("search")
        }
        router.replace(`?${params.toString()}`, { scroll: false })
      }, 300)
    }
  }, [searchParams, router])

  const setSearchQuery = useCallback((query: string) => {
    setLocalSearchQuery(query)
    debouncedUpdateURL(query)
  }, [debouncedUpdateURL])

  const filters = useMemo(
    () => ({
      searchQuery: urlSearchQuery,
      fundingSources: searchParams?.getAll("funding") || [],
      cohorts: searchParams?.getAll("cohort") || [],
      categories: searchParams?.getAll("category") || [],
    }),
    [urlSearchQuery, searchParams]
  )

  const { projects, filterOptions, isLoading, error } = useProjects(filters)

  const updateFilters = useCallback((updates: {
    fundingSources?: string[]
    cohorts?: string[]
    categories?: string[]
  }) => {
    const params = new URLSearchParams(searchParams?.toString() || "")

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
  }, [searchParams, router])

  const toggleFundingSource = useCallback((source: string) => {
    const current = filters.fundingSources
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source]
    updateFilters({ fundingSources: updated })
  }, [filters.fundingSources, updateFilters])

  const toggleCohort = useCallback((cohort: string) => {
    const current = filters.cohorts
    const updated = current.includes(cohort)
      ? current.filter((c) => c !== cohort)
      : [...current, cohort]
    updateFilters({ cohorts: updated })
  }, [filters.cohorts, updateFilters])

  const toggleCategory = useCallback((category: string) => {
    const current = filters.categories
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category]
    updateFilters({ categories: updated })
  }, [filters.categories, updateFilters])

  const openProjectModal = useCallback((project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }, [])

  const closeProjectModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }, [])

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
              <p className="mt-1 text-sm text-gray-700">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
         ) : (
          /* Main Layout */
          <ProjectDirectoryLayout
            projects={projects}
            filters={{
              ...filters,
              searchQuery: localSearchQuery
            }}
            filterOptions={filterOptions}
            onSearchChange={setSearchQuery}
            onToggleFunding={toggleFundingSource}
            onToggleCohort={toggleCohort}
            onToggleCategory={toggleCategory}
            onProjectClick={openProjectModal}
            isLoading={isLoading}
          />
        )}
      </main>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeProjectModal} />

      <Footer />
    </div>
  )
}
