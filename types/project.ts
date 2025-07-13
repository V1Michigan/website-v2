export interface Founder {
  id: string
  name: string
  role: string
  imageSrc: string
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
}
