import { Suspense } from "react"
import ProjectDirectoryContent from "./ProjectDirectoryContent"

export const metadata = {
  title: "Projects | V1 at Michigan",
  description: "A curated showcase of innovative startups and products built by founders and teams from V1 ecosystem.",
}

export default function ProjectDirectoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">Loading...</div>}>
      <ProjectDirectoryContent />
    </Suspense>
  )
}
