import type React from "react";

export const metadata = {
  title: "Projects - V1 at Michigan",
  description: "A curated showcase of innovative startups and products built by founders and teams from the V1 ecosystem.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
