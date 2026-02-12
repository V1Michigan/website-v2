"use client";

import dynamic from "next/dynamic";

const RotatingCubeExperience = dynamic(() => import("@/components/rotating-cube"), {
  ssr: false,
});

export default function ArhanPage() {
  return <RotatingCubeExperience />;
}
