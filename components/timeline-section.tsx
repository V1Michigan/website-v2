import type React from "react"

interface TimelineSectionProps {
  title: string
  children: React.ReactNode
}

export default function TimelineSection({ title, children }: TimelineSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-[#F5A623]"></div>
        </div>

        <div className="ml-8 md:ml-10">
          <h2 className="text-xl md:text-2xl font-serif mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  )
}
