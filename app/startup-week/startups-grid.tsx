"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StartupCard from "../../components/startup-card";

export default function StartupsGrid() {
  const companies = [
    {
      name: "Ramp",
      domain: "Fintech",
      image: "/ramp.png?height=32&width=32&text=R",
    },
    {
      name: "Watershed",
      domain: "ClimateOS",
      image: "/watershed.png?height=32&width=32&text=W",
    },
    {
      name: "Courier Health",
      domain: "Patient CRM",
      image: "/courier.png?height=32&width=32&text=CH",
    },
    {
      name: "Applied Intuition",
      domain: "Motion AI",
      image: "/app-intuition.png?height=32&width=32&text=AI",
    },
    {
      name: "Authentic",
      domain: "Insurance",
      image: "/authentic.png?height=32&width=32&text=A",
    },
    {
      name: "Pylon",
      domain: "B2B Support",
      image: "/pylon.png?height=32&width=32&text=P",
    },
    {
      name: "Codium",
      domain: "AI Agents",
      image: "/codeium.png?height=32&width=32&text=C",
    },
    {
      name: "Lumos",
      domain: "Autonomy",
      image: "/lumos.png?height=32&width=32&text=L",
    },
  ];

  const placeholderCompanies = [
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg?height=32&width=32&text=?",
    },
  ];

  const extendedCompanies = [
    ...companies,
    ...placeholderCompanies,
    ...placeholderCompanies,
    ...placeholderCompanies,
    ...placeholderCompanies,
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="w-full bg-[#191919] min-h-screen text-white relative overflow-hidden">
      {/* Decorative curved lines */}
      <svg
        className="absolute -top-[15%] left-0"
        width="180"
        height="280"
        viewBox="0 0 180 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="-20"
          cy="80"
          r="198"
          stroke="#E5AC61"
          strokeWidth="4"
          strokeDasharray="16 16"
        />
      </svg>
      <svg
        className="absolute -top-[28%] right-0"
        width="135"
        height="423"
        viewBox="0 0 135 423"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="211.5"
          cy="211.5"
          r="210.5"
          stroke="#E5AC61"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="absolute top-[42%] right-0 -translate-y-1/2 "
        width="551"
        height="752"
        viewBox="0 0 551 752"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="376"
          cy="376"
          r="235"
          stroke="#E5AC61"
          strokeWidth="4"
          strokeDasharray="16 16"
        />
      </svg>
      <svg
        className="absolute top-[55%] left-0 "
        width="584"
        height="762"
        viewBox="0 0 584 762"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="203" cy="381" r="320" stroke="#E5AC61" strokeWidth="2" />
      </svg>

      {/* <svg
        className="absolute bottom-0 right-0"
        width="267"
        height="357"
        viewBox="0 0 267 357"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="178.5" cy="178.5" r="176.5" stroke="#E5AC61" strokeWidth="4" strokeDasharray="16 16" />
      </svg> */}

      {/* Header */}
      <div className="text-center pt-8 pb-6 relative z-10">
        <p className="text-sm text-[#FEF9F5] font-inter mb-6">FALL 2025</p>
        {/* Stats Section */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <button className="p-2">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center justify-center space-x-12">
            <div className="text-center">
              <div className="text-6xl text-[#FEF9F5] font-instrument font-light mb-1">
                12
              </div>
              <div className="text-xs text-center font-inter font-normal text-[#CEC9C5] leading-normal">
                Top startups
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl text-[#FEF9F5] font-instrument font-light mb-1">
                250+
              </div>
              <div className="text-xs text-center font-inter font-normal text-[#CEC9C5] leading-normal">
                Top students
              </div>
            </div>
          </div>
          <button className="p-2">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
      {/* Company Grid */}
      <div className="flex justify-center relative z-10">
        <div className=" min-w-[28rem] px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-h-[75vh] overflow-hidden">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-4 gap-4 mb-6"
            >
              {extendedCompanies.map((company, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <StartupCard
                    image={company.image}
                    name={company.name}
                    domain={company.domain}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay (tighter and sharper) */}
      <div className="absolute bottom-0 left-0 right-0 h-[280px] sm:h-[320px] lg:h-[360px] bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent pointer-events-none z-30"></div>
    </div>
  );
}
