"use client";

import dynamic from "next/dynamic";

const NorthStarExperience = dynamic(() => import("@/components/north-star/north-star-experience"), {
  ssr: false,
});

export default function Page() {
  return <NorthStarExperience />;
}


