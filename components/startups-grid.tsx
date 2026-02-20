"use client";

import { useState } from "react";
import StartupsGridControls from "./startups/StartupsGridControls";
import StartupsGridContent from "./startups/StartupsGridContent";

export default function StartupsGrid() {
  const companies = [
    {
      name: "Ramp",
      domain: "Fintech",
      image: "/ramp.png",
    },
    {
      name: "Watershed",
      domain: "ClimateOS",
      image: "/watershed.png",
    },
    {
      name: "Courier Health",
      domain: "Patient CRM",
      image: "/courierhealth.png",
    },
    {
      name: "Applied Intuition",
      domain: "Motion AI",
      image: "/app-intuition.png",
    },
    {
      name: "Authentic",
      domain: "Insurance",
      image: "/authenticinsurance.png",
    },
    {
      name: "Pylon",
      domain: "B2B Support",
      image: "/pylon.png",
    },
    {
      name: "Windsurf",
      domain: "AI Agents",
      image: "/codeium.png",
    },
    {
      name: "Lumos",
      domain: "Autonomy",
      image: "/lumos.png",
    },
    {
      name: "Pallet",
      domain: "Logistics",
      image: "/pallet.png",
    },
    {
      name: "Thatch",
      domain: "Healthcare",
      image: "/thatch.png",
    },
    {
      name: "Comulate",
      domain: "Insurance",
      image: "/comulate.png",
    },
    {
      name: "Wave RF",
      domain: "Communication",
      image: "/waverf.png",
    },
    {
      name: "MeetYourClass",
      domain: "Social",
      image: "/meetyourclass.png",
    },
    {
      name: "random",
      domain: "random",
      image: "/random.png",
    },
  ];

  const placeholderCompanies = [
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg",
    },
    {
      name: "Company",
      domain: "Description",
      image: "/placeholder.svg",
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

  const years = [
    { year: "FALL 2024", companies: extendedCompanies },
    { year: "FALL 2025", companies: fall2025PlaceholderCompanies },
  ];

  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  function paginate(newIndex: number) {
    if (newIndex < 0 || newIndex > 1) return;
    setDirection(newIndex > pageIndex ? 1 : -1);
    setPageIndex(newIndex);
  }

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

      <StartupsGridControls
        pageIndex={pageIndex}
        years={years}
        onPaginate={paginate}
      />

      <StartupsGridContent
        pageIndex={pageIndex}
        direction={direction}
        companies={years[pageIndex].companies}
      />
    </div>
  );
}
