"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Project } from "@/types/project";
import { filterProjects } from "@/lib/notion";

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

async function fetchProjects(): Promise<ProjectsResponse> {
  const response = await fetch(`/projects-data.json`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await response.json();
  const projects = data.projects as Project[];

  return {
    projects,
    filterOptions: data.filterOptions,
    totalProjects: projects.length,
    filteredCount: projects.length,
  };
}

export function useProjects(params: ProjectsQueryParams) {
  const {
    data,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
  
  const filteredProjects = useMemo(() => {
    return filterProjects(data?.projects || [], params);
  }, [data, params]);
  
  const filteredCount = useMemo(() => filteredProjects.length, [filteredProjects]);
  
  return {
    projects: filteredProjects,
    filterOptions: data?.filterOptions || {
      fundingSources: [],
      cohorts: [],
      categories: [],
    },
    totalProjects: data?.projects?.length || 0,
    filteredCount,
    isLoading,
    error: error as Error | null,
  };
}
