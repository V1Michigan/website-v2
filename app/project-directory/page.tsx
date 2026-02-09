"use client";

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectModal from "@/components/project-modal"
import ProjectDirectoryLayout from "./components/ProjectDirectoryLayout"
import type { Project } from "@/types/project"
import { useProjectFilters } from "./hooks/useProjectFilters"

export default function ProjectDirectoryPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    filters,
    filteredProjects,
    filterOptions,
    setSearchQuery,
    toggleFundingSource,
    toggleCohort,
    toggleCategory,
    clearAllFilters,
    hasActiveFilters,
  } = useProjectFilters(projects)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        setProjects(data.projects || [])
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

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
            A curated showcase of innovative startups and products built by founders and teams from the V1 ecosystem.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          /* Main Layout */
          <ProjectDirectoryLayout
            projects={filteredProjects}
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
