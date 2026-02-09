import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"
import { transformNotionPageToProject, sortProjects, extractFilterOptions, filterProjects } from "@/lib/notion"

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filter parameters
    const searchQuery = searchParams.get("search") || ""
    const fundingSources = searchParams.getAll("funding")
    const cohorts = searchParams.getAll("cohort")
    const categories = searchParams.getAll("category")
    
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID!,
    })

    const pages = response.results || []
    const allProjects = pages.map(transformNotionPageToProject)
    
    // Sort all projects first
    const sortedProjects = sortProjects(allProjects)
    
    // Extract filter options from ALL projects (not filtered)
    const filterOptions = extractFilterOptions(sortedProjects)
    
    // Apply filters
    const filteredProjects = filterProjects(sortedProjects, {
      searchQuery,
      fundingSources,
      cohorts,
      categories,
    })
    
    return NextResponse.json({ 
      projects: filteredProjects,
      filterOptions,
      totalProjects: allProjects.length,
      filteredCount: filteredProjects.length
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error("Notion API error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch projects from Notion" 
    }, { 
      status: 500 
    })
  }
}
