interface EventCardProps {
  title: string
  description: string
  image: string
}

export default function EventCard({ title, description, image }: EventCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex gap-4">
      <img src={image || "/placeholder.svg"} alt={title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
