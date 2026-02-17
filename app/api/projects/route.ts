import { NextResponse } from "next/server"
import type { Project } from "@/types/project"
import { filterProjects } from "@/lib/notion"
import projectsData from "@/data/projects-data.json"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const allProjects = projectsData.projects as Project[]
    const cachedFilterOptions = projectsData.filterOptions
    
    const searchQuery = searchParams.get("search") || ""
    const fundingSources = searchParams.getAll("funding")
    const cohorts = searchParams.getAll("cohort")
    const categories = searchParams.getAll("category")
    
    const filteredProjects = filterProjects(allProjects, {
      searchQuery,
      fundingSources,
      cohorts,
      categories,
    })
    
    return NextResponse.json({ 
      projects: filteredProjects,
      filterOptions: cachedFilterOptions,
      totalProjects: allProjects.length,
      filteredCount: filteredProjects.length
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error("Error reading projects data:", error)
    return NextResponse.json({ 
      error: "Failed to read projects data" 
    }, { 
      status: 500 
    })
  }
}
