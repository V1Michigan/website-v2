import { useState, useMemo } from "react"
import { projects } from "@/data/projects"
import type { Project, SectionType } from "@/types/project"

export interface FilterState {
  searchQuery: string
  fundingSources: string[]
  cohorts: string[]
  categories: string[]
}

export const useProjectFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    fundingSources: [],
    cohorts: [],
    categories: [],
  })

  // Get all available filter options
  const filterOptions = useMemo(() => {
    const fundingSources = new Set<string>()
    const cohorts = new Set<string>()
    const categories = new Set<string>()

    projects.forEach((project) => {
      if (project.sectionType === "funding") {
        fundingSources.add(project.sectionName)
      } else if (project.sectionType === "cohort") {
        cohorts.add(project.sectionName)
      }
      project.categories.forEach((category) => categories.add(category))
    })

    return {
      fundingSources: Array.from(fundingSources).sort(),
      cohorts: Array.from(cohorts).sort((a, b) => {
        // Sort cohorts by recency (most recent first)
        const cohortOrder = {
          "Winter 2026 Product Studio Cohort": 23,
          "Fall 2025 Product Studio Cohort": 22,
          "Spring 2025 Product Studio Cohort": 21,
          "Winter 2025 Product Studio Cohort": 21,
          "Fall 2024 Product Studio Cohort": 20,
        }
        const orderA = cohortOrder[a as keyof typeof cohortOrder] || 0
        const orderB = cohortOrder[b as keyof typeof cohortOrder] || 0
        return orderB - orderA
      }),
      categories: Array.from(categories).sort(),
    }
  }, [])

  // Filter projects based on current filter state
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const matchesSearch = 
        filters.searchQuery === "" || 
        project.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        project.companyName.toLowerCase().includes(filters.searchQuery.toLowerCase())

      // Funding source filter
      const matchesFunding = 
        filters.fundingSources.length === 0 || 
        (project.sectionType === "funding" && filters.fundingSources.includes(project.sectionName))

      // Cohort filter
      const matchesCohort = 
        filters.cohorts.length === 0 || 
        (project.sectionType === "cohort" && filters.cohorts.includes(project.sectionName))

      // Category filter
      const matchesCategory = 
        filters.categories.length === 0 || 
        project.categories.some((category) => filters.categories.includes(category))

      return matchesSearch && matchesFunding && matchesCohort && matchesCategory
    })
  }, [filters])

  // Update filter functions
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
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
    setFilters({
      searchQuery: "",
      fundingSources: [],
      cohorts: [],
      categories: [],
    })
  }

  const hasActiveFilters = 
    filters.searchQuery !== "" ||
    filters.fundingSources.length > 0 ||
    filters.cohorts.length > 0 ||
    filters.categories.length > 0

  return {
    filters,
    filteredProjects,
    filterOptions,
    setSearchQuery,
    toggleFundingSource,
    toggleCohort,
    toggleCategory,
    clearAllFilters,
    hasActiveFilters,
  }
}