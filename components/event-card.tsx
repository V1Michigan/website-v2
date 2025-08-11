import Image from "next/image"

interface EventCardProps {
  title: string
  description: string
  image: string
}

export default function EventCard({ title, description, image }: EventCardProps) {
  return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-white max-w-full">

      <div className="flex-shrink-0 w-full max-w-[300px]">
        <div className="relative aspect-[3/2] w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="rounded-md object-cover"
          />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-medium font-instrument text-[#444] mb-1">{title}</h3>
        <p className="text-m font-inter text-[#444] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
