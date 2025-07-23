import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface ProgramSectionProps {
  title: string
  description: string
  imageSrc: string
  buttonText: string
  buttonLink: string
  posterSrc: string
}

export default function ProgramSection({ title, description, imageSrc, buttonText, buttonLink, posterSrc }: ProgramSectionProps) {
  return (
    <div className="overflow-hidden rounded-lg">
      <div className="relative aspect-[16/9] w-full">
        <video
          src={imageSrc}
          autoPlay
          loop
          muted
          playsInline
          className="rounded-lg object-cover w-full h-full"
          poster={posterSrc}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-800">{description}</p>

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
