"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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

async function fetchProjects(): Promise<ProjectsResponse> {
  const response = await fetch('/projects-data.json');
 
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
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  
  const filteredProjects = useMemo(() => {
    if (!data?.projects) return [];
    
    const filterSets = {
      fundingSources: new Set(params.fundingSources),
      cohorts: new Set(params.cohorts),
      categories: new Set(params.categories),
    };
    
    return data.projects.filter((project) => {
      const searchQuery = params.searchQuery?.toLowerCase() || "";
      const matchesSearch = 
        searchQuery === "" || 
        project.title.toLowerCase().includes(searchQuery) ||
        project.companyName.toLowerCase().includes(searchQuery);

      const matchesFunding = 
        filterSets.fundingSources.size === 0 || 
        (project.sectionType === "funding" && filterSets.fundingSources.has(project.sectionName));

      const matchesCohort = 
        filterSets.cohorts.size === 0 || 
        (project.sectionType === "cohort" && filterSets.cohorts.has(project.sectionName));

      const matchesCategory = 
        filterSets.categories.size === 0 || 
        project.categories.some((category) => filterSets.categories.has(category));

      return matchesSearch && matchesFunding && matchesCohort && matchesCategory;
    });
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
