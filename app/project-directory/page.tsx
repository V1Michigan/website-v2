"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectCard from "@/components/project-card"
import ProjectModal from "@/components/project-modal"
import { projects } from "@/data/projects"
import { Search } from "lucide-react"
import type { Project } from "@/types/project"

export default function ProjectDirectoryPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-serif text-gray-800">Project Directory</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full rounded-md border border-gray-300 bg-white p-2 pl-10 text-sm outline-none focus:border-gray-500"
            placeholder="Search"
          />
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              imageSrc={project.imageSrc}
              onClick={() => openProjectModal(project)}
            />
          ))}
        </div>
      </main>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeProjectModal} />

      <Footer />
    </div>
  )
}
