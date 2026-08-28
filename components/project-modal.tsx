"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowUpRight, X } from "lucide-react"
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
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Image
                src={project.imageSrc || "/placeholder.svg"}
                alt={`${project.companyName} logo`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            {project.companyWebsite ? (
              <a
                href={project.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-3xl font-medium text-gray-800 underline decoration-gray-800 underline-offset-4 transition-colors hover:text-gray-600 hover:decoration-gray-600"
              >
                {project.title}
                <ArrowUpRight className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <h1 className="text-3xl font-medium text-gray-800">{project.title}</h1>
            )}
          </div>

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

        {project.founders.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-medium text-gray-800">Founders</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {project.founders.map((founder) => (
                <FounderCard key={founder.id} name={founder.name} role={founder.role} imageSrc={founder.imageSrc} contactUrl={founder.contactUrl} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
