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

export interface StartupWeekLiveEvent {
  title: string
  description: string
  date: string
  startTime: string
  time: string
  location: string
  slug: string
  lumaEventId: string
}

export const startupWeekLiveEvents: StartupWeekLiveEvent[] = [
  {
    title: "Startup Week Kickoff",
    description: "Meet the founders, early employees, and builders kicking off Startup Week with V1 @ Michigan.",
    date: "2026-10-05",
    startTime: "18:00",
    time: "6:00–8:00 PM",
    location: "Blau Colloquium, 5th Floor",
    slug: "0ku8agev",
    lumaEventId: "evt-yErucMXDGauhgjB",
  },
  {
    title: "Miter x V1",
    description: "Get career and resume advice from the Miter team and learn how they are building the future of construction operations.",
    date: "2026-10-06",
    startTime: "16:30",
    time: "4:30–6:00 PM",
    location: "CCCB 0460",
    slug: "svyjpy1c",
    lumaEventId: "evt-RluSPC8PU91CdME",
  },
  {
    title: "Lumaril",
    description: "Learn how Lumaril is building the AI layer for physical production and meet the team hiring for full-time roles and internships.",
    date: "2026-10-06",
    startTime: "19:00",
    time: "7:00–9:00 PM",
    location: "CCCB 3420",
    slug: "1t4rjhrz",
    lumaEventId: "evt-22xcgij9oxSHXpJ",
  },
  {
    title: "Authentic Fireside",
    description: "Hear from Authentic about building software for specialty insurance and what they look for when hiring.",
    date: "2026-10-07",
    startTime: "18:00",
    time: "6:00–7:30 PM",
    location: "CCCB 0420",
    slug: "h3ldzjyw",
    lumaEventId: "evt-jJgNYhUWKybAiQj",
  },
  {
    title: "Air Space Intelligence (ASI)",
    description: "Learn how ASI builds AI that keeps planes moving and how they build software for airlines and the FAA.",
    date: "2026-10-08",
    startTime: "18:00",
    time: "6:00–8:00 PM",
    location: "CCCB 3460",
    slug: "qxno2kvk",
    lumaEventId: "evt-0OLn6v5ibJSx25S",
  },
  {
    title: "Dryft Fireside",
    description: "Meet the Dryft team and learn how their AI agents help manufacturers spot problems and decide what to do next.",
    date: "2026-10-09",
    startTime: "17:00",
    time: "5:00–6:30 PM",
    location: "CCCB 3460",
    slug: "etgn4d3s",
    lumaEventId: "evt-RO8hRl58SURn2Sz",
  },
  {
    title: "Scope Health",
    description: "Hear what Scope Health is building, ask questions, and celebrate the winners of the computer-use capture-the-flag challenge.",
    date: "2026-10-09",
    startTime: "19:30",
    time: "7:30–8:30 PM",
    location: "CCCB 3460",
    slug: "f100885s",
    lumaEventId: "evt-nf3hVfwTawoPvTO",
  },
]

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
    topStartups: "20+",
    // Alphabetical by company name.
    companies: [
      { name: "Advanced Spade Company", domain: "Underground Utilities", image: "/startupweek/2026/advanced-spade.svg", website: "https://www.advancedspadecompany.com/" },
      { name: "AgentMail", domain: "Email for AI Agents", image: "/startupweek/2026/agentmail.webp", website: "https://www.agentmail.to/" },
      { name: "Air Space Intelligence", domain: "Operational AI", image: "/startupweek/2026/asi.webp", website: "https://www.airspace-intelligence.com/" },
      { name: "Ambrook", domain: "Accounting & Payments", image: "/startupweek/2026/ambrook.webp", website: "https://ambrook.com/" },
      { name: "Authentic Insurance", domain: "Insurance Infrastructure", image: "/startupweek/2026/authentic.webp", website: "https://authenticinsurance.com/" },
      { name: "Dryft", domain: "Manufacturing AI", image: "/startupweek/2026/dryft.webp", website: "https://dryft.ai/" },
      { name: "Khosla Ventures", domain: "Venture Capital", image: "/startupweek/2026/khosla-ventures.webp", website: "https://www.khoslaventures.com/" },
      { name: "Latent Variables", domain: "Applied AI Research", image: "/startupweek/2026/latent-variables.webp", website: "https://latentvariables.com/" },
      { name: "Lumaril Corporation", domain: "Industrial Automation", image: "/startupweek/2026/lumaril.webp", website: "https://lumaril.com/" },
      { name: "Miter", domain: "Construction HR & Payroll", image: "/startupweek/2026/miter.webp", website: "https://www.miter.com/" },
      { name: "Monaco", domain: "Sales & CRM", image: "/startupweek/2026/monaco.webp", website: "https://www.monaco.com/" },
      { name: "Phoebe", domain: "Home Care Scheduling", image: "/startupweek/2026/phoebe.webp", website: "https://www.phoebe.work/" },
      { name: "Rational", domain: "AI Accounting", image: "/startupweek/2026/rational.webp", website: "https://rational.to/" },
      { name: "Scope Health", domain: "Clinical AI", image: "/startupweek/2026/scope.webp", website: "https://scopehealth.com/" },
      { name: "SpaceXAI", domain: "Frontier AI Lab", image: "/startupweek/2026/spacexai.webp", website: "https://x.ai/" },
      { name: "Tavus", domain: "Conversational Video AI", image: "/startupweek/2026/tavus.webp", website: "https://www.tavus.io/" },
    ],
  },

]
