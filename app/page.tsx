import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TimelineSection from "@/components/timeline-section"
import WhatWeDoSection from "@/components/what-we-do-section"
import ProgramSection from "@/components/program-section"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FEF9F5]">
      <Header />
      <HeroSection />

      <TimelineSection
        title={
          <>
            What <em>we</em> do.
          </>
        }
      >
        <WhatWeDoSection />
      </TimelineSection>

      <TimelineSection title="Product Studio">
        <ProgramSection
          title="Product Studio"
          description="Want to build something ambitious but don't know where to start? Product Studio, our flagship pre-idea incubator program is designed to guide you in a builder journey from concept to creation."
          imageSrc="/prod-studio-video.mp4?height=600&width=1200"
          buttonText="See what they have built"
          buttonLink="https://v1michigan.com/projects"
          posterSrc="/prod-studio-landing.png"
        />
      </TimelineSection>

      <TimelineSection title="Build Blue">
        <ProgramSection
          title="Build Blue"
          description="In this 8-week building sprint, we provide you with the resources to go from 1 to n. VC connections? Marketing network? Engineering Talent? We have it all."
          imageSrc="/build-blue-video.mp4?height=600&width=1200"
          buttonText="Learn more"
          buttonLink="https://v1michigan.com/ship-it"
          posterSrc="/build-blue-img.png"
        />
      </TimelineSection>

      <TimelineSection title="Ship-Its">
        <ProgramSection
          title="Ship-Its"
          description="Ship-It Sundays are weekly working sessions designed for makers, creators, and innovators. It's an opportunity to build, showcase, and potentially collaborate on projects in a supportive and creative environment."
          imageSrc="/ship-it-video.mp4?height=600&width=1200"
          buttonText="Learn more"
          buttonLink="https://v1michigan.com/ship-it"
          posterSrc="/ship-it-image.png"
        />
      </TimelineSection>

      <TimelineSection title="Startup Fair">
        <ProgramSection
          title="Startup Fair"
          description="Do you want to join a rocket-ship startup in the real world? V1 Startup Fair is the only place you need to be."
          imageSrc="/startup-fair-video.mp4?height=600&width=1200"
          buttonText="Learn more"
          buttonLink="https://startupfair.v1michigan.com/"
          posterSrc="/startup-fair-image.png"
        />
      </TimelineSection>

      <Footer />
    </div>
  )
}
