import { Client } from "@notionhq/client"
import {
  transformNotionPageToProject,
  sortProjects,
  extractFilterOptions,
} from "@/lib/notion"
import { writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function buildProjectsData() {
  console.log("🚀 Starting projects data build...")

  if (!process.env.NOTION_API_KEY) {
    console.error("❌ NOTION_API_KEY not found in environment variables")
    process.exit(1)
  }

  if (!process.env.NOTION_DATA_SOURCE_ID) {
    console.error("❌ NOTION_DATA_SOURCE_ID not found in environment variables")
    process.exit(1)
  }

  try {
    console.log("📥 Fetching data from Notion...")
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID!,
    })

    const pages = response.results || []
    console.log(`✅ Fetched ${pages.length} pages from Notion`)

    console.log("🔄 Transforming pages to projects...")
    const allProjects = pages.map(transformNotionPageToProject)

    console.log("📊 Sorting projects...")
    const sortedProjects = sortProjects(allProjects)

    console.log("🏷️ Extracting filter options...")
    const filterOptions = extractFilterOptions(sortedProjects)

    const outputPath = join(__dirname, "../data/projects-data.json")
    const outputData = {
      timestamp: new Date().toISOString(),
      projects: sortedProjects,
      filterOptions,
      totalProjects: allProjects.length,
    }

    console.log("💾 Writing data to JSON file...")
    writeFileSync(outputPath, JSON.stringify(outputData, null, 2))

    console.log(`✅ Successfully wrote data to ${outputPath}`)
    console.log(`   - Total projects: ${allProjects.length}`)
    console.log(`   - Funding sources: ${filterOptions.fundingSources.length}`)
    console.log(`   - Cohorts: ${filterOptions.cohorts.length}`)
    console.log(`   - Categories: ${filterOptions.categories.length}`)
    console.log(`   - Timestamp: ${outputData.timestamp}`)
  } catch (error) {
    console.error("❌ Error building projects data:", error)
    process.exit(1)
  }
}

buildProjectsData()
