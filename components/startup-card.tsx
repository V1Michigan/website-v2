interface StartupCardProps {
  image: string
  name: string
  domain: string
}

export default function StartupCard({ image, name, domain }: StartupCardProps) {
  return (
    <div className="bg-white/10 rounded-xl p-4 text-center">
      <div className="w-20 h-20 rounded-lg overflow-hidden mb-3 mx-auto flex items-center justify-center">
        <img src={image || "/placeholder.svg"} alt={`${name} logo`} className="w-20 h-20 object-contain" />
      </div>
      <div className="text-sm font-medium font-inter text-[#FEF9F5] mb-1">{name}</div>
      <div className="text-xs font-medium font-inter text-[#CEC9C5]">{domain}</div>
    </div>
  )
}
