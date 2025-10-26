export interface PersonSocialLinks {
  linkedin?: string
  twitter?: string
  instagram?: string
  website?: string
}

export interface Person {
  id: string
  name: string
  role: string
  imageSrc: string
  shortBio: string
  fullBio: string
  tags: string[]
  social: PersonSocialLinks
}


