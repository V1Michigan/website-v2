import Image from "next/image"

interface EventCardProps {
  title: string
  description: string
  image: string
}

export default function EventCard({ title, description, image }: EventCardProps) {
  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm h-full">
      <div className="mb-4">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={240}
          height={180}
          className="rounded-md object-cover w-full h-32 sm:h-40"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-medium font-instrument text-[#444] mb-2">{title}</h3>
        <p className="text-sm font-inter text-[#444] leading-relaxed flex-1">{description}</p>
      </div>
    </div>
  )
}
