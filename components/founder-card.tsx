import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface FounderCardProps {
  name: string
  role: string
  imageSrc: string
}

export default function FounderCard({ name, role, imageSrc }: FounderCardProps) {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-[1/1] w-full overflow-hidden rounded-md bg-gray-300">
        <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-gray-600">{role}</p>
        <button className="mt-2 inline-flex items-center rounded-md bg-[#E9B872] px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-[#E5AD5F]">
          Connect <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
