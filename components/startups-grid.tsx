"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StartupCard from "./startup-card";

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
      image: "/courierhealth.png?height=32&width=32&text=CH",
    },
    {
      name: "Applied Intuition",
      domain: "Motion AI",
      image: "/app-intuition.png?height=32&width=32&text=AI",
    },
    {
      name: "Authentic",
      domain: "Insurance",
      image: "/authenticinsurance.png?height=32&width=32&text=A",
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
    {
      name: "Pallet",
      domain: "Logistics",
      image: "/pallet.png?height=32&width=32&text=P",
    },
    {
      name: "Thatch",
      domain: "Healthcare",
      image: "/thatch.png?height=32&width=32&text=T",
    },
    {
      name: "Comulate",
      domain: "Insurance",
      image: "/comulate.png?height=32&width=32&text=C",
    },
    {
      name: "Wave RF",
      domain: "Communication",
      image: "/waverf.png?height=32&width=32&text=W",
    },
    {
      name: "MeetYourClass",
      domain: "Social",
      image: "/meetyourclass.png?height=32&width=32&text=M",
    },
    {
      name: "random",
      domain: "random",
      image: "/random.png?height=32&width=32&text=M",
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

  const fall2025PlaceholderCompanies = Array.from({ length: 20 }, () => ({
    name: "Company",
    domain: "Description",
    image: "",
    isComingSoon: true,
  }));

  const extendedCompanies = [
    ...companies,
    ...placeholderCompanies,
    ...placeholderCompanies,
    ...placeholderCompanies,
    ...placeholderCompanies,
  ];

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
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  // 0 = Fall 2024, 1 = Fall 2025
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  function paginate(newIndex: number) {
    if (newIndex < 0 || newIndex > 1) return;
    setDirection(newIndex > pageIndex ? 1 : -1);
    setPageIndex(newIndex);
  }

  const years = [
    { year: "FALL 2024", companies: extendedCompanies },
    { year: "FALL 2025", companies: fall2025PlaceholderCompanies },
  ];

  return (
    <div className="w-full bg-[#191919] min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] text-white relative overflow-hidden">
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
      <div className="text-center pt-8 pb-6 relative z-10 flex items-center justify-center space-x-8">
        <button
          className={`p-2 ${
            pageIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
          }`}
          onClick={() => paginate(pageIndex - 1)}
          aria-label="Previous year"
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex flex-col items-center">
          <p className="text-sm text-[#FEF9F5] font-inter mb-2">
            {years[pageIndex].year}
          </p>
          <div className="flex items-center justify-center space-x-12 mb-4">
            <div className="text-center">
              <div className="text-6xl text-[#FEF9F5] font-instrument font-light mb-1">
                12
              </div>
              <div className="text-xs font-inter font-normal text-[#CEC9C5] leading-normal">
                Top startups
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl text-[#FEF9F5] font-instrument font-light mb-1">
                250+
              </div>
              <div className="text-xs font-inter font-normal text-[#CEC9C5] leading-normal">
                Top students
              </div>
            </div>
          </div>
        </div>

        <button
          className={`p-2 ${
            pageIndex === 1 ? "opacity-30 cursor-not-allowed" : ""
          }`}
          onClick={() => paginate(pageIndex + 1)}
          aria-label="Next year"
          disabled={pageIndex === 1}
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Company Grid with animation */}
      <div className="flex justify-center relative z-10">
        <div className="min-w-[28rem] px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-h-[75vh] overflow-hidden">
            <div className="relative">
              <motion.div
                key={pageIndex}
                custom={direction}
                variants={containerVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="grid grid-cols-4 gap-4 mb-6"
              >
                {years[pageIndex].companies.map((company, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <StartupCard
                      image={company.image}
                      name={company.name}
                      domain={company.domain}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Coming Soon Overlay for Fall 2025 */}
              {pageIndex === 1 && (
                <div className="absolute inset-x-0 top-0 flex justify-center pt-8 pointer-events-none z-10">
                  <div className="bg-black/70 backdrop-blur-md rounded-2xl px-6 py-4 text-center border border-white/10">
                    <div className="text-xl sm:text-2xl font-instrument text-[#FEF9F5] mb-1">
                      Coming Soon
                    </div>
                    <div className="text-xs sm:text-sm font-inter text-[#CEC9C5]">
                      Amazing startups will be announced soon
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[280px] sm:h-[320px] lg:h-[360px] bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent pointer-events-none z-30"></div>
    </div>
  );
}
