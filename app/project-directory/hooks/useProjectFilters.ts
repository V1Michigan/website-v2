import { useState, useMemo } from "react"
import type { Project } from "@/types/project"

export interface FilterState {
  searchQuery: string
  fundingSources: string[]
  cohorts: string[]
  categories: string[]
}

export interface ProjectFiltersReturn {
  filters: FilterState
  filteredProjects: Project[]
  filterOptions: {
    fundingSources: string[]
    cohorts: string[]
    categories: string[]
  }
  setSearchQuery: (_query: string) => void
  toggleFundingSource: (_source: string) => void
  toggleCohort: (_cohort: string) => void
  toggleCategory: (_category: string) => void
  clearAllFilters: () => void
  hasActiveFilters: boolean
}

export const useProjectFilters = (projects: Project[] = []): ProjectFiltersReturn => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    fundingSources: [],
    cohorts: [],
    categories: [],
  })

  // Filter options computed from projects
  const filterOptions = useMemo(() => {
    if (!projects || projects.length === 0) return { fundingSources: [], cohorts: [], categories: [] }
    
    const fundingSources = new Set<string>()
    const cohorts = new Set<string>()
    const categories = new Set<string>()
    
    projects.forEach(project => {
      if (project.sectionType === "funding" && project.sectionName) {
        fundingSources.add(project.sectionName)
      } else if (project.sectionType === "cohort") {
        cohorts.add(project.sectionName)
      }
      project.categories.forEach(cat => categories.add(cat))
    })
    
    return {
      fundingSources: Array.from(fundingSources).sort(),
      cohorts: Array.from(cohorts).sort(),
      categories: Array.from(categories).sort(),
    }
  }, [projects])

  // Filter projects based on current filter state
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = 
        filters.searchQuery === "" || 
        project.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        project.companyName.toLowerCase().includes(filters.searchQuery.toLowerCase())

      const matchesFunding = 
        filters.fundingSources.length === 0 || 
        (project.sectionType === "funding" && filters.fundingSources.includes(project.sectionName))

      const matchesCohort = 
        filters.cohorts.length === 0 || 
        (project.sectionType === "cohort" && filters.cohorts.includes(project.sectionName))

      const matchesCategory = 
        filters.categories.length === 0 || 
        project.categories.some((category) => filters.categories.includes(category))

      return matchesSearch && matchesFunding && matchesCohort && matchesCategory
    })
  }, [filters, projects])

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
