import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface ProgramSectionProps {
  title: string
  description: string
  imageSrc: string
  buttonText: string
  buttonLink: string
  posterSrc?: string
  priority?: boolean
}

export default function ProgramSection({ title, description, imageSrc, buttonText, buttonLink, posterSrc, priority = false }: ProgramSectionProps) {
  return (
    <div className="overflow-hidden rounded-lg">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          priority={priority}
        />
      </div>

      <div className="mt-4">
        <p className="text-base text-gray-800">{description}</p>

        <a
          href={buttonLink}
          className="mt-3 inline-flex items-center rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white hover:bg-gray-800"
        >
          {buttonText}
          <ArrowRight className="ml-1.5 h-3.5 w-3.5 -rotate-45" />
        </a>
      </div>
    </div>
  )
}
