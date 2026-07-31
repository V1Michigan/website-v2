"use client"

import { motion } from "framer-motion"
import StartupCard from "./startup-card"
import type { StartupCompany } from "@/data/startup-week"

interface StartupCompanyGridProps {
  companies: StartupCompany[]
  direction: number
  pageIndex: number
}

const containerVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

export default function StartupCompanyGrid({ companies, direction, pageIndex }: StartupCompanyGridProps) {
  return (
    <motion.div
      key={`companies-${pageIndex}`}
      custom={direction}
      variants={containerVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="grid grid-cols-4 gap-4 mb-6"
    >
      {companies.map((company) => (
        <motion.div key={`${pageIndex}-${company.name}`} variants={itemVariants}>
          <StartupCard image={company.image} name={company.name} domain={company.domain} />
        </motion.div>
      ))}
    </motion.div>
  )
}
