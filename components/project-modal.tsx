"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, X } from "lucide-react"
import FounderCard from "./founder-card"
import type { Project } from "@/types/project"

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-[#FAF7F2] p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-medium text-gray-800">{project.companyName}</h1>
          </div>

          <a
            href={project.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center text-xs text-gray-600 hover:underline"
          >
            Company website <ArrowRight className="ml-1 h-3 w-3" />
          </a>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.categories.map((category, index) => (
              <span key={index} className="rounded-full bg-[#E9B872] px-3 py-1 text-xs font-medium text-gray-800">
                {category}
              </span>
            ))}
          </div>
        </div>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-medium text-gray-800">Overview</h2>
          <p className="text-sm text-gray-600">{project.overview}</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-medium text-gray-800">Founders</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {project.founders.map((founder) => (
              <FounderCard key={founder.id} name={founder.name} role={founder.role} imageSrc={founder.imageSrc} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
