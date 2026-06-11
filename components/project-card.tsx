"use client"

import Image from "next/image"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  imageSrc: string
  onClick: () => void
}

export default function ProjectCard({ id, title, description, imageSrc, onClick }: ProjectCardProps) {
  return (
    <div 
      role="button"
      tabIndex={0}
      className="flex flex-col cursor-pointer transition-transform duration-300 hover:scale-102" 
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-300">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
      </div>
      <div className="mt-3">
        <h3 className="text-base font-medium">{title}</h3>
        <p className="mt-1 text-xs text-gray-600">{description}</p>
      </div>
    </div>
  )
}
