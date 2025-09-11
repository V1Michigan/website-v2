export interface PersonSocialLinks {
  calendly?: string
  linkedin?: string
  twitter?: string
  instagram?: string
  website?: string
  email?: string
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


