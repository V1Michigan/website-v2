import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"
import type { Project } from "@/types/project"
import { filterProjects } from "@/lib/notion"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const dataPath = join(process.cwd(), "data/projects-data.json")
    
    if (!existsSync(dataPath)) {
      console.error("Projects data file not found:", dataPath)
      return NextResponse.json({ 
        error: "Projects data not found. Please run 'pnpm build:projects' first." 
      }, { 
        status: 503 
      })
    }

    const data = JSON.parse(readFileSync(dataPath, "utf-8"))
    const allProjects = data.projects as Project[]
    const cachedFilterOptions = data.filterOptions
    
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
