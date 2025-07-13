import ProgramCard from "./program-card"

export default function WhatWeDoSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ProgramCard
        title="Product Studio"
        description="Our flagship pre-idea incubator program"
        imageSrc="/placeholder.svg?height=160&width=300"
        href="/product-studio"
      />

      <ProgramCard
        title="Build Blue"
        description="A 6-week program for shipping products"
        imageSrc="/placeholder.svg?height=160&width=300"
        href="/build-blue"
      />

      <ProgramCard
        title="Ship-It"
        description="Weekly working sessions for makers and creators"
        imageSrc="/placeholder.svg?height=160&width=300"
        href="/ship-it"
      />

      <ProgramCard
        title="Startup Fair"
        description="Connect with startups across the nation"
        imageSrc="/placeholder.svg?height=160&width=300"
        href="/startup-fair"
      />
    </div>
  )
}
