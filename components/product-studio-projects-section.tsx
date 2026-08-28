"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StartupCompanyGrid from "@/components/startup-company-grid";

const cohorts = [
  { name: "Fall 2024 Product Studio Cohort", label: "FALL 2024" },
  { name: "Winter 2025 Product Studio Cohort", label: "WINTER 2025" },
  { name: "Fall 2025 Product Studio Cohort", label: "FALL 2025" },
  { name: "Winter 2026 Product Studio Cohort", label: "WINTER 2026" },
] as const;

type CohortName = (typeof cohorts)[number]["name"];

interface ProductStudioProject {
  id: string;
  name: string;
  logo: string;
  cohort: CohortName;
}

async function fetchProductStudioProjects() {
  const response = await fetch("/api/product-studio-projects");

  if (!response.ok) {
    throw new Error("Failed to load projects");
  }

  return (await response.json()) as { projects: ProductStudioProject[] };
}

export default function ProductStudioProjectsSection() {
  const [pageIndex, setPageIndex] = useState(cohorts.length - 1);
  const [direction, setDirection] = useState(0);
  const hasSelectedInitialCohort = useRef(false);
  const { data, isPending, error } = useQuery({
    queryKey: ["product-studio-projects"],
    queryFn: fetchProductStudioProjects,
    staleTime: 5 * 60 * 1000,
  });

  const projectsByCohort = useMemo(() => {
    const grouped = new Map<CohortName, ProductStudioProject[]>();

    for (const cohort of cohorts) {
      grouped.set(cohort.name, []);
    }

    for (const project of data?.projects ?? []) {
      grouped.get(project.cohort)?.push(project);
    }

    return grouped;
  }, [data]);

  useEffect(() => {
    if (!data || hasSelectedInitialCohort.current) {
      return;
    }

    hasSelectedInitialCohort.current = true;

    if ((projectsByCohort.get(cohorts[pageIndex].name)?.length ?? 0) > 0) {
      return;
    }

    const newestPopulatedIndex = [...cohorts]
      .map((cohort, index) => ({
        index,
        count: projectsByCohort.get(cohort.name)?.length ?? 0,
      }))
      .reverse()
      .find((cohort) => cohort.count > 0)?.index;

    if (newestPopulatedIndex !== undefined) {
      setPageIndex(newestPopulatedIndex);
    }
  }, [data, pageIndex, projectsByCohort]);

  function paginate(newIndex: number) {
    if (newIndex < 0 || newIndex >= cohorts.length) return;
    setDirection(newIndex > pageIndex ? 1 : -1);
    setPageIndex(newIndex);
  }

  const currentCohort = cohorts[pageIndex];
  const currentProjects = projectsByCohort.get(currentCohort.name) ?? [];
  const companies = currentProjects.map((project) => ({
    name: project.name,
    image: project.logo,
    domain: "",
  }));

  return (
    <div
      id="project-directory"
      className="w-full bg-[#191919] min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] text-white relative overflow-hidden"
    >
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
        className="absolute top-[42%] right-0 -translate-y-1/2"
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
        className="absolute top-[55%] left-0"
        width="584"
        height="762"
        viewBox="0 0 584 762"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="203" cy="381" r="320" stroke="#E5AC61" strokeWidth="2" />
      </svg>

      <div className="text-center pt-8 pb-6 relative z-10 flex items-center justify-center space-x-8">
        <button
          className={`p-2 ${pageIndex === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
          onClick={() => paginate(pageIndex - 1)}
          aria-label="Previous cohort"
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex flex-col items-center">
          <p className="text-sm text-[#FEF9F5] font-inter mb-2">
            {currentCohort.label}
          </p>
          <div className="flex items-center justify-center space-x-12 mb-4">
            <div className="text-center">
              <div className="text-6xl text-[#FEF9F5] font-instrument font-light mb-1">
                {isPending ? "—" : currentProjects.length}
              </div>
              <div className="text-xs font-inter font-normal text-[#CEC9C5] leading-normal">
                Past projects
              </div>
            </div>
          </div>
        </div>

        <button
          className={`p-2 ${
            pageIndex === cohorts.length - 1 ? "opacity-30 cursor-not-allowed" : ""
          }`}
          onClick={() => paginate(pageIndex + 1)}
          aria-label="Next cohort"
          disabled={pageIndex === cohorts.length - 1}
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex justify-center relative z-10">
        <div className="min-w-[28rem] px-3 sm:px-4 md:px-6 lg:px-8 mb-10">
          {error ? (
            <p className="py-12 text-center font-inter text-sm text-[#CEC9C5]">
              Projects could not be loaded right now.
            </p>
          ) : !isPending && companies.length === 0 ? (
            <p className="py-12 text-center font-inter text-sm text-[#CEC9C5]">
              No projects have been published for this cohort yet.
            </p>
          ) : (
            <StartupCompanyGrid
              companies={companies}
              direction={direction}
              pageIndex={pageIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
}
