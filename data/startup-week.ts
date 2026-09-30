export interface StartupCompany {
  name: string
  domain: string
  image: string
  website: string
}

export interface StartupWeekYear {
  year: string
  topStartups: string
  topStudents?: string
  companies: StartupCompany[]
}

export interface StartupWeekEvent {
  title: string
  description: string
  image: string
}

export interface StartupWeekTeamMember {
  image: string
  name: string
  linkedinUrl: string
}

export const startupWeekEvents: StartupWeekEvent[] = [
  {
    title: "Tech Talks",
    description: "Attend tech talks on engineering at a startup, founding a company, career advice, and more.",
    image: "/tech-talks.png",
  },
  {
    title: "1:1 Chats",
    description: "Get the opportunity to be matched with startups for 1:1 chats with founders and recruiters.",
    image: "/recruiters.png",
  },
  {
    title: "Interactive Activities",
    description: "Participate in hands-on workshops, coding challenges, and collaborative problem-solving sessions.",
    image: "/acts.png",
  },
]

export const startupWeekTeam: StartupWeekTeamMember[] = [
  { image: "/headshots/anant.jpeg", name: "Anant Garg", linkedinUrl: "https://www.linkedin.com/in/anant-g/" },
  { image: "/headshots/maya.jpg", name: "Maya Malik", linkedinUrl: "https://www.linkedin.com/in/maya-malik-umich/" },
  { image: "/headshots/arhan.jpg", name: "Arhan Kaul", linkedinUrl: "https://www.linkedin.com/in/arhan-kaul-162884210/" },
  { image: "/headshots/vador.jpg", name: "Mihir Vador", linkedinUrl: "https://www.linkedin.com/in/mihirvador/" },
  { image: "/headshots/lance.jpg", name: "Lance Fuchia", linkedinUrl: "https://www.linkedin.com/in/lancefuchia/" },
  { image: "/headshots/leo.jpg", name: "Leo Liu", linkedinUrl: "https://www.linkedin.com/in/leoliu12/" },
  { image: "/headshots/toan.jpeg", name: "Toan Bui", linkedinUrl: "https://www.linkedin.com/in/toanmbui" },
  { image: "/headshots/diego.png", name: "Diego Paredes", linkedinUrl: "https://www.linkedin.com/in/diegokaipareades/" },
  { image: "/headshots/phoenix.jpg", name: "Phoenix Sheppard", linkedinUrl: "https://www.linkedin.com/in/phoenixsheppard/" },
  { image: "/headshots/sri.jpeg", name: "Sri MK", linkedinUrl: "https://www.linkedin.com/in/mksriram/" },
  { image: "/headshots/alison.jpg", name: "Alison Roeda", linkedinUrl: "https://www.linkedin.com/in/alison-roeda/" },
  { image: "/headshots/amy.jpg", name: "Amy Liu", linkedinUrl: "https://www.linkedin.com/in/amyliiu/" },
  { image: "/headshots/alexis.jpeg", name: "Alexis Gu", linkedinUrl: "https://www.linkedin.com/in/alexis-gu-7bb77129a/" },
  { image: "/headshots/joshua.jpg", name: "Joshua Lee", linkedinUrl: "https://www.linkedin.com/in/mildjosh" },
  { image: "/headshots/casey.jpg", name: "Casey Feng", linkedinUrl: "https://www.linkedin.com/in/caseyfeng" },
  { image: "/headshots/mihir.jpg", name: "Mihir Arya", linkedinUrl: "https://www.linkedin.com/in/mihir-s-arya/" },
  { image: "/headshots/daniel.jpeg", name: "Daniel Liu", linkedinUrl: "https://www.linkedin.com/in/daniel-lliu/" },
]

export const startupWeekYears: StartupWeekYear[] = [
  {
    year: "FALL 2024",
    topStartups: "12",
    topStudents: "250+",
    companies: [
      { name: "Ramp", domain: "Fintech", image: "/ramp.png?height=32&width=32&text=R", website: "https://ramp.com/" },
      { name: "Watershed", domain: "ClimateOS", image: "/watershed.png?height=32&width=32&text=W", website: "https://watershed.com/" },
      { name: "Courier Health", domain: "Patient CRM", image: "/courierhealth.png?height=32&width=32&text=CH", website: "https://www.courierhealth.com/" },
      { name: "Applied Intuition", domain: "Motion AI", image: "/app-intuition.png?height=32&width=32&text=AI", website: "https://www.appliedintuition.com/" },
      { name: "Authentic", domain: "Insurance", image: "/authenticinsurance.png?height=32&width=32&text=A", website: "https://authenticinsurance.com/" },
      { name: "Pylon", domain: "Customer Support", image: "/pylon.png?height=32&width=32&text=P", website: "https://usepylon.com/" },
      { name: "Windsurf", domain: "AI Agents", image: "/codeium.png?height=32&width=32&text=C", website: "https://windsurf.com/" },
      { name: "Lumos", domain: "Autonomy", image: "/lumos.png?height=32&width=32&text=L", website: "https://www.lumos.com/" },
      { name: "Pallet", domain: "Logistics", image: "/pallet.png?height=32&width=32&text=P", website: "https://www.pallet.com/" },
      { name: "Thatch", domain: "Healthcare", image: "/thatch.png?height=32&width=32&text=T", website: "https://thatch.com/" },
      { name: "Comulate", domain: "Insurance", image: "/comulate.png?height=32&width=32&text=C", website: "https://www.comulate.com/" },
      { name: "Wave RF", domain: "Communication", image: "/waverf.png?height=32&width=32&text=W", website: "https://www.wave-rf.com/" },
    ],
  },
  {
    year: "FALL 2025",
    topStartups: "30+",
    companies: [
      { name: "Kodiak Robotics", domain: "Robotics", image: "/kodiak.jpeg?height=32&width=32", website: "https://kodiak.ai/" },
      { name: "Harmonic.ai", domain: "Information", image: "/harmonic_logo.svg?height=32&width=32", website: "https://harmonic.ai/" },
      { name: "Forus", domain: "Healthcare", image: "/forus.png?height=32&width=32", website: "https://forus.com/" },
      { name: "Pylon", domain: "Customer Support", image: "/pylon.jpeg?height=32&width=32", website: "https://usepylon.com/" },
      { name: "Tavus", domain: "AI Research", image: "/tavus.png?height=32&width=32", website: "https://www.tavus.io/" },
      { name: "Usul", domain: "Defense", image: "/Usul.png?height=32&width=32", website: "https://usul.com/" },
      { name: "Embedder (YC S25)", domain: "Developer Tools", image: "/embedder.png?height=32&width=32", website: "https://www.embedder.com/" },
      { name: "Probook", domain: "Contracting", image: "/probook.png?height=32&width=32", website: "https://www.probook.ai/" },
      { name: "Rox", domain: "Productivity", image: "/rox.jpg?height=32&width=32", website: "https://www.rox.com/" },
      { name: "Dirac", domain: "Assembly", image: "/dirac.png?height=32&width=32", website: "https://www.diracinc.com/" },
      { name: "OpenYield", domain: "Financial Services", image: "/openyield.jpeg?height=32&width=32", website: "https://www.openyld.com/" },
      { name: "Footprint", domain: "Identity", image: "/fp_logo.png?height=32&width=32", website: "https://onefootprint.com/" },
      { name: "Thrive", domain: "Artificial Intelligence", image: "/thrive.jpg?height=32&width=32", website: "https://www.thriveholdings.com/" },
      { name: "Wave RF", domain: "Communication", image: "/wave-rf.png?height=32&width=32", website: "https://www.wave-rf.com/" },
      { name: "OnDesk", domain: "Content", image: "/ondesk_logo.jpeg?height=32&width=32", website: "https://www.itsondesk.com/" },
      { name: "Pursuit", domain: "Government Contracts", image: "/pursuit.jpeg?height=32&width=32", website: "https://www.pursuit.us/" },
    ],
  },
  {
    year: "FALL 2026",
    topStartups: "20",
    // Editorial order by public scale, backing, and reputation; not a revenue ranking.
    companies: [
      { name: "SpaceXAI", domain: "Frontier AI Lab", image: "/startupweek/2026/spacexai.webp", website: "https://x.ai/" },
      { name: "Khosla Ventures", domain: "Venture Capital", image: "/startupweek/2026/khosla-ventures.webp", website: "https://www.khoslaventures.com/" },
      { name: "Air Space Intelligence", domain: "Aerospace", image: "/startupweek/2026/asi.webp", website: "https://www.airspace-intelligence.com/" },
      { name: "Tavus", domain: "Human Computing", image: "/startupweek/2026/tavus.webp", website: "https://www.tavus.io/" },
      { name: "Advanced Spade Company", domain: "Underground Utilities", image: "/startupweek/2026/advanced-spade.svg", website: "https://www.advancedspadecompany.com/" },
      { name: "Monaco", domain: "Sales & CRM", image: "/startupweek/2026/monaco.webp", website: "https://www.monaco.com/" },
      { name: "Ambrook", domain: "Financial", image: "/startupweek/2026/ambrook.webp", website: "https://ambrook.com/" },
      { name: "AgentMail", domain: "Email Infrastructure", image: "/startupweek/2026/agentmail.webp", website: "https://www.agentmail.to/" },
      { name: "Miter", domain: "Construction", image: "/startupweek/2026/miter.webp", website: "https://www.miter.com/" },
      { name: "Authentic Insurance", domain: "Insurance", image: "/startupweek/2026/authentic.webp", website: "https://authenticinsurance.com/" },
      { name: "Phoebe", domain: "Home Care", image: "/startupweek/2026/phoebe.webp", website: "https://www.phoebe.work/" },
      { name: "Dryft", domain: "Manufacturing", image: "/startupweek/2026/dryft.webp", website: "https://dryft.ai/" },
      { name: "Lumaril Corporation", domain: "Industrial", image: "/startupweek/2026/lumaril.webp", website: "https://lumaril.com/" },
      { name: "Scope Health", domain: "Clinical", image: "/startupweek/2026/scope.webp", website: "https://scopehealth.com/" },
      { name: "Rational", domain: "Accounting", image: "/startupweek/2026/rational.webp", website: "https://rational.to/" },
      { name: "Latent Variables", domain: "Applied AI Research", image: "/startupweek/2026/latent-variables.webp", website: "https://latentvariables.com/" },
    ],
  },

]
