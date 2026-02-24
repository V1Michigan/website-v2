import type { Project, Investor } from "@/types/project"

export type PrestigeTier = "prestige" | "top" | "high" | "standard"

const INVESTOR_TIERS: Record<string, PrestigeTier> = {
  "Sequoia Capital": "top",
  "General Catalyst": "top",
  "Y Combinator": "prestige",
  "Techstars": "top",
  "SignalFire": "high",
  "Contrary Capital": "high",
  "Pioneer Fund": "high",
  "Agent Fund": "high",
  "Moxxie Ventures": "high",
  "Streamlined Ventures": "high",
  "Lobster Capital": "high",
  "Gold House Ventures": "high",
  "GC Venture Fellows": "high",
  "Z Fellows": "high",
  "Bling": "standard",
  "Heliconia Capital": "standard",
  "Armajaro Holdings": "standard",
  "Transpose Platform Management": "standard",
  "UMich Center for Entrepreneurship": "standard",
  "Zell Lurie Institute": "standard",
  "Paul Graham": "high",
  "Stephen Wolfram": "high",
  "Paul Copplestone": "high",
  "Karim Atiyeh": "high",
}

const TIER_SCORES: Record<PrestigeTier, number> = {
  prestige: 150,
  top: 100,
  high: 50,
  standard: 10,
}

export function getInvestorTier(investorName: string): PrestigeTier {
  const baseName = investorName.includes("Techstars") ? "Techstars" : investorName
  return INVESTOR_TIERS[baseName] || "standard"
}

export function getInvestorPrestigeScore(investorName: string, investorType: string): number {
  const tier = getInvestorTier(investorName)
  const score = TIER_SCORES[tier]
  
  if (investorType === "angel" && tier === "standard") {
    return score + 5
  }
  
  return score
}

export function sortInvestorsByPrestige(investors: Investor[]): Investor[] {
  return [...investors].sort((a, b) => {
    const scoreA = getInvestorPrestigeScore(a.name, a.type)
    const scoreB = getInvestorPrestigeScore(b.name, b.type)
    
    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }
    
    return a.name.localeCompare(b.name)
  })
}

export function getProjectPrestigeScore(project: Project): number {
  if (!project.investors || project.investors.length === 0) {
    return 0
  }
  
  const maxScore = Math.max(
    ...project.investors.map(inv => getInvestorPrestigeScore(inv.name, inv.type))
  )
  
  const countBonus = Math.min(project.investors.length - 1, 3) * 5
  
  return maxScore + countBonus
}

export function extractTitleInfo(titleProp: any): { name: string; link: string | null } {
  const titleText = titleProp.title?.[0]?.text
  if (!titleText) {
    return { name: "", link: null }
  }
  return {
    name: titleText.content || "",
    link: titleText.link?.url || null
  }
}

export function extractPlainText(richTextProp: any): string {
  return richTextProp.rich_text?.[0]?.plain_text || ""
}

export function extractMultiSelect(multiSelectProp: any): string[] {
  return multiSelectProp.multi_select?.map((item: any) => item.name) || []
}

export function parseInvestorName(investorString: string): { name: string; type: string } {
  const match = investorString.match(/^(.+?)\s*\((.+)\)$/)
  if (match) {
    return { name: match[1].trim(), type: match[2].trim() }
  }
  return { name: investorString, type: "unknown" }
}

export function parseCohortName(cohortName: string): string {
  return cohortName.replace(" Product Studio", "")
}

export function getCohortOrder(cohortName: string): number {
  const match = cohortName.match(/(Winter|Fall)\s+(\d{4})/i)
  if (!match) return 0

  const season = match[1]
  const year = parseInt(match[2])

  const seasonPriority: Record<string, number> = {
    "Winter": 2,
    "Fall": 1
  }

  return year * 10 + seasonPriority[season]
}

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const aIsStartup = isStartup(a)
    const bIsStartup = isStartup(b)
    
    if (aIsStartup !== bIsStartup) {
      return aIsStartup ? -1 : 1
    }
    
    const aIsActive = a.isActive ?? false
    const bIsActive = b.isActive ?? false
    
    if (aIsActive !== bIsActive) {
      return bIsActive ? -1 : 1
    }
    
    if (a.sectionType === "funding" && b.sectionType === "funding") {
      const prestigeA = getProjectPrestigeScore(a)
      const prestigeB = getProjectPrestigeScore(b)
      
      if (prestigeA !== prestigeB) {
        return prestigeB - prestigeA
      }
      
      return a.companyName.localeCompare(b.companyName)
    }
    
    return b.sectionOrder - a.sectionOrder
  })
}

export function extractFilterOptions(projects: Project[]) {
  const fundingSources = new Set<string>()
  const cohorts = new Set<string>()
  const categories = new Set<string>()
  
  projects.forEach(project => {
    if (project.sectionType === "funding" && project.sectionName) {
      const topInvestor = project.investors?.[0]
      if (topInvestor && 
          (topInvestor.type === "vc" || topInvestor.type === "accelerator")) {
        fundingSources.add(project.sectionName)
      }
    } else if (project.sectionType === "cohort") {
      cohorts.add(project.sectionName)
    }
    project.categories.forEach(cat => categories.add(cat))
  })
  
  const sortedFundingSources = Array.from(fundingSources).sort((a, b) => {
    if (a === "Y Combinator") return -1
    if (b === "Y Combinator") return 1
    return a.localeCompare(b)
  })
  
  return {
    fundingSources: sortedFundingSources,
    cohorts: Array.from(cohorts).sort((a, b) => getCohortOrder(b) - getCohortOrder(a)),
    categories: Array.from(categories).sort(),
  }
}

export function filterProjects(projects: Project[], filters: {
  searchQuery?: string
  fundingSources?: string[]
  cohorts?: string[]
  categories?: string[]
}) {
  return projects.filter((project) => {
    const searchQuery = filters.searchQuery?.toLowerCase() || ""
    const matchesSearch = 
      searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery) ||
      project.companyName.toLowerCase().includes(searchQuery)

    const matchesFunding = 
      !filters.fundingSources?.length || 
      (project.sectionType === "funding" && filters.fundingSources.includes(project.sectionName))

    const matchesCohort = 
      !filters.cohorts?.length || 
      (project.sectionType === "cohort" && filters.cohorts.includes(project.sectionName))

    const matchesCategory = 
      !filters.categories?.length || 
      project.categories.some((category) => filters.categories!.includes(category))

    return matchesSearch && matchesFunding && matchesCohort && matchesCategory
  })
}

export function isStartup(project: Project): boolean {
  return project.sectionType === "funding" && (project.investors?.length ?? 0) > 0
}

export function getFounderRole(project: Project, founderCount: number): string {
  const isProjectStartup = isStartup(project)
  const hasMultipleFounders = founderCount > 1
  
  if (isProjectStartup) {
    return hasMultipleFounders ? "Co-Founder" : "Founder"
  } else {
    return hasMultipleFounders ? "Co-Creator" : "Creator"
  }
}

export function sanitizeProjectName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\s.-]/g, '').replace(/\s+/g, '-').toLowerCase()
}

export function getExtension(url: string): string {
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
  return match ? match[1].toLowerCase() : ''
}

export function convertToJpgIfNeeded(filename: string): string {
  const ext = getExtension(filename)
  return (ext !== 'jpg' && ext !== 'jpeg') ? filename.replace(/\.[^.]+$/, '.jpg') : filename
}

export function extractLogoUrl(page: any): string | null {
  const logoFiles = page.properties?.logo?.files
  if (!logoFiles || logoFiles.length === 0) {
    return null
  }
  
  const logoFile = logoFiles[0]
  if (logoFile.type !== 'file' || !logoFile.file?.url) {
    return null
  }
  
  return logoFile.file.url
}

export function generatePlaceholderImage(_companyName: string, size: string = "64x64"): string {
  return `/founder_placeholder_pfp.jpg`
}

export function extractPfpUrls(page: any): string[] {
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

export function sanitizeFounderName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\s.-]/g, '').replace(/\s+/g, '-').toLowerCase()
}

export function generateFounderImagePath(companyName: string, founderName: string): string {
  const sanitizedCompany = sanitizeProjectName(companyName)
  const sanitizedFounder = sanitizeFounderName(founderName)
  return `/founders/${sanitizedCompany}/${sanitizedFounder}.jpg`
}

export function sanitizeUrl(url: string | null, field: string): string | null {
  if (!url) return null
  
  const trimmed = url.trim()
  if (!trimmed) return null
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  
  if (!trimmed.includes('.') || trimmed.startsWith('.')) {
    console.warn(`⚠️  Invalid URL format for ${field}: "${url}" - missing valid domain structure`)
    return null
  }
  
  console.log(`🔧 Sanitizing URL for ${field}: "${url}" → "https://${trimmed}"`)
  return `https://${trimmed}`
}

export function transformNotionPageToProject(page: any): Project {
  const { id, properties } = page
  const nameInfo = extractTitleInfo(properties.name)
  
  if (!nameInfo.name) {
    throw new Error(`Project has no name - skipping`)
  }
  
  const hasInvestors = properties.investors?.multi_select?.length > 0
  const foundersList = properties.founders?.multi_select || []
  const contactsList = properties.contacts?.multi_select || []
  
  const rawInvestors = hasInvestors ? properties.investors.multi_select?.map((inv: any) => ({
    id: inv.id,
    name: parseInvestorName(inv.name).name,
    type: parseInvestorName(inv.name).type,
    website: sanitizeUrl(null, `website of ${inv.name}`),
  })) : undefined
  
  const sortedInvestors = rawInvestors ? sortInvestorsByPrestige(rawInvestors) : undefined
  
  const logoUrl = extractLogoUrl(page)
  
  if (!logoUrl) {
    throw new Error(`Project "${nameInfo.name}" has no logo - failing build`)
  }
  
  const extension = getExtension(logoUrl)
  const sanitizedName = sanitizeProjectName(nameInfo.name)
  const logoFilename = `${sanitizedName}.${extension}`
  const convertedFilename = convertToJpgIfNeeded(logoFilename)
  const logoPath = `/projects/${convertedFilename}`
  
  const pfpUrls = extractPfpUrls(page)
  
  const sectionType = hasInvestors ? "funding" : "cohort"
  const tempProject = {
    sectionType,
    investors: sortedInvestors,
    founders: foundersList,
  }
  
  const updatedAt = properties.updatedAt?.date?.start || properties.last_edited_time
  const isActive = properties.isActive?.checkbox ?? false
  
  return {
    id,
    title: nameInfo.name,
    description: extractPlainText(properties.description),
    overview: extractPlainText(properties.overview),
    imageSrc: logoPath,
    companyName: nameInfo.name,
    companyWebsite: sanitizeUrl(properties.website?.url || nameInfo.link || null, `companyWebsite of "${nameInfo.name}"`),
    categories: extractMultiSelect(properties.categories),
    founders: foundersList.map((f: any, index: number) => ({
      id: f.id,
      name: f.name,
      role: getFounderRole(tempProject as any, foundersList.length),
      imageSrc: pfpUrls[index]
        ? generateFounderImagePath(nameInfo.name, f.name)
        : `/founder_placeholder_pfp.jpg`,
      contactUrl: sanitizeUrl(contactsList[index]?.name || null, `contactUrl of "${f.name}" in "${nameInfo.name}"`),
    })) || [],
    investors: sortedInvestors,
    sectionType,
    sectionName: hasInvestors
      ? sortedInvestors?.[0]?.name || ""
      : properties.cohort?.select?.name || "",
    sectionOrder: getCohortOrder(properties.cohort?.select?.name || ""),
    updatedAt,
    isActive,
  }
}
