import { Client } from "@notionhq/client"
import {
  transformNotionPageToProject,
  sortProjects,
  extractFilterOptions,
  extractLogoUrl,
} from "@/lib/notion"
import { writeFileSync, mkdirSync, existsSync, createWriteStream, unlinkSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import https from "https"
import sharp from "sharp"
import { tmpdir } from "os"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function downloadLogo(url: string, outputPath: string): Promise<void> {
  const tempPath = join(tmpdir(), `temp-logo-${Date.now()}`)
  
  return new Promise<void>((resolve, reject) => {
    const fileStream = createWriteStream(tempPath)
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fileStream.destroy()
        reject(new Error(`Failed to download logo: ${response.statusCode}`))
        return
      }
      
      response.pipe(fileStream)
      fileStream.on('finish', async () => {
        fileStream.close()
        try {
          await sharp(tempPath)
            .resize(256, 256, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toFile(outputPath)
          unlinkSync(tempPath)
          resolve()
        } catch (error) {
          unlinkSync(tempPath)
          reject(error)
        }
      })
      fileStream.on('error', (err: Error) => {
        fileStream.destroy()
        reject(err)
      })
    }).on('error', (err: Error) => {
      fileStream.destroy()
      reject(err)
    })
  })
}

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
    
    console.log("🔄 Creating URL map...")
    const logoUrlMap: Record<string, string> = {}
    pages.forEach((page: any) => {
      const logoUrl = extractLogoUrl(page)
      if (logoUrl) {
        logoUrlMap[page.id] = logoUrl
      }
    })
    
    console.log("🔄 Transforming pages to projects...")
    const allProjects = pages.map(transformNotionPageToProject)
    
    console.log("📊 Sorting projects...")
    const sortedProjects = sortProjects(allProjects)
    
    console.log("🏷️ Extracting filter options...")
    const filterOptions = extractFilterOptions(sortedProjects)
    
    const projectsDir = join(__dirname, "../public/projects")
    if (!existsSync(projectsDir)) {
      mkdirSync(projectsDir, { recursive: true })
      console.log(`📁 Created directory: ${projectsDir}`)
    }
    
    console.log("📥 Downloading logos...")
    let downloadedCount = 0
    let failedCount = 0
    
    for (const project of allProjects) {
      const logoPath = join(__dirname, `../public${project.imageSrc}`)
      const notionUrl = logoUrlMap[project.id]
      
      if (!project.imageSrc.startsWith('/projects/')) {
        console.error(`❌ Project "${project.title}" has no logo - failing build`)
        process.exit(1)
      }
      
      if (!notionUrl) {
        console.error(`⚠️  Failed to download logo for "${project.title}": No Notion URL found`)
        failedCount++
        continue
      }
      
      try {
        await downloadLogo(notionUrl, logoPath)
        downloadedCount++
        const progress = Math.floor((downloadedCount / allProjects.length) * 100)
        process.stdout.write(`\r📥 Downloading logos... [${'█'.repeat(Math.floor(progress / 2.5))}${'░'.repeat(40 - Math.floor(progress / 2.5))}] ${progress}% (${downloadedCount}/${allProjects.length})`)
      } catch (error) {
        failedCount++
        console.error(`⚠️  Failed to download logo for "${project.title}": ${(error as Error).message}`)
      }
    }
    
    console.log(`\n✅ Downloaded ${downloadedCount} logos to ${projectsDir}/`)
    if (failedCount > 0) {
      console.log(`⚠️  Failed to download ${failedCount} logos`)
    }
    
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
