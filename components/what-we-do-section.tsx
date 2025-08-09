import ProgramCard from "./program-card"

export default function WhatWeDoSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ProgramCard
        title="Product Studio"
        description="Build something you're passionate about in 8 weeks."
        imageSrc="/product-studio.jpg?height=160&width=300"
        href="https://v1michigan.com/projects"
      />

      <ProgramCard
        title="Build Blue"
        description="Season of community events ft. meetups, demo days, ..."
        imageSrc="/build-blue.jpg?height=160&width=300"
        href="https://v1michigan.com/events"
      />

      <ProgramCard
        title="Ship-It"
        description="A workspace for engineers, tinkerers, and artists."
        imageSrc="/ship-its.png?height=160&width=300"
        href="https://v1michigan.com/ship-it"
      />

      <ProgramCard
        title="Startup Fair"
        description="Where the best startups hire the best talent."
        imageSrc="/startup-fair.jpg?height=160&width=300"
        href="https://startupfair.v1michigan.com/"
      />
    </div>
  )
}
