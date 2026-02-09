import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"
import { transformNotionPageToProject } from "@/lib/notion"

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function GET() {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID!,
    })

    const pages = response.results || []
    const projects = pages.map(transformNotionPageToProject)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Notion API error:", error)
    return NextResponse.json({ error: "Failed to fetch projects from Notion" }, { status: 500 })
  }
}
