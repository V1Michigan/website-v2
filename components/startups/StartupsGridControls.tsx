import { ChevronLeft, ChevronRight } from "lucide-react";

interface StartupsGridControlsProps {
  pageIndex: number;
  years: Array<{ year: string; companies: any[] }>;
  onPaginate: (newIndex: number) => void;
}

export default function StartupsGridControls({
  pageIndex,
  years,
  onPaginate,
}: StartupsGridControlsProps) {
  return (
    <div className="text-center pt-8 pb-6 relative z-10 flex items-center justify-center space-x-8">
      <button
        className={`p-2 ${
          pageIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
        }`}
        onClick={() => onPaginate(pageIndex - 1)}
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
        onClick={() => onPaginate(pageIndex + 1)}
        aria-label="Next year"
        disabled={pageIndex === 1}
      >
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}
