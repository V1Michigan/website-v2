export interface StartupCompany {
  name: string
  domain: string
  image: string
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
      { name: "Ramp", domain: "Fintech", image: "/ramp.png?height=32&width=32&text=R" },
      { name: "Watershed", domain: "ClimateOS", image: "/watershed.png?height=32&width=32&text=W" },
      { name: "Courier Health", domain: "Patient CRM", image: "/courierhealth.png?height=32&width=32&text=CH" },
      { name: "Applied Intuition", domain: "Motion AI", image: "/app-intuition.png?height=32&width=32&text=AI" },
      { name: "Authentic", domain: "Insurance", image: "/authenticinsurance.png?height=32&width=32&text=A" },
      { name: "Pylon", domain: "Customer Support", image: "/pylon.png?height=32&width=32&text=P" },
      { name: "Windsurf", domain: "AI Agents", image: "/codeium.png?height=32&width=32&text=C" },
      { name: "Lumos", domain: "Autonomy", image: "/lumos.png?height=32&width=32&text=L" },
      { name: "Pallet", domain: "Logistics", image: "/pallet.png?height=32&width=32&text=P" },
      { name: "Thatch", domain: "Healthcare", image: "/thatch.png?height=32&width=32&text=T" },
      { name: "Comulate", domain: "Insurance", image: "/comulate.png?height=32&width=32&text=C" },
      { name: "Wave RF", domain: "Communication", image: "/waverf.png?height=32&width=32&text=W" },
    ],
  },
  {
    year: "FALL 2025",
    topStartups: "30+",
    companies: [
      { name: "Kodiak Robotics", domain: "Robotics", image: "/kodiak.jpeg?height=32&width=32" },
      { name: "Harmonic.ai", domain: "Information", image: "/harmonic_logo.svg?height=32&width=32" },
      { name: "Forus", domain: "Healthcare", image: "/forus.png?height=32&width=32" },
      { name: "Pylon", domain: "Customer Support", image: "/pylon.jpeg?height=32&width=32" },
      { name: "Tavus", domain: "AI Research", image: "/tavus.png?height=32&width=32" },
      { name: "Usul", domain: "Defense", image: "/Usul.png?height=32&width=32" },
      { name: "Embedder (YC S25)", domain: "Developer Tools", image: "/embedder.png?height=32&width=32" },
      { name: "Probook", domain: "Contracting", image: "/probook.png?height=32&width=32" },
      { name: "Rox", domain: "Productivity", image: "/rox.jpg?height=32&width=32" },
      { name: "Dirac", domain: "Assembly", image: "/dirac.png?height=32&width=32" },
      { name: "OpenYield", domain: "Financial Services", image: "/openyield.jpeg?height=32&width=32" },
      { name: "Footprint", domain: "Identity", image: "/fp_logo.png?height=32&width=32" },
      { name: "Thrive", domain: "Artificial Intelligence", image: "/thrive.jpg?height=32&width=32" },
      { name: "Wave RF", domain: "Communication", image: "/wave-rf.png?height=32&width=32" },
      { name: "OnDesk", domain: "Content", image: "/ondesk_logo.jpeg?height=32&width=32" },
      { name: "Pursuit", domain: "Government Contracts", image: "/pursuit.jpeg?height=32&width=32" },
    ],
  },
]
