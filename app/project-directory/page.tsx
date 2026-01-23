"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectModal from "@/components/project-modal"
import SectionNav from "@/components/section-nav"
import ProjectSection from "@/components/project-section"
import { projects } from "@/data/projects"
import { Input } from "@/components/ui/input"
import type { Project } from "@/types/project"

export default function ProjectDirectoryPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [filterSection, setFilterSection] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = searchQuery === "" || project.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSection = filterSection === null || project.sectionName === filterSection
      return matchesSearch && matchesSection
    })
  }, [searchQuery, filterSection])

  const sections = useMemo(() => {
    const groups = new Map<string, { projects: Project[]; type: "funding" | "cohort"; order: number }>()
    filteredProjects.forEach((project) => {
      if (!groups.has(project.sectionName)) {
        groups.set(project.sectionName, {
          projects: [],
          type: project.sectionType,
          order: project.sectionOrder,
        })
      }
      groups.get(project.sectionName)!.projects.push(project)
    })

    return Array.from(groups.entries())
      .map(([name, data]) => ({
        name,
        count: data.projects.length,
        type: data.type,
        order: data.order,
        projects: data.projects,
      }))
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "funding" ? -1 : 1
        // For funding sections, lower order = higher priority (Y-Combinator = 1 comes first)
        // For cohort sections, higher order = more recent (Winter 2026 = 23 comes first)
        return a.type === "funding" ? a.order - b.order : b.order - a.order
      })
  }, [filteredProjects])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute("data-section-name")
            if (sectionName) {
              setActiveSection(sectionName)
            }
          }
        })
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    )

    observerRef.current = observer

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    sectionRefs.current.forEach((ref) => {
      if (observerRef.current) {
        observerRef.current.observe(ref)
      }
    })

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (observerRef.current) {
          observerRef.current.unobserve(ref)
        }
      })
    }
  }, [sections])

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsModalOpen(false)
  }

  const scrollToSection = (sectionName: string) => {
    const element = sectionRefs.current.get(sectionName)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleFilterChange = (section: string | null) => {
    setFilterSection(section)
  }

  const isSectionVisible = (sectionName: string) => {
    return filterSection === null || filterSection === sectionName
  }

  const getSectionNavData = () => {
    const groups = new Map<string, number>()
    projects.forEach((p) => {
      groups.set(p.sectionName, (groups.get(p.sectionName) || 0) + 1)
    })
    return Array.from(groups.entries()).map(([name, count]) => ({
      name,
      count,
      type: projects.find((p) => p.sectionName === name)!.sectionType,
    }))
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-instrument text-4xl font-bold text-[#444]">Project Directory</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-700">
            A curated showcase of innovative startups and products built by founders and teams from the V1 ecosystem.
          </p>
        </div>

        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search projects by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <SectionNav
          sections={getSectionNavData()}
          activeSection={activeSection}
          filterSection={filterSection}
          onFilterChange={handleFilterChange}
          onScrollToSection={scrollToSection}
        />

        {sections.length > 0 ? (
          sections.map((section) => {
            if (!isSectionVisible(section.name)) return null
            return (
              <ProjectSection
                key={section.name}
                ref={(el) => {
                  if (el) {
                    sectionRefs.current.set(section.name, el)
                  }
                }}
                data-section-name={section.name}
                name={section.name}
                projects={section.projects}
                onProjectClick={openProjectModal}
              />
            )
          })
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No projects found matching your criteria.</p>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeProjectModal} />

      <Footer />
    </div>
  )
}
