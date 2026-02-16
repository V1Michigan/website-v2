import { Client } from "@notionhq/client"
import {
  transformNotionPageToProject,
  sortProjects,
  extractFilterOptions,
  extractLogoUrl,
  sanitizeProjectName,
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

function extractPfpUrls(page: any): string[] {
  const pfpFiles = page.properties?.pfps?.files
  if (!pfpFiles || pfpFiles.length === 0) {
    return []
  }
  
  const urls: string[] = []
  pfpFiles.forEach((file: any) => {
    if (file.type === 'file' && file.file?.url) {
      urls.push(file.file.url)
    }
  })
  return urls
}

async function downloadFounderProfile(pfpUrl: string, outputPath: string): Promise<void> {
  const tempPath = join(tmpdir(), `temp-founder-${Date.now()}`)
  
  return new Promise<void>((resolve, reject) => {
    const fileStream = createWriteStream(tempPath)
    
    https.get(pfpUrl, (response) => {
      if (response.statusCode !== 200) {
        fileStream.destroy()
        reject(new Error(`Failed to download founder profile: ${response.statusCode}`))
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

function getProjectFoundersPath(project: any): string {
  const name = project.properties?.name?.title?.[0]?.text?.content || ""
  const sanitizedName = sanitizeProjectName(name)
  return join(__dirname, `../public/founders/${sanitizedName}`)
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
    const transformedProjects: any[] = []
    const skippedPages: any[] = []
    
    for (const page of pages) {
      try {
        const project = transformNotionPageToProject(page)
        transformedProjects.push(project)
      } catch (error) {
        const errorMessage = (error as Error).message
        if (errorMessage.includes('no name')) {
          skippedPages.push(page)
          console.log(`⏭️  Skipping page with no name`)
        } else {
          throw error
        }
      }
    }
    
    const allProjects = transformedProjects
    console.log(`✅ Transformed ${allProjects.length} projects (skipped ${skippedPages.length} invalid pages)`)
    
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
    
    console.log("🔄 Extracting founder profile picture URLs...")
    const pfpUrlMap: Record<string, string[]> = {}
    pages.forEach((page: any) => {
      pfpUrlMap[page.id] = extractPfpUrls(page)
    })
    
    const foundersDir = join(__dirname, "../public/founders")
    if (!existsSync(foundersDir)) {
      mkdirSync(foundersDir, { recursive: true })
      console.log(`📁 Created directory: ${foundersDir}`)
    }
    
    console.log("📥 Downloading founder profile pictures...")
    let downloadedFounders = 0
    let skippedFounders = 0
    let failedFounders = 0
    let totalFounders = 0
    
    allProjects.forEach(project => {
      totalFounders += project.founders.length
    })
    
    let founderProgress = 0
    
    for (const project of allProjects) {
      const projectFoundersPath = getProjectFoundersPath({
        properties: {
          name: {
            title: [{ text: { content: project.companyName } }]
          }
        }
      })
      const pfpUrls = pfpUrlMap[project.id] || []
      
      if (!existsSync(projectFoundersPath)) {
        mkdirSync(projectFoundersPath, { recursive: true })
      }
      
      for (const [index, founder] of project.founders.entries()) {
        const pfpUrl = pfpUrls[index]
        
        if (!pfpUrl || founder.imageSrc.includes('placehold.co')) {
          skippedFounders++
          founderProgress++
          continue
        }
        
        const outputPath = join(__dirname, `../public${founder.imageSrc}`)
        
        if (existsSync(outputPath)) {
          skippedFounders++
          founderProgress++
          continue
        }
        
        try {
          await downloadFounderProfile(pfpUrl, outputPath)
          downloadedFounders++
          founderProgress++
          const progress = Math.floor((founderProgress / totalFounders) * 100)
          process.stdout.write(`\r📥 Downloading founders... [${'█'.repeat(Math.floor(progress / 2.5))}${'░'.repeat(40 - Math.floor(progress / 2.5))}] ${progress}% (${founderProgress}/${totalFounders})`)
        } catch (error) {
          failedFounders++
          console.error(`\n⚠️  Failed to download founder profile for "${founder.name}" in "${project.title}": ${(error as Error).message}`)
        }
      }
    }
    
    console.log(`\n✅ Downloaded ${downloadedFounders} founder profiles to ${foundersDir}/`)
    console.log(`⏭️  Skipped ${skippedFounders} existing or placeholder profiles`)
    if (failedFounders > 0) {
      console.log(`⚠️  Failed to download ${failedFounders} founder profiles`)
    }
    
    if (failedFounders > 0) {
      console.error("❌ Build failed: Some founder profile pictures could not be downloaded")
      process.exit(1)
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
