"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/app/startup-fair/hero-section";
import StartupsGrid from "./startups-grid";
import EventSections from "@/components/events-sections";
import FAQSection from "@/components/faq-section";
import TeamSection from "@/components/team-section";

export default function ProjectDirectoryPage() {
  const events = [
    {
      title: "Tech Talks",
      description:
        "Attend tech talks on engineering at a startup, founding a company, career advice, and more.",
      image: "/tech-talks.png?height=120&width=160&text=Tech+Talks",
    },
    {
      title: "1:1 Chats",
      description:
        "Get the opportunity to be matched with startups for 1:1 chats with founders and recruiters.",
      image: "/recruiters.png?height=120&width=160&text=Recruiter+Chats",
    },
    {
      title: "Interactive Activities",
      description:
        "Participate in hands-on workshops, coding challenges, and collaborative problem-solving sessions.",
      image: "/acts.png?height=120&width=160&text=Activities",
    },
  ];

  const faqData = [
    {
      question: "What if I already have a job for the summer?",
      answer:
        "That's great! You can still participate in Startup Week events and network with other professionals. Many of our sessions are designed to help you grow in your current role and make valuable connections for the future.",
    },
    {
      question: "When and where is this?",
      answer:
        "Startup Week takes place over 5 days in downtown San Francisco. The exact dates and venue details will be announced soon. All events will be held at easily accessible locations with public transportation options.",
    },
    {
      question: "Who is this designed for?",
      answer:
        "Startup Week is designed for early-career professionals, recent graduates, career changers, and anyone interested in the startup ecosystem. Whether you're a developer, designer, product manager, or business professional, you'll find relevant content and networking opportunities.",
    },
    {
      question: "What is V1?",
      answer:
        "V1 refers to the first version of Startup Week. This inaugural event focuses on connecting talent with innovative startups and providing insights into the startup world through workshops, panels, and networking sessions.",
    },
    {
      question: "How do I prepare?",
      answer:
        "Come with an open mind and your resume updated! We recommend researching the participating companies, preparing your elevator pitch, and thinking about what type of role or company culture interests you most. Dress code is business casual.",
    },
    {
      question: "Can my company recruit at Startup Fair?",
      answer:
        "Yes! We welcome startups and growing companies to participate as recruiters. Please reach out to our partnerships team for information about sponsorship packages and recruiting opportunities. Space is limited and allocated on a first-come, first-served basis.",
    },
    {
      question: "Got another question?",
      answer:
        "We'd love to help! Reach out to us at hello@startupweek.com or follow us on social media for the latest updates. You can also join our community Discord for real-time Q&A with organizers and other participants.",
    },
  ];

  const teamMembers = [
    "/placeholder.svg?height=40&width=40&text=1",
    "/placeholder.svg?height=40&width=40&text=2",
    "/placeholder.svg?height=40&width=40&text=3",
    "/placeholder.svg?height=40&width=40&text=4",
    "/placeholder.svg?height=40&width=40&text=5",
    "/placeholder.svg?height=40&width=40&text=6",
    "/placeholder.svg?height=40&width=40&text=7",
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <HeroSection />
      {/* Startups Grid fills viewport (component already uses min-h-screen) */}
      <StartupsGrid />

      <div className="relative max-fill  mx-auto bg-[#FAF7F2]">
        {/* Subtle fade starting above the section using site background color */}
        <div className="absolute -top-[80px] left-0 right-0 h-[120px] bg-gradient-to-b from-transparent via-[#FAF7F2]/60 to-[#FAF7F2] pointer-events-none z-40"></div>
        {/* Event Cards Section */}
        <EventSections events={events} />
      </div>
      {/* FAQ Section - full width */}
      <section className="w-full mt-10 bg-[#FAF7F2]">
        <div className="w-full">
          <FAQSection />
        </div>
      </section>

      {/* Team Section - full width */}
      <section className="w-full bg-[#FAF7F2]">
        <div className="w-full px-6">
          <TeamSection teamMembers={teamMembers} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
