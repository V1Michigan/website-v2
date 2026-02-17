import { NextResponse, NextRequest } from "next/server"
import type { Project } from "@/types/project"
import { filterProjects } from "@/lib/notion"

export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get("search") || ""
    const fundingSources = request.nextUrl.searchParams.getAll("funding")
    const cohorts = request.nextUrl.searchParams.getAll("cohort")
    const categories = request.nextUrl.searchParams.getAll("category")
    
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'production'
        ? 'https://v1-landing-page.netlify.app'
        : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/projects-data.json`)
    if (!response.ok) {
      throw new Error("Failed to fetch projects data")
    }

    const data = await response.json()
    const allProjects = data.projects as Project[]
    const cachedFilterOptions = data.filterOptions
    
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
