import Image from "next/image"

interface EventCardProps {
  title: string
  description: string
  image: string
}

export default function EventCard({ title, description, image }: EventCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white max-w-full">
      <div className="flex-shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={240}
          height={240}
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
