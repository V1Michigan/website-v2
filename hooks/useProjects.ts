"use client";

import { useQuery } from "@tanstack/react-query";
import type { Project } from "@/types/project";

interface ProjectsResponse {
  projects: Project[];
  filterOptions: {
    fundingSources: string[];
    cohorts: string[];
    categories: string[];
  };
  totalProjects: number;
  filteredCount: number;
}

interface ProjectsQueryParams {
  searchQuery: string;
  fundingSources: string[];
  cohorts: string[];
  categories: string[];
}

async function fetchProjects(params: ProjectsQueryParams): Promise<ProjectsResponse> {
  const query = new URLSearchParams();
  if (params.searchQuery) query.set("search", params.searchQuery);
  params.fundingSources.forEach((f) => query.append("funding", f));
  params.cohorts.forEach((c) => query.append("cohort", c));
  params.categories.forEach((c) => query.append("category", c));

  const response = await fetch(`/api/projects?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export function useProjects(params: ProjectsQueryParams) {
  const {
    data,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", params],
    queryFn: () => fetchProjects(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  return {
    projects: data?.projects || [],
    filterOptions: data?.filterOptions || {
      fundingSources: [],
      cohorts: [],
      categories: [],
    },
    isLoading,
    error: error as Error | null,
  };
}
