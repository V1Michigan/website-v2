import { NextRequest, NextResponse } from "next/server";
import type { Project } from "@/types/project";

const productStudioCohorts = [
  "Winter 2026 Product Studio Cohort",
  "Fall 2025 Product Studio Cohort",
  "Winter 2025 Product Studio Cohort",
  "Fall 2024 Product Studio Cohort",
] as const;

const cohortOrder = new Map<string, number>(
  productStudioCohorts.map((cohort, index) => [cohort, index]),
);

export async function GET(request: NextRequest) {
  try {
    const projectsDataUrl = new URL("/projects-data.json", request.nextUrl.origin);
    const response = await fetch(projectsDataUrl, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Notion project data");
    }

    const data = (await response.json()) as { projects?: Project[] };
    const projects = (data.projects ?? [])
      .filter(
        (project) =>
          project.sectionType === "cohort" &&
          productStudioCohorts.includes(
            project.sectionName as (typeof productStudioCohorts)[number],
          ),
      )
      .map((project) => ({
        id: project.id,
        name: project.companyName,
        logo: project.imageSrc,
        cohort: project.sectionName,
      }))
      .sort((a, b) => {
        const cohortDifference =
          (cohortOrder.get(a.cohort) ?? Number.MAX_SAFE_INTEGER) -
          (cohortOrder.get(b.cohort) ?? Number.MAX_SAFE_INTEGER);

        return cohortDifference || a.name.localeCompare(b.name);
      });

    return NextResponse.json(
      { projects },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error) {
    console.error("Failed to load Product Studio projects", error);

    return NextResponse.json(
      { error: "Failed to load Product Studio projects" },
      { status: 500 },
    );
  }
}
