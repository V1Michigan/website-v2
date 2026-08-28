"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const cohorts = [
  {
    name: "Winter 2026 Product Studio Cohort",
    shortName: "W26",
    label: "Winter 2026",
  },
  {
    name: "Fall 2025 Product Studio Cohort",
    shortName: "F25",
    label: "Fall 2025",
  },
  {
    name: "Winter 2025 Product Studio Cohort",
    shortName: "W25",
    label: "Winter 2025",
  },
  {
    name: "Fall 2024 Product Studio Cohort",
    shortName: "F24",
    label: "Fall 2024",
  },
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
  const [activeCohort, setActiveCohort] = useState<CohortName>(cohorts[0].name);
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
    if (!data || (projectsByCohort.get(activeCohort)?.length ?? 0) > 0) {
      return;
    }

    const firstPopulatedCohort = cohorts.find(
      (cohort) => (projectsByCohort.get(cohort.name)?.length ?? 0) > 0,
    );

    if (firstPopulatedCohort) {
      setActiveCohort(firstPopulatedCohort.name);
    }
  }, [activeCohort, data, projectsByCohort]);

  const activeProjects = projectsByCohort.get(activeCohort) ?? [];
  const activeCohortDetails = cohorts.find(
    (cohort) => cohort.name === activeCohort,
  );

  return (
    <section className="relative overflow-hidden bg-[#191919] px-5 py-16 text-[#FAF7F2] sm:px-8 md:py-20 lg:px-12">
      <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full border-2 border-dashed border-[#E5AC61]/65" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-96 w-96 rounded-full border border-[#E5AC61]/55" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 font-inter text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">
            Made at Michigan
          </p>
          <h2 className="font-instrument text-5xl font-normal leading-none sm:text-6xl md:text-7xl">
            Built in Product Studio
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-inter text-sm leading-6 text-[#CEC9C5] sm:text-base">
            Products imagined, designed, and shipped by V1 student builders.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2" aria-label="Product Studio cohorts">
          {cohorts.map((cohort) => {
            const isActive = cohort.name === activeCohort;
            const count = projectsByCohort.get(cohort.name)?.length ?? 0;

            return (
              <button
                key={cohort.name}
                type="button"
                onClick={() => setActiveCohort(cohort.name)}
                className={`rounded-full border px-4 py-2 font-inter text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-yellow-400 bg-yellow-400 text-[#191919]"
                    : "border-white/20 bg-white/5 text-[#FAF7F2] hover:border-yellow-400/70 hover:bg-white/10"
                }`}
                aria-pressed={isActive}
              >
                {cohort.shortName}
                {!isPending && count > 0 && (
                  <span className={`ml-2 ${isActive ? "text-[#191919]/60" : "text-[#CEC9C5]"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mb-6 flex items-end justify-between border-b border-white/15 pb-4">
          <p className="font-inter text-sm font-medium text-[#CEC9C5]">
            {activeCohortDetails?.label}
          </p>
          {!isPending && !error && (
            <p className="font-inter text-xs uppercase tracking-[0.16em] text-[#8F8B88]">
              {activeProjects.length} {activeProjects.length === 1 ? "project" : "projects"}
            </p>
          )}
        </div>

        {isPending && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-300/20 bg-red-950/20 px-6 py-12 text-center font-inter text-sm text-red-100">
            Projects could not be loaded right now.
          </div>
        )}

        {!isPending && !error && activeProjects.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center font-inter text-sm text-[#CEC9C5]">
            No projects have been published for this cohort yet.
          </div>
        )}

        {!isPending && !error && activeProjects.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {activeProjects.map((project) => (
              <article
                key={project.id}
                className="group flex min-h-44 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#242424] p-5 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-yellow-400/60"
              >
                <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-black/20">
                  <Image
                    src={project.logo}
                    alt=""
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </div>
                <h3 className="font-inter text-sm font-semibold leading-snug text-[#FAF7F2]">
                  {project.name}
                </h3>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
