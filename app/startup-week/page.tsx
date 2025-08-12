"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/app/startup-week/hero-section";
import StartupsGrid from "./startups-grid";
import EventSections from "@/components/events-sections";
import FAQSection from "@/components/faq-section";
import TeamSection from "@/components/team-section";
import V1TeamRoster from "@/components/v1-team-roster";

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

  const teamMembers = [
    { image: "/headshots/anant.jpeg", name: "Anant Garg", linkedinUrl: "https://www.linkedin.com/in/anant-g/" },
    { image: "/headshots/maya.jpg", name: "Maya Malik", linkedinUrl: "https://www.linkedin.com/in/maya-malik-umich/" },
    { image: "/headshots/arhan.jpg", name: "Arhan Kaul", linkedinUrl: "https://www.linkedin.com/in/arhan-kaul-162884210/" },
    { image: "/headshots/vador.jpg", name: "Mihir Vador", linkedinUrl: "https://www.linkedin.com/in/mihirvador/" },
    { image: "/headshots/lance.jpg", name: "Lance Fuchia", linkedinUrl: "https://www.linkedin.com/in/lancefuchia/" },
    { image: "/headshots/leo.jpg", name: "Leo Liu", linkedinUrl: "https://www.linkedin.com/in/leoliu12/" },
    { image: "/headshots/toan.jpeg", name: "Toan Bui", linkedinUrl: "https://ww.linkedin.com/in/toanmbui" },
    { image: "/headshots/diego.png", name: "Diego Paredes", linkedinUrl: "https://www.linkedin.com/diegokaipareades/" },
    { image: "/headshots/phoenix.png", name: "Phoenix Sheppard", linkedinUrl: "https://www.linkedin.com/in/phoenixsheppard/" },
    { image: "/headshots/sri.jpeg", name: "Sri MK", linkedinUrl: "https://www.linkedin.com/in/mksriram/" },
    { image: "/headshots/alison.jpg", name: "Alison Roeda", linkedinUrl: "https://www.linkedin.com/in/alison-roeda/" },
    { image: "/headshots/amy.jpg", name: "Amy Liu", linkedinUrl: "https://www.linkedin.com/in/amyliiu/" },
    { image: "/headshots/alexis.jpeg", name: "Alexis Gu", linkedinUrl: "https://www.linkedin.com/in/alexis-gu-7bb77129a/" },
    { image: "/headshots/joshua.jpg", name: "Joshua Lee", linkedinUrl: "https://www.linkedin.com/in/mildjosh" },
    { image: "/headshots/casey.jpg", name: "Casey Feng", linkedinUrl: "https://www.linkedin.com/in/caseyfeng" },
    { image: "/headshots/mihir.jpg", name: "Mihir Arya", linkedinUrl: "https://www.linkedin.com/in/mihir-s-arya/" },
    { image: "/headshots/daniel.jpeg", name: "Daniel Liu", linkedinUrl: "https://www.linkedin.com/in/daniel-lliu/" }
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
