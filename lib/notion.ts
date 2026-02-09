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
  const orderMap: Record<string, number> = {
    "Winter 2026": 23,
    "Fall 2025": 22,
    "Winter 2025": 21,
    "Fall 2024": 20,
    "Winter 2024": 19,
  }
  return orderMap[cohortName] || 0
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
