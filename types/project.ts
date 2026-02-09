export type SectionType = "funding" | "cohort"

export type InvestmentStage = "pre-seed" | "seed" | "series-a" | "accelerator" | "university" | "bootstrapped"

export interface Founder {
  id: string
  name: string
  role: "Founder"
  imageSrc: string
}

export interface Investor {
  id: string
  name: string
  type: "vc" | "accelerator" | "angel" | "university-fund" | "corporate"
  website: string | null
}

export interface Project {
  id: string
  title: string
  description: string
  overview: string
  imageSrc: string
  companyName: string
  companyWebsite: string | null
  categories: string[]
  overview: string
  founders: Founder[]
  investors?: Investor[]
  sectionType: "funding" | "cohort"
  sectionName: string
  sectionOrder: number
}
