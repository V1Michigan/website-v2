export type SectionType = "funding" | "cohort"

export type InvestmentStage = "pre-seed" | "seed" | "series-a" | "accelerator" | "university" | "bootstrapped"

export interface Founder {
  id: string
  name: string
  role: string
  imageSrc: string
}

export interface Investor {
  id: string
  name: string
  type: "vc" | "accelerator" | "angel" | "university-fund" | "corporate"
  website?: string
  investmentStage?: string
}

export interface Project {
  id: string
  title: string
  description: string
  imageSrc: string
  companyName: string
  companyWebsite: string
  categories: string[]
  overview: string
  founders: Founder[]
  investors?: Investor[]
  fundingAmount?: number
  fundingStage?: InvestmentStage
  valuation?: number
  lastFundingDate?: string
  sectionType: SectionType
  sectionName: string
  sectionOrder: number
}
