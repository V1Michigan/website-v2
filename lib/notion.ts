import type { Project } from "@/types/project"

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
    if (a.sectionType !== b.sectionType) {
      return a.sectionType === "funding" ? -1 : 1
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
      fundingSources.add(project.sectionName)
    } else if (project.sectionType === "cohort") {
      cohorts.add(project.sectionName)
    }
    project.categories.forEach(cat => categories.add(cat))
  })
  
  return {
    fundingSources: Array.from(fundingSources).sort(),
    cohorts: Array.from(cohorts).sort(),
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

export function generatePlaceholderImage(_companyName: string, size: string = "64x64"): string {
  return `https://placehold.co/${size}.jpg`
}

export function transformNotionPageToProject(page: any): Project {
  const { id, properties } = page
  const nameInfo = extractTitleInfo(properties.name)
  const hasInvestors = properties.investors?.multi_select?.length > 0
  
  return {
    id,
    title: nameInfo.name,
    description: extractPlainText(properties.description),
    overview: extractPlainText(properties.overview),
    imageSrc: generatePlaceholderImage(nameInfo.name, "64x64"),
    companyName: nameInfo.name,
    companyWebsite: properties.website?.url || nameInfo.link || null,
    categories: extractMultiSelect(properties.categories),
    founders: properties.founders?.multi_select?.map((f: any) => ({
      id: f.id,
      name: f.name,
      role: "Founder",
      imageSrc: generatePlaceholderImage(f.name, "24x24"),
    })) || [],
    investors: hasInvestors ? properties.investors.multi_select?.map((inv: any) => ({
      id: inv.id,
      name: parseInvestorName(inv.name).name,
      type: parseInvestorName(inv.name).type,
      website: null,
    })) : undefined,
    sectionType: hasInvestors ? "funding" : "cohort",
    sectionName: hasInvestors ? properties.investors.multi_select[0].name : properties.cohort?.select?.name || "",
    sectionOrder: getCohortOrder(properties.cohort?.select?.name || ""),
  }
}
