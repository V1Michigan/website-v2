"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectModal from "@/components/project-modal"
import ProjectDirectoryLayout from "./components/ProjectDirectoryLayout"
import { useProjectFilters } from "./hooks/useProjectFilters"
import type { Project } from "@/types/project"

export default function ProjectDirectoryPage() {
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
  } = useProjectFilters()

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsModalOpen(false)
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

        {/* Main Layout */}
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
      </main>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeProjectModal} />

      <Footer />
    </div>
  )
}
