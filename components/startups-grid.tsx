"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StartupCompanyGrid from "./startup-company-grid";
import { startupWeekYears } from "@/data/startup-week";

export default function StartupsGrid() {
  const [pageIndex, setPageIndex] = useState(1);
  const [direction, setDirection] = useState(0);

  function paginate(newIndex: number) {
    if (newIndex < 0 || newIndex > 1) return;
    setDirection(newIndex > pageIndex ? 1 : -1);
    setPageIndex(newIndex);
  }

  const currentYear = startupWeekYears[pageIndex];

  return (
    <div id="startup-directory" className="w-full bg-[#191919] min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] text-white relative overflow-hidden">
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
            {currentYear.year}
          </p>
          <div className="flex items-center justify-center space-x-12 mb-4">
            <div className="text-center">
              <div className="text-6xl text-[#FEF9F5] font-instrument font-light mb-1">
                {currentYear.topStartups}
              </div>
              <div className="text-xs font-inter font-normal text-[#CEC9C5] leading-normal">
                  Top startups
              </div>
            </div>
            {currentYear.topStudents && (
              <div className="text-center">
                <div className="text-6xl text-[#FEF9F5] font-instrument font-light mb-1">
                  {currentYear.topStudents}
                </div>
                <div className="text-xs font-inter font-normal text-[#CEC9C5] leading-normal">
                  Top students
                </div>
              </div>
            )}
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
        <div className="min-w-[28rem] px-3 sm:px-4 md:px-6 lg:px-8 mb-10">
          <div >
            <div className="relative">
              <div className="relative">
                <StartupCompanyGrid
                  companies={currentYear.companies}
                  direction={direction}
                  pageIndex={pageIndex}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-[280px] sm:h-[320px] lg:h-[360px] bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent pointer-events-none z-30"></div> */}
    </div>
  );
}
