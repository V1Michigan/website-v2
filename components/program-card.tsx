import Image from "next/image"
import Link from "next/link"

interface ProgramCardProps {
  title: string
  description: string
  imageSrc: string
  href: string
}

export default function ProgramCard({ title, description, imageSrc, href }: ProgramCardProps) {
  return (
    <Link href={href} className="block">
      <div className="relative overflow-hidden rounded-lg aspect-[3/2] cursor-pointer transition-transform duration-300 hover:scale-102">
        <Image src={imageSrc || "/placeholder.svg"} alt={`${title} event`} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3 text-white">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-200">{description}</p>
        </div>
      </div>
    </Link>
  )
}
