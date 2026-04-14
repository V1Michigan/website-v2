import { NextResponse, NextRequest } from "next/server"
import type { Project } from "@/types/project"
import { filterProjects } from "@/libs/notion"

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(`${_request.nextUrl.origin}/projects-data.json`)
    if (!response.ok) {
      throw new Error("Failed to fetch projects data")
    }
 
    const data = await response.json()
    const allProjects = data.projects as Project[]
    const cachedFilterOptions = data.filterOptions
    
    return NextResponse.json({ 
      projects: allProjects,
      filterOptions: cachedFilterOptions,
      totalProjects: allProjects.length,
      filteredCount: allProjects.length
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error("Error in projects API:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error
    })
    
    return NextResponse.json({ 
      error: "Failed to process projects data",
      message: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.name : typeof error,
    }, { 
      status: 500 
    })
  }
}
