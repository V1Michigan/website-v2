import ProgramCard from "./program-card"

export default function WhatWeDoSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ProgramCard
        title="Product Studio"
        description="How Amy built a startup in 6 weeks."
        imageSrc="/product-studio.jpg?height=160&width=300"
        href="https://v1michigan.com/projects"
      />

      <ProgramCard
        title="Build Blue"
        description="Follow __'s journey in shipping __'s at Demo Day."
        imageSrc="/build-blue.jpg?height=160&width=300"
        href="https://v1michigan.com/ship-it"
      />

      <ProgramCard
        title="Ship-It"
        description="Work in a collaborative space of engineers, tinkerers, and artists."
        imageSrc="/ship-its.png?height=160&width=300"
        href="https://v1michigan.com/ship-it"
      />

      <ProgramCard
        title="Startup Fair"
        description="Get into the startup space by meeting founders."
        imageSrc="/startup-fair.jpg?height=160&width=300"
        href="https://startupfair.v1michigan.com/"
      />
    </div>
  )
}
