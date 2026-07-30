"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/startup-hero-section";
import StartupsGrid from "@/components/startups-grid";
import EventSections from "@/components/events-sections";
import FAQSection from "@/components/faq-section";
import TeamSection from "@/components/team-section";
import { PostHogPageView } from "@/components/posthog-provider";
import { startupWeekEvents, startupWeekTeam } from "@/data/startup-week";

export default function StartupWeekPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <PostHogPageView />
      <Header />
      <HeroSection />
      <StartupsGrid />

      <div className="relative mx-auto bg-[#FAF7F2]">
        <div className="pointer-events-none absolute -top-[80px] left-0 right-0 z-40 h-[120px] bg-gradient-to-b from-transparent via-[#FAF7F2]/60 to-[#FAF7F2]" />
        <EventSections events={startupWeekEvents} />
      </div>

      <section className="mt-10 w-full bg-[#FAF7F2]">
        <FAQSection />
      </section>

      <section className="w-full bg-[#FAF7F2]">
        <div className="w-full px-6">
          <TeamSection teamMembers={startupWeekTeam} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
