interface TeamMemberProps {
  image: string
  name?: string
  index: number
}

export default function TeamMember({ image, name, index }: TeamMemberProps) {
  return (
    <img
      src={image || "/placeholder.svg"}
      alt={name || `Team member ${index + 1}`}
      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
    />
  )
}
